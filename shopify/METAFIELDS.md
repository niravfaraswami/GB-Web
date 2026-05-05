# Metafields & Matrixify Import — Sprout Maker PDP

Two products share `templates/product.sprout-maker.json`, each with three variants on the **Size** option (`1 Jar`, `2 Jars`, `4 Jars`).

| Product | Handle | Variants |
|---|---|---|
| Sprout Maker - 700 ML | `sprout-making-jar` | SM-700-1J, SM-700-2J, SM-700-4J |
| Sprout Maker - 1 L | `sprout-maker-1-l` | SM-1000-1J, SM-1000-2J, SM-1000-4J |

All metafields use the **`custom`** namespace.

---

## A. Product metafields

The first block re-uses keys that already exist in your Shopify store (preserved from the original Matrixify export). The second block is **new** — Matrixify will create them on first import via the `[type]` hint in the column header.

### Existing (already in your store)

| Display name | Namespace | Key | Type |
|---|---|---|---|
| Hero Tagline | `custom` | `hero_tagline` | Single line text |
| Discount Badge | `custom` | `discount_badge` | Single line text |
| Rating | `custom` | `rating` | Decimal |
| Review Count | `custom` | `review_count` | Integer |
| Bought Today | `custom` | `bought_today` | Integer |
| Days Subtitle | `custom` | `days_subtitle` | Single line text |
| Days to Ferment | `custom` | `days_to_ferment` | Single line text |
| PDP Template | `custom` | `pdp_template` | Single line text |
| Product Name Short | `custom` | `product_name_short` | Single line text |
| Short Name | `custom` | `short_name` | Single line text |
| Theme Accent | `custom` | `theme_accent` | Single line text |
| Theme Accent Dark | `custom` | `theme_accent_dark` | Single line text |
| Theme Accent Soft | `custom` | `theme_accent_soft` | Single line text |
| Content ID | `custom` | `content_id` | (left blank) |
| Kit Label Format | `custom` | `kit_label_format` | (left blank) |

### New (added by FINAL CSV)

| Display name | Namespace | Key | Type |
|---|---|---|---|
| Activity Items | `custom` | `activity_items` | List · Single line text — `<emoji>\|<text>` per item |
| Benefits Items | `custom` | `benefits_items` | List · Single line text — `<emoji>\|<label>` per item |
| Hero Trust Strip | `custom` | `hero_trust_strip` | List · Single line text — short items below ATC |
| Jar Capacity | `custom` | `jar_capacity` | Single line text — `700ml` / `1000ml` |
| Help Note | `custom` | `help_note` | Multi-line text — beside the Jar Size Chart link |

### Per-product images, video, and SVG icons (override section/block settings)

| Display name | Namespace | Key | Type | Used in |
|---|---|---|---|---|
| Comparison Left Image | `custom` | `comparison_left_image` | File reference | Comparison section — left card (cloth method) |
| Comparison Right Image | `custom` | `comparison_right_image` | File reference | Comparison section — right card (sprout maker) |
| Box / Kit Image | `custom` | `box_image` | File reference | What's in the Box section |
| How to Make Video | `custom` | `how_to_make_video` | File reference (video) | How to Make 1:1 video panel |
| Hero Benefits Icons (SVG) | `custom` | `hero_benefits_icons` | List · File references | Hero "Why this kit" 2x2 — same order as `benefits_items` |
| Benefits Icons (SVG) | `custom` | `benefits_icons` | List · File references | Quick Benefits 3-card section — same order as benefit blocks |
| Featured Reviews | `custom` | `featured_reviews` | List · Metaobject references → `kit_review` | UGC Reviews section — overrides block reviews |

Each of these is **optional**; if not set, the section falls back to its theme-editor block / section image. Set them to override per-product.

### Manual / pass-2 (product references)

These can't be filled in pass 1 because they reference other products that don't yet have IDs.

| Display name | Namespace | Key | Type |
|---|---|---|---|
| Companion Size Product | `custom` | `companion_size_product` | Product reference (700ml ↔ 1L) |
| Cross-Sell Products | `custom` | `cross_sell_products` | List · Product references — up to 3 in "Pair It With" |
| Jar Size Chart Image | `custom` | `jar_size_chart_image` | File reference (image) |

### Metaobject (for `featured_reviews`)

If you use the per-product `featured_reviews` metafield, define a metaobject in **Settings → Custom data → Metaobjects → Add definition**:

- **Type:** `kit_review`
- **Name:** Kit Review
- **Fields:**
  - `photo` — File (Image)
  - `quote` — Single line text
  - `name` — Single line text
  - `meta` — Single line text — e.g. "28, Pune · First-time sprouter"

Then create entries in **Content → Metaobjects → Kit Review** and reference them from each product's `featured_reviews` list metafield.

## B. Variant metafields

| Display name | Namespace | Key | Type |
|---|---|---|---|
| Best For | `custom` | `best_for` | Single line text — per-variant copy under "BEST FOR" label |
| Variant Tag | `custom` | `tag` | Single line text — optional badge (e.g. `TOP SELLER`, `BEST VALUE`) |

