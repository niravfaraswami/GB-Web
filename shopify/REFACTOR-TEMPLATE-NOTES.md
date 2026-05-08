# Fermentation Kit Refactor — Section-Split Template

Sibling of `product.fermentation-kit-leo.json`. Same visual design, but the monolithic single section is split into 15 individually addressable Shopify sections, so apps (Quinn, Judge.me, KnoCommerce, Loox, Rebuy, etc.) can be inserted between sections natively, each section gets its own 50-block cap, and admins get standard reorder / hide / move-up / move-down controls in the theme editor.

## Files

| Path | Purpose |
|---|---|
| `templates/product.fermentation-kit-refactor.json` | Template wiring 15 sections in order with Kanji default content |
| `sections/leo-hero.liquid` | Section: hero (gallery + variants + ATC + 3-tab accordion + benefit icons) |
| `sections/leo-trust.liquid` | Section: 4-card trust strip |
| `sections/leo-how-to-make.liquid` | Section: video + how-to steps |
| `sections/leo-first-30.liquid` | Section: 30-day timeline + image with golden swoop overlay |
| `sections/leo-stacks.liquid` | Section: 4-column comparison table |
| `sections/leo-stag.liquid` | Section: staggered grid (5 card variants) + refill card |
| `sections/leo-reels.liquid` | Section: Quinn UGC reels (`@app` block container) |
| `sections/leo-ugc.liquid` | Section: 3 UGC review cards |
| `sections/leo-science.liquid` | Section: 4×2 photo-backed stat checkerboard |
| `sections/leo-enjoy.liquid` | Section: 4 enjoy cards + dosage strip |
| `sections/leo-recipes.liquid` | Section: recipes banner + recipe pills |
| `sections/leo-faq.liquid` | Section: FAQ accordion |
| `sections/leo-cross.liquid` | Section: cross-sell products |
| `sections/leo-judgeme.liquid` | Section: Judge.me embed |
| `sections/leo-sticky-atc.liquid` | Section: sticky add-to-cart bar |
| `snippets/leo_kit_chrome.liquid` | Loads fonts + base CSS + leo CSS + leo JS for each section |
| `snippets/leo_kit_attrs.liquid` | Emits `data-kit data-template style="--kit-color: ..."` per-product attrs |
| `assets/leo-pdp.js` | Shared interactive JS (gallery, accordion, FAQ, variant sync, sticky bar, SVG recolor) |

The existing `fermentation-kit-leo` template stays untouched as a working reference.

## Architecture

**CSS reuse** — every section's outer wrapper carries `data-kit="fermentation" data-template="leo"` plus the same class names that the existing CSS targets (`.pdp-hero`, `.first30-section`, `.stag-section`, `.reviews-section`, etc.). `fermentation-kit.css` and `fermentation-kit-leo.css` are loaded unchanged. Zero new CSS was needed.

**Per-product theme color** — `snippets/leo_kit_attrs.liquid` reads the same `custom.theme_accent` / `theme_accent_dark` / `theme_accent_soft` metafields and emits them as inline CSS variables on each section's wrapper. No theme.liquid edits required; each section is self-contained.

**Asset / script loading** — `leo_kit_chrome.liquid` calls `{{ ... | stylesheet_tag }}` and `{{ ... | script_tag }}` once per section. Shopify dedupes those filter outputs at the page level, so loading from every section is safe.

**JS de-duplication** — `leo-pdp.js` sets `window.__leoPdpInit = true` at top so the IIFE skips re-binding even if it's evaluated more than once. All event handlers also use `dataset.bound` flags.

**App blocks** — `leo-reels.liquid` declares `{ "type": "@app" }`, so Quinn (and any other app block) appears in the theme editor's block picker for that section. Other sections can adopt the same pattern by adding `{ "type": "@app" }` to their schema.

## Section order shipped in the template

```
1.  hero            (Leo · Hero)
2.  trust           (Leo · Trust Strip)
3.  how-to-make     (Leo · How To Make)
4.  first-30        (Leo · First 30 Days)
5.  stacks          (Leo · Stacks)
6.  stag            (Leo · Includes)
7.  reels           (Leo · UGC Reels)        ← Quinn @app slot
8.  ugc             (Leo · UGC Reviews)
9.  science         (Leo · Science)
10. enjoy           (Leo · How To Drink)
11. recipes         (Leo · Recipes)
12. faq             (Leo · FAQ)
13. cross           (Leo · Cross-sell)
14. judgeme         (Leo · Judge.me)
15. sticky-atc      (Leo · Sticky ATC)       ← floating, last in DOM
```

In the theme editor, admins can drag any section up/down, hide it, or insert app blocks between sections. The sticky-atc renders as a floating bar regardless of its DOM position; placing it last keeps it out of the way of inline section content.

## Activation

1. Push this branch and let the theme sync.
2. In Shopify Admin → Online Store → Themes → Customize, open a Kanji product.
3. Click **Change template** → select **product.fermentation-kit-refactor**.
4. The 15 sections will appear in the customizer's left rail. Upload images per section (hero gallery uses product images automatically; the rest have image_picker fields).
5. For Quinn UGC reels: open the **Leo · UGC Reels** section, click **Add block**, select Quinn's block.
6. Save.

Repeat per product (Achaar, Aam Panna). The Kanji defaults are duplicated into each product's template instance via Shopify's section group mechanism.

## Block caps per section (no monolith squeeze)

The original monolithic `fermentation-kit-leo` section was at 49/50 blocks for Kanji and would have hit the cap with one more recipe pill or FAQ. After the split:

| Section | Default seeded | Cap |
|---|---:|---:|
| hero | 7 | 50 |
| how-to-make | 4 | 50 |
| first-30 | 6 | 50 |
| stacks | 7 | 50 |
| stag | 7 | 50 |
| ugc | 3 | 50 |
| enjoy | 4 | 50 |
| recipes | 7 | 50 |
| faq | 6 | 50 |
| reels, trust, science, cross, judgeme, sticky-atc | 0 | 50 |
| **Total** | **51** | **750** |

Plenty of headroom for future content without compromise.

## Compared to `fermentation-kit-leo` (monolithic)

|  | `fermentation-kit-leo` | `fermentation-kit-refactor` |
|---|---|---|
| Number of sections | 1 (~1,000 lines) | 15 (~80–300 lines each) |
| App-block insertion | One fixed `@app` slot between UGC and Science | Native between any sections; per-section `@app` opt-in |
| Section reorder via theme editor | Not possible | Standard drag-up/drag-down |
| Per-section hide / show | All-or-nothing | Per section |
| Block cap | 50 across all content | 50 per section |
| Theme editor UX | One section settings panel with 100+ fields | One panel per section |
| Maintenance | Edit one big file | Edit individual section files |

## Out of scope / future

- **Achaar + Aam Panna content overrides**: each product's template instance currently inherits Kanji defaults. To customise, change copy via the theme editor on those products.
- **Section group export**: Shopify supports saving a section configuration as a "section group" preset, which would let you spin up new kits with the same starter content faster. Not configured yet.
- **Global theme colour wrapper**: a `<style>` block in `theme.liquid` with `[data-kit-handle="kanji"] { --kit-color: ...; }` selectors would replace the per-section inline styles. Lower DOM noise, slightly higher coupling. Defer until you're confident the colour-per-product pattern is stable.
- **`_kit_icon_recolor.liquid` snippet** — currently inlined in `leo-pdp.js` via `recolorSvg()`. Could be lifted to a separate file if other templates need it.
