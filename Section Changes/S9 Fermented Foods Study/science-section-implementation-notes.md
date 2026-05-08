# The Science ("What Fermented Drinks Do For You") — Implementation Notes

Handoff for Claude Code. Wires up the four science section photos, locks in the four stat cards, and documents the checkerboard grid + dual-card-style system used here.

---

## Summary

The section uses a **4×2 checkerboard grid** alternating between dark stat cards (`.sci-stat`) and full-bleed image cards (`.sci-image`). Four stats, four photos, in an interleaved pattern. The stat cards are entirely typographic; the image cards are entirely photo. Both card types share the same grid cell size — only the visual treatment differs.

Currently the four image cards reuse `kanji_s11_consumption_*.jpeg` slugs (which are 3:4 portrait shots used elsewhere in the page for *How To Enjoy*). The new science-section images are 4:3 landscape and **need new dedicated slugs** so we don't break the other sections that depend on the 3:4 portrait shots.

## File touched

`gutbasket-fermentation-kit.html`

## Image asset checklist

Drop these four new files into `/assets/`:

| Card | New filename | Pairs with stat | Source AR | Source size |
|---|---|---|---|---|
| Image 1 | `kanji_science_mood.jpeg` | 47% Better Mood | 4:3 landscape | 1600 × 1200 |
| Image 2 | `kanji_science_energy.jpeg` | 56% More Energy | 4:3 landscape | 1600 × 1200 |
| Image 3 | `kanji_science_bloating.jpeg` | 42% Less Bloating | 4:3 landscape | 1600 × 1200 |
| Image 4 | `kanji_science_hunger.jpeg` | 52% Less Hunger | 4:3 landscape | 1600 × 1200 |

**Important — don't overwrite the existing `kanji_s11_consumption_*.jpeg` slugs.** Those files are 3:4 portrait and are used by the *How To Enjoy* section at the bottom of the page. The science section needs its own 4:3 landscape slugs.

---

## Step 1 — Image swaps (4 find/replace blocks)

The four image cards in the science section currently point at the consumption shots. Replace each `<img src>` with the new science slug.

### Find (Image 1)

```html
<!-- Image 1 -->
<div class="science-stag-card sci-image">
  <img src="assets/kanji_s11_consumption_morning.jpeg" alt="Daily kanji shot — fermented drink benefit">
</div>
```

### Replace with

```html
<!-- Image 1 — 47% Better Mood -->
<div class="science-stag-card sci-image">
  <img src="assets/kanji_science_mood.jpeg" alt="Better mood after 14 days of fermented kanji">
</div>
```

### Find (Image 2)

```html
<!-- Image 2 -->
<div class="science-stag-card sci-image">
  <img src="assets/kanji_s11_consumption_premeal.jpeg" alt="Live cultures in fermented kanji">
</div>
```

### Replace with

```html
<!-- Image 2 — 56% More Energy -->
<div class="science-stag-card sci-image">
  <img src="assets/kanji_science_energy.jpeg" alt="More daily energy from fermented kanji">
</div>
```

### Find (Image 3)

```html
<!-- Image 3 -->
<div class="science-stag-card sci-image">
  <img src="assets/kanji_s11_consumption_spritzer.jpeg" alt="Kanji spritzer — gut benefits in a glass">
</div>
```

### Replace with

```html
<!-- Image 3 — 42% Less Bloating -->
<div class="science-stag-card sci-image">
  <img src="assets/kanji_science_bloating.jpeg" alt="Less daily bloating with fermented kanji">
</div>
```

### Find (Image 4)

```html
<!-- Image 4 -->
<div class="science-stag-card sci-image">
  <img src="assets/kanji_s11_consumption_cold.jpeg" alt="Chilled kanji ferment">
</div>
```

### Replace with

```html
<!-- Image 4 — 52% Less Hunger -->
<div class="science-stag-card sci-image">
  <img src="assets/kanji_science_hunger.jpeg" alt="Less hunger between meals with fermented kanji">
</div>
```

---

## Step 2 — Card content reference (text already in HTML)

The four stat cards are hard-coded directly in the markup. **Verify the text is correct as-is; update inline if anything needs to change.** Each stat card has: an eyebrow, a big serif percentage, a headline, and a one-line description.

### Stat 1 (top-left)

```html
<div class="science-stag-card sci-stat">
  <div class="sci-stat-eyebrow">REPORTED</div>
  <div>
    <div class="sci-stat-num">47<span>%</span></div>
    <div class="sci-stat-h">Better Mood</div>
    <div class="sci-stat-d">After adding fermented drinks for just 14 days.</div>
  </div>
</div>
```

### Stat 2 (top-mid)

