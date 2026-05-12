# Media plan — per-product file upload list

**Scope:** every image / video / icon the four `.docx` briefs say to source for the 49 products (9 fermentation-kit + 14 spice-refill + 18 jars-tools + 8 prebiotic). Files upload to **Shopify → Content → Files**; the Shopify MCP (parallel chat) will reference their GIDs when writing per-product metafield values and creating metaobject entries.

**This is a sourcing/shooting brief. No theme code changes here.**

Status legend per row: ☐ Source / ☐ Edit / ☐ Uploaded.

Per-product image-naming convention recommended: `<handle>-<slot>.{webp|svg|mp4}` — e.g. `kanji-making-kit-box.webp`, `inulin-powder-source.webp`, `kanji-making-kit-review-1.webp`.

---

## A. Media-slot catalogue (what each template needs per product)

### A.1 Fermentation-kit (`product.fermentation-kit` / `-leo` / `-refa`) — per product

| Slot | Target metafield / metaobject | Count per product | Notes |
|---|---|---|---|
| Native product gallery | Shopify product `images` | 4–8 | Hero on neutral bg, kit-as-system flat-lay, in-use lifestyle, jar/airlock detail, packaging shot, components flat-lay. **Hero image must match `theme_accent`.** |
| Benefits icons (SVG) | `custom.benefits_icons` (list.file_reference) | 4 | Index-paired with `benefits_items` 4-line text. SVG. Reuse the fermentation-kit-leo set unless brand-distinct. |
| Hero benefit icons (SVG) | `custom.hero_benefits_icons` (list.file_reference) | 4 | Different set from `benefits_icons` (hero strip vs benefits block). SVG. |
| Hero trust strip icons | `custom.trust_strip_icons` (list.file_reference) | 4 | SVG. Pair with `hero_trust_strip` (4 text labels). |
| Comparison left image | `custom.comparison_left_image` | 1 | "Old way" lifestyle/illustration. |
| Comparison right image | `custom.comparison_right_image` | 1 | "New way" — kit in action. |
| Box flat-lay | `custom.box_image` | 1 | All components laid out on cream bg, top-down. |
| Recipe banner | `custom.recipe_banner_image` | 1 | Banner image for recipe-tag section. |
| How-to-make video | `custom.how_to_make_video` (file_reference Video) | 1 | 60-sec MP4. Show steps 1→4. |
| Kit step icons (×6) | `kit_step.icon` per `featured_steps` entry | 4–6 | SVG, one per step. May be shared across kits if same flow. |
| Kit component icons (×6–8) | `kit_component.icon` per `featured_components` entry | 6–8 | SVG/illustration. One per box pill. |
| Kit trust card icons | `kit_trust_card.icon` per `featured_trust_cards` entry | 4 | SVG. |
| Kit quick-benefit icons | `kit_quick_benefit.icon` per `featured_quick_benefits` entry | 3 | Outcomes section. SVG. |
| Kit science-card images (airlock spotlight) | `kit_science_card.image` per `featured_science_cards` entry | 2–3 | Hero shot of airlock + glass-weight. |
| Kit consumable images (ITK + blends) | `kit_consumable.image` per `featured_consumables` entry | 4–6 | Spice mix sachet, ferment boost sachet, blend variants. |
| Kit reel video + poster (×4) | `kit_reel.video` + `kit_reel.poster` per `featured_reels` entry | 4 video + 4 poster | UGC-style 15-sec reels. |
| Kit review photos (×3) | `kit_review.photo` per `featured_reviews` entry | 3 | Customer face shots (with release) OR product-in-use. |
| Kit consumption-method images (eat section) | `kit_consumption_method.image` per `featured_consumption_methods` entry | 4 | One per use-case (eat-with-rice, eat-with-curd, etc.). |

**Per-product totals (fermentation-kit): ~50–60 distinct media files** (gallery shots count multiple).

### A.2 Spice-refill (`product.spice-refill`) — per product

