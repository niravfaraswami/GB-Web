# GutBasket Recipe Hub (T10 Collection) — Implementation Notes

Handoff for the recipe blog collection page. The HTML is a **layout reference**, not production code — it stubs sample recipes inline, uses no framework, and ships filter logic as a single `<script>` tag. This doc tells Claude Code what to keep, what to swap for real data, and how to wire it into the existing GutBasket Shopify theme.

---

## 1. Files in this handoff

| File | Purpose |
|---|---|
| `gutbasket-recipes.html` | Full layout reference, self-contained. Open in a browser to see it work. |
| `gutbasketbrandguidev1_2_2.pdf` | Authoritative brand guide — tokens, governance, T10 recipe template spec. |
| `Product_template_mapping.xlsx` | Source of truth for kit accent colors used in card gradients. |
| `recipe_blog_collection_blog_page_desktop.pdf` / `_mobile.pdf` | Original reference mockups (used red CTAs — corrected to brand orange in the layout). |

---

## 2. Stack assumptions

- Shopify Online Store 2.0 theme using Liquid + sections/blocks.
- Header, promo bar, footer, and value strip already exist as global sections — **do not rebuild them** from this HTML. Lift only the page-specific bits (hero, filter bar, grid, break card).
- Recipes are likely modelled as either Shopify `article` posts in a "Recipes" blog, or a `metaobject` of type `recipe`. Either works; data shape below covers both.
- Filter taxonomy lives as Shopify article tags or as a separate `recipe_category` metaobject.

---

## 3. Design tokens

Lift these into `config/settings_schema.json` or `theme.liquid` `<style>`. They're already defined at `:root` in the reference HTML:

```css
/* Surfaces — locked at 3 (per brand guide section 3) */
--white: #FFFFFF;
--cream: #FFF9EE;
--ink:   #1F1F1D;
--all-in-one: #2B2218;   /* footer / dark break card */

/* Identity */
--text:        #1F1F1D;
--text-muted:  #5C4D3F;
--text-soft:   #8B8275;
--border:      #E8E3D5;
--border-soft: #F0EBDD;
--cream-deeper:#F5EDD8;

/* Action — CTAs ONLY (per brand guide §4 "3 LAYERS") */
--action:      #FF7300;
--action-dark: #E66800;
--action-soft: #FFE4D1;

/* Recipe category accents — pulled from Product_template_mapping.xlsx */
--cat-pickle: #FF7300;   /* achaar */
--cat-drink:  #8B1F40;   /* kanji */
--cat-kimchi: #E85C41;
--cat-veg:    #4F7C57;
--cat-dairy:  #C8B6E8;
--cat-bread:  #C9A02E;
--cat-summer: #DDA738;   /* aam panna */
```

**Typography stack** (already locked, do not deviate):

- Headings → `Montserrat` 700–800
- Body / UI → `DM Sans` 400–700
- Eyebrows / labels / ALL CAPS → `DM Mono` 500

The reference loads these from Google Fonts. For production, self-host via `asset_url` and add `font-display: swap`.

---

## 4. Page anatomy

Walking top to bottom, what's already global vs. what's new for this page:

| Section | Status | Notes |
|---|---|---|
| Promo marquee | **Global** | Skip — already in theme. |
| Header w/ mega-nav | **Global** | Just set `Recipes` nav link to `.active` on this template. |
| Hero block (`.hub-hero`) | **NEW** | Section: `recipes-hero`. Settings: title, subtitle, eyebrow, 3 stat strings. |
| Filter bar (`.filter-bar`) | **NEW** | Sticky. Section/block: `recipes-filter`. Top offset = header height. |
| Recipe grid (`.recipe-grid`) | **NEW** | Section: `recipes-grid`. Loops over recipes for the active page. |
| Editorial break card (`.break-card`) | **NEW** | Block inside grid section, injected after Nth card. |
| Pagination | **NEW** | Use Shopify's `{% paginate %}` tag. |
| Value strip | **Global** | Skip. |
| Footer | **Global** | Skip. |

