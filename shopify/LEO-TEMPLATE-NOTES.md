# Fermentation Kit Leo — Template Notes (v1)

Companion template to `product.fermentation-kit.json`. Used by best-selling kits where the new layout is worth the per-product content effort: **Kanji**, **Achaar**, **Aam Panna**.

## Files

| File | Purpose |
|---|---|
| `templates/product.fermentation-kit-leo.json` | Template; seeds 40 default blocks for Kanji |
| `sections/fermentation-kit-leo-pdp.liquid` | Section liquid (single section, 13 blocks of UI) |
| `assets/fermentation-kit-leo.css` | Additive Leo-only styles (loaded *after* `fermentation-kit.css`) |

The Leo template **reuses** the base fermentation-kit CSS for shared chrome (hero gallery, variant grid, ATC button, recipes, FAQ, cross-sell, judgeme, how-make video). The Leo CSS only contains the new section styles. Both files are loaded by the section.

## Section ordering (top to bottom)

```
1. Hero (with 4 SVG benefit icons + 3-tab accordion)
2. Trust strip (4 cards)
3. How To Make (video + 4 steps) — same as base
4. First 30 Days (replaces health-timeline)
5. Stacks Comparison Table (4-col, replaces myth-section)
6. Staggered Grid Includes (replaces box+ITK) + Refill card
7. UGC Reviews (replaces base reviews)
8. Science 4×2 Checkerboard (replaces zoe-section)
9. Enjoy / How to Drink (replaces eat-section)
10. Recipes
11. FAQ
12. Cross-sell
13. Judge.me
```

## Architecture: blocks vs section settings

For v1, content is **block-driven** for variable-count items and **section-setting-driven** for fixed-structure UI:

| Section | Source |
|---|---|
| Hero benefit icons | `hero_benefit` block (limit 4) |
| Hero accordion tabs | `hero_accordion_tab` block (limit 3) |
| Trust cards (4) | section settings — `trust1_h..trust4_h`, etc. |
| How-To steps | `step` block |
| First-30 timeline rows (3) | `f30_row` block |
| First-30 stat circles (3) | `f30_stat` block |
| Stacks comparison rows | `stacks_row` block (limit 8) |
| Staggered grid cards | `stag_card` block (limit 10, with `variant` field for image_only/dark/dark_photo/light/detail) |
| UGC review cards | `ugc_review` block (limit 4) |
| Science checkerboard (4 stats + 4 images) | section settings — `sci_stat1_*..sci_stat4_*` and `sci_img1..sci_img4` |
| Enjoy cards (4) | section settings — `enjoy1_*..enjoy4_*` |
| FAQs | `faq` block |
| Cross-sell | `cross_sell_product` block + `cross_collection` fallback |

Total seeded blocks for Kanji: **40 / 50 cap**.

## Per-product theming

Same as base — three CSS variables driven from product metafields:

```liquid
custom.theme_accent       → --kit-color
custom.theme_accent_dark  → --kit-color-dark
custom.theme_accent_soft  → --kit-color-soft
```

These metafields are already defined for Kanji/Achaar/Aam Panna from the base template setup; no new metafields needed for theming.

## Metafield definitions

The Leo template **does not introduce any new metafield definitions** in v1. All Leo content is wired via section settings + blocks (theme editor). The shared metafields used by Leo are the same ones the base template already reads:

```
custom.hero_tagline
custom.discount_badge
custom.rating, custom.review_count
custom.bought_today
custom.jar_capacity / custom.capacity
custom.jar_size_chart_image / custom.size_chart_image
custom.companion_size_product
custom.hero_trust_strip
custom.cross_sell_products
custom.coupon_text, custom.coupon_code
custom.help_note
custom.how_to_make_video
custom.theme_accent, theme_accent_dark, theme_accent_soft
variant.metafields.custom.tag, best_for, variant_illustration
```

**Future v2** could promote some block content (timeline rows, comparison rows, stagger cards, UGC reviews) to metaobjects so Achaar / Aam Panna inherit Kanji defaults via product-level overrides — but for v1 each kit's template defaults are duplicated via theme editor.