| Slot | Target metafield / metaobject | Count per product | Notes |
|---|---|---|---|
| Native product gallery | Shopify `images` | 3–6 | Hero on neutral, sachet detail, lifestyle pour, scale-with-jar. |
| Benefits icons (SVG) | `custom.benefits_icons` | 4 | Reuse refill-family icon set where possible. |
| Hero benefit icons | `custom.hero_benefits_icons` | 4 | SVG. |
| Hero trust strip icons | `custom.trust_strip_icons` | 4 | SVG. |
| Why-the-refill lifestyle image | `custom.why_image` | 1 | Tearing open sachet over a jar with fresh produce. **NEW field — semantically distinct from `comparison_left_image`, do not reuse.** |
| Box flat-lay | `custom.box_image` | 1 | Refill sachets laid out on cream bg. |
| How-to-make video | `custom.how_to_make_video` | 1 | 60-sec MP4 — "how to refill". |
| Kit step icons | `kit_step.icon` per `featured_steps` entry | 4 | SVG. Often shareable across refill SKUs in the same family. |
| Kit component icons | `kit_component.icon` per `featured_components` entry | 4–6 | One per item in the pack. SVG/illustration. |
| Kit quick-benefit icons | `kit_quick_benefit.icon` per `featured_quick_benefits` entry | 4 | If using metaobject pattern for benefits-grid (else only the parallel-array icons above). |
| Kit review photos | `kit_review.photo` per `featured_reviews` entry | 3 | Customer or product-in-use. |

**Per-product totals (spice-refill): ~20–25 distinct media files.**

### A.3 Jars-tools (`product.jars-tools`) — per product

