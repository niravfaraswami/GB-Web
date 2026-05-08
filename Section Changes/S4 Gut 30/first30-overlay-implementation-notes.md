# First 30 Days — Overlay Implementation Notes

Handoff for Claude Code. Single source-of-truth for the SVG overlay change to the "Your Gut's First 30 Days" hero photo on the Kanji Making Kit PDP.

---

## Goal

Replace the existing CSS-positioned annotation divs (`.first30-anno`) with a proper SVG overlay containing:
- A swoop curve crossing the photo
- 3 dots anchored on the curve
- 3 two-line labels (`Digestion / Improves`, `Less / Bloating`, `Steadier / Energy`)

Two SVGs live in the markup, one for desktop (4:5) and one for mobile (1:1), swapped via CSS media query. Each SVG has its own `viewBox` matching the cropped photo at that breakpoint.

## Why two SVGs

The same source photo (3:4 portrait) is rendered at different aspect ratios per breakpoint (`object-fit: cover` crops top + bottom on mobile). That means the dots need different absolute positions at each breakpoint to land on the correct part of the photo. Two SVGs is the cleanest solution.

---

## File touched

`gutbasket-fermentation-kit.html` — single file, three edits described below.

## Image asset

The existing `<img>` currently points to `assets/kanji_s11_consumption_premeal.jpeg` (reused from another section). Replace with a dedicated photo:

- **New slug:** `assets/kanji_first30_hero.jpeg`
- **Source AR:** 3:4 portrait (e.g. 1200 × 1600)
- **Subject placement:** subject pushed upper-right, glass upper-left, lower-right empty for the "Steadier Energy" label

Update only the `src` attribute and the `alt` text.

---

## Color spec

All overlay elements (swoop, dot, text) use a single dark ink color with a soft cream halo:

| Element | Property | Value |
|---|---|---|
| Swoop path | `stroke` | `#2B2218` |
| Swoop path | `stroke-width` | `1.6` |
| Swoop path | `opacity` | `0.88` |
| Dot (solid) | `fill` | `#2B2218`, `r="6"` |
| Dot (halo ring) | `stroke` | `#2B2218`, `stroke-width="1.5"`, `r="14"`, `opacity="0.55"`, `fill="none"` |
| Label text | `fill` | `#2B2218` |
| Label heading line | `font-weight` | `700` |
| Label detail line | `font-weight` | `500` |
| Label text | `font-family` | `Inter, 'Helvetica Neue', sans-serif` |
| Label text | `font-size` | `26` (in viewBox units; scales) |
| Label text | `letter-spacing` | `0.2` |
| Halo glow | `flood-color` | `#F5EFE3` |
| Halo glow | `flood-opacity` | `0.95` |
| Halo glow | `stdDeviation` (blur) | `4.5` |
| Halo glow | `radius` (dilate) | `2` |

The halo is implemented as one shared SVG `<filter>` applied to a `<g>` wrapping the swoop, dots, and text.

**Alternative palette** (note for future): if dark feels too heavy on a different photo, swap `#2B2218` for brand maroon `#6E1733` — same halo color stays.

---

## Step 1 — Update CSS

Find the existing `.first30-right` rule and the three `.first30-anno` rules and **replace** them with the block below.

### Find and replace this block

```css
.first30-right {
  border-radius: 18px;
  overflow: hidden;
  position: relative;
  background: var(--cream-deeper);
  min-height: 480px;
}
.first30-right img {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
}
.first30-anno {
  position: absolute;
  color: var(--white);
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 13.5px;
  line-height: 1.25;
  letter-spacing: 0.005em;
  text-shadow: 0 1px 6px rgba(0,0,0,0.35);
}
.first30-anno::before {
  content: '';
  position: absolute;
  width: 11px; height: 11px;
  border-radius: 50%;
  border: 1.5px solid var(--white);
  background: rgba(255,255,255,0.18);
}
.first30-anno.a1 { top: 16%; left: 10%; }
.first30-anno.a1::before { left: -22px; top: 4px; }
.first30-anno.a2 { top: 52%; left: 16%; }
.first30-anno.a2::before { left: -22px; top: 4px; }
.first30-anno.a3 { top: 80%; right: 12%; }
.first30-anno.a3::before { right: -22px; top: 4px; }
```

