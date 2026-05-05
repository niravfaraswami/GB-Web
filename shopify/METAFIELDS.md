# Metafields — Sprout Maker PDP

These metafields drive content for **Sprout Maker 700ml** and **Sprout Maker 1000ml**. Both products use the same `templates/product.sprout-maker.json` template; per-product copy/images/links are sourced from product metafields below.

All metafields use the **`custom`** namespace (Shopify's default app-less namespace). Configure them at:
**Settings → Custom data → Products → Add definition**.

---

## A. Product metafields (set on each product)

| # | Name (display) | Namespace | Key | Type | Validation / Notes |
|---|---|---|---|---|---|
| 1 | Hero tagline | `custom` | `tagline` | Single line text | Shown below the H1 in the hero. e.g. "Fresh, crunchy sprouts in 2–3 days." |
| 2 | Save badge text | `custom` | `save_badge_text` | Single line text | e.g. `-₹400`. Rendered top-left of the gallery image. |
| 3 | Review rating | `custom` | `review_rating` | Decimal | 0.0–5.0. e.g. `4.85` |
| 4 | Review count | `custom` | `review_count` | Integer | e.g. `286` |
| 5 | Activity items | `custom` | `activity_items` | List of single line text | Each entry: `<emoji>\|<text>`. Examples:<br>`⚡\|Fresh sprouts in 2–3 days`<br>`✨\|No smell. No mess. Designed for kitchen counters` |
| 6 | Hero benefits | `custom` | `benefits_items` | List of single line text | Each entry: `<emoji>\|<label>`. e.g. `🌱\|Fresh sprouts in 2–3 days` |
| 7 | Hero trust strip | `custom` | `hero_trust_strip` | List of single line text | 2–4 short items shown under the ATC. e.g. `Free Shipping`, `Sprouting-grade seeds`, `FSSAI Licensed` |
| 8 | Jar capacity | `custom` | `jar_capacity` | Single line text | `700ml` or `1000ml`. Drives the size-card label. |
| 9 | Best for | `custom` | `best_for` | Single line text | e.g. `Solo / Trial` (700ml) or `Couples / Families` (1000ml) |
| 10 | Help note | `custom` | `help_note` | Multi line text | Shown beside the "Jar Size Chart →" link. Allows `<strong>`-style bold via richtext if you switch the type. |
| 11 | Jar size chart image | `custom` | `jar_size_chart_image` | File reference (image) | Shown inside the Jar Size Chart modal. |
| 12 | Companion size product | `custom` | `companion_size_product` | Product reference | On 700ml product, point to 1000ml; on 1000ml product, point to 700ml. Renders the "other size" card linking across. |
| 13 | Cross-sell products | `custom` | `cross_sell_products` | List of product references | Up to 3 products shown in the "Pair It With" section. If empty, the section falls back to its theme-editor collection setting. |

> **Tip — Metaobjects (optional, advanced):** if you want richer per-product content (FAQs, reviews, what's-in-box) instead of section-level theme settings, create a `kit_faq`, `kit_review`, and `kit_component` metaobject and reference them via list metafields. The current setup keeps these as block-level theme settings (shared across both products), which is simpler to manage.

---

## B. Recommended values for the two products

### Sprout Maker 700ml

| Key | Value |
|---|---|
| `tagline` | Fresh, crunchy sprouts in 2–3 days. No smell. No mess. Just water and a jar. |
| `save_badge_text` | -₹400 |
| `review_rating` | 4.85 |
| `review_count` | 286 |
| `activity_items` | `⚡\|Fresh sprouts in 2–3 days`, `✨\|No smell. No mess. Designed for kitchen counters` |
| `benefits_items` | `🌱\|Fresh sprouts in 2–3 days`, `✨\|No smell, no mess`, `💪\|10× more enzymes than seed`, `♻️\|Reusable jar lasts forever` |
| `hero_trust_strip` | `Free Shipping`, `Sprouting-grade seeds`, `FSSAI Licensed` |
| `jar_capacity` | 700ml |
| `best_for` | Solo / Trial |
| `help_note` | Not sure? Start with 1000ml if 3 or more people will eat sprouts regularly. |
| `companion_size_product` | → Sprout Maker 1000ml |

### Sprout Maker 1000ml

| Key | Value |
|---|---|
| `tagline` | Fresh, crunchy sprouts in 2–3 days. No smell. No mess. Just water and a jar. |
| `save_badge_text` | -₹500 |
| `review_rating` | 4.85 |
| `review_count` | 286 |
| `activity_items` | same as 700ml |
| `benefits_items` | same as 700ml |
| `hero_trust_strip` | same as 700ml |
| `jar_capacity` | 1000ml |
| `best_for` | Couples / Families |
| `help_note` | Going through 1L+ batches a week? This jar gives you headroom without losing airflow. |
| `companion_size_product` | → Sprout Maker 700ml |

---

## C. File map

```
shopify/
├── templates/
│   └── product.sprout-maker.json     ← assign this template to both products
├── sections/
│   └── sprout-maker-pdp.liquid       ← single section: hero + 10 content sections
├── snippets/
│   └── sprout_cs_card.liquid         ← cross-sell card partial
└── assets/
    └── sprout-maker.css              ← scoped to [data-kit="sprouts"]
```

The entire PDP lives in one section (`sprout-maker-pdp.liquid`) with 9 block types — `trust_card`, `step`, `comparison_row`, `benefit`, `reel`, `box_component`, `review`, `faq`, `cross_sell_product`. Section settings hold the eyebrow/heading copy for each subsection; blocks hold the repeatable content.

---

## D. Setup steps

1. **Drop files into your Shopify theme** at the same paths.
2. **Create the metafield definitions** in *Settings → Custom data → Products* using Section A.
3. **Assign the template** to both products: *Online Store → Products → [product] → Theme template → `product.sprout-maker`*.
4. **Fill in metafields** for each product per Section B.
5. **Open each product in the Theme Editor** to verify the hero, set the demo video on the *Sprout — How to Make* section, upload trust/UGC images, and confirm the size selector links to the companion product.
6. (Optional) Add the Judge.me embed snippet to the *Sprout — Judge.me* section's HTML field, or keep the default `data-id` widget that Judge.me's installer hooks.

---

## E. Notes on the size selector

The HTML mock used a "STARTER vs FAMILY" variant chooser inside one product. Since these are **two separate products (no variants)**, the section converts that block into a **size selector**:

- The currently-viewed size renders as the active card with the live `product.price` (and `compare_at_price` if set).
- The other size renders as a card linking to the companion product (driven by `custom.companion_size_product`). Its price/compare-at is read from that product, so it stays in sync.
- The single ATC button always adds the **current** product to the cart.

This keeps inventory, pricing, SEO and analytics clean on a per-product basis while preserving the visual split from the mock.
