# Seed CSVs — content brief for the project chat

Three Matrixify-shaped CSVs covering all 64 catalogue products. Pre-filled
with the family-coded `theme_accent` triple and `TODO: …` placeholders
on every empty metafield cell.

| File | Rows | Scope |
|------|------|-------|
| `seed-jars-tools.csv` | 18 | Jars & Tools — new PDP template (`jars-tools`) |
| `seed-kits.csv` | 11 | Sprout / Kanji / Kimchi / Achaar / Aam Panna / Vegetable / Ultimate / kit variants |
| `seed-refills.csv` | 35 | Refills, spice mixes, prebiotic powders, kefir cultures, recipe books, baking yeast, sanitiser, sea salt, sprout seeds, mastery course |

## Workflow

1. Hand these three CSVs to the project chat that has product context.
2. Project chat opens each file, fills in every `TODO: …` cell with real
   copy (taglines, ratings, days_to_ferment, etc.). Editing inline is fine.
3. Send the edited files back. They keep the Matrixify column headers.
4. Engineering imports the three files via Matrixify (recommended order
   below).
5. You audit the result in admin.

## Recommended import order

1. `matrixify/metafield-definitions.csv` first (one-time setup — creates
   the 6 new `custom.*` field definitions if they don't already exist)
2. `seed-refills.csv` — lowest risk, smallest file
3. `seed-kits.csv` — adds the rich kit metafields
4. `seed-jars-tools.csv` last — flips Template Suffix to `jars-tools`,
   so the page layout changes once imported

## Conventions in these files

- **Theme accent colors** are pre-filled by family. Don't change unless
  the brand designer asks.
- **TODO: …** strings mark empty fields — easy to find with Ctrl-F.
  Replace every TODO with the real value before re-importing.
- **Metaobject reference fields** (e.g. `custom.featured_reviews`)
  expect GIDs, not handles — Matrixify can resolve a list like
  `kit_review.day-3-fluffy-moong-sprouts-zero-smell, kit_review.…`
  (comma-separated handle references).
- **Product reference fields** (`cart_addon_ids`, `cross_sell_products`)
  use comma-separated handles, e.g. `kanji-making-kit, vegetable-fermentation-kit-with-glass-weights`.
- **File reference fields** (images, videos) need to be uploaded to
  Shopify Files first, then referenced by filename.

## What's covered per file

### `seed-jars-tools.csv` (15 metafield columns per row)
- Hero: `category_label`, `hero_tagline`, `bought_today`, `rating`,
  `review_count`, `discount_badge`
- Visual: `theme_accent` triple
- Features: `features_h1`, `features_intro`, `featured_quick_benefits`
  (Kit Quick Benefit metaobject list)
- Specs: `specs` JSON + `compatible_with`
- Use cases: `featured_consumption_methods` (Kit Consumption Method
  metaobject list)
- Cart drawer: `cart_addon_ids`

### `seed-kits.csv` (~40 metafield columns per row)
Full kit PDP schema — hero, accent, social proof, process timing,
trust strip, hero benefits, activity row, coupon, refill CTA, plus
every `featured_*` metaobject list and images for the comparison,
how-to-make video, recipe banner, and jar size chart.

### `seed-refills.csv` (10 metafield columns per row)
Minimal — accent, tagline, short name, social proof, cart-drawer
add-ons. These products don't have a dedicated PDP, so they only
need the metafields the cart drawer and listing pages consume.
