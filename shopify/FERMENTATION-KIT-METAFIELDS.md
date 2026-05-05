# Fermentation Kit — Metafield & Metaobject Setup

This is the **delta** on top of the sprout-maker setup. Anything created for sprout-maker (kit_review, kit_faq, kit_step, kit_component, kit_trust_card, kit_quick_benefit, kit_comparison_row, kit_reel + the 28 shared product metafields + best_for / tag) is reused as-is. Only the items below are new.

Order: create the 7 metaobjects first → then the 24 product metafields → then the 1 new variant metafield.

---

## Step 1 — Create 7 NEW Metaobjects

**Settings → Custom data → Metaobjects → Add definition**.

> Storefront access ON for every one.

### 1.1 Kit Stat Pair (`kit_stat_pair`)
Indians-strip pair under Quick Benefits.

- `Value` — Single line text *(e.g. "4,37,000+")*
- `Caption` — Single line text *(e.g. "Indians with gut problems")*

### 1.2 Kit Science Card (`kit_science_card`)
Spotlight cards for the science section (Airlock, Glass Weight…).

- `Name` — Single line text
- `Image` — File → Image (single)
- `What it does` — Multi-line text
- `Why it matters` — Multi-line text
- `Chip` — Single line text

### 1.3 Kit Timeline Step (`kit_timeline_step`)
Health-timeline cards.

- `Period label` — Single line text *(e.g. "DAYS 1-3", "WEEK 1")*
- `Heading` — Single line text
- `Description` — Multi-line text

### 1.4 Kit Consumable (`kit_consumable`)
Inside-the-Kit detail cards (Spice Mix, Ferment Boost…).

- `Image` — File → Image (single)
- `Heading` — Single line text
- `Sub-heading` — Multi-line text
- `Ingredients` — Single line text → **List of values**
- `Category` — Single line text *(use values: `spice` or `boost`)*

### 1.5 Kit Science Stat (`kit_science_stat`)
Zoe-style science stat cards.

- `Icon` — Single line text *(emoji)*
- `Stat` — Single line text *(e.g. "47%")*
- `Heading` — Single line text
- `Description` — Multi-line text

### 1.6 Kit Consumption Method (`kit_consumption_method`)
How-to-enjoy cards (Morning shot, With meals, Spritzer…).

- `Image` — File → Image (single)
- `Heading` — Single line text
- `Description` — Multi-line text

### 1.7 Kit Recipe Tag (`kit_recipe_tag`)
Pill tag in recipes section.

- `Emoji` — Single line text
- `Name` — Single line text

---

## Step 2 — Create 24 NEW Product Metafields

**Settings → Custom data → Products → Add definition**. Pin + Storefront access ON for every one.

### Hero coupon (2)

| # | Name | Key | Type |
|---|---|---|---|
| 1 | Coupon Text | `coupon_text` | Single line text |
| 2 | Coupon Code | `coupon_code` | Single line text |

### Featured-content metaobject lists (7)

For all seven below: Type = **Reference → Metaobject → List of values**, then pick the matching metaobject.

| # | Name | Key | Metaobject | Max items |
|---|---|---|---|---|
| 3 | Featured Outcomes Stats | `featured_outcomes_stats` | Kit Stat Pair | 2 |
| 4 | Featured Science Cards | `featured_science_cards` | Kit Science Card | 4 |
| 5 | Featured Timeline Steps | `featured_timeline_steps` | Kit Timeline Step | — |
| 6 | Featured Consumables | `featured_consumables` | Kit Consumable | 4 |
| 7 | Featured Science Stats | `featured_science_stats` | Kit Science Stat | — |
| 8 | Featured Consumption Methods | `featured_consumption_methods` | Kit Consumption Method | — |
| 9 | Featured Recipe Tags | `featured_recipe_tags` | Kit Recipe Tag | — |

### Section copy / control overrides (8)

| # | Name | Key | Type |
|---|---|---|---|
| 10 | Timeline Subtitle | `timeline_subtitle` | Multi-line text |
| 11 | ITK Intro | `itk_intro` | Multi-line text |
| 12 | Refill Note Heading | `refill_note_heading` | Single line text |
| 13 | Refill Note Description | `refill_note_description` | Multi-line text |
| 14 | Refill CTA Label | `refill_cta_label` | Single line text |
| 15 | Refill CTA URL | `refill_cta_url` | URL |
| 16 | Science Stats Caption | `science_stats_caption` | Multi-line text |
| 17 | Science Stats Disclaimer | `science_stats_disclaimer` | Multi-line text |

### Eat / dosage strip (3)

