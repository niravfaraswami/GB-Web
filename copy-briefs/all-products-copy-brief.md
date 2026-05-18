# GutBasket — Product Copy Brief

_Master document covering all 64 catalogue products. One section per product. Fill in the blanks; existing values are starting points — edit them. When every product is marked ✅ Done, this doc is converted back to the 3 Matrixify CSVs for upload._

---

## How to use this doc

1. Each product has its own H2 section. Use **Outline view** in Google Docs to navigate quickly (View → Show outline).
2. Mark the status at the top of each product:  ☐ Draft  →  ☐ Review  →  ☐ Done.
3. Edit any field by replacing the value after the colon (`**Field:** value`).
4. For list fields (Features, Specs, Use cases), edit the numbered items inline.
5. Do **not** rename field labels — the converter script keys off them.
6. When **every** product is ✅ Done, ping engineering to run the brief → CSV converter and import via Matrixify.

### Where each field shows up on the page

| PDP section | Source metafields |
|-------------|-------------------|
| Hero (top) | `category_label` / `hero_tagline`, `tagline`, `rating`, `review_count`, `bought_today`, `discount_badge`, `short_name` |
| Visual accent | `kit_color`, `kit_color_dark`, `kit_color_soft` (Jars & Tools also uses `gutbasket.tools.kit_color`) |
| Features grid | `features_h1`, `features_intro`, `features[]`, `feature_icons[]` (Jars & Tools) |
| Specs table | `specs[]`, `compatible_with` (Jars & Tools) |
| Use cases grid | `use_cases[]`, `use_case_icons[]` (Jars & Tools) |
| Process card | `days_to_ferment`, `days_subtitle` (Kits) |
| Trust strip | `hero_trust_strip[]`, `hero_benefits_icons[]` (Kits) |

---

# PART 1 — Metafield definitions to create in Shopify Admin

_Create these in `Settings → Custom data → Products`. Use **the order below** — Shopify shows metafields on the product page in admin in the same order their definitions were created. This ordering matches each PDP's top-to-bottom layout, so when a writer opens a product in admin the fields flow naturally._

## 1.1 `gutbasket.tools.*` — Jars & Tools PDP (18 products)

| Order | Key | Type | Section on page | Required |
|-------|-----|------|-----------------|----------|
| 1 | `category_label` | Single line text | Hero chip | Yes |
| 2 | `tagline` | Single line text | Hero subtitle | Yes |
| 3 | `bought_today` | Integer | Hero activity row | No |
| 4 | `rating` | Single line text | Hero rating | Yes |
| 5 | `review_count` | Integer | Hero rating | Yes |
| 6 | `kit_color` | Color | Accent (button, dot, chip bg) | Yes |
| 7 | `kit_color_dark` | Color | Accent (price text, hover) | Yes |
| 8 | `kit_color_soft` | Color | Accent (chip bg, image bg) | Yes |
| 9 | `features_h1` | Single line text | Features section heading | Yes |
| 10 | `features_intro` | Multi-line text | Features section intro paragraph | Yes |
| 11 | `features` | JSON | 4 feature cards (label + desc pairs) | Yes |
| 12 | `feature_icons` | List of single-line text | 4 feature icons (emoji) | Yes |
| 13 | `specs` | JSON | Specs table rows (label + value pairs) | Yes |
| 14 | `use_cases` | JSON | Use cases grid (label + desc pairs) | Yes |
| 15 | `use_case_icons` | List of single-line text | Use case icons (emoji) | Yes |
| 16 | `compatible_with` | Multi-line text | "Works with" strip under specs | Yes |

## 1.2 `gutbasket.*` — Cart drawer + global (all 64 products)

| Order | Key | Type | Section on page |
|-------|-----|------|-----------------|
| 1 | `kit_color` | Color | Cart drawer accent (progress bar, line item highlight) |
| 2 | `kit_color_dark` | Color | Cart drawer accent (hover, dark variant) |
| 3 | `kit_color_soft` | Color | Cart drawer accent (background tints) |
| 4 | `cart_addon_ids` | List of product references | Cart drawer "frequently added" strip suggestions |

_Note: `cart_addon_ids` cannot be imported via CSV (Shopify references need GIDs, not handles). Set in admin per product, ideally after all products are created._

## 1.3 `custom.*` — Existing kit PDPs (11 products)

| Order | Key | Type | Section on page | Required |
|-------|-----|------|-----------------|----------|
| 1 | `hero_tagline` | Single line text | Hero subtitle | Yes |
| 2 | `short_name` | Single line text | Header/breadcrumb shortname | Yes |
| 3 | `kit_label_format` | Single line text | "X Kit" label pattern | No |
| 4 | `product_name_short` | Single line text | Sticky ATC bar, header | No |
| 5 | `discount_badge` | Single line text | Hero badge ("SAVE 30%") | No |
| 6 | `theme_accent` | Color | Page accent (CTA, dots, chips) | Yes |
| 7 | `theme_accent_dark` | Color | Accent dark variant | Yes |
| 8 | `theme_accent_soft` | Color | Accent soft (backgrounds) | Yes |
| 9 | `rating` | Single line text | Hero rating | Yes |
| 10 | `review_count` | Integer | Hero rating | Yes |
| 11 | `bought_today` | Integer | Hero activity row | No |
| 12 | `days_to_ferment` | Integer | Process timing card | Yes |
| 13 | `days_subtitle` | Single line text | Process card subtitle | Yes |
| 14 | `jar_capacity` | Single line text | Hero spec line (sprout maker) | No |
| 15 | `pdp_template` | Single line text | Internal — template variant hint | No |
| 16 | `hero_trust_strip` | List of single-line text | Trust chips row | Yes |
| 17 | `hero_benefits_icons` | List of single-line text | Hero benefit icons | No |
| 18 | `benefits_icons` | List of single-line text | Benefits section icons | No |
| 19 | `trust_strip_icons` | List of single-line text | Trust strip icons | No |
| 20 | `step_icons` | List of single-line text | "How to make" step icons | No |

---

# PART 2 — Product copy briefs

_64 products. Grouped by template type. Each product has its own H2 section so it appears in the document outline._

## Jars & Tools (18 products · template: jars-tools)

### Kombucha Jar 4 L - With Tap And Steel Stand

**Handle:** `kombucha-jar-5-6l-with-tap-and-steel-stand`
**Template:** `jars-tools`
**Type / Vendor:** _(unset)_
**Price:** ₹1400.00
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Category chip:** JAR
- **Tagline:** TODO: write a one-line product tagline for Kombucha Jar 4 L - With Tap And Steel Stand.
- **Rating:** 4.78
- **Review count:** 80
- **Bought today:** 25

#### Accent (visual)
- **Kit color:** #A88554
- **Kit color dark:** #7E6340
- **Kit color soft:** #E8DAC4

#### Why this design — Features section
- **Heading (H1):** WHY THIS JAR.
- **Intro paragraph:** TODO: write a 1–2 sentence intro for the features grid on Kombucha Jar 4 L - With Tap And Steel Stand.
- **Features (4 items: bold label, then description):**
  1. **FEATURE 1** — TODO: short benefit.
  2. **FEATURE 2** — TODO: short benefit.
  3. **FEATURE 3** — TODO: short benefit.
  4. **FEATURE 4** — TODO: short benefit.
- **Feature icons (4 emoji, one per feature):**
  1. ◇
  2. ◆
  3. △
  4. ◎

#### Specs table
- **Specs (6 rows: bold label, then value):**
  1. **Material** — TODO
  2. **Dimensions** — TODO
  3. **Compatible With** — TODO
  4. **Dishwasher Safe** — TODO
  5. **Reusable** — TODO
  6. **Notes** — TODO
- **Compatible with:** TODO: list compatible kits / jars.

#### Use cases
- **Use cases (4 items: bold label, then description):**
  1. **USE 1** — TODO
  2. **USE 2** — TODO
  3. **USE 3** — TODO
  4. **USE 4** — TODO
- **Use case icons (4 emoji, one per use):**
  1. 🫙
  2. 🧪
  3. 🥬
  4. ♻️

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #A88554
- **gutbasket.kit_color_dark:** #7E6340
- **gutbasket.kit_color_soft:** #E8DAC4

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin after import): _list 3–6 related products_
- ☐ Product images uploaded

---

### pH strip

**Handle:** `a-ph-strip`
**Template:** `jars-tools`
**Type / Vendor:** _(unset)_
**Price:** ₹100.00
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Category chip:** TESTER
- **Tagline:** TODO: write a one-line product tagline for pH strip.
- **Rating:** 4.78
- **Review count:** 80
- **Bought today:** 25

#### Accent (visual)
- **Kit color:** #DDA738
- **Kit color dark:** #B07F1A
- **Kit color soft:** #F5E4B8

#### Why this design — Features section
- **Heading (H1):** WHY THIS TESTER.
- **Intro paragraph:** TODO: write a 1–2 sentence intro for the features grid on pH strip.
- **Features (4 items: bold label, then description):**
  1. **FEATURE 1** — TODO: short benefit.
  2. **FEATURE 2** — TODO: short benefit.
  3. **FEATURE 3** — TODO: short benefit.
  4. **FEATURE 4** — TODO: short benefit.
- **Feature icons (4 emoji, one per feature):**
  1. ◇
  2. ◆
  3. △
  4. ◎