| Slot | Target metafield / metaobject | Count per product | Notes |
|---|---|---|---|
| Native product gallery | Shopify `images` | 4–6 | Hero on neutral, **in-use** (filling/pouring/sealing), detail close-up (airlock / mesh / grommet), **scale shot** (next to standard kit jar), top-down for jars and bottles. |
| Hero benefit icons | `custom.hero_benefits_icons` | 4 | SVG. |
| Hero trust strip icons | `custom.trust_strip_icons` | 4 | SVG. |
| Box flat-lay | `custom.box_image` | 1 | What ships in the package — jar + airlock + grommet, etc. |
| Kit component icons (what's-included) | `kit_component.icon` per `featured_components` entry | 3–6 | SVG. One per piece in box. |
| Kit quick-benefit icons (use-cases) | `kit_quick_benefit.icon` per `featured_quick_benefits` entry | 3–4 | Use-case cards. SVG. |
| Specs JSON icons (optional, inline in JSON) | `custom.specs` icons | 0–6 | If `[{label, value, icon}]` shape uses icons, upload SVGs. Else just label/value rows. |
| Kit review photos | `kit_review.photo` per `featured_reviews` entry | 3 | |

**Per-product totals (jars-tools): ~12–18 distinct media files.**

### A.4 Prebiotic (`product.prebiotic`) — per product

| Slot | Target metafield / metaobject | Count per product | Notes |
|---|---|---|---|
| Native product gallery | Shopify `images` | 4–6 | Hero on neutral, scoop / pour shot, lifestyle (in-glass / in-yogurt), packaging back/front, ingredient origin shot. |
| Hero video | `custom.hero_video` | 1 | NEW field. Optional — short hero loop, different from how_to_make_video. |
| Hero benefit icons | `custom.hero_benefits_icons` | 4 | SVG. |
| Hero trust strip icons | `custom.trust_strip_icons` | 4 | SVG. |
| Why-image | `custom.why_image` | 0 | Not in prebiotic brief — leave blank. |
| Kit trust card icons (why-this-fiber) | `kit_trust_card.icon` per `featured_trust_cards` entry | 4 | SVG. |
| Kit step images (consume) | `kit_step.icon` per `featured_steps` entry | 3 | Photo OR SVG — brief says "step_image". |
| Kit timeline-step images (week-by-week) | `kit_timeline_step` has no image field — skip | 0 | Period_label + heading + description only. |
| Kit component images (ingredients) | `kit_component.icon` per `featured_components` entry | 4 | Botanical photography or illustration per ingredient. |
| Kit science-card image (source story, pd_* consolidated) | `kit_science_card.image` per `featured_science_cards` entry | 1 | Hero shot of natural source (chicory root, acacia tree, etc.). |
| Kit review photos | `kit_review.photo` per `featured_reviews` entry | 4 | Customer face / lifestyle. |
| Kit timeline-step (journey cross-sell) | `kit_timeline_step` has no image — skip | 0 | |

**Per-product totals (prebiotic): ~17–22 distinct media files.**

---

## B. Per-product TODO list

Mark each row ☐ → ✅ as media is sourced and uploaded.

### B.1 Fermentation kits (9 products)

| # | Product | Handle | Theme accent (TODO confirm) | Gallery 4–8 | Benefits icons ×4 | Hero benefit icons ×4 | Trust icons ×4 | Comparison L/R | Box image | Recipe banner | How-to video | Step icons ×4–6 | Component icons ×6–8 | Trust-card icons ×4 | Quick-benefit icons ×3 | Science-card images ×2–3 | Consumable images ×4–6 | Reel video+poster ×4 | Review photos ×3 | Eat-method images ×4 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| K1 | Probiotic Achaar Making Kit | `probiotic-achaar-making-kit` | TODO | ☐ | ☐ | ☐ | ☐ | ☐ ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| K2 | All-in-One Fermentation Kit | `ultimate-fermentation-kit` | TODO | ☐ | ☐ | ☐ | ☐ | ☐ ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| K3 | Vegetable Fermentation Kit | `vegetable-fermentation-kit-with-glass-weights` | TODO | ☐ | ☐ | ☐ | ☐ | ☐ ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| K4 | Kimchi Making Kit | `kimchi-making-kit` | TODO | ☐ | ☐ | ☐ | ☐ | ☐ ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| K5 | Probiotic Aam Panna Making Kit | `probiotic-aam-panna-making-kit` | TODO | ☐ | ☐ | ☐ | ☐ | ☐ ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| K6 | Kanji Making Kit (current, 2 L) | `kanji-making-kit` | already set | partly live | ✅ live (4) | ✅ live | ☐ | ☐ ☐ | ✅ live | ✅ live | ☐ | ☐ | ✅ live (1) | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| K7 | Kanji Kit (1 L) | `kanji-making-kit-1-liter` | TODO | ☐ | ☐ | ☐ | ☐ | ☐ ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| K8 | Kanji Kit (old layout) | `kanji-making-kit-old-layout` | TODO | ☐ | ☐ | ☐ | ☐ | ☐ ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| K9 | Kanji Making Kit (refa) | `kanji-making-kit-refa` | TODO | ☐ | ☐ | ☐ | ☐ | ☐ ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |

**Note (K8/K9):** brief notes K8, K9, K6, K7 may consolidate onto `product.fermentation-kit` and retire `-leo` / `-refa`. Hold final media production for K8/K9 until consolidation decision.

### B.2 Spice-refill (14 products)

| # | Product | Handle | Theme accent | Gallery 3–6 | Benefits icons ×4 | Hero benefit ×4 | Trust ×4 | Why-image | Box image | How-to video | Step icons ×4 | Component icons ×4–6 | Quick-benefit icons ×4 | Review photos ×3 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R1 | Kanji Spice Mix | `kanji-spice-mix` | TODO | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| R2 | Aam Panna Kanji Spice Mix Pack of 5 | `aam-panna-kanji-spice-mix-pack-of-5` | TODO | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| R3 | Kanji Supplies Starter Pack | `kanji-supplies-starter-pack` | TODO | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| R4 | Kanji Supplies Value Pack | `kanji-supplies-value-pack` | TODO | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| R5 | Kanji Supplies Mega Pack | `kanji-supplies-mega-pack` | TODO | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| R6 | Kimchi Making Paste | `kimchi-making-paste` | TODO | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| R7 | Ferment Boost (Sachet ×5) | `ferment-boost-sachet-pack-of-5` | TODO | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| R8 | Kanji Making Supplies | `kanji-making-supplies` | TODO | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| R9 | Achaar Making Supplies 6-Batch | `achaar-making-supplies-6-batch-refill-pack` | TODO | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| R10 | Probiotic Achaar Supplies | `probiotic-achaar-supplies-everything-except-the-jar` | TODO | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| R11 | Aam Panna Supplies Value Pack | `aam-panna-supplies-value-pack-includes-aam-panna-spice-mix-pack-of-5-ferment-boost-pack-of-5` | TODO | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| R12 | Sprouts Seeds Mix (Clover/Alfalfa/Radish) | `sprouts-seeds-mix-clover-alfalfa-radish` | TODO | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| R13 | Sprouts Seeds (Clover/Alfalfa/Radish variant) | `sprouts-seeds-clover-alfalfa-radish-seeds` | TODO | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| R14 | Sprout Seeds Mix (Clover/Radish/Fenugreek) | `sprout-seeds-mix-clover-radish-fenugreek` | TODO | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |

### B.3 Jars-tools (18 products)

| # | Product | Handle | Gallery 4–6 | Hero benefit icons ×4 | Trust icons ×4 | Box image | Component icons ×3–6 | Quick-benefit icons ×3–4 | Specs JSON icons (0–6) | Review photos ×3 |
|---|---|---|---|---|---|---|---|---|---|---|
| J1 | Fermentation Jar w/ Airlock 1 L | `a-fermentation-jars` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| J2 | Fermentation Jar w/ Airlock 2 L wide | `fermentation-jar-wide-mouth-2-litre` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| J3 | Fermentation Jar w/ Airlock 4 L wide | `fermentation-jar-wide-mouth-4-litre` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| J4 | Kombucha Jar 4 L (tap + steel stand) | `kombucha-jar-5-6l-with-tap-and-steel-stand` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| J5 | Kombucha Glass Jar 4 L | `kombucha-jar` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| J6 | HDPE Plastic Carboy 8 L | `fermentation-jar-narrow-mouth-hdpe-8-litre` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| J7 | Glass Carboy Amber 4 L | `glass-carboy-4-litre` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| J8 | Airtight bottles 1 L | `blue-airtight-glass-bottles-pack-of-4` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| J9 | Airlock (3-piece) | `a-airlock` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| J10 | Silicone Bungs (DRAFT — pending status) | `a-silicons-bungs` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| J11 | Grommet/Washer (Set of 3) | `grommet-washer-for-fermentation-lid-set-of-3` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| J12 | pH Strip | `a-ph-strip` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| J13 | Funnel | `a-funnel` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| J14 | Fermentation Glass Weight | `a-glass-weight` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| J15 | Triple Scale Hydrometer | `a-hydrometer` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| J16 | Mesh Strainer | `a-mesh-strainer` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| J17 | Temperature Strip | `stick-on-thermometer-strip-1` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| J18 | Pipette (Pack of 5) | `pipette-1` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |

**Consolidation note (J1–J3):** brief recommends merging the three Fermentation Jar size SKUs into one product with a size variant. If consolidated, only one full media set is needed (multi-size shots can live in the single product gallery).

### B.4 Prebiotic (8 products)

| # | Product | Handle | Gallery 4–6 | Hero video | Hero benefit icons ×4 | Trust icons ×4 | Trust-card icons ×4 | Step images ×3 | Ingredient images ×4 | Source story image ×1 | Review photos ×4 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| P1 | Inulin Powder | `inulin-powder` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ chicory root | ☐ |
| P2 | Acacia Fiber Powder | `acacia-powder` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ acacia tree | ☐ |
| P3 | GutBasket Fiber Blend | `gutbasket-fiber-blend-prebiotic-rich-superfood-mix` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ blend hero | ☐ |
| P4 | Organic Moringa Powder | `organic-moringa-powder-superfood-for-energy-and-immunity` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ moringa leaves | ☐ |
| P5 | Ferment Boost (Prebiotic) | `ferment-boost-prebiotic-blend-to-enhance-kanji-and-other-ferments` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ blend source | ☐ |
| P6 | Gond Katira (Tragacanth) | `gond-katira-tragacanth-gum-200g-natural-body-coolant-supports-digestion-gut-health-rich-in-soluble-fiber-ideal-for-summer-drinks-desserts` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ tragacanth resin | ☐ |
| P7 | Prebiotic Fiber Blend Pack of 5 | `prebiotic-fiber-blend-for-gut-health-pack-of-5` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ blend hero | ☐ |
| P8 | Nutritional Yeast Flakes | `nutritional-yeast-flakes` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ yeast flake macro | ☐ |

**Flag (P8):** the brief itself notes nutritional yeast isn't a prebiotic fibre — confirm template assignment before shooting "prebiotic-styled" media. Different hero treatment may be wanted.

---

## C. Cross-cutting media to produce ONCE (reused across many products)

These are shared assets — produce one set, reference everywhere.

| Asset | Used by | Type | Count | Where it lives |
|---|---|---|---|---|
| Generic SVG icon set (probiotic, sugar-free, days-to-ferment, reusable, refillable, food-grade, dishwasher-safe, BPA-free, money-back, free-shipping, customer-rating, etc.) | All templates | SVG | ~20 | Shopify Files. Reference by GID in `benefits_icons`, `hero_benefits_icons`, `trust_strip_icons`, all metaobject `icon` fields. |
| Brand watermark / "by GutBasket" logo lockup | All templates | SVG / PNG | 1 | Files. Optional overlay on gallery shots. |
| Cream backdrop reference (color: TODO confirm with brand guide) | All product photography | — | — | Brand guideline, not a file. |
| Generic "old way" comparison illustration | Fermentation-kit | Illustration | 1 | Reuse for `comparison_left_image` where kit-specific isn't needed. |
| Generic "GutBasket way" comparison illustration | Fermentation-kit | Illustration | 1 | Same as above for `comparison_right_image`. |
| Generic week-by-week timeline illustration | Prebiotic + fermentation-kit | None | 0 | `kit_timeline_step` has no image field — period_label + heading + description only. **No imagery needed.** |
| `kit_recipe_tag` emoji | Fermentation-kit | Emoji string | ~10 | `emoji` field is text, not file. No upload. |

---

## D. Format / spec notes

| Asset type | Format | Recommended size | Notes |
|---|---|---|---|
| Product gallery hero | WebP (with JPG fallback Shopify-generated) | 2000×2000 px square, ≤300 KB | Square ratio for grid layouts; Shopify handles responsive crop. |
| Lifestyle / detail / scale shots | WebP | 1600×2000 px (4:5) or 2000×2000 px | |
| `box_image`, `comparison_*_image`, `recipe_banner_image`, `why_image` | WebP | 1600×1200 px (4:3) | |
| `kit_review.photo` | WebP | 800×800 px square | Smaller — renders as thumbnail. |
| `kit_consumable.image`, `kit_science_card.image`, `kit_consumption_method.image` | WebP | 1200×1200 px square | |
| Icon SVGs (`benefits_icons`, `trust_strip_icons`, all metaobject icons) | SVG | 64×64 px viewBox preferred | Single-colour, currentColor-friendly so theme can recolour. |
| `how_to_make_video`, `hero_video` | MP4 (H.264 + AAC) | 1080×1080 sq or 1080×1920 vertical | ≤30 MB. 60-sec max for how-to, 15-sec for hero. |
| `kit_reel.video` | MP4 | 1080×1920 vertical | UGC-style, ≤30 MB. |
| `kit_reel.poster` | WebP | 1080×1920 portrait | First-frame matched poster. |

---

## E. Sourcing priority (suggested order)

1. **Shared SVG icon set** (Section C) — unblocks every product's hero benefit icons + trust strip + metaobject icons.
2. **Kanji Making Kit (K6)** + **Inulin Powder (P1)** — flagship of each template family; finish them end-to-end first to validate per-template QA before scaling.
3. **One spice-refill (R1 Kanji Spice Mix)** + **one jars-tools (J9 Airlock or J1 1L jar)** — same logic; finish one of each as the family template.
4. Then production-fill the remaining 45 products from the family templates.
5. **Hold K8/K9** (`-leo` / `-refa` templates) until consolidation onto `product.fermentation-kit` is decided.
6. **Hold J1/J2/J3 final media** if 1L/2L/4L jars get consolidated into a single variant-based product.

---

## F. Open questions for sourcing

1. **Brand-photography style guide** — cream backdrop hex, prop palette, typography overlay rules. The brand guide PDF in repo root covers this; sourcing team should pull from there before shooting.
2. **Customer-photo releases** for `kit_review.photo` — confirm GutBasket has signed releases or use product-in-use shots instead.
3. **Reel content** (`kit_reel`) — is this UGC pulled from Instagram, or shot in-house? Affects 36 entries × 4 kits = 36 reels.
4. **Theme accent hex per kit** — `theme_accent` / `_dark` / `_soft` are already populated for the 9 kits in the live store; confirm each before sourcing hero imagery so the hero matches the brand accent.
