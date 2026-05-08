# How To Drink It Daily — Implementation Notes

Handoff for Claude Code. Drops in the four new lifestyle photos for this section, locks in the four card texts (number, title, description), documents the dosage callout strip below the grid, and walks through the gradient + typography overlay system used here.

---

## Summary

The section is structurally simple — a header, a 4-card grid of full-bleed photos with code-overlaid step numbers and titles, and a maroon dosage strip below. The image swap is **already wired correctly** since all four slugs stay the same (`kanji_s11_consumption_*.jpeg`); just place the new files at those paths.

Most of this doc is a content + styling reference for the cards and the dosage strip — that's where the editable bits live.

## File touched

`gutbasket-fermentation-kit.html`

## Image asset checklist

Drop these four files into `/assets/`:

| Card | Filename | Title | AR | Source size |
|---|---|---|---|---|
| 1 | `kanji_s11_consumption_morning.jpeg` | Morning Shot | 3:4 portrait | 1200 × 1600 |
| 2 | `kanji_s11_consumption_premeal.jpeg` | With Meals | 3:4 portrait | 1200 × 1600 |
| 3 | `kanji_s11_consumption_spritzer.jpeg` | Kanji Spritzer | 3:4 portrait | 1200 × 1600 |
| 4 | `kanji_s11_consumption_cold.jpeg` | Chilled Pour | 3:4 portrait | 1200 × 1600 |

The markup already points at these slugs — no `<img src>` changes needed. Just place the files.

---

## Step 1 — Section header (already in HTML)

```html
<div class="section-header">
  <div class="eyebrow">HOW TO</div>
  <h2>HOW TO <em>DRINK IT</em> DAILY.</h2>
</div>
```

The `<em>` around "DRINK IT" makes those two words render in the kit colour (kanji maroon `#B8284C`); the rest stays in ink. Standard PDP heading pattern.

---

## Step 2 — Card content (4 cards, all hard-coded in HTML)

Each card has three pieces of text rendered by code on top of the photo: a big serif number top-left, a headline at the bottom, and a one-line description below the headline.

### Card 1 — Morning Shot

```html
<div class="enjoy-card">
  <div class="enjoy-card-img"><img src="assets/kanji_s11_consumption_morning.jpeg" alt="Morning shot of kanji"></div>
  <div class="enjoy-card-num">1</div>
  <div class="enjoy-card-text">
    <div class="enjoy-card-h">Morning Shot</div>
    <div class="enjoy-card-d">50ml on an empty stomach.</div>
  </div>
</div>
```

### Card 2 — With Meals

```html
<div class="enjoy-card">
  <div class="enjoy-card-img"><img src="assets/kanji_s11_consumption_premeal.jpeg" alt="With a meal"></div>
  <div class="enjoy-card-num">2</div>
  <div class="enjoy-card-text">
    <div class="enjoy-card-h">With Meals</div>
    <div class="enjoy-card-d">A glass alongside your thali.</div>
  </div>
</div>
```

### Card 3 — Kanji Spritzer

```html
<div class="enjoy-card">
  <div class="enjoy-card-img"><img src="assets/kanji_s11_consumption_spritzer.jpeg" alt="Kanji spritzer"></div>
  <div class="enjoy-card-num">3</div>
  <div class="enjoy-card-text">
    <div class="enjoy-card-h">Kanji Spritzer</div>
    <div class="enjoy-card-d">+ sparkling water + mint.</div>
  </div>
</div>
```

### Card 4 — Chilled Pour

```html
<div class="enjoy-card">
  <div class="enjoy-card-img"><img src="assets/kanji_s11_consumption_cold.jpeg" alt="Chilled pour"></div>
  <div class="enjoy-card-num">4</div>
  <div class="enjoy-card-text">
    <div class="enjoy-card-h">Chilled Pour</div>
    <div class="enjoy-card-d">Straight from the fridge.</div>
  </div>
</div>
```

To update any card's title or description: find the `.enjoy-card-h` or `.enjoy-card-d` for the card in question and replace the inner text. Numbers (1–4) and image slugs stay as-is.

---

## Step 3 — Dosage strip below the grid (the "spoons-strip")

A maroon callout band sits below the 4-card grid, anchoring a daily dose recommendation.

```html
<div class="spoons-strip">
  <div class="spoons-num" data-bind="spoons-per-meal">50–150</div>
  <div class="spoons-label">ml per day</div>
  <div class="spoons-cap" data-bind="spoons-caption">Drink chilled or room temp. Don't heat.</div>
</div>
```

