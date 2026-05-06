# 🧭 PDP Metafield Map — Visual Reference

A single-page map of **every metafield + metaobject** in the GutBasket store and **where each one renders on the PDP**.

Two templates ship today — `product.sprout-maker` and `product.fermentation-kit`. They share a common metafield/metaobject library; each layers a small set of template-specific extras on top.

---

## Legend

| Symbol | Meaning |
|---|---|
| 🟢 | **Shared** — same key works across every kit template |
| 🟠 | **Sprout-only** — exists for compatibility with the legacy sprout-maker data; other kits use the shared equivalent |
| 🔵 | **Fermentation-only** — drives sections unique to the fermentation-kit template |
| 🟣 | **Variant-level** — set per variant (not per product) |
| 📦 | **Metaobject** — repeatable structured content; product picks entries via a `featured_*` list metafield |
| ⓘ | **Already in store** — pre-existing field from the original Matrixify export, untouched |
| 🧩 | **Theme-editor block** — section-level fallback when no metaobject entries are picked |

---

## Architecture in one diagram

```
                                ┌─────────────────────┐
                                │  PRODUCT METAFIELDS │  (per product)
                                ├─────────────────────┤
                                │ • text / numbers    │ → direct copy
                                │ • file / video      │ → direct media
                                │ • list of files     │ → parallel-loop icons
                                │ • product reference │ → cross-product link
                                │ • list of products  │ → cross-sell row
                                │ • list of metaobj   │ → repeatable content ┐
                                └─────────────────────┘                      │
                                                                             ↓
        ┌─────────────────────────────────────────────────────────────────────┐
        │                       METAOBJECT LIBRARY                            │
        ├─────────────────────────────────────────────────────────────────────┤
        │  📦 kit_review        photo, quote, name, meta                      │
        │  📦 kit_faq           question, answer                              │
        │  📦 kit_step          title, description, icon                      │
        │  📦 kit_component     name, description, icon                       │
        │  📦 kit_trust_card    heading, description, icon                    │
        │  📦 kit_quick_benefit heading, description, icon                    │
        │  📦 kit_comparison_row left_h/s, right_h/s                          │
        │  📦 kit_reel          video, poster, caption, author_handle         │
        │  📦 kit_stat_pair     value, caption                          (🔵)  │
        │  📦 kit_science_card  name, image, what_it_does, why_it_matters,    │
        │                       chip                                    (🔵)  │
        │  📦 kit_timeline_step period_label, heading, description     (🔵)  │
        │  📦 kit_consumable    image, heading, sub, ingredients, category    │
        │                                                              (🔵)   │
        │  📦 kit_science_stat  icon, stat, heading, description       (🔵)  │
        │  📦 kit_consumption_method image, heading, description       (🔵)  │
        │  📦 kit_recipe_tag    emoji, name                            (🔵)  │
        └─────────────────────────────────────────────────────────────────────┘
```

**Render priority** for content sections:
```
metaobject list (custom.featured_*)   ←  highest priority, per-product
        ↓ (if empty)
theme-editor block defaults (🧩)      ←  shared across all products on the template
        ↓ (if no blocks)
section is hidden                     ←  graceful fallback
```

For images / icons:
```
custom.<section>_image / custom.<icons>[i]   ←  per-product override
        ↓ (if empty)
section.settings.<image>                     ←  theme-editor section setting
        ↓ (if empty)
emoji / placeholder                           ←  visible default
```

---

## Section-by-section visual map

