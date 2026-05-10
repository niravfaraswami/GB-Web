# About-menu pages — admin setup

12 page templates shipped, each pre-populated with content extracted from the corresponding `gutbasket-{handle}.html` reference. Section is `gb-content-page` (the existing flexible content section, with the **features** block now extended to 6 items + auto-fit grid).

## Step 1 — Create the 12 Shopify pages

For each row below: **Online Store → Pages → Add page**, set the title and handle exactly, then in **Theme template** pick the matching template, then **Save**.

| # | Group | Page title | Handle | Theme template |
|---|---|---|---|---|
| 1 | Our Story | Why we built GutBasket | `why-we-built-gutbasket` | `page.why-we-built` |
| 2 | Our Story | The science behind our kits | `the-science-behind-our-kits` | `page.science` |
| 3 | Our Story | Sourcing & quality standards | `sourcing-quality-standards` | `page.sourcing` |
| 4 | Our Story | FSSAI & certifications | `fssai-certifications` | `page.certifications` |
| 5 | Support | Help center | `help-center` | `page.help-center` |
| 6 | Support | WhatsApp expert support | `whatsapp-expert-support` | `page.whatsapp-support` |
| 7 | Support | Returns & refunds | `returns-refunds` | `page.returns-refunds` |
| 8 | Support | Shipping policy | `shipping-policy` | `page.shipping-policy` |
| 9 | Community | Ferment Forum | `ferment-forum` | `page.ferment-forum` |
| 10 | Community | Customer recipes | `customer-recipes` | `page.customer-recipes` |
| 11 | Community | Instagram | `instagram` | `page.instagram` |
| 12 | Community | Newsletter | `newsletter` | `page.newsletter` |

The page **content** field in admin can stay empty — the template renders entirely from its JSON-defined blocks. (The page field is the fallback for the `gb-cp-empty` state, which only fires if no blocks exist.)

## Step 2 — Wire the About menu

1. **Online Store → Navigation → Add menu** → name: "About" (or edit your existing main menu).
2. Add a top-level **About** parent (you can leave its URL as `/` or point at one of the pages).
3. Drag in 12 sub-items in this order, each pointing to the page handle from Step 1:

```
About
├── OUR STORY              (parent label, no URL or =#)
│   ├── Why we built GutBasket            → /pages/why-we-built-gutbasket
│   ├── The science behind our kits       → /pages/the-science-behind-our-kits
│   ├── Sourcing & quality standards      → /pages/sourcing-quality-standards
│   └── FSSAI & certifications            → /pages/fssai-certifications
├── SUPPORT
│   ├── Help center                       → /pages/help-center
│   ├── WhatsApp expert support           → /pages/whatsapp-expert-support
│   ├── Returns & refunds                 → /pages/returns-refunds
│   └── Shipping policy                   → /pages/shipping-policy
└── COMMUNITY
    ├── Ferment Forum                     → /pages/ferment-forum
    ├── Customer recipes                  → /pages/customer-recipes
    ├── Instagram                         → /pages/instagram
    └── Newsletter                        → /pages/newsletter
```

Shopify menus support **2 levels of nesting** out of the box (parent + sublinks). For a 3-level structure (About → Group → Page), you typically use:

- **Mega-menu app** (Shopify Plus or third-party app like Buddha Mega Menu / Mega Menu Hero) — supports multi-level grouping with section headers.
- **Or flatten** to 2 levels: drop the group headers (Our Story / Support / Community) and just list the 12 sub-items under About.
- **Or use the `gb-header-new` section** I shipped in Phase 4 — its dropdown component renders 2 levels natively. The 3-group structure can be approximated by making **Our Story / Support / Community** parent links (each with its own page) that have 4 children each, but you'd lose the single "About" entry point.

## Step 3 — Pick the menu in the header

Once the menu exists in admin: **Customize → Header section → Primary menu** → pick "About" (or whatever you named it).

If you haven't activated the new `gb-header-new` section yet, the live theme's existing header reads from its own configured menu — see Phase 4 review for activation.

## What's in each template

Every template uses these block types from `gb-content-page`:

- **Hero** at top with eyebrow + H1 + subtitle (matches the page-hero from the source HTML)
- **Features grid** for repeating cards (3, 4, or 6 columns — auto-fit by default)
- **Text block** for prose sections with eyebrow + h2 + body
- **FAQ** for accordion Q/A (used in help-center, returns, shipping)
- **CTA card** at the end linking to the next logical page
- **Contact card** for WhatsApp/email links (used in whatsapp-support, certifications)
- **Quote** for testimonials (used in newsletter)

Customize any of these in **Customize → that page → block settings**. Defaults are populated; edit text, swap images, change colors per page.

## Out of scope for this PR

- The "Newsletter signup form" block on the Newsletter page links to `#signup` — wire a real Shopify customer-form to that anchor (or use the existing `gb-home-newsletter` section on the page) for the form to actually submit.
- Customer recipes and Instagram pages reference live content (recipe of the week, IG grid). For real-time content, integrate with the Ferment Forum backend or use an Instagram feed app.
- The `compliance@gutbasket.com` email is a placeholder — update if your contact differs.