---

## 5. Recipe data model

Two separate things both look like "tags" on a recipe — keep them distinct in the model:

| Concept | What it is | Where it shows | Example |
|---|---|---|---|
| **Category** | Primary taxonomy. Drives the filter tabs and (optionally) the card accent color. Closed set, curated. | Filter bar tabs. Eyebrow label on card visual. | `Drinks`, `Achaar`, `Kimchi`, `Fermented Vegetable` |
| **Chip tag** | Free-form descriptors. Display only — not used for filtering in this layout. Open set, recipe-author-driven. | Pill chips at the bottom of each card body. | `Raw Mango`, `Quick`, `No Sugar` |

If you collapse these into a single Shopify tag list, you'll have to namespace them (`cat:drinks` vs. plain `raw-mango`) which is fragile. Recommend keeping a metaobject for categories and using the article's native `tags` for chips.

### 5.1 Recipe (article or `metaobject:recipe`)

```yaml
# required
title:            string                # "Probiotic Aam Panna (No Added Sugar)"
handle:           string                # url slug
excerpt:          string                # ~150 chars, used as card body description
categories:       array<reference>      # multi-ref → recipe_category metaobject. Drives tabs.
difficulty:       enum                  # easy | medium | advanced
ferment_time:     string                # "5–7 DAYS" (display string, not parsed)
prep_minutes:     integer               # 12 → renders as "12 MIN PREP"
eyebrow_label:    string                # "DRINKS · KANJI" — text above title in card visual
display_title:    string                # "Probiotic\nAam Panna" — short, for the hero overlay (\n = line break)

# accent — falls back to category default if blank
accent_color_1:   color                 # hex, top-left of gradient
accent_color_2:   color                 # hex, bottom-right; auto-darken color_1 ~25% if blank

# optional
tags:             array<string>         # 2–3 chip pills ("Raw Mango", "No Sugar"). Display only.
hero_image:       image                 # if present, render <img> inside .card-visual
featured:         boolean               # true → spans 2 cols on desktop, larger type
```

### 5.2 Category taxonomy (`metaobject:recipe_category`)

This is the source of truth for filter tabs.

```yaml
name:           string         # "Drinks"        — tab label
handle:         string         # "drinks"        — URL segment + Liquid lookup key
order:          integer        # 10              — tab display order (lowest first)
default_accent: color          # #8B1F40         — fallback gradient color for cards in this category
description:    rich-text      # optional        — for SEO meta on filtered URLs
visible:        boolean        # true            — false hides from tabs (soft-launch / archive)
```

Categories already wired into the layout: `drinks`, `achaar`, `kimchi`, `vegetable`, `dairy`, `bread`. Add or rename via the metaobject — no theme code changes needed.

The `summer` flag on the Aam Panna sample is a chip tag, not a category — drop it or keep as a free-form tag depending on whether you want a future "Summer" tab.

---

## 6. Filter tabs — full spec

The single most-asked question about this page: **where do the tab labels come from?** Answer: the `recipe_category` metaobject defined in §5.2. Tabs are not hardcoded, not pulled from existing article tags, not generated from recipe authoring. They're a curated taxonomy that merch/content owns.

### 6.1 Sourcing options compared

Three ways you could source tabs. Pick one and commit:

| Approach | How | When to use | Verdict |
|---|---|---|---|
| **Metaobject taxonomy** (recommended) | `recipe_category` metaobject, looped in Liquid by `order`. | When merch wants to control tab labels, order, and counts without code. | ✅ Use this. |
| Section settings | Hardcoded list in `recipes-filter.liquid` section schema as a repeatable text input. | Tiny static catalog, no plans to grow. | Brittle — every tab change is a theme edit. |
| Auto-derived from article tags | Aggregate distinct tags across all recipes, render top N as tabs. | Never, for this page. | Editorially uncontrolled. A new recipe with a new tag would silently spawn a tab. |