#### Specs table
- **Specs (6 rows: bold label, then value):**
  1. **Material** — TODO
  2. **Dimensions** — TODO
  3. **Compatible With** — TODO
  4. **Dishwasher Safe** — TODO
  5. **Reusable** — TODO
  6. **Notes** — TODO
- **Compatible with:** TODO: list compatible kits / jars.

#### Use cases
- **Use cases (4 items: bold label, then description):**
  1. **USE 1** — TODO
  2. **USE 2** — TODO
  3. **USE 3** — TODO
  4. **USE 4** — TODO
- **Use case icons (4 emoji, one per use):**
  1. 🫙
  2. 🧪
  3. 🥬
  4. ♻️

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #DDA738
- **gutbasket.kit_color_dark:** #B07F1A
- **gutbasket.kit_color_soft:** #F5E4B8

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin after import): _list 3–6 related products_
- ☐ Product images uploaded

---

### Funnel

**Handle:** `a-funnel`
**Template:** `jars-tools`
**Type / Vendor:** _(unset)_
**Price:** ₹100.00
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Category chip:** TOOL
- **Tagline:** TODO: write a one-line product tagline for Funnel.
- **Rating:** 4.78
- **Review count:** 80
- **Bought today:** 25

#### Accent (visual)
- **Kit color:** #E66800
- **Kit color dark:** #B85100
- **Kit color soft:** #FFE2C7

#### Why this design — Features section
- **Heading (H1):** WHY THIS TOOL.
- **Intro paragraph:** TODO: write a 1–2 sentence intro for the features grid on Funnel.
- **Features (4 items: bold label, then description):**
  1. **FEATURE 1** — TODO: short benefit.
  2. **FEATURE 2** — TODO: short benefit.
  3. **FEATURE 3** — TODO: short benefit.
  4. **FEATURE 4** — TODO: short benefit.
- **Feature icons (4 emoji, one per feature):**
  1. ◇
  2. ◆
  3. △
  4. ◎

#### Specs table
- **Specs (6 rows: bold label, then value):**
  1. **Material** — TODO
  2. **Dimensions** — TODO
  3. **Compatible With** — TODO
  4. **Dishwasher Safe** — TODO
  5. **Reusable** — TODO
  6. **Notes** — TODO
- **Compatible with:** TODO: list compatible kits / jars.

#### Use cases
- **Use cases (4 items: bold label, then description):**
  1. **USE 1** — TODO
  2. **USE 2** — TODO
  3. **USE 3** — TODO
  4. **USE 4** — TODO
- **Use case icons (4 emoji, one per use):**
  1. 🫙
  2. 🧪
  3. 🥬
  4. ♻️

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #E66800
- **gutbasket.kit_color_dark:** #B85100
- **gutbasket.kit_color_soft:** #FFE2C7

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin after import): _list 3–6 related products_
- ☐ Product images uploaded

---

### Fermentation Glass weight

**Handle:** `a-glass-weight`
**Template:** `jars-tools`
**Type / Vendor:** Fermentation Kits
**Price:** ₹600.00
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Category chip:** TOOL
- **Tagline:** Pushes vegetables under brine. Above brine = mould risk. Glass weight = safe ferment.
- **Rating:** 4.84
- **Review count:** 220
- **Bought today:** 80

#### Accent (visual)
- **Kit color:** #0097B2
- **Kit color dark:** #077E94
- **Kit color soft:** #C2E5ED

#### Why this design — Features section
- **Heading (H1):** KEEP VEGGIES UNDER BRINE.
- **Intro paragraph:** During fermentation, vegetables float to the top. Anything above the brine line is exposed to air = mould. The glass weight pushes vegetables under.
- **Features (4 items: bold label, then description):**
  1. **SUBMERGED** — Pushes veggies under brine.
  2. **PURE GLASS** — No leaching, no rust.
  3. **NOTCHED** — Easy to lift out.
  4. **SET OF 2** — One per jar + spare.
- **Feature icons (4 emoji, one per feature):**
  1. ⚓
  2. 💎
  3. 🪝
  4. ②

#### Specs table
- **Specs (6 rows: bold label, then value):**
  1. **Pack** — 2 weights per set
  2. **Material** — Pure glass, no metal
  3. **Diameter** — 70mm
  4. **Compatible With** — GutBasket 1L + 2L + mason jars
  5. **Dishwasher Safe** — Yes
  6. **Notch** — For easy retrieval
- **Compatible with:** All wide-mouth fermentation jars + 1L and 2L sizes

#### Use cases
- **Use cases (4 items: bold label, then description):**
  1. **SAUERKRAUT** — Submerge cabbage
  2. **CARROTS** — Hold sticks under brine
  3. **PICKLED VEG** — Any submerged ferment
  4. **GARLIC** — Whole-clove fermenting
- **Use case icons (4 emoji, one per use):**
  1. 🥬
  2. 🥕
  3. 🥒
  4. 🧄

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #0097B2
- **gutbasket.kit_color_dark:** #077E94
- **gutbasket.kit_color_soft:** #C2E5ED

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin after import): _list 3–6 related products_
- ☐ Product images uploaded

---

### Triple Scale Hydrometer

**Handle:** `a-hydrometer`
**Template:** `jars-tools`
**Type / Vendor:** _(unset)_
**Price:** ₹990.00
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Category chip:** TESTER
- **Tagline:** TODO: write a one-line product tagline for Triple Scale Hydrometer.
- **Rating:** 4.78
- **Review count:** 80
- **Bought today:** 25

#### Accent (visual)
- **Kit color:** #8B1F40
- **Kit color dark:** #6E1733
- **Kit color soft:** #F4D7DD

#### Why this design — Features section
- **Heading (H1):** WHY THIS TESTER.
- **Intro paragraph:** TODO: write a 1–2 sentence intro for the features grid on Triple Scale Hydrometer.
- **Features (4 items: bold label, then description):**
  1. **FEATURE 1** — TODO: short benefit.
  2. **FEATURE 2** — TODO: short benefit.
  3. **FEATURE 3** — TODO: short benefit.
  4. **FEATURE 4** — TODO: short benefit.
- **Feature icons (4 emoji, one per feature):**
  1. ◇
  2. ◆
  3. △
  4. ◎

#### Specs table
- **Specs (6 rows: bold label, then value):**
  1. **Material** — TODO
  2. **Dimensions** — TODO
  3. **Compatible With** — TODO
  4. **Dishwasher Safe** — TODO
  5. **Reusable** — TODO
  6. **Notes** — TODO
- **Compatible with:** TODO: list compatible kits / jars.

#### Use cases
- **Use cases (4 items: bold label, then description):**
  1. **USE 1** — TODO
  2. **USE 2** — TODO
  3. **USE 3** — TODO
  4. **USE 4** — TODO
- **Use case icons (4 emoji, one per use):**
  1. 🫙
  2. 🧪
  3. 🥬
  4. ♻️

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #8B1F40
- **gutbasket.kit_color_dark:** #6E1733
- **gutbasket.kit_color_soft:** #F4D7DD

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin after import): _list 3–6 related products_
- ☐ Product images uploaded

---

### Mesh Strainer

**Handle:** `a-mesh-strainer`
**Template:** `jars-tools`
**Type / Vendor:** _(unset)_
**Price:** ₹100.00
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Category chip:** TOOL
- **Tagline:** TODO: write a one-line product tagline for Mesh Strainer.
- **Rating:** 4.78
- **Review count:** 80
- **Bought today:** 25

#### Accent (visual)
- **Kit color:** #E85C41
- **Kit color dark:** #B83D26
- **Kit color soft:** #FAD3CB

#### Why this design — Features section
- **Heading (H1):** WHY THIS TOOL.
- **Intro paragraph:** TODO: write a 1–2 sentence intro for the features grid on Mesh Strainer.
- **Features (4 items: bold label, then description):**
  1. **FEATURE 1** — TODO: short benefit.
  2. **FEATURE 2** — TODO: short benefit.
  3. **FEATURE 3** — TODO: short benefit.
  4. **FEATURE 4** — TODO: short benefit.
- **Feature icons (4 emoji, one per feature):**
  1. ◇
  2. ◆
  3. △
  4. ◎

#### Specs table
- **Specs (6 rows: bold label, then value):**
  1. **Material** — TODO
  2. **Dimensions** — TODO
  3. **Compatible With** — TODO
  4. **Dishwasher Safe** — TODO
  5. **Reusable** — TODO
  6. **Notes** — TODO
- **Compatible with:** TODO: list compatible kits / jars.

#### Use cases
- **Use cases (4 items: bold label, then description):**
  1. **USE 1** — TODO
  2. **USE 2** — TODO
  3. **USE 3** — TODO
  4. **USE 4** — TODO
- **Use case icons (4 emoji, one per use):**
  1. 🫙
  2. 🧪
  3. 🥬
  4. ♻️

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #E85C41
- **gutbasket.kit_color_dark:** #B83D26
- **gutbasket.kit_color_soft:** #FAD3CB

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin after import): _list 3–6 related products_
- ☐ Product images uploaded

---

### Silicons Bungs

**Handle:** `a-silicons-bungs`
**Template:** `jars-tools`
**Type / Vendor:** _(unset)_
**Price:** ₹0.00
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Category chip:** PART
- **Tagline:** TODO: write a one-line product tagline for Silicons Bungs.
- **Rating:** 4.78
- **Review count:** 80
- **Bought today:** 25