Three pieces of text:
- **Number:** `50–150` (the bold quantity, large serif numeral)
- **Label:** `ml per day` (the unit label, smaller)
- **Caption:** `Drink chilled or room temp. Don't heat.` (italic note in lower opacity)

Both `spoons-num` and `spoons-cap` have `data-bind` attributes wired to the kit data, so when this section rolls to other kits the dosage and caption swap automatically. The `spoons-label` ("ml per day") is currently hard-coded but applies to all liquid kits — for non-liquid kits like Achaar this would need rewording (e.g., "tablespoons per meal").

---

## Step 4 — Styling reference (the system)

Two distinct visual treatments stack here: the photo cards with text overlay, and the maroon dosage strip below.

### The card grid

```css
.enjoy-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);  /* 4-col on desktop */
  gap: 16px;
}

@media (max-width: 768px) {
  .enjoy-grid {
    grid-template-columns: 1fr 1fr;       /* 2x2 on mobile */
    gap: 10px;
  }
}
```

Four cards in a row on desktop, 2×2 on mobile. AR locked at `3/4` per card (set on `.enjoy-card`), so card height scales proportionally with width at every breakpoint.

### The card itself (3 stacked layers)

#### Layer 0 — The card box

```css
.enjoy-card {
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  aspect-ratio: 3/4;                     /* portrait box */
  background: var(--cream-deeper);       /* fallback before image loads */
  border: 1px solid var(--border-soft);
}
```

#### Layer 1 — The photo + bottom gradient

```css
.enjoy-card-img {
  position: absolute;
  inset: 0;
  z-index: 1;
}
.enjoy-card-img img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
}
.enjoy-card-img::after {
  /* bottom-up dark gradient — makes the bottom text readable */
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(43, 34, 24, 0)    35%,
    rgba(43, 34, 24, 0.6)  75%,
    rgba(43, 34, 24, 0.92) 100%
  );
  pointer-events: none;
}
```

The gradient sits directly on the photo via `::after`. It's TRANSPARENT for the top 35% (photo fully visible), starts darkening at 75%, reaches near-opaque ink at the bottom edge. White text at the bottom reads clearly without an inset panel.

#### Layer 2 — The big serif number (top-left, on top of photo)

```css
.enjoy-card-num {
  position: absolute;
  top: 14px; left: 16px;
  z-index: 2;
  font-family: 'Cormorant Garamond', 'Georgia', serif;
  font-weight: 500;
  font-size: 64px;
  line-height: 0.85;
  letter-spacing: -0.02em;
  color: var(--white);
  text-shadow: 0 2px 12px rgba(0,0,0,0.35);   /* lifts the white from any photo */
}
```

