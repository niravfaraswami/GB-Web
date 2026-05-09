# GutBasket — Image Generation Spec
**Templates covered:** Spice Refill · Baking · Prebiotic
**Source files reviewed:** `gutbasket-spice-refill.html` · `gutbasket-baking.html` · `gutbasket-prebiotic.html`
**Product mapping reviewed:** `Product_template_mapping.xlsx` (15 products across these 3 templates)

---

## Naming convention

```
{product-slug}_{shot-id}_{descriptor}.{ext}
```

| Token | Rule | Examples |
|---|---|---|
| `product-slug` | Lowercase snake_case unique per SKU. Match the Shopify handle. | `achaar_refill`, `instant_yeast`, `inulin` |
| `shot-id` | `s01`–`s12`. **Stable per slot**, so swapping product → swapping prefix is enough. Numbers map to a fixed shot-type per template (see tables below). | `s03`, `s07` |
| `descriptor` | Lowercase, hyphenated, ≤ 3 words. For photographer brief / fallback alt-text. Optional but recommended. | `flat_lay`, `pouch_front`, `in_smoothie` |
| `ext` | `jpg` for product photos, `png` for cutouts on transparent, `webp` if pre-optimised, `mp4` / `jpg` for video posters. Existing files use `.jpeg` — keep consistent within a template. | `jpg` |

### Folder structure

```
assets/
  spice-refill/
    achaar_refill_s01_pouch_front.jpg
    achaar_refill_s02_flat_lay.jpg
    ...
  baking/
    instant_yeast_s01_pouch_front.jpg
    ...
  prebiotic/
    inulin_s01_hero_shot.jpg
    ...
  shared/
    consume_step_1_scoop.jpg          ← reused across all 6 prebiotic SKUs
    review_avatar_pool/
      avatar_01.jpg
      ...
```

Optional aspect-ratio suffix (only if a single asset is shipped at multiple ratios):
`{slug}_{shot-id}_{descriptor}_{aspect}.jpg` → `achaar_refill_s01_pouch_front_4x3.jpg`. Otherwise let Shopify's responsive image system handle sizing.

### Existing files in the project (already follow this convention)

```
assets/kanji_s03_flat_lay.jpeg
assets/kanji_s05_compare_right.jpeg
assets/kanji_s07_component_spice.jpeg
assets/kanji_s07_component_boost.jpeg
assets/kanji_s09_step_3.jpeg
assets/kanji_s11_consumption_premeal.jpeg
assets/consume-step-1.jpg
assets/consume-step-2.jpg
assets/consume-step-3.jpg
```

I've kept the same `s##` numbering scheme below where it overlapped, and renamed `consume-step-N` to underscore-style for consistency.

---

## Template 1: SPICE-REFILL

5 SKUs. Image-heavy template — explicit hero gallery (6 thumbs) + 3 dedicated section images + 3 review photos per SKU.

### Per-SKU images (12 each × 5 SKUs = 60 images)

| Shot ID | Section | Descriptor | Subject |
|---|---|---|---|
| s01 | Hero gallery thumb 1 | `pouch_front` | Sachet pack shot, label clearly visible, on cream background |
| s02 | Hero gallery thumb 2 | `flat_lay` | Top-down: 5 sachets + ferment boost packets + recipe card laid out |
| s03 | Hero gallery thumb 3 | `compare_size` | Refill pouch next to parent kit (size/value comparison) |
| s04 | Hero gallery thumb 4 | `spice_macro` | Close-up of spice blend texture (vivid color, shows variety) |
| s05 | Hero gallery thumb 5 | `boost_sachet` | Ferment Boost packet alongside spice packet |
| s06 | Hero gallery thumb 6 | `in_use` | Hand tearing sachet open over jar |
| s07 | Why-the-Refill section | `lifestyle_pour` | Lifestyle: sachet being poured into glass jar with fresh produce alongside |
| s08 | Box / What's-in-the-pack | `box_flatlay` | Flat-lay of 5 spice sachets + 5 boost sachets + recipe card on cream |
| s09 | How-to-Make video poster | `video_poster` | Frame from the 60-sec process video, with play overlay |
| s10 | Review card 1 photo | `review_a` | Reviewer-supplied lifestyle photo (jar in their kitchen, etc.) |
| s11 | Review card 2 photo | `review_b` | Same — second reviewer photo |
| s12 | Review card 3 photo | `review_c` | Same — third reviewer photo |

### SKUs (apply prefix to every shot above)

