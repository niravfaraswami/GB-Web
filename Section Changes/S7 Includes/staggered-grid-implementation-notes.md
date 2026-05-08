# Staggered Grid ("Everything You Need to Ferment") — Implementation Notes

Handoff for Claude Code. Wires up the staggered grid section's image slots with the 9 generated images, and converts the Airlock card from text-only to a photo-backed dark card with code-overlaid text.

---

## Summary

9 images live in this section. **8 are simple `<img src>` swaps. 1 (Airlock) requires a structural change** to the existing markup + CSS — that's the bulk of this work.

## File touched

`gutbasket-fermentation-kit.html` — single file, three logical edits.

## Image asset checklist

Drop all 9 files into `/assets/`:

| # | Filename | Used in | Status |
|---|---|---|---|
| 1 | `kanji_s03_flat_lay.jpeg` | Card 1 — All components flat lay | Already wired, file may have been regenerated — confirm |
| 2 | `kanji_airlock_dark.jpeg` | Card 2 — Airlock (full-card photo background) | **NEW** — wire up in Step 2 |
| 3 | `kanji_s05_compare_right.jpeg` | Card 3 — 2L Glass Jar | Already wired, file may have been regenerated |
| 4 | `kanji_s07_component_spice.jpeg` | Card 4 — Spice Mix thumbnail | Already wired |
| 5 | `kanji_s07_component_boost.jpeg` | Card 5 — Ferment Boost thumbnail | Already wired |
| 6 | `kanji_s10_recipes_lifestyle.jpeg` | Card 6 — Recipe Book | Already wired, file may have been regenerated |
| 7 | `kanji_s09_step_3.jpeg` | Card 7 — Storage Lid (now: hand applying lid concept) | Already wired, file regenerated |
| 8 | `kanji_kit_hero.jpeg` | Refill card · "First Time, Get The Full Kit." side | **NEW** — replaces placeholder reuse, wire up in Step 1 |
| 9 | `kanji_refill_pack.jpeg` | Refill card · "Already Have The Jar, Just Refill." side | **NEW** — replaces placeholder reuse, wire up in Step 1 |

---

## Step 1 — Refill card image swaps (simple)

The two refill panels currently reuse placeholder images (`kanji_s03_flat_lay` and `kanji_s07_component_spice`). Replace with the dedicated heroes.

### Find this block (Full Kit side)

```html
<div class="refill-side">
  <div class="refill-img">
    <img src="assets/kanji_s03_flat_lay.jpeg" alt="Full Kanji Making Kit">
  </div>
  <div class="refill-body">
    <div class="refill-h">First Time?<br>Get The Full Kit.</div>
```

### Replace with

```html
<div class="refill-side">
  <div class="refill-img">
    <img src="assets/kanji_kit_hero.jpeg" alt="Kanji Making Kit — full first-time purchase">
  </div>
  <div class="refill-body">
    <div class="refill-h">First Time?<br>Get The Full Kit.</div>
```

### Find this block (Refill side)

```html
<div class="refill-side">
  <div class="refill-img">
    <img src="assets/kanji_s07_component_spice.jpeg" alt="Kanji Spice Mix + Ferment Boost refill pack">
  </div>
  <div class="refill-body">
    <div class="refill-h">Already Have The Jar?<br>Just Refill The Mix.</div>
```

### Replace with

```html
<div class="refill-side">
  <div class="refill-img">
    <img src="assets/kanji_refill_pack.jpeg" alt="Kanji Spice Mix + Ferment Boost refill pack — consumables only">
  </div>
  <div class="refill-body">
    <div class="refill-h">Already Have The Jar?<br>Just Refill The Mix.</div>
```

---

## Step 2 — Airlock card: convert from text-only to photo-backed (structural)

This is the larger change. The current `stag-dark` card renders an entirely typographic composition: dark backdrop, big serif "1" numeral on the left, eyebrow + headline + description in a body block on the right. **No image.**

We're keeping all that text exactly as-is — the change is to lay a photo (`kanji_airlock_dark.jpeg`) underneath the text as a full-card background. The photo's design supports this: airlock product on the right ~70% horizontal, left half is uniformly dark backdrop where the text already sits.

