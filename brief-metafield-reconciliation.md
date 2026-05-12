# Brief metafield reconciliation — addendum to the four `.docx` briefs

**What this is:** an overlay that reconciles the metafield/metaobject references inside the four `.docx` briefs against the **live store schema** (78 product metafield definitions, 15 metaobject definitions, pulled 2026-05-12 from ferment-jar.myshopify.com).

**What it overrides:** when this addendum and a `.docx` brief disagree on a metafield key or metaobject type, **this addendum wins**. The briefs were authored before the live schema was inspected and propose some fields that are duplicates of existing definitions under different names.

**Read order:** Section A (global rules) → Section B (canonical renames — apply these mentally when reading any brief) → Section C (the "actually new" definitions to create) → Section D (decisions that need user input) → Section E (per-brief detailed tables, for reference only).

**Companion:** `brief-field-mappings.csv` is the same data in row form (218 reconciled rows). Hand it to Claude Code for programmatic lookup.

---

## A. Global rules

1. **Namespace:** `custom.*` everywhere. The earlier `gutbasket.tools.*` concern is moot — those fields were migrated to `custom.*` already.
2. **Reuse before creating.** 88 of the 218 brief field references match the live store exactly. Another 25 either rename to a canonical existing key or reuse an existing metaobject. Only ~80 unique fields actually need creating across all four templates combined.
3. **Two patterns for icon+text content coexist in the store** — use the right one:
   - **Parallel-array pattern** (currently in use): `benefits_items` (`emoji|text` per entry) paired with `benefits_icons` (file refs), coupled by index. Used for the 4-tile benefits block, hero benefits icons, hero trust strip, activity strip. **Keep using this for these specific blocks** — the theme renders them directly.
   - **Bundled-metaobject pattern**: e.g. `featured_quick_benefits` → `kit_quick_benefit` (icon + heading + description bundled per entry). Used for everything richer (FAQs, steps, trust cards, comparison rows, components, reviews, science cards, timeline steps, etc.). **Use this for any block with 3+ fields per item.**
4. **One metafield key, one canonical name.** Where two briefs proposed the same content under different keys (e.g. fermentation-kit's `hero_whats_inside` vs jars-tools's `hero_whats_included`), pick one. Section B has the canonical list.
5. **Heading metafields are optional.** Most "section heading" fields (`reviews_h`, `faq_h`, `crosssell_h`, etc.) the briefs proposed are NEW. If your theme has reasonable defaults baked in, you may not need them. Treat them as opt-in for products that want custom headings.

---

## B. Canonical renames — apply these when reading any brief

Whenever a brief uses the LEFT key, treat it as the RIGHT key.

| Brief uses | Use canonical (already in store) | Why |
|---|---|---|
| `custom.how_make_video` | `custom.how_to_make_video` | File-reference (Video) — already exists, 3 in use. |
| `custom.recipes_banner_image` | `custom.recipe_banner_image` | Singular not plural. Already exists, 2 in use. |
| `custom.spoons_per_meal` | `custom.dosage_amount` | Brief itself flagged this as a "confirm" — confirmed. |
| `custom.spoons_label` | `custom.dosage_label` | Existing dosage_* trio works for both prebiotic powders and kit spoons. |
| `custom.spoons_caption` | `custom.dosage_caption` | Same. |
| `custom.myth_intro` | `custom.comparison_intro` | Existing comparison_intro (multi_line). Same purpose. |
| `custom.variant_help_note` | `custom.help_note` | Existing help_note (multi_line, 2 in use). |
| `custom.product_name_display` | `custom.product_name_short` | Used in prebiotic brief — fermentation-kit uses product_name_short. Canonical: product_name_short. |
| `custom.hero_trust_items` | `custom.hero_trust_strip` | Existing list.single_line_text_field (9 in use). |
| `custom.hero_trust_icons` | `custom.trust_strip_icons` | Existing list.file_reference. Note: existing is file refs; prebiotic brief proposed emoji single-line. **Decide one**. |
| `custom.use_cases_h` | `custom.features_h1` | Existing single_line. Same purpose. |
| `custom.faq_heading` (prebiotic) | `custom.faq_h` | Pick one canonical across briefs. Recommend `faq_h`. |
| `custom.ugc_heading` (prebiotic) | `custom.reviews_h` | Same field across briefs. |
| `custom.timeline_heading` (prebiotic) | `custom.timeline_h` | Match fermentation-kit naming. |
| `custom.diff_left_label` (prebiotic) | `custom.compare_left_label` | Same as fermentation-kit's compare_left_label. |
| `custom.diff_right_label` (prebiotic) | `custom.compare_right_label` | Same. |

