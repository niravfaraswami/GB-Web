#!/usr/bin/env python3
"""Reads the user's Sprout-Maker-Shopify-Products.csv and produces a final
Matrixify-ready CSV with all metafield values filled in. Preserves their
exact column structure and adds new columns for the additional metafields
required by the Sprout Maker PDP layout.

Run: python3 build_final_csv.py
"""
import csv
import json
from pathlib import Path

INPUT  = Path(__file__).resolve().parent.parent.parent / "Sprout-Maker-Shopify-Products.csv"
OUTPUT = Path(__file__).resolve().parent / "Sprout-Maker-Shopify-Products-FINAL.csv"

# === Per-product copy ===
COPY = {
    "sprout-making-jar": {  # 700ml product
        "hero_tagline":     "Fresh, crunchy sprouts in 2–3 days. No smell. No mess. Just water and a jar.",
        "discount_badge":   "-₹650",
        "jar_capacity":     "700ml",
        "help_note":        "Going through 1L+ batches a week? Try the 1 L jar — same kit, more headroom.",
        "product_name_short": "Sprout Maker",
        "short_name":       "Sprout Maker",
    },
    "sprout-maker-1-l": {   # 1 L product
        "hero_tagline":     "Fresh, crunchy sprouts in 2–3 days. No smell. No mess. Just water and a jar.",
        "discount_badge":   "-₹650",
        "jar_capacity":     "1000ml",
        "help_note":        "Solo or trial run? The 700ml jar is plenty — same kit, smaller footprint.",
        "product_name_short": "Sprout Maker",
        "short_name":       "Sprout Maker",
    },
}

# Shared across both products
SHARED = {
    "bought_today":       "94",
    "content_id":         "",   # leave blank — internal field
    "days_subtitle":      "Sprouts ready in",
    "days_to_ferment":    "2-3",
    "kit_label_format":   "",   # leave blank — usage unclear
    "pdp_template":       "sprout-maker",
    "rating":             "4.85",
    "review_count":       "286",
    "theme_accent":       "#3F7754",
    "theme_accent_dark":  "#2C5840",
    "theme_accent_soft":  "#E8F4DC",
}

ACTIVITY = [
    "⚡|Fresh sprouts in 2–3 days",
    "✨|No smell. No mess. Designed for kitchen counters",
]
BENEFITS = [
    "🌱|Fresh sprouts in 2–3 days",
    "✨|No smell, no mess",
    "💪|10× more enzymes than seed",
    "♻️|Reusable jar lasts forever",
]
TRUST = ["Free Shipping", "Sprouting-grade seeds", "FSSAI Licensed"]

# Variant-level metafields keyed by Variant SKU
VARIANT_META = {
    "SM-700-1J":  {"best_for": "Solo / Trial",                     "tag": ""},
    "SM-700-2J":  {"best_for": "Couples / Small family",           "tag": "TOP SELLER"},
    "SM-700-4J":  {"best_for": "Big families / Workplace",         "tag": "BEST VALUE"},
    "SM-1000-1J": {"best_for": "Solo (heavy user)",                "tag": ""},
    "SM-1000-2J": {"best_for": "Families",                         "tag": "TOP SELLER"},
    "SM-1000-4J": {"best_for": "Big families / Workplace pantry",  "tag": "BEST VALUE"},
}

# New metafield columns to append to the user's CSV (with type hints so
# Matrixify creates the definitions on first import).
NEW_COLUMNS = [
    "Activity Items (product.metafields.custom.activity_items) [list.single_line_text_field]",
    "Benefits Items (product.metafields.custom.benefits_items) [list.single_line_text_field]",
    "Hero Trust Strip (product.metafields.custom.hero_trust_strip) [list.single_line_text_field]",
    "Jar Capacity (product.metafields.custom.jar_capacity) [single_line_text_field]",
    "Help Note (product.metafields.custom.help_note) [multi_line_text_field]",
    "Best For (variant.metafields.custom.best_for) [single_line_text_field]",
    "Variant Tag (variant.metafields.custom.tag) [single_line_text_field]",
]