### Step 2a — Add CSS for the new photo-backed dark variant

Find the existing `.stag-card.stag-dark` rules in the stylesheet and **append** these rules immediately after them (do not replace the existing `.stag-dark` rules — the new variant extends them):

```css
/* ---------- Photo-backed Dark Card variant (Airlock) ---------- */
.stag-card.stag-dark-photo {
  position: relative;
  padding: 0;             /* override the .stag-dark padding — content wrapper handles it */
  overflow: hidden;
}
.stag-card.stag-dark-photo .stag-dark-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  z-index: 0;
}
/* Subtle left-side darkening — belt-and-braces in case the photo's left half
   isn't perfectly uniform. Cream text reads cleanly across either way. */
.stag-card.stag-dark-photo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(43, 34, 24, 0.55) 0%,
    rgba(43, 34, 24, 0.30) 35%,
    rgba(43, 34, 24, 0.00) 60%
  );
  z-index: 1;
  pointer-events: none;
}
.stag-card.stag-dark-photo .stag-dark-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: stretch;
  gap: 18px;
  padding: 24px 26px;
  height: 100%;
  width: 65%;             /* keep text content within the dark left-half so it never overlaps the airlock */
}
@media (max-width: 768px) {
  .stag-card.stag-dark-photo .stag-dark-content {
    width: 72%;
    padding: 14px 14px;
    gap: 8px;
  }
}
```

### Step 2b — Update the airlock HTML

### Find this block

```html
<!-- Dark stat: Airlock detail (replaces airlock spotlight section) -->
<div class="stag-card stag-dark">
  <div class="stag-num">1</div>
  <div class="stag-body">
    <span class="stag-num-small">FEATURE · AIRLOCK</span>
    <div class="stag-h">No daily burping</div>
    <div class="stag-d">One-way valve lets CO₂ escape, blocks oxygen + dust. Mould risk: zero.</div>
  </div>
</div>
```

### Replace with

```html
<!-- Photo-backed dark card: Airlock — image on right, text overlay on left -->
<div class="stag-card stag-dark stag-dark-photo">
  <img class="stag-dark-img" src="assets/kanji_airlock_dark.jpeg" alt="Airlock close-up — one-way valve detail">
  <div class="stag-dark-content">
    <div class="stag-num">1</div>
    <div class="stag-body">
      <span class="stag-num-small">FEATURE · AIRLOCK</span>
      <div class="stag-h">No daily burping</div>
      <div class="stag-d">One-way valve lets CO₂ escape, blocks oxygen + dust. Mould risk: zero.</div>
    </div>
  </div>
</div>
```

Note that `.stag-dark` stays on the element — that's intentional, since `.stag-dark-photo` extends `.stag-dark` (it inherits all the typography from the original dark variant: cream text, the `.stag-num` 96px serif numeral, the eyebrow font and letter-spacing, etc.). The `.stag-dark-photo` class only adds the photo-background plumbing.

---

## Step 3 — Grid style + overlay effects (design intent reference)

If Claude Code needs to extend or fix anything, here's the system this section follows.

### Grid style — `.stag-grid`

Three-column CSS Grid on desktop (`1.35fr 1fr 1fr`), two-column on mobile, with fixed row heights (`200px` desktop, `150px` mobile) and a 14px / 8px gap. Cards plug into the grid using span helpers:

- `.span-row-2` → spans 2 rows (used by Card 1, the flat lay hero)
- `.span-col-2` → spans 2 columns (mobile only, for cards that should go full width)

Cards use one of four visual styles:

- **`.stag-image-only`** — full-bleed image, no text. Used by Card 1.
- **`.stag-light`** — image-on-top + cream body strip with pill, headline, and one-line description. Used by Cards 3, 6, 7.
- **`.stag-detail`** — small thumbnail in header + bullet list. Used by Cards 4, 5.
- **`.stag-dark`** — dark typographic card with serif "1" numeral. Used by Card 2 (Airlock) — and the new `.stag-dark-photo` variant introduced in this change extends it with a photo background.

