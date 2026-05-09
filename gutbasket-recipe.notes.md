# GutBasket — Recipe Page Template (Template 10)

**Source:** `gutbasket-recipe.html`
**Maps to in Shopify:** A custom page type. Two viable Shopify modellings — pick one:
- **Recipe-as-article** (recommended): use the `templates/article.json` mechanism with a separate blog called "Recipes". Article object holds title, image, excerpt; everything else lives in metafields. Lets editors use Shopify's familiar article editor.
- **Recipe-as-page**: use `templates/page.recipe.json`. Less editorial UX, but cleaner if recipes won't be tagged/paginated like a blog.

This is the **Learn → Recipes** content type. Step-by-step cooking/fermentation instructions, with a YouTube walkthrough and a hard kit upsell.

---

## What this template is for

Single recipe pages, ~600–1,200 words of method. Heavy on structured data: ingredient list with grams, numbered method steps with images per step, video walkthrough, dietary tags, kit upsell. Written for someone who is about to cook — they need quick scan-ability, big numbers, and a sticky jump-nav.

The current preview demonstrates a Raw Mango Probiotic Achaar recipe.

---

## File layout

Three logical zones inside `<body>`, same pattern as the blog template:

1. **Theme shell** — promo bar, `<header class="site-header">`, `<footer class="site-footer">`. *Skip when porting.*
2. **Template body** — everything inside `<main>`. This is the recipe template.
3. **Inline `<script>`** — `loadVideo()` swaps the YouTube poster div for an actual `<iframe>` on click.

---

## Sections inside `<main>` (in order)

| # | Section | CSS root class | Required content |
|---|---|---|---|
| 1 | Recipe hero | `.recipe-hero` | Two-column grid (1fr 1fr): left = category pill, H1, subtitle, dietary-tag pills; right = square hero image / large emoji block in kit-color |
| 2 | Meta strip | `.recipe-meta-strip` | 6-column grid of icon + label + value: Prep, Ferment, Total, Yield, Difficulty, Cuisine |
| 3 | Jump nav (sticky) | `.jump-nav` | Pill-shaped anchors: Ingredients, Method, Video, Notes. Sticks below the header at `top: 76px`. |
| 4 | Ingredients | `.recipe-section#ingredients` > `.ingredients-grid` | 2-column grid of `.ingredient-row` items. Each row: amount pill + name + descriptor. |
| 5 | Method | `.recipe-section#method` > `.method-step` (×N) | Two-column rows: square `.step-image` (with absolute-positioned `.step-num` badge top-left) + `.step-body` containing title + description |
| 6 | Video | `.recipe-section#video` > `.video-block` > `.video-thumb` | Lazy-loaded YouTube. Click swaps the gradient thumb for an iframe. |
| 7 | Notes & variations | `.recipe-section#notes` > `.notes-list` | Plain `<ul>`, each `<li>` styled as a kit-color left-bordered card |
| 8 | Kit CTA | `.kit-cta-section` > `.kit-cta-card` | Dark card with two halves: copy block on left, product block (image + name + price + button) on right |
| 9 | Related recipes | `.related-recipes` > `.related-recipe-grid` | 2-card grid of related recipes |

---

## Color / category theming

Same three-variable system as the blog template:

```css
--kit-color:       /* amount pills, dietary tags, video gradient, button */
--kit-color-dark:  /* video gradient end, hover */
--kit-color-soft:  /* category pill bg, step-image bg, dietary-tag bg */
```

Recipes pick their color from a related **kit/SKU**, not a category — so the theming follows the product family the recipe belongs to. Examples from the unified file:

| Recipe family | Source kit | `--kit-color` |
|---|---|---|
| Raw Mango Achaar / Lemon Achaar / Garlic Achaar | Probiotic Achaar Making Kit | `#FF7300` (achaar orange) |
| Black Carrot Kanji / Beetroot Kanji | Kanji Making Kit | `#8B1F40` (kanji red) |
| Napa Kimchi | Kimchi Making Kit | `#E85C41` (kimchi red-orange) |

The current preview is themed for **achaar (orange)**.

In Shopify, set these on `<body>` based on the linked product's metafield:

```liquid
{%- assign linked = recipe.metafields.custom.kit -%}
<style>
  :root {
    --kit-color:      {{ linked.metafields.custom.color | default: '#FF7300' }};
    --kit-color-dark: {{ linked.metafields.custom.color_dark | default: '#E66800' }};
    --kit-color-soft: {{ linked.metafields.custom.color_soft | default: '#FFE4D1' }};
  }
</style>
```

---

## Data model — what to wire from Shopify