#### Accent (visual)
- **Kit color:** #1F1F1D
- **Kit color dark:** #000000
- **Kit color soft:** #D5D5D3

#### Why this design — Features section
- **Heading (H1):** WHY THIS PART.
- **Intro paragraph:** TODO: write a 1–2 sentence intro for the features grid on Silicons Bungs.
- **Features (4 items: bold label, then description):**
  1. **FEATURE 1** — TODO: short benefit.
  2. **FEATURE 2** — TODO: short benefit.
  3. **FEATURE 3** — TODO: short benefit.
  4. **FEATURE 4** — TODO: short benefit.
- **Feature icons (4 emoji, one per feature):**
  1. ◇
  2. ◆
  3. △
  4. ◎

#### Specs table
- **Specs (6 rows: bold label, then value):**
  1. **Material** — TODO
  2. **Dimensions** — TODO
  3. **Compatible With** — TODO
  4. **Dishwasher Safe** — TODO
  5. **Reusable** — TODO
  6. **Notes** — TODO
- **Compatible with:** TODO: list compatible kits / jars.

#### Use cases
- **Use cases (4 items: bold label, then description):**
  1. **USE 1** — TODO
  2. **USE 2** — TODO
  3. **USE 3** — TODO
  4. **USE 4** — TODO
- **Use case icons (4 emoji, one per use):**
  1. 🫙
  2. 🧪
  3. 🥬
  4. ♻️

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #1F1F1D
- **gutbasket.kit_color_dark:** #000000
- **gutbasket.kit_color_soft:** #D5D5D3

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin after import): _list 3–6 related products_
- ☐ Product images uploaded

---

### Fermentation Jar with Airlock - 1 Litre

**Handle:** `a-fermentation-jars`
**Template:** `jars-tools`
**Type / Vendor:** Jar
**Price:** ₹499.00  (compare-at ₹999.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Category chip:** JAR
- **Tagline:** Smaller version of our hero jar. For single-serving ferments and starter batches.
- **Rating:** 4.84
- **Review count:** 220
- **Bought today:** 80

#### Accent (visual)
- **Kit color:** #4F7C57
- **Kit color dark:** #3F6346
- **Kit color soft:** #D8E4DC

#### Why this design — Features section
- **Heading (H1):** SOLO FERMENTERS, START HERE.
- **Intro paragraph:** Single-person households or trial-batch fermenting? The 1L jar is sized for ~600g of vegetables, perfect for one person eating fermented foods daily.
- **Features (4 items: bold label, then description):**
  1. **SOLO-SIZED** — One person 2-week supply.
  2. **SAME QUALITY** — Borosilicate glass, same threads as 2L.
  3. **AIRLOCK READY** — Same airlock and weight as 2L.
  4. **TRY-FIRST** — Cheaper entry point.
- **Feature icons (4 emoji, one per feature):**
  1. 👤
  2. 💎
  3. △
  4. 💸

#### Specs table
- **Specs (6 rows: bold label, then value):**
  1. **Capacity** — 1 L (33 fl oz)
  2. **Material** — Borosilicate glass + BPA-free
  3. **Mouth Width** — 85mm
  4. **Compatibility** — Standard airlock + glass weight
  5. **Dishwasher Safe** — Yes
  6. **Microwave Safe** — Yes (without lid)
- **Compatible with:** All fermentation kits + works as smaller batch alternative

#### Use cases
- **Use cases (4 items: bold label, then description):**
  1. **SINGLE FERMENTS** — ~600g veg / 700ml liquid
  2. **TRIAL BATCHES** — Test recipes before committing
  3. **COUPLES** — One-week supply for two
  4. **STORAGE** — Compact fridge storage
- **Use case icons (4 emoji, one per use):**
  1. 🥬
  2. 🧪
  3. 👫
  4. ❄️

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #4F7C57
- **gutbasket.kit_color_dark:** #3F6346
- **gutbasket.kit_color_soft:** #D8E4DC

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin after import): _list 3–6 related products_
- ☐ Product images uploaded

---

### Airlock for Safe Fermentation

**Handle:** `a-airlock`
**Template:** `jars-tools`
**Type / Vendor:** _(unset)_
**Price:** ₹270.00  (compare-at ₹300.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Category chip:** TOOL
- **Tagline:** Lets CO2 out. Keeps oxygen out. The single most important fermentation accessory.
- **Rating:** 4.84
- **Review count:** 220
- **Bought today:** 80

#### Accent (visual)
- **Kit color:** #15BA97
- **Kit color dark:** #0F8C72
- **Kit color soft:** #CDEDE3

#### Why this design — Features section
- **Heading (H1):** NO MORE DAILY BURPING.
- **Intro paragraph:** Without an airlock, your jar builds CO2 pressure and you have to burp it daily. With an airlock, the CO2 escapes through a water-sealed valve and oxygen (which causes mould) cant get back in.
- **Features (4 items: bold label, then description):**
  1. **CO2 OUT** — Fermentation gas escapes through water seal.
  2. **OXYGEN BLOCKED** — No oxygen in = no mould risk.
  3. **NO BURPING** — Truly hands-off.
  4. **REUSABLE** — Lifetime use.
- **Feature icons (4 emoji, one per feature):**
  1. 💨
  2. 🛡️
  3. ✋
  4. ♻️

#### Specs table
- **Specs (6 rows: bold label, then value):**
  1. **Includes** — 2 airlocks + 2 silicone grommets + jar lid
  2. **Material** — Food-grade silicone + BPA-free plastic
  3. **Compatible With** — Mason jars + GutBasket fermenter jars
  4. **Reusable** — Yes — washable, lifetime
  5. **Dishwasher Safe** — Top rack only
  6. **How It Works** — CO2 bubbles out, oxygen blocked
- **Compatible with:** All GutBasket fermenter jars + standard wide-mouth mason jars

#### Use cases
- **Use cases (4 items: bold label, then description):**
  1. **VEG FERMENTS** — Sauerkraut, kimchi, achaar
  2. **DRINKS** — Kanji, kombucha second ferment
  3. **SOURDOUGH** — Bulk ferment + retarding
  4. **ANY 1L+ JAR** — Universal fit
- **Use case icons (4 emoji, one per use):**
  1. 🥬
  2. 🍶
  3. 🍞
  4. 🫙

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #15BA97
- **gutbasket.kit_color_dark:** #0F8C72
- **gutbasket.kit_color_soft:** #CDEDE3

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin after import): _list 3–6 related products_
- ☐ Product images uploaded

---

### Fermentation Jar with Airlock - 2 Litre - Wide Mouth

**Handle:** `fermentation-jar-wide-mouth-2-litre`
**Template:** `jars-tools`
**Type / Vendor:** Jar
**Price:** ₹949.00  (compare-at ₹1499.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Category chip:** JAR
- **Tagline:** Wide-mouth glass jar with airlock-ready lid. The hero of your fermentation kitchen.
- **Rating:** 4.84
- **Review count:** 220
- **Bought today:** 80

#### Accent (visual)
- **Kit color:** #4F7C57
- **Kit color dark:** #3F6346
- **Kit color soft:** #D8E4DC

#### Why this design — Features section
- **Heading (H1):** BUILT FOR FERMENTATION.
- **Intro paragraph:** Most jars in your kitchen werent designed for fermentation. This one is. Wide mouth fits chunks. Smooth interior makes cleaning easy.
- **Features (4 items: bold label, then description):**
  1. **WIDE MOUTH** — Fits whole vegetables.
  2. **BOROSILICATE** — Heat-stable, no cracking.
  3. **AIRLOCK READY** — Standard thread.
  4. **LIFETIME** — Glass + steel lid.
- **Feature icons (4 emoji, one per feature):**
  1. ⊕
  2. ◇
  3. △
  4. ◎

#### Specs table
- **Specs (6 rows: bold label, then value):**
  1. **Capacity** — 2 L (66 fl oz)
  2. **Material** — Borosilicate glass + BPA-free
  3. **Mouth Width** — 90mm
  4. **Compatibility** — Standard airlock + weight
  5. **Dishwasher Safe** — Yes
  6. **Microwave Safe** — Yes (without lid)
- **Compatible with:** Probiotic Achaar Kit + Kanji Making Kit + Aam Panna Kit + Vegetable Fermentation Kit + Kimchi Making Kit

#### Use cases
- **Use cases (4 items: bold label, then description):**
  1. **FERMENT KITS** — Achaar, kanji, kimchi, vegetables
  2. **SPROUTING** — Mesh-lid swap
  3. **PICKLING** — Salt-only pickles
  4. **STORAGE** — Fridge after fermenting
- **Use case icons (4 emoji, one per use):**
  1. 🥬
  2. 🌱
  3. 🥒
  4. ❄️

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #4F7C57
- **gutbasket.kit_color_dark:** #3F6346
- **gutbasket.kit_color_soft:** #D8E4DC

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin after import): _list 3–6 related products_
- ☐ Product images uploaded

---

### Fermentation Jar with Airlock - 4 Litre - Wide Mouth

