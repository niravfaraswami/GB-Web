# GutBasket store — metafield & metaobject reference

**Store:** ferment-jar.myshopify.com (GutBasket)
**Pulled:** 2026-05-12
**Totals:** 78 product metafield definitions · 15 metaobject definitions

This is the **base schema** that already exists in your store from the fermentation-kit-leo build. Use it as the reuse layer; only create new definitions when nothing here covers the need.

---

## A. How the Benefits block actually works (the example you asked about)

The benefits block uses the **parallel-array pattern**: two list metafields that pair by index position.

**Live data from `kanji-making-kit`:**

| Position | `custom.benefits_items` (`list.single_line_text_field`) | `custom.benefits_icons` (`list.file_reference`) |
|---|---|---|
| 0 | `🦠\|Live Probiotic Cultures` | `gid://shopify/MediaImage/39642319913193` |
| 1 | `🚫\|Zero Added Sugar` | `gid://shopify/MediaImage/39642319880425` |
| 2 | `⚡\|Ready in 3–5 Days` | `gid://shopify/MediaImage/39642320077033` |
| 3 | `♻️\|Reusable Jar` | `gid://shopify/MediaImage/39642320011497` |

**Conventions to know:**

- Each item string uses the pattern `emoji|text` — the pipe separates the emoji prefix from the body copy. Theme code splits on `|` to render emoji and text separately.
- The two arrays must have the **same length** and must be **paired by index**. Position 0 in items goes with position 0 in icons.
- The emoji in `benefits_items` is a fallback / always-visible glyph; the file in `benefits_icons` is the actual SVG icon shown in the block.
- There is ALSO a separate `custom.hero_benefits_icons` (5 products use it) used in the hero strip — a different 4-icon array from the benefits block. Don't conflate them.

**The same parallel-array pattern is used elsewhere on the PDP:**

| Block | Text metafield | Icon metafield |
|---|---|---|
| Hero benefit strip | (no text — icons only) | `hero_benefits_icons` |
| Benefits block | `benefits_items` | `benefits_icons` |
| Activity strip | `activity_items` (also uses `emoji\|text`) | — |
| Hero trust strip | `hero_trust_strip` | `trust_strip_icons` |
| How-to-make steps | (driven by `featured_steps` metaobjects) | `step_icons` (legacy/unused) |

**Alternative pattern (also in your store, not yet used for benefits):** the `featured_quick_benefits` metafield references the `kit_quick_benefit` metaobject — which bundles `heading + description + icon` into one record per benefit. Cleaner long-term, more setup overhead. Decision point in Section D.

---

## B. Product metafields — all 78 grouped by PDP section

All in the `custom.*` namespace.

### Identity / visual
| Key | Type | In use |
|---|---|---|
| `pdp_template` | single_line_text_field | 9 |
| `short_name` | single_line_text_field | 9 |
| `product_name_short` | single_line_text_field | 9 |
| `kit_label_format` | single_line_text_field | 0 |
| `category_label` | single_line_text_field | 0 (new — for jars-tools) |
| `variant_tag` | single_line_text_field | 0 |
| `content_id` | single_line_text_field | 0 |

### Theme
| Key | Type | In use |
|---|---|---|
| `theme_accent` | color | 9 |
| `theme_accent_dark` | color | 9 |
| `theme_accent_soft` | color | 9 |

### Hero
| Key | Type | In use |
|---|---|---|
| `hero_tagline` | multi_line_text_field | 10 |
| `discount_badge` | single_line_text_field | 9 |
| `rating` | number_decimal | 9 |
| `review_count` | number_integer | 9 |
| `bought_today` | number_integer | 9 |
| `days_to_ferment` | single_line_text_field | 9 |
| `days_subtitle` | multi_line_text_field | 9 |
| `capacity` | single_line_text_field | 7 |
| `jar_capacity` | single_line_text_field | 2 |
| `best_for` | single_line_text_field | 0 |
| `hero_trust_strip` | list.single_line_text_field | 9 |
| `trust_strip_icons` | list.file_reference (Image) | 0 |