### 6.2 How a recipe gets into a tab

Each recipe has a `categories` field — a **multi-reference** to `recipe_category` entries. A recipe can belong to one or more categories.

- Aam Panna might be `[drinks]` → appears under `Drinks` tab only.
- A "Summer Lemon Kanji" might be `[drinks, summer]` → appears under both if both tabs exist.
- "All Recipes" is the implicit default tab and is **not** a category — it shows everything regardless.

When a recipe has multiple categories, it appears in each filtered view. There's no de-duplication needed; the same recipe just shows up in multiple tab results. This is intended.

### 6.3 Tab rendering (Liquid)

```liquid
{% comment %} Resolves the active tab from the URL. {% endcomment %}
{% assign current = current_tags | first | downcase %}

<nav class="filter-tabs" role="tablist" aria-label="Recipe categories">

  {% comment %} "All Recipes" — implicit, always first {% endcomment %}
  <a href="{{ blog.url }}"
     class="tab {% unless current %}active{% endunless %}"
     role="tab"
     aria-selected="{% unless current %}true{% else %}false{% endunless %}"
     data-filter="all">
    All Recipes <span class="num">{{ blog.articles_count }}</span>
  </a>

  {% comment %} Categories from the taxonomy, ordered {% endcomment %}
  {% assign cats = shop.metaobjects.recipe_category.values | where: 'visible', true | sort: 'order' %}
  {% for cat in cats %}
    {% assign cat_count = blog.articles | where: 'tags', cat.handle | size %}
    {% if cat_count > 0 %}
      <a href="{{ blog.url }}/tagged/{{ cat.handle }}"
         class="tab {% if current == cat.handle %}active{% endif %}"
         role="tab"
         aria-selected="{% if current == cat.handle %}true{% else %}false{% endif %}"
         data-filter="{{ cat.handle }}">
        {{ cat.name }} <span class="num">{{ cat_count }}</span>
      </a>
    {% endif %}
  {% endfor %}

</nav>
```

Key choices baked in:
- "All Recipes" comes from `blog.articles_count` (always accurate, no extra computation).
- Categories with zero recipes are auto-hidden (`{% if cat_count > 0 %}`). Drop this guard if merch wants placeholders shown.
- `visible: false` categories are filtered out (soft-launch / seasonal archive).
- Sort by `order` field, not alphabetical.

### 6.4 URL routing

Standard Shopify blog tag URLs:

```
/blogs/recipes                  → all
/blogs/recipes/tagged/drinks    → category = drinks
/blogs/recipes/tagged/kimchi    → category = kimchi
```

