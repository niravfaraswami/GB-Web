# Claude Code Brief — Convert GutBasket Homepage to Shopify

## Background

GutBasket is a probiotic fermentation kit brand on Shopify. We have a static
HTML/CSS marketing homepage (`gutbasket-home.html`, 2,765 lines) that we want
to convert into a working Shopify theme — section-based, editable in the Theme
Editor, and driven by metafields where appropriate.

A separate PDP layout (`gutbasket-fermentation-kit.html`) has already been
partially converted to Shopify. The "How to Make" section was the first
section converted, and it works correctly. That section uses the
`how_to_make.*` metafield namespace with Liquid `{% if X != blank %}` gating
and per-product values driving the copy. Use that conversion as the reference
pattern for any product-bound content on the homepage.

The homepage is different from the PDP in one important way: most homepage
content is **store-wide**, not product-specific. So most homepage copy belongs
in section settings (Theme Editor → section block settings), not in product
metafields. Only product-card content (the Kanji card, Achaar card, etc.)
should pull from product metafields.

## Goal

A working Shopify theme where:

1. The homepage at `templates/index.json` renders the marketing homepage
   visually identical to `gutbasket-home.html`
2. Each section is a separate Liquid section file editable in the Theme Editor
3. Section copy is editable via Theme Editor section settings (no code edits
   needed for routine copy changes)
4. Product cards on the homepage pull product names, prices, and key copy
   from the actual products in the store (not hardcoded text)
5. The hero carousel, collections strip, and other multi-item sections are
   driven by Theme Editor section blocks (so the merchant can add/remove
   slides without code)

## Out of scope

**The menu bar / header navigation is NOT part of this conversion.** GutBasket
already has a working menu bar in the live Shopify theme. Do not touch it.
Do not replace it. Do not import it from `gutbasket-home.html`. The existing
menu bar in the live theme stays exactly as is.

This means:

- Skip lines in `gutbasket-home.html` that render the navigation/menu bar.
  The source HTML may include menu markup; ignore it during conversion.
- The converted `theme/layout/theme.liquid` should `{% sections 'header-group' %}`
  (or whatever the live theme uses to render its existing header) — do not
  build a new header section from scratch.
- If the source HTML's design appears to expect a specific menu bar styling
  that conflicts with the existing live menu bar, the existing live menu
  bar wins. Flag the conflict in the phase review document but do not
  resolve it by replacing the menu.
- Cart drawer, search, and announcement bar (the thin strip above the
  header) ARE in scope. Only the menu/navigation bar itself is excluded.

If you are unsure whether a piece of source HTML is "menu bar" or a separate
section, ask before converting it.

## Inputs

- `gutbasket-home.html` — source design, 2,765 lines, 13 distinct sections.
  Path: provided by Nirav. This file is read-only reference; do not edit it.
- `gutbasket-fermentation-kit.html` — PDP reference with 44 `data-bind`
  attributes and a working "How to Make" Liquid section. Use the "How to
  Make" section as the canonical pattern for any metafield-driven content.
- `gutbasketbrandguidev1_2_2.pdf` — typography, color, layout rules. Honor
  these in the Liquid output.

## Constraints

1. **Match the existing design exactly.** The current homepage is intentional
   — full-bleed 16:9 hero carousel, brand-guide typography (Montserrat 600–900,
   DM Sans 400–700, DM Mono 400–700), 3-layer color system. Do not redesign.
   Convert.

2. **Preserve all CSS class names.** The homepage CSS is large and battle-tested.
   Keep class names identical. If you need to add a class for Liquid-specific
   reasons (e.g., `data-section-id`), add it alongside the existing classes,
   don't replace.

3. **Action Orange `#FF7300` is for CTAs only.** The brand guide is strict on
   this. Never use it on headlines, decorative elements, or wordmarks. Confirm
   before generating any HTML where a styling decision is ambiguous.

4. **No JavaScript binding logic.** Use server-side Liquid rendering, not
   client-side JS injection. The PDP's existing `data-bind` attributes are
   decorative now (they survive for analytics / future use); Liquid handles
   all rendering.

5. **One section file per logical section.** Don't put all 13 sections into
   `index.liquid`. Each section gets its own file in `sections/` so the
   merchant can rearrange via Theme Editor.