### With this

```css
.first30-right {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  background: var(--cream-deeper);
  aspect-ratio: 4 / 5;          /* desktop: locked AR so SVG aligns with photo */
}
.first30-right img {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover; display: block;
}
.first30-svg-overlay {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  pointer-events: none;
}
.first30-svg-mobile { display: none; }
@media (max-width: 768px) {
  .first30-svg-desktop { display: none; }
  .first30-svg-mobile  { display: block; }
}
```

### Update the existing mobile media query

Find this rule inside the existing `@media (max-width: 768px)` block:

```css
.first30-right { min-height: 320px; order: -1; }
```

Replace with:

```css
.first30-right { aspect-ratio: 1 / 1; order: -1; }
```

### Update the parent grid

Find `.first30-grid` and change `align-items: stretch` to `align-items: start` so the locked-AR right column doesn't get force-stretched:

```css
.first30-grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 48px;
  align-items: start;     /* was: stretch */
}
```

---

## Step 2 — Replace HTML

### Find this block

```html
<div class="first30-right">
  <img src="assets/kanji_s11_consumption_premeal.jpeg" alt="Daily kanji as part of a meal — gut health benefits over 30 days">
  <div class="first30-anno a1">Digestion<br>Improves</div>
  <div class="first30-anno a2">Less<br>Bloating</div>
  <div class="first30-anno a3">Steadier<br>Energy</div>
</div>
```

### Replace with

```html
<div class="first30-right">
  <img src="assets/kanji_first30_hero.jpeg" alt="Woman holding a glass of fresh kanji — gut health benefits across the first 30 days">

  <!-- DESKTOP overlay (4:5) -->
  <svg class="first30-svg-overlay first30-svg-desktop"
       viewBox="0 0 800 1000"
       preserveAspectRatio="xMidYMid slice"
       xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <filter id="f30-halo-d" x="-50%" y="-50%" width="200%" height="200%">
        <feMorphology in="SourceAlpha" operator="dilate" radius="2"/>
        <feGaussianBlur stdDeviation="4.5"/>
        <feFlood flood-color="#F5EFE3" flood-opacity="0.95"/>
        <feComposite in2="SourceAlpha" operator="in"/>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#f30-halo-d)" font-family="Inter, 'Helvetica Neue', sans-serif">
      <path d="M 120 215 C 60 350, 60 470, 95 565 C 130 660, 320 720, 645 870"
            stroke="#2B2218" stroke-width="1.6" fill="none" stroke-linecap="round" opacity="0.88"/>
      <!-- dot 1 -->
      <circle cx="120" cy="215" r="14" fill="none" stroke="#2B2218" stroke-width="1.5" opacity="0.55"/>
      <circle cx="120" cy="215" r="6" fill="#2B2218"/>
      <!-- dot 2 -->
      <circle cx="95"  cy="565" r="14" fill="none" stroke="#2B2218" stroke-width="1.5" opacity="0.55"/>
      <circle cx="95"  cy="565" r="6" fill="#2B2218"/>
      <!-- dot 3 -->
      <circle cx="645" cy="870" r="14" fill="none" stroke="#2B2218" stroke-width="1.5" opacity="0.55"/>
      <circle cx="645" cy="870" r="6" fill="#2B2218"/>
      <!-- labels -->
      <text x="145" y="210" fill="#2B2218" font-size="26" font-weight="700" letter-spacing="0.2">Digestion</text>
      <text x="145" y="242" fill="#2B2218" font-size="26" font-weight="500" letter-spacing="0.2">Improves</text>
      <text x="125" y="560" fill="#2B2218" font-size="26" font-weight="700" letter-spacing="0.2">Less</text>
      <text x="125" y="592" fill="#2B2218" font-size="26" font-weight="500" letter-spacing="0.2">Bloating</text>
      <text x="625" y="868" fill="#2B2218" font-size="26" font-weight="700" letter-spacing="0.2" text-anchor="end">Steadier</text>
      <text x="625" y="900" fill="#2B2218" font-size="26" font-weight="500" letter-spacing="0.2" text-anchor="end">Energy</text>
    </g>
  </svg>

  <!-- MOBILE overlay (1:1) -->
  <svg class="first30-svg-overlay first30-svg-mobile"
       viewBox="0 0 800 800"
       preserveAspectRatio="xMidYMid slice"
       xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <filter id="f30-halo-m" x="-50%" y="-50%" width="200%" height="200%">
        <feMorphology in="SourceAlpha" operator="dilate" radius="2"/>
        <feGaussianBlur stdDeviation="4.5"/>
        <feFlood flood-color="#F5EFE3" flood-opacity="0.95"/>
        <feComposite in2="SourceAlpha" operator="in"/>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#f30-halo-m)" font-family="Inter, 'Helvetica Neue', sans-serif">
      <path d="M 110 165 C 55 270, 55 360, 90 430 C 130 510, 320 580, 640 695"
            stroke="#2B2218" stroke-width="1.6" fill="none" stroke-linecap="round" opacity="0.88"/>
      <circle cx="110" cy="165" r="14" fill="none" stroke="#2B2218" stroke-width="1.5" opacity="0.55"/>
      <circle cx="110" cy="165" r="6" fill="#2B2218"/>
      <circle cx="90"  cy="430" r="14" fill="none" stroke="#2B2218" stroke-width="1.5" opacity="0.55"/>
      <circle cx="90"  cy="430" r="6" fill="#2B2218"/>
      <circle cx="640" cy="695" r="14" fill="none" stroke="#2B2218" stroke-width="1.5" opacity="0.55"/>
      <circle cx="640" cy="695" r="6" fill="#2B2218"/>
      <text x="135" y="160" fill="#2B2218" font-size="26" font-weight="700" letter-spacing="0.2">Digestion</text>
      <text x="135" y="192" fill="#2B2218" font-size="26" font-weight="500" letter-spacing="0.2">Improves</text>
      <text x="120" y="425" fill="#2B2218" font-size="26" font-weight="700" letter-spacing="0.2">Less</text>
      <text x="120" y="457" fill="#2B2218" font-size="26" font-weight="500" letter-spacing="0.2">Bloating</text>
      <text x="620" y="693" fill="#2B2218" font-size="26" font-weight="700" letter-spacing="0.2" text-anchor="end">Steadier</text>
      <text x="620" y="725" fill="#2B2218" font-size="26" font-weight="500" letter-spacing="0.2" text-anchor="end">Energy</text>
    </g>
  </svg>
</div>
```