**Cross-brief inconsistency to fix:**

| Brief A says | Brief B says | Canonical |
|---|---|---|
| `hero_whats_inside` (fermentation-kit, spice-refill) | `hero_whats_included` (jars-tools) | **Don't create either** — reuse `featured_components` metaobject for all four briefs. The metaobject already exists with the right shape (name + description + icon). |

---

## C. Metaobjects: reuse, don't create

The briefs propose several "new" metaobjects. **None of them need to be created.** All have a matching existing metaobject type. Apply these mappings:

| Brief proposes | Reuse this existing metaobject | Field mapping |
|---|---|---|
| `trust_row_card` (fermentation-kit 1.4) | **`kit_trust_card`** | `heading + description + icon` — identical shape. |
| `airlock_card` (fermentation-kit 1.10) | **`kit_science_card`** | name, image, what_it_does, why_it_matters, chip. |
| `kit_blend` (fermentation-kit 1.13) | **`kit_consumable`** | image, heading, sub_heading, ingredients, category — covers the blend-card shape. |
| `featured_specifications` (jars-tools 1.4) | **`custom.specs [json]`** | Already exists as a JSON metafield. Use shape `[{label, value, icon?}, …]`. **Don't create a new metaobject.** |
| `prebiotic_journey_card` (prebiotic 1.10) | **`kit_timeline_step`** | period_label, heading, description — exact shape match for the journey cards. |
| `pd_source_*` (prebiotic 1.7, 4-5 fields) | **`kit_science_card`** | One metaobject entry per source: name = source name, image, what_it_does = source story, why_it_matters = why this source, chip = cert. |

**Result:** **zero new metaobjects need to be created.** The 15 existing types cover every block in all four briefs.

---

## D. New product metafields to actually create (deduplicated across all 4 briefs)

After applying renames and metaobject reuse, ~30 unique new metafield keys remain across all four templates. Listed by purpose; if `specs [json]` could absorb the field instead, that's noted.

### Hero gallery (used by all 4 briefs)
| Key | Type | Notes |
|---|---|---|
| `custom.hero_gallery` | list.file_reference (Image) | Or skip this and use Shopify native product images. |
| `custom.hero_gallery_labels` | list.single_line_text_field | Accessibility labels for the gallery. |
| `custom.hero_video` | file_reference (Video) | Optional. Different from `how_to_make_video`. |

### Hero accordion content (used by 3 briefs)
| Key | Type | Notes |
|---|---|---|
| `custom.hero_description` | rich_text_field | Or use Shopify native `body_html` for this. |