---

## C. Matrixify import — 3 steps

```
shopify/matrixify/
├── build_final_csv.py                       # Regenerator (read-only of the user CSV → enriched CSV)
├── Sprout-Maker-Shopify-Products-FINAL.csv  # ★ STEP 1 — upload this in Matrixify
└── sprout-maker-references.csv              # STEP 2 — product references (after IDs exist)
```

### Step 1 — Import products (`Sprout-Maker-Shopify-Products-FINAL.csv`)

Drop this file into **Matrixify → Import**. It mirrors your original CSV's structure (65 columns total: 58 of yours + 7 new) with all metafield values pre-filled.

It creates / updates:

- 2 products (`sprout-making-jar`, `sprout-maker-1-l`)
- 3 variants each on the `Size` option (`1 Jar`, `2 Jars`, `4 Jars`) with your existing SKUs and prices
- All 8 product images per product (preserved from your original CSV)
- 15 existing product metafields (with auto-filled defaults — overrides nothing you already had)
- 5 new product metafields (`activity_items`, `benefits_items`, `hero_trust_strip`, `jar_capacity`, `help_note`)
- 2 variant metafields (`best_for`, `tag`)
- Template Suffix is **NOT** set in the file. Set it manually under **Online Store → Products → [product] → Theme template → `product.sprout-maker`**, OR add a `Template Suffix` column with value `sprout-maker` if you prefer to script it.

Variant tags filled by the script:

| Variant | best_for | tag |
|---|---|---|
| SM-700-1J | Solo / Trial | (none) |
| SM-700-2J | Couples / Small family | TOP SELLER |
| SM-700-4J | Big families / Workplace | BEST VALUE |
| SM-1000-1J | Solo (heavy user) | (none) |
| SM-1000-2J | Families | TOP SELLER |
| SM-1000-4J | Big families / Workplace pantry | BEST VALUE |

### Step 2 — Set product references (`sprout-maker-references.csv`)

Once Step 1 completes, find the new product IDs (Shopify Admin URL or a Matrixify products export) and replace the `REPLACE_WITH_*_ID` placeholders in `sprout-maker-references.csv`. Then upload it to set:

- `custom.companion_size_product` — 700ml ↔ 1L (drives the "Looking for the {capacity} jar?" link below the variant block)
- `custom.cross_sell_products` — up to 3 products in "Pair It With" (refills, recipe book, etc.)

### Step 3 — Manual finishing in admin

1. **Jar Size Chart image** — upload to Files, then assign to each product's `custom.jar_size_chart_image` metafield (file reference).
2. **Theme template** — assign `product.sprout-maker` to both products if you didn't add a Template Suffix column.
3. **Theme Editor** — open each product, confirm hero variant grid shows three cards (1/2/4 Jars) in **one row × three columns** with prices and badges. Set the demo video on *How to Make*, upload UGC reels and review photos, point cross-sell to your refill products.
4. **Quinn (UGC reels)** — paste the Quinn widget snippet into the *Reels (Quinn UGC)* section's **Quinn embed code** HTML field. When set, it replaces the manual reel blocks. Leave blank to use manually-uploaded reel videos via blocks.
5. **Judge.me** — paste your widget snippet into the *Sprout — Judge.me* area's **Custom embed** HTML field, or rely on the default `data-id` widget that the Judge.me installer hooks.

### Block-level icon images (image_picker)

Each of these blocks now accepts an **Icon image** (image_picker) that overrides the emoji or number when set. Upload PNG/SVG icons in the Theme Editor:

- **Trust card** — `icon_image` overrides emoji
- **How-to step** — `icon_image` replaces the numbered badge
- **Quick benefit** — `icon_image` overrides emoji
- **Box component** — `icon_image` replaces the numbered badge

The hero icons (activity row + benefits 2×2) come from product metafields `activity_items` / `benefits_items` and continue to use unicode emoji prefixed in each list item (`<emoji>|<text>`). To swap to image-based icons there, convert those metafields to a metaobject with `icon` (file_reference) + `label` (text) fields.

### Regenerating the FINAL CSV

If you want to tweak metafield copy or add columns, edit the `COPY` / `SHARED` / `VARIANT_META` dicts at the top of `build_final_csv.py` and re-run:

```bash
cd shopify/matrixify
python3 build_final_csv.py
```

It re-reads `Sprout-Maker-Shopify-Products.csv` (your original) and writes a fresh `…-FINAL.csv`.

---

## D. File map (full)

```
shopify/
├── templates/
│   └── product.sprout-maker.json         # Section + default blocks/copy
├── sections/
│   └── sprout-maker-pdp.liquid           # Hero + 10 content areas, 9 block types
├── snippets/
│   └── sprout_cs_card.liquid             # Cross-sell card partial
├── assets/
│   └── sprout-maker.css                  # Scoped to [data-kit="sprouts"]
├── matrixify/
│   ├── build_final_csv.py
│   ├── Sprout-Maker-Shopify-Products-FINAL.csv
│   └── sprout-maker-references.csv
└── METAFIELDS.md                         # this file
```
