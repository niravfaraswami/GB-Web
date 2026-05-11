# Matrixify upload files

These CSVs are meant to be imported with the **Matrixify** Shopify app
(or the native Shopify product CSV importer — the format is compatible
with both).

## What's in this folder

### `products-jars-tools.csv` — 17 Jars & Tools products
Full product rows for the new Track D catalogue with every
`gutbasket.tools.*` metafield + `gutbasket.kit_color` pre-filled.

Each row carries:
- Standard product fields (Handle, Title, Price, Compare-at, SKU,
  Vendor, Type, Tags, Status)
- `Template Suffix = jars-tools` so Shopify renders the product on
  `templates/product.jars-tools.json`
- All metafields the new PDP reads, namespaced `gutbasket.tools.*`:
  - `category_label`, `kit_color`, `kit_color_dark`, `kit_color_soft`
  - `tagline`, `bought_today`, `rating`, `review_count`
  - `features_h1`, `features_intro`
  - `features` (JSON list of `[label, desc]`)
  - `feature_icons` (list of single-line text)
  - `specs` (JSON list of `[label, value]`)
  - `use_cases` (JSON list of `[label, desc]`)
  - `use_case_icons` (list of single-line text)
  - `compatible_with`
- `gutbasket.kit_color` for the cart-drawer accent cascade

5 of the 17 products carry **rich seed copy** lifted from the design
mockup (per implementation notes §10):
- `fermentation-jar-airlock-2l`
- `fermentation-jar-airlock-1l`
- `fermentation-jar-airlock-4l` (extended from 2L copy)
- `airlock-safe-fermentation`
- `fermentation-glass-weight`

The remaining 12 carry **placeholder copy** marked `TODO:` so a
copywriter can scan the imported products and replace them in admin.
Layout still renders cleanly.

### `products-kit-color.csv` — Cart-drawer accent for existing kits
Tiny CSV that adds `gutbasket.kit_color`, `kit_color_dark`,
`kit_color_soft` to the 8 existing kit/refill products. Used by the
GB cart drawer to tint the progress bar / accent stripe based on the
last item added. Doesn't touch any other product field.

| Handle | Accent |
|--------|--------|
| sprout-making-jar | green `#3F7754` |
| sprout-maker-1-l | green `#3F7754` |
| kanji-making-kit | wine `#8B1F40` |
| kimchi-making-kit | red `#E85C41` |
| probiotic-achaar-making-kit | orange `#E66800` |
| probiotic-drink-making-kit (Aam Panna) | yellow `#DDA738` |
| ultimate-fermentation-kit | action `#FF7300` |
| vegetable-fermentation-kit-with-glass-weights | teal `#15BA97` |

## How to import (Matrixify)

1. Shopify admin → Apps → **Matrixify** → Import
2. Drag the CSV in
3. Pick **Update existing products by Handle** (so re-imports merge,
   not duplicate)
4. Tick **Products** under the "Items to import" section
5. Run

Native Shopify importer also works — Settings → Apps & sales channels
→ Import products from CSV. Same column conventions.

## Metafield definitions (one-time setup)

Before the first import, define these in **Settings → Custom data →
Products**:

| Namespace.key | Type |
|---------------|------|
| `gutbasket.tools.category_label` | Single line text |
| `gutbasket.tools.kit_color` | Color |
| `gutbasket.tools.kit_color_dark` | Color |
| `gutbasket.tools.kit_color_soft` | Color |
| `gutbasket.tools.tagline` | Single line text |
| `gutbasket.tools.bought_today` | Integer |
| `gutbasket.tools.rating` | Single line text |
| `gutbasket.tools.review_count` | Integer |
| `gutbasket.tools.features_h1` | Single line text |
| `gutbasket.tools.features_intro` | Multi-line text |
| `gutbasket.tools.features` | JSON |
| `gutbasket.tools.feature_icons` | List of single-line text |
| `gutbasket.tools.specs` | JSON |
| `gutbasket.tools.use_cases` | JSON |
| `gutbasket.tools.use_case_icons` | List of single-line text |
| `gutbasket.tools.compatible_with` | Multi-line text |
| `gutbasket.kit_color` | Color |
| `gutbasket.kit_color_dark` | Color |
| `gutbasket.kit_color_soft` | Color |
| `gutbasket.cart_addon_ids` | List of product references *(see below)* |

Without definitions Matrixify will still create the metafields, but
they'll be untyped and the admin UI won't show proper editors.

## Post-import to-dos

1. **Replace `TODO:` placeholders** on the 12 jars/tools products
   without seed copy. Search the catalogue admin for `TODO:` to find
   them all.

2. **Set `gutbasket.cart_addon_ids`** per product — list of related
   product references that the cart drawer should suggest as add-ons
   when this product is in the cart. Can't be set in this CSV because
   product references need real Shopify IDs, not handles. Quick path:
   admin → product → Metafields → Add → Reference picker.

3. **Upload product images** — the CSV doesn't include `Image Src`
   columns since those depend on your CDN URLs. Add via the standard
   Shopify product editor, or include `Image Src` columns in a
   subsequent CSV row per image.
