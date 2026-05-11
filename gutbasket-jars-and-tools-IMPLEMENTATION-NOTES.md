# Template 07 — Jars & Tools — Implementation Notes for Claude Code

These notes are for the engineer (or Claude Code) wiring `gutbasket-jars-and-tools.html` into the live Shopify storefront. The HTML is a faithful, self-contained layout reference — what follows is how to ship it as a real PDP template.

---

## 1. What this template is for

Template 07 is the **Track D** PDP — single-SKU jars, tools, and accessories. The current live `/collections/jars-and-tools` page has **17 products**, and every one of them should adopt this template on rollout. Each is its **own Shopify product**, not a variant of another.

### Live products that will use this template

Pulled from the live collection page. Suggested `category_label` is the chip shown under the product name on the PDP (`JAR` / `TOOL` / `TESTER` / `BOTTLE` / `PART`). Suggested accent is the `--kit-color` to seed in the product metafield — group by family so jars share a green, brewing testers share a teal, etc.

| # | Live product title                                          | MRP / Sale     | Suggested handle                       | Category | Suggested accent |
| - | ----------------------------------------------------------- | -------------- | -------------------------------------- | -------- | ---------------- |
| 1 | Fermentation Jar with Airlock — 4 Litre — Wide Mouth        | ₹1,290 / ₹1,999 | `fermentation-jar-airlock-4l`         | JAR      | `#4F7C57`        |
| 2 | Fermentation Jar with Airlock — 2 Litre — Wide Mouth        | ₹949 / ₹1,499  | `fermentation-jar-airlock-2l`          | JAR      | `#4F7C57`        |
| 3 | Fermentation Jar with Airlock — 1 Litre                     | ₹499 / ₹999    | `fermentation-jar-airlock-1l`          | JAR      | `#4F7C57`        |
| 4 | Kombucha Glass Jar 4 L                                      | ₹850           | `kombucha-glass-jar-4l`                | JAR      | `#A88554`        |
| 5 | Kombucha Jar 4 L — With Tap And Steel Stand  *(Sold Out)*   | ₹1,400         | `kombucha-jar-4l-tap-stand`            | JAR      | `#A88554`        |
| 6 | Fermentation Glass Carboy — Amber (4 Litre)                 | ₹1,890         | `fermentation-glass-carboy-amber-4l`   | CARBOY   | `#6E3A1F`        |
| 7 | HDPE Plastic Carboy (8 Litre)                               | ₹1,699         | `hdpe-plastic-carboy-8l`               | CARBOY   | `#5C4D3F`        |
| 8 | Airtight glass bottles 1 L                                  | ₹800           | `airtight-glass-bottles-1l`            | BOTTLE   | `#0097B2`        |
| 9 | Airlock for Safe Fermentation                               | ₹270 / ₹300    | `airlock-safe-fermentation`            | TOOL     | `#15BA97`        |
| 10 | Grommet / Washer for fermentation lid (Set of 3)           | ₹150 / ₹240    | `grommet-washer-fermentation-lid`      | PART     | `#1F1F1D`        |
| 11 | Fermentation Glass weight                                  | ₹600           | `fermentation-glass-weight`            | TOOL     | `#0097B2`        |
| 12 | Funnel                                                     | ₹100           | `fermentation-funnel`                  | TOOL     | `#E66800`        |
| 13 | Mesh Strainer                                              | ₹100           | `mesh-strainer`                        | TOOL     | `#E85C41`        |
| 14 | pH strip                                                   | ₹100           | `ph-strip`                             | TESTER   | `#DDA738`        |
| 15 | Triple Scale Hydrometer                                    | ₹990           | `triple-scale-hydrometer`              | TESTER   | `#8B1F40`        |
| 16 | Temperature Strip for brewing Kombucha or Beer             | ₹299           | `temperature-strip-kombucha-beer`      | TESTER   | `#15BA97`        |
| 17 | Pipette (Pack of 5)                                        | ₹200           | `pipette-pack-of-5`                    | TESTER   | `#5DBC52`        |

### Cluster these into 5 metafield "families"

The 17 products naturally split into 5 colour/category families so the accent system stays coherent across the catalogue:

- **JAR (green `#4F7C57`)** — 3 Fermentation Jars with Airlock (1 L / 2 L / 4 L). One shared visual identity.
- **JAR · brewing (amber `#A88554`)** — 2 Kombucha jars (plain glass, and with tap + steel stand).
- **CARBOY (deep brown `#6E3A1F` / muted `#5C4D3F`)** — Glass amber carboy, HDPE plastic carboy. Visually distinct from the green ferment jars.
- **TOOL (teal `#15BA97` / cyan `#0097B2`)** — Airlock, Glass Weight, Airtight Bottles. The "essential ferment accessory" group.
- **TESTER (mixed)** — pH strip, hydrometer, temp strip, pipette. These are measurement instruments; keep distinct accents per-product so a customer scanning a search-results page can tell them apart.