# Mapping from existing column header → metafield key for shared fields
EXISTING_PRODUCT_FIELDS = {
    "Bought Today (product.metafields.custom.bought_today)":             ("shared", "bought_today"),
    "Content ID (product.metafields.custom.content_id)":                 ("shared", "content_id"),
    "Days Subtitle (product.metafields.custom.days_subtitle)":           ("shared", "days_subtitle"),
    "Days to Ferment (product.metafields.custom.days_to_ferment)":       ("shared", "days_to_ferment"),
    "Discount Badge (product.metafields.custom.discount_badge)":         ("copy",   "discount_badge"),
    "Hero Tagline (product.metafields.custom.hero_tagline)":             ("copy",   "hero_tagline"),
    "Kit Label Format (product.metafields.custom.kit_label_format)":     ("shared", "kit_label_format"),
    "PDP Template (product.metafields.custom.pdp_template)":             ("shared", "pdp_template"),
    "Product Name Short (product.metafields.custom.product_name_short)": ("copy",   "product_name_short"),
    "Rating (product.metafields.custom.rating)":                         ("shared", "rating"),
    "Review Count (product.metafields.custom.review_count)":             ("shared", "review_count"),
    "Short Name (product.metafields.custom.short_name)":                 ("copy",   "short_name"),
    "Theme Accent (product.metafields.custom.theme_accent)":             ("shared", "theme_accent"),
    "Theme Accent Dark (product.metafields.custom.theme_accent_dark)":   ("shared", "theme_accent_dark"),
    "Theme Accent Soft (product.metafields.custom.theme_accent_soft)":   ("shared", "theme_accent_soft"),
}

def main():
    with INPUT.open(newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        rows = [r for r in reader if any(c.strip() for c in r)]  # drop blank trailing line

    header = rows[0]
    body   = rows[1:]

    # Index columns we'll mutate
    col = {name: i for i, name in enumerate(header)}

    out_header = header + NEW_COLUMNS

    # Track which rows are "product first row" — those whose Title is non-empty
    # and which are "variant rows" — non-blank SKU. Image-only rows have
    # blank SKU and blank Title.
    out_rows = []
    current_handle = None

    for row in body:
        # pad row to header length
        if len(row) < len(header):
            row = row + [""] * (len(header) - len(row))

        handle = row[col["Handle"]]
        title  = row[col["Title"]]
        sku    = row[col["Variant SKU"]]

        if handle:
            current_handle = handle

        is_product_first_row = bool(title.strip())
        is_variant_row       = bool(sku.strip())

        # Fill product-level metafields on the first (product) row only.
        if is_product_first_row and current_handle in COPY:
            copy   = COPY[current_handle]
            shared = SHARED
            for header_name, (source, key) in EXISTING_PRODUCT_FIELDS.items():
                if header_name not in col:
                    continue
                idx = col[header_name]
                src = copy if source == "copy" else shared
                value = src.get(key, "")
                # Don't overwrite values the user already filled in
                if not row[idx].strip() and value != "":
                    row[idx] = value

        # Append new columns in the same order as NEW_COLUMNS
        new_values = []
        for new_col in NEW_COLUMNS:
            if "Activity Items" in new_col:
                new_values.append(json.dumps(ACTIVITY, ensure_ascii=False) if is_product_first_row else "")
            elif "Benefits Items" in new_col:
                new_values.append(json.dumps(BENEFITS, ensure_ascii=False) if is_product_first_row else "")
            elif "Hero Trust Strip" in new_col:
                new_values.append(json.dumps(TRUST, ensure_ascii=False) if is_product_first_row else "")
            elif "Jar Capacity" in new_col:
                new_values.append(COPY.get(current_handle, {}).get("jar_capacity", "") if is_product_first_row else "")
            elif "Help Note" in new_col:
                new_values.append(COPY.get(current_handle, {}).get("help_note", "") if is_product_first_row else "")
            elif "Best For" in new_col:
                new_values.append(VARIANT_META.get(sku, {}).get("best_for", "") if is_variant_row else "")
            elif "Variant Tag" in new_col:
                new_values.append(VARIANT_META.get(sku, {}).get("tag", "") if is_variant_row else "")
            else:
                new_values.append("")

        out_rows.append(row + new_values)

    with OUTPUT.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, quoting=csv.QUOTE_MINIMAL)
        w.writerow(out_header)
        for r in out_rows:
            w.writerow(r)

    print(f"Wrote {OUTPUT}")
    print(f"  Header columns: {len(out_header)}")
    print(f"  Data rows: {len(out_rows)}")

if __name__ == "__main__":
    main()