---

## Step 3 — Verify

1. **Open at desktop width.** The right column is locked to a 4:5 portrait, the photo fills it, and the swoop + dots + labels appear over the photo. The two-line labels read clearly thanks to the cream halo.
2. **Open at <768px width.** Mobile SVG takes over (the 1:1 one), desktop SVG hides. The image container locks to a 1:1 square. Subject + glass remain visible.
3. **DevTools resize sweep.** Drag the viewport between 320 → 1440 px. The image, swoop, and labels all stay aligned because everything scales off the same `viewBox`.
4. **Print colors verified.** Swoop path, all dot fills, and all text use `#2B2218`. Halo color is `#F5EFE3` at 0.95 opacity.

---

## Tuning knobs (no code changes needed, just values)

If the new photo lands and the dots feel slightly off:

- **Move a dot:** edit its `cx` / `cy` on both the `<circle>` pair AND the matching `<text>` block (move both by the same delta).
- **Reshape the swoop:** edit the `d="…"` path data. The two cubic Beziers (`C` operators) control the dip and the sweep. Lift the first control y-value to shorten the dip, push the last x-value right to extend the sweep.
- **Stronger halo:** raise `stdDeviation` to 6, or `flood-opacity` to 1.0.
- **Heavier text:** raise `font-size` to 28 or 30 in the `<text>` blocks.
- **Brand maroon variant:** find/replace `#2B2218` with `#6E1733` inside the SVG only.

---

## Open / out of scope

- Two SVGs is intentional — do not collapse into one. Different breakpoints crop the photo differently and dots need to land on different photo regions.
- The existing `.first30-stats-strip` block and the rest of the section are untouched.
- The kit-switcher JS doesn't need to know about this overlay; it lives entirely inside `.first30-right`.