### 1. Hero

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│  Home /  ⓘ collection.title                                                       │ ← breadcrumb
│                                                                                    │
│  ⓘ product.title                                                  custom.discount_badge ⓘ
│  HERO PRODUCT NAME                                                       ─₹500    │
│  custom.hero_tagline ⓘ                                                            │
│  Tagline copy here.                                                                │
│                                                                                    │
│ ┌─────────────────────────────────┐   ⭐⭐⭐⭐⭐  custom.rating ⓘ (count)         │
│ │                                 │   ─────────────────────────────────────────   │
│ │     custom.discount_badge ⓘ     │   ●  custom.bought_today ⓘ people …           │
│ │                                 │   ⚡ custom.days_subtitle ⓘ + days_to_ferment  │
│ │       p.featured_image          │   custom.activity_items 🟢 (icon|text list)    │
│ │       (Shopify product image)   │                                                │
│ │                                 │   ─── BENEFITS ───                            │
│ │      ‹ gallery-nav ›            │   ▢ ▢ ▢ ▢   custom.benefits_items 🟢          │
│ └─────────────────────────────────┘                custom.hero_benefits_icons 🟢   │
│  [thumb][thumb][thumb] …          │                (parallel-list of file refs)   │
│  (from p.images)                  │                                                │
│                                   │   ─── SELECT PACK ───                         │
│                                   │   ┌──────┐ ┌──────┐ ┌──────┐                  │
│                                   │   │ 1L   │ │ 2L   │ │ 4L   │                  │
│                                   │   │ ◯    │ │ ●    │ │ ◯    │                  │
│                                   │   │ ⓘ p.variants → 🟣 best_for / tag           │
│                                   │   │       🔵 variant_illustration               │
│                                   │   └──────┘ └──────┘ └──────┘                  │
│                                   │                                                │
│                                   │   ⓘ help_note   [ Jar Size Chart → ]          │
│                                   │   custom.help_note 🟢   custom.size_chart_image 🟢 (modal)
│                                   │                          custom.jar_size_chart_image 🟠
│                                   │                                                │
│                                   │   Looking for the …  →  custom.companion_size_product 🟢
│                                   │                                                │
│                                   │   [ ADD TO CART · price ]                     │
│                                   │   ✓ ✓ ✓   custom.hero_trust_strip 🟢            │
│                                   │   ── coupon bar ──                            │
│                                   │   custom.coupon_text 🔵   [ custom.coupon_code 🔵 ]
│                                   │   ── accordion ──                              │
│                                   │   ▸ Description (p.description, native)        │
│                                   │   ▸ What's Inside  ←  📦 featured_components 🟢
│                                   │                       OR 🧩 box_component blocks
└───────────────────────────────────────────────────────────────────────────────────┘
```

**Theme palette** — drives every accent on the page via CSS variables on `.ferment-pdp` / `.sprout-pdp`:

| CSS variable | Source metafield | Default |
|---|---|---|
| `--kit-color` | `custom.theme_accent` ⓘ | `#C24528` |
| `--kit-color-dark` | `custom.theme_accent_dark` ⓘ | `#8E2E1A` |
| `--kit-color-soft` | `custom.theme_accent_soft` ⓘ | `#FCE5DE` |
| `--kit-contrast` | `custom.theme_accent_contrast` 🟢 (optional) | `#FFF6F2` |
| `--kit-secondary` | `custom.theme_accent_secondary` 🟢 (optional) | `#DBEDDF` |
| `--kit-secondary-dark` | `custom.theme_accent_secondary_dark` 🟢 (optional) | `#1F4332` |

---

### 2. Trust Row (4-card strip)

```
┌────────────┬────────────┬────────────┬────────────┐
│   [icon]   │   [icon]   │   [icon]   │   [icon]   │
│   HEADING  │   HEADING  │   HEADING  │   HEADING  │
│  desc text │  desc text │  desc text │  desc text │
└────────────┴────────────┴────────────┴────────────┘
```

| Element | Source |
|---|---|
| Card list | 📦 `custom.featured_trust_cards` 🟢 → `kit_trust_card` entries  |
| ↳ falls back to | 🧩 trust_card blocks (Theme Editor) |
| Per-card icon (block path) | block's icon_image, OR `custom.trust_strip_icons[i]` 🟢 (parallel list), OR emoji fallback |

---

### 3. How to Make (1:1 video + numbered steps)

```
┌─────────────────────┐  ① CHOP + ADD
│                     │     description
│                     │
│       VIDEO         │  ② SPICE + BOOST + WATER
│   (or poster)       │     description
│                     │
│                     │  ③ SEAL WITH AIRLOCK
│                     │     description
└─────────────────────┘
                         ④ STRAIN + ENJOY
                            description
```