6. **Defaults must render correctly.** When a section setting or metafield is
   empty, the section should still render with sensible default copy (use the
   Kanji baseline copy from `gutbasket-home.html` as the defaults). The page
   should never render blank.

## Phased plan

### Phase 1 — Foundation (do this first, stop before phase 2 for review)

Goal: prove the conversion approach works on a small slice before committing
to all 13 sections.

1. Read `gutbasket-home.html` end to end. Identify all 13 sections. Output
   a section inventory as a markdown table with these columns:
   - Section name (e.g., "Hero carousel")
   - Line range in source HTML
   - Number of editable text fields
   - Number of editable image fields
   - Whether it's product-bound (uses product data) or store-wide (just copy)
   - Recommended Liquid section name (e.g., `hero-carousel.liquid`)

2. Read `gutbasket-fermentation-kit.html` lines 8443–8489 and the Liquid file
   for the "How to Make" section if available. Document the conversion pattern
   used: namespace, key naming, default-value handling, `{% if X != blank %}`
   gating. This becomes the template for all Phase 2 conversions.

3. Set up the basic theme structure in the workspace:
   - `theme/layout/theme.liquid` — root layout with brand fonts, head meta,
     footer
   - `theme/sections/announcement-bar.liquid` — converted from lines 1620–1670
   - `theme/sections/hero-carousel.liquid` — converted from lines 1674–1725
   - `theme/sections/collections-strip.liquid` — converted from lines 1725–1770
   - `theme/templates/index.json` — wires the three sections above into the
     homepage in the correct order
   - `theme/snippets/` — empty for now, populate in phase 2 if needed
   - `theme/assets/theme.css` — extracted from the `<style>` block in the
     source HTML. Keep the existing CSS unchanged; just move it from inline
     to an asset file.

4. The hero carousel section must use Theme Editor blocks (one block per
   slide). Each block has settings for: image (file picker), heading (text),
   subheading (text), CTA label (text), CTA link (URL). The merchant can add,
   remove, and reorder slides via Theme Editor without code.

5. The collections strip section must use Theme Editor blocks (one block per
   collection card). Each block has settings for: image, label, link.

6. The announcement bar is a single setting block — text and an optional link.