```html
<div class="science-stag-card sci-stat">
  <div class="sci-stat-eyebrow">REPORTED</div>
  <div>
    <div class="sci-stat-num">56<span>%</span></div>
    <div class="sci-stat-h">More Energy</div>
    <div class="sci-stat-d">Without supplements or lifestyle changes.</div>
  </div>
</div>
```

### Stat 3 (bottom-left-mid)

```html
<div class="science-stag-card sci-stat">
  <div class="sci-stat-eyebrow">REPORTED</div>
  <div>
    <div class="sci-stat-num">42<span>%</span></div>
    <div class="sci-stat-h">Less Bloating</div>
    <div class="sci-stat-d">From everyday fermented drinks like kanji.</div>
  </div>
</div>
```

### Stat 4 (bottom-right)

```html
<div class="science-stag-card sci-stat">
  <div class="sci-stat-eyebrow">REPORTED</div>
  <div>
    <div class="sci-stat-num">52<span>%</span></div>
    <div class="sci-stat-h">Less Hunger</div>
    <div class="sci-stat-d">Linked to improved gut health.</div>
  </div>
</div>
```

### Caption + disclaimer (below the grid)

```html
<div class="science-stag-caption">
  Based on a <strong>5,400+ person</strong> study on fermented drink intake.
</div>
<div class="science-stag-disclaimer" data-bind="study-disclaimer">
  *Results from ZOE Fermented Foods Intervention Study (ClinicalTrials.gov: NCT06882778), 
  a 10,000-participant dietary study. Outcomes are self-reported and associative. 
  Individual results may vary. Full peer-reviewed publication pending.
</div>
```

---

## Step 3 — Styling reference (the system)

This section uses two distinct card styles inside one shared grid. Both card types are 200px tall (160px on mobile), borderless, with rounded corners.

### The grid itself

```css
.science-stag-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);   /* 4-col checkerboard on desktop */
  grid-auto-rows: 200px;
  gap: 14px;
  margin-top: 32px;
}

@media (max-width: 768px) {
  .science-stag-grid {
    grid-template-columns: 1fr 1fr;        /* 2-col on mobile */
    grid-auto-rows: 160px;
    gap: 8px;
  }
}
```

The checkerboard layout flows like this:

```
Desktop (4 cols × 2 rows):
┌────────┬────────┬────────┬────────┐
│ Stat 1 │ Image 1│ Stat 2 │ Image 2│   row 1: stat-img-stat-img
├────────┼────────┼────────┼────────┤
│ Image 3│ Stat 3 │ Image 4│ Stat 4 │   row 2: img-stat-img-stat (offset)
└────────┴────────┴────────┴────────┘

Mobile (2 cols × 4 rows):
┌────────┬────────┐
│ Stat 1 │ Image 1│
├────────┼────────┤
│ Stat 2 │ Image 2│
├────────┼────────┤
│ Image 3│ Stat 3 │
├────────┼────────┤
│ Image 4│ Stat 4 │
└────────┴────────┘
```

### Card style 1 — `.sci-stat` (dark stat cards)

```css
.science-stag-card.sci-stat {
  background: #2B2218;                    /* warm dark brown */
  color: var(--cream);
  padding: 22px 24px;
  flex-direction: column;
  justify-content: space-between;         /* eyebrow at top, content at bottom */
}
.science-stag-card.sci-stat .sci-stat-eyebrow {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--cream);
  opacity: 0.7;
  font-weight: 700;
}
.science-stag-card.sci-stat .sci-stat-num {
  font-family: 'Cormorant Garamond', 'Georgia', serif;
  font-weight: 500;
  font-size: 84px;
  line-height: 0.9;
  letter-spacing: -0.02em;
  color: var(--cream);
  margin: 8px 0 12px;
}
.science-stag-card.sci-stat .sci-stat-num span {
  font-size: 32px;                        /* the % sign smaller than the number */
  font-weight: 500;
  opacity: 0.9;
}
.science-stag-card.sci-stat .sci-stat-h {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.01em;
  color: var(--cream);
  margin-bottom: 4px;
}
.science-stag-card.sci-stat .sci-stat-d {
  font-size: 12px;
  color: var(--cream);
  opacity: 0.78;
  line-height: 1.4;
}
```

The eyebrow ("REPORTED") sits at the top via `justify-content: space-between` on the column. The content block (number + headline + description) sits at the bottom of the card. This vertical separation gives the stat its editorial feel — eyebrow floats, content anchors.

**Mobile font scaling:**