Shopify only supports **single-tag** URLs out of the box (you can't do `?tags=drinks,summer`). If multi-select tabs become a requirement later, you'll need a custom search route or App Proxy.

Sort and pagination params layer on top:

```
/blogs/recipes/tagged/drinks?sort_by=newest&page=2
```

Sort selection should **persist** across tab changes. Easiest pattern: append the current sort param to every tab `href` in Liquid:

```liquid
{% assign sort_qs = '' %}
{% if request.path contains 'sort_by' %}{% assign sort_qs = '?sort_by=' | append: params.sort_by %}{% endif %}
<a href="{{ blog.url }}/tagged/{{ cat.handle }}{{ sort_qs }}">…</a>
```

### 6.5 Active state — server vs. client

The reference HTML uses **client-side** filtering via `data-filter` and a JS `setActive()` function that toggles `display:none` on cards. Fine for a layout demo; **replace it with server-rendered state** in production:

- Server renders the page with the right `.active` class already on the matching tab and only the matching cards in the grid.
- No flicker, SEO-friendly, browser back/forward works correctly.
- Optionally enhance with progressive client-side filtering for snappier UX, but always start from a correctly-rendered server response.

If you do add client enhancement, sync the URL with `history.pushState()` so deep-links and the back button still work.

### 6.6 Tab counts

Three places to source the count:

1. **Live Liquid count** (shown in §6.3): `blog.articles | where: 'tags', cat.handle | size`. Accurate, slightly more expensive on large catalogs.
2. **Cached metafield** on the category: `cat.metafields.app.recipe_count`. Update via webhook on article create/update/delete. Faster, but stale-prone.
3. **Hardcoded** in the metaobject. Don't.

Use option 1 unless the catalog grows past a few hundred recipes.

The grid header counter (`<strong id="visibleCount">12</strong> of <strong>49</strong> recipes`) maps to:

```liquid
{% assign first = paginate.current_offset | plus: 1 %}
{% assign last = paginate.current_offset | plus: paginate.page_size %}
{% if last > paginate.items %}{% assign last = paginate.items %}{% endif %}
<strong>{{ first }}–{{ last }}</strong> of <strong>{{ paginate.items }}</strong> recipes
```

### 6.7 Mobile behavior

The tab nav is a horizontal-scroll strip on mobile (`overflow-x: auto`, scrollbar hidden). Two extras to add when wiring up:

1. **Auto-scroll the active tab into view on page load** — otherwise the user can land on `/tagged/dairy` and not see which tab is active because it's offscreen right.

   ```js
   document.querySelector('.tab.active')?.scrollIntoView({
     behavior: 'instant', block: 'nearest', inline: 'center'
   });
   ```

2. **Edge fade indicators** (optional polish) — gradient masks at the left/right edge of `.filter-tabs` to hint there's more to scroll. Pure CSS via `mask-image: linear-gradient(...)`.

### 6.8 Edge cases — handle these explicitly

| Scenario | Behavior |
|---|---|
| User visits `/tagged/foobar` (unknown tag) | Shopify returns the blog with zero articles. Render the empty state from §9 with copy "No recipes tagged 'foobar'. Browse all 49 →". Don't 404. |
| Category metaobject has `visible: false` but URL hits its handle | Same as unknown tag — empty state. Don't expose the tab. |
| Recipe published with a category that has zero other recipes | Tab appears with count `1`. Fine. |
| Filtered view + "Build Your Kit" break card | **Hide** the break card on filtered views. The card is editorial, not catalog content; it only belongs on the unfiltered hub. |
| User clicks the active tab again | No-op (it's already an `<a>` to the current URL). Browser may refetch. Acceptable. |
| Pagination on filtered view | Shopify's `{% paginate %}` automatically scopes to the filtered set. No special handling. |
| Sort dropdown on filtered view | Carry the current tag through — see §6.4. |

---

## 7. Card component spec

Single `recipe-card.liquid` snippet, parameterised:

```liquid
{% comment %}
  Renders a recipe card.
  Params:
    recipe   — recipe object (article or metaobject)
    featured — bool, optional. true → spans 2 cols, larger.
{% endcomment %}

{% assign c1 = recipe.accent_color_1 | default: '#DDA738' %}
{% assign c2 = recipe.accent_color_2 | default: c1 %}

<article class="card{% if featured %} featured{% endif %}"
         data-cat="{{ recipe.categories | map: 'handle' | join: ' ' }}"
         data-tags="{{ recipe.tags | join: ',' | downcase }}">

  <a href="{{ recipe.url }}" class="card-visual"
     style="--card-c1:{{ c1 }};--card-c2:{{ c2 }};">

    {% if recipe.hero_image %}
      <img src="{{ recipe.hero_image | image_url: width: 800 }}"
           alt="{{ recipe.hero_image.alt | escape }}"
           loading="lazy" class="card-visual-img">
    {% endif %}

    <span class="card-visual-difficulty">
      <span class="dot"></span>
      <span class="dot {% unless recipe.difficulty == 'easy' %}{% endunless %}{% if recipe.difficulty == 'easy' %}dim{% endif %}"></span>
      <span class="dot {% if recipe.difficulty != 'advanced' %}dim{% endif %}"></span>
      {{ recipe.difficulty | upcase }}
    </span>
    <span class="card-visual-time">{{ recipe.ferment_time }}</span>

    <span class="card-visual-eyebrow">{{ recipe.eyebrow_label }}</span>
    <span class="card-visual-title">{{ recipe.display_title | newline_to_br }}</span>
  </a>

  <div class="card-body">
    <h3 class="card-h">{{ recipe.title | upcase }}</h3>
    <p class="card-desc">{{ recipe.excerpt }}</p>
    <div class="card-tags">
      {% for tag in recipe.tags limit: 3 %}
        <span class="tag-chip">{{ tag }}</span>
      {% endfor %}
    </div>
    <div class="card-foot">
      <a href="{{ recipe.url }}" class="card-cta">View recipe <span class="arrow">→</span></a>
      <span class="card-meta">{{ recipe.prep_minutes }} MIN PREP</span>
    </div>
  </div>
</article>
```

When a `hero_image` is present, add `.card-visual-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:-1; }` and darken via the existing `::after` overlay so the title stays legible. Title overlay sits above the image with no extra z-index needed.

---

## 8. Editorial break card placement

Per the brand guide ("Cross-collection CTA in Ink, breaks the rhythm intentionally"):

- Insert one break card after every **7th** standard card on desktop (lands at row 2, col 1–2 in a 4-col grid).
- **Hide it on filtered views** — when `{% if current_tags %}`. It only appears on the unfiltered "All Recipes" tab. The reference's JS handles this; in Liquid you'd guard with `{% unless current_tags %}{% render 'break-card' %}{% endunless %}` at the right loop index.
- Copy is page-specific. For the recipe hub it's `MAKE ANY OF THESE AT HOME IN 5 DAYS` → Build Your Kit. Make this a section setting so the page can override.

---

## 9. States to implement (the layout doesn't show these)

| State | Spec |
|---|---|
| **Empty filter result** | Replace grid with: `<div class="empty-state">No recipes in this category yet. <a href="{{ blog.url }}">Browse all 49 →</a></div>`. Same `.cream` bg, centered, DM Sans 16px, 96px vertical padding. |
| **Loading (if client-side)** | 12 skeleton cards: `.card.skeleton .card-visual { background: var(--cream-deeper); animation: pulse 1.4s infinite }`. Don't show on first server render. |
| **Pagination boundaries** | `Prev` disabled on page 1, `Next` disabled on last page. The `.page-btn:disabled { opacity:.4; cursor:not-allowed }` style is already in place. |
| **No image fallback** | If `recipe.hero_image` is blank, the kit-color gradient is the fallback (already wired). Recipes without `accent_color_1` fall back to category default. |

---

## 10. Sticky filter bar — gotcha

`.filter-bar` is `position: sticky; top: 70px;` — that `70px` matches the desktop header height including the promo bar. **Verify against the actual rendered header height in the live theme** and adjust. On mobile (`@media max-width: 820px`), the offset drops to `top: 56px`. If the promo bar is dismissable, the sticky offset needs to update on dismiss, otherwise you get a gap.

A safer pattern: use a CSS var `--header-h` set on `<html>` from a small JS observer, then `.filter-bar { top: var(--header-h); }`.

---

## 11. Accessibility

Already wired in the reference; verify these in production:

- Filter tabs use `role="tablist"` / `role="tab"` / `aria-selected`. The grid is the implicit tabpanel — add `role="tabpanel"` and `aria-labelledby` if you want strict ARIA.
- The whole card visual is now wrapped in `<a href>` (in the snippet above) so the click target is large. Keep the inner `View recipe →` as a redundant visible CTA but don't nest two `<a>`s — the inner one is `<span class="card-cta">` styled like a link, with the parent `<a>` providing the actual nav.
- Marquee promo bar: wrap the animation in `@media (prefers-reduced-motion: no-preference)` so it pauses for users who opt out.
- The orange `#FF7300` on white is **3.4:1** — passes WCAG AA for non-text UI (button, icon) but **fails** for body text. Never use `--action` for paragraph text. The card CTA is fine because it's `font-weight: 700` at 13px (large UI text threshold).

---

## 12. Performance

- Card gradients are inline CSS vars (`style="--card-c1:#X"`) — no per-recipe stylesheets, no extra requests.
- When you add hero images, ship them via `image_url: width: 800, format: 'webp'` and `loading="lazy"` for everything past the first 4 cards.
- The marquee animation runs forever. For battery, observe `IntersectionObserver` and pause when out of viewport.
- Google Fonts CDN is fine for staging. Self-host (or use `link rel="preload"`) for production to avoid the FOIT.

---

## 13. What's static / TODO for Claude Code

In priority order:

1. **Wire recipes to real data.** Replace the 14 inline `<article>` cards with a `{% for %}` loop over the recipes blog or metaobject collection.
2. **Build the `recipe_category` metaobject** (§5.2) and seed the 6 starter categories. Tab labels, order, and counts all flow from this — no theme edits needed once it exists.
3. **Server-render the active tab + filtered grid** per §6.3 + §6.5. Drop the client-side `setActive()` JS or keep it only as progressive enhancement.
4. **Pagination.** Replace the 5 static buttons with `{% paginate blog.articles by 12 %}` + render with the `.page-btn` styles already in place.
5. **Hero image support.** Add `<img>` inside `.card-visual` per §7.
6. **Sort dropdown.** Wire `<select class="sort-select">` to `?sort_by=newest|popular|prep_time_asc|title_asc`. Default is newest. **Persist sort param across tab clicks** — see §6.4.
7. **Mobile: auto-scroll active tab into view** on page load. Three lines of JS in §6.7.
8. **Mobile sort UI.** Currently hidden via `display:none`. Move into a "Filters" drawer or a small popover next to the count.
9. **Search.** Not in the layout. If needed, add a search input that submits to `/search?q=...&type=article` and visually integrates next to the count.
10. **Newsletter form.** `<form>` has no `action` — wire to your ESP (Klaviyo embedded form, Mailchimp, Shopify customer signup, whichever you use elsewhere on the site).
11. **Breadcrumb.** Last segment hardcoded "Recipes" — replace with `{{ blog.title }}` or page title. On filtered views, append the category: `Home / Learn / Recipes / Drinks`.
12. **Reduce-motion guard for the marquee.** One CSS rule, see §11.
13. **Empty-state copy** for unknown tags and zero-result categories per §6.8 + §9.

---

## 14. Brand guide governance — quick checklist before shipping

Per `gutbasketbrandguidev1_2_2.pdf`, run the page through these before merging:

- [ ] CTAs are brand orange `#FF7300` (the only place orange appears on this page).
- [ ] Wordmark is **never** orange — Ink in header, Cream in footer.
- [ ] Surfaces are limited to White, Cream, Ink, all-in-one. No other backgrounds.
- [ ] All headings are Montserrat 700–800. No other display fonts.
- [ ] All caps labels are DM Mono. Body is DM Sans. No serifs anywhere.
- [ ] One break card max per visible page, only on the unfiltered view.
- [ ] **5-second test:** can a stranger tell within 5 seconds (1) that this is GutBasket, (2) that it's a recipe collection, (3) what the primary action is? If yes, you're done.

---

## 15. Where to ask for help

- Brand questions → check `gutbasketbrandguidev1_2_2.pdf` first, especially pages 18 ("Template Architecture") and 21 ("Quick Reference").
- Existing component patterns → `gutbasket-unified__15_.html` has the canonical header, mega-menu, and footer markup; lift directly.
- Kit accent colors → `Product_template_mapping.xlsx` is the only source of truth; don't invent new ones.