**Handle:** `fermentation-jar-wide-mouth-4-litre`
**Template:** `jars-tools`
**Type / Vendor:** Jar
**Price:** ₹1290.00  (compare-at ₹1999.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Category chip:** JAR
- **Tagline:** Family-size wide-mouth glass jar with airlock-ready lid. The hero of bigger ferments.
- **Rating:** 4.84
- **Review count:** 220
- **Bought today:** 80

#### Accent (visual)
- **Kit color:** #4F7C57
- **Kit color dark:** #3F6346
- **Kit color soft:** #D8E4DC

#### Why this design — Features section
- **Heading (H1):** BUILT FOR FERMENTATION.
- **Intro paragraph:** Same wide-mouth borosilicate design as the 2L, doubled in capacity for family-size batches and brewing.
- **Features (4 items: bold label, then description):**
  1. **WIDE MOUTH** — Fits whole vegetables.
  2. **BOROSILICATE** — Heat-stable.
  3. **AIRLOCK READY** — Standard thread.
  4. **LIFETIME** — Glass + steel lid.
- **Feature icons (4 emoji, one per feature):**
  1. ⊕
  2. ◇
  3. △
  4. ◎

#### Specs table
- **Specs (6 rows: bold label, then value):**
  1. **Capacity** — 4 L (135 fl oz)
  2. **Material** — Borosilicate glass + BPA-free
  3. **Mouth Width** — 110mm
  4. **Compatibility** — Standard airlock + weight
  5. **Dishwasher Safe** — Yes
  6. **Microwave Safe** — Yes (without lid)
- **Compatible with:** Probiotic Achaar Kit + Kanji Making Kit + Vegetable Fermentation Kit + Kimchi Making Kit

#### Use cases
- **Use cases (4 items: bold label, then description):**
  1. **BIG FERMENTS** — 2-week supply for family
  2. **BREWING** — Kombucha, jun, ginger beer
  3. **BULK PICKLING** — Whole-vegetable preserves
  4. **STORAGE** — Pantry-stable batches
- **Use case icons (4 emoji, one per use):**
  1. 🥬
  2. 🍵
  3. 🥒
  4. ❄️

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #4F7C57
- **gutbasket.kit_color_dark:** #3F6346
- **gutbasket.kit_color_soft:** #D8E4DC

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin after import): _list 3–6 related products_
- ☐ Product images uploaded

---

### HDPE Plastic Carboy (8 Litre)

**Handle:** `fermentation-jar-narrow-mouth-hdpe-8-litre`
**Template:** `jars-tools`
**Type / Vendor:** _(unset)_
**Price:** ₹1699.00
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Category chip:** CARBOY
- **Tagline:** TODO: write a one-line product tagline for HDPE Plastic Carboy (8 Litre).
- **Rating:** 4.78
- **Review count:** 80
- **Bought today:** 25

#### Accent (visual)
- **Kit color:** #5C4D3F
- **Kit color dark:** #3F342B
- **Kit color soft:** #DCD4C7

#### Why this design — Features section
- **Heading (H1):** WHY THIS CARBOY.
- **Intro paragraph:** TODO: write a 1–2 sentence intro for the features grid on HDPE Plastic Carboy (8 Litre).
- **Features (4 items: bold label, then description):**
  1. **FEATURE 1** — TODO: short benefit.
  2. **FEATURE 2** — TODO: short benefit.
  3. **FEATURE 3** — TODO: short benefit.
  4. **FEATURE 4** — TODO: short benefit.
- **Feature icons (4 emoji, one per feature):**
  1. ◇
  2. ◆
  3. △
  4. ◎

#### Specs table
- **Specs (6 rows: bold label, then value):**
  1. **Material** — TODO
  2. **Dimensions** — TODO
  3. **Compatible With** — TODO
  4. **Dishwasher Safe** — TODO
  5. **Reusable** — TODO
  6. **Notes** — TODO
- **Compatible with:** TODO: list compatible kits / jars.

#### Use cases
- **Use cases (4 items: bold label, then description):**
  1. **USE 1** — TODO
  2. **USE 2** — TODO
  3. **USE 3** — TODO
  4. **USE 4** — TODO
- **Use case icons (4 emoji, one per use):**
  1. 🫙
  2. 🧪
  3. 🥬
  4. ♻️

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #5C4D3F
- **gutbasket.kit_color_dark:** #3F342B
- **gutbasket.kit_color_soft:** #DCD4C7

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin after import): _list 3–6 related products_
- ☐ Product images uploaded

---

### Fermentation Glass Carboy -Amber (4 Litre)

**Handle:** `glass-carboy-4-litre`
**Template:** `jars-tools`
**Type / Vendor:** _(unset)_
**Price:** ₹1890.00
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Category chip:** CARBOY
- **Tagline:** TODO: write a one-line product tagline for Fermentation Glass Carboy -Amber (4 Litre).
- **Rating:** 4.78
- **Review count:** 80
- **Bought today:** 25

#### Accent (visual)
- **Kit color:** #6E3A1F
- **Kit color dark:** #4F2916
- **Kit color soft:** #E8D5C4

#### Why this design — Features section
- **Heading (H1):** WHY THIS CARBOY.
- **Intro paragraph:** TODO: write a 1–2 sentence intro for the features grid on Fermentation Glass Carboy -Amber (4 Litre).
- **Features (4 items: bold label, then description):**
  1. **FEATURE 1** — TODO: short benefit.
  2. **FEATURE 2** — TODO: short benefit.
  3. **FEATURE 3** — TODO: short benefit.
  4. **FEATURE 4** — TODO: short benefit.
- **Feature icons (4 emoji, one per feature):**
  1. ◇
  2. ◆
  3. △
  4. ◎

#### Specs table
- **Specs (6 rows: bold label, then value):**
  1. **Material** — TODO
  2. **Dimensions** — TODO
  3. **Compatible With** — TODO
  4. **Dishwasher Safe** — TODO
  5. **Reusable** — TODO
  6. **Notes** — TODO
- **Compatible with:** TODO: list compatible kits / jars.

#### Use cases
- **Use cases (4 items: bold label, then description):**
  1. **USE 1** — TODO
  2. **USE 2** — TODO
  3. **USE 3** — TODO
  4. **USE 4** — TODO
- **Use case icons (4 emoji, one per use):**
  1. 🫙
  2. 🧪
  3. 🥬
  4. ♻️

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #6E3A1F
- **gutbasket.kit_color_dark:** #4F2916
- **gutbasket.kit_color_soft:** #E8D5C4

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin after import): _list 3–6 related products_
- ☐ Product images uploaded

---

### Kombucha Glass Jar 4 L

**Handle:** `kombucha-jar`
**Template:** `jars-tools`
**Type / Vendor:** _(unset)_
**Price:** ₹850.00
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Category chip:** JAR
- **Tagline:** TODO: write a one-line product tagline for Kombucha Glass Jar 4 L.
- **Rating:** 4.78
- **Review count:** 80
- **Bought today:** 25

#### Accent (visual)
- **Kit color:** #A88554
- **Kit color dark:** #7E6340
- **Kit color soft:** #E8DAC4

#### Why this design — Features section
- **Heading (H1):** WHY THIS JAR.
- **Intro paragraph:** TODO: write a 1–2 sentence intro for the features grid on Kombucha Glass Jar 4 L.
- **Features (4 items: bold label, then description):**
  1. **FEATURE 1** — TODO: short benefit.
  2. **FEATURE 2** — TODO: short benefit.
  3. **FEATURE 3** — TODO: short benefit.
  4. **FEATURE 4** — TODO: short benefit.
- **Feature icons (4 emoji, one per feature):**
  1. ◇
  2. ◆
  3. △
  4. ◎

#### Specs table
- **Specs (6 rows: bold label, then value):**
  1. **Material** — TODO
  2. **Dimensions** — TODO
  3. **Compatible With** — TODO
  4. **Dishwasher Safe** — TODO
  5. **Reusable** — TODO
  6. **Notes** — TODO
- **Compatible with:** TODO: list compatible kits / jars.

#### Use cases
- **Use cases (4 items: bold label, then description):**
  1. **USE 1** — TODO
  2. **USE 2** — TODO
  3. **USE 3** — TODO
  4. **USE 4** — TODO
- **Use case icons (4 emoji, one per use):**
  1. 🫙
  2. 🧪
  3. 🥬
  4. ♻️

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #A88554
- **gutbasket.kit_color_dark:** #7E6340
- **gutbasket.kit_color_soft:** #E8DAC4

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin after import): _list 3–6 related products_
- ☐ Product images uploaded

---

### Airtight glass bottles 1 L

**Handle:** `blue-airtight-glass-bottles-pack-of-4`
**Template:** `jars-tools`
**Type / Vendor:** _(unset)_
**Price:** ₹800.00
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Category chip:** BOTTLE
- **Tagline:** TODO: write a one-line product tagline for Airtight glass bottles 1 L.
- **Rating:** 4.78
- **Review count:** 80
- **Bought today:** 25

#### Accent (visual)
- **Kit color:** #0097B2
- **Kit color dark:** #077E94
- **Kit color soft:** #C2E5ED

#### Why this design — Features section
- **Heading (H1):** WHY THIS BOTTLE.
- **Intro paragraph:** TODO: write a 1–2 sentence intro for the features grid on Airtight glass bottles 1 L.
- **Features (4 items: bold label, then description):**
  1. **FEATURE 1** — TODO: short benefit.
  2. **FEATURE 2** — TODO: short benefit.
  3. **FEATURE 3** — TODO: short benefit.
  4. **FEATURE 4** — TODO: short benefit.
- **Feature icons (4 emoji, one per feature):**
  1. ◇
  2. ◆
  3. △
  4. ◎

