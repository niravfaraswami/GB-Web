# Matrixify upload files

CSVs for bulk-importing product metafields into Shopify via the
**Matrixify** app (or the native Shopify product CSV importer — same
column conventions). Generated against the **live product export**
on 2026-05-11; all 64 products in the catalogue are covered.

## Files

### `metafield-definitions.csv` — 6 rows · run this FIRST
Adds only the **6 genuinely-new `custom.*` product metafields** the
Jars & Tools PDP and cart drawer need. Everything else (theme accent
colors, hero tagline, rating, review count, etc.) already exists
under `custom.*` and is reused.

| Key | Type | Used by |
|-----|------|---------|
| `custom.category_label` | Single line text | Jars & Tools chip + cart-drawer line items |
| `custom.features_h1` | Single line text | Jars & Tools features heading |
| `custom.features_intro` | Multi-line text | Jars & Tools features intro |
| `custom.specs` | JSON | Jars & Tools specs table (`[[label, value], …]`) |
| `custom.compatible_with` | Multi-line text | Jars & Tools "works with" strip |
| `custom.cart_addon_ids` | List of product references | Cart drawer add-on suggestions |

Repeating content for features and use cases reuses the existing
`Kit Quick Benefit` and `Kit Consumption Method` metaobjects via
`custom.featured_quick_benefits` and `custom.featured_consumption_methods`
(both already defined in the store).

To import: Matrixify → Import → drop `metafield-definitions.csv` → Run.

### `products-jars-tools.csv` — 18 rows
Full product rows for the Jars & Tools track. Sets `Template Suffix
= jars-tools` so each product renders on `templates/product.jars-tools.json`,
plus every `gutbasket.tools.*` metafield + `gutbasket.kit_color`.

5 of 18 carry **rich seed copy** lifted from the design mockup:
- `fermentation-jar-wide-mouth-2-litre`
- `fermentation-jar-wide-mouth-4-litre`
- `a-fermentation-jars` (1L)
- `a-airlock`
- `a-glass-weight`

The other 13 carry **placeholder copy** marked `TODO:`. Layout still
renders cleanly with the placeholders.

### `products-kits.csv` — 11 rows
Metafield update for kit/refill products. Sets cart-drawer accent
(`gutbasket.kit_color/_dark/_soft`), PDP theme accent
(`custom.theme_accent/_dark/_soft`), hero strip, social proof,
process card, trust strip — all educated defaults the copywriter
can refine in admin.

| Handle | Accent | Tagline excerpt |
|--------|--------|-----------------|
| sprout-making-jar | green | "Fresh, crunchy sprouts in 2-3 days…" |
| sprout-maker-1-l | green | "1-litre sprouter for families…" |
| kanji-making-kit | wine | "Traditional Indian probiotic drink…" |
| kanji-making-kit-old-layout | wine | (legacy) |
| kanji-kit-with-glass-weight-1-liter | wine | (1L variant w/ weight) |
| kanji-kit-with-glass-weight-2-liter | wine | (2L family size) |
| kimchi-making-kit | red | "Authentic Korean fermented kimchi…" |
| probiotic-achaar-making-kit | orange | "Grandmother's brine method…" |
| probiotic-drink-making-kit (Aam Panna) | yellow | "Fermented aam panna. Cooling…" |
| ultimate-fermentation-kit | action orange | "Everything you need to ferment…" |
| vegetable-fermentation-kit-with-glass-weights | teal | "Lacto-fermented pickles…" |

### `products-accent.csv` — 35 rows
Sets only `gutbasket.kit_color/_dark/_soft` for everything else in
the catalogue (refills, prebiotic powders, cultures, recipe books,
baking yeast, sanitiser, mastery course). One column update — drives
the cart drawer's accent stripe when these items are in the cart.

| Family | Products | Accent |
|--------|----------|--------|
| Kanji refills | mega/value/starter packs, spice mix | wine `#8B1F40` |
| Achaar refills | spice mix, supplies pack, 6-batch refill | orange `#E66800` |
| Aam Panna refills | value pack, spice mix | yellow `#DDA738` |
| Kimchi refills | making paste | red `#E85C41` |
| Sprout seeds | clover/alfalfa/radish mixes | green `#3F7754` |
| Prebiotic powders | acacia, gond katira, fiber blend, inulin, nutritional yeast, moringa, ferment boost | green `#6BB048` |
| Kefir cultures | coconut, milk premium, milk standard, water | tan `#C2A77D` |
| Recipe books | kanji, kimchi, kombucha, achaar, vegetable | brown `#8E4F3C` |
| Baking | instant dry yeast | warm `#C7864A` |
| Sanitiser | jar sanitiser | red `#9D2E2E` |
| Salt | sea salt | neutral `#E5E5E0` |
| Course | kanji mastery | action `#FF7300` |

## How to import

1. Shopify admin → Apps → **Matrixify** → Import
2. Drag a CSV in
3. Pick **Update existing products by Handle** (so re-imports merge,
   not duplicate)
4. Tick **Products** under "Items to import"
5. Run

**Recommended order:**
1. `products-accent.csv` first (smallest, lowest risk, just adds
   accent metafields)
2. `products-kits.csv` next (kit metafields)
3. `products-jars-tools.csv` last (changes Template Suffix → page
   layout switches; do this when ready to flip the new PDP live)

## Metafield definitions (one-time setup)

Define these in **Settings → Custom data → Products** before the
first import. Without definitions Matrixify will still create the
metafields, but the admin UI won't show proper editors and types
won't be enforced.

### `gutbasket.tools.*` — Jars & Tools PDP

| Key | Type |
|-----|------|
| category_label | Single line text |
| kit_color, kit_color_dark, kit_color_soft | Color |
| tagline | Single line text |
| bought_today, review_count | Integer |
| rating | Single line text |
| features_h1 | Single line text |
| features_intro | Multi-line text |
| features | JSON |
| feature_icons | List of single-line text |
| specs | JSON |
| use_cases | JSON |
| use_case_icons | List of single-line text |
| compatible_with | Multi-line text |

### `gutbasket.*` — Cart drawer + global

| Key | Type |
|-----|------|
| kit_color, kit_color_dark, kit_color_soft | Color |
| cart_addon_ids | List of product references *(set in admin only)* |

### `custom.*` — Existing kit PDPs

| Key | Type |
|-----|------|
| hero_tagline, short_name, product_name_short, kit_label_format, pdp_template, discount_badge, jar_capacity, days_subtitle | Single line text |
| theme_accent, theme_accent_dark, theme_accent_soft | Color |
| rating | Single line text |
| review_count, bought_today, days_to_ferment | Integer |
| hero_trust_strip, hero_benefits_icons, benefits_icons, trust_strip_icons, step_icons | List of single-line text |

## Post-import to-dos

1. **Replace `TODO:` placeholders** on the 13 jars-tools products
   without seed copy. Search admin catalogue for `TODO:`.
2. **Set `gutbasket.cart_addon_ids`** per product — list of related
   product references the cart drawer suggests as add-ons. Must be
   done in admin (CSV can't reference products by handle for this
   metafield type).
3. **Upload product images** — CSVs deliberately omit Image Src.
4. **Refine kit copy** — `products-kits.csv` defaults are educated
   guesses (taglines, ratings, days_to_ferment). Spot-check each kit
   in admin and adjust.
5. **Verify Template Suffix flip** — opening any jars-tools product
   should now render the new PDP. If it still shows the legacy view,
   confirm the metafield import succeeded and the template file
   `templates/product.jars-tools.json` is published.
