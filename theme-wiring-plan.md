# Theme wiring plan — moving PDPs to metafield/metaobject reads

**Scope:** map every dynamic binding in the `.html` mockups (the `KITS{}` / `REFILLS{}` JS data blocks and their `data-bind="…"` consumers) to a Liquid metafield / metaobject access pattern in the corresponding theme section file. **Plan only — no code changes here.** Once the parallel Shopify-MCP chat finishes creating the 52 new metafield definitions and the metaobject entries, theme code can be edited from this plan in one pass.

**Current theme state (read from repo):** several PDPs are *already* metafield-driven (fermentation-kit-leo-pdp.liquid, sprout-maker-pdp.liquid). Others mix section-setting fallbacks with metafield reads (fermentation-kit-pdp.liquid). The wiring shifts authority **away from section-setting block content and toward product metafields**, keeping settings only for layout/spacing knobs.

**File-name → template mapping (live theme):**

| Template JSON | Main section (Liquid) | Status |
|---|---|---|
| `templates/product.fermentation-kit.json` | `sections/fermentation-kit-pdp.liquid` (1394 lines) | Mixed: hero & many blocks already on metafields; comparison/myth/eat-uses still need wiring. |
| `templates/product.fermentation-kit-leo.json` | `sections/fermentation-kit-leo-pdp.liquid` (1226 lines) | Mostly metafield-driven. Reference implementation. |
| `templates/product.fermentation-kit-refactor.json` | `sections/fermentation-kit-pdp.liquid` (?) | Confirm — likely same section. |
| `templates/product.spice-refill.json` | `sections/leo-hero.liquid` + family of `leo-*` sections | Section settings + blocks today. Migrate to metafields. |
| `templates/product.prebiotic.json` | `sections/leo-hero.liquid` + `leo-*` family | Same. |
| `templates/product.jars-tools.json` | `sections/gb-product-jars-tools.liquid` (832 lines) | Mixed; needs `specs` JSON parser + `featured_components` iteration. |
| `templates/product.sprout-maker.json` (?) | `sections/sprout-maker-pdp.liquid` (1046 lines) | Already metafield-driven. Out of scope this round. |

**Fallback rule:** every metafield read keeps the existing `default:` chain so empty values fall back to the section setting or hardcoded copy. This means the theme stays editable from both the Shopify Admin (metafields) and the Theme Editor (settings) — gating which one wins by which is non-blank.

---

## A. The 47 `data-bind` keys from `gutbasket-fermentation-kit.html` → Liquid

Source binding dict: `gutbasket-fermentation-kit.html:9042–9092` inside `setKit(kitId)`. All keys mapped to their canonical metafield. Per the reconciliation:

