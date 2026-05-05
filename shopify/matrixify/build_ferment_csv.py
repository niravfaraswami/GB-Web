#!/usr/bin/env python3
"""Reads fermentation-kit-shopify-export.csv and produces a Matrixify-ready
CSV with all product/variant data preserved + metafield columns populated.

Run: python3 build_ferment_csv.py
"""
import csv
import json
from pathlib import Path

INPUT  = Path(__file__).resolve().parent.parent.parent / "fermentation-kit-shopify-export.csv"
OUTPUT = Path(__file__).resolve().parent / "Fermentation-Kit-Products-FINAL.csv"

# === Per-product copy ===
COPY = {
    "kanji-making-kit": {
        "hero_tagline":       "Make authentic, gut-loving kanji at home — tangy, alive, naturally probiotic.",
        "discount_badge":     "-₹500",
        "rating":             "4.8",
        "review_count":       "1240",
        "bought_today":       "76",
        "days_subtitle":      "Ferments in",
        "days_to_ferment":    "3-5",
        "capacity":           "2L",
        "short_name":         "Kanji",
        "product_name_short": "Kanji Kit",
        "pdp_template":       "fermentation-kit",
        "theme_accent":       "#C24528",
        "theme_accent_dark":  "#8E2E1A",
        "theme_accent_soft":  "#FCE5DE",
        "coupon_text":        "Flat ₹50 off on your first order",
        "coupon_code":        "GUTKANJI",
    },
    "probiotic-achaar-making-kit": {
        "hero_tagline":       "Make probiotic achaar at home — alive cultures, no preservatives, traditional taste.",
        "discount_badge":     "-₹600",
        "rating":             "4.85",
        "review_count":       "586",
        "bought_today":       "42",
        "days_subtitle":      "Matures in",
        "days_to_ferment":    "5-7",
        "capacity":           "1Kg",
        "short_name":         "Achaar",
        "product_name_short": "Achaar Kit",
        "pdp_template":       "fermentation-kit",
        "theme_accent":       "#DDA738",
        "theme_accent_dark":  "#A87F25",
        "theme_accent_soft":  "#F8EBC9",
        "coupon_text":        "Flat ₹50 off on your first order",
        "coupon_code":        "GUTACHAAR",
    },
    "probiotic-drink-making-kit": {
        "hero_tagline":       "Make probiotic Aam Panna at home — cooling, alive, naturally fermented mango drink.",
        "discount_badge":     "-₹500",
        "rating":             "4.78",
        "review_count":       "412",
        "bought_today":       "38",
        "days_subtitle":      "Ferments in",
        "days_to_ferment":    "3-5",
        "capacity":           "2L",
        "short_name":         "Aam Panna",
        "product_name_short": "Aam Panna Kit",
        "pdp_template":       "fermentation-kit",
        "theme_accent":       "#FFB339",
        "theme_accent_dark":  "#C28524",
        "theme_accent_soft":  "#FFEFC9",
        "coupon_text":        "Flat ₹50 off on your first order",
        "coupon_code":        "GUTAAM",
    },
    "kimchi-making-kit": {
        "hero_tagline":       "Make traditional Korean kimchi at home — alive cultures, balanced spice, ready in 5–7 days.",
        "discount_badge":     "-₹500",
        "rating":             "4.9",
        "review_count":       "238",
        "bought_today":       "29",
        "days_subtitle":      "Ferments in",
        "days_to_ferment":    "5-7",
        "capacity":           "1L",
        "short_name":         "Kimchi",
        "product_name_short": "Kimchi Kit",
        "pdp_template":       "fermentation-kit",
        "theme_accent":       "#E84A3D",
        "theme_accent_dark":  "#A8332A",
        "theme_accent_soft":  "#FCDDD9",
        "coupon_text":        "Flat ₹50 off on your first order",
        "coupon_code":        "GUTKIMCHI",
    },
    "vegetable-fermentation-kit-with-glass-weights": {
        "hero_tagline":       "Make sauerkraut, pickles, kimchi — anything fermented vegetables, with glass-weight precision.",
        "discount_badge":     "-₹550",
        "rating":             "4.82",
        "review_count":       "318",
        "bought_today":       "34",
        "days_subtitle":      "Ferments in",
        "days_to_ferment":    "5-10",
        "capacity":           "1L",
        "short_name":         "Vegetable",
        "product_name_short": "Veg Ferment Kit",
        "pdp_template":       "fermentation-kit",
        "theme_accent":       "#4F7C57",
        "theme_accent_dark":  "#2F5337",
        "theme_accent_soft":  "#DBEDDF",
        "coupon_text":        "Flat ₹50 off on your first order",
        "coupon_code":        "GUTVEG",
    },
    "ultimate-fermentation-kit": {
        "hero_tagline":       "The complete fermentation starter — all jars, weights, airlocks and recipe books in one box.",
        "discount_badge":     "-₹1000",
        "rating":             "4.93",
        "review_count":       "184",
        "bought_today":       "21",
        "days_subtitle":      "Make any of",
        "days_to_ferment":    "20+",
        "capacity":           "All-in-One",
        "short_name":         "All-in-One",
        "product_name_short": "All-in-One Kit",
        "pdp_template":       "fermentation-kit",
        "theme_accent":       "#2B2218",
        "theme_accent_dark":  "#1F1F1D",
        "theme_accent_soft":  "#F5EDD8",
        "coupon_text":        "Flat ₹100 off on your first order",
        "coupon_code":        "GUTKIT",
    },
}