#### Specs table
- **Specs (6 rows: bold label, then value):**
  1. **Material** — TODO
  2. **Dimensions** — TODO
  3. **Compatible With** — TODO
  4. **Dishwasher Safe** — TODO
  5. **Reusable** — TODO
  6. **Notes** — TODO
- **Compatible with:** TODO: list compatible kits / jars.

#### Use cases
- **Use cases (4 items: bold label, then description):**
  1. **USE 1** — TODO
  2. **USE 2** — TODO
  3. **USE 3** — TODO
  4. **USE 4** — TODO
- **Use case icons (4 emoji, one per use):**
  1. 🫙
  2. 🧪
  3. 🥬
  4. ♻️

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #0097B2
- **gutbasket.kit_color_dark:** #077E94
- **gutbasket.kit_color_soft:** #C2E5ED

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin after import): _list 3–6 related products_
- ☐ Product images uploaded

---

### Temperature Strip for brewing Kombucha or Beer

**Handle:** `stick-on-thermometer-strip-1`
**Template:** `jars-tools`
**Type / Vendor:** _(unset)_
**Price:** ₹299.00
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Category chip:** TESTER
- **Tagline:** TODO: write a one-line product tagline for Temperature Strip for brewing Kombucha or Beer.
- **Rating:** 4.78
- **Review count:** 80
- **Bought today:** 25

#### Accent (visual)
- **Kit color:** #15BA97
- **Kit color dark:** #0F8C72
- **Kit color soft:** #CDEDE3

#### Why this design — Features section
- **Heading (H1):** WHY THIS TESTER.
- **Intro paragraph:** TODO: write a 1–2 sentence intro for the features grid on Temperature Strip for brewing Kombucha or Beer.
- **Features (4 items: bold label, then description):**
  1. **FEATURE 1** — TODO: short benefit.
  2. **FEATURE 2** — TODO: short benefit.
  3. **FEATURE 3** — TODO: short benefit.
  4. **FEATURE 4** — TODO: short benefit.
- **Feature icons (4 emoji, one per feature):**
  1. ◇
  2. ◆
  3. △
  4. ◎

#### Specs table
- **Specs (6 rows: bold label, then value):**
  1. **Material** — TODO
  2. **Dimensions** — TODO
  3. **Compatible With** — TODO
  4. **Dishwasher Safe** — TODO
  5. **Reusable** — TODO
  6. **Notes** — TODO
- **Compatible with:** TODO: list compatible kits / jars.

#### Use cases
- **Use cases (4 items: bold label, then description):**
  1. **USE 1** — TODO
  2. **USE 2** — TODO
  3. **USE 3** — TODO
  4. **USE 4** — TODO
- **Use case icons (4 emoji, one per use):**
  1. 🫙
  2. 🧪
  3. 🥬
  4. ♻️

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #15BA97
- **gutbasket.kit_color_dark:** #0F8C72
- **gutbasket.kit_color_soft:** #CDEDE3

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin after import): _list 3–6 related products_
- ☐ Product images uploaded

---

### Pipette (Pack of 5)

**Handle:** `pipette-1`
**Template:** `jars-tools`
**Type / Vendor:** _(unset)_
**Price:** ₹200.00
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Category chip:** TESTER
- **Tagline:** TODO: write a one-line product tagline for Pipette (Pack of 5).
- **Rating:** 4.78
- **Review count:** 80
- **Bought today:** 25

#### Accent (visual)
- **Kit color:** #5DBC52
- **Kit color dark:** #459338
- **Kit color soft:** #D7F0D2

#### Why this design — Features section
- **Heading (H1):** WHY THIS TESTER.
- **Intro paragraph:** TODO: write a 1–2 sentence intro for the features grid on Pipette (Pack of 5).
- **Features (4 items: bold label, then description):**
  1. **FEATURE 1** — TODO: short benefit.
  2. **FEATURE 2** — TODO: short benefit.
  3. **FEATURE 3** — TODO: short benefit.
  4. **FEATURE 4** — TODO: short benefit.
- **Feature icons (4 emoji, one per feature):**
  1. ◇
  2. ◆
  3. △
  4. ◎

#### Specs table
- **Specs (6 rows: bold label, then value):**
  1. **Material** — TODO
  2. **Dimensions** — TODO
  3. **Compatible With** — TODO
  4. **Dishwasher Safe** — TODO
  5. **Reusable** — TODO
  6. **Notes** — TODO
- **Compatible with:** TODO: list compatible kits / jars.

#### Use cases
- **Use cases (4 items: bold label, then description):**
  1. **USE 1** — TODO
  2. **USE 2** — TODO
  3. **USE 3** — TODO
  4. **USE 4** — TODO
- **Use case icons (4 emoji, one per use):**
  1. 🫙
  2. 🧪
  3. 🥬
  4. ♻️

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #5DBC52
- **gutbasket.kit_color_dark:** #459338
- **gutbasket.kit_color_soft:** #D7F0D2

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin after import): _list 3–6 related products_
- ☐ Product images uploaded

---

### Grommet/ Washer for fermentation lid ( Set of 3 )

**Handle:** `grommet-washer-for-fermentation-lid-set-of-3`
**Template:** `jars-tools`
**Type / Vendor:** _(unset)_
**Price:** ₹150.00  (compare-at ₹240.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Category chip:** PART
- **Tagline:** TODO: write a one-line product tagline for Grommet/ Washer for fermentation lid ( Set of 3 ).
- **Rating:** 4.78
- **Review count:** 80
- **Bought today:** 25

#### Accent (visual)
- **Kit color:** #1F1F1D
- **Kit color dark:** #000000
- **Kit color soft:** #D5D5D3

#### Why this design — Features section
- **Heading (H1):** WHY THIS PART.
- **Intro paragraph:** TODO: write a 1–2 sentence intro for the features grid on Grommet/ Washer for fermentation lid ( Set of 3 ).
- **Features (4 items: bold label, then description):**
  1. **FEATURE 1** — TODO: short benefit.
  2. **FEATURE 2** — TODO: short benefit.
  3. **FEATURE 3** — TODO: short benefit.
  4. **FEATURE 4** — TODO: short benefit.
- **Feature icons (4 emoji, one per feature):**
  1. ◇
  2. ◆
  3. △
  4. ◎

#### Specs table
- **Specs (6 rows: bold label, then value):**
  1. **Material** — TODO
  2. **Dimensions** — TODO
  3. **Compatible With** — TODO
  4. **Dishwasher Safe** — TODO
  5. **Reusable** — TODO
  6. **Notes** — TODO
- **Compatible with:** TODO: list compatible kits / jars.

#### Use cases
- **Use cases (4 items: bold label, then description):**
  1. **USE 1** — TODO
  2. **USE 2** — TODO
  3. **USE 3** — TODO
  4. **USE 4** — TODO
- **Use case icons (4 emoji, one per use):**
  1. 🫙
  2. 🧪
  3. 🥬
  4. ♻️

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #1F1F1D
- **gutbasket.kit_color_dark:** #000000
- **gutbasket.kit_color_soft:** #D5D5D3

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin after import): _list 3–6 related products_
- ☐ Product images uploaded

---

## Kits & complete fermentation kits (11 products · existing kit templates)

### Kanji Kit with Glass Weight (2 Liter)

**Handle:** `kanji-kit-with-glass-weight-2-liter`
**Template:** `kit`
**Type / Vendor:** Fermentation Kits
**Price:** ₹2049.00
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Hero tagline:** Family-size Kanji kit with glass weight. 2L jar for batch brewing.
- **Short name:** Kanji Kit + Weight 2L
- **Kit label format:** Kanji Kit
- **Product name short:** Kanji Kit + Weight 2L
- **Discount badge:** SAVE 30%

#### Accent (visual)
- **Theme accent:** #8B1F40
- **Theme accent dark:** #6E1733
- **Theme accent soft:** #F4D7DD

#### Social proof
- **Rating:** 4.84
- **Review count:** 76
- **Bought today:** 19

#### Process timing card
- **Days to ferment:** 5
- **Days subtitle:** days to ferment

#### Trust strip & hero benefits
- **Hero trust strip (3 short chips):**
  1. Free shipping over Rs 999
  2. FSSAI Licensed
  3. Easy returns
- **Hero benefit icons (emoji or short text):**
  1. Probiotic
  2. No smell
  3. Reusable jar

#### Misc
- **Jar capacity (if applicable):** _(fill in)_
- **PDP template variant:** fermentation-kit

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #8B1F40
- **gutbasket.kit_color_dark:** #6E1733
- **gutbasket.kit_color_soft:** #F4D7DD

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin)
- ☐ Hero image / gallery uploaded

---

### Kanji Kit with Glass Weight (1 Liter)

**Handle:** `kanji-kit-with-glass-weight-1-liter`
**Template:** `kit`
**Type / Vendor:** Kanji
**Price:** ₹1599.00
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Hero tagline:** Kanji kit with glass weight. 1L jar for solo or couple servings.
- **Short name:** Kanji Kit + Weight 1L
- **Kit label format:** Kanji Kit
- **Product name short:** Kanji Kit + Weight 1L
- **Discount badge:** SAVE 25%

#### Accent (visual)
- **Theme accent:** #8B1F40
- **Theme accent dark:** #6E1733
- **Theme accent soft:** #F4D7DD

#### Social proof
- **Rating:** 4.82
- **Review count:** 89
- **Bought today:** 22