7. After all three sections are built, write a `PHASE_1_REVIEW.md` document
   explaining:
   - What you built
   - Any decisions you made that the user should review (e.g., "I named the
     metafield namespace `homepage_hero` instead of `hero` because…")
   - How to test phase 1 in a Shopify dev store
   - What's in scope for phase 2

8. **Stop here.** Do not start phase 2 until the user confirms phase 1 works.

### Phase 2 — Remaining sections (run only after phase 1 review approves)

Convert the remaining 10 sections:

- Why GutBasket (3-pillar value props)
- How it works (3-step process)
- Refills CTA strip
- Postbiotic / prebiotic feature card
- Reviews carousel
- Learn (blog teaser)
- Founders' note
- Newsletter signup
- Footer
- Any sections in the source HTML I haven't named explicitly — handle them
  using the same pattern

**Reminder: do NOT convert the menu bar / header navigation in phase 2.**
That belongs to the existing live theme and is out of scope for this
conversion (see Out of scope section above).

For each section:

1. Read the section's HTML in the source file
2. Decide: is the content store-wide (use section settings) or product-specific
   (use product metafields)?
3. Create a Liquid section file with the same structure
4. Move all copy to section settings with the source HTML's text as the
   default value
5. Wire it into `templates/index.json`
6. Test that the section renders correctly with default copy
7. Test that editing the copy in Theme Editor updates the rendered output

When all 10 are done, update `templates/index.json` to include them in the
correct order matching the source HTML.

### Phase 3 — Product cards and metafield wiring (run only after phase 2)

The homepage references specific products (Kanji, Achaar, Sprouts, Aam Panna).
These should pull from real Shopify products, not be hardcoded.

1. For each product mentioned on the homepage, identify which fields come from:
   - Shopify product object: `product.title`, `product.featured_image`,
     `product.price`, `product.url`
   - Product metafields: tagline, kit color, persona-specific copy

2. Create metafield definitions for any product-specific homepage copy that
   doesn't have a Shopify-native equivalent (e.g., a homepage-card tagline
   that's different from the PDP tagline).

3. Update the relevant homepage sections to use `{% for product in collection.products %}`
   loops or direct `{{ product.metafields.X.Y }}` references.

4. Document the new metafield definitions in `METAFIELD_INVENTORY.md`.

## Testing

For each phase, the user will:

1. Pull the converted theme into a Shopify development store (Nirav has access
   to one)
2. Open the homepage on the development store URL
3. Verify visual parity with the source HTML (open both in adjacent browser
   windows, scroll through, look for design drift)
4. Open Shopify admin → Online Store → Themes → Customize → confirm each
   section is editable in Theme Editor

If any section drifts visually from the source, fix and re-test before moving
on. Visual parity is the bar.

## Deliverables

At the end of phase 1:
- The three Liquid section files
- `theme/layout/theme.liquid`
- `theme/templates/index.json`
- `theme/assets/theme.css`
- `PHASE_1_REVIEW.md`

At the end of phase 2:
- The remaining 10 Liquid section files
- Updated `templates/index.json` with all sections wired in
- `PHASE_2_REVIEW.md` documenting any deviations from the plan

At the end of phase 3:
- Updated section files using product data
- `METAFIELD_INVENTORY.md` listing every metafield created and its purpose
- A `SHOPIFY_DEPLOY.md` file with step-by-step instructions for uploading
  the theme to a Shopify store (theme upload via admin, GitHub integration
  setup, or Shopify CLI deploy — pick whichever is most appropriate for
  the user's situation)

## What to ask the user before starting

If any of these are unclear from the source files, ask before generating code:

1. Is there an existing Shopify theme to extend, or do you start from a
   minimal blank theme? (Recommendation: start from Shopify's Dawn theme as
   a base, since it has the modern section-based architecture this brief
   assumes.)

2. Should the converted theme include the existing Shopify Online Store 2.0
   sections (header, footer) from Dawn, or fully replace them with versions
   matching the GutBasket design? (Recommendation: keep the LIVE theme's
   existing menu bar / header — see Out of scope section. Replace footer to
   match GutBasket's design. Keep cart drawer and search from Dawn since
   they're standard.)

3. The source HTML has hardcoded product data (Kanji ₹999, Achaar ₹1,499,
   etc.). Should the converted homepage pull live prices from Shopify
   products, or keep hardcoded for now? (Recommendation: live prices from
   day one — hardcoded prices that drift from real prices is a known
   support burden.)

4. What's the authoritative source for the homepage's hero photos? The source
   HTML uses local image paths. Are those images already uploaded to Shopify's
   theme assets, or do they need to be uploaded as part of the conversion?

If the user can answer all four upfront, you can proceed without interruption.
If any are unclear, ask before phase 1 starts.

## Anti-patterns to avoid

1. **Don't put logic in `theme.liquid`.** That file is the layout shell. All
   page-specific content goes in section files.

2. **Don't inline CSS or JS.** Move CSS to `assets/theme.css`. Move JS (if any)
   to `assets/theme.js`. Reference them from `theme.liquid` via
   `{{ 'theme.css' | asset_url | stylesheet_tag }}`.

3. **Don't create custom snippets unless reused.** A snippet should be used
   in 2+ places. If a chunk of HTML appears in only one section, keep it
   inline in that section's Liquid file.

4. **Don't auto-translate text.** All copy in the source HTML is intentional.
   Do not "improve" the copy during conversion. If you think a phrase is
   weak, flag it in the phase review document; don't change it silently.

5. **Don't add features beyond the brief.** No carousel autoplay if the
   source HTML doesn't have it. No "exit intent" popup. No newsletter modal.
   Convert what's there. Add features in a separate task.

6. **Don't use `{% include %}`.** It's deprecated. Use `{% render %}`
   for snippets.

7. **Don't break the Theme Editor.** Every section must have valid `{% schema %}`
   JSON. Test in Theme Editor after creating each section. If the section
   breaks the customizer, fix the schema before moving on.

## Tone

The user (Nirav) prefers direct, succinct communication. When you have to
explain a decision, explain it once and move on. When you encounter a
genuine ambiguity, ask one specific question — don't ask three at a time.
When something is working, say so briefly and continue. The goal is a
working theme, not a long conversation about it.

## Final note

The homepage at `gutbasket-home.html` is the source of truth for visual
design. The PDP at `gutbasket-fermentation-kit.html` (specifically its
"How to Make" section) is the source of truth for Liquid conversion patterns.
When in doubt, look at one of those two files. Don't invent new patterns
when an existing one works.