| # | Name | Key | Type |
|---|---|---|---|
| 18 | Dosage Amount | `dosage_amount` | Single line text |
| 19 | Dosage Label | `dosage_label` | Single line text |
| 20 | Dosage Caption | `dosage_caption` | Multi-line text |

### Recipes (4)

| # | Name | Key | Type |
|---|---|---|---|
| 21 | Recipe Count | `recipe_count` | Integer |
| 22 | Recipe Banner Image | `recipe_banner_image` | File → Image (single) |
| 23 | Recipe H Label | `recipe_h_label` | Single line text |
| 24 | Recipe H Text | `recipe_h_text` | Single line text |

---

## Step 3 — Create 1 NEW Variant Metafield

**Settings → Custom data → Variants → Add definition**.

| # | Name | Key | Type |
|---|---|---|---|
| 1 | Variant Illustration | `variant_illustration` | File → Image (single) — Pin + Storefront access ON |

---

## Step 4 — Reused (already exist from sprout-maker)

These metaobjects and metafields are already in the store and the fermentation-kit section reads them directly. **Don't create duplicates.**

**Metaobjects:** `kit_review`, `kit_faq`, `kit_step`, `kit_component`, `kit_trust_card`, `kit_quick_benefit`, `kit_comparison_row`, `kit_reel`

**Product metafields (shared):**
`activity_items`, `benefits_items`, `hero_trust_strip`, `help_note`, `capacity`, `size_chart_image`, `companion_size_product`, `cross_sell_products`, `comparison_left_image`, `comparison_right_image`, `comparison_intro`, `box_image`, `box_note`, `how_to_make_video`, `hero_benefits_icons`, `benefits_icons`, `trust_strip_icons`, `step_icons`, `featured_reviews`, `featured_faqs`, `featured_steps`, `featured_components`, `featured_trust_cards`, `featured_quick_benefits`, `featured_comparison_rows`, `featured_reels`, `seo_title_override`, `seo_description_override`

**Already-in-store fields (preserved by Matrixify import):**
`hero_tagline`, `discount_badge`, `rating`, `review_count`, `bought_today`, `days_subtitle`, `days_to_ferment`, `pdp_template`, `product_name_short`, `short_name`, `theme_accent`, `theme_accent_dark`, `theme_accent_soft`, `kit_label_format`, `content_id`

**Variant metafields:** `best_for`, `tag`

---

## Step 5 — Run the Matrixify imports

```
shopify/matrixify/
├── Fermentation-Kit-Products-FINAL.csv     # PASS 1 — products + variants + metafield values
└── fermentation-kit-references.csv         # PASS 2 — Template Suffix + cross_sell_products GIDs
```

### Pass 1
Upload **`Fermentation-Kit-Products-FINAL.csv`** in Matrixify (entity: **Products**). It updates all 6 products with:
- existing metafield values (hero_tagline, discount_badge, rating, etc.)
- new metafield values (`activity_items`, `benefits_items`, `hero_trust_strip`, `capacity`, `coupon_text`, `coupon_code`)
- variant metafields (`best_for`, `tag`)

### Pass 2
Upload **`fermentation-kit-references.csv`** (entity: **Products**). It:
- sets `Template Suffix` to `fermentation-kit` on all 6 (so they use `templates/product.fermentation-kit.json`)
- sets `cross_sell_products` to a curated 3-product list per kit

GIDs already filled in from your URLs:

| Product | GID |
|---|---|
| Kanji Kit | `gid://shopify/Product/9271562436841` |
| Achaar Kit | `gid://shopify/Product/9271677026537` |
| Aam Panna Kit | `gid://shopify/Product/9271562404073` |
| Kimchi Kit | `gid://shopify/Product/9271676895465` |
| Vegetable Fermentation Kit | `gid://shopify/Product/9271676928233` |
| All-in-One Fermentation Kit | `gid://shopify/Product/9271676993769` |

### Then per-product in admin

For each product, open it and pick metaobject entries for the `featured_*` metafields you want populated. The section liquid falls back to its block defaults when a metafield is empty, so you can roll this out one section at a time.

---

## Total counts

| Layer | Sprout existing | Fermentation new | After ferment |
|---|---|---|---|
| Metaobjects | 8 | +7 | 15 |
| Product metafields (shared) | 28 | 0 | 28 |
| Product metafields (sprout-only) | 2 | 0 | 2 |
| Product metafields (ferment-only) | 0 | +24 | 24 |
| Variant metafields | 2 | +1 | 3 |
| **Total definitions** | **40** | **+32** | **72** |

72 / 200-cap product metafield definitions = 36% headroom remaining. New kit templates 7+ should reuse these definitions; only invent new ones if a brand-new section pattern appears.
