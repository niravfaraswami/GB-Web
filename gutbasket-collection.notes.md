# GutBasket — Collection Template (Template 12)

**Source:** `gutbasket-collection.html`
**Maps to in Shopify:** `templates/collection.json` + `sections/collection-main.liquid` (or split: `collection-hero.liquid`, `collection-grid.liquid`, `collection-cross-cta.liquid`).

This is the **Shop** content type. Filterable, sortable category landing pages — Fermentation Kits, Prebiotics, Dairy, Baking, Sprouts, etc.

---

## What this template is for

A category landing page for ~6–24 SKUs. Editorial intro at the top (hero + 3-feature strip + testimonial), then a filterable product grid with a sticky filter sidebar and a sort dropdown. Bottom of page has a cross-collection CTA card pointing to a related collection.

Feels closer to Glossier or Magic Spoon than to a default Shopify collection — editorial up top, retail down below.

The current preview demonstrates the **Fermentation Kits** collection with 8 products.

---

## File layout

Three logical zones inside `<body>`:

1. **Theme shell** — promo bar, header, footer. *Skip when porting.*
2. **Template body** — everything inside `<main>`.
3. **Inline `<script>`** — filter logic, sort logic, count computation. **Critical — the entire grid interactivity is here.**

---

## Sections inside `<main>` (in order)

| # | Section | CSS root class | Required content |
|---|---|---|---|
| 1 | Hero | `.coll-hero` | 2-column (1.4fr 1fr): left = category pill, H1 (~56px), subtitle, CTA optional; right = large square hero image / emoji block in kit-color |
| 2 | Intro features | `.coll-intro` > `.intro-grid` | 3-column grid of icon + title + paragraph cards (e.g. "5–7 day ferments", "Real live cultures", "Indian-first formulations") |
| 3 | Testimonial | `.coll-testimonial` > `.testimonial-card` | Dark card, 2 columns: left = ★★★★★ stars, italic quote, author with avatar + name + meta; right = aggregate rating number ("4.85 AVG · ALL PRODUCTS") |
| 4 | Shop | `.coll-shop` | 2-column (240px sidebar + 1fr grid). **The main interactive block.** |
| 4a | Filter sidebar | `.filter-sidebar` (sticky) | Filter title + active count, then 4 filter groups: Category (subcategory), Price (bucket), Tags, Availability. Each filter is a `.filter-check` (custom checkbox + label + count badge). |
| 4b | Grid toolbar | `.grid-toolbar` | Left: "Showing X of Y products". Right: mobile-only filter button + sort `<select>`. |
| 4c | Product grid | `.product-grid` | 3-column grid of `.prod-card`. Each card: image area (kit-color background, optional badge top-left, big emoji centre), body (rating, name, subcat, prices, "Quick Add +" button). |
| 4d | Empty state | `.grid-empty` (hidden by default) | Shown when filters return zero results. "No products match your filters." + Clear button. |
| 5 | Cross CTA | `.cross-cta-section` > `.cross-cta-card` | Dark card with eyebrow + title + desc on left, pill button on right ("Shop Prebiotics →"). Cross-sells to a related collection. |

---

## Color theming

Same three-variable system. The collection picks its color from the **collection itself** via metafield:

| Collection | `--kit-color` | `--kit-color-dark` | `--kit-color-soft` |
|---|---|---|---|
| Fermentation Kits | `#FF7300` | `#E66800` | `#FFE4D1` |
| Prebiotics | `#15BA97` | `#0F9279` | `#D5F2EA` |
| Dairy Cultures | `#E8E1D0` (cream-deeper variant) | tuned | tuned |
| Baking | `#C9A02E` (bake-improver) | `#A88420` | `#FBF4DE` |
| Sprouts | `#4F7C57` (ferment-boost green) | `#3A5C40` | `#DEEBE0` |

The current preview is themed for **Fermentation Kits (orange)**.

In Liquid:
```liquid
<style>
  :root {
    --kit-color:      {{ collection.metafields.custom.color | default: '#FF7300' }};
    --kit-color-dark: {{ collection.metafields.custom.color_dark | default: '#E66800' }};
    --kit-color-soft: {{ collection.metafields.custom.color_soft | default: '#FFE4D1' }};
  }
</style>
```

The hero uses `linear-gradient(135deg, var(--kit-color-soft) 0%, var(--white) 100%)` — same gradient pattern as the digital guide. Keep it.

---

## Data model — what to wire from Shopify

### Editorial top ("hero + intro + testimonial")

