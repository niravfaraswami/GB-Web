# Recipes ("One Kit. Endless Variety.") — Implementation Notes

Handoff for Claude Code. Drops the new restyled banner into the recipes section, locks in the seven recipe pills, and documents the full styling system for the pills and the wide banner.

---

## Summary

The section is structurally simple — a left-aligned header with a big number + headline, a 16:7 wide banner photo of the recipe variations, and a row of seven pill tags below. The image swap is **already wired correctly** since the slug stays the same (`kanji_s10_recipes_lifestyle.jpeg`); just place the new restyled file at that path. Most of this doc is a content + styling reference for the pills and the section header, since those are the editable bits.

## File touched

`gutbasket-fermentation-kit.html`

## Image asset

| Slug | AR | Source size | Status |
|---|---|---|---|
| `kanji_s10_recipes_lifestyle.jpeg` | 16:7 wide landscape | 1600 × 700 | Place new restyled file at this path — markup needs no change |

The banner uses `aspect-ratio: 16/7` on its container with the image set to `object-fit: cover; width: 100%; height: 100%`. Same proportions render on desktop and mobile (the AR is locked, only the absolute size scales).

---

## Step 1 — Header content (already in HTML)

The section header has three parts: eyebrow, a big numeral, and a title. Currently:

```html
<div class="section-header">
  <div class="eyebrow">ONE KIT. ENDLESS VARIETY.</div>
  <div class="recipes-h-row">
    <div class="recipes-num" data-bind="recipes-count">7</div>
    <div class="recipes-h-text">
      <em data-bind="recipes-h1">KANJI</em>
      <span data-bind="recipes-h2">RECIPES INSIDE</span>
    </div>
  </div>
</div>
```

The numeral renders in the kit's `--kit-color` (kanji maroon `#B8284C`) at 64px Montserrat 800. The title sits below in 36px Montserrat 800 uppercase. The `<em>` part ("KANJI") also colours in `--kit-color`; the `<span>` ("RECIPES INSIDE") stays in ink.

### Note on the count

Your section header in the brief said *"8 Kanji variations inside,"* but the HTML currently has `7` and seven pills. Pick one to align:

- **If the count should be 8:** add an eighth pill (Step 2 below) AND change `recipes-count` from `7` to `8`.
- **If the count stays at 7:** no change needed.

---

## Step 2 — Recipe pills (7 currently in HTML)

The pill row is a flex-wrap container with seven hard-coded tags. Each pill has a coloured dot, an emoji, and a recipe name.

### All 7 pills as currently rendered

| # | Emoji | Recipe name |
|---|---|---|
| 1 | 🥕 | Black Carrot |
| 2 | 🟣 | Beetroot |
| 3 | 🥒 | Cucumber-Mint |
| 4 | 🫐 | Amla-Turmeric |
| 5 | 🥭 | Aam Panna |
| 6 | 🍉 | Watermelon Rind |
| 7 | 🍍 | Pineapple Tepache |

### Current markup (one line, all pills)

```html
<div class="recipe-tags" id="recipe-tags">
  <span class="recipe-tag"><span class="dot"></span>🥕 Black Carrot</span>
  <span class="recipe-tag"><span class="dot"></span>🟣 Beetroot</span>
  <span class="recipe-tag"><span class="dot"></span>🥒 Cucumber-Mint</span>
  <span class="recipe-tag"><span class="dot"></span>🫐 Amla-Turmeric</span>
  <span class="recipe-tag"><span class="dot"></span>🥭 Aam Panna</span>
  <span class="recipe-tag"><span class="dot"></span>🍉 Watermelon Rind</span>
  <span class="recipe-tag"><span class="dot"></span>🍍 Pineapple Tepache</span>
</div>
```

Each pill is a `<span class="recipe-tag">` containing a `<span class="dot">` (the kit-coloured circle on the left) followed by the emoji + recipe name as plain text inside the same span.

### If you need to add an 8th pill

Append another `<span class="recipe-tag">` to the row — pick an emoji and name. Suggestions for what it could cover (the recipe doc would confirm):

- 🍅 Tomato-Curry Leaf
- 🟢 Green Mango (Kacha Aam)
- 🌶️ Chilli-Coriander
- 🍋 Lemon-Ginger
- 🌿 Mint-Coriander
- 🍇 Jamun (Indian Black Plum)

Match the format exactly — `<span class="dot"></span>` followed by emoji-space-name, all inside one parent `<span class="recipe-tag">`.

---

## Step 3 — Styling reference

### The banner

```css
.recipes-banner {
  aspect-ratio: 16 / 7;            /* locked at both breakpoints */
  background: var(--cream-deeper); /* fallback while image loads */
  border-radius: 16px;
  margin-bottom: 18px;
}
```

Banner has a small placeholder fallback (`background: var(--cream-deeper)` + a faded glyph) for when the image is missing — once the new restyled JPEG drops in, that placeholder is fully covered.

### Section header

```css
.recipes-h-row { display: block; margin-bottom: 24px; }
.recipes-num {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: 64px;
  color: var(--kit-color);          /* kanji maroon */
  line-height: 1;
  display: block;
  margin-bottom: 8px;
}
.recipes-h-text {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: 36px;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  line-height: 1.05;
  display: block;
}
.recipes-h-text em { font-style: normal; color: var(--kit-color); }
```

The numeral stacks ABOVE the headline (not inline). On mobile, the numeral drops to 56px (≤768px) and 48px (≤480px); the headline drops to 28px / 24px.

