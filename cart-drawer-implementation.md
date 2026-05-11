# Cart Drawer · Implementation Notes
**GutBasket Foods · v1 · Shopify**

These notes assume the prototype (`gutbasket-cart-drawer-v1.html`) is the visual spec. This doc covers how to ship it on Shopify in production.

---

## 1. Architecture overview

**Stack:** Vanilla JavaScript + Shopify Liquid + AJAX Cart API. No React/Vue.

**Why:** The brand guide locks a 3-font, 3-surface system and demands minimal complexity. The cart needs to live in your theme alongside T01–T08 PDPs without an SPA layer. Native AJAX cart hits all checkboxes — fast TTI, server is source of truth, no hydration.

**Single source of truth:** Shopify's cart (`/cart.js`). Local JS state is a mirror used for optimistic UI updates. Every mutation calls Shopify, then re-renders from the server response.

```
ATC click
   ↓
POST /cart/add.js
   ↓
fetch /cart.js (full cart object)
   ↓
re-render drawer body + footer from cart object
   ↓
fire analytics event
```

---

## 2. File structure

```
theme/
├── sections/
│   └── cart-drawer.liquid              # the wrapper, included in theme.liquid
├── snippets/
│   ├── cart-drawer-progress.liquid     # multi-tier bar (reads metafields)
│   ├── cart-drawer-line-item.liquid    # individual line item
│   ├── cart-drawer-addons.liquid       # context-aware add-on strip
│   ├── cart-drawer-upsell.liquid       # smart upsell card
│   ├── cart-drawer-empty.liquid        # empty state
│   └── cart-drawer-footer.liquid       # subtotal, CTA, express row
├── assets/
│   ├── cart-drawer.js                  # all interaction logic
│   └── cart-drawer.css                 # all styles
└── config/
    └── settings_schema.json            # admin toggles
```

The drawer is **lazy-mounted**: HTML is rendered server-side on page load but kept `display: none` until first `openCart()` call to skip layout work on initial paint.

---

## 3. Admin-driven tier configuration

Two options. **Use Option B unless you want a non-technical admin to manage tiers.**

### Option A: Metaobject (recommended for true admin control)

Create a metaobject definition: `cart_progress_tier`.

| Field key | Type | Validation |
|-----------|------|------------|
| `threshold_inr` | Integer | min 0 |
| `reward_label` | Single-line text | required, max 40 chars |
| `reward_icon` | Single-line text | emoji or one of preset keys |
| `reward_type` | Single-select | `free_shipping` / `free_gift` / `discount_code` / `message_only` |
| `linked_variant_id` | Product variant ref | optional (used for free_gift) |
| `linked_discount_code` | Single-line | optional (used for discount_code) |
| `order` | Integer | sort order |

Read in Liquid:

```liquid
{%- assign tiers = shop.metaobjects.cart_progress_tier.values | sort: 'order' -%}
{%- for t in tiers -%}
  {% comment %} render pin {% endcomment %}
{%- endfor -%}
```

Pass to JS via a `<script type="application/json" id="tier-config">` block — never inline JS variables, breaks CSP.

### Option B: Theme settings (simpler, single store)