### Overlay effects — Airlock specifically

Three layers, z-indexed:

- **Layer 0 (z-index: 0):** `<img class="stag-dark-img">` — the photo. `object-fit: cover; inset: 0;` covers the entire card.
- **Layer 1 (z-index: 1):** `::after` pseudo-element — a left-darkening gradient from `rgba(43, 34, 24, 0.55)` at 0% to fully transparent at 60%. Lifts text legibility across the left half without darkening the airlock side.
- **Layer 2 (z-index: 2):** `.stag-dark-content` — the original text block (now wrapped). Constrained to `width: 65%` desktop, `72%` mobile, so it never overlaps the airlock product on the right.

**Why the gradient is included even though the photo's left half should already be dark:** the photo is generated at 1600×900 and downscaled into a slot that's ~350×200 desktop / ~170×150 mobile. Generation and recompression can introduce minor tonal variance; the gradient is a cheap insurance policy that makes cream text reliably legible regardless. If the photo turns out to be perfectly uniform, the gradient is invisible.

### Why no gradient on the other photo cards?

- `.stag-light` cards (Glass Jar, Recipe Book, Storage Lid) have text in a separate cream body strip *below* the photo — text never sits on top of the image, so no gradient needed.
- `.stag-detail` cards (Spice, Boost) use small thumbnails in a header strip — same reason.
- `.stag-image-only` (flat lay) has no text at all.

The Airlock is the only card in this section where text overlays the photo, hence the only card needing the gradient pattern.

---

## Step 4 — Verify

1. **Open at desktop width (≥1200px).** All 7 staggered grid cards visible. Card 1 (flat lay) spans 2 rows on the left. Card 2 (Airlock) shows the new photo with the airlock on the right and the "1" + text content reading clearly on the left half. Cards 3, 4, 5, 6, 7 render their respective photos.
2. **Refill card.** Two side-by-side panels below the staggered grid. Left side shows the new full-kit hero photo; right side shows the new refill-pack photo. Text content unchanged.
3. **Resize to <768px.** Grid becomes 2 cols, row height drops to 150px. Card 1 still spans 2 rows. Airlock card text stays in the left ~72% of its slot, airlock photo visible on the right. Refill card stacks vertically, both panels keep their image|text split.
4. **Verify text legibility on Airlock card** at both breakpoints. The cream serif "1", the eyebrow, the headline, and the description should all read cleanly against the dark portion of the photo. If anything feels washed out, raise the first stop of the gradient from `0.55` to `0.65`.
5. **Inspect the airlock photo** at desktop and mobile sizes. The airlock product should be visible on the right at both breakpoints — desktop shows it at ~70% horizontal; mobile center-crops the source so the airlock shifts to ~82% horizontal but remains fully visible. If it gets clipped, the source image needs the airlock pulled further left toward 60–65% horizontal — regenerate.

---

## Tuning knobs (no code changes needed, just values)

If something feels off after wiring up:

- **Text overlapping the airlock on the photo** → drop `.stag-dark-content { width }` from 65% to 60% (desktop) or 72% to 68% (mobile).
- **Text feels washed out on the photo** → increase the first stop of the gradient: `rgba(43, 34, 24, 0.65)` instead of `0.55`. Or push the second stop further right: `rgba(43, 34, 24, 0.30) 45%` instead of `35%`.
- **Photo feels too dark/grim overall** → reduce the gradient strength: drop the first stop to `0.40`.
- **Want zero gradient** (if the source photo is reliably dark) → comment out the `.stag-card.stag-dark-photo::after` rule.

---

## Out of scope

- The kit-switcher JS at the bottom of the file is unchanged. It doesn't touch any of the staggered grid markup.
- The `.stag-dark` original class stays — the new `.stag-dark-photo` extends it rather than replacing. This means any future text-only dark card (in another section, another kit) still works without modification.
- The other staggered grid cards (Cards 1, 3, 4, 5, 6, 7) need no markup changes — they already have `<img>` tags pointing at the correct slugs. If their images were regenerated, just swap the file in `/assets/` — no code change needed.