ACTIVITY = [
    "📦|25,000+ people made their first ferment with GutBasket",
    "💬|Expert help on WhatsApp",
]
BENEFITS = [
    "🦠|Live Probiotic Cultures",
    "🚫|Zero Added Sugar",
    "⚡|Ready in 3–5 Days",
    "♻️|Reusable Jar",
]
TRUST = ["Secure Payment", "Free Shipping", "FSSAI Licensed"]

# Variant-level metafields keyed by SKU
VARIANT_META = {
    "Kanji101":                        {"best_for": "Beginners",        "tag": ""},
    "Kanji201":                        {"best_for": "Regular Drinkers", "tag": "TOP SELLER"},
    "Kanji401":                        {"best_for": "Families",          "tag": "BEST VALUE"},
    "GBProbiotitcDrinkKit101":         {"best_for": "Beginners",        "tag": ""},
    "GBProbiotitcDrinkKit201":         {"best_for": "Regular Drinkers", "tag": "TOP SELLER"},
    "GBAchaarKit101":                  {"best_for": "Solo / Trial",     "tag": "TOP SELLER"},
    "GBAchaarKit201":                  {"best_for": "Families",          "tag": "BEST VALUE"},
    "VFKit101":                        {"best_for": "Beginners",        "tag": "TOP SELLER"},
    "VFKit201":                        {"best_for": "Regular Fermenters", "tag": "BEST VALUE"},
    "GBKimchiKit01":                   {"best_for": "Solo / Trial",     "tag": ""},
    "GBUltimateFermentationKit":       {"best_for": "All Ferments",     "tag": "BEST VALUE"},
}

NEW_COLUMNS = [
    "Activity Items (product.metafields.custom.activity_items) [list.single_line_text_field]",
    "Benefits Items (product.metafields.custom.benefits_items) [list.single_line_text_field]",
    "Hero Trust Strip (product.metafields.custom.hero_trust_strip) [list.single_line_text_field]",
    "Capacity (product.metafields.custom.capacity) [single_line_text_field]",
    "Coupon Text (product.metafields.custom.coupon_text) [single_line_text_field]",
    "Coupon Code (product.metafields.custom.coupon_code) [single_line_text_field]",
    "Best For (variant.metafields.custom.best_for) [single_line_text_field]",
    "Variant Tag (variant.metafields.custom.tag) [single_line_text_field]",
]