#### Process timing card
- **Days to ferment:** 5
- **Days subtitle:** days to ferment

#### Trust strip & hero benefits
- **Hero trust strip (3 short chips):**
  1. Free shipping over Rs 999
  2. FSSAI Licensed
  3. Easy returns
- **Hero benefit icons (emoji or short text):**
  1. Probiotic
  2. No smell
  3. Reusable jar

#### Misc
- **Jar capacity (if applicable):** _(fill in)_
- **PDP template variant:** fermentation-kit

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #8B1F40
- **gutbasket.kit_color_dark:** #6E1733
- **gutbasket.kit_color_soft:** #F4D7DD

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin)
- ☐ Hero image / gallery uploaded

---

### Kanji Making Kit - Old Layout

**Handle:** `kanji-making-kit-old-layout`
**Template:** `kit`
**Type / Vendor:** Fermentation Kits
**Price:** ₹1249.00  (compare-at ₹1999.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Hero tagline:** Same Kanji kit, classic layout. (Legacy template)
- **Short name:** Kanji Kit
- **Kit label format:** Kanji Kit
- **Product name short:** Kanji Kit
- **Discount badge:** SAVE 38%

#### Accent (visual)
- **Theme accent:** #8B1F40
- **Theme accent dark:** #6E1733
- **Theme accent soft:** #F4D7DD

#### Social proof
- **Rating:** 4.79
- **Review count:** 124
- **Bought today:** 12

#### Process timing card
- **Days to ferment:** 5
- **Days subtitle:** days to ferment

#### Trust strip & hero benefits
- **Hero trust strip (3 short chips):**
  1. Free shipping over Rs 999
  2. FSSAI Licensed
  3. Easy returns
- **Hero benefit icons (emoji or short text):**
  1. Probiotic
  2. No smell
  3. Reusable jar

#### Misc
- **Jar capacity (if applicable):** _(fill in)_
- **PDP template variant:** fermentation-kit

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #8B1F40
- **gutbasket.kit_color_dark:** #6E1733
- **gutbasket.kit_color_soft:** #F4D7DD

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin)
- ☐ Hero image / gallery uploaded

---

### Sprout Maker - 1 L

**Handle:** `sprout-maker-1-l`
**Template:** `kit`
**Type / Vendor:** Sprout
**Price:** ₹649.00  (compare-at ₹1299.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Hero tagline:** 1-litre sprouter for families. Same self-draining mesh, more sprouts per batch.
- **Short name:** Sprouts 1L
- **Kit label format:** Sprouts Kit
- **Product name short:** Sprouts 1L
- **Discount badge:** SAVE 50%

#### Accent (visual)
- **Theme accent:** #3F7754
- **Theme accent dark:** #2F5C40
- **Theme accent soft:** #D8E4DC

#### Social proof
- **Rating:** 4.83
- **Review count:** 198
- **Bought today:** 54

#### Process timing card
- **Days to ferment:** 3
- **Days subtitle:** days to harvest

#### Trust strip & hero benefits
- **Hero trust strip (3 short chips):**
  1. Free shipping over Rs 999
  2. FSSAI Licensed
  3. Easy returns
- **Hero benefit icons (emoji or short text):**
  1. Probiotic
  2. No smell
  3. Reusable jar

#### Misc
- **Jar capacity (if applicable):** 1L
- **PDP template variant:** sprout-maker

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #3F7754
- **gutbasket.kit_color_dark:** #2F5C40
- **gutbasket.kit_color_soft:** #D8E4DC

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin)
- ☐ Hero image / gallery uploaded

---

### Probiotic Achaar Making Kit

**Handle:** `probiotic-achaar-making-kit`
**Template:** `kit`
**Type / Vendor:** Fermentation Kits
**Price:** ₹1399.00  (compare-at ₹1999.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Hero tagline:** Grandmothers brine method. Salt + spice + time. Lacto-fermented oil-free achaar in 7 days.
- **Short name:** Achaar Kit
- **Kit label format:** Achaar Kit
- **Product name short:** Achaar Kit
- **Discount badge:** SAVE 30%

#### Accent (visual)
- **Theme accent:** #E66800
- **Theme accent dark:** #B85100
- **Theme accent soft:** #FFE2C7

#### Social proof
- **Rating:** 4.86
- **Review count:** 298
- **Bought today:** 78

#### Process timing card
- **Days to ferment:** 7
- **Days subtitle:** days to ferment

#### Trust strip & hero benefits
- **Hero trust strip (3 short chips):**
  1. Free shipping over Rs 999
  2. FSSAI Licensed
  3. Easy returns
- **Hero benefit icons (emoji or short text):**
  1. Probiotic
  2. No smell
  3. Reusable jar

#### Misc
- **Jar capacity (if applicable):** _(fill in)_
- **PDP template variant:** fermentation-kit

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #E66800
- **gutbasket.kit_color_dark:** #B85100
- **gutbasket.kit_color_soft:** #FFE2C7

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin)
- ☐ Hero image / gallery uploaded

---

### All-in-One Fermentation Kit

**Handle:** `ultimate-fermentation-kit`
**Template:** `kit`
**Type / Vendor:** Fermentation Kits
**Price:** ₹4999.00  (compare-at ₹5999.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Hero tagline:** Everything you need to ferment any vegetable, drink, or pickle. Glass jars, airlocks, weights, 4 recipe books.
- **Short name:** Ultimate Kit
- **Kit label format:** Ultimate Kit
- **Product name short:** Ultimate Kit
- **Discount badge:** BEST VALUE

#### Accent (visual)
- **Theme accent:** #FF7300
- **Theme accent dark:** #E66800
- **Theme accent soft:** #FFE4CC

#### Social proof
- **Rating:** 4.92
- **Review count:** 412
- **Bought today:** 104

#### Process timing card
- **Days to ferment:** 7
- **Days subtitle:** days to first batch

#### Trust strip & hero benefits
- **Hero trust strip (3 short chips):**
  1. Free shipping over Rs 999
  2. FSSAI Licensed
  3. Easy returns
- **Hero benefit icons (emoji or short text):**
  1. Probiotic
  2. No smell
  3. Reusable jar

#### Misc
- **Jar capacity (if applicable):** _(fill in)_
- **PDP template variant:** fermentation-kit

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #FF7300
- **gutbasket.kit_color_dark:** #E66800
- **gutbasket.kit_color_soft:** #FFE4CC

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin)
- ☐ Hero image / gallery uploaded

---

### Vegetable Fermentation Kit

**Handle:** `vegetable-fermentation-kit-with-glass-weights`
**Template:** `kit`
**Type / Vendor:** Fermentation Kits
**Price:** ₹1449.00  (compare-at ₹1999.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Hero tagline:** Lacto-fermented pickles, sauerkraut, kimchi. Salt + brine + glass weight + airlock.
- **Short name:** Vegetable Kit
- **Kit label format:** Vegetable Kit
- **Product name short:** Vegetable Kit
- **Discount badge:** SAVE 28%

#### Accent (visual)
- **Theme accent:** #15BA97
- **Theme accent dark:** #0F8C72
- **Theme accent soft:** #CDEDE3

#### Social proof
- **Rating:** 4.84
- **Review count:** 226
- **Bought today:** 59

#### Process timing card
- **Days to ferment:** 7
- **Days subtitle:** days to ferment

#### Trust strip & hero benefits
- **Hero trust strip (3 short chips):**
  1. Free shipping over Rs 999
  2. FSSAI Licensed
  3. Easy returns
- **Hero benefit icons (emoji or short text):**
  1. Probiotic
  2. No smell
  3. Reusable jar

#### Misc
- **Jar capacity (if applicable):** _(fill in)_
- **PDP template variant:** fermentation-kit

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #15BA97
- **gutbasket.kit_color_dark:** #0F8C72
- **gutbasket.kit_color_soft:** #CDEDE3

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin)
- ☐ Hero image / gallery uploaded

---

### Kimchi Making Kit

**Handle:** `kimchi-making-kit`
**Template:** `kit`
**Type / Vendor:** Fermentation Kits
**Price:** ₹1499.00  (compare-at ₹1999.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Hero tagline:** Authentic Korean fermented kimchi at home. Premium gochugaru + airlock jar + recipe book.
- **Short name:** Kimchi Kit
- **Kit label format:** Kimchi Kit
- **Product name short:** Kimchi Kit
- **Discount badge:** SAVE 25%

#### Accent (visual)
- **Theme accent:** #E85C41
- **Theme accent dark:** #B83D26
- **Theme accent soft:** #FAD3CB

#### Social proof
- **Rating:** 4.78
- **Review count:** 184
- **Bought today:** 41

#### Process timing card
- **Days to ferment:** 7
- **Days subtitle:** days to ferment

#### Trust strip & hero benefits
- **Hero trust strip (3 short chips):**
  1. Free shipping over Rs 999
  2. FSSAI Licensed
  3. Easy returns
- **Hero benefit icons (emoji or short text):**
  1. Probiotic
  2. No smell
  3. Reusable jar

#### Misc
- **Jar capacity (if applicable):** _(fill in)_
- **PDP template variant:** fermentation-kit

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #E85C41
- **gutbasket.kit_color_dark:** #B83D26
- **gutbasket.kit_color_soft:** #FAD3CB

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin)
- ☐ Hero image / gallery uploaded

---

### Sprout Maker - 700 ML