| Element | Source |
|---|---|
| Video file | `custom.how_to_make_video` 🟢 (file_reference, video) |
| ↳ falls back to | section's `how_video` setting → `how_poster` image setting → ▶ placeholder |
| Step list | 📦 `custom.featured_steps` 🟢 → `kit_step` entries |
| ↳ falls back to | 🧩 step blocks |
| Per-step icon | metaobject's `icon` field, OR block's icon_image, OR `custom.step_icons[i]` 🟢 |
| Eyebrow / heading copy | section settings (`how_eyebrow`, `how_heading`, `how_heading_em`, `how_pill`) |

---

### 4. Comparison ("Cloth method vs Airlock")

```
─── eyebrow ───
COMPARE METHOD
VS THIS METHOD.
Intro paragraph                           ← custom.comparison_intro 🟢

┌───────────┐ ┌───────────┐
│  IMAGE L  │ │  IMAGE R  │              ← custom.comparison_left_image 🟢
└───────────┘ └───────────┘                custom.comparison_right_image 🟢
  LABEL L       LABEL R                  ← section settings

┌────────────────┬────────────────┐
│ Heading: rose  │ Heading: kit   │      ← row heading
│ subtext        │ subtext        │      ← row subtext
├────────────────┼────────────────┤
│ ...            │ ...            │
└────────────────┴────────────────┘
```

| Element | Source |
|---|---|
| Row list | 📦 `custom.featured_comparison_rows` 🟢 → `kit_comparison_row` entries |
| ↳ falls back to | 🧩 comparison_row blocks |
| Image left | `custom.comparison_left_image` 🟢 → section setting → emoji fallback |
| Image right | `custom.comparison_right_image` 🟢 → section setting → emoji fallback |
| Intro | `custom.comparison_intro` 🟢 → section setting |
| Column labels | section settings (`compare_left_label`, `compare_right_label`) |

---

### 5. Quick Benefits + Indians Stat Pair (fermentation only)

```
┌────────────┐ ┌────────────┐ ┌────────────┐
│  [icon]    │ │  [icon]    │ │  [icon]    │
│  HEADING   │ │  HEADING   │ │  HEADING   │
│  desc      │ │  desc      │ │  desc      │
└────────────┘ └────────────┘ └────────────┘
                                            🔵 fermentation-only
┌─────────────────────────┬─────────────────────────┐
│   value                 │   value                 │
│   caption               │   caption               │
└─────────────────────────┴─────────────────────────┘
```

| Element | Source |
|---|---|
| Benefit cards | 📦 `custom.featured_quick_benefits` 🟢 → `kit_quick_benefit` |
| ↳ falls back to | 🧩 benefit blocks |
| Per-card icon | metaobject's `icon` → block's icon_image → `custom.benefits_icons[i]` 🟢 → emoji |
| Stat pair (ferment only) | 📦 `custom.featured_outcomes_stats` 🔵 → `kit_stat_pair` (max 2) |

---

### 6. Reels (UGC) — Quinn-aware

```
┌──┐ ┌──┐ ┌──┐ ┌──┐
│  │ │  │ │  │ │  │   9:16 vertical videos
│  │ │  │ │  │ │  │
│ @h│ │ @h│ │ @h│ │ @h│  author handle pill
└──┘ └──┘ └──┘ └──┘
```

**Three-way fallback chain:**

```
metaobject list (custom.featured_reels)  ←  per-product UGC reels
        ↓ (if empty)
quinn_embed (section setting)            ←  Quinn UGC widget HTML
        ↓ (if empty)
manual reel blocks (🧩)
        ↓ (if no blocks)
section hidden
```

`kit_reel` fields: `video`, `poster`, `caption`, `author_handle`.

---

### 7. What's in the Box

```
┌─────────────┐ ① name        ② name
│             │   sub           sub
│   image     │
│             │ ③ name        ④ name
└─────────────┘   sub           sub

  Note text
```

| Element | Source |
|---|---|
| Box image | `custom.box_image` 🟢 → section setting → 🫙 emoji |
| Pill list | 📦 `custom.featured_components` 🟢 → `kit_component` entries (also reused by hero accordion) |
| ↳ falls back to | 🧩 box_component blocks |
| Per-pill icon | metaobject's `icon` field, OR block's icon_image, OR auto-numbered badge |
| Note | `custom.box_note` 🟢 → section setting |

---