## Image assets needed

These slugs must be uploaded to the theme assets / Files for the Kanji defaults to render. (Achaar + Aam Panna will need their own equivalents.)

```
# Hero — uses product images directly (no slug)

# First 30 right column
kanji_s11_consumption_premeal.jpeg

# Staggered grid — 7 cards
kanji_s03_flat_lay.jpeg            (image-only hero)
kanji_airlock_dark.jpeg            (dark-photo Airlock)
kanji_s05_compare_right.jpeg       (light · 2L Glass Jar)
kanji_s07_component_spice.jpeg     (detail thumb · Spice Mix)
kanji_s07_component_boost.jpeg     (detail thumb · Ferment Boost)
kanji_s10_recipes_lifestyle.jpeg   (light · Recipe Book)
kanji_s09_step_3.jpeg              (light · Storage Lid)

# Refill card — 2 images
kanji_kit_hero.jpeg                (Refill A · full kit)
kanji_refill_pack.jpeg             (Refill B · refill only)

# UGC reviews — 3 portraits
ugc_review_1.jpeg                  (Pratik Chheda)
ugc_review_2.jpeg                  (Deshna Shah)
ugc_review_3.jpeg                  (Aishwarya Pimpley)

# Science 4×2 — 4 landscape images
kanji_science_mood.jpeg
kanji_science_energy.jpeg
kanji_science_bloating.jpeg
kanji_science_hunger.jpeg

# Enjoy cards — 4 portrait lifestyle shots
kanji_s11_consumption_morning.jpeg
kanji_s11_consumption_premeal.jpeg
kanji_s11_consumption_spritzer.jpeg
kanji_s11_consumption_cold.jpeg

# Recipe banner
kanji_s10_recipes_lifestyle.jpeg

# Hero benefit + Trust strip SVG icons (4 + 4 = 8 SVGs)
# Use 2-color SVGs with stroke + fill — recolor pass adopts kit accent.
```

The actual image bindings happen in the theme editor (`Online Store → Themes → Customize → Product → Fermentation Kit Leo — PDP`). The template JSON only seeds text content — image_picker fields can't be set via JSON without an asset reference, which is created post-upload.

## Open items / future work

- **`Section Changes/S1 Product Details/`** folder is not present on `main`. The hero markup was derived directly from `gutbasket-fermentation-kit-leo.html`. If you have separate S1 notes, drop them into `Section Changes/S1 Product Details/` and re-run any hero adjustments.
- **Achaar + Aam Panna content**: the JSON ships Kanji defaults. To activate Leo for Achaar/Aam Panna, assign the Leo template to those products and override the per-product blocks in the theme editor.
- **First-30 SVG overlay** (per `Section Changes/S4 Gut 30/first30-overlay-implementation-notes.md`): v1 uses absolutely-positioned text annotations with dot markers. The full swoop-curve SVG overlay system from the implementation notes is a v2 enhancement — wire `f30_image` to the overlay-bearing SVG variant when ready.
- **Photo-backed dark Airlock card** is supported via the `dark_photo` stag-card variant. Upload `kanji_airlock_dark.jpeg` and bind it to the `stag-2` block's image field.
- **Promote to metaobjects** (v2): for kits beyond Kanji/Achaar/Aam Panna, promote `stag_card`, `stacks_row`, `f30_row`, `ugc_review` to metaobject definitions so kit content can be assigned via product metafield references rather than per-template block duplication.

## Activating the template

1. Push this branch to Shopify (via GitHub integration or theme deploy).
2. In Shopify Admin → Online Store → Themes → Customize, go to a Kanji product page and click "Change template" → select **product.fermentation-kit-leo**.
3. In the section settings, upload the SVG icons (Hero benefits + Trust strip) and the photos for the staggered grid, UGC reviews, and Enjoy cards. The text content is pre-seeded.
4. Save.
5. Repeat per product (Achaar, Aam Panna), updating the per-product copy where the Kanji defaults need to change (live cultures, taste consistency, recipes-inside count, etc.).