- `myth-pill-text` / `fact-pill-text` are NEW metafields (in the 52).
- `compare-summary-left/right/caption` are NEW.
- `eat-h` is NEW.
- All `pack-*` bindings are **dropped** — packs handled via Shopify variants alone (per decision #1).
- `spoons-*` bindings rename to `dosage-*`.

| `data-bind` (mock) | Liquid source | Metafield exists? | Notes |
|---|---|---|---|
| `name` | `{{ p.title }}` | n/a (native) | Shopify native. |
| `product-name` | `{{ p.metafields.custom.product_name_short \| default: p.title \| upcase }}` | ✱ exists | |
| `tagline` | `{{ p.metafields.custom.hero_tagline }}` | ✱ exists | |
| `rating-text` | `{{ p.metafields.custom.rating }} ({{ p.metafields.custom.review_count }} reviews)` | ✱ exists | Compose in Liquid. |
| `bought-today` | `{{ p.metafields.custom.bought_today }}` | ✱ exists | |
| `discount` | `{{ p.metafields.custom.discount_badge }}` | ✱ exists | |
| `pack-1-label` / `pack-2-label` / `pack-3-label` | `{{ variant.title }}` for each variant in `p.variants` | n/a — variants | **Decision #1: don't create metafields.** Variant title is the source. |
| `pack-1-sub` / `pack-2-sub` / `pack-3-sub` | `{{ variant.metafields.custom.best_for }}` per variant | ✱ exists (variant) | Variant metafield. Already in store, value 0-in-use — populate per pack variant. |
| `pack-1-save` / `pack-2-save` / `pack-3-save` | Computed: `{{ variant.compare_at_price \| minus: variant.price \| money }}` | n/a — derived | Derive from compare_at_price; no metafield needed. |
| `price-1` / `price-2` / `price-3` | `{{ variant.price \| money }}` | n/a (native) | |
| `price-1-compare` / `price-2-compare` / `price-3-compare` | `{{ variant.compare_at_price \| money }}` | n/a (native) | |
| `myth-eyebrow` | `{{ p.metafields.custom.myth_eyebrow }}` | ★ NEW | |
| `myth-h1` | `{{ p.metafields.custom.myth_h1 }}` | ★ NEW | |
| `myth-h2` | `{{ p.metafields.custom.myth_h2 }}` | ★ NEW | |
| `myth-intro` | `{{ p.metafields.custom.comparison_intro }}` | ✱ exists (✏️ renamed from `myth_intro`) | |
| `myth-pill-text` | `{{ p.metafields.custom.myth_pill_text }}` | ★ NEW | |
| `fact-pill-text` | `{{ p.metafields.custom.fact_pill_text }}` | ★ NEW | |
| `compare-left-label` | `{{ p.metafields.custom.compare_left_label }}` | ★ NEW | |
| `compare-right-label` | `{{ p.metafields.custom.compare_right_label }}` | ★ NEW | |
| `summary-left` | `{{ p.metafields.custom.compare_summary_left }}` | ★ NEW | |
| `summary-right` | `{{ p.metafields.custom.compare_summary_right }}` | ★ NEW | |
| `summary-caption` | `{{ p.metafields.custom.compare_summary_caption }}` | ★ NEW | |
| `days-to-ferment` | `{{ p.metafields.custom.days_to_ferment }}` | ✱ exists | |
| `days-subtitle` | `{{ p.metafields.custom.days_subtitle }}` | ✱ exists | |
| `step-1-title` / `step-2-title` / `step-3-title` / `step-4-title` | `{%- for s in p.metafields.custom.featured_steps.value -%}{{ s.title }}{%- endfor -%}` (positional by `forloop.index`) | 🔁 metaobject `kit_step` | One entry per step. Replace 4 hardcoded slots with iteration. |
| `step-1-desc` / `step-2-desc` / `step-3-desc` / `step-4-desc` | Same loop, `{{ s.description }}` | 🔁 metaobject `kit_step` | |
| `how-make-h` | `{{ p.metafields.custom.how_make_h }}` | ★ NEW | |
| `outcomes-h` | `{{ p.metafields.custom.outcomes_h }}` | ★ NEW | |
| `reels-h` | `{{ p.metafields.custom.reels_h }}` | ★ NEW | |
| `box-h1` | `{{ p.metafields.custom.box_h1 }}` | ★ NEW | |
| `box-h2` | `{{ p.metafields.custom.box_h2 }}` | ★ NEW | |
| `airlock-spotlight-h` | `{{ p.metafields.custom.airlock_spotlight_h }}` | ★ NEW | |
| `timeline-h` | `{{ p.metafields.custom.timeline_h }}` | ★ NEW | |
| `science-h1` | `{{ p.metafields.custom.science_h1 }}` | ★ NEW | |
| `science-h2` | `{{ p.metafields.custom.science_h2 }}` | ★ NEW | |
| `study-disclaimer` | `{{ p.metafields.custom.science_stats_disclaimer }}` | ✱ exists | |
| `reviews-h` | `{{ p.metafields.custom.reviews_h }}` | ★ NEW | |
| `eat-h` | `{{ p.metafields.custom.eat_h }}` | ★ NEW | |
| `spoons-per-meal` | `{{ p.metafields.custom.dosage_amount }}` | ✱ exists (✏️ renamed) | |
| `spoons-caption` | `{{ p.metafields.custom.dosage_caption }}` | ✱ exists (✏️ renamed) | |
| `recipes-count` | `{{ p.metafields.custom.recipe_count }}` | ✱ exists | |
| `recipes-h1` | `{{ p.metafields.custom.recipe_h_text }}` | ✱ exists | |
| `recipes-h2` | `{{ p.metafields.custom.recipe_h_label }}` | ✱ exists | |
| `faq-h` | `{{ p.metafields.custom.faq_h }}` | ★ NEW | |
| `judgeme-h` | `{{ p.metafields.custom.judgeme_h \| default: section.settings.judgeme_heading }}` | use existing setting | Optional; no metafield. |
| `cross-h` | `{{ p.metafields.custom.crosssell_h \| default: section.settings.cross_heading }}` | Optional ★ NEW | Or keep as section setting. |
| `itk-spice-h` | `{{ p.metafields.custom.itk_spice_h }}` | ★ NEW | Per reconciliation. Or replace with `featured_consumables` iteration — see B.2 below. |
| `itk-spice-sub` | `{{ p.metafields.custom.itk_spice_sub }}` | ★ NEW | Same. |

**Variant illustration / pack image** (no `data-bind` but present in mock): use `{{ variant.metafields.custom.variant_illustration \| default: variant.image }}`.

---

## B. Dynamic block rebuilders → metaobject iteration

Six `setKit()` rebuilders touch DOM by ID and use `kit.<array>.map(…)`. Each becomes a `{%- for -%}` over a metaobject reference list.

### B.1 `#compare-table` ← `kit.compare_rows[]`

**Mock JS (`html:9100–9104`):**
```js
compareTable.innerHTML = kit.compare_rows.map(r => `<div class="compare-row">
  <div class="compare-cell left"><div class="h">${r[0]}: ${r[1]}</div><div class="s">${r[3]}</div></div>
  <div class="compare-cell right"><div class="h">${r[0]}: ${r[2]}</div><div class="s">${r[4]}</div></div>
</div>`);
```

**Liquid (in `sections/fermentation-kit-pdp.liquid` around the compare section):**
```liquid
{%- assign rows = p.metafields.custom.featured_comparison_rows.value -%}
{%- if rows and rows.size > 0 -%}
  <div id="compare-table" class="compare-table">
    {%- for r in rows -%}
      <div class="compare-row">
        <div class="compare-cell left">
          <div class="h">{{ r.left_heading }}</div>
          <div class="s">{{ r.left_subtext }}</div>
        </div>
        <div class="compare-cell right">
          <div class="h">{{ r.right_heading }}</div>
          <div class="s">{{ r.right_subtext }}</div>
        </div>
      </div>
    {%- endfor -%}
  </div>
{%- endif -%}
```

**Schema mapping:** `kit_comparison_row.{left_heading, left_subtext, right_heading, right_subtext}` (already in store).
**Mock-vs-schema gap:** the mock packs five strings per row (`[label, leftVal, rightVal, leftSub, rightSub]`); schema has four. Solution: when creating `kit_comparison_row` entries (parallel chat), concat `label + ': ' + leftVal` into `left_heading`. Document this so copy is written for the 2-field form, not the 5-field form.

### B.2 `#blends-grid` ← `kit.blends[]`

**Mock JS:** `kit.blends.map(b => …)` with fields `b.name`, `b.sub`, `b.desc`, `b.color_var`.

**Liquid:** iterate `featured_consumables.value` (reuses `kit_consumable` metaobject per §C of `brief-metafield-reconciliation.md`).
```liquid
{%- assign consumables = p.metafields.custom.featured_consumables.value -%}
{%- if consumables and consumables.size > 0 -%}
  <div id="blends-grid" class="blends-grid">
    {%- for b in consumables -%}
      <div class="blend-card{% if forloop.first %} first{% endif %}">
        <div class="blend-img">
          {%- if b.image -%}
            <img src="{{ b.image | image_url: width: 600 }}" alt="{{ b.heading | escape }}">
          {%- endif -%}
          <span class="pill">No.{{ forloop.index }}</span>
        </div>
        <div class="blend-body">
          <div class="blend-name">{{ b.heading }}</div>
          <div class="blend-sub">{{ b.sub_heading }}</div>
          <div class="blend-desc">{{ b.category }}</div>
        </div>
      </div>
    {%- endfor -%}
  </div>
{%- endif -%}
```

**Note:** `color_var` from the mock has no metaobject equivalent — drop it; the kit-level `theme_accent` handles overall hue.

### B.3 `#eat-grid` ← `kit.eat_uses[]`

**Mock:** `kit.eat_uses.map(u => …)` with `u[0]=heading`, `u[1]=description`.

**Liquid:** iterate `featured_consumption_methods.value` (`kit_consumption_method` metaobject):
```liquid
{%- assign methods = p.metafields.custom.featured_consumption_methods.value -%}
{%- for u in methods -%}
  <div class="eat-card">
    <div class="eat-img">
      {%- if u.image -%}
        <img src="{{ u.image | image_url: width: 400 }}" alt="{{ u.heading | escape }}">
      {%- else -%}🍽️{%- endif -%}
    </div>
    <div class="eat-body">
      <div class="eat-h">{{ u.heading }}</div>
      <div class="eat-d">{{ u.description }}</div>
    </div>
  </div>
{%- endfor -%}
```

### B.4 `#recipe-tags` ← `kit.recipe_tags[]`

**Mock:** maps string names through a `RECIPE_EMOJI{}` dictionary in JS.

**Liquid:** iterate `featured_recipe_tags.value` (`kit_recipe_tag` metaobject — emoji is already a field on the metaobject):
```liquid
{%- for t in p.metafields.custom.featured_recipe_tags.value -%}
  <span class="recipe-tag">
    <span class="dot"></span>{{ t.emoji }} {{ t.name }}
  </span>
{%- endfor -%}
```

Result: the `RECIPE_EMOJI{}` JS dictionary in the mock is deleted entirely — emoji lives on each metaobject entry.

### B.5 `#zoe-grid` ← `kit.science_stats[]`

**Mock:** `kit.science_stats.map(s => …)` with three strings per stat.

**Liquid:** iterate `featured_science_stats.value` (`kit_science_stat` metaobject — has `icon`, `stat`, `heading`, `description`):
```liquid
{%- for s in p.metafields.custom.featured_science_stats.value -%}
  <div class="zoe-card">
    <div class="zoe-icon">{{ s.icon }}</div>
    <div>
      <div class="zoe-stat">{{ s.stat }}</div>
      <div class="zoe-h">{{ s.heading }}</div>
      <div class="zoe-d">{{ s.description }}</div>
    </div>
  </div>
{%- endfor -%}
```

Drop the hardcoded `icons = ['🌟', '⚡', '🌬️', '🍽️']` JS array — icon now per-entry.

### B.6 `#reviews-grid` ← `kit.reviews[]`

**Liquid:**
```liquid
{%- for r in p.metafields.custom.featured_reviews.value -%}
  <div class="review-card">
    <div class="rev-content">
      <h3 class="rev-title">{{ r.quote }}</h3>
      <div class="rev-foot">
        <div class="rev-stars">★★★★★</div>
        <div class="rev-name">{{ r.name }}</div>
        <div class="rev-meta">{{ r.meta }}</div>
      </div>
    </div>
    <div class="rev-photo">
      {%- if r.photo -%}
        <img src="{{ r.photo | image_url: width: 400 }}" alt="{{ r.name | escape }}">
      {%- else -%}
        <span class="photo-placeholder">📷</span>
      {%- endif -%}
    </div>
  </div>
{%- endfor -%}
```

**Mapping note:** mock's `r.title` is the same content as the schema's `quote` field — use `r.quote`.

### B.7 `#faq-grid` ← `kit.faqs[]`

**Liquid:**
```liquid
{%- for q in p.metafields.custom.featured_faqs.value -%}
  <div class="faq-item{% if forloop.first %} open{% endif %}" onclick="this.classList.toggle('open')">
    <div class="faq-q">
      <span>{{ q.question }}</span>
      <span class="faq-toggle">+</span>
    </div>
    <div class="faq-a">{{ q.answer }}</div>
  </div>
{%- endfor -%}
```

### B.8 Kit picker (`buildPicker`)

**Mock JS:** builds `Object.keys(KITS).map(…)` to render kit-switcher pills.

**Liquid:** delete the picker entirely. Each product is its own URL; the picker is only there because the mock is a single HTML page that simulates 9 kits. On the live PDP each product is independent.

### B.9 CSS variables (`root.style.setProperty('--kit-color', …)`)

**Liquid:** push at the section root via inline style on a wrapper:
```liquid
<section
  class="fermentation-kit-pdp"
  style="
    --kit-color: {{ p.metafields.custom.theme_accent | default: '#C24528' }};
    --kit-color-dark: {{ p.metafields.custom.theme_accent_dark | default: '#8E2E1A' }};
    --kit-color-soft: {{ p.metafields.custom.theme_accent_soft | default: '#FCE5DE' }};
  "
  data-kit="{{ p.handle }}"
>
```

Already implemented in fermentation-kit-leo-pdp.liquid. Replicate in fermentation-kit-pdp.liquid where missing.

---

## C. Per-section wiring tasks

### C.1 `sections/fermentation-kit-pdp.liquid` (1394 lines, **main work**)

| Task | Lines (approx) | Change |
|---|---|---|
| Add metafield reads for 52 new fields at top of section | lines 1–120 | Extend the existing `liquid` preamble (already reads ~30 metafields). Add: `myth_eyebrow`, `myth_h1`, `myth_h2`, `myth_pill_text`, `fact_pill_text`, `compare_left_label`, `compare_right_label`, `compare_summary_left`, `compare_summary_right`, `compare_summary_caption`, `how_make_h`, `outcomes_h`, `reels_h`, `airlock_spotlight_h`, `timeline_h`, `science_h1`, `science_h2`, `eat_h`, `box_h1`, `box_h2`, `faq_h`, `reviews_h`, `itk_spice_h`, `itk_spice_sub`, `itk_boost_h`, `itk_boost_sub`. |
| Myth section | search `myth_eyebrow` | Wire 5 `data-bind` keys above. Replace hardcoded copy with `{{ var \| default: section.settings.myth_eyebrow }}`. |
| Comparison summary | search `summary-left` | Wire 3 summary fields. |
| Compare table | search `featured_comparison_rows` (already used) | Verify iteration; confirm rows have 4-field shape. |
| How-to steps | search `step-1-title` | Replace 4 hardcoded slots with `{%- for s in mf_steps -%}` iteration (kit_step). |
| Outcomes section | search `outcomes_h` | Add heading metafield. Iterate `featured_quick_benefits`. |
| Reels grid | search `featured_reels` | Iterate kit_reel metaobjects (video + poster + caption + author_handle). |
| Box section | search `box_h1` / `box_h2` | Add headings; iterate `featured_components`. |
| Airlock spotlight | search `airlock_spotlight_h` | Add heading; iterate `featured_science_cards`. |
| Timeline | search `timeline_h` | Add heading; existing `featured_timeline_steps` iteration already there. |
| ITK + Blends | search `itk_spice_h` | Either: (a) two flat headings + iterate `featured_consumables`, OR (b) two named groups in metaobject and filter by `category` field. **Recommend (a)** — simpler. |
| Science stats | search `science_h1` | Add headings; iterate `featured_science_stats`. |
| Eat / consume | search `eat_h` | Add heading; iterate `featured_consumption_methods`. |
| Reviews | search `reviews_h` | Add heading; iterate `featured_reviews`. |
| FAQ | search `faq_h` | Add heading; iterate `featured_faqs`. |
| Pack variants | search `pack-1-label` | Delete pack metafield reads; use `p.variants` loop. Pack sub uses `variant.metafields.custom.best_for`. |
| Remove KITS{} JS | bottom of file or `assets/*.js` | If any `kit-picker.js` is still loaded for this template, drop. |

### C.2 `sections/leo-hero.liquid` (527 lines, **used by all 4 templates**)

Already metafield-driven (custom.product_name_short, hero_tagline, rating, review_count, bought_today, days_to_ferment, hero_benefits_icons, benefits_items, hero_trust_strip, trust_strip_icons, discount_badge). Per the briefs add:

| Task | Change |
|---|---|
| `hero_description` accordion content | Read `p.metafields.custom.hero_description` (multi_line) — render as accordion body if non-blank. Currently uses section blocks `hero_accordion_tab`. |
| `hero_video` (NEW, prebiotic only) | Read `p.metafields.custom.hero_video` (file_reference Video). Render `<video>` above the gallery on prebiotic template. Skip on other templates. |
| `category_label` chip | Already exists in schema. Wire `{{ p.metafields.custom.category_label }}` to the breadcrumb-eyebrow chip. |
| `hero_whats_inside` accordion | **Remove** — reuse `featured_components` metaobject rendering. Iterate kit_component entries inside the "What's Included" accordion body. |
| `parent_kit_link_text` (NEW, spice-refill only) | Read `p.metafields.custom.parent_kit_link_text` for the CTA label on the refill-flag row. URL comes from `companion_size_product.value.url`. |

### C.3 `sections/gb-product-jars-tools.liquid` (832 lines)

| Task | Change |
|---|---|
| Specs table | Read `p.metafields.custom.specs` (JSON list `[{label, value, icon?}]`). Iterate. |
| What's Included | Replace block iteration with `{%- for c in p.metafields.custom.featured_components.value -%}`. |
| Use cases | Replace block iteration with `featured_quick_benefits` iteration. |
| Care instructions (NEW) | Read `p.metafields.custom.care_instructions` (list.single_line) — render as `<ul>`. |
| Warranty note (NEW) | Read `p.metafields.custom.warranty_note` (multi_line). |
| Replacement parts | **Reuse `cross_sell_products`** per decision #3 — no new field. |
| `specs` JSON absorbs `material` / `dimensions` / `food_grade_label` | Per decision #4. Don't add separate fields. JSON shape: `[{"label": "Material", "value": "Borosilicate glass"}, {"label": "Capacity", "value": "1 L"}, …]`. |

### C.4 Spice-refill — extends `leo-hero` + `leo-*` family

| Task | Change |
|---|---|
| Refill flag row | New section / partial. Reads `companion_size_product.value` + `parent_kit_link_text`. |
| Why-the-refill section | New section. Reads `why_eyebrow`, `why_heading`, `why_intro`, `why_image`. Bullets reuse `benefits_items` (parallel array). |
| Subscribe-and-save block | New section. Reads `sub_offer_title`, `sub_offer_desc`. |
| What's-in-the-pack | Reuse `gb-card-grid` or similar — iterate `featured_components`. |
| How-to-make | Reuse `leo-how-to-make.liquid` — iterate `featured_steps`. |

### C.5 Prebiotic — extends `leo-hero` + `leo-*` family

| Section | Source metafield | Existing? | Section file (likely) |
|---|---|---|---|
| Hero | All existing leo-hero metafields + hero_video + fiber_per_serve/serves_count/source/taste in `specs` JSON | mixed | `leo-hero.liquid` (extend) |
| Why this fiber (1.2) | `why_eyebrow`, `why_heading`, `why_intro` + iterate `featured_trust_cards` (kit_trust_card) | ★ + ✱ | New / extend `leo-trust.liquid` |
| Who is this for (1.3) | `who_eyebrow`, `who_heading`, `who_sub`, `who_yes` (list), `who_no` (list) | ★ all | New section |
| vs the alternative (1.4) | `diff_eyebrow`, `diff_heading`, `compare_left_label`, `compare_right_label` + iterate `featured_comparison_rows` | ★ + ✱ | Reuse compare section from kit |
| How to consume (1.5) | `consume_eyebrow`, `consume_heading`, `consume_tips` (list) + iterate `featured_steps` | ★ + ✱ | Reuse `leo-how-to-make.liquid` |
| Week-by-week timeline (1.6) | `timeline_eyebrow`, `timeline_heading`, `timeline_subtitle` + iterate `featured_timeline_steps` | ★ + ✱ | Reuse `leo-first-30.liquid` |
| Ingredients (1.7) | `pd_eyebrow`, `pd_heading`, `pd_certifications` (list) + iterate `featured_components` + ONE `featured_science_cards` entry for the source story | ★ + ✱ | New / extend `leo-science.liquid` |
| FAQ (1.8) | `faq_h`, `faq_eyebrow` + iterate `featured_faqs` | ★ + ✱ | Reuse `leo-faq.liquid` |
| UGC reviews (1.9) | `ugc_eyebrow`, `reviews_h` (canonical from `ugc_heading`) + iterate `featured_reviews` | ★ + ✱ | Reuse `leo-ugc.liquid` |
| Journey cross-sell (1.10) | `journey_eyebrow`, `journey_heading`, `journey_sub` + iterate `featured_timeline_steps` (reused) | ★ + ✱ | Reuse timeline section, render again with journey copy. |

---

## D. The 52 new fields → section files that read them

| Metafield key | Section file(s) | Render shape |
|---|---|---|
| `hero_description` (multi_line) | `leo-hero.liquid` | Accordion body |
| `hero_video` (file_reference Video) | `leo-hero.liquid` (prebiotic only) | `<video src=…>` |
| `parent_kit_link_text` | spice-refill hero | CTA label |
| `why_eyebrow` / `why_heading` / `why_intro` | spice-refill section + prebiotic 1.2 | Section header |
| `why_image` (file_reference) | spice-refill section | `<img>` |
| `who_eyebrow` / `who_heading` / `who_sub` / `who_yes` (list) / `who_no` (list) | prebiotic 1.3 | Two-column yes/no |
| `myth_eyebrow` / `myth_h1` / `myth_h2` / `myth_pill_text` / `fact_pill_text` | `fermentation-kit-pdp.liquid` | Myth strip header |
| `compare_left_label` / `compare_right_label` | fermentation-kit, prebiotic | Comparison table labels |
| `compare_summary_left` / `compare_summary_right` / `compare_summary_caption` | fermentation-kit | Compare summary footer |
| `how_make_h` | `leo-how-to-make.liquid` | Section heading (single_line) |
| `outcomes_h` (multi_line) | fermentation-kit-pdp | Section heading |
| `reels_h` (multi_line) | `leo-reels.liquid` | Section heading |
| `airlock_spotlight_h` (multi_line) | fermentation-kit-pdp | Section heading |
| `timeline_h` (multi_line) | `leo-first-30.liquid` | Section heading |
| `science_h1` / `science_h2` (single_line) | fermentation-kit-pdp | Two-part heading |
| `eat_h` (multi_line) | fermentation-kit-pdp | Section heading |
| `box_h1` / `box_h2` (single_line) | fermentation-kit-pdp | Two-part heading |
| `faq_h` (multi_line) | `leo-faq.liquid` | Section heading |
| `reviews_h` (multi_line) | `leo-ugc.liquid` | Section heading |
| `diff_eyebrow` / `diff_heading` (multi_line) | prebiotic 1.4 | Section header |
| `consume_eyebrow` / `consume_heading` (multi_line) / `consume_tips` (list) | prebiotic 1.5 | Section header + tip list |
| `timeline_eyebrow` | prebiotic 1.6 | Eyebrow text |
| `pd_eyebrow` / `pd_heading` / `pd_certifications` (list) | prebiotic 1.7 | Section header + chips |
| `faq_eyebrow` | prebiotic 1.8 | Eyebrow |
| `ugc_eyebrow` | prebiotic 1.9 | Eyebrow |
| `journey_eyebrow` / `journey_heading` / `journey_sub` | prebiotic 1.10 | Section header |
| `sub_offer_title` / `sub_offer_desc` | spice-refill | Subscribe block |
| `care_instructions` (list) / `warranty_note` | `gb-product-jars-tools.liquid` | Care section |
| `itk_spice_h` / `itk_spice_sub` / `itk_boost_h` / `itk_boost_sub` | fermentation-kit-pdp | ITK two-column headers |

(Total: 52 reads to add or rewire. Many are simple `{{ p.metafields.custom.<key> | default: section.settings.<key> }}` substitutions.)

---

## E. Snippet reuse

Already in repo, keep using:

- `snippets/kit_icon.liquid` — renders SVG via `<span data-svg-src>` + raster fallback. Use for every metaobject `icon` field and every `*_icons` file_reference list.
- `snippets/leo_kit_chrome.liquid` — section-level CSS-var preamble. Already wired to `theme_accent` trio.
- `snippets/leo_kit_attrs.liquid` — section attribute helpers.
- `snippets/gb-no-select.liquid` — already site-wide; no change.

Pattern to remember for **file_reference list Drops** (Shopify Liquid bug): use the nested-loop pluck (PR #67/68 fix), not `[i]` indexing:
```liquid
{%- assign target_idx = forloop.index0 -%}
{%- assign mf_icon = nil -%}
{%- for ic in mf_benefits -%}
  {%- if forloop.index0 == target_idx -%}{%- assign mf_icon = ic -%}{%- endif -%}
{%- endfor -%}
```

---

## F. Phased rollout (suggested order)

1. **fermentation-kit-pdp.liquid** — finish the bindings for the 9 fermentation-kit products. Reference impl is fermentation-kit-leo-pdp.liquid; converge the two. Pilot with K6 (Kanji Making Kit — already has live metafields).
2. **leo-hero.liquid extensions** — `hero_description`, `hero_video` (prebiotic), `category_label`, `parent_kit_link_text` (spice-refill). Touches all 4 templates' heros.
3. **leo-* family component sections** — `leo-faq`, `leo-ugc`, `leo-first-30`, `leo-how-to-make`, `leo-reels`, `leo-science`, `leo-trust`, `leo-enjoy`, `leo-cross` — wire each to its `*_h` / `*_eyebrow` metafield read.
4. **gb-product-jars-tools.liquid** — wire `specs` JSON parser + `featured_components` iteration + `care_instructions` + `warranty_note`.
5. **New sections** for spice-refill-specific blocks (Why-the-refill, Subscribe-and-save, Refill-flag row) and prebiotic-specific blocks (Who-is-this-for, Ingredients-with-source-card, Journey).
6. **Smoke test** per template on `?preview_theme_id=…` for one product each, then roll the rest.

---

## G. Risks / things to watch

- **Empty-state rendering.** If the parallel chat hasn't yet populated a metafield, the section should render the section-setting fallback rather than empty. Every read uses `| default:` chain. Where a whole section depends on metaobject content (e.g. comparison rows), gate the section on `{%- if mf_rows and mf_rows.size > 0 -%}` to hide the section entirely when nothing's there.
- **Theme Editor authoring.** If a content owner edits the section blocks in Theme Editor expecting them to win, they'll be surprised that metafields override. Add a small `{%- comment -%}` note at the top of each affected section pointing to the metafield as the source of truth.
- **`featured_consumables` dual use** (ITK + blends in fermentation-kit). Two options: (a) flat iteration, group visually by `category`; (b) two separate lists. Recommend (a). Confirm the metaobject `category` field naming convention before content gets written.
- **Variant-illustration / pack imagery.** If pack copy comes from variants but the visual badge still wants a tinted illustration, that's `variant.metafields.custom.variant_illustration` (already in schema, 0-in-use). Don't rebuild.
- **`featured_recipe_tags` emoji vs name in mock JS.** Mock used a string-keyed dict for emoji. Liquid version reads `t.emoji` direct from the metaobject — no dictionary needed, just confirm each kit_recipe_tag entry has the emoji populated before deleting the JS dict.

---

**Plan complete. No theme files touched.** Awaiting confirmation before opening code edits.
