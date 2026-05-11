# Copy briefs

Master copy-brief document for all 64 catalogue products. Pastes
cleanly into Google Docs — headings, tables, bold, and lists all
convert correctly.

## Files

### `all-products-copy-brief.md`
2,496 lines covering:
- **How to use this doc** — 1-page guide for the writer
- **PART 1: Metafield definitions** — three tables (one per
  namespace) listing every metafield in the order it should be
  created in `Settings → Custom data → Products`. Order matches
  the top-to-bottom flow on each PDP so the admin UI shows fields
  in a predictable hierarchy.
- **PART 2: Product briefs** — 64 sections, grouped by template:
  - 18 Jars & Tools products (template: `jars-tools`)
  - 11 Kits & fermentation kits (existing kit templates)
  - 35 Refills / prebiotics / cultures / books / baking (cart accent only)

Each product section has:
- Handle, template, type/vendor, price (compare-at)
- A Status checkbox row (Draft / Review / Done)
- All metafields grouped by PDP section, **in the order they
  appear on the page**:
  - Hero
  - Accent (visual)
  - Features section
  - Specs table
  - Use cases
  - Process timing card (kits)
  - Trust strip (kits)
  - Cart drawer accent (global)
  - Notes / TODO checklist
- Pre-filled with current CSV data so writers are **editing**, not
  authoring from scratch

## Importing into Google Docs

1. Open Google Docs
2. **File → Open → Upload** and select `all-products-copy-brief.md`
3. Google Docs converts it to a styled doc with proper heading
   hierarchy. Use **View → Show outline** to navigate by product.

Alternative: open the `.md` file, copy all, paste into a new
Google Doc. Headings + bold + tables paste correctly.

## Workflow

1. Writer opens the Google Doc, navigates via outline.
2. For each product: edit fields, tick status checkboxes
   (`☐` → `☑`) as it moves through Draft → Review → Done.
3. When **all 64** are ✅ Done, export the Doc as Markdown
   (Tools → Markdown options) and ping engineering.
4. Engineering runs the brief → CSV converter (TBD — to be built
   when ready) and uploads the 3 resulting Matrixify CSVs.

## Rules for the writer

- Do **not** rename field labels (`**Tagline:**`, `**Rating:**`
  etc.) — the converter keys off them.
- For numbered list metafields (Features, Specs, Use cases), keep
  the `1. **Label** — value` shape. Add or remove items only if
  the spec says so.
- For colour fields (Kit color etc.), keep hex strings (e.g.
  `#4F7C57`). The designer set those by family — don't change
  unless asked.
- Leave `cart_addon_ids` for later — it can't be imported via CSV.
