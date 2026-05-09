# GutBasket — Digital Guide Template (Template 11)

**Source:** `gutbasket-guide.html`
**Maps to in Shopify:** A custom page type with a multi-section interactive UI. Two viable modellings:
- **Guide-as-page** (recommended): `templates/page.guide.json` with a section schema that has repeatable `section_pane` blocks. One Shopify page = one full guide.
- **Guide-as-product** (only if guides are sold as digital products): `templates/product.guide.json` with the section schema reading from `product.metafields.custom.sections`.

This is the **Learn → Guides** content type. Multi-section interactive learning experiences (e.g. "Your First 30 Days of Fermenting", "The Complete Sauerkraut Course"). Functions like a single-page micro-course.

---

## What this template is for

Long-form structured learning content. Several sections (typically 4–8), revealed one at a time. Persistent sidebar nav showing progress, sticky progress bar at top, video per section, key-takeaways callout, action card, prev/next nav, and a completion screen with a final kit CTA.

This is **not** a blog post split into tabs — it's designed to be worked through linearly, like a course. The reader spends 20–60 minutes on it.

The current preview demonstrates a "Your First 30 Days of Fermenting" guide with 6 sections.

---

## File layout

Same three zones:

1. **Theme shell** — promo bar, header, footer. *Skip when porting.*
2. **Template body** — everything inside `<main>`. This is the guide template.
3. **Inline `<script>`** — section navigation logic + video lazy-load. **Critical to preserve** — the entire UX depends on it.

---

## Sections inside `<main>` (in order)

| # | Section | CSS root class | Required content |
|---|---|---|---|
| 1 | Cover | `.guide-cover` | Category pill, H1 (~52px), subtitle, meta bar with 4 items: Duration, Level, Sections count, Format |
| 2 | Progress bar (sticky) | `.progress-bar-wrap` | Sticks below header at `top: 76px`. Track + fill (kit-color), label "SECTION X OF N". Updates as user navigates. |
| 3 | Body | `.guide-body` | 2-column grid: sticky sidebar nav (280px) + content area (1fr) |
| 3a | Sidebar nav | `.guide-sidebar` > `.section-list` | Numbered circle + section title per item. Active = filled kit-color circle. Completed = green check circle. |
| 3b | Content panes | `.guide-content` > `.section-pane` (×N + 1 completion pane) | Only one pane visible at a time (`.section-pane.active`). Pane structure: header (progress + title + duration), video block, intro paragraph, lesson body, key takeaways, action card, prev/next nav. |
| 4 | Completion screen | `.section-pane[data-section-idx="complete"]` | Hidden until last pane is completed. Shows celebration + final kit CTA card (`.guide-cta`). |

### Inside each `.section-pane`

```
.pane-header        — small "SECTION X OF N", H2 title (36px), duration with ⏱ icon
.pane-video         — lazy-loaded YouTube (gradient thumb until clicked)
.pane-intro         — italic 17px paragraph
.pane-lesson        — body prose (16px paragraphs)
.takeaways-block    — kit-color left-bordered card with "KEY TAKEAWAYS" header and ✓ list
.action-card        — dark card with kit-color circular icon + "YOUR NEXT ACTION" eyebrow + text
.pane-nav           — prev/next button row (next is filled kit-color)
```

---

## Color theming

Same three-variable system, but the source is the **guide's category** (same three categories as blog: Fermentation 101, Gut Health Science, Troubleshooting):

| Category | `--kit-color` | `--kit-color-dark` | `--kit-color-soft` |
|---|---|---|---|
| Fermentation 101 | `#FF7300` | `#E66800` | `#FFE4D1` |
| Gut Health Science | `#15BA97` | `#0F9279` | `#D5F2EA` |
| Troubleshooting | `#C24528` | `#9A361F` | `#F5D9D0` |

The cover hero uses a `linear-gradient(135deg, var(--kit-color-soft) 0%, var(--white) 100%)` background — keep this. It's the only template that uses a kit-color gradient on the hero.

---

## Data model — what to wire from Shopify

The data model is heavier than blog/recipe because of the per-section structure.

| HTML hook | Shopify source |
|---|---|
| `[data-bind="category"]` | `page.metafields.custom.category_label` |
| `<h1 data-bind="guide-title">` | `page.title` |
| `[data-bind="guide-subtitle"]` | `page.metafields.custom.subtitle` |
| `[data-bind="duration"]` | `page.metafields.custom.duration` ("~3 hours · spread over 30 days") |
| `[data-bind="level"]` | `page.metafields.custom.level` ("Absolute Beginner") |
| `[data-bind="sections-count"]` | Count of section_pane blocks (auto, or `metafields.custom.sections.length`) |
| `#section-list` items | One `<li>` per section block (rendered from blocks loop) |
| `.section-pane` content | One block per section. Each block has fields: title, duration, video_youtube_id, video_title, intro, lesson (rich text), takeaways (list), action_text |
| `.guide-cta` content | Final kit CTA: product reference, override eyebrow/title/desc/price/link |

### Recommended schema

