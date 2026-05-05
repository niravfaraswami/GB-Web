# Metafields & Matrixify Import — Sprout Maker PDP

These metafields drive content for **Sprout Maker 700ml** and **Sprout Maker 1000ml**. Both products share `templates/product.sprout-maker.json` and ship with three variants each (Pack: `1 Jar`, `2 Jars`, `4 Jars`).

All metafields use the **`custom`** namespace. Configure them at:
**Settings → Custom data → Products → Add definition** (or **Variants** for variant-level fields).

---

## A. Product metafields

| # | Display name | Namespace | Key | Type | Notes |
|---|---|---|---|---|---|
| 1 | Hero tagline | `custom` | `tagline` | Single line text | Below H1 in hero |
| 2 | Save badge text | `custom` | `save_badge_text` | Single line text | e.g. `-₹400`. Top-left of gallery image. |
| 3 | Review rating | `custom` | `review_rating` | Decimal | 0.0–5.0. e.g. `4.85` |
| 4 | Review count | `custom` | `review_count` | Integer | e.g. `286` |
| 5 | Activity items | `custom` | `activity_items` | List · Single line text | Each entry: `<emoji>\|<text>` |
| 6 | Hero benefits | `custom` | `benefits_items` | List · Single line text | Each entry: `<emoji>\|<label>` |
| 7 | Hero trust strip | `custom` | `hero_trust_strip` | List · Single line text | 2–4 short items below ATC |
| 8 | Jar capacity | `custom` | `jar_capacity` | Single line text | `700ml` or `1000ml` |
| 9 | Help note | `custom` | `help_note` | Multi-line text | Beside the "Jar Size Chart →" link |
| 10 | Jar size chart image | `custom` | `jar_size_chart_image` | File reference (image) | Modal content |
| 11 | Companion size product | `custom` | `companion_size_product` | Product reference | 700ml ↔ 1000ml link below the variant block |
| 12 | Cross-sell products | `custom` | `cross_sell_products` | List · Product references | Up to 3 products in "Pair It With" |

## B. Variant metafields

| # | Display name | Namespace | Key | Type | Notes |
|---|---|---|---|---|---|
| 1 | Best for | `custom` | `best_for` | Single line text | Per-variant copy under "BEST FOR" label inside each pack card |
| 2 | Tag | `custom` | `tag` | Single line text | Optional badge above the card. e.g. `TOP SELLER`, `BEST VALUE` |

---

## C. Matrixify import (`shopify/matrixify/`)

```
matrixify/
├── build_csv.py                       # Regenerator (edit prices/copy here, then run)
├── sprout-maker-products.csv          # PASS 1 — products + variants + simple metafields
└── sprout-maker-references.csv        # PASS 2 — product references (after IDs exist)
```

### Pass 1 — Products

Upload `sprout-maker-products.csv` in **Matrixify → Import**. It creates/updates:

- 2 products (`sprout-maker-700ml`, `sprout-maker-1000ml`)
- 3 variants each on the `Pack` option (`1 Jar`, `2 Jars`, `4 Jars`) with SKUs `SM-{capacity}-{count}J`
- Template suffix set to `sprout-maker`
- All product-level metafields (tagline, save badge, review rating/count, activity items, benefits, trust strip, jar capacity, help note)
- Variant-level metafields (`best_for`, `tag`)

Pricing in the CSV is illustrative — adjust before importing:

| Product | Variant | Price | Compare-at |
|---|---|---|---|
| Sprout Maker 700ml | 1 Jar | ₹999 | ₹1,399 |
| Sprout Maker 700ml | 2 Jars | ₹1,499 | ₹1,999 |
| Sprout Maker 700ml | 4 Jars | ₹2,499 | ₹3,499 |
| Sprout Maker 1000ml | 1 Jar | ₹1,199 | ₹1,599 |
| Sprout Maker 1000ml | 2 Jars | ₹1,899 | ₹2,499 |
| Sprout Maker 1000ml | 4 Jars | ₹2,999 | ₹3,999 |

Variant tags (badge text shown above the pack card):

- `1 Jar` → no tag
- `2 Jars` → `TOP SELLER`
- `4 Jars` → `BEST VALUE`

### Pass 2 — Product references

Open `sprout-maker-references.csv` and replace the four `REPLACE_WITH_*_ID` placeholders with the real product GIDs from your store. Find them in **Matrixify → Export → Products** (the `ID` column gives `gid://shopify/Product/{numeric_id}`), or via Shopify Admin URL (`/admin/products/{numeric_id}`).

Then upload it to set:

- `custom.companion_size_product` — 700ml points to 1000ml and vice versa (powers the "Looking for the {capacity} jar?" link below the variant block)
- `custom.cross_sell_products` — up to 3 products shown in the "Pair It With" section (seed refills, recipe book, etc.)

### Regenerating the CSV

If you want to tweak pricing, copy, SKUs or add variants, edit `build_csv.py` and run:

```bash
cd shopify/matrixify
python3 build_csv.py
```

It rewrites `sprout-maker-products.csv` with proper CSV escaping for the JSON-encoded list metafields.

---

## D. After import — finishing touches

1. **Upload product images** in the Shopify admin (Matrixify can also do this via the `Image Src` column if you have hosted URLs; the CSV leaves it blank).
2. **Upload the Jar Size Chart image** (Files area), then assign it to each product's `custom.jar_size_chart_image` metafield.
3. **Theme Editor** — open each product, confirm the hero variant grid shows three cards (1/2/4 Jars) with the correct prices and badges. Set the demo video on the *How to Make* area, upload UGC reels and review photos, point cross-sell to your refill products.
4. **Judge.me** — paste your widget snippet into the section's *Custom embed* HTML field, or rely on the default `data-id` widget.

---

## E. File map (full)

```
shopify/
├── templates/
│   └── product.sprout-maker.json     # assigns the section + ships default blocks/copy
├── sections/
│   └── sprout-maker-pdp.liquid       # full PDP: hero + 10 content areas, 9 block types
├── snippets/
│   └── sprout_cs_card.liquid         # cross-sell card partial
├── assets/
│   └── sprout-maker.css              # scoped to [data-kit="sprouts"]
├── matrixify/
│   ├── build_csv.py
│   ├── sprout-maker-products.csv
│   └── sprout-maker-references.csv
└── METAFIELDS.md                     # this file
```
