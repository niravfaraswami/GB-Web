# UGC Reviews ("What Our Customers Say") — Implementation Notes

Handoff for Claude Code. Wires up the three persona portraits, locks in the review text, and documents the photo-with-text-overlay system used in this section.

---

## Summary

The section already has three `.ugc-card` blocks in markup with the right slugs, the CSS overlay system is fully built. The actual work for this section is small:

1. Place three new portrait JPEGs in `/assets/`
2. Confirm (or update) the three review quotes — current text is in the HTML and listed below for review

No structural HTML/CSS changes are needed.

## File touched

`gutbasket-fermentation-kit.html`

## Image asset checklist

Drop these three files into `/assets/`:

| Card | Filename | Persona | Source AR | Source size |
|---|---|---|---|---|
| 1 | `ugc_review_1.jpeg` | Pratik Chheda, 32 | 3:4 portrait | 1200 × 1600 |
| 2 | `ugc_review_2.jpeg` | Deshna Shah, 23 | 3:4 portrait | 1200 × 1600 |
| 3 | `ugc_review_3.jpeg` | Aishwarya Pimpley, 32 | 3:4 portrait | 1200 × 1600 |

All three follow the same composition spec: subject's head at ~60% vertical of the source frame, body anchoring the bottom, top half cream/tan backdrop (because the upper 50% gets covered by the gradient overlay where the quote text lives).

---

## Step 1 — Review text (currently in HTML, updateable)

The three reviews are hard-coded directly in the `.reviews-section` block. Each card has a `quote`, a `name`, and an `age`. **Current text below — verify against the persona doc and update in place if anything needs to change.**

### Card 1 — Pratik Chheda

```html
<div class="ugc-card-quote">Balancing my gut made such a difference. My digestion feels stronger, my bloating dropped, and I'm not fighting my body anymore.</div>
<div class="ugc-card-name">Pratik Chheda</div>
<div class="ugc-card-age">32 years</div>
```

### Card 2 — Deshna Shah

```html
<div class="ugc-card-quote">After fixing my gut, I finally started feeling lighter after meals. My energy went up, and the bloating that had been stuck for months disappeared.</div>
<div class="ugc-card-name">Deshna Shah</div>
<div class="ugc-card-age">23 years</div>
```

### Card 3 — Aishwarya Pimpley

```html
<div class="ugc-card-quote">I'd tried everything before this. Once my gut got back on track, my bloating reduced and I started feeling like myself again.</div>
<div class="ugc-card-name">Aishwarya Pimpley</div>
<div class="ugc-card-age">32 years</div>
```

If the persona doc has different language or persona-specific context tags (city, role), update the relevant `.ugc-card-quote` / `.ugc-card-name` / `.ugc-card-age` text directly. The structure stays identical — only inner text changes.

**One small consideration:** if any quote runs longer than ~32 words, it may push past the gradient zone on mobile and start to overlap the photo. Aim for 25–30 words per quote for clean visual rhythm.

---

## Step 2 — Styling reference (how the overlay works)

This section uses one of the most layered designs on the page. Three things stack:

### Layer 0 — The card itself

```css
.ugc-card {
  background: #DDD3C2;          /* warm tan — matches the gradient */
  border-radius: 18px;
  overflow: hidden;
  position: relative;
  aspect-ratio: 3/4;            /* desktop */
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
```

The card is a 3:4 portrait box on desktop, 4:5 on mobile (set inside the mobile media query at line ~8932).

### Layer 1 — The photo (full-card, anchored to bottom)

```css
.ugc-card-photo {
  position: absolute;
  inset: 0;
  z-index: 1;
}
.ugc-card-photo img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center bottom;   /* IMPORTANT — preserves bottom of source */
  display: block;
}
```

`object-position: center bottom` is the key here — when the card AR doesn't perfectly match the source, the **top** of the source gets cropped, never the bottom. Subject's body stays anchored to the bottom of the card.

### Layer 1.5 — The cream gradient (overlays top of photo)

```css
.ugc-card-photo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(221, 211, 194, 0.95) 0%,
    rgba(221, 211, 194, 0.78) 28%,
    rgba(221, 211, 194, 0)    50%
  );
  pointer-events: none;
}
```

Cream `rgba(221, 211, 194, ...)` matches the card's background colour `#DDD3C2`. The gradient is opaque at the top (95%), still strong at 28%, fully transparent by 50%. Net effect: text reads cleanly on cream from 0–50%, photo reveals fully from 50–100%.

### Layer 2 — The text (sits on top of the gradient)