### 8. Science / Airlock Spotlight (fermentation only) 🔵

```
┌─────────────────────┐  ┌─────────────────────┐
│      IMAGE          │  │      IMAGE          │
├─────────────────────┤  ├─────────────────────┤
│   NAME              │  │   NAME              │
│   ── what it does ──│  │   ── what it does ──│
│   text              │  │   text              │
│   ── why it matters─│  │   ── why it matters─│
│   text              │  │   text              │
│   [ chip ]          │  │   [ chip ]          │
└─────────────────────┘  └─────────────────────┘
```

| Element | Source |
|---|---|
| Card list | 📦 `custom.featured_science_cards` 🔵 → `kit_science_card` (max 4) |
| ↳ falls back to | 🧩 science_card blocks |

---

### 9. UGC Reviews

```
┌────────────────────────────┬──────────────┐
│ "quote text"               │              │
│                            │   photo      │
│ ⭐⭐⭐⭐⭐                  │              │
│ Name                       │              │
│ Meta (city · persona)      │              │
└────────────────────────────┴──────────────┘
```

| Element | Source |
|---|---|
| Review cards | 📦 `custom.featured_reviews` 🟢 → `kit_review` (per-product UGC) |
| ↳ falls back to | 🧩 review blocks (shared across template) |

`kit_review` fields: `photo`, `quote`, `name`, `meta`.

---

### 10. Health Timeline (fermentation only) 🔵

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ DAYS 1-3 │ │ WEEK 1   │ │ WEEK 2-3 │ │ WEEK 4+  │
│ HEADING  │ │ HEADING  │ │ HEADING  │ │ HEADING  │
│ desc     │ │ desc     │ │ desc     │ │ desc     │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

| Element | Source |
|---|---|
| Card list | 📦 `custom.featured_timeline_steps` 🔵 → `kit_timeline_step` |
| ↳ falls back to | 🧩 timeline_step blocks |
| Subtitle | `custom.timeline_subtitle` 🔵 → section setting |

---

### 11. Inside the Kit / Spice + Boost (fermentation only) 🔵

```
┌─────────────────────────┐  ┌─────────────────────────┐
│       IMAGE             │  │       IMAGE             │
├─────────────────────────┤  ├─────────────────────────┤
│   HEADING               │  │   HEADING               │
│   sub-heading           │  │   sub-heading           │
│   ✓ ingredient 1        │  │   ✓ ingredient 1        │
│   ✓ ingredient 2        │  │   ✓ ingredient 2        │
│   ✓ ingredient 3        │  │   ✓ ingredient 3        │
└─────────────────────────┘  └─────────────────────────┘

♻️  refill_note_heading                        [ refill_cta_label → ]
    refill_note_description
```

| Element | Source |
|---|---|
| Detail cards | 📦 `custom.featured_consumables` 🔵 → `kit_consumable` (max 4) |
| ↳ falls back to | 🧩 consumable blocks |
| Section intro | `custom.itk_intro` 🔵 → section setting |
| Refill heading | `custom.refill_note_heading` 🔵 |
| Refill description | `custom.refill_note_description` 🔵 |
| Refill CTA label | `custom.refill_cta_label` 🔵 |
| Refill CTA URL | `custom.refill_cta_url` 🔵 |

---

### 12. Science Stats / Zoe (fermentation only) 🔵

```
┌──────┬──────┐
│ 47%  │ 56%  │
│ icon │ icon │
└──────┴──────┘
┌──────┬──────┐
│ 42%  │ 52%  │
│ icon │ icon │
└──────┴──────┘
   caption
   *italic disclaimer
```

| Element | Source |
|---|---|
| Stat cards | 📦 `custom.featured_science_stats` 🔵 → `kit_science_stat` |
| ↳ falls back to | 🧩 science_stat blocks |
| Caption | `custom.science_stats_caption` 🔵 |
| Disclaimer | `custom.science_stats_disclaimer` 🔵 |

---

### 13. How to Drink Daily (fermentation only) 🔵

```
┌────┐ ┌────┐ ┌────┐ ┌────┐
│img │ │img │ │img │ │img │
│NAME│ │NAME│ │NAME│ │NAME│
│desc│ │desc│ │desc│ │desc│
└────┘ └────┘ └────┘ └────┘

      DOSAGE  ← big number
      label
      caption (italic)
```