```css
@media (max-width: 768px) {
  .recipes-num { font-size: 56px !important; }
  .recipes-h-text { font-size: 28px !important; }
}
@media (max-width: 480px) {
  .recipes-num { font-size: 48px !important; }
  .recipes-h-text { font-size: 24px !important; }
}
```

The section header itself is **left-aligned** (overrides the global `centered` modifier with a section-scoped `!important`).

```css
.recipes-section .section-header,
.recipes-section .section-header.centered {
  text-align: left !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}
```

This is intentional — the recipes section is the only one in the PDP that breaks the centered-header rule, because the big numeral + headline pair reads better as a left-stacked block than as a centered one.

### Recipe pills

Two CSS blocks govern the pills — the base style and the section-scoped overrides.

```css
/* base style (defined once, used in multiple sections) */
.recipe-tag {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 999px;             /* full pill shape */
  padding: 6px 14px;
  font-size: 12px;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 6px;
}
.recipe-tag .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--kit-color);     /* kanji maroon dot */
}
.recipe-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
```

Then the section-specific overrides bump the pill font size + padding (since these are the page's primary "what's inside" indicators and need more presence than other recipe-tag uses elsewhere on the site):

```css
/* section-scoped overrides — bigger, breathier */
.recipes-section .recipe-tag {
  font-size: 14.5px !important;
  padding: 10px 18px !important;
  gap: 8px !important;
  font-weight: 500;
  letter-spacing: 0.005em;
}
.recipes-section .recipe-tag .dot {
  width: 9px !important;
  height: 9px !important;
}
.recipes-section .recipe-tags { gap: 10px; }

@media (max-width: 768px) {
  .recipes-section .recipe-tag {
    font-size: 13px !important;
    padding: 8px 14px !important;
  }
  .recipes-section .recipe-tag .dot {
    width: 8px !important;
    height: 8px !important;
  }
}
```

The pills wrap naturally onto multiple rows when the viewport gets narrow — no JS needed. The dot is always the kit colour (kanji maroon), so each kit's pills automatically take that kit's accent.

---

## Step 4 — Verify

1. **Drop the new restyled file** at `assets/kanji_s10_recipes_lifestyle.jpeg`. No code change needed; the existing `<img src>` already points there.
2. **Open the PDP at desktop width.** The banner renders at full width with 16:7 proportions. The header above it shows the kit-coloured "7" (or "8" if you bumped the count) with "KANJI RECIPES INSIDE" beside the bottom of the numeral. Below the banner, seven pills wrap cleanly across one or two lines with kit-coloured dots.
3. **Resize to <768px.** Banner stays 16:7 (image scales down proportionally). Numeral drops to 56px, headline to 28px. Pills shrink to 13px font with smaller padding. Pills wrap onto more lines but each still reads cleanly.
4. **Resize to <480px.** Numeral drops further to 48px, headline to 24px. Pills stay at 13px. Whole section still fits within the narrow viewport without horizontal scroll.
5. **Verify the banner image** has only three jars (matching the source you provided), warm cream backdrop, soft directional lighting. If a fourth jar appeared during the restyle, regenerate.
6. **Decide the 7-vs-8 question.** If the variation count needs to be 8, update the `recipes-count` value AND add an eighth `<span class="recipe-tag">` to the markup.

---

## Tuning knobs (no structural change required)

If anything feels off:

- **Banner feels too short:** the 16:7 aspect ratio is intentional but gives a very wide stripe. If you want more vertical presence, change the CSS to `aspect-ratio: 16/9` (slightly taller). The banner crops slightly differently — re-check the source image isn't getting jars cut off at the new ratio.
- **Pills feel cramped:** raise `.recipes-section .recipe-tags { gap: 10px }` to `14px` for more breathing room between pills.
- **Numeral feels too dominant:** drop the 64px to 52px (desktop) — the headline takes back some of the visual weight.
- **Pill dots feel washed out at small sizes:** raise the dot diameter from 9px to 10px (desktop) or 8px to 9px (mobile).
- **Pills wrap awkwardly with one orphan on the last line:** add a soft break by putting two pills on one line and the rest on another via inserting a `<br>` or grouping them in CSS — though the natural wrap is usually fine. Best to leave alone unless visually disruptive.

---

## Out of scope — flagged for future

- **Kit-switcher binding for the pills:** the pills are currently hard-coded for kanji. When this layout rolls to other kits (achaar, sauerkraut, kimchi), each kit needs its own pill set. Two options for the refactor:
  1. Wrap the `<div class="recipe-tags">` in a `data-bind="recipe-tags-html"` attribute and feed full innerHTML from each kit's data block. Quickest change, kept declarative.
  2. Add a `recipe_tags` array to each kit's data block (e.g. `[{emoji: '🥕', name: 'Black Carrot'}, ...]`) and have the JS render them. More structured, easier to manage long-term.
  Either approach works. Note for the next refactor pass.
- **Variation count binding:** `data-bind="recipes-count"` is already in place, so the number swaps per kit when the data is updated.
- **Headline binding:** `data-bind="recipes-h1"` and `data-bind="recipes-h2"` already in place. ("KANJI" + "RECIPES INSIDE" become whatever the kit's data specifies — for achaar: "ACHAAR" + "RECIPES INSIDE", etc.)
- **Banner image binding:** the `<img src>` has no `data-bind` currently. If each kit needs its own banner image, add `data-bind="recipes-banner-img"` to the `<img>` and populate per-kit. Today the kanji banner shows for all kits, which is wrong once other kits' PDPs go live.