### Benefits block (parallel-array pattern)
| Key | Type | In use |
|---|---|---|
| `benefits_items` | list.single_line_text_field | 10 |
| `benefits_icons` | list.file_reference (Image) | 2 |
| `hero_benefits_icons` | list.file_reference (Image) | 5 |

### Activity strip / promo
| Key | Type | In use |
|---|---|---|
| `activity_items` | list.single_line_text_field | 9 |
| `coupon_text` | single_line_text_field | 7 |
| `coupon_code` | single_line_text_field | 7 |

### Features / spec section (jars-tools)
| Key | Type | In use |
|---|---|---|
| `features_h1` | single_line_text_field | 0 |
| `features_intro` | multi_line_text_field | 0 |
| `specs` | json | 0 |
| `compatible_with` | multi_line_text_field | 0 |

### Comparison
| Key | Type | In use |
|---|---|---|
| `comparison_intro` | multi_line_text_field | 0 |
| `comparison_left_image` | file_reference (Image) | 2 |
| `comparison_right_image` | file_reference (Image) | 2 |

### Box
| Key | Type | In use |
|---|---|---|
| `box_image` | file_reference (Image) | 2 |
| `box_note` | multi_line_text_field | 0 |

### How-to-make
| Key | Type | In use |
|---|---|---|
| `how_to_make_video` | file_reference (Video) | 3 |
| `step_icons` | list.file_reference (Image) | 0 (use `featured_steps` instead) |

### Cross-sell
| Key | Type | In use |
|---|---|---|
| `companion_size_product` | product_reference | 2 |
| `cross_sell_products` | list.product_reference | 7 |
| `cart_addon_ids` | list.product_reference | 0 |

### Size chart
| Key | Type | In use |
|---|---|---|
| `size_chart_image` | file_reference (Image) | 0 |
| `jar_size_chart_image` | file_reference (Image) | 0 |

### Refill block
| Key | Type | In use |
|---|---|---|
| `refill_cta_label` | single_line_text_field | 0 |
| `refill_cta_url` | url | 0 |
| `refill_note_heading` | multi_line_text_field | 0 |
| `refill_note_description` | multi_line_text_field | 0 |

### Recipes
| Key | Type | In use |
|---|---|---|
| `recipe_count` | number_integer | 2 |
| `recipe_banner_image` | file_reference (Image) | 2 |
| `recipe_h_label` | single_line_text_field | 0 |
| `recipe_h_text` | single_line_text_field | 0 |

### Dosage (prebiotic)
| Key | Type | In use |
|---|---|---|
| `dosage_amount` | single_line_text_field | 0 |
| `dosage_label` | single_line_text_field | 0 |
| `dosage_caption` | multi_line_text_field | 0 |

### Timeline / ITK / Science
| Key | Type | In use |
|---|---|---|
| `timeline_subtitle` | multi_line_text_field | 0 |
| `itk_intro` | multi_line_text_field | 0 |
| `science_stats_caption` | multi_line_text_field | 0 |
| `science_stats_disclaimer` | multi_line_text_field | 0 |

### Misc / SEO / variants
| Key | Type | In use |
|---|---|---|
| `help_note` | multi_line_text_field | 2 |
| `variant_illustration` | file_reference (Image) | 0 |
| `seo_title_override` | single_line_text_field | 0 |
| `seo_description_override` | multi_line_text_field | 0 |