(`hero_whats_inside` / `hero_whats_included` — **don't create**. Reuse `featured_components`.)

### Section headings (~12 new, all single_line_text_field, all optional)
| Key | Used by |
|---|---|
| `custom.reviews_h` | All briefs |
| `custom.faq_h` | All briefs |
| `custom.timeline_h` | fermentation-kit, prebiotic |
| `custom.how_make_h` | fermentation-kit, spice-refill |
| `custom.eat_h` | fermentation-kit |
| `custom.care_h` | jars-tools |
| `custom.crosssell_h` | fermentation-kit, spice-refill, jars-tools |
| `custom.airlock_spotlight_h` | fermentation-kit |
| `custom.use_cases_h` | jars-tools (or reuse `features_h1`) |
| `custom.why_eyebrow` | spice-refill, prebiotic |
| `custom.consume_eyebrow`, `custom.diff_eyebrow`, `custom.who_eyebrow`, `custom.pd_eyebrow`, `custom.timeline_eyebrow`, `custom.faq_eyebrow`, `custom.ugc_eyebrow`, `custom.journey_eyebrow` | prebiotic |

**Recommendation:** instead of creating ~16 single-purpose heading fields, create ONE `custom.section_headings [json]` field with shape `{section_key: {eyebrow, heading, sub}}`. Same flexibility, one definition, no Shopify admin clutter.

### Pack / variant labels (fermentation-kit 1.2, jars-tools 1.2)
| Key | Type | Decision |
|---|---|---|
| `custom.pack_1_label`, `pack_2_label`, `pack_3_label` | single_line | **Use Shopify product variants for size + price**. Only create the metafields if you need narrative labels beyond the variant title. |
| `custom.pack_1_sub`, `pack_2_sub`, `pack_3_sub` | single_line | Pack "best for" line. If kept as metafields. |
| `custom.pack_1_save`, `pack_2_save`, `pack_3_save` | single_line | Save-amount label. Could be derived from variant compare_at_price. |

### Spice-refill specific
| Key | Type | Notes |
|---|---|---|
| `custom.parent_kit_link_text` | single_line | CTA label. |
| `custom.batch_makes` | single_line | "Each sachet = ~900g achaar". Could roll into `specs` JSON. |
| `custom.cost_savings` | single_line | "85% cheaper per batch vs new kit". Could roll into `specs` JSON. |
| `custom.sub_offer_title`, `custom.sub_offer_desc` | single_line, multi_line | Subscribe & save block. |
| `custom.why_image`, `custom.why_headline`, `custom.why_text` | file_ref, rich_text, multi_line | Why-the-refill section. |

(`why_bullets` — reuse `benefits_items`. `parent_kit_name` / `parent_kit_url` — see Section D below; recommend reusing `companion_size_product`.)

### Jars-tools specific
| Key | Type | Notes |
|---|---|---|
| `custom.material` | single_line | Or roll into `specs` JSON. |
| `custom.dimensions` | single_line | Or roll into `specs` JSON. |
| `custom.food_grade_label` | single_line | Or roll into `specs` JSON. |
| `custom.care_instructions` | list.single_line_text_field | |
| `custom.warranty_note` | multi_line | |

(`replacement_parts` — see Section D below; recommend reusing `cross_sell_products`. `featured_specifications` — already covered by `specs [json]`; don't create.)

### Fermentation-kit specific (myth + compare + ITK)
| Key | Type | Notes |
|---|---|---|
| `custom.myth_eyebrow`, `myth_h1`, `myth_h2`, `myth_pill_text`, `fact_pill_text` | single_line × 5 | Myth header strip. Truly new. |
| `custom.compare_left_label`, `compare_right_label`, `compare_summary_left`, `compare_summary_right`, `compare_summary_caption` | single_line × 5 | Comparison section. |
| `custom.itk_spice_h`, `itk_spice_sub`, `itk_boost_h`, `itk_boost_sub` | single_line × 4 | ITK card headings. |
| `custom.itk_spice_list`, `itk_boost_list` | list.single_line × 2 | Or reuse `featured_consumables` (one entry per card with the ingredients list inside it). **Recommend metaobject** — cleaner. |

### Prebiotic specific (heavy — many genuinely new)
| Key | Type | Notes |
|---|---|---|
| `custom.fiber_per_serve`, `serves_count`, `source`, `taste` | single_line × 4 | Hero meta cells. Could roll into `specs` JSON. |
| `custom.why_heading`, `why_intro` | multi_line × 2 | |
| `custom.who_heading`, `who_sub`, `who_yes`, `who_no` | multi_line × 2, list.single_line × 2 | |
| `custom.diff_heading` | multi_line | (left/right labels canonicalize to `compare_left_label`/`compare_right_label`) |
| `custom.consume_heading`, `consume_tips` | multi_line, list.single_line | |
| `custom.pd_heading`, `pd_certifications` | multi_line, list.single_line | (Source fields — reuse `kit_science_card`, see Section C.) |
| `custom.faq_heading`, `ugc_heading`, `timeline_heading` | — | **Don't create.** Reuse `faq_h`, `reviews_h`, `timeline_h`. |
| `custom.journey_sub` | multi_line | (Journey cards reuse `kit_timeline_step`.) |

---

## E. Decisions that need user input

| # | Decision | Recommendation |
|---|---|---|
| 1 | **Pack variants vs metafields.** Use Shopify product variants for sizes/prices/SKUs, or use metafields for pack_*_label?  | Use product variants. Only create pack_*_sub / pack_*_save metafields if narrative copy is needed beyond the variant title. |
| 2 | **`parent_kit_name` / `parent_kit_url` (spice-refill 1.1).** Reuse `companion_size_product` (product_reference) and derive name+URL from it, or store as denormalised single_line fields? | Reuse `companion_size_product`. Derive the URL from the referenced product. Store the displayable name as the referenced product's title. |
| 3 | **`replacement_parts` (jars-tools 1.6).** Reuse `cross_sell_products` or create a separate list.product_reference? | Reuse `cross_sell_products` unless the PDP needs to render replacement parts as a distinct section. |
| 4 | **Hardware specs (material, dimensions, food_grade_label).** Create as individual metafields or roll into `specs` JSON? | Roll into `specs` JSON. Existing field, no admin clutter, theme code reads one JSON. |
| 5 | **Section headings (~16 fields).** Create individual `*_h` and `*_eyebrow` fields, or consolidate into one `section_headings [json]` field? | **Consolidate into one JSON.** Saves 16 metafield definitions in admin. |
| 6 | **Prebiotic hero meta cells (fiber_per_serve, serves_count, source, taste).** Individual fields or `specs` JSON? | Roll into `specs` JSON. |
| 7 | **`trust_strip_icons` typing.** Live store has list.file_reference. Prebiotic brief proposed list.single_line (emojis). | Keep file_reference. Use the existing pattern from kanji-making-kit: `hero_trust_strip` (text/emoji) paired with `trust_strip_icons` (file refs). |
| 8 | **`hero_video` vs `how_to_make_video`.** Different purposes? | Create `hero_video` as new. Keep `how_to_make_video` for the 60-sec tutorial. |
| 9 | **`hero_gallery` vs Shopify native product images.** | Default to native images. Only create `hero_gallery` metafield if you need a curated subset different from the main product gallery. |

---

## F. Summary by brief

| Brief | Total field references | Already correct (✓) | Rename to canonical (✏️) | Reuse metaobject (🔁) | Don't create (❌) | Genuinely new (🆕) | Decisions (⚠️) |
|---|---|---|---|---|---|---|---|
| Fermentation-kit | 84 | 31 | 6 | 3 | 0 | 41 | 3 |
| Spice-refill | 38 | 13 | 3 | 2 | 0 | 17 | 3 |
| Jars-tools | 35 | 17 | 1 | 1 | 1 | 12 | 3 |
| Prebiotic | 61 | 27 | 4 | 5 | 0 | 25 | 0 |
| **Total** | **218** | **88** | **14** | **11** | **1** | **95** | **9** |

The 95 🆕 CREATE rows boil down to ~30 unique keys (lots of cross-brief duplicates like `hero_gallery` listed in all 4 briefs). After consolidations from Section E (decisions 4, 5, 6 → JSON), the actual new-definition count drops to ~15.

---

## G. Instructions for the next chat / Claude Code

When reading any of the four `.docx` briefs:

1. **Treat this addendum as canonical** when there's any conflict on a metafield key, type, or metaobject reference.
2. **Apply Section B renames mentally** — anywhere a brief says `how_make_video`, read `how_to_make_video`. Etc.
3. **Apply Section C metaobject reuse** — anywhere a brief proposes a new metaobject (trust_row_card, airlock_card, kit_blend, featured_specifications, prebiotic_journey_card), use the existing kit_* metaobject instead.
4. **For the genuinely new fields in Section D**, before creating them in Shopify Admin, confirm Section E decisions with the user. Several can be consolidated into existing JSON fields.
5. **Use `brief-field-mappings.csv` for programmatic lookups** — one row per brief field reference with the action and canonical key in adjacent columns.

This addendum + the four briefs + `store-schema-reference.md` + the two inventory CSVs form a complete, non-contradicting reference for the metafield work.