| Slug | Product | Accent |
|---|---|---|
| `achaar_refill` | Achaar Spice Mix Refill | #FF7300 |
| `kanji_refill` | Kanji Spice Mix Refill | #8B1F40 |
| `aam_panna_refill` | Aam Panna Spice Mix Refill | #DDA738 |
| `kimchi_refill` | Kimchi Paste Refill | #E85C41 |
| `sprout_refill` | Sprouts Seed Mix Refill | #3F7754 |

### Cross-sell card images (shared, 4 total)

The cross-sell row at the bottom uses a coloured block + emoji, but if you replace those with real images:

| Filename | Subject |
|---|---|
| `parent_kit_card.jpg` | The full fermentation kit (jar + airlock + accessories) |
| `ferment_boost_card.jpg` | Ferment Boost 250g pouch |
| `sampler_pack_card.jpg` | Trial pack with all 4 spice mixes |
| `all_in_one_card.jpg` | All-in-One Fermentation Kit (combo box) |

### Spice-Refill template total: **64 images** (60 SKU + 4 cross-sell)

---

## Template 2: BAKING

4 SKUs. Lightest image template — emoji-driven hero, but each SKU benefits from real product photography.

### Per-SKU images (6 each × 4 SKUs = 24 images)

| Shot ID | Section | Descriptor | Subject |
|---|---|---|---|
| s01 | Hero gallery thumb 1 | `pouch_front` | Vacuum-sealed pouch, clean front, label visible |
| s02 | Hero gallery thumb 2 | `texture_macro` | Close-up of granule/flake/powder texture |
| s03 | Hero gallery thumb 3 | `mid_baking` | Mid-process: dough rising / improver mixed in / gluten kneaded / flakes sprinkled |
| s04 | Hero gallery thumb 4 | `final_use` | End product (loaf / soft pav / artisan bread / pasta with flakes) |
| s05 | Hero gallery thumb 5 | `use_cases` | Grid or composite of 3-4 dishes the product enables |
| s06 | How-to video poster | `video_poster` | Frame from 60-sec video, with play overlay |

### SKUs (apply prefix to every shot above)

| Slug | Product | Accent |
|---|---|---|
| `instant_yeast` | Instant Dry Yeast | #4F8E5F |
| `bread_improver` | Bread Improver | #C9A02E |
| `vital_wheat_gluten` | Vital Wheat Gluten | #C26D3A |
| `nutritional_yeast` | Nutritional Yeast Flakes | #E8B538 |

### Cross-sell card images (shared, 3 total)

The cross-sell at the bottom of each baking PDP shows the *other* baking SKUs as adjacent products. If using real images:
- These reuse `{slug}_s01_pouch_front.jpg` from each SKU. **No additional images needed.**

### Baking template total: **24 images** (all SKU-specific, all reusable across PDPs)

---

## Template 3: PREBIOTIC

6 SKUs. Heaviest information density but lighter on imagery than spice-refill — gallery is 5 thumbs, plus 3 shared "how to consume" lifestyle images, plus a per-SKU source/origin shot.

### Per-SKU images (6 each × 6 SKUs = 36 images)

| Shot ID | Section | Descriptor | Subject |
|---|---|---|---|
| s01 | Hero gallery thumb 1 | `hero_shot` | Composed hero: pouch + scoop + powder mound on cream |
| s02 | Hero gallery thumb 2 | `pouch_front` | Clean pouch front, label visible, single-product framing |
| s03 | Hero gallery thumb 3 | `powder_texture` | Macro close-up of the powder grain/colour |
| s04 | Hero gallery thumb 4 | `in_smoothie` | Powder being stirred into a glass (water/smoothie/coffee depending on SKU) |
| s05 | Hero gallery thumb 5 | `scoop_spoon` | Scoop next to spoon — illustrates dose size |
| s06 | Product Details · Natural Source | `source_origin` | The plant/source the fiber comes from (see SKU table below) |

### SKUs and source-origin imagery

Each SKU's `s06_source_origin` shows a **different natural source** — this is the only shot where the descriptor differs significantly per SKU. Brief them individually.

| Slug | Product | Accent | `s06_source_origin` subject |
|---|---|---|---|
| `inulin` | Inulin Prebiotic Fiber | #15BA97 | Belgian chicory root (whole + sliced root) |
| `ferment_boost` | Ferment Boost · Prebiotic Starter | #0097B2 | Composite: chicory + corn + wheat (representing 3-fiber blend) |
| `acacia` | Acacia Fiber | #EC6868 | Acacia senegal tree gum / resin tears |
| `fiber_boost` | Fiber Boost · Daily Blend | #FF5757 | Composite: chicory + psyllium husk + acacia + flax seeds |
| `moringa` | Moringa Powder | #5DBC52 | Drumstick / moringa leaves on the branch |
| `katira` | Katira Gond Powder | #E8B8C2 | Astragalus tragacanth resin / gum nuggets |