In `config/settings_schema.json`, add a `cart_tiers` group with 3 fixed tier blocks. Lower flexibility (max 3 tiers, can't add more without code) but no metaobjects to manage. **Recommended for v1** — ship fast, migrate to metaobjects in v2 if needed.

### Reward behaviors

- **`free_shipping`** — purely UI signal. Actual shipping discount handled by an existing automatic discount in Shopify admin.
- **`free_gift`** — when threshold crossed, JS posts `/cart/add.js` with the linked variant and properties `{_gift: true, _tier: 'tier-2'}`. Server-side cart transform script (or Shopify Functions / Cart Transformer) sets line item price to 0 and locks qty=1. Remove the gift if subtotal falls back below threshold.
- **`discount_code`** — auto-apply via `/discount/CODE` redirect on checkout, OR set `cart.attributes['_pending_discount']` and apply during checkout init.
- **`message_only`** — display only, no action. For brand storytelling tiers.

### Live tier state during cart edits

Recompute on every cart change. Pseudo:

```js
const unlocked = TIERS.filter(t => cart.total_price >= t.threshold * 100);  // Shopify uses paise
const next = TIERS.find(t => cart.total_price < t.threshold * 100);
const remaining = next ? next.threshold - (cart.total_price / 100) : 0;
```

Trigger a tier unlock celebration (subtle, one-time per session) when `unlocked.length` increases — add a `.just-unlocked` class for 400ms animation.

---

## 4. Context-aware add-ons

The whole point is: **the right add-ons should appear for what's in the basket.** Implementation is product-level metafields, not a global add-on list filtered client-side.

### Metafield setup

On each product, add the metafield `gutbasket.cart_addon_ids` (type: list of product references, max 6). When a product is in the cart, those referenced products become candidate add-ons.

Liquid rendering:

```liquid
{%- comment %} Collect all add-on product IDs from items in cart {%- endcomment -%}
{%- assign addon_ids = '' -%}
{%- for item in cart.items -%}
  {%- assign related = item.product.metafields.gutbasket.cart_addon_ids.value -%}
  {%- for product in related -%}
    {%- assign addon_ids = addon_ids | append: product.id | append: ',' -%}
  {%- endfor -%}
{%- endfor -%}
```

Then deduplicate and filter out anything already in cart. Cap at 6 visible add-ons (more = scroll fatigue).

### Universal add-ons fallback

For accessories that should appear with any kit (glass weight, airlock, recipe booklet), tag them with `addon:universal` and merge into the candidate list regardless of cart contents.

### Empty-cart add-ons

When cart is empty, the strip is replaced by the empty state's bestseller cards. Don't show add-ons over empty.

---

## 5. Cart API integration

### Endpoints used

| Action | Endpoint | Method |
|--------|----------|--------|
| Read cart | `/cart.js` | GET |
| Add line | `/cart/add.js` | POST |
| Update qty | `/cart/change.js` | POST |
| Update multiple | `/cart/update.js` | POST |
| Clear | `/cart/clear.js` | POST |
| Update note/attributes | `/cart/update.js` | POST |

### Mutation pattern

Use `cart/change.js` (by line index) not `/cart/update.js` for single-line edits — atomic, no race condition with concurrent tabs.

```js
async function setQty(lineKey, qty) {
  const res = await fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: lineKey, quantity: qty })
  });
  const cart = await res.json();
  renderCart(cart);
  trackEvent('cart_qty_changed', { line_key: lineKey, qty });
}
```

### Optimistic UI with rollback

For perceived speed:

1. Update local state + re-render immediately
2. Fire API request
3. On success: re-render from server response (overwrites local)
4. On failure: re-render previous state + toast error

300–500ms responses on `/cart/change.js` are normal in India. Don't make users wait — optimistic update masks it.

### Debouncing

Qty stepper rapid clicks (++++): debounce 250ms before firing the API call. Show local count immediately, fire one request at the end.

---

## 6. Bundle line items (Build Your Own Box)

You already have a BYO flow. In the cart drawer, treat a bundle as a parent line item with indented children using line item properties.

```js
// When BYO is added:
fetch('/cart/add.js', {
  method: 'POST',
  body: JSON.stringify({
    items: [
      { id: jarVariantId,    quantity: 1, properties: { _bundle: 'byo-2025-05-11-abc' } },
      { id: spiceVariantId,  quantity: 1, properties: { _bundle: 'byo-2025-05-11-abc' } },
      { id: bookVariantId,   quantity: 1, properties: { _bundle: 'byo-2025-05-11-abc' } }
    ]
  })
});
```

In the drawer, group by `_bundle` property and render as one card with sub-rows. Remove on the parent calls `/cart/update.js` setting all `_bundle: <id>` lines to qty 0.

---

## 7. State diagram (cart lifecycle)

```
[ closed ]
    ↓ openCart()
[ opening 320ms ]
    ↓
[ open · loaded ]
    ↓ (atc | qty | remove | addon | discount)
[ open · mutating ]  ──→ optimistic render + API call
    ↓ API resolves
[ open · loaded ]
    ↓ closeCart() or overlay click or ESC
[ closing 320ms ]
    ↓
[ closed ]
```

Each transition fires an analytics event (see Section 11).

---

## 8. Kit-color cascade in the drawer

The drawer accent color (progress bar fill, line-item highlight stripe) follows the **most recently added** line item. Reasoning: it's the item the user is currently considering, and stays "live" in their head.

```js
function applyKitColor(items) {
  const last = items[items.length - 1];
  const root = document.documentElement;
  if (last && last.kit_color) {
    root.style.setProperty('--kit-color', last.kit_color);
    root.style.setProperty('--kit-color-dark', last.kit_color_dark);
    root.style.setProperty('--kit-color-soft', last.kit_color_soft);
  } else {
    root.style.setProperty('--kit-color', 'var(--action)');
  }
}
```

Read the kit colors from product metafields: `gutbasket.kit_color`, `gutbasket.kit_color_dark`, `gutbasket.kit_color_soft`. These should already exist on your 22 SKUs (the PDP system uses them).

**Mixed cart fallback:** if items span multiple tracks (e.g. Kanji + Inulin + Yeast), default to `--action` orange. Rationale: no single kit dominates; orange is the safe identity layer.

---

## 9. Accessibility checklist

| Requirement | Implementation |
|------------|----------------|
| Drawer is a modal dialog | `role="dialog"` `aria-modal="true"` `aria-labelledby="cart-title"` |
| Focus trap on open | Cycle `Tab`/`Shift+Tab` within drawer; first focusable = close button |
| ESC closes | `document.addEventListener('keydown', e => e.key === 'Escape' && closeCart())` |
| Focus return | Save `document.activeElement` before open, `.focus()` it on close |
| Screen reader announces cart changes | `<div aria-live="polite" class="visually-hidden" id="cart-sr">` updated with "Added 1 Kanji Kit. Subtotal ₹1,399." |
| Min tap target | All buttons ≥ 44×44 px (qty stepper inflated with padding) |
| Color contrast | All text on white ≥ 4.5:1; orange on cream passes for 14px+ |
| Reduced motion | `@media (prefers-reduced-motion)` disables progress bar fill transition and slide animation |

---

## 10. Mobile-specific behaviors

- **Drawer width:** `min(92vw, 420px)` between 481–768px, `100vw` below 480px (full-screen)
- **iOS safe area:** sticky footer uses `padding-bottom: max(18px, env(safe-area-inset-bottom))` for notched devices
- **Body scroll lock:** `document.body.style.overflow = 'hidden'` on open + `position: fixed` for iOS Safari bounce fix; restore scroll position on close
- **Soft keyboard:** when discount input is focused, footer stays visible because we use `100dvh` not `100vh`. Test on iOS 16+ Safari
- **Sticky ATC bar interaction:** the existing mobile sticky ATC bar on PDPs (per your brand guide) should be hidden when drawer is open (z-index conflict + visual clutter)
- **Touch on horizontal add-on scroll:** `-webkit-overflow-scrolling: touch` and `scroll-snap-type: x mandatory` — already in the prototype

---

## 11. Analytics events

Fire these via your existing GA4 / Meta Pixel / Shopify Pixel setup. Names follow Shopify's recommended e-commerce events where possible.

| Event | When | Payload |
|-------|------|---------|
| `view_cart` | drawer opens | `cart_value, item_count, items[]` |
| `add_to_cart` | item added (from anywhere, but track cart-level here) | `item_id, qty, source: 'pdp' \| 'addon' \| 'upsell' \| 'empty_state'` |
| `remove_from_cart` | line removed | `item_id, qty, line_value` |
| `addon_added` | add-on attached from drawer | `addon_id, parent_kit_id` |
| `upsell_clicked` | "Complete the set" pressed | `upsell_id, current_basket_value` |
| `tier_unlocked` | progress crosses a tier | `tier_threshold, basket_value, tier_label` |
| `discount_applied` | code accepted | `code, amount_off` |
| `discount_failed` | code rejected | `code, reason` |
| `checkout_clicked` | main CTA pressed | `cart_value, item_count, savings` |
| `express_checkout_clicked` | UPI/GPay/COD chip pressed | `method` |
| `cart_abandoned` | drawer open + idle ≥ 60s | `cart_value` |

The single highest-ROI signal: **drawer open → checkout click rate**. Track that as your primary KPI for drawer redesign success.

---

## 12. Edge cases & how to handle them

| Case | Handling |
|------|----------|
| Item goes out of stock while in cart | On drawer open, validate inventory. Disabled qty stepper, red badge `OUT OF STOCK · REMOVE`. Block checkout. |
| Discount code conflicts with auto-discount | Show modal: "Use code GUTKANJI (-₹50) or current auto-discount (-₹120)? You can only use one." |
| Free gift unlocked then user reduces qty below threshold | Auto-remove gift. Show toast: "Free gift removed — basket dropped below ₹999". Do NOT confirm — slow ask. |
| Concurrent cart edits across tabs | Listen to `storage` event on `localStorage.cart_revision`, refetch `/cart.js` on change. |
| User refreshes page mid-checkout | Drawer state is server-backed; no recovery needed. Optionally remember "drawer was open" via sessionStorage to auto-reopen. |
| Bundle children removed individually | Either: (a) lock children, only allow parent removal, or (b) allow children removal, recalc bundle pricing server-side. Recommend (a) — simpler. |
| Cart with mixed kit colors | Fallback to orange `--action` for progress bar fill (per Section 8). |
| Price changed since user added item | Re-render with current price + toast: "Price updated for Kanji Kit". |
| GST tax-inclusive display | Shopify shows inclusive by default for IN markets. Verify `cart.total_price` vs `cart.items_subtotal_price` matches your accountant's expectation. |
| User has no pincode set | Show "Add pincode for delivery date" instead of estimate. Validate via Shopify's `/cart/shipping_rates.json` or your courier's pincode API (DTDC, BlueDart, etc.). |

---

## 13. Performance targets

| Metric | Target |
|--------|--------|
| Drawer open animation | 320ms, 60fps, no jank |
| First render (server-side, hidden) | Within initial HTML payload, no async cost |
| Open → ready for interaction | < 50ms (already in DOM) |
| AJAX cart update (qty change, India 4G) | < 600ms p95 |
| Re-render after cart response | < 16ms (single frame) |
| Total drawer JS payload (gzipped) | < 8 KB |
| Total drawer CSS (gzipped) | < 6 KB |

**Tactics:**
- No external library dependencies
- Use `requestAnimationFrame` for any animation-triggered DOM writes
- Preconnect to `cdn.shopify.com` for product images
- Image lazy-load on add-ons with `loading="lazy"`
- Defer non-critical fonts (DM Mono can FOUT to system mono)

---

## 14. Testing checklist (pre-launch)

**Functional**
- [ ] Open drawer from header cart icon
- [ ] Open drawer from PDP ATC button (auto-open after add)
- [ ] Add item, change qty up/down, see progress bar move
- [ ] Remove item, undo via toast within 5s
- [ ] Add 3 add-ons, watch subtotal + progress bar update
- [ ] Apply valid discount code → see applied chip
- [ ] Apply invalid code → see error
- [ ] Cross each tier threshold → see celebration animation once
- [ ] Empty cart → see empty state with bestsellers
- [ ] Add bestseller from empty state → cart populates
- [ ] Click checkout → handoff to Shopify checkout
- [ ] Click COD chip → goes to checkout with COD pre-selected (if Shopify supports your COD app's deep link)

**Responsive**
- [ ] 1440px desktop: drawer 440px right-side
- [ ] 1024px tablet: drawer 440px right-side
- [ ] 768px tablet: drawer 92vw or 420px
- [ ] 390px mobile: drawer 100vw full-screen
- [ ] 320px mobile (iPhone SE): no horizontal overflow

**Accessibility**
- [ ] Tab cycles within drawer when open
- [ ] ESC closes drawer
- [ ] Focus returns to ATC button on close
- [ ] Screen reader announces add/remove/total changes
- [ ] All touch targets ≥ 44px

**Browser**
- [ ] Chrome (desktop + Android)
- [ ] Safari (desktop + iOS 16, 17, 18)
- [ ] Firefox
- [ ] Samsung Internet (Indian market — sizeable share)

**Performance**
- [ ] Lighthouse mobile score ≥ 90
- [ ] No layout shift when drawer opens
- [ ] Smooth 60fps during slide-in

---

## 15. Rollout plan

1. **Build behind a feature flag** — `settings.cart_drawer_v2_enabled` in theme settings, default off
2. **Internal QA** — test across all 22 SKUs, including kits, refills, BYO, Learn templates (no cart there)
3. **A/B test** — 50/50 split, 2-week minimum, ~1,500 sessions per arm for statistical significance
4. **Primary metric** — drawer open → checkout click conversion rate
5. **Secondary metrics** — AOV, addon attach rate, tier completion rate, time-to-checkout
6. **Guardrails** — checkout completion rate must not drop > 2% on the variant arm. If it does, kill the test.
7. **Roll out at 100%** — once winning, flip the flag, monitor for 7 days
8. **Document** — write a v1.3 changelog entry in your brand guide

---

## 16. v2 backlog (already discussed, not in v1)

- Per-line subscribe & save toggle (you decided no for v1 — revisit when subscription becomes a SKU strategy)
- "Save for later" wishlist (need wishlist surface elsewhere first)
- Gift wrap + gift message (seasonal — turn on for Diwali/Christmas)
- Order notes textarea (defer to checkout)
- Recently viewed items in drawer (cluttered; keep on PDP)
- Live chat / WhatsApp expert button in drawer (out of scope, but a high-conversion add)
- Multi-currency / international shipping (only when you launch outside IN)

---

## 17. Stack-specific gotchas

- **Shopify shipping calculation:** the "Free Shipping" tier signal in the drawer relies on you having an actual automatic discount in admin (`Discounts → Free Shipping for orders over ₹300`). The drawer message is UI-only; the real discount has to exist server-side or checkout won't honor it.
- **COD chip:** Shopify doesn't have a native "checkout with COD pre-selected" deep link. If you use a COD app (Releasit, GoKwik, etc.), use their JS SDK to launch checkout with COD selected. Otherwise the chip just lands on regular checkout and user picks COD there.
- **GST display:** make sure cart line totals and footer subtotal match what checkout will show. Test with a real product, not a test SKU at ₹1.
- **Express UPI chips:** Razorpay / PhonePe / GPay direct integrations need their respective SDKs. Cheapest path: keep them as visual signals that link to checkout (the actual UPI redirect happens in checkout).

---

## Open questions before development starts

1. Is the dev shop building this internally or via an agency? Affects file structure and code style decisions.
2. Are you on Shopify Plus or standard? Plus unlocks Shopify Functions (cleaner free-gift logic).
3. Current cart drawer — native theme or an app (Slide Cart, ReConvert, etc.)? Replacing one of those affects rollout.
4. Currency display preference — `₹1,399` or `Rs. 1,399`? Theme setting, but be consistent.

---

*Spec frozen for v1. Discovery questions in this doc must be answered before sprint kickoff.*
