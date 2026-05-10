# Implementation Notes — Build Your Own Kit page (GutBasket)

> Developer handoff for porting the design reference (`gutbasket-build-your-kit.html`) into the live GutBasket Shopify theme. Written for Claude Code or any engineer picking this up cold.

---

## 1. Goal

Ship a `/pages/build-your-kit` route (or section template) that lets a customer assemble a custom fermentation kit by picking from four product groups, sees a live bundle summary, and adds everything to cart in one tap. **No section is mandatory** — they can buy 1 item or 12.

The four sections, in order:

1. **Choose your jar** — fermentation jars, kombucha jars, carboys
2. **Spice mix — what will you make?** — Kanji blends, kimchi paste, aam panna, etc.
3. **Tools & accessories** — pH strips, glass weights, airlocks, grommets, funnels, bottles
4. **Recipe books & guides** — printed books

---

## 2. Reference materials (in this project)

| File | What it gives you |
|---|---|
| `/mnt/project/gutbasket-build-your-kit.html` (reference build) | **Ground truth for layout, CSS, JS, and interaction.** Don't re-design — port. |
| `gutbasketbrandguidev1_2_2.pdf` | Brand colors, typography, voice. **Read pages on Layer 1/2/3 colors before touching CSS.** |
| `gutbasket-unified__15_.html` | The full theme shell — header, megamenu, promo bar, footer. Reuse, do not rebuild. Body content starts ~line 7463, footer ~line 12052. |
| `gutbasket-fermentation-kit.html` and other PDP templates | Existing card, button, badge, and section conventions. Match these. |
| `Product_template_mapping.xlsx` | Which products live in which collection / section. Source of truth for the four section feeds. |
| `build_your_own_box_desktop.pdf` / `_mobile.pdf` | Original mockups the reference was built from. Cross-check spacing, copy. |