### Shared / template-level images (5 total)

These images live in `assets/shared/` and are reused across all 6 prebiotic SKUs.

| Filename | Section | Subject |
|---|---|---|
| `consume_step_1_scoop.jpg` | How-to-Consume card 1 | Hand scooping powder out of pouch (already exists as `consume-step-1.jpg`) |
| `consume_step_2_stir.jpg` | How-to-Consume card 2 | Stirring powder into glass (already exists as `consume-step-2.jpg`) |
| `consume_step_3_drink.jpg` | How-to-Consume card 3 | Person drinking the result (already exists as `consume-step-3.jpg`) |
| `journey_beginner_card.jpg` | Cross-sell stage 1 | Acacia pouch (gentle / IBS-friendly framing) |
| `journey_advanced_card.jpg` | Cross-sell stage 3 | Inulin pouch (strong / single-source framing) |
| `journey_regular_card.jpg` | Cross-sell stage 2 (featured) | Fiber Boost pouch |

The journey cards reuse `{slug}_s02_pouch_front.jpg` — **no additional images required**, just point to the existing per-SKU pouch shots.

### Prebiotic template total: **39 images** (36 SKU-specific + 3 shared consume-step lifestyle)

---

## Grand totals

| Template | SKUs | Per-SKU | Shared | Total |
|---|---:|---:|---:|---:|
| Spice Refill | 5 | 12 | 4 | **64** |
| Baking | 4 | 6 | 0 | **24** |
| Prebiotic | 6 | 6 | 3 | **39** |
| | | | | **127** |

### If you generate UGC review photos as well

The spice-refill template has 3 review photo slots per SKU (`s10`/`s11`/`s12` in the table above — included in the 64 count). Baking and prebiotic templates do **not** render UGC review photos in the per-SKU section — they use a Judge.me embed which loads its own user-uploaded photos. So no extra images needed for those two.

If you decide to drop the per-SKU review photos and use a shared pool of 8–10 generic Indian-kitchen lifestyle photos instead, the spice-refill total drops by 15 (5 × 3) to **49**, and grand total to **112**.

---

## Aspect ratios — quick reference

Generate each shot at the native ratio its slot expects. Shopify's responsive image system handles downscaling, so generate at the **largest** size needed.

| Slot type | Aspect ratio | Recommended source size |
|---|---|---|
| Gallery main (`s01`–`s05` for prebiotic, `s01`–`s06` for spice-refill, `s01`–`s05` for baking) | 1:1 (square) | 1600 × 1600 |
| Gallery thumbs | Same source as above (cropped by CSS) | — |
| Why / Box section image (spice-refill `s07`/`s08`) | 4:3 | 1600 × 1200 |
| Video poster (`s09` for spice-refill, `s06` for baking) | 16:9 | 1920 × 1080 |
| Source/origin (prebiotic `s06`) | 1:1 or 4:3 | 1600 × 1200 |
| Consume-step lifestyle (prebiotic shared) | 1:1 | 1200 × 1200 |
| Cross-sell cards | 1:1 | 800 × 800 |
| Review photos (spice-refill `s10`–`s12`) | 4:3 portrait or square | 1200 × 1200 |

---

## Style direction — keep consistent across all 127

The template aesthetic is editorial and brand-led, not stocky:

- **Background:** Cream (#FFF9EE) or kit-color-soft tint, not pure white
- **Lighting:** Soft daylight, no harsh shadows
- **Composition:** Negative space is welcome — these images sit inside designed cards with their own padding
- **Props:** Indian kitchen context (steel containers, neem cutting board, terracotta — not Le Creuset)
- **People:** When humans are in frame (lifestyle, review photos), Indian skin tones, casual everyday clothing, in-home settings — not a studio
- **Text on image:** None. All copy is rendered in HTML over the image, not baked in.
- **Filters:** None / minimal. Avoid the warm-Instagram-preset look.

The hero blocks already render on a `--kit-color` (the SKU's accent) coloured background, so cutout-on-transparent product shots (PNGs) work especially well for `s01_pouch_front` slots — they let the brand colour show through behind the product. Worth flagging to the photographer.
