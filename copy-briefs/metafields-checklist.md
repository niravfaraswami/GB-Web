# Shopify metafield + metaobject checklist

Walk this list against **Settings → Custom data → Products** (and Articles)
in Shopify admin. Tick what's already defined, create what's missing.

The codebase (committed to `shopify-deploy`) reads everything below. If a
definition is missing, the matching `featured_*` section path silently
falls back to section blocks — so existing pages keep working, but the
new metafield-driven authoring workflow won't kick in until definitions
exist.

---

## 1 · Product metafields — `gutbasket.tools.*`
Used by: **Jars & Tools PDP** (`templates/product.jars-tools.json` → section `gb-product-jars-tools`)

| ☐ | Key | Type | Section on page |
|---|-----|------|-----------------|
| ☐ | `category_label` | Single line text | Hero chip |
| ☐ | `tagline` | Single line text | Hero subtitle |
| ☐ | `bought_today` | Integer | Hero activity row |
| ☐ | `rating` | Single line text | Hero rating |
| ☐ | `review_count` | Integer | Hero rating |
| ☐ | `kit_color` | Color | Page accent |
| ☐ | `kit_color_dark` | Color | Page accent |
| ☐ | `kit_color_soft` | Color | Page accent |
| ☐ | `features_h1` | Single line text | Features section heading |
| ☐ | `features_intro` | Multi-line text | Features section intro |
| ☐ | `features` | JSON | Features grid items |
| ☐ | `feature_icons` | List of single-line text | Feature icons |
| ☐ | `specs` | JSON | Specs table rows |
| ☐ | `use_cases` | JSON | Use cases grid |
| ☐ | `use_case_icons` | List of single-line text | Use case icons |
| ☐ | `compatible_with` | Multi-line text | "Works with" strip |

---

## 2 · Product metafields — `gutbasket.*`
Used by: **cart drawer** (`gb-cart-drawer`), **sticky ATC** (`gb-sticky-atc`), **shop tab cards** (`gb-home-shop-tabs`)

| ☐ | Key | Type | Used by |
|---|-----|------|---------|
| ☐ | `kit_color` | Color | Cart drawer accent + line-item highlight |
| ☐ | `kit_color_dark` | Color | Cart drawer accent (dark variant) |
| ☐ | `kit_color_soft` | Color | Cart drawer accent (soft background) |
| ☐ | `cart_addon_ids` | List of product references | "Frequently added" strip suggestions |

---

## 3 · Product metafields — `custom.*` (kit PDPs)
Used by: `sprout-maker-pdp`, `fermentation-kit-pdp`, `fermentation-kit-leo-pdp`, all `leo-*` sub-sections

### Hero / identity
| ☐ | Key | Type |
|---|-----|------|
| ☐ | `hero_tagline` | Single line text |
| ☐ | `short_name` | Single line text |
| ☐ | `product_name_short` | Single line text |
| ☐ | `kit_label_format` | Single line text |
| ☐ | `pdp_template` | Single line text |
| ☐ | `discount_badge` | Single line text |
| ☐ | `jar_capacity` | Single line text |
| ☐ | `capacity` | Single line text |
| ☐ | `hero_emoji` | Single line text |
| ☐ | `subtitle` | Multi-line text |

### Visual accent (page-level)
| ☐ | Key | Type |
|---|-----|------|
| ☐ | `theme_accent` | Color |
| ☐ | `theme_accent_dark` | Color |
| ☐ | `theme_accent_soft` | Color |
| ☐ | `theme_accent_contrast` | Color |
| ☐ | `theme_accent_secondary` | Color |
| ☐ | `theme_accent_secondary_dark` | Color |

### Social proof
| ☐ | Key | Type |
|---|-----|------|
| ☐ | `rating` | Single line text |
| ☐ | `review_count` | Integer |
| ☐ | `bought_today` | Integer |

### Process timing + trust strip
| ☐ | Key | Type |
|---|-----|------|
| ☐ | `days_to_ferment` | Integer |
| ☐ | `days_subtitle` | Single line text |
| ☐ | `hero_trust_strip` | List of single-line text |
| ☐ | `hero_benefits_icons` | List of single-line text |
| ☐ | `benefits_icons` | List of single-line text |
| ☐ | `trust_strip_icons` | List of single-line text |
| ☐ | `step_icons` | List of single-line text |