| Element | Source |
|---|---|
| Method cards | 📦 `custom.featured_consumption_methods` 🔵 → `kit_consumption_method` |
| ↳ falls back to | 🧩 consumption_method blocks |
| Dosage strip | `custom.dosage_amount` 🔵 + `custom.dosage_label` 🔵 + `custom.dosage_caption` 🔵 |

---

### 14. Recipes (fermentation only) 🔵

```
ONE KIT. ENDLESS VARIETY.

7
KANJI RECIPES INSIDE                  ← recipe_count + recipe_h_label + recipe_h_text

┌─────────────────────────────────────┐
│           BANNER IMAGE              │  ← custom.recipe_banner_image
└─────────────────────────────────────┘

[ 🥕 Tag ] [ 🟣 Tag ] [ 🥒 Tag ] [ 🫐 Tag ]
[ 🥭 Tag ] [ 🍉 Tag ] [ 🍍 Tag ]
```

| Element | Source |
|---|---|
| Recipe count number | `custom.recipe_count` 🔵 |
| Heading highlight word | `custom.recipe_h_label` 🔵 → falls back to `custom.short_name` |
| Heading text | `custom.recipe_h_text` 🔵 (default "RECIPES INSIDE") |
| Banner image | `custom.recipe_banner_image` 🔵 |
| Tag pills | 📦 `custom.featured_recipe_tags` 🔵 → `kit_recipe_tag` (no block fallback by design — recipes vary per kit) |

---

### 15. FAQ (accordion)

```
▾ Question 1                   +
   Answer paragraph
▸ Question 2                   +
▸ Question 3                   +
▸ Question 4                   +
```

| Element | Source |
|---|---|
| Q&A list | 📦 `custom.featured_faqs` 🟢 → `kit_faq` |
| ↳ falls back to | 🧩 faq blocks |

---

### 16. Cross-sell

```
┌──────────┐ ┌──────────┐ ┌──────────┐
│  image   │ │  image   │ │  image   │
│  Title   │ │  Title   │ │  Title   │
│  tagline │ │  tagline │ │  tagline │
│  ₹price  │ │  ₹price  │ │  ₹price  │
└──────────┘ └──────────┘ └──────────┘
```

**Three-way fallback:**
```
custom.cross_sell_products 🟢      ←  per-product manual list (max 3)
        ↓ (if empty)
🧩 cross_sell_product blocks        ←  shared across template
        ↓ (if no blocks)
section's cross_collection setting  ←  any 3 from a chosen collection
```

---

### 17. Judge.me

| Element | Source |
|---|---|
| Embed HTML | section's `judgeme_embed` setting |
| ↳ falls back to | default `<div data-id="{{ product.id }}">` (Judge.me installer hooks it) |

---

## Cheat sheet — what to set per product

For a typical fermentation-kit product (Kanji):

```
✏️  REQUIRED — minimum to make the PDP look right
   custom.hero_tagline           "Make 2L of authentic kanji…"
   custom.discount_badge         "-₹500"
   custom.rating                 4.8
   custom.review_count           1240
   custom.bought_today           76
   custom.capacity               "2L"
   custom.theme_accent           "#C24528"
   custom.theme_accent_dark      "#8E2E1A"
   custom.theme_accent_soft      "#FCE5DE"
   product images (≥3 for gallery prev/next nav)
   variants with best_for + tag

🎨  RECOMMENDED — adds depth
   custom.activity_items         ["📦|25,000+ first ferment", "💬|WhatsApp help"]
   custom.benefits_items         ["🦠|Live Cultures", "🚫|No Sugar", …]
   custom.hero_trust_strip       ["Secure Payment", "Free Shipping", "FSSAI"]
   custom.hero_benefits_icons    [4 SVG file refs]
   custom.coupon_text + code     "Flat ₹50 off"  + "GUTKANJI"
   custom.help_note              "Going through 1L+ a week? Try 4L."
   custom.cross_sell_products    [3 product refs]
   custom.companion_size_product (if a sibling pack exists)

🏷️  PER-PRODUCT METAOBJECT LISTS (highest fidelity)
   custom.featured_reviews       (kit_review entries)
   custom.featured_faqs          (kit_faq entries)
   custom.featured_steps         (kit_step entries)
   custom.featured_components    (kit_component entries)
   custom.featured_recipe_tags   (kit_recipe_tag entries — varies per kit)

🔵  FERMENTATION-SPECIFIC OPTIONALS
   custom.featured_outcomes_stats        (2 kit_stat_pair entries)
   custom.featured_science_cards         (Airlock + Glass Weight)
   custom.featured_timeline_steps        (4 kit_timeline_step)
   custom.featured_consumables           (Spice Mix + Ferment Boost)
   custom.featured_science_stats         (Zoe-style 47% / 56% / …)
   custom.featured_consumption_methods   (Morning shot, with meals, …)
   custom.timeline_subtitle, itk_intro, refill_*, science_stats_caption,
   science_stats_disclaimer, dosage_amount, dosage_label, dosage_caption,
   recipe_count, recipe_h_label, recipe_h_text, recipe_banner_image
```