**Handle:** `sprout-making-jar`
**Template:** `kit`
**Type / Vendor:** Sprout
**Price:** ₹649.00  (compare-at ₹1299.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Hero tagline:** Fresh, crunchy sprouts in 2-3 days. No smell. No mess. Just water and a jar.
- **Short name:** Sprouts 700ml
- **Kit label format:** Sprouts Kit
- **Product name short:** Sprouts 700ml
- **Discount badge:** SAVE 50%

#### Accent (visual)
- **Theme accent:** #3F7754
- **Theme accent dark:** #2F5C40
- **Theme accent soft:** #D8E4DC

#### Social proof
- **Rating:** 4.85
- **Review count:** 312
- **Bought today:** 87

#### Process timing card
- **Days to ferment:** 3
- **Days subtitle:** days to harvest

#### Trust strip & hero benefits
- **Hero trust strip (3 short chips):**
  1. Free shipping over Rs 999
  2. FSSAI Licensed
  3. Easy returns
- **Hero benefit icons (emoji or short text):**
  1. Probiotic
  2. No smell
  3. Reusable jar

#### Misc
- **Jar capacity (if applicable):** 700ml
- **PDP template variant:** sprout-maker

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #3F7754
- **gutbasket.kit_color_dark:** #2F5C40
- **gutbasket.kit_color_soft:** #D8E4DC

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin)
- ☐ Hero image / gallery uploaded

---

### Kanji Making Kit

**Handle:** `kanji-making-kit`
**Template:** `kit`
**Type / Vendor:** Fermentation Kits
**Price:** ₹1249.00  (compare-at ₹1999.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Hero tagline:** Traditional Indian probiotic drink. Black carrot, beetroot, mustard - fermented in 5 days.
- **Short name:** Kanji Kit
- **Kit label format:** Kanji Kit
- **Product name short:** Kanji Kit
- **Discount badge:** SAVE 38%

#### Accent (visual)
- **Theme accent:** #8B1F40
- **Theme accent dark:** #6E1733
- **Theme accent soft:** #F4D7DD

#### Social proof
- **Rating:** 4.81
- **Review count:** 256
- **Bought today:** 64

#### Process timing card
- **Days to ferment:** 5
- **Days subtitle:** days to ferment

#### Trust strip & hero benefits
- **Hero trust strip (3 short chips):**
  1. Free shipping over Rs 999
  2. FSSAI Licensed
  3. Easy returns
- **Hero benefit icons (emoji or short text):**
  1. Probiotic
  2. No smell
  3. Reusable jar

#### Misc
- **Jar capacity (if applicable):** _(fill in)_
- **PDP template variant:** fermentation-kit

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #8B1F40
- **gutbasket.kit_color_dark:** #6E1733
- **gutbasket.kit_color_soft:** #F4D7DD

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin)
- ☐ Hero image / gallery uploaded

---

### Probiotic Aam Panna Making Kit