### Companion + images
| ☐ | Key | Type |
|---|-----|------|
| ☐ | `companion_size_product` | Product reference |
| ☐ | `size_chart_image` | Image |
| ☐ | `jar_size_chart_image` | Image |
| ☐ | `comparison_left_image` | Image |
| ☐ | `comparison_right_image` | Image |
| ☐ | `comparison_intro` | Multi-line text |
| ☐ | `box_image` | Image |
| ☐ | `box_note` | Multi-line text |
| ☐ | `recipe_banner_image` | Image |
| ☐ | `how_to_make_video` | File / video |
| ☐ | `variant_illustration` | Image |

### Activity + cross-sell
| ☐ | Key | Type |
|---|-----|------|
| ☐ | `activity_items` | List of single-line text |
| ☐ | `benefits_items` | List of single-line text |
| ☐ | `cross_sell_products` | List of product references |
| ☐ | `coupon_text` | Single line text |
| ☐ | `coupon_code` | Single line text |
| ☐ | `help_note` | Single line text |

### Recipe + refill section copy
| ☐ | Key | Type |
|---|-----|------|
| ☐ | `recipe_count` | Single line text |
| ☐ | `recipe_h_label` | Single line text |
| ☐ | `recipe_h_text` | Single line text |
| ☐ | `refill_cta_label` | Single line text |
| ☐ | `refill_cta_url` | URL |
| ☐ | `refill_note_heading` | Single line text |
| ☐ | `refill_note_description` | Multi-line text |

### Science / dosage callouts
| ☐ | Key | Type |
|---|-----|------|
| ☐ | `science_stats_caption` | Multi-line text |
| ☐ | `science_stats_disclaimer` | Multi-line text |
| ☐ | `dosage_label` | Single line text |
| ☐ | `dosage_amount` | Single line text |
| ☐ | `dosage_caption` | Single line text |
| ☐ | `itk_intro` | Multi-line text |
| ☐ | `timeline_subtitle` | Single line text |
| ☐ | `track_label` | Single line text |

### Cross-CTA + misc
| ☐ | Key | Type |
|---|-----|------|
| ☐ | `cross_cta_eyebrow` | Single line text |
| ☐ | `cross_cta_title` | Single line text |
| ☐ | `cross_cta_desc` | Multi-line text |
| ☐ | `seo_title_override` | Single line text |
| ☐ | `seo_description_override` | Multi-line text |
| ☐ | `short_description` | Single line text |
| ☐ | `short_desc` | Multi-line text |
| ☐ | `badge` | Single line text |

---

## 4 · Product metafields pointing at metaobject lists
These are `List of metaobject references` — the metafield definition's
reference type points at the metaobject definitions in §5.

| ☐ | Metafield key | Points at metaobject type | Used by section |
|---|---------------|---------------------------|-----------------|
| ☐ | `custom.featured_reviews` | review (custom) | leo-ugc, sprout-maker, ferm-kit |
| ☐ | `custom.featured_faqs` | faq (custom) | leo-faq, sprout-maker, ferm-kit |
| ☐ | `custom.featured_steps` | step (custom) | leo-how-to-make, sprout-maker, ferm-kit |
| ☐ | `custom.featured_trust_cards` | trust_card (custom) | leo-trust, sprout-maker, ferm-kit |
| ☐ | `custom.featured_outcomes_stats` | outcome_stat (custom) | leo-first-30, ferm-kit |
| ☐ | `custom.featured_quick_benefits` | quick_benefit (custom) | leo-first-30 |
| ☐ | `custom.featured_science_cards` | science_card (custom) | leo-science, ferm-kit |
| ☐ | `custom.featured_science_stats` | science_stat (custom) | leo-science, ferm-kit |
| ☐ | `custom.featured_recipe_tags` | recipe_tag (custom) | leo-recipes, ferm-kit |
| ☐ | `custom.featured_reels` | reel (custom) | leo-reels, sprout-maker, ferm-kit |
| ☐ | `custom.featured_components` | component (custom) | leo-stacks, sprout-maker, ferm-kit |
| ☐ | `custom.featured_consumables` | consumable (custom) | leo-stacks, ferm-kit |
| ☐ | `custom.featured_consumption_methods` | consumption_method (custom) | leo-enjoy, ferm-kit |
| ☐ | `custom.featured_comparison_rows` | comparison_row (custom) | leo-stacks |
| ☐ | `custom.featured_timeline_steps` | timeline_step (custom) | leo-stag |