### Metaobject reference fields (these point at the metaobject types in Section C)
| Key | Points to | In use |
|---|---|---|
| `featured_reviews` | `kit_review` | 2 |
| `featured_faqs` | `kit_faq` | 0 |
| `featured_steps` | `kit_step` | 0 |
| `featured_components` | `kit_component` | 2 |
| `featured_trust_cards` | `kit_trust_card` | 0 |
| `featured_quick_benefits` | `kit_quick_benefit` | 0 |
| `featured_comparison_rows` | `kit_comparison_row` | 0 |
| `featured_reels` | `kit_reel` | 0 |
| `featured_outcomes_stats` | `kit_stat_pair` | 0 |
| `featured_science_cards` | `kit_science_card` | 0 |
| `featured_timeline_steps` | `kit_timeline_step` | 0 |
| `featured_consumables` | `kit_consumable` | 0 |
| `featured_science_stats` | `kit_science_stat` | 0 |
| `featured_consumption_methods` | `kit_consumption_method` | 0 |
| `featured_recipe_tags` | `kit_recipe_tag` | 2 |

---

## C. Metaobjects — all 15 types with field schemas

Each metaobject is a reusable record. A metafield like `featured_faqs` is a list of references to `kit_faq` entries. Create entries once, reference them from many products.

| Type | Purpose | Display field | Fields | Entries today |
|---|---|---|---|---|
| `kit_review` | UGC review card | `quote` | `photo` (Image), `quote`, `name`, `meta` | **6** |
| `kit_faq` | FAQ Q/A | `question` | `question`, `answer` | 0 |
| `kit_step` | How-to-make step | `title` | `title`, `description`, `icon` (Image) | 0 |
| `kit_component` | What's-in-the-box pill | `name` | `name`, `description`, `icon` (Image) | **1** |
| `kit_trust_card` | Trust strip card | `heading` | `heading`, `description`, `icon` (Image) | 0 |
| `kit_quick_benefit` | Benefit card | `heading` | `heading`, `description`, `icon` (Image) | 0 |
| `kit_comparison_row` | Comparison row | `left_heading` | `left_heading`, `left_subtext`, `right_heading`, `right_subtext` | 0 |
| `kit_reel` | Video reel | `caption` | `video`, `poster`, `caption`, `author_handle` | 0 |
| `kit_stat_pair` | Outcome stat | `value` | `value`, `caption` | 0 |
| `kit_science_card` | Science explainer | `name` | `name`, `image`, `what_it_does`, `why_it_matters`, `chip` | 0 |
| `kit_timeline_step` | Health-timeline step | `period_label` | `period_label`, `heading`, `description` | 0 |
| `kit_consumable` | Kit consumable | `heading` | `image`, `heading`, `sub_heading`, `ingredients`, `category` | 0 |
| `kit_science_stat` | Stat with icon | `icon` | `icon`, `stat`, `heading`, `description` | 0 |
| `kit_consumption_method` | Use-case card | `heading` | `image`, `heading`, `description` | 0 |
| `kit_recipe_tag` | Recipe tag chip | `emoji` | `emoji`, `name` | **1** |

**Key observation:** every metaobject that needs an icon+text pair uses the bundled pattern (`icon` field + `heading` field on the same metaobject), NOT parallel arrays. The parallel-array pattern (`benefits_items` + `benefits_icons`) is the older approach, kept around because the theme template renders it directly.

---

## D. Gaps per template (what's still missing relative to the brief specs)

Most things have already been built. Here's what each template still needs created, by template:

### Fermentation-kit (✓ mostly covered by leo schema)
**Existing fields cover ~95% of the brief.** Still missing:
- `pack_1_label`, `pack_1_rationale`, `pack_2_label`, `pack_2_rationale`, `pack_3_label`, `pack_3_rationale` — variant pack labelling (could use product variants instead — recommend variants over metafields here).
- `hero_description` (Description accordion body) — could reuse Shopify's native `body_html`.
- `hero_whats_included` — could reuse `featured_components` metaobject list.

### Spice-refill
**Most fields exist.** The refill-block fields (`refill_cta_label`, `refill_cta_url`, `refill_note_heading`, `refill_note_description`) are already created — just unused. Still missing:
- `parent_kit_name` / `parent_kit_id` — could use `companion_size_product` (already exists as product_reference).
- `batch_makes`, `cost_savings_pct`, `per_batch_cost` — three new single_line_text_fields OR roll into one `specs` JSON.
- `subscribe_offer` — new single_line_text_field.