EXISTING_PRODUCT_FIELDS = {
    "Bought Today (product.metafields.custom.bought_today)":             "bought_today",
    "Days Subtitle (product.metafields.custom.days_subtitle)":           "days_subtitle",
    "Days to Ferment (product.metafields.custom.days_to_ferment)":       "days_to_ferment",
    "Discount Badge (product.metafields.custom.discount_badge)":         "discount_badge",
    "Hero Tagline (product.metafields.custom.hero_tagline)":             "hero_tagline",
    "PDP Template (product.metafields.custom.pdp_template)":             "pdp_template",
    "Product Name Short (product.metafields.custom.product_name_short)": "product_name_short",
    "Rating (product.metafields.custom.rating)":                         "rating",
    "Review Count (product.metafields.custom.review_count)":             "review_count",
    "Short Name (product.metafields.custom.short_name)":                 "short_name",
    "Theme Accent (product.metafields.custom.theme_accent)":             "theme_accent",
    "Theme Accent Dark (product.metafields.custom.theme_accent_dark)":   "theme_accent_dark",
    "Theme Accent Soft (product.metafields.custom.theme_accent_soft)":   "theme_accent_soft",
}

def main():
    with INPUT.open(newline="", encoding="utf-8") as f:
        rows = [r for r in csv.reader(f) if any(c.strip() for c in r)]
    header = rows[0]
    body   = rows[1:]
    col = {name: i for i, name in enumerate(header)}
    out_header = header + NEW_COLUMNS

    out_rows = []
    current_handle = None
    for row in body:
        if len(row) < len(header):
            row = row + [""] * (len(header) - len(row))
        handle = row[col["Handle"]]
        title  = row[col["Title"]]
        sku    = row[col["Variant SKU"]]
        if handle: current_handle = handle
        is_first = bool(title.strip())
        is_variant = bool(sku.strip())

        if is_first and current_handle in COPY:
            copy = COPY[current_handle]
            for hdr_name, key in EXISTING_PRODUCT_FIELDS.items():
                if hdr_name in col:
                    idx = col[hdr_name]
                    val = copy.get(key, "")
                    if not row[idx].strip() and val:
                        row[idx] = val

        new_vals = []
        for nc in NEW_COLUMNS:
            if "Activity Items" in nc:
                new_vals.append(json.dumps(ACTIVITY, ensure_ascii=False) if is_first else "")
            elif "Benefits Items" in nc:
                new_vals.append(json.dumps(BENEFITS, ensure_ascii=False) if is_first else "")
            elif "Hero Trust Strip" in nc:
                new_vals.append(json.dumps(TRUST, ensure_ascii=False) if is_first else "")
            elif "Capacity " in nc:
                new_vals.append(COPY.get(current_handle, {}).get("capacity", "") if is_first else "")
            elif "Coupon Text" in nc:
                new_vals.append(COPY.get(current_handle, {}).get("coupon_text", "") if is_first else "")
            elif "Coupon Code" in nc:
                new_vals.append(COPY.get(current_handle, {}).get("coupon_code", "") if is_first else "")
            elif "Best For" in nc:
                new_vals.append(VARIANT_META.get(sku, {}).get("best_for", "") if is_variant else "")
            elif "Variant Tag" in nc:
                new_vals.append(VARIANT_META.get(sku, {}).get("tag", "") if is_variant else "")
            else:
                new_vals.append("")

        out_rows.append(row + new_vals)

    with OUTPUT.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, quoting=csv.QUOTE_MINIMAL)
        w.writerow(out_header)
        for r in out_rows: w.writerow(r)

    print(f"Wrote {OUTPUT}")
    print(f"  Header columns: {len(out_header)}")
    print(f"  Data rows: {len(out_rows)}")

if __name__ == "__main__":
    main()