```css
@media (max-width: 768px) {
  .science-stag-card.sci-stat { padding: 14px 14px; }
  .science-stag-card.sci-stat .sci-stat-num { font-size: 56px; margin: 4px 0 6px; }
  .science-stag-card.sci-stat .sci-stat-num span { font-size: 22px; }
  .science-stag-card.sci-stat .sci-stat-h { font-size: 11.5px; }
  .science-stag-card.sci-stat .sci-stat-d { font-size: 10.5px; line-height: 1.35; }
  .science-stag-card.sci-stat .sci-stat-eyebrow { font-size: 8.5px; }
}
```

The serif numeral drops from 84px to 56px on mobile, percentage span from 32px to 22px. The whole card stays readable at the smaller 160px row height.

### Card style 2 — `.sci-image` (full-bleed photo cards)

```css
.science-stag-card.sci-image { padding: 0; }
.science-stag-card.sci-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
```

Image cards are pure photo — no text, no overlay, no gradient, no padding. The photo fills the entire 200px × ~290px desktop slot (or 160px × ~168px mobile slot) via `object-fit: cover`. Default `object-position: center` means equal cropping on both sides at each breakpoint.

### Caption + disclaimer styling (below the grid)

```css
.science-stag-caption {
  text-align: center;
  margin-top: 24px;
  font-size: 13px;
  color: var(--text-muted);
}
.science-stag-disclaimer {
  text-align: center;
  margin-top: 12px;
  font-size: 11px;
  color: var(--text-soft);
  font-style: italic;
  line-height: 1.5;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
}
```

The caption sits 24px below the grid, in muted ink. The disclaimer sits 12px below that, smaller and italic, in the lightest text colour, max-width 720px so it wraps tidily on a wider viewport.

---

## Step 4 — Verify

1. **Drop the four new JPEGs** into `/assets/`: `kanji_science_mood.jpeg`, `kanji_science_energy.jpeg`, `kanji_science_bloating.jpeg`, `kanji_science_hunger.jpeg`.
2. **Apply the four `<img src>` find/replace blocks** from Step 1.
3. **Open the PDP at desktop width (≥1200px).** The 4×2 checkerboard renders. Top row left-to-right reads: dark stat (47%) · photo · dark stat (56%) · photo. Bottom row offsets: photo · dark stat (42%) · photo · dark stat (52%). All four photos render at their slots, vertically and horizontally centred (no awkward cropping of subject's face or body).
4. **Resize to <768px.** Grid collapses to 2 columns × 4 rows. Pairs flow stat-then-image (rows 1 and 2), then image-then-stat (rows 3 and 4) — checkerboard preserved.
5. **Verify each stat reads clearly** at both breakpoints. The percentage numerals should dominate visually; the headline reads as a benefit; the description fits on one or two lines.
6. **Verify the four photos look photographic, not AI-generated.** Apply the squint test — if a photo gives you "AI" gut feeling, regenerate that image with stronger anti-AI prompt language (real skin texture, candid framing, real camera + lens reference).

---

## Tuning knobs (no structural change required)

If something feels off after wiring up:

- **Numeral dominates too aggressively:** drop `.sci-stat-num` from `font-size: 84px` to `72px` (desktop) / `52px` (mobile).
- **Description text feels cramped against the bottom edge:** increase the bottom padding of `.sci-stat` from `22px 24px` to `22px 24px 28px`.
- **Photos feel too cropped on mobile (subject sides cut off):** the slot is ~1.05 AR, source is ~1.33 AR. Mobile crops 21% off each side. If subjects are routinely cut off, regenerate photos with `subject perfectly centered horizontally, central 60% of frame` in the prompt — or accept and move on; minor side-cropping is a known constraint at this small mobile slot.
- **Want a less harsh checkerboard alternation:** swap the row 2 ordering so photos and stats stack vertically rather than offsetting (i.e., col 1 has stat-stat, col 2 has photo-photo, etc.). Editorial impact softer; reads more like a static infographic instead of a rhythmic grid. Reorder the eight cards in the markup to achieve.

---

## Out of scope — flagged for future work

- **Kit-switcher binding:** Currently this section's stat cards are hard-coded for kanji ("fermented drinks", "kanji" mentioned in stat 3 description). When this layout is rolled to other fermentation kits (achaar, sauerkraut, etc.), each stat will need a `data-bind` attribute (e.g. `data-bind="science-stat-1-num"`) and the `setKit()` JS at the bottom of the file will need entries for each kit's stat values. The science headline already has `data-bind="science-h1"` and `data-bind="science-h2"` — the four stats need the same treatment. Note for the next refactor pass, not part of this section's image-wiring change.
- **Disclaimer:** the `data-bind="study-disclaimer"` is already in place, so per-kit study citations can be swapped via the kit data when needed.
- **Photo dynamic swap per kit:** if achaar/sauerkraut want their own science photos (likely yes, since the persona changes per kit), the four `<img src>` attributes will need `data-bind="science-img-1"` etc., with each kit's data block providing its own four science image slugs.
