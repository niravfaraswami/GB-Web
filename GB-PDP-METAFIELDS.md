# GutBasket PDP Metafields Reference

Master testword added list of metafield definitions used across all GutBasket product templates (`fermentation-kit-leo`, `fermentation-kit-refactor`, `baking`, `cultures`, `prebiotic`, `spice-refill`).

This is the source-of-truth for metafield setup. Configure these in Shopify Admin → **Settings → Custom data → Products** (and the **Variants** subsection for per-variant).

## Why metafields vs section settings

A few rules of thumb:

- **Section settings** for layout/copy that varies per *template* but is the same across all products using that template. Lives in the template JSON or the customizer.
- **Metafields** for product-specific data — pricing badges, capacity, theme accent, cross-sell list, hero copy that's unique per SKU.
- **Variant metafields** for variant-specific data — pack tag, "best for" copy, variant illustration.

The Leo refactor sections read metafields when present and fall back to section setting defaults when not. New gb-* shared sections currently rely entirely on section settings (no metafields) for v1 simplicity. Migrate to metafields when content patterns stabilize.

---

## Per-product metafields (namespace: `custom`)

### Theme & accent

| Key | Type | Used by | Notes |
|---|---|---|---|
| `theme_accent` | Single line text | All templates | Hex color, used for `--kit-color`. Default `#C24528` (orange). |
| `theme_accent_dark` | Single line text | All templates | Hex, `--kit-color-dark`. Default `#8E2E1A`. |
| `theme_accent_soft` | Single line text | All templates | Hex, `--kit-color-soft`. Default `#FCE5DE`. |

**Suggested per-product family values**:

| Product | accent | accent_dark | accent_soft |
|---|---|---|---|
| Fermentation kits (Kanji, Achaar, Aam Panna, Kimchi, Vegetable, All-in-One) | `#C24528` | `#8E2E1A` | `#FCE5DE` |
| Baking (yeast, improver, gluten) | `#FF7300` | `#E66800` | `#FFE4D1` |
| Cultures | `#D4A24C` | `#A8801A` | `#F8E9C2` |
| Prebiotic powder | `#15BA97` | `#0F8C72` | `#CDEDE3` |
| Spice refill | `#FF7300` | `#E66800` | `#FFE4D1` |

### Hero (used by all templates via `leo-hero` section)

| Key | Type | Notes |
|---|---|---|
| `hero_tagline` | Single line text | Below product title in hero |
| `discount_badge` | Single line text | Text shown in hero badge (now hidden by Leo template, but Leo refactor's reuse keeps it readable) |
| `rating` | Decimal (0–5) | Rating row, e.g. 4.8 |
| `review_count` | Integer | Review count for stars row |
| `bought_today` | Integer | "X people bought this today" |
| `coupon_text` | Single line text | Promo bar text |
| `coupon_code` | Single line text | Promo code shown in pill |
| `help_note` | Single line text | Below variant grid |
| `hero_trust_strip` | List of single line text | Trust strip items (used as fallback for the per-text trust slots in hero) |

### Variant / pack

| Key | Type | Notes |
|---|---|---|
| `jar_capacity` | Single line text | "2L", "1L" — shown in companion-link helper |
| `capacity` | Single line text | Synonym for jar_capacity (older fermentation-kit field) |
| `jar_size_chart_image` | File reference | Modal image for jar size chart |
| `companion_size_product` | Product reference | Other-size product (e.g. 1L variant points at 2L) |

### Cross-sell

| Key | Type | Notes |
|---|---|---|
| `cross_sell_products` | List of product references | Up to 3 (or 4 in some templates). Shown in cross section. |

### Section-specific (existing leo refactor only)

These exist on the Leo refactor template's metaobject lists. Not needed for the new gb-* templates yet.

| Key | Type | Notes |
|---|---|---|
| `featured_reviews` | List of metaobject `kit_review` | UGC review cards |
| `featured_faqs` | List of metaobject `kit_faq` | FAQ items |
| `featured_steps` | List of metaobject `kit_step` | How-to-make steps |
| `featured_components` | List of metaobject `kit_component` | What's-inside box |
| `featured_trust_cards` | List of metaobject `kit_trust_card` | Trust strip metaobjects |
| `featured_quick_benefits` | List of metaobject `kit_quick_benefit` | Quick benefits |
| `featured_comparison_rows` | List of metaobject `kit_comparison_row` | Stacks rows |
| `featured_reels` | List of metaobject `kit_reel` | UGC video reels |
| `featured_outcomes_stats` | List of metaobject `kit_stat_pair` | First-30 stat pairs |
| `featured_science_cards` | List of metaobject `kit_science_card` | Airlock spotlight metaobjects |
| `featured_timeline_steps` | List of metaobject `kit_timeline_step` | Health timeline metaobjects |
| `featured_consumables` | List of metaobject `kit_consumable` | Inside-the-kit metaobjects |
| `featured_science_stats` | List of metaobject `kit_science_stat` | Science checkerboard metaobjects |
| `featured_consumption_methods` | List of metaobject `kit_consumption_method` | Consumption metaobjects |
| `featured_recipe_tags` | List of metaobject `kit_recipe_tag` | Recipe pills |

### Utility

| Key | Type | Used by | Notes |
|---|---|---|---|
| `how_to_make_video` | File reference (video) | leo-how-to-make | Demo video; falls back to section setting |
| `recipe_banner_image` | File reference (image) | leo-recipes | Banner image |
| `recipe_count` | Single line text | leo-recipes | "7" |
| `short_name` | Single line text | leo-recipes | Used as `recipe_h_label` fallback |

---

## Per-variant metafields (namespace: `custom`)

| Key | Type | Notes |
|---|---|---|
| `tag` | Single line text | Pill on variant card (e.g. "TOP SELLER", "BEST VALUE") |
| `best_for` | Single line text | "BEST FOR Beginners / Families / Regular Drinkers" |
| `variant_illustration` | File reference (image) | Image shown inside variant card; defaults to variant.image |

---

## Setup steps

For the temp store right now, the minimum metafields to make the Leo PDPs and the 4 new gb- templates render correctly:

1. **Theme accent (3 metafields)** — set per product so each kit family carries its own color. Use the suggested values above.
2. **`hero_tagline`** — one-line product tagline. Templates fall back to a generic default.
3. **`rating`, `review_count`, `bought_today`** — populate to enable the rating row and "X people bought today" line. Without these, those rows are hidden.
4. **`cross_sell_products`** — pick 3–4 products for the cross-sell row. Optional fallback collection setting on each template.
5. **`coupon_text`, `coupon_code`** — optional promo bar.

For variant-level metafields, set per variant on multi-variant products:
- `tag` — top-seller / best-value badges
- `best_for` — short use-case copy

---

## Migration path (v2)

When content patterns stabilize across the 4 new templates, candidates to promote from section settings → metafields:

- **`gb-card-grid` cards** → metaobject `gb_feature_card` (icon + label + heading + description), per-product list reference
- **`gb-comparison` rows** → metaobject `gb_cmp_row` (label + per-column text + marks), per-product list reference
- **`gb-week-timeline` weeks** → metaobject `gb_week` (day_label + heading + description), per-product list reference
- **`gb-step-cards` steps** → metaobject `gb_step` (heading + description + image), per-product list reference

This moves content authoring from theme editor → Shopify metaobject editor, which scales better when multiple products share a template.

For now, content lives entirely in section settings + blocks (theme editor flow). v2 metaobject migration is a follow-up after the 4 templates have proven content stability.