```json
{
  "name": "Digital Guide",
  "blocks": [
    {
      "type": "cover",
      "name": "Cover",
      "limit": 1,
      "settings": [/* category, subtitle, duration, level */]
    },
    {
      "type": "section",
      "name": "Section",
      "settings": [
        { "type": "text",      "id": "title" },
        { "type": "text",      "id": "duration" },
        { "type": "text",      "id": "video_youtube_id" },
        { "type": "text",      "id": "video_title" },
        { "type": "richtext",  "id": "intro" },
        { "type": "richtext",  "id": "lesson" },
        { "type": "list",      "id": "takeaways" },
        { "type": "richtext",  "id": "action_text" }
      ]
    },
    {
      "type": "completion_cta",
      "name": "Completion CTA",
      "limit": 1,
      "settings": [/* product reference + override copy */]
    }
  ]
}
```

The Liquid template loops blocks of type `section` and emits one `.section-pane` plus one sidebar `<li>` per block. Section index is `forloop.index0`.

---

## Typography rules used

- **Cover H1** — Montserrat 800, **52px**, `letter-spacing: -0.025em`, line-height 1.05. Largest H1 in the system.
- **Pane H2 (`.pane-title`)** — Montserrat 800, 36px, `letter-spacing: -0.02em`, line-height 1.1.
- **Pane intro** — DM Sans **italic** 17px, line-height 1.6.
- **Lesson body** — DM Sans 16px, line-height 1.7.
- **Sidebar link** — DM Sans 13px, line-height 1.35.
- **Section list number** — Montserrat 700, 11px, in a 24px circle.
- **Eyebrows** — DM Mono 10–11px uppercase, 0.1–0.14em tracking.
- **Pane duration** — DM Sans 13px with `⏱` glyph prefix (`::before { content: '⏱' }`).
- **Progress label** — DM Mono 11px, 0.06em tracking.

The cover hero is the visually loudest moment in the entire template library (largest H1, gradient background) — it's earned because guides are a flagship content type.

---

## Layout / breakpoints

- Cover container max-width: **1100px**.
- Body container max-width: **1180px**, 2-column grid `280px 1fr`, gap 56px, `align-items: start`.
- Sidebar `position: sticky; top: 140px;` (header is 76px + progress bar is ~50px).
- Content max-width: **760px** inside the 1fr cell (same reading-column width as blog).
- Below 768px: grid collapses to single column; sidebar becomes static (no longer sticky); pane H1 scales to 32px, pane H2 to 26px; action card stacks vertically.

---

## JS to preserve — this is the entire UX

The inline `<script>` does three things. **All three are essential.**

### 1. Section navigation

```js
let currentSection = 0;
function showSection(idx) {
  // Hide all panes, show the targeted one (or completion screen if idx >= totalSections)
  // Update sidebar: previous = .completed (green check), current = .active (filled circle)
  // Update progress bar fill width and "SECTION X OF N" label
  // Scroll to top smoothly
}
function navSection(delta) { /* called by Prev/Next buttons */ }
```

The completion pane (`data-section-idx="complete"`) is special — it appears when the user clicks Next on the last regular section.

### 2. Sidebar click handlers

Clicking a sidebar `.section-list-link` jumps directly to that section.

### 3. Video lazy-load

```js
function loadGuideVideo(videoId, thumb) {
  thumb.outerHTML = '<iframe ... src="https://www.youtube.com/embed/' + videoId + '?autoplay=1" .../>';
}
```

Each pane has its own `loadGuideVideo('xxx', this)` call — replace `'xxx'` with the per-section YouTube ID.

### Persistence (optional, recommended for production)

The current preview does **not** persist progress. For a real Shopify guide, add `localStorage` so a returning visitor lands on the section they were on:

```js
function showSection(idx) {
  // ... existing logic ...
  localStorage.setItem('guide:' + GUIDE_HANDLE + ':section', idx);
}
const saved = parseInt(localStorage.getItem('guide:' + GUIDE_HANDLE + ':section'));
if (!isNaN(saved)) { currentSection = saved; }
showSection(currentSection);
```

Use `{{ page.handle }}` as `GUIDE_HANDLE`.

---

## Accessibility considerations to add when porting

The current preview uses `<a>` elements with no `href` for sidebar links and `<button>` for prev/next, but the section-pane visibility is purely a CSS/JS concern — there's no URL fragment that reflects state. For production:

- Add `aria-current="step"` to the active sidebar link.
- Add `aria-label` to prev/next buttons describing the destination.
- Add `aria-disabled="true"` (in addition to `disabled`) on the prev button at section 0.
- Optionally add hash-based deep links (`#section-3`) so a user can share their place in the guide.

---

## Things to NOT do when porting

- **Don't** convert the section panes into a vertically-scrolling long page. The "one pane at a time" UX is what differentiates guides from blog posts. If everything's on one page, it's a blog post.
- **Don't** drop the progress bar or sidebar. The completion psychology of seeing progress is the whole reason a 30-minute guide gets finished instead of bounced.
- **Don't** show all videos preloaded. One iframe is heavy. Six on a page = a heavy page. Keep the gradient-thumb facade.
- **Don't** style the action card as a generic alert. The `--kit-color` circle icon + dark `--all-in-one` background + `--cream` text is the **commitment moment** of each section — it tells the reader to stop reading and go do the thing. Keep its weight.
- **Don't** centre-align the cover H1 or use a stock-photo background. The current left-aligned, generous-line-height setup with the soft kit-color gradient is the design.
- **Don't** lose the `.complete-screen` celebration. It's small but it's the payoff for finishing.
- **Don't** widen `.guide-content` past 760px. Same reading-column rule as the blog.