---

## Total counts

```
Metaobject definitions:            15
Shared product metafields:         28
Sprout-only product metafields:     2
Fermentation-only product metafields: 24
Variant metafields:                  3
Already in store (untouched):      ~14
                                   ────
                                  ~86 definitions
```

Shopify caps: 200 product / 200 variant / 50 metaobject. Headroom ~57% on product, 99% on variant, 70% on metaobject.

---

## Quick alphabetical index — every metafield

| Key | Type | Section | Tier |
|---|---|---|---|
| `activity_items` | list.text | Hero activity row | 🟢 |
| `benefits_icons` | list.file_ref | Quick benefits parallel icons | 🟢 |
| `benefits_items` | list.text | Hero "Why this kit" 2x2 | 🟢 |
| `bought_today` | integer | Hero activity row | ⓘ |
| `box_image` | file_ref (image) | What's in Box | 🟢 |
| `box_note` | multi_line | What's in Box note | 🟢 |
| `capacity` | text | Hero variant block label | 🟢 |
| `companion_size_product` | product_ref | Hero "other size" link | 🟢 |
| `comparison_intro` | multi_line | Comparison intro paragraph | 🟢 |
| `comparison_left_image` | file_ref (image) | Comparison images | 🟢 |
| `comparison_right_image` | file_ref (image) | Comparison images | 🟢 |
| `coupon_code` | text | Hero coupon chip | 🔵 |
| `coupon_text` | text | Hero coupon bar | 🔵 |
| `cross_sell_products` | list.product_ref | Cross-sell row | 🟢 |
| `days_subtitle` | text | Hero activity row | ⓘ |
| `days_to_ferment` | text | Hero activity row | ⓘ |
| `discount_badge` | text | Hero gallery save badge | ⓘ |
| `dosage_amount` | text | How-to-drink dosage strip | 🔵 |
| `dosage_caption` | multi_line | How-to-drink caption | 🔵 |
| `dosage_label` | text | How-to-drink unit | 🔵 |
| `featured_comparison_rows` | list.metaobj | Comparison rows | 🟢 |
| `featured_components` | list.metaobj | Box pills + hero accordion | 🟢 |
| `featured_consumables` | list.metaobj | Inside the Kit cards | 🔵 |
| `featured_consumption_methods` | list.metaobj | How-to-drink cards | 🔵 |
| `featured_faqs` | list.metaobj | FAQ accordion | 🟢 |
| `featured_outcomes_stats` | list.metaobj | Indians-strip stats | 🔵 |
| `featured_quick_benefits` | list.metaobj | Quick Benefits cards | 🟢 |
| `featured_recipe_tags` | list.metaobj | Recipe tag pills | 🔵 |
| `featured_reels` | list.metaobj | UGC reels | 🟢 |
| `featured_reviews` | list.metaobj | UGC reviews | 🟢 |
| `featured_science_cards` | list.metaobj | Science/Airlock cards | 🔵 |
| `featured_science_stats` | list.metaobj | Zoe stats grid | 🔵 |
| `featured_steps` | list.metaobj | How-to-make steps | 🟢 |
| `featured_timeline_steps` | list.metaobj | Health timeline | 🔵 |
| `featured_trust_cards` | list.metaobj | Trust row | 🟢 |
| `help_note` | multi_line | Hero variant help text | 🟢 |
| `hero_benefits_icons` | list.file_ref | Hero "Why this kit" icons | 🟢 |
| `hero_tagline` | text | Hero subhead | ⓘ |
| `hero_trust_strip` | list.text | Hero trust strip below ATC | 🟢 |
| `how_to_make_video` | file_ref (video) | How-to-Make video panel | 🟢 |
| `itk_intro` | multi_line | Inside the Kit intro | 🔵 |
| `jar_capacity` | text | Sprout maker variant block | 🟠 |
| `jar_size_chart_image` | file_ref (image) | Sprout maker size modal | 🟠 |
| `pdp_template` | text | (admin reference only) | ⓘ |
| `product_name_short` | text | (used by some sections / SEO) | ⓘ |
| `rating` | decimal | Hero rating row | ⓘ |
| `recipe_banner_image` | file_ref (image) | Recipes banner | 🔵 |
| `recipe_count` | integer | Recipes big number | 🔵 |
| `recipe_h_label` | text | Recipes em highlight word | 🔵 |
| `recipe_h_text` | text | Recipes trailing text | 🔵 |
| `refill_cta_label` | text | ITK refill CTA button | 🔵 |
| `refill_cta_url` | url | ITK refill CTA link | 🔵 |
| `refill_note_description` | multi_line | ITK refill body | 🔵 |
| `refill_note_heading` | text | ITK refill heading | 🔵 |
| `review_count` | integer | Hero rating row | ⓘ |
| `science_stats_caption` | multi_line | Zoe section caption | 🔵 |
| `science_stats_disclaimer` | multi_line | Zoe section disclaimer | 🔵 |
| `seo_description_override` | multi_line | (theme.liquid integration) | 🟢 |
| `seo_title_override` | text | (theme.liquid integration) | 🟢 |
| `short_name` | text | (recipes label fallback) | ⓘ |
| `size_chart_image` | file_ref (image) | Generic size modal | 🟢 |
| `step_icons` | list.file_ref | How-to-make step badges (parallel) | 🟢 |
| `theme_accent` | text (hex) | Page kit color | ⓘ |
| `theme_accent_contrast` | text (hex) | Compare-table left bg | 🟢 |
| `theme_accent_dark` | text (hex) | Page kit color (darker) | ⓘ |
| `theme_accent_secondary` | text (hex) | Indians strip right bg | 🟢 |
| `theme_accent_secondary_dark` | text (hex) | Indians strip right text | 🟢 |
| `theme_accent_soft` | text (hex) | Page tile bg | ⓘ |
| `timeline_subtitle` | multi_line | Health timeline subhead | 🔵 |
| `trust_strip_icons` | list.file_ref | Trust row parallel icons | 🟢 |
| `best_for` | text (variant) | Variant pack BEST FOR copy | 🟣 |
| `tag` | text (variant) | Variant pack tag badge | 🟣 |
| `variant_illustration` | file_ref (variant) | Variant pack illustration | 🟣 |

---

## Where to read this from in code

| Liquid expression | Returns |
|---|---|
| `product.metafields.custom.<key>` | Metafield wrapper. For text/numbers, prints directly. |
| `product.metafields.custom.<key>.value` | Underlying parsed value. Required for `video_tag` etc. |
| `product.metafields.custom.<list_key>.value` | Array of items (text, files, or metaobjects). Iterate with `for`. |
| `product.metafields.custom.<list_metaobj>.value.first.<field>` | Field on first metaobject entry. Use parallel-loop pluck for indexed access. |
| `product.metafields.custom.<file_ref> \| image_url: width: N` | CDN URL for image. For SVG, returns the original URL. |
| `variant.metafields.custom.<key>` | Variant metafield. |

For the most accurate cross-reference of which metafield drives which DOM element, see the section liquid files:
- `shopify/sections/sprout-maker-pdp.liquid`
- `shopify/sections/fermentation-kit-pdp.liquid`

The `?gbdebug=1` query param on any PDP surfaces the live values of all metafields and metaobject lists so you can verify what's reaching the storefront.