```css
.ugc-card-text {
  position: relative;
  z-index: 2;
  padding: 26px 26px 0;
}
.ugc-card-quote {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 16.5px;
  line-height: 1.4;
  color: var(--text);
  letter-spacing: -0.005em;
  margin-bottom: 20px;
}
.ugc-card-name {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: var(--text);
  margin-bottom: 1px;
}
.ugc-card-age {
  font-size: 12.5px;
  color: var(--text-muted);
  margin-bottom: 18px;
}
```

Quote uses the brand's body font (DM Sans) at 16.5px, with very tight letter-spacing for editorial feel. Name is 14px bold, age is 12.5px muted. All three sit in `var(--text)` (ink) — readable on the cream gradient.

### Layer 3 — The spacer (forces the text to the top)

```css
.ugc-card-spacer { flex: 1; min-height: 60px; z-index: 2; position: relative; }
```

Empty `<div>` after the text block. Because the parent card uses `flex-direction: column` and the spacer has `flex: 1`, it claims all remaining vertical space — pushing the text up to the top of the card and leaving the photo visible below.

### Mobile — horizontal carousel

```css
@media (max-width: 768px) {
  .ugc-grid {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 12px;
    margin-right: -24px;        /* bleed past container so next card peeks */
    padding-right: 24px;
  }
  .ugc-grid > .ugc-card {
    flex: 0 0 84%;              /* each card takes 84% of viewport */
    scroll-snap-align: start;
    aspect-ratio: 4/5;          /* slightly less portrait than desktop */
  }
  .ugc-card-quote { font-size: 14.5px; }
  .ugc-card-text { padding: 22px 22px 0; }
}
```

On mobile, the three cards become a horizontal scroll-snap carousel. Each card takes 84% of the viewport width with the next card peeking into view (the negative `margin-right: -24px` bleeds past the container edge, signalling there's more to swipe). Card AR shifts to 4:5 — the source 3:4 portrait crops ~6% off the **top** (preserved by `object-position: center bottom`).

---

## Step 3 — Verify

1. **Drop the three JPEGs** into `/assets/` with the exact filenames `ugc_review_1.jpeg`, `ugc_review_2.jpeg`, `ugc_review_3.jpeg`.
2. **Open the PDP at desktop width.** Three cards visible in a row, each showing the persona's photo with the cream gradient covering the top half. Quote, name, age render cleanly on the cream area; subject's face and body visible below the gradient.
3. **Resize to <768px.** Cards become a horizontal carousel. First card visible at 84% width, second card peeks from the right. Swipe horizontally to scroll through all three. Each card snaps to start.
4. **Inspect each photo** — subject's head should land at ~55–65% vertical of the card (just below where the gradient ends). If a head looks chopped off by the gradient, the source's subject was placed too high; reshoot or regenerate that one with the head lower in the frame.
5. **Read each quote** — confirm the three quotes match the persona doc's intent. Update the inner text of `.ugc-card-quote` directly in the HTML if anything needs to change.

---

## Tuning knobs (no structural change required)

If something needs to be dialled in after wire-up:

- **Photo too dim under the gradient:** drop the gradient stops to `rgba(221, 211, 194, 0.85) 0%, ... 0.65) 28%`. The gradient becomes lighter, more photo bleeds through near the top.
- **Quote text feels cramped:** increase the gradient's transparent zone — push `0% transparent` from `50%` to `45%` so the text gets a slightly larger cream canvas.
- **Subject's face feels too low:** in the photo's source, lift the subject (head at 55% rather than 65%). Or shift the gradient's transparent zone up: `0% transparent` at `55%` instead of `50%`.
- **Quote is overflowing:** trim it. If the persona doc quote is fixed, increase the card's `aspect-ratio` to give more vertical room — e.g., `aspect-ratio: 4/5.2` on desktop. Note: this changes the visual rhythm of the section.

---

## Out of scope

- The kit-switcher JS is unchanged. The reviews currently render with hard-coded names/quotes for kanji — when extending this layout to other kits (achaar, sprouts, etc.), each kit needs its own three-review block, or the existing `.ugc-card` markup needs to be wrapped in JS-rendered templating (a follow-up change, not part of this section).
- Star ratings — there are no star icons in this design. The reviews lean on the persona name + age for credibility rather than a 5-star rating. If you ever want stars added, they'd go in a new `.ugc-card-stars` div above `.ugc-card-quote`, styled with the same orange `#FFA500` used elsewhere on the page.
- Verified-buyer badges — same as above. Not in this design. Could be added as a small mono-font label below the age if needed.