| HTML hook | Shopify source |
|---|---|
| `[data-bind="category"]` | `collection.metafields.custom.track_label` (e.g. "TRACK A · PANTRY") |
| `<h1 data-bind="title">` | `collection.title` (or `metafields.custom.editorial_headline` for a punchier version) |
| `[data-bind="subtitle"]` | `collection.description` (rich text → plain) or `metafields.custom.subtitle` |
| `[data-bind="hero-emoji"]` | `collection.image` if set, else `metafields.custom.hero_emoji` |
| `#intro-grid` features (3) | `collection.metafields.custom.intro_features` JSON: `[{icon, title, body}, ...]` |
| Testimonial fields | `collection.metafields.custom.testimonial`: `{quote, author_name, author_meta, avatar_initial, rating}` |
| `#testi-rating-num` | `collection.metafields.custom.avg_rating` |

### Filter sidebar

The filter UI is **driven from product metadata**, not from collection metafields. Each `.prod-card` carries the filterable values as `data-*` attributes:

```html
<article class="prod-card"
         data-id="achaar_kit"
         data-subcat="Probiotic kits"
         data-tags="Vegan|Gluten-free|No oil|Top seller"
         data-price="1399"
         data-bucket="₹1,000–₹2,000"
         data-rating="4.85"
         data-reviews="412"
         data-days="90"
         data-instock="1">
```

The filter checkboxes' `value` attributes match these. JS reads checked filters and toggles `.hidden` on cards that don't match.

| `data-*` attribute | Shopify source |
|---|---|
| `data-id` | `product.handle` |
| `data-subcat` | `product.metafields.custom.subcategory` (or `product.product_type`) |
| `data-tags` | `product.tags` joined with `\|`. Filter only on tags that appear in `collection.metafields.custom.filterable_tags`. |
| `data-price` | `product.price | money_without_currency | times: 100 | divided_by: 100` (raw INR amount) |
| `data-bucket` | Computed: bucket the price into "Under ₹500" / "₹500–₹1,000" / "₹1,000–₹2,000" / "₹2,000+". Use a Liquid `case` block or a snippet. |
| `data-rating` | `product.metafields.judgeme.avg_rating` (or whichever review app) |
| `data-reviews` | `product.metafields.judgeme.review_count` |
| `data-days` | `(now - product.published_at)` in days. Used for "Newest" sort. |
| `data-instock` | `product.available` → `1` or `0` |

The filter group lists themselves (`#filter-subcat`, `#filter-tags`) should be **rendered from collection.products** so they auto-update as inventory changes:

```liquid
{%- assign all_subcats = collection.products | map: 'product_type' | uniq -%}
{%- for sc in all_subcats -%}
  <label class="filter-check">
    <input type="checkbox" data-filter="subcategory" value="{{ sc }}">
    <span class="fc-box"></span>
    <span class="fc-label">{{ sc }}</span>
    <span class="fc-count" data-count-subcategory="{{ sc }}">0</span>
  </label>
{%- endfor -%}
```

The JS `computeFilterCounts()` then fills `.fc-count` automatically.

### Product cards

| HTML hook | Shopify source |
|---|---|
| `.prod-img` background-color | `product.metafields.custom.color` (per product, falls back to collection color) |
| `.prod-emoji` | `product.metafields.custom.emoji` (or `product.featured_image` if you switch to images) |
| `.prod-badge` | `product.metafields.custom.badge` (e.g. "TOP SELLER", "NEW", "BEST VALUE") |
| `.stars` | Ratings widget output (or compute from `metafields.judgeme.avg_rating`) |
| `.rcount` | `metafields.judgeme.avg_rating · (metafields.judgeme.review_count)` |
| `.prod-name` | `product.title` |
| `.prod-subcat` | `product.product_type` or `product.metafields.custom.subcategory` |
| `.prod-price-now` | `product.price | money` |
| `.prod-price-old` | `product.compare_at_price | money` (only if set) |
| `.prod-save` | Computed: `((compare_at - price) / compare_at * 100) | round`% off |
| `.prod-add` | "Quick Add +" — wires to a JS cart-add or a simple "add to cart" form |

### Cross-CTA

| HTML hook | Shopify source |
|---|---|
| `[data-bind="cross-eyebrow"]` | `collection.metafields.custom.cross_cta.eyebrow` |
| `[data-bind="cross-title"]` | `collection.metafields.custom.cross_cta.title` |
| `[data-bind="cross-desc"]` | `collection.metafields.custom.cross_cta.desc` |
| `[data-bind="cross-link"]` | `collection.metafields.custom.cross_cta.collection` reference |

---

## Typography rules used