Within each family, the layout is identical — only the metafield values and accent change.

> **Naming note:** the live storefront uses "Fermentation Jar with Airlock"; the dev mockup in the original unified file calls the same product "Fermenter Jar — 2 L". When metafields are seeded, use the **live** Shopify product titles verbatim. The reference HTML data is just placeholder copy to keep the layout rendering.

> **Sold Out handling:** Product #5 (Kombucha Jar 4 L with Tap And Steel Stand) is currently sold out on the live page. The template's ATC button needs a `product.available == false` branch — see §8 (Pre-flight QA).

> **Future additions:** if Sprouting Mesh Lid and Sprouting Drainage Stand (referenced in the unified mockup and Sprouts Kit cross-sells) ship as standalone products later, they slot into the **TOOL** family using the same template with `kit_color: #3F7754` / `#A88554` respectively.

---

## 2. Layout sections (top → bottom)

| # | Section            | Purpose                                                                       | Bound fields                                                        |
| - | ------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1 | PDP Hero           | Gallery + product name + rating + single-price block + ATC + trust strip      | name, tagline, rating, bought-today, price, compare-price, save     |
| 2 | Why This Design    | 4-card feature grid on `.section-accent` (kit-color-soft background)          | features_h1, features_intro, features[4] (label + description)       |
| 3 | Specifications     | 6-row specs table + `.compatible-strip` callout                               | specs[6] (label + value), compatible_with                            |
| 4 | Four Uses          | 4-card grid showing alternate use cases                                       | use_cases[4] (label + description)                                   |
| 5 | Repeat Buyers      | 3 review cards, static (review copy authored, not pulled from Judge.me here)  | —                                                                    |
| 6 | Common Questions   | 8 FAQ items, click-to-expand                                                  | —                                                                    |
| 7 | Pair With          | 4-card cross-sell strip                                                       | —                                                                    |

No myth/fact section, no "build your kit" CTA, no story section — this template is deliberately leaner than Templates 01–06 (the kit templates) because the products are simpler.

---

## 3. Design system — non-negotiables

Pulled from `gutbasketbrandguidev1_2_2.pdf`. **Do not improvise on these.**

### Tokens
```css
--white:  #FFFFFF;
--cream:  #FFF9EE;   /* page bg */
--ink:    #1F1F1D;   /* near-black for headlines + chips */
--all-in-one: #2B2218; /* ATC button, footer */
--text:       #1F1F1D;
--text-muted: #5C4D3F;
--text-soft:  #888780;
--border:     #E8E3D5;
--border-soft:#F0EBDD;

/* Per-product accent — overridden in JS by setAccessory() */
--kit-color, --kit-color-dark, --kit-color-soft
```

### Type stack
- **Headlines:** Montserrat 800, uppercase, `letter-spacing: -0.02em`. Italic `<em>` inside `<h2>` is the accent-color highlight.
- **Body:** DM Sans 400–500.
- **Eyebrows / labels / chips:** DM Mono 600–700, `letter-spacing: 0.08–0.14em`, UPPERCASE.

### Rules
- Section padding: `80px 0` desktop, `56px 0` mobile.
- Card radius: `14px`. Strip radius: `12px`. Pill radius: `999px`.
- Alternating section backgrounds: white → cream → white → cream. `body > section:nth-of-type(2n+2) { background: var(--cream); }` already handles this.
- `.section-accent` forces `var(--kit-color-soft)` and is reserved for the "Why this design" block.

---

## 4. Variant switching — how `setAccessory(id)` works

The reference HTML simulates 6 placeholder accessories from one HTML file (the same one PDP layout, themed 6 ways) so a reviewer can preview the design across product types without spinning up Shopify. The real catalogue is 17 products (see §1) — the same mechanism scales to any number. In production this picker disappears entirely (§5).

The reference does three things on each `setAccessory(id)` call:

1. **Setting CSS variables** on `:root` for `--kit-color`, `--kit-color-dark`, `--kit-color-soft`. This cascades to every accent on the page.
2. **Text bindings** via `[data-bind="key"]`. The function reads from the `ACCESSORIES[id]` object and pushes `textContent` to every matching element. Keys in use: `name`, `product-name`, `tagline`, `rating-text`, `bought-today`, `discount`, `price`, `compare-price`, `save-text`, `features-h1`, `features-intro`, `compatible-with`.
3. **Re-renders three grids** by replacing innerHTML of `#feature-grid`, `#specs-table`, `#uses-grid` from the data arrays. Feature icons (⊕ ◇ △ ◎) and use-case emojis (🥬 🌱 🥒 ❄️) are hardcoded slot-by-slot in the function — they are **not** per-product. If a product needs different emojis, extend the data model.