The numeral sits in the top-left at 64px Cormorant Garamond — large enough to be a confident editorial mark, with a subtle text-shadow to make the white survive against any photo content (since the gradient doesn't cover the top of the card).

**This is why the photographer brief flagged "top-left should NOT be a white plate, white wall, or bright highlight."** The text-shadow handles most cases, but if the top-left of a photo is pure white, the white serif numeral disappears.

#### Layer 2b — The bottom text block (over gradient)

```css
.enjoy-card-text {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  z-index: 2;
  padding: 16px 18px 18px;
  color: var(--white);
}
.enjoy-card-h {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: 14.5px;
  text-transform: uppercase;
  letter-spacing: 0.01em;
  margin-bottom: 4px;
  line-height: 1.15;
}
.enjoy-card-d {
  font-size: 12.5px;
  opacity: 0.92;
  line-height: 1.4;
}
```

The headline (uppercase Montserrat 800) and description (regular 12.5px) sit at the bottom, both in white, both reading cleanly against the near-opaque gradient bottom.

### Mobile font scaling

```css
@media (max-width: 768px) {
  .enjoy-card-num { font-size: 48px; top: 10px; left: 12px; }
  .enjoy-card-h   { font-size: 12.5px; }
  .enjoy-card-d   { font-size: 11px; }
  .enjoy-card-text { padding: 12px 14px 14px; }
}
```

The serif numeral drops from 64px to 48px; padding tightens. Card stays 3:4 — same on both breakpoints.

### The dosage strip (below the grid)

```css
.spoons-strip {
  margin-top: 24px;
  padding: 32px;
  background: var(--kit-color);          /* kanji maroon */
  border-radius: 14px;
  color: var(--white);
  text-align: center;
}
.spoons-num {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: 56px;
  letter-spacing: -0.02em;
  line-height: 1;
}
.spoons-label {
  font-size: 14px;
  font-weight: 600;
  margin-top: 6px;
  opacity: 0.95;
}
.spoons-cap {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 8px;
  font-style: italic;
}
```

Maroon background, full-width band sitting 24px below the cards. White text, all centered. The number `50–150` dominates at 56px Montserrat 800; `ml per day` is the unit label below; the italic caption sits at the bottom in lower opacity.

The `--kit-color` CSS variable means this band's background changes per kit automatically — kanji is maroon, achaar will be its own colour, etc. The text always stays white.

---

## Step 5 — Verify

1. **Drop the four new JPEGs** into `/assets/` with the existing slugs `kanji_s11_consumption_morning.jpeg`, `_premeal.jpeg`, `_spritzer.jpeg`, `_cold.jpeg`. No code change needed; markup already points there.
2. **Open the PDP at desktop width.** Section reads "HOW TO DRINK IT DAILY." with maroon-coloured "DRINK IT". Below it, four cards in a row at 3:4 portrait. Each card has a large white serif numeral (1, 2, 3, 4) in the top-left, a photo filling the card, and a bottom-up dark gradient with the title (uppercase white) and description (smaller white) at the bottom. Below the cards, a maroon strip says `50–150 / ml per day / Drink chilled or room temp. Don't heat.`
3. **Resize to <768px.** Grid collapses to 2×2. Numerals shrink to 48px. Title and description font sizes drop. Maroon strip stays full-width but its inner content scales down naturally.
4. **Verify each numeral is readable** at the top-left of its card. If a numeral is hard to see — likely because the photo's top-left zone is bright (white wall, bright highlight) — consider a darker photo composition, or strengthen the text-shadow from `0 2px 12px rgba(0,0,0,0.35)` to `0 2px 16px rgba(0,0,0,0.55)`.
5. **Verify the bottom gradient covers the bottom 35–40%** of each card cleanly. Title and description should read white-on-dark without straining. If text washes out on any card, the photo's bottom-half is too dark or too light — typically a card-specific image issue, not a CSS issue.

---

## Tuning knobs (no structural change required)

If something feels off after wiring up:

- **Numerals get lost on bright photos:** raise the text-shadow strength on `.enjoy-card-num` to `0 2px 16px rgba(0,0,0,0.55)`. Or move the numeral to the top-right where photo content is often less busy.
- **Bottom text feels cramped against the bottom edge:** raise the bottom padding from `18px` to `22px` on `.enjoy-card-text`.
- **Bottom gradient too aggressive:** raise the first opaque stop from `0.92` to `0.78` and the dark zone start from `75%` to `80%`. Photos at the bottom show through more.
- **Bottom gradient not strong enough (text washing out):** drop the dark zone start from `75%` to `65%` so the gradient is darker further up.
- **Cards too narrow on desktop:** four cards at 3:4 in a 1200px-wide grid means each card is ~285px wide × 380px tall. If you want them shorter, change `aspect-ratio: 3/4` to `4/5` (less portrait) — but verify the photos still read well at the new crop.
- **Dosage strip feels too loud:** the maroon background is on-brand but commanding. To soften, change `padding: 32px` to `padding: 24px` and the number from `56px` to `48px`. Or swap `background: var(--kit-color)` for `background: var(--all-in-one)` (warm dark brown — quieter).

---

## Out of scope — flagged for future

- **Kit-switcher binding for the 4 cards:** the four card titles, descriptions, and image slugs are currently hard-coded for kanji. When this layout rolls to other kits, each kit needs its own four cards' content. Suggested refactor: add a `consume_steps` array to each kit's data block (e.g. `[{img: 'kanji_s11_consumption_morning', num: '1', title: 'Morning Shot', desc: '50ml on an empty stomach.'}, ...]`) and have the JS render the cards from that array. Cleaner than per-kit hard-coding.
- **Dosage strip:** `data-bind="spoons-per-meal"` and `data-bind="spoons-caption"` are already in place, so the number and caption swap per kit. The label `ml per day` is hard-coded — for non-liquid kits (Achaar) this would need to become "tablespoons per meal" or similar. Adding `data-bind="spoons-label"` would future-proof this.
- **Section heading:** "HOW TO DRINK IT DAILY." is hard-coded for liquid kits. For Achaar, this becomes "HOW TO EAT IT DAILY." For Sprouts, "HOW TO USE THEM DAILY." Either add per-kit `data-bind="enjoy-h1"` and `data-bind="enjoy-h2"` to split into editable spans, or accept the section heading is liquid-specific and use a different section template for non-liquid kits. Refactor decision for later.