### Jars-tools
**The PR #54 fields (`category_label`, `features_h1`, `features_intro`, `specs`, `compatible_with`, `cart_addon_ids`) all exist already in `custom.*`.** Still missing:
- `material`, `dimensions`, `food_grade_label` — three single_line_text_fields. OR put inside the existing `specs` JSON metafield.
- `care_instructions` (list.single_line_text_field).
- `replacement_parts` (list.product_reference) — could reuse `cross_sell_products`.
- `warranty_note` (multi_line_text_field).
- **New metaobject:** `kit_specification_row` if you want a richer spec table than JSON allows. Otherwise `specs` JSON covers it.

### Prebiotic
**Heavy schema — most pieces exist.** Existing relevant: `dosage_amount`, `dosage_label`, `dosage_caption`, `science_stats_caption`, `science_stats_disclaimer`, `featured_science_cards`, `featured_science_stats`, `featured_timeline_steps`, `featured_consumption_methods`, `itk_intro`, `timeline_subtitle`. Still missing:
- `prebiotic_journey_card` metaobject — could likely be served by `kit_timeline_step` (same shape).
- Nothing else material — the leo schema covers prebiotic well.

### Cultures (no brief written yet)
- Can likely run entirely on the leo schema. Confirm after the brief is authored.

### Sprout-maker (no brief written yet)
- Sprout-maker products are already populated in `seed-kits.csv` using the leo schema. Should work as-is.

### Generic product (no brief written yet)
- Use the minimum viable subset: theme colors, hero_tagline, short_name, rating, review_count, bought_today, cross_sell_products, SEO overrides. ~10 fields.

---

## E. The structural decision you'll want to make

Two patterns coexist in the store for icon+text content:

**Path A — Parallel arrays** (currently in use)
- `benefits_items` (4 text items) + `benefits_icons` (4 file refs), coupled by index
- Pros: simple bulk import, fewer Shopify objects, easy to edit in CSV
- Cons: easy to desync (add a text item, forget the icon), can't reuse one icon across products without duplicating uploads, can't add a description field without breaking the schema

**Path B — Bundled metaobjects** (set up but unused)
- `featured_quick_benefits` references `kit_quick_benefit` metaobjects, each bundling `icon + heading + description`
- Pros: each benefit is one atomic record with all its data, reusable across products, can add a description, can't desync
- Cons: ~256 metaobject entries to create (4 per product × 64 products), CSV import requires referencing entries by handle

**My take:** the benefits block is the smallest of the icon+text blocks (4 items, 1 emoji + 1 line of text each). Path A is fine there — keep it. For richer blocks (FAQs, steps, trust cards, comparison rows, components), the metaobject pattern (Path B) is already correct in the schema and just needs entries created. So the answer isn't "all-A or all-B" — it's:

- **Path A for:** benefits block (`benefits_items` + `benefits_icons`), hero trust strip, hero benefits icons, activity strip
- **Path B for:** FAQs, steps, trust cards, components, comparison rows, reviews, reels, outcomes stats, science cards, timeline steps, consumables, consumption methods, recipe tags

This is in fact what the leo schema implies. No change needed.

---

## F. Recommended next step

Hand the next operator (Claude Code or the project chat) three things together:

1. `store-metafields-inventory.csv` and `store-metaobjects-inventory.csv` — what already exists, do not duplicate
2. This reference doc — the patterns, especially the parallel-array vs metaobject decision
3. The four `.docx` briefs — for the seed content

With those, the gap list per template (Section D above) becomes a 1-2 hour metafield-creation task, not a re-derive-the-schema task. And the seed work has actual content references to put into the metaobject entries instead of `TODO: GIDs of N Kit X metaobject entries` placeholders.
