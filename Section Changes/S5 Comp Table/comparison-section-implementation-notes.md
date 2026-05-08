# Comparison Table ("How This Kit Stacks Up") — Implementation Notes

Handoff for Claude Code. Reorders the comparison table columns so the order reads **Label · GutBasket Kit · Traditional Homemade · Probiotic Capsule** instead of the current Label · GutBasket Kit · Probiotic Capsule · Traditional Homemade.

No image work for this section.

---

## Summary

The current table has columns 3 and 4 in the wrong order — Probiotic Capsule sits before Traditional Homemade. The new order puts Traditional Homemade as the closer comparison (next to the kit), with Probiotic Capsule as the further-out alternative. Reasoning is editorial: a Kanji-Making-Kit buyer's *next-most-likely* alternative is a homemade approach (same intent, different effort), so it sits closer to the kit; capsules are the further-out comparison and read better at the right edge.

The change is purely a content swap — no CSS changes, no class renames, no markup structure changes. Just swap the last two cells in the header row and in each of the 7 data rows.

## File touched

`gutbasket-fermentation-kit.html`

## Step 1 — Replace the entire `.stacks-table` block

The cleanest path is one big find/replace for the whole table. Same structure, same classes, same row count, same data — just cols 3 and 4 swapped throughout.

### Find this block

```html
<div class="stacks-table">
  <!-- Header -->
  <div class="st-head">
    <div class="st-h-cell st-h-label">&nbsp;</div>
    <div class="st-h-cell st-h-kit">GutBasket Kit</div>
    <div class="st-h-cell">Probiotic Capsule</div>
    <div class="st-h-cell">Traditional Homemade</div>
  </div>

  <!-- Row: Live cultures -->
  <div class="st-row">
    <div class="st-cell st-cell-label">Live cultures</div>
    <div class="st-cell st-cell-kit"><span class="st-mark st-mark-yes"></span>8+ strains</div>
    <div class="st-cell st-cell-other">1–3 freeze-dried</div>
    <div class="st-cell st-cell-other">Variable</div>
  </div>

  <!-- Row: Effort required -->
  <div class="st-row">
    <div class="st-cell st-cell-label">Effort required</div>
    <div class="st-cell st-cell-kit"><span class="st-mark st-mark-yes"></span>5 min · 3 days wait</div>
    <div class="st-cell st-cell-other">Swallow daily</div>
    <div class="st-cell st-cell-other">Sourcing + terrace + 5 days</div>
  </div>

  <!-- Row: Taste consistency -->
  <div class="st-row">
    <div class="st-cell st-cell-label">Taste consistency</div>
    <div class="st-cell st-cell-kit"><span class="st-mark st-mark-yes"></span>Calibrated spice mix</div>
    <div class="st-cell st-cell-other">N/A</div>
    <div class="st-cell st-cell-other">Batch-by-batch</div>
  </div>

  <!-- Row: Cost per glass -->
  <div class="st-row">
    <div class="st-cell st-cell-label">Cost per glass</div>
    <div class="st-cell st-cell-kit"><span class="st-mark st-mark-yes"></span>~₹12 (with refill)</div>
    <div class="st-cell st-cell-other">~₹20–35 / capsule</div>
    <div class="st-cell st-cell-other">~₹8 + your time</div>
  </div>

  <!-- Row: Dairy-free -->
  <div class="st-row">
    <div class="st-cell st-cell-label">Dairy-free</div>
    <div class="st-cell st-cell-kit"><span class="st-mark st-mark-yes"></span>Yes</div>
    <div class="st-cell st-cell-other">Usually</div>
    <div class="st-cell st-cell-other">Yes</div>
  </div>

  <!-- Row: Diabetic-safe -->
  <div class="st-row">
    <div class="st-cell st-cell-label">Diabetic-safe</div>
    <div class="st-cell st-cell-kit"><span class="st-mark st-mark-yes"></span>Yes (no added sugar)</div>
    <div class="st-cell st-cell-other">Usually</div>
    <div class="st-cell st-cell-other">Yes</div>
  </div>

  <!-- Row: Recipe variety -->
  <div class="st-row">
    <div class="st-cell st-cell-label">Recipe variety</div>
    <div class="st-cell st-cell-kit"><span class="st-mark st-mark-yes"></span>7 variants in book</div>
    <div class="st-cell st-cell-other"><span class="st-mark st-mark-no"></span>Single format</div>
    <div class="st-cell st-cell-other">Family recipe only</div>
  </div>
</div>
```

### Replace with