**Rule:** if the reference HTML and the PDF mockups disagree, the reference HTML wins (it's the most recent and was reviewed). If the brand guide and the reference disagree on a color or font, the brand guide wins.

---

## 3. Brand system (do not invent values)

All values are CSS custom properties at the top of the reference file's `<style>` block. Keep them as variables — do not hardcode.

### Layer 1 — Identity (surfaces and text)
```css
--ink:        #1F1F1D;  /* primary text, footer bg */
--all-in-one: #2B2218;  /* alt deep brown surface */
--cream:      #FFF9EE;  /* page bg, soft fills */
--white:      #FFFFFF;  /* card surfaces */
```

### Layer 2 — Action (CTAs only)
```css
--brand-orange:      #FF7300;
--brand-orange-dark: #E66800;  /* hover */
```
Brand orange is **CTA-only**. Do not use it for the wordmark, decorative borders, badges, or hero accents. The reference page uses it exactly twice: the desktop sticky-summary CTA and the mobile bottom-bar CTA.

### Layer 3 — Product / page accent
This page uses **Achaar Maroon** as `--kit-color`:
```css
--kit-color:      #8B1F40;
--kit-color-dark: #6E1832;
--kit-color-soft: #F5E6EC;
```
Used for: section number badges, hero `<em>` highlight, "View More" links, selected-card border, section-tag labels in the mobile sheet, savings text.

This is a deliberate match to the maroon "View More" links shown in the original mockup. Do not swap to a different SKU color without product-team sign-off.

### Typography
- **Montserrat** — display (h1, h2, totals, product card titles). 700 default, 800 hero only. Letter-spacing `-0.02em` on display.
- **DM Sans** — body, descriptions, prices.
- **DM Mono** — eyebrows, section pills, "1 SELECTED" labels, section tags in the mobile sheet. Always uppercase, letter-spacing `0.10–0.18em`.

### Spacing system
Surface alternation: white sections on cream page bg. Cards have `border-radius: 12px`, `border: 1px solid var(--border)` (`#E8E1D4`).

---

## 4. Layout overview

### Desktop (≥ 980px)
Two-column grid inside `.byok-layout`:
- **Left column** (1fr): four `.byok-section` blocks, each numbered, with a 3-up `.product-grid`. First 6 cards visible, 3 hidden under a "View More" toggle.
- **Right column** (340px): `.bundle-card` — sticky at `top: 100px`, shows the four section slots, total, savings text, ATC button, trust signals.

### Tablet/mobile (< 980px)
- `.bundle-card` is hidden (`display: none`).
- `.byok-layout` collapses to single column.
- `.product-grid` becomes a horizontal scroll carousel (`overflow-x: auto`, snap points). Each card is ~78vw wide.
- `.mobile-bundle` (the expandable bottom sheet) appears, fixed to bottom of viewport.

### Sub-768px
- Header collapses: nav hides, hamburger appears.
- Hero h1 shrinks to 26px.
- Product card images shrink, descriptions truncate at 2 lines.

---

## 5. Section product data

The four sections map to four Shopify collections (verify the handles against `Product_template_mapping.xlsx` before wiring):

| Section | Collection handle (proposed) | Card variant fields needed |
|---|---|---|
| 1. Jars | `byok-jars` | size (1L/2L/4L), wide-mouth y/n |
| 2. Spice mix | `byok-spice-mix` | pack size (5×, 10×, 20×) |
| 3. Tools & accessories | `byok-tools` | size (jar diameter), pack (1, 2, 5) |
| 4. Recipe books | `byok-books` | none (single variant) |

Ask the merchandiser to confirm collection handles. If they don't exist, create them in Shopify admin and tag the relevant products.

For each card, render: featured image, optional badge (BESTSELLER, NEW, BEST VALUE — pull from product `metafield: byok.badge`), title, short blurb (use `product.metafields.byok.short_description` — up to ~80 chars; do not truncate `product.description`), variant select if `product.variants.size > 1`, current price, compare_at_price as strikethrough.

---

## 6. Shopify wiring

### File structure (Dawn/Vintage-style theme)
```
sections/byok-builder.liquid          ← main section, contains the four blocks + sidebar + mobile sheet
templates/page.byok-builder.json      ← pins the section to the route
assets/byok-builder.css               ← all styles from the reference <style> block
assets/byok-builder.js                ← all logic from the reference <script> block
snippets/byok-product-card.liquid     ← single product card markup (reused 4×)
snippets/byok-bundle-summary.liquid   ← desktop sticky summary
snippets/byok-mobile-sheet.liquid     ← mobile bottom sheet
```

Create a page in admin with handle `build-your-kit` and assign template `page.byok-builder`. The header link in the megamenu (`BUILD YOUR KIT` — already in `gutbasket-unified__15_.html`) points at `/pages/build-your-kit`.

### Section schema (sketch)
```liquid
{% schema %}
{
  "name": "Build Your Kit",
  "settings": [
    { "type": "text", "id": "eyebrow", "label": "Hero eyebrow", "default": "CRAFT YOUR FERMENTATION SETUP" },
    { "type": "text", "id": "heading_1", "label": "Hero heading line 1", "default": "BUILD YOUR OWN" },
    { "type": "text", "id": "heading_2", "label": "Hero heading line 2 (accent)", "default": "FERMENTATION KIT" },
    { "type": "textarea", "id": "subhead", "label": "Hero subhead" }
  ],
  "blocks": [
    {
      "type": "section",
      "name": "Section",
      "limit": 4,
      "settings": [
        { "type": "text", "id": "title", "label": "Section title" },
        { "type": "text", "id": "subtitle", "label": "Section subtitle" },
        { "type": "collection", "id": "collection", "label": "Source collection" },
        { "type": "range", "id": "visible_count", "min": 3, "max": 12, "step": 3, "default": 6, "label": "Cards visible before View More" }
      ]
    }
  ],
  "presets": [{ "name": "Build Your Kit" }]
}
{% endschema %}
```

### Product card snippet (Liquid loop)
Replace the SVG image placeholders in the reference with:
```liquid
{%- assign p = product -%}
{%- assign v = product.selected_or_first_available_variant -%}

<article
  class="product-card"
  data-id="{{ p.handle }}"
  data-variant-id="{{ v.id }}"
  data-name="{{ p.title | escape }}"
  data-price="{{ v.price | money_without_currency | remove: ',' }}"
  data-compare="{{ v.compare_at_price | default: v.price | money_without_currency | remove: ',' }}"
  role="button" tabindex="0" aria-pressed="false"
>
  {%- if p.metafields.byok.badge -%}
    <span class="card-badge {{ p.metafields.byok.badge | downcase }}">{{ p.metafields.byok.badge }}</span>
  {%- endif -%}

  <span class="card-radio" aria-hidden="true"></span>

  <div class="card-image">
    {{ p.featured_image | image_url: width: 600 | image_tag: loading: 'lazy', alt: p.title }}
  </div>

  <div class="card-body">
    <h3 class="card-title">{{ p.title }}</h3>
    <p class="card-blurb">{{ p.metafields.byok.short_description | default: p.description | strip_html | truncate: 80 }}</p>

    {%- if p.variants.size > 1 -%}
      <select class="variant-select" aria-label="Choose variant for {{ p.title }}">
        {%- for variant in p.variants -%}
          <option value="{{ variant.id }}" data-price="{{ variant.price | money_without_currency | remove: ',' }}">
            {{ variant.title }} — {{ variant.price | money }}
          </option>
        {%- endfor -%}
      </select>
    {%- endif -%}

    <div class="card-price">
      {%- if v.compare_at_price > v.price -%}
        <span class="strike">{{ v.compare_at_price | money }}</span>
      {%- endif -%}
      <strong>{{ v.price | money }}</strong>
    </div>
  </div>
</article>
```

The JS already reads `data-id`, `data-name`, `data-price`, `data-compare` via `populateProductData()` — no JS changes needed if you preserve those attribute names.

### Add-to-cart wiring

Replace the `handleCheckout()` `alert()` with a real call to the Ajax cart API:
```js
async function handleCheckout() {
  const items = [];
  for (const section of Object.keys(selections)) {
    for (const id of selections[section]) {
      const card = document.querySelector(`.product-card[data-id="${id}"]`);
      const variantSelect = card.querySelector('.variant-select');
      const variantId = variantSelect ? variantSelect.value : card.dataset.variantId;
      items.push({ id: parseInt(variantId, 10), quantity: 1 });
    }
  }
  if (items.length === 0) return;

  const cta = document.getElementById('bundle-cta');
  const mobileCta = document.getElementById('mobile-bundle-cta');
  cta.disabled = mobileCta.disabled = true;
  cta.textContent = mobileCta.textContent = 'Adding…';

  try {
    const res = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ items })
    });
    if (!res.ok) throw new Error(await res.text());
    // Use whatever cart-drawer event the theme already listens for, e.g.:
    document.dispatchEvent(new CustomEvent('cart:refresh'));
    window.location.href = '/cart';
  } catch (err) {
    cta.disabled = mobileCta.disabled = false;
    cta.textContent = 'Add bundle to cart';
    mobileCta.textContent = 'Add bundle to cart';
    alert('Could not add bundle. Please try again.');
    console.error(err);
  }
}
```

If the theme already has a cart-drawer pattern (check `assets/cart.js` or similar in `gutbasket-unified__15_.html`), use that instead of `window.location.href = '/cart'` so the experience matches the rest of the site.

### Variant picker behavior

When a customer changes the variant select inside a selected card, the card's `data-variant-id`, `data-price`, and `data-compare` need to update so `updateBundle()` recomputes correctly. Add a listener on each variant select inside the card setup:
```js
const variantSelect = card.querySelector('.variant-select');
if (variantSelect) {
  variantSelect.addEventListener('change', e => {
    e.stopPropagation();   // don't toggle the card
    const opt = e.target.selectedOptions[0];
    card.dataset.variantId = opt.value;
    card.dataset.price = opt.dataset.price;
    productData[card.dataset.id].price = parseFloat(opt.dataset.price);
    if (selections[sectionFor(card)].has(card.dataset.id)) updateBundle();
  });
}
```

---

## 7. Selection state model (JS contract)

The reference uses a tiny in-memory state, no framework. Keep it that way unless the theme already standardizes on Alpine / petite-vue / something.

```js
const selections = {
  jars:  new Set(),
  spice: new Set(),
  tools: new Set(),
  books: new Set()
};

const productData = {
  // Populated from data-* attrs on each card on init
  // 'jar-1l': { name, price, compare, sectionKey }
};
```

**Section key** for a card = the parent `.byok-section`'s `data-section` attribute. The reference uses `jars | spice | tools | books`. If you change those names in Liquid, update the same four keys everywhere.

### `updateBundle()` is the single source of truth
It runs after every selection change. It must update, in order:
1. Sidebar item rows (`.bundle-item[data-bundle="…"]`)
2. Section pills (`.section-pill[data-pill="…"]` — text becomes "Optional" / "N selected")
3. Total `<span>` in sidebar and mobile bar
4. Savings text in sidebar
5. Mobile collapsed-state meta line
6. Mobile sheet header meta + sheet `<ul>` of items
7. CTA `disabled` state on both desktop and mobile buttons
8. Header cart-count badge (this can be removed once real cart logic is wired — the live cart count comes from Shopify)
9. Auto-collapse mobile sheet if `totalCount === 0`

Don't split this into multiple update functions — one updater, called from every event handler.

---

## 8. Mobile bottom sheet (the part that needs the most care)

This is the recently-added behavior that solves "how do I see what's in my bundle on mobile."

### Markup structure
```html
<div class="mobile-bundle-backdrop" id="mobile-backdrop"></div>
<div class="mobile-bundle" id="mobile-bundle" aria-hidden="true">
  <div class="mobile-bundle-handle" id="mobile-handle"></div>     <!-- drag grabber -->
  <div class="mobile-bundle-sheet" id="mobile-sheet" aria-hidden="true">
    <div class="mobile-bundle-sheet-header">…</div>
    <ul class="mobile-bundle-list" id="mobile-bundle-list"></ul>  <!-- populated by JS -->
  </div>
  <div class="mobile-bundle-row">
    <div class="mobile-bundle-info" id="mobile-toggle" role="button" tabindex="0" aria-expanded="false" aria-controls="mobile-sheet">
      <div class="mobile-bundle-info-text">…total + meta…</div>
      <div class="mobile-bundle-chevron">…</div>
    </div>
    <button class="bundle-cta" id="mobile-bundle-cta">Add bundle to cart</button>
  </div>
</div>
```

### Behavior
- **Collapsed (default)**: only `.mobile-bundle-row` is visible. `.mobile-bundle-sheet` has `max-height: 0; overflow: hidden`.
- **Expanded**: `.mobile-bundle.is-expanded` flips on, sheet animates to `max-height: 60vh; overflow-y: auto`. Backdrop fades in. Body scroll is locked (`document.body.style.overflow = 'hidden'`). Chevron rotates 180°.
- **Three close paths**: tap chevron/info area, tap drag handle, tap backdrop. All call `closeMobileSheet()`.
- **Empty-state guard**: `openMobileSheet()` no-ops if `totalCount === 0`. Tapping an empty bar feels broken otherwise.
- **Auto-collapse**: when the user removes the last item from inside the sheet, `updateBundle()` calls `closeMobileSheet()` automatically.
- **Remove button**: each sheet `<li>` has a `<button class="item-remove" data-remove-id="{handle}">×</button>`. A single delegated click listener on `#mobile-bundle-list` finds the matching card, unticks it, and calls `updateBundle()`. **Do not give each remove button its own listener** — the list is re-rendered on every update, and per-button listeners would leak.

### Key CSS gotchas
- `.mobile-bundle` has `border-radius: 16px 16px 0 0` so the rounded corners read as a sheet.
- Use `padding-bottom: calc(12px + env(safe-area-inset-bottom))` so iOS home-indicator devices don't sit the CTA on top of the gesture bar.
- The transition is `max-height 0.28s ease`. Don't transition `height: auto` — it won't animate.
- The backdrop uses `inset: 0` and `z-index: 89`; the sheet sits above at `z-index: 90`. Sticky header is `z-index: 100` — leave that as-is, the sheet does not need to cover the header.

---

## 9. Edge cases to handle

| Case | Expected behavior |
|---|---|
| User picks nothing | CTA disabled, mobile bar shows "No items selected yet", desktop sidebar shows "No selection yet" in each slot. |
| User picks 1 item from 1 section | CTA enabled, savings text hidden if there's no compare-at price discount. |
| User picks the same product twice (not allowed) | Cards are toggle-only; clicking a selected card unselects it. There is no "qty 2" state in the reference. If merchandiser wants quantity, that's a follow-up — flag and skip. |
| Product is sold out | Hide from the section, or render disabled with "Sold out" badge. Don't let the user select an unavailable variant. Use `product.available` and `variant.available`. |
| Variant changes after select | Card stays selected; price/total/savings recompute from the new variant. See variant-picker handler in §6. |
| Compare-at price < price (i.e. zero or negative savings) | Render no strikethrough, no savings line. Math is `Math.max(0, compare - price)`. |
| Section collection has < 6 products | "View More" button hides. Don't render a stub with empty cards. |
| User on slow network | Disable both CTAs and show "Adding…" while the cart-add fetch is in flight. Restore on error. |
| Window resized desktop ↔ mobile mid-session | Selections persist (they're in JS memory, not in DOM hidden state). Both summaries update from the same source. |
| Page reload | Selections are not persisted by default. **Out of scope unless asked**. If asked, use `sessionStorage` keyed to product handles, restore on `DOMContentLoaded`. |
| Cart already has items | `/cart/add.js` appends, doesn't replace. This is correct — bundle items add on top of the current cart. |

---

## 10. Acceptance criteria

Mark these off before merging.

**Visual / brand**
- [ ] Hero "FERMENTATION KIT" renders in Achaar Maroon (#8B1F40), not orange.
- [ ] Only the two ATC buttons are orange. No other orange anywhere on the page.
- [ ] Section number badges are filled circles in maroon with cream text.
- [ ] "View More" links are maroon with maroon underline.
- [ ] Selected cards show a 2px maroon border and the radio fills with maroon.
- [ ] Footer matches the rest of the site (pulled from the unified shell).

**Desktop**
- [ ] Sidebar sticks at `top: 100px` while scrolling.
- [ ] All four section slots in the sidebar show "No selection yet" by default, then the product name (or "N items · ₹X") when something is picked.
- [ ] Total updates in real time. Savings line appears only when there's a compare-at delta.
- [ ] CTA disabled when nothing is selected.

**Mobile (≤ 980px)**
- [ ] Sticky bottom bar visible at all times once the page has scrolled past the hero.
- [ ] Tapping the bar opens the sheet with the full item list, organized with section tag + name + price + remove × per item.
- [ ] Tapping the chevron, drag handle, or backdrop closes the sheet.
- [ ] Removing an item from inside the sheet updates the matching product card's selected state and recomputes totals.
- [ ] If the user removes everything, the sheet auto-collapses.
- [ ] Body doesn't scroll while the sheet is open.
- [ ] iOS Safari: no home-indicator overlap on the CTA.
- [ ] Cards in each section scroll horizontally with snap.

**Functional**
- [ ] CTA on either bar fires `/cart/add.js` with all selected variant IDs.
- [ ] Variant picker change updates the price in the sidebar/sheet without unticking the card.
- [ ] Cart drawer (or `/cart` page) shows all bundled items after add.

**Accessibility**
- [ ] Cards are keyboard-focusable (`tabindex="0"`), Enter/Space toggles selection.
- [ ] Selected state announced via `aria-pressed`.
- [ ] Mobile sheet uses `aria-expanded` / `aria-controls` / `aria-hidden` correctly.
- [ ] Remove buttons have `aria-label="Remove {product name}"`.
- [ ] Color contrast on Achaar Maroon text on cream passes WCAG AA (it does — verified at 7.6:1).

---

## 11. Out of scope (flag, don't build)

- **Quantity > 1 per item**. Reference is toggle-only.
- **Persisting selections across reloads**. Add only if requested.
- **A/B test of bundle discount tiers** ("save 10% on 3+ items, 15% on 5+"). Current savings line uses `compare_at_price` deltas only.
- **Gift-wrap or note-to-seller add-ons** at the bundle level.
- **Subscription / Recharge** integration on bundled items.
- **Analytics events**. Recommend wiring `add_to_cart` (GA4) and `Added to Cart` (Meta Pixel) with the bundle's full item list — but check what the theme already fires before adding new events.

---

## 12. Hand-off checklist

Before opening the PR:
1. Diff the produced CSS against the reference — they should be identical except for `url()` references swapped to Shopify CDN.
2. Run a Lighthouse pass on mobile. Target: ≥ 90 on Performance, 100 on Accessibility.
3. Verify the page works with the theme's existing cart drawer (if any).
4. Test with a real product that has 3+ variants to confirm the variant-picker flow.
5. Test "remove all from sheet" → sheet auto-collapses → CTAs disable.
6. Open `gutbasket-build-your-kit.html` side-by-side at the same viewport while QA'ing — visual parity is the bar.

If anything in this doc disagrees with what you find in the reference HTML, **the reference HTML wins**. Update this doc in the same PR.