**Handle:** `probiotic-drink-making-kit`
**Template:** `kit`
**Type / Vendor:** Fermentation Kits
**Price:** ₹1299.00  (compare-at ₹1999.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Hero
- **Hero tagline:** Fermented aam panna. Cooling, probiotic, summer in a glass. Ready in 5 days.
- **Short name:** Aam Panna Kit
- **Kit label format:** Aam Panna Kit
- **Product name short:** Aam Panna Kit
- **Discount badge:** SAVE 35%

#### Accent (visual)
- **Theme accent:** #DDA738
- **Theme accent dark:** #B07F1A
- **Theme accent soft:** #F5E4B8

#### Social proof
- **Rating:** 4.79
- **Review count:** 167
- **Bought today:** 38

#### Process timing card
- **Days to ferment:** 5
- **Days subtitle:** days to ferment

#### Trust strip & hero benefits
- **Hero trust strip (3 short chips):**
  1. Free shipping over Rs 999
  2. FSSAI Licensed
  3. Easy returns
- **Hero benefit icons (emoji or short text):**
  1. Probiotic
  2. No smell
  3. Reusable jar

#### Misc
- **Jar capacity (if applicable):** _(fill in)_
- **PDP template variant:** fermentation-kit

#### Cart drawer accent (global)
- **gutbasket.kit_color:** #DDA738
- **gutbasket.kit_color_dark:** #B07F1A
- **gutbasket.kit_color_soft:** #F5E4B8

#### Notes / TODO
- ☐ Cart add-on suggestions (set in admin)
- ☐ Hero image / gallery uploaded

---

## Refills, prebiotics, cultures, books, baking (35 products · cart accent only)

### Water Kefir Grains

**Handle:** `water-kefir-grains`
**Template:** `accent-only`
**Type / Vendor:** _(unset)_
**Price:** ₹1000.00  (compare-at ₹1115.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #C2A77D
- **gutbasket.kit_color_dark:** #9C8158
- **gutbasket.kit_color_soft:** #EFE3D2

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Kombucha Guide And Recipe Book

**Handle:** `kombucha-making-guide-and-recipe-book-1`
**Template:** `accent-only`
**Type / Vendor:** _(unset)_
**Price:** ₹149.00
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #8E4F3C
- **gutbasket.kit_color_dark:** #683426
- **gutbasket.kit_color_soft:** #E5D2C9

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Fermented vegetables Instructions and Recipe Book- For beginners

**Handle:** `a-vegetable-fermentation-recipe-book`
**Template:** `accent-only`
**Type / Vendor:** Recipe Book
**Price:** ₹99.00
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #8E4F3C
- **gutbasket.kit_color_dark:** #683426
- **gutbasket.kit_color_soft:** #E5D2C9

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Regular Milk Kefir Grains

**Handle:** `a-milk-kefir-grains-standard`
**Template:** `accent-only`
**Type / Vendor:** _(unset)_
**Price:** ₹1000.00
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #C2A77D
- **gutbasket.kit_color_dark:** #9C8158
- **gutbasket.kit_color_soft:** #EFE3D2

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### A2 Milk Kefir Grains

**Handle:** `a-milk-kefir-grains-premium`
**Template:** `accent-only`
**Type / Vendor:** _(unset)_
**Price:** ₹1490.00
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #C2A77D
- **gutbasket.kit_color_dark:** #9C8158
- **gutbasket.kit_color_soft:** #EFE3D2

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Coconut Kefir Grains

**Handle:** `a-coconut-kefir-grains`
**Template:** `accent-only`
**Type / Vendor:** _(unset)_
**Price:** ₹1000.00
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #C2A77D
- **gutbasket.kit_color_dark:** #9C8158
- **gutbasket.kit_color_soft:** #EFE3D2

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Jar Sanitiser 200g

**Handle:** `wine-jar-sanitiser`
**Template:** `accent-only`
**Type / Vendor:** _(unset)_
**Price:** ₹450.00  (compare-at ₹999.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #9D2E2E
- **gutbasket.kit_color_dark:** #741F1F
- **gutbasket.kit_color_soft:** #E8C9C9

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Kimchi making Instructions and Recipe Book- For beginners

**Handle:** `kimchi-making-recipe-book`
**Template:** `accent-only`
**Type / Vendor:** _(unset)_
**Price:** ₹149.00
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #8E4F3C
- **gutbasket.kit_color_dark:** #683426
- **gutbasket.kit_color_soft:** #E5D2C9

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Kanji Making Instructions and Recipe Book- For beginners

**Handle:** `kanji-recipe-book`
**Template:** `accent-only`
**Type / Vendor:** Recipe Book
**Price:** ₹99.00
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #8E4F3C
- **gutbasket.kit_color_dark:** #683426
- **gutbasket.kit_color_soft:** #E5D2C9

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Unrefined Natural Sea Salt

**Handle:** `sea-salt-for-vegetable-fermentation-900-g`
**Template:** `accent-only`
**Type / Vendor:** _(unset)_
**Price:** ₹300.00  (compare-at ₹399.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #E5E5E0
- **gutbasket.kit_color_dark:** #BFBFB8
- **gutbasket.kit_color_soft:** #F5F5F0

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Inulin Powder

**Handle:** `inulin-powder`
**Template:** `accent-only`
**Type / Vendor:** Prebiotic
**Price:** ₹449.00  (compare-at ₹599.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #6BB048
- **gutbasket.kit_color_dark:** #4E8534
- **gutbasket.kit_color_soft:** #DEEDD2

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Acacia Fiber Powder

**Handle:** `acacia-powder`
**Template:** `accent-only`
**Type / Vendor:** Prebiotic
**Price:** ₹349.00  (compare-at ₹399.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #6BB048
- **gutbasket.kit_color_dark:** #4E8534
- **gutbasket.kit_color_soft:** #DEEDD2

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Fiber Boost | Daily Fiber Mix

**Handle:** `gutbasket-fiber-blend-prebiotic-rich-superfood-mix`
**Template:** `accent-only`
**Type / Vendor:** Prebiotic
**Price:** ₹599.00  (compare-at ₹999.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #6BB048
- **gutbasket.kit_color_dark:** #4E8534
- **gutbasket.kit_color_soft:** #DEEDD2

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Gutbasket Moringa Powder

**Handle:** `organic-moringa-powder-superfood-for-energy-and-immunity`
**Template:** `accent-only`
**Type / Vendor:** Prebiotic
**Price:** ₹399.00
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #6BB048
- **gutbasket.kit_color_dark:** #4E8534
- **gutbasket.kit_color_soft:** #DEEDD2

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Kanji Spice Mix – Traditional Blend for Probiotic Drinks (Pack of 5)

**Handle:** `kanji-spice-mix-traditional-blend-for-probiotic-drinks-pack-of-5`
**Template:** `accent-only`
**Type / Vendor:** Kanji
**Price:** ₹289.00  (compare-at ₹399.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #8B1F40
- **gutbasket.kit_color_dark:** #6E1733
- **gutbasket.kit_color_soft:** #F4D7DD

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Ferment Boost - Prebiotic Blend to Enhance Kanji and other Ferments

**Handle:** `ferment-boost-prebiotic-blend-to-enhance-kanji-and-other-ferments`
**Template:** `accent-only`
**Type / Vendor:** Prebiotic
**Price:** ₹449.00  (compare-at ₹599.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #6BB048
- **gutbasket.kit_color_dark:** #4E8534
- **gutbasket.kit_color_soft:** #DEEDD2

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Gond Katira (Tragacanth Gum) – 250g

**Handle:** `gond-katira-tragacanth-gum-200g-natural-body-coolant-supports-digestion-gut-health-rich-in-soluble-fiber-ideal-for-summer-drinks-desserts`
**Template:** `accent-only`
**Type / Vendor:** Prebiotic
**Price:** ₹399.00  (compare-at ₹499.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #6BB048
- **gutbasket.kit_color_dark:** #4E8534
- **gutbasket.kit_color_soft:** #DEEDD2

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Kanji Video Course – Traditional Recipes, Gut Health & Fermentation Skills

**Handle:** `kanji-mastery-course`
**Template:** `accent-only`
**Type / Vendor:** _(unset)_
**Price:** ₹999.00  (compare-at ₹1499.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #FF7300
- **gutbasket.kit_color_dark:** #E66800
- **gutbasket.kit_color_soft:** #FFE4CC

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Prebiotic Fiber Blend for Gut Health - Pack of 5

**Handle:** `fiber-boost-sachet-pack-of-5`
**Template:** `accent-only`
**Type / Vendor:** Prebiotic
**Price:** ₹199.00  (compare-at ₹499.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #6BB048
- **gutbasket.kit_color_dark:** #4E8534
- **gutbasket.kit_color_soft:** #DEEDD2

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Aam Panna Kanji Spice Mix - Pack of 5

**Handle:** `ferment-spice-mix-pack-of-5`
**Template:** `accent-only`
**Type / Vendor:** Kanji
**Price:** ₹399.00  (compare-at ₹999.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #E66800
- **gutbasket.kit_color_dark:** #B85100
- **gutbasket.kit_color_soft:** #FFE2C7

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Kanji Supplies Starter Pack – Includes Kanji Spice Mix (Pack of 3) & Ferment Boost (Pack of 3)

**Handle:** `kanji-supplies-starter-pack`
**Template:** `accent-only`
**Type / Vendor:** Kanji
**Price:** ₹249.00  (compare-at ₹499.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #8B1F40
- **gutbasket.kit_color_dark:** #6E1733
- **gutbasket.kit_color_soft:** #F4D7DD

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Kanji Supplies Value Pack – Includes Kanji Spice Mix (Pack of 5) & Ferment Boost (Pack of 5)

**Handle:** `kanji-supplies-value-pack`
**Template:** `accent-only`
**Type / Vendor:** Kanji
**Price:** ₹449.00  (compare-at ₹999.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #8B1F40
- **gutbasket.kit_color_dark:** #6E1733
- **gutbasket.kit_color_soft:** #F4D7DD

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Kanji Supplies Mega Pack – Includes Kanji Spice Mix (Pack of 10) & Ferment Boost (Pack of 10)

**Handle:** `kanji-supplies-mega-pack`
**Template:** `accent-only`
**Type / Vendor:** Kanji
**Price:** ₹799.00  (compare-at ₹1499.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #8B1F40
- **gutbasket.kit_color_dark:** #6E1733
- **gutbasket.kit_color_soft:** #F4D7DD

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Kimchi Making Paste

**Handle:** `kimchi-making-paste`
**Template:** `accent-only`
**Type / Vendor:** Kimchi
**Price:** ₹399.00  (compare-at ₹999.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #E85C41
- **gutbasket.kit_color_dark:** #B83D26
- **gutbasket.kit_color_soft:** #FAD3CB

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Ferment Boost (Sachet Pack of 5) - Prebiotic Blend to Enhance Kanji and other Ferments

**Handle:** `ferment-boost-sachet-pack-of-5-prebiotic-blend-to-enhance-kanji-and-other-ferments`
**Template:** `accent-only`
**Type / Vendor:** Prebiotic
**Price:** ₹199.00  (compare-at ₹299.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #6BB048
- **gutbasket.kit_color_dark:** #4E8534
- **gutbasket.kit_color_soft:** #DEEDD2

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Kanji Making Supplies - Kanji Spice Mix and Ferment Boost Combo

**Handle:** `kanji-supplies-starter-pack-5-kanji-spice-mix-5-ferment-boost-blend`
**Template:** `accent-only`
**Type / Vendor:** Kanji
**Price:** ₹399.00
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #8B1F40
- **gutbasket.kit_color_dark:** #6E1733
- **gutbasket.kit_color_soft:** #F4D7DD

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Achaar Making Supplies — 6-Batch Refill Pack

**Handle:** `achaar-making-supplies-6-batch-refill-pack`
**Template:** `accent-only`
**Type / Vendor:** Achaar
**Price:** ₹499.00  (compare-at ₹799.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #E66800
- **gutbasket.kit_color_dark:** #B85100
- **gutbasket.kit_color_soft:** #FFE2C7

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Probiotic Achaar Recipe Book — 10 Lacto-Fermented Recipes

**Handle:** `probiotic-achaar-recipe-book-10-lacto-fermented-recipes`
**Template:** `accent-only`
**Type / Vendor:** Recipe Book
**Price:** ₹99.00  (compare-at ₹199.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #8E4F3C
- **gutbasket.kit_color_dark:** #683426
- **gutbasket.kit_color_soft:** #E5D2C9

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Probiotic Achaar Supplies — Everything Except the Jar

**Handle:** `probiotic-achaar-supplies-everything-except-the-jar`
**Template:** `accent-only`
**Type / Vendor:** Achaar
**Price:** ₹599.00  (compare-at ₹999.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #E66800
- **gutbasket.kit_color_dark:** #B85100
- **gutbasket.kit_color_soft:** #FFE2C7

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Aam Panna Supplies Value Pack – Includes Aam Panna Spice Mix (Pack of 5) & Ferment Boost (Pack of 5)

**Handle:** `aam-panna-supplies-value-pack-includes-aam-panna-spice-mix-pack-of-5-ferment-boost-pack-of-5`
**Template:** `accent-only`
**Type / Vendor:** _(unset)_
**Price:** ₹449.00  (compare-at ₹999.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #DDA738
- **gutbasket.kit_color_dark:** #B07F1A
- **gutbasket.kit_color_soft:** #F5E4B8

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Nutritional Yeast Flakes

**Handle:** `nutritional-yeast-flakes`
**Template:** `accent-only`
**Type / Vendor:** Prebiotic
**Price:** ₹299.00  (compare-at ₹399.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #6BB048
- **gutbasket.kit_color_dark:** #4E8534
- **gutbasket.kit_color_soft:** #DEEDD2

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Instant Dry Yeast for Baking (120g)

**Handle:** `instant-dry-yeast-for-baking-120g`
**Template:** `accent-only`
**Type / Vendor:** Baking
**Price:** ₹199.00  (compare-at ₹299.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #C7864A
- **gutbasket.kit_color_dark:** #9A6535
- **gutbasket.kit_color_soft:** #F2DDC4

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Sprouts Seeds Mix - Clover, Alfalfa and Radish Seeds for Sprouting

**Handle:** `sprouts-mix-clover-alfalfa-and-radish-seeds-for-sprouting`
**Template:** `accent-only`
**Type / Vendor:** Sprout
**Price:** ₹199.00  (compare-at ₹499.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #3F7754
- **gutbasket.kit_color_dark:** #2F5C40
- **gutbasket.kit_color_soft:** #D8E4DC

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Sprouts Seeds - Clover, Alfalfa and Radish Seeds for Sprouting

**Handle:** `sprouts-seeds-clover-alfalfa-and-radish-seeds-for-sprouting`
**Template:** `accent-only`
**Type / Vendor:** Sprout
**Price:** ₹599.00  (compare-at ₹999.00)
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #3F7754
- **gutbasket.kit_color_dark:** #2F5C40
- **gutbasket.kit_color_soft:** #D8E4DC

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---

### Sprout Seeds Mix – Clover, Radish & Fenugreek (Pack of 3)

**Handle:** `sprout-seeds-mix-clover-radish-fenugreek-pack-of-3`
**Template:** `accent-only`
**Type / Vendor:** Sprout
**Price:** ₹199.00
**Status:**  ☐ Draft   ☐ Review   ☐ Done

#### Cart drawer accent (only metafield set on this product)
- **gutbasket.kit_color:** #3F7754
- **gutbasket.kit_color_dark:** #2F5C40
- **gutbasket.kit_color_soft:** #D8E4DC

_This product appears on a generic template — no PDP layout. The only metafield in scope is the cart-drawer accent. If you want it to upgrade to a richer PDP, escalate to engineering._

---
