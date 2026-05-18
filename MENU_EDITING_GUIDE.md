# How to edit the navigation menu via code

The header lives in `sections/gb-header.liquid`. All 4 top-level nav items (Shop, Learn, Recipes, About) and their dropdowns are **hardcoded Liquid** — no Shopify Navigation backend involved. Edit the file, push, done.

The same section also defines the **mobile drawer** (the slide-out menu for phones), which has its own copy of every link. **You always edit both** — desktop mega-menu and mobile drawer — to keep parity.

## File map inside `sections/gb-header.liquid`

```
Lines 21–42       Desktop primary nav buttons (Shop / Learn / Recipes / About)
Lines 52–110      Shop mega-menu (data-menu="shop")
Lines 110–170     Learn mega-menu (data-menu="learn")
Lines 170–219     Recipes mega-menu (data-menu="recipes")
Lines 219–253     About mega-menu (data-menu="about")
Lines 290–360     Mobile drawer — sections inside <details> blocks
```

(Line numbers approximate — search for the `data-menu="..."` attribute or the `<summary class="md-section-h">XXX` lines to find the right block.)

## Common edits

### Add a new link to an existing dropdown

**Desktop** — find the column inside the right `mm-col`:

```liquid
<div class="mm-col">
  <h4>OUR STORY</h4>
  <ul>
    <li><a href="/pages/why-we-built-gutbasket">Why we built GutBasket</a></li>
    <!-- Add your new <li> here -->
    <li><a href="/pages/your-new-page">Your new link</a></li>
  </ul>
</div>
```

**Mobile** — find the matching `<details>` in the drawer and add the same `<li>` to its `md-list`. If the parent has `md-sublist` and `md-cat-h` headers, drop your new item under the matching category header.

```liquid
<li class="md-cat-h">Our Story</li>
<li><a href="/pages/why-we-built-gutbasket" data-md-close>Why we built GutBasket</a></li>
<!-- Add your new <li> here -->
<li><a href="/pages/your-new-page" data-md-close>Your new link</a></li>
```

The `data-md-close` attribute on mobile links is what auto-closes the drawer when a user taps a link. Always include it.

### Remove a link

Delete the `<li>` from both the desktop and mobile drawer instances of that section. That's it.

### Rename an existing link

Edit the link text in the `<a>...</a>` content. URL can stay the same.

```liquid
<li><a href="/pages/help-center">Help &amp; FAQs</a></li>   <!-- was "Help center" -->
```

### Change a link's destination URL

Edit the `href`:

```liquid
<li><a href="/pages/new-handle">Help center</a></li>
```

Use one of these URL patterns:
- `/pages/{page-handle}` — Shopify pages (set in admin → Pages)
- `/products/{product-handle}` — products
- `/collections/{collection-handle}` — collections
- `/blogs/{blog-handle}` — blog index
- `/blogs/{blog-handle}/{article-handle}` — blog article
- `/policies/refund-policy`, `/policies/shipping-policy`, `/policies/privacy-policy`, `/policies/terms-of-service` — Shopify auto-generated policy pages
- `/account/login`, `/account/register`, `/cart`, `/search` — built-in routes
- `https://...` — external URLs (Instagram, WhatsApp, etc.)

### Add a new top-level dropdown (e.g. "Wholesale")

Three places to edit:

**1. Add the trigger button** (~line 21):

```liquid
<div class="nav-item">
  <button class="nav-trigger" data-trigger="wholesale" aria-expanded="false" aria-haspopup="true">Wholesale
    <svg class="chev" viewBox="0 0 16 16" width="14" height="14"><path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </button>
</div>
```

**2. Add the mega-menu block** (after the About one, before the closing `</header>`):

```liquid
<div class="mega-menu" data-menu="wholesale">
  <div class="mm-inner">
    <div class="mm-grid-3">
      <div class="mm-col">
        <h4>FOR RETAILERS</h4>
        <ul>
          <li><a href="/pages/wholesale">Wholesale program</a></li>
          <li><a href="/pages/wholesale-pricing">Pricing</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>
```

The trigger's `data-trigger` and the menu's `data-menu` attributes **must match** — that's how the JS opens the right panel.

**3. Add a mobile drawer section**:

```liquid
<details class="md-section">
  <summary class="md-section-h">WHOLESALE <span class="md-chev">⌃</span></summary>
  <ul class="md-list">
    <li><a href="/pages/wholesale" data-md-close>Wholesale program</a></li>
    <li><a href="/pages/wholesale-pricing" data-md-close>Pricing</a></li>
  </ul>
</details>
```

### Remove a top-level dropdown

Delete the `<div class="nav-item">` block, the matching `<div class="mega-menu" data-menu="...">` block, AND the matching mobile `<details>` block. Three places.

## Checklist before pushing

- [ ] Edited both desktop mega-menu AND mobile drawer
- [ ] All `data-trigger` ↔ `data-menu` pairs match
- [ ] Mobile links have `data-md-close`
- [ ] URLs start with `/` (relative) or `https://` (external)
- [ ] HTML entities escaped (`&amp;` for `&`)
- [ ] Saved + committed + pushed

After push, the Shopify GitHub sync rebuilds the theme. Header changes are visible immediately on every page (header is included via `theme.liquid`'s `{% section 'gb-header' %}`).

## Why hardcoded instead of Shopify Navigation?

Pros:
- **One source of truth** — the file. No drift between the theme and admin Navigation menu.
- **Version controlled** — every change is a git commit with a diff.
- **Same data on desktop and mobile** — easier to keep in sync because they're in the same file.
- **No client requires admin access** to see what links exist.

Cons:
- Non-developers can't edit (they need to edit Liquid, not click in admin).
- Adding/removing links requires a deploy.
- For a 12-link About menu that doesn't change often, this trade-off is fine.

If at some point a non-dev wants to manage menus themselves, swap the hardcoded `<ul>` for `{% for link in linklists.about-menu.links %}` and re-enable Shopify Navigation. Tell me when that day comes.