---

## 5 · Metaobject definitions
Each row is a metaobject definition (`Content → Metaobjects → Definitions`).

| ☐ | Type | Fields used by code |
|---|------|---------------------|
| ☐ | `review` | quote, name, meta, photo |
| ☐ | `faq` | question, answer |
| ☐ | `step` | title, description, icon |
| ☐ | `trust_card` | heading, body / description, icon |
| ☐ | `outcome_stat` | value / num, num_unit / unit, label, caption |
| ☐ | `quick_benefit` | heading / title, description / body, icon, icon_emoji |
| ☐ | `science_card` | image, name, what_it_does, why_it_matters, chip |
| ☐ | `science_stat` | icon, stat / value, heading, description |
| ☐ | `recipe_tag` | url, emoji, name |
| ☐ | `reel` | video, poster, author_handle, caption |
| ☐ | `component` | icon, name, description |
| ☐ | `consumable` | image, heading, sub, category, ingredients (list) |
| ☐ | `consumption_method` | image, heading / title, description / body |
| ☐ | `comparison_row` | label, kit_mark, kit_text, col3_mark, col3_text, col4_mark, col4_text |
| ☐ | `timeline_step` | variant (single-select: image_only / dark / dark_photo / light / detail), image, image_mobile, heading, description, eyebrow, numeral, bullets, span_row_2 (boolean), span_col_2 (boolean) |

**Note on field types within metaobjects:**
- `image` / `photo` → File reference (image only)
- `video` → File reference (video only)
- `icon` → File reference (image — for SVG/PNG icon set)
- everything else → Single line text or Multi-line text as appropriate
- list fields (e.g. `ingredients`) → List of single-line text

---

## 6 · Article metafields — `custom.*` (recipe blog template)
Used by: `gb-learn-recipe-*` sections (recipe blog articles)

| ☐ | Key | Type |
|---|-----|------|
| ☐ | `category_label` | Single line text |
| ☐ | `subtitle` | Multi-line text |
| ☐ | `hero_emoji` | Single line text |
| ☐ | `dietary_tags` | List of single-line text |
| ☐ | `cuisine` | Single line text |
| ☐ | `difficulty` | Single line text |
| ☐ | `prep_time` | Single line text |
| ☐ | `ferment_time` | Single line text |
| ☐ | `total_time` | Single line text |
| ☐ | `yield` | Single line text |
| ☐ | `video_youtube_id` | Single line text |
| ☐ | `video_title` | Single line text |
| ☐ | `color` | Color |
| ☐ | `color_dark` | Color |
| ☐ | `color_soft` | Color |
| ☐ | `format` | Single line text |
| ☐ | `level` | Single line text |
| ☐ | `duration` | Single line text |
| ☐ | `author_role` | Single line text |
| ☐ | `subcategory` | Single line text |
| ☐ | `filterable_tags` | List of single-line text |
| ☐ | `read_time` | Single line text |

### Article metafields — `gb.*`
| ☐ | Key | Type |
|---|-----|------|
| ☐ | `read_time` | Single line text |

---

## 7 · Variant metafields — `custom.*`
Used by: kit PDP variant cards

| ☐ | Key | Type |
|---|-----|------|
| ☐ | `tag` | Single line text |
| ☐ | `best_for` | Single line text |
| ☐ | `emoji` | Single line text |
| ☐ | `color` | Color |
| ☐ | `color_dark` | Color |
| ☐ | `color_soft` | Color |

---

## 8 · BYOK quick-card metafields — `byok.*`
Used by: BYOK builder + fermentation-kit-leo quick cards

| ☐ | Key | Type |
|---|-----|------|
| ☐ | `badge` | Single line text |
| ☐ | `short_description` | Multi-line text |

---

## How to use this list

1. **Settings → Custom data → Products** in Shopify admin.
2. For each row, tick if a matching definition exists; otherwise create
   one with the listed type.
3. For metaobject reference fields (§4), the reference type picker
   needs the matching metaobject definition (§5) to already exist —
   create §5 first, then §4.
4. The list-order matches PDP top-to-bottom flow, so creating in this
   sequence keeps the admin UI predictable.
5. Anything left unticked = needs creating before the matching
   Matrixify import row will resolve. Until then sections silently
   fall back to Theme Editor blocks (no broken page).