**In production:** drop the entire `setAccessory` / picker apparatus. Replace it with a Liquid template that reads from the Shopify product object directly. Bindings map cleanly to product metafields (§6).

---

## 5. Picker → Related-Products strip (production change)

Remove from production HTML:
- `<button class="kit-picker-toggle">…</button>` + `<div class="kit-picker">…</div>` + all `.kit-picker-*` CSS.
- The `setAccessory`, `buildPicker` JS and the `ACCESSORIES` object.

Replace the cross-sell section at the bottom (section #7) with a real "Pair With" strip pulling from a Shopify **collection** (`jars-and-tools` minus the current product), or from a `related_products` metafield list. Keep the existing 4-card grid layout exactly as is — only the data source changes.

---

## 6. Shopify metafields to create

Define under namespace `gutbasket.tools` (or your existing namespace). Each accessory product gets these:

| Metafield key             | Type                | Source field in reference data       |
| ------------------------- | ------------------- | ------------------------------------ |
| `category_label`          | single line text    | One of: JAR, CARBOY, BOTTLE, TOOL, TESTER, PART (see §1) |
| `kit_color`               | color               | `kit_color`                          |
| `kit_color_dark`          | color               | `kit_color_dark`                     |
| `kit_color_soft`          | color               | `kit_color_soft`                     |
| `tagline`                 | single line text    | `tagline`                            |
| `bought_today`            | integer             | `bought_today` (or compute live)     |
| `features_h1`             | single line text    | `features_h1`                        |
| `features_intro`          | multi-line text     | `features_intro`                     |
| `features`                | JSON (list)         | `features` — array of `[label, desc]`|
| `specs`                   | JSON (list)         | `specs` — array of `[label, value]`  |
| `use_cases`               | JSON (list)         | `use_cases` — array of `[label, desc]`|
| `compatible_with`         | multi-line text     | `compatible_with`                    |
| `feature_icons`           | JSON (list of str)  | The 4 icon characters per product    |
| `use_case_icons`          | JSON (list of str)  | The 4 emoji characters per product   |

**Rating / review count / save badge:** prefer Judge.me (or your review app) for `rating` and `review_count`. `compare_at_price` and `price` come from the product variant directly. `save` is computed in Liquid: `{{ product.compare_at_price | minus: product.price | money }}`.

---

## 7. Liquid skeleton (drop-in conversion)

```liquid
{%- assign p = product -%}
{%- assign mf = p.metafields.gutbasket.tools -%}

<style>
:root {
  --kit-color:      {{ mf.kit_color }};
  --kit-color-dark: {{ mf.kit_color_dark }};
  --kit-color-soft: {{ mf.kit_color_soft }};
}
</style>

<section class="pdp-hero">
  <div class="container">
    <div class="breadcrumb">
      <a href="/">Home</a> /
      <a href="/collections/jars-and-tools">Jars &amp; Tools</a> /
      <span>{{ p.title }}</span>
    </div>

    <div class="hero-grid">
      <div class="gallery-stack">
        <div class="gallery-main">
          {%- if p.compare_at_price > p.price -%}
            <span class="save-badge">-{{ p.compare_at_price | minus: p.price | money_without_trailing_zeros }}</span>
          {%- endif -%}
          {%- if p.featured_image -%}
            <img src="{{ p.featured_image | image_url: width: 800 }}" alt="{{ p.title }}">
          {%- endif -%}
        </div>
        <div class="gallery-thumbs">
          {%- for img in p.images limit: 5 -%}
            <div class="gallery-thumb{% if forloop.first %} active{% endif %}">
              <img src="{{ img | image_url: width: 200 }}" alt="">
            </div>
          {%- endfor -%}
        </div>
      </div>

      <div class="product-info">
        <div class="rating-row">
          <span class="stars">★★★★★</span>
          <span class="rating-link">{{ p.metafields.judgeme.badge | default: '— (0 reviews)' }}</span>
        </div>
        <h1 class="product-name">{{ p.title | upcase }}</h1>
        <p class="product-tagline">{{ mf.tagline }}</p>

        {%- comment -%} … activity row, single-price block, ATC, trust strip … {%- endcomment -%}
      </div>
    </div>
  </div>
</section>

{%- comment -%} === FEATURES === {%- endcomment -%}
<section class="section-accent">
  <div class="container">
    <div class="section-header">
      <div class="eyebrow">WHY THIS DESIGN</div>
      <h2>{{ mf.features_h1 }}</h2>
      <p>{{ mf.features_intro }}</p>
    </div>
    <div class="feature-grid">
      {%- assign features = mf.features.value -%}
      {%- assign icons    = mf.feature_icons.value -%}
      {%- for f in features -%}
        <div class="feature-card">
          <div class="feature-icon">{{ icons[forloop.index0] | default: '◇' }}</div>
          <div class="feature-h">{{ f[0] }}</div>
          <div class="feature-d">{{ f[1] }}</div>
        </div>
      {%- endfor -%}
    </div>
  </div>
</section>

{%- comment -%} … specs, use-cases, reviews, faq, cross-sell follow the same pattern … {%- endcomment -%}
```

The full Liquid file should live at `sections/product-template-07-jars-tools.liquid` (or your equivalent).

---

## 8. Pre-flight QA checklist

Before pushing live, walk through **all 17 products** from §1 and verify:

- [ ] `--kit-color` correctly cascades — eyebrows, accent button border, feature icons, specs-cell.label background-adjacent text, compatible-strip background, use-img background, faq-toggle icon, review-avatar background all pick it up.
- [ ] `.gallery-main` has the kit-color-soft background even when no image is set yet (fallback).
- [ ] Save badge only shows when `compare_at_price > price`. Spot-check on the 5 products that currently have a discount: Grommet/Washer (SAVE 37%), Fermentation Jar 4L (SAVE 35%), Fermentation Jar 2L (SAVE 36%), Fermentation Jar 1L (SAVE 50%), Airlock for Safe Fermentation (SAVE 10%).
- [ ] **Sold Out branch:** Kombucha Jar 4 L with Tap and Steel Stand (#5) is sold out. ATC button should render as disabled "SOLD OUT" with `.single-price-tag` swapping to red/muted. Verify no JS errors.
- [ ] Single-price block: compare_at_price has strikethrough and "You save ₹X" is computed live (`product.compare_at_price | minus: product.price`).
- [ ] FAQ: each `.faq-item` opens/closes independently. Default-open the first one (matches reference).
- [ ] Cross-sell loads 4 products from the **same `jars-and-tools` collection**, excludes the current product, and excludes sold-out items.
- [ ] Specs table on mobile collapses to a single column (`.specs-row { grid-template-columns: 1fr }`).
- [ ] Activity row "X people bought today" — decide if real (analytics-driven) or marketing placeholder. If placeholder, set per-product in metafield. If real, wire to analytics or omit the line.
- [ ] No layout shift when the ATC button changes between "Add to cart" / "Sold out" / "Pre-order" states.
- [ ] Cross-family accent test — open one product from each of the 5 families (a green jar, an amber kombucha jar, a brown carboy, a teal tool, a yellow tester) back-to-back and confirm no colour bleed between page loads.

---

## 9. Things deliberately **not** in this template

The unified design system has these blocks; Template 07 does **not** use them. Don't add them unless explicitly requested:

- Variant grid (`.variant-block` / `.variant-grid`) — these are single-SKU products.
- Myth/Fact section — that lives on Templates 01, 02 (kits), not on accessories.
- Subscribe & save CTA — accessories aren't consumables. (Refills are; see Template 02.)
- "Build your kit" picker section — that's the Build-Your-Own-Box page, separate template.
- Coupon bar — not on Track D.
- Sticky mobile ATC — optional addition; not in the reference. Add if conversion data warrants it, otherwise leave out.

---

## 10. Reference data

The `ACCESSORIES` constant in the script block at the bottom of `gutbasket-jars-and-tools.html` contains **6 placeholder entries** (Fermenter 2L/1L, Airlock, Glass Weight, Mesh Lid, Drainage Stand) — these were the original design-system mockups. They are seed data for the **layout**, not the **catalogue**.

For metafield population on launch, **use the 17 live products listed in §1**, not the 6 mockup entries. The 6 are useful for previewing the design system across categories; the 17 are what actually ship. Mapping:

- The mockup's Fermenter 2L copy → seed for Fermentation Jar with Airlock 2L (#2 in §1)
- Fermenter 1L copy → seed for Fermentation Jar with Airlock 1L (#3)
- Airlock Set copy → seed for Airlock for Safe Fermentation (#9)
- Glass Weight copy → seed for Fermentation Glass weight (#11)
- Mesh Lid + Drainage Stand mockup copy → archive for now (those SKUs aren't in the live catalogue yet; see the "future additions" note in §1)

For the remaining 13 products (4L jars, kombucha jars, carboys, bottles, grommets, funnel, mesh strainer, all 4 testers) the features / specs / use-cases copy needs to be authored fresh — the mockup doesn't cover them. Suggest one writing pass before metafield seeding.

Prices, ratings, and "bought today" numbers in the mockup are illustrative only — pull all of these from live Shopify data and Judge.me at runtime.