- **Hero H1** — Montserrat 800, **56px**, `letter-spacing: -0.025em`, line-height 1.05. **Largest H1 in the system after the guide cover.**
- **Hero subtitle** — DM Sans 18px, line-height 1.55.
- **Intro feature title** — Montserrat 800, 18px.
- **Testimonial quote** — Montserrat 600, 22px, italic, with `"` curly quotes added via `::before/::after`.
- **Testimonial rating number** — Montserrat 800, 48px in `--kit-color`.
- **Filter group H** — DM Mono 10px uppercase, 0.14em tracking.
- **Filter check label** — DM Sans 13px (becomes 700 weight when checked).
- **Filter count badge** — DM Mono 11px, in a small pill.
- **Product name** — Montserrat 800, 16px, `letter-spacing: -0.015em`, line-height 1.25.
- **Product subcat** — DM Mono 10px uppercase, 0.08em tracking.
- **Product price-now** — Montserrat 800, 19px in `--kit-color-dark`.
- **Product save badge** — DM Mono 10px, on `--kit-color-soft` bg.
- **Quick Add button** — Montserrat 700, 12px uppercase, 0.06em tracking.

---

## Layout / breakpoints

- Hero container max-width: **1180px**.
- Coll-shop container max-width: **1180px**, 2-column grid `240px 1fr`, gap 40px.
- Filter sidebar: `position: sticky; top: 90px;`.
- Product grid: **3 columns** on desktop.

### Below 1024px (tablet)
- Filter sidebar drops out of grid (becomes block above the products), product grid becomes **2 columns**.

### Below 768px (mobile)
- Hero collapses to single column.
- Intro grid becomes 1 column.
- Testimonial card collapses; "AVG" sidebar moves below quote with top border instead of left border.
- Product grid stays at 2 columns (tighter gap, smaller emoji).
- **Filter sidebar transforms into a fixed-position drawer** (`position: fixed; inset: 0; z-index: 200;`) revealed by clicking the `.filter-toggle` button. Has its own sticky "Apply & Close" button at the top.

The mobile filter drawer is the trickiest part — preserve all of its CSS exactly.

---

## JS to preserve — the entire shop UX

The inline `<script>` does five things:

### 1. `applyFilters()` — core filter loop
Reads checkbox state into a `filters` object (`{subcategory: [], price: [], tags: [], instock: false}`). Loops every `.prod-card`, decides `show`/`hide` based on AND-across-categories, OR-within-category (except tags which are AND-within for "must have ALL selected tags"). Toggles `.hidden`. Updates count, empty state, and active-filter-count.

**Important detail:** tags filtering uses `f.tags.every(t => tags.includes(t))` — **all selected tags must be present**, not "any". This matches retail intent: if you check "Vegan" + "Gluten-free", you want products that are both, not either.

### 2. `clearFilters()`
Unchecks all checkboxes, calls `applyFilters()`. Wired to two buttons: the sidebar's "Clear all" link and the empty-state's "Clear all filters" button.

### 3. `applySort()`
Reads sort dropdown value, sorts the products array, re-appends in order. Five sort modes:
- `popular` — most reviews first
- `newest` — fewest days since published first
- `rating` — highest avg rating first
- `price-asc` / `price-desc`

### 4. `computeFilterCounts()`
On page load, walks every `data-count-subcategory`, `data-count-price`, `data-count-tags` element and fills it with the count of products matching that filter value. Runs once.

### 5. Event wiring
Every checkbox `change` → `applyFilters()`.
Sort `<select>` `change` → `applySort()` (wired inline as `onchange="applySort()"`).

---

## Things to NOT do when porting

- **Don't** replace the custom checkboxes (`.filter-check` / `.fc-box`) with native browser checkboxes. The custom UI matches the brand and the kit-color check state is core to the visual language.
- **Don't** offload filtering to a Shopify Search & Discovery app server-round-trip. The current client-side filter is **instant**, has no skeleton, and works because all collection products fit on one page. If a collection ever exceeds ~30 products, then revisit — but keep client-side until then.
- **Don't** drop the editorial top (hero + intro + testimonial). Generic Shopify collections jump straight to a product grid. The editorial section is what makes the collection feel like a brand experience, not a database query.
- **Don't** show product photos as cropped lifestyle squares. The current `.prod-img` is a kit-color block with a centred emoji — this is intentional and works because (a) not every SKU has photography yet, (b) it scales the brand's visual language across all SKUs uniformly, (c) it makes the kit-color theming legible at a glance.
- **Don't** put discount % badges on top of products. The "Save 30%" pill goes on the **right side of the price line** in the body, not the image. Putting it on the image makes the page look like AliExpress.
- **Don't** widen the product grid to 4 columns. 3 is the sweet spot for showing rating + name + subcat + price stack without crowding.
- **Don't** add infinite scroll. With ≤24 SKUs per collection, all-on-one-page works, and the filter UX depends on knowing the total count.
- **Don't** use `<select>` for filters. The current checkbox UI lets users see all tag/category options at a glance and combine them — switching to a single-select dropdown would gut the discovery experience.
- **Don't** lose the `Quick Add +` button. The retail intent is "scan grid, add quickly, keep browsing" — making people click into a PDP for every add kills conversion on this page type.