| HTML hook | Shopify source |
|---|---|
| `[data-bind="category"]` | `recipe.metafields.custom.category_label` (e.g. "FERMENTATION 101") |
| `<h1 data-bind="title">` | `recipe.title` |
| `[data-bind="subtitle"]` | `recipe.metafields.custom.subtitle` |
| `[data-bind="hero-emoji"]` | `recipe.image` if set, else `recipe.metafields.custom.hero_emoji` |
| `#dietary-tags` children (`.dietary-tag`) | `recipe.metafields.custom.dietary_tags` (list, e.g. ["Vegan", "Gluten-Free", "No Oil"]) |
| `[data-bind="prep-time"]` | `recipe.metafields.custom.prep_time` ("20 min") |
| `[data-bind="ferment-time"]` | `recipe.metafields.custom.ferment_time` ("5–7 days") |
| `[data-bind="total-time"]` | `recipe.metafields.custom.total_time` |
| `[data-bind="servings"]` | `recipe.metafields.custom.yield` |
| `[data-bind="difficulty"]` | `recipe.metafields.custom.difficulty` ("Beginner" \| "Intermediate" \| "Advanced") |
| `[data-bind="cuisine"]` | `recipe.metafields.custom.cuisine` |
| `#ingredients-grid` children (`.ingredient-row`) | `recipe.metafields.custom.ingredients` JSON: `[{amount, name, desc?}, ...]` |
| `#method-list` children (`.method-step`) | `recipe.metafields.custom.method` JSON: `[{title, desc, emoji}, ...]` (step number is auto-incremented) |
| `#video-thumb` + `[data-bind="video-title"]` | `recipe.metafields.custom.video_youtube_id` + `video_title` |
| `#notes-list` children | `recipe.metafields.custom.notes` (rich text or list) |
| Kit CTA fields (`[data-bind="kit-emoji"]`, `kit-name`, `kit-price`, `kit-link`) | Linked product reference: name, image/emoji, price, URL |
| `#related-recipe-grid` cards | `recipe.metafields.custom.related[2]` references |

**Recommendation:** because the structured fields (ingredients, method) are repeating items, use a **section schema with blocks**:
- `block: hero` (image, category, dietary tags)
- `block: meta` (single block, all 6 meta fields)
- `block: ingredient` (×N — amount, name, desc)
- `block: method_step` (×N — emoji, title, desc; step number auto from block index)
- `block: video` (youtube_id, title)
- `block: note` (×N — single line)
- `block: kit_cta` (product reference)
- `block: related_recipes` (list of references)

Editor adds blocks in the order they appear on the page. Theme renderer groups blocks by type into the correct sections.

---

## Typography rules used

- **H1** — Montserrat 800, 44px, `letter-spacing: -0.02em`, line-height 1.1.
- **Section H2** — Montserrat 800, 32px, `letter-spacing: -0.015em`.
- **Step title** — Montserrat 800, 19px.
- **Step body** — DM Sans 15px, line-height 1.6.
- **Step number badge** — Montserrat 800, 16px, on a 36px circle in `--ink`.
- **Amount pill** — Montserrat 800, 14px, `--kit-color-dark` text on `--kit-color-soft` bg.
- **Meta value** — Montserrat 700, 13px.
- **Meta label** — DM Mono 9px uppercase, 0.1em tracking.
- **Dietary tag** — DM Mono 10px uppercase, 0.1em tracking.
- **Jump-nav link** — 13px, weight 600, pill shape.

The amount pills (e.g. "20g", "1 tsp") are the visual hook of the ingredient list. Don't lose them.

---

## Layout / breakpoints

- Recipe hero container max-width: **1100px**, 2-column grid (1fr 1fr), gap 56px.
- Meta strip: **6-column** grid on desktop. Drops to **3 columns** below 768px.
- Method steps: **2-column** (280px image + 1fr body) on desktop. Image stacks on top of body below 768px (16:9 aspect ratio there).
- Ingredients: **2-column** on desktop, **1-column** below 768px.
- Jump-nav becomes horizontally scrollable below 768px (`overflow-x: auto`, `flex-wrap: nowrap`).
- Recipe section padding: 64px top/bottom.
- Recipe sections alternate cream/white: `.recipe-section:nth-child(odd) { background: var(--cream); }`.

---

## JS to preserve

One behaviour, in the inline `<script>` at the bottom:

**`loadVideo()`** — replaces the gradient `#video-thumb` div with a YouTube `<iframe>` that auto-plays. The video ID is hardcoded as `dQw4w9WgXcQ` in the preview — replace with the actual `recipe.metafields.custom.video_youtube_id` when porting.

In Shopify Liquid:
```liquid
<div class="video-thumb" id="video-thumb"
     onclick="loadVideo('{{ recipe.metafields.custom.video_youtube_id }}')">
  <span class="video-play">▶</span>
  <div class="video-title-overlay">{{ recipe.metafields.custom.video_title }}</div>
</div>

<script>
  function loadVideo(videoId) {
    document.getElementById('video-thumb').outerHTML =
      '<iframe width="100%" style="aspect-ratio: 16/9; border: 0;" ' +
      'src="https://www.youtube.com/embed/' + videoId + '?autoplay=1" ' +
      'allow="autoplay; encrypted-media" allowfullscreen></iframe>';
  }
</script>
```

Smooth-scroll for the jump-nav can be added with a one-liner (`html { scroll-behavior: smooth; }`) — currently it uses default browser jump-to-anchor behaviour which is fine.

---

## Things to NOT do when porting

- **Don't** swap the YouTube facade for a real `<iframe>` on initial render. The lazy-load is deliberate — Shopify pages already have a lot of weight, and an unloaded YouTube saves ~500KB on first paint.
- **Don't** drop the meta-strip icons. Cooking-recipe muscle memory expects icons next to "prep / cook / yield / difficulty" — losing them makes the page feel like a generic CMS article.
- **Don't** make the method-step images full-bleed photos. They're square, with a coloured `--kit-color-soft` background and a single emoji or simple illustration — that's the brand visual language and it scales for SKUs that don't yet have process photography.
- **Don't** convert the ingredients list into a `<table>`. The CSS grid approach lets the amount pill keep its rounded-rectangle shape and the descriptor stay subordinate.
- **Don't** widen the recipe section container past 1000px. The current width keeps line lengths comfortable for instructions.
- **Don't** add a print stylesheet that rearranges the structure — the existing layout already prints reasonably (TOC, dietary tags, then ingredients, then method).