```html
<div class="stacks-table">
  <!-- Header -->
  <div class="st-head">
    <div class="st-h-cell st-h-label">&nbsp;</div>
    <div class="st-h-cell st-h-kit">GutBasket Kit</div>
    <div class="st-h-cell">Traditional Homemade</div>
    <div class="st-h-cell">Probiotic Capsule</div>
  </div>

  <!-- Row: Live cultures -->
  <div class="st-row">
    <div class="st-cell st-cell-label">Live cultures</div>
    <div class="st-cell st-cell-kit"><span class="st-mark st-mark-yes"></span>8+ strains</div>
    <div class="st-cell st-cell-other">Variable</div>
    <div class="st-cell st-cell-other">1–3 freeze-dried</div>
  </div>

  <!-- Row: Effort required -->
  <div class="st-row">
    <div class="st-cell st-cell-label">Effort required</div>
    <div class="st-cell st-cell-kit"><span class="st-mark st-mark-yes"></span>5 min · 3 days wait</div>
    <div class="st-cell st-cell-other">Sourcing + terrace + 5 days</div>
    <div class="st-cell st-cell-other">Swallow daily</div>
  </div>

  <!-- Row: Taste consistency -->
  <div class="st-row">
    <div class="st-cell st-cell-label">Taste consistency</div>
    <div class="st-cell st-cell-kit"><span class="st-mark st-mark-yes"></span>Calibrated spice mix</div>
    <div class="st-cell st-cell-other">Batch-by-batch</div>
    <div class="st-cell st-cell-other">N/A</div>
  </div>

  <!-- Row: Cost per glass -->
  <div class="st-row">
    <div class="st-cell st-cell-label">Cost per glass</div>
    <div class="st-cell st-cell-kit"><span class="st-mark st-mark-yes"></span>~₹12 (with refill)</div>
    <div class="st-cell st-cell-other">~₹8 + your time</div>
    <div class="st-cell st-cell-other">~₹20–35 / capsule</div>
  </div>

  <!-- Row: Dairy-free -->
  <div class="st-row">
    <div class="st-cell st-cell-label">Dairy-free</div>
    <div class="st-cell st-cell-kit"><span class="st-mark st-mark-yes"></span>Yes</div>
    <div class="st-cell st-cell-other">Yes</div>
    <div class="st-cell st-cell-other">Usually</div>
  </div>

  <!-- Row: Diabetic-safe -->
  <div class="st-row">
    <div class="st-cell st-cell-label">Diabetic-safe</div>
    <div class="st-cell st-cell-kit"><span class="st-mark st-mark-yes"></span>Yes (no added sugar)</div>
    <div class="st-cell st-cell-other">Yes</div>
    <div class="st-cell st-cell-other">Usually</div>
  </div>

  <!-- Row: Recipe variety -->
  <div class="st-row">
    <div class="st-cell st-cell-label">Recipe variety</div>
    <div class="st-cell st-cell-kit"><span class="st-mark st-mark-yes"></span>7 variants in book</div>
    <div class="st-cell st-cell-other">Family recipe only</div>
    <div class="st-cell st-cell-other"><span class="st-mark st-mark-no"></span>Single format</div>
  </div>
</div>
```

That's the entire change for this section.

---

## Step 2 — Verify

1. **Open the PDP at desktop width (≥1200px).** Comparison section "HOW THIS KIT STACKS UP" renders. Header row left-to-right reads: blank · GutBasket Kit (maroon highlight) · Traditional Homemade · Probiotic Capsule.
2. **Spot-check the data flow** — for the "Cost per glass" row, the GutBasket cell shows `~₹12 (with refill)`, Traditional shows `~₹8 + your time`, Probiotic Capsule shows `~₹20–35 / capsule`. (Easy way to confirm the swap landed: traditional homemade costs less than capsules, so it should appear in the third column with the lower number.)
3. **Spot-check the X-mark placement** — the only red ✕ in the table (Recipe variety row, "Single format") should now sit in the rightmost column (Probiotic Capsule), not the third.
4. **Resize to <768px.** Grid stays at 4 equal columns (`1fr 1fr 1fr 1fr`). All cells shrink to 11.5px font but the column order stays the same.
5. **Verify the maroon highlight** still sits only on the GutBasket column header and its cells — the column reorder doesn't affect any of the highlighting CSS, so this should just continue to work.

---

## Out of scope — flagged for future

- **Kit-switcher binding:** the table's row labels and cell content are currently hard-coded for kanji ("8+ strains" of LAB, "Calibrated spice mix" referring to the kanji spice, etc.). When this layout rolls to other kits (achaar, sauerkraut), each kit needs its own seven rows of comparison data. Two reasonable refactor approaches:
  1. Wrap the entire `<div class="stacks-table">` content in `data-bind="stacks-table-html"` and feed full innerHTML from each kit's data block. Quickest change, kept declarative.
  2. Add a `comparison_rows` array to each kit's data block (e.g. `[{label: 'Live cultures', kit: '8+ strains', traditional: 'Variable', capsule: '1–3 freeze-dried', kit_check: true, ...}, ...]`) and have the JS render rows. More structured, easier to manage long-term.
  Either approach works. Note for the next refactor pass.
- **Column 3 vs 4 generality:** the new column order (Traditional · Capsule) makes editorial sense for kanji because the buyer's most likely alternatives in priority order are: try to make it themselves first, then try a capsule. For other kits, this priority might shift — for the Sprouts kit, the buyer's alternatives are: buy sprouts at the supermarket vs. sprout at home in cloth. There's no "capsule" comparison there. So when extending to other kits, expect the *number* of comparison columns and the column subjects themselves to vary per kit, not just the row data. Worth a structural rethink at refactor time, not just a content swap.
