#!/usr/bin/env python3
"""Generates the Matrixify Products CSV for Sprout Maker 700ml + 1000ml.
Run: python3 build_csv.py
Produces: sprout-maker-products.csv
"""
import csv
import json
from pathlib import Path

OUT = Path(__file__).parent / "sprout-maker-products.csv"

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

BODY_HTML = (
    "<p>Fresh, crunchy sprouts in 2–3 days — no smell, no mess, no soil. "
    "Just rinse twice a day and watch your seeds become a nutrient powerhouse. "
    "Borosilicate jar + stainless mesh lid + drainage stand + sprouting-grade seed pack.</p>"
)

PRODUCTS = [
    {
        "handle": "sprout-maker-700ml",
        "title": "Sprout Maker 700ml",
        "jar_capacity": "700ml",
        "save_badge": "-₹400",
        "help_note": "Going through 1L+ batches a week? Try the 1000ml jar — same kit, more headroom.",
        "variants": [
            {"opt": "1 Jar",  "sku": "SM-700-1J",  "price": "999.00",  "compare": "1399.00", "qty": 100, "weight": 800,  "best_for": "Solo / Trial",                "tag": ""},
            {"opt": "2 Jars", "sku": "SM-700-2J",  "price": "1499.00", "compare": "1999.00", "qty": 100, "weight": 1500, "best_for": "Couples / Small family",      "tag": "TOP SELLER"},
            {"opt": "4 Jars", "sku": "SM-700-4J",  "price": "2499.00", "compare": "3499.00", "qty": 100, "weight": 2900, "best_for": "Big families / Workplace",    "tag": "BEST VALUE"},
        ],
    },
    {
        "handle": "sprout-maker-1000ml",
        "title": "Sprout Maker 1000ml",
        "jar_capacity": "1000ml",
        "save_badge": "-₹500",
        "help_note": "Solo or trial run? The 700ml jar is plenty — same kit, smaller footprint.",
        "variants": [
            {"opt": "1 Jar",  "sku": "SM-1000-1J", "price": "1199.00", "compare": "1599.00", "qty": 100, "weight": 1000, "best_for": "Solo (heavy user)",            "tag": ""},
            {"opt": "2 Jars", "sku": "SM-1000-2J", "price": "1899.00", "compare": "2499.00", "qty": 100, "weight": 1900, "best_for": "Families",                     "tag": "TOP SELLER"},
            {"opt": "4 Jars", "sku": "SM-1000-4J", "price": "2999.00", "compare": "3999.00", "qty": 100, "weight": 3700, "best_for": "Big families / Workplace pantry", "tag": "BEST VALUE"},
        ],
    },
]

HEADERS = [
    "Handle", "Command", "Title", "Vendor", "Type", "Tags",
    "Published", "Status", "Template Suffix", "Body HTML",
    "Option1 Name", "Option1 Value",
    "Variant SKU", "Variant Price", "Variant Compare At Price",
    "Variant Inventory Qty", "Variant Inventory Tracker", "Variant Inventory Policy",
    "Variant Requires Shipping", "Variant Taxable",
    "Variant Weight Unit", "Variant Weight",
    "Variant Fulfillment Service",
    "Image Src", "Image Position", "Image Alt Text",
    "Metafield: custom.tagline [single_line_text_field]",
    "Metafield: custom.save_badge_text [single_line_text_field]",
    "Metafield: custom.review_rating [number_decimal]",
    "Metafield: custom.review_count [number_integer]",
    "Metafield: custom.activity_items [list.single_line_text_field]",
    "Metafield: custom.benefits_items [list.single_line_text_field]",
    "Metafield: custom.hero_trust_strip [list.single_line_text_field]",
    "Metafield: custom.jar_capacity [single_line_text_field]",
    "Metafield: custom.help_note [multi_line_text_field]",
    "Variant Metafield: custom.best_for [single_line_text_field]",
    "Variant Metafield: custom.tag [single_line_text_field]",
]

def main():
    with OUT.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, quoting=csv.QUOTE_MINIMAL)
        w.writerow(HEADERS)

        for p in PRODUCTS:
            for i, v in enumerate(p["variants"]):
                first = i == 0
                row = [
                    p["handle"],                                  # Handle
                    "MERGE",                                      # Command
                    p["title"]            if first else "",       # Title
                    "GutBasket"           if first else "",       # Vendor
                    "Sprouts"             if first else "",       # Type
                    "Sprouts, Sprout Maker, Kit, Bestseller" if first else "",  # Tags
                    "TRUE"                if first else "",       # Published
                    "active"              if first else "",       # Status
                    "sprout-maker"        if first else "",       # Template Suffix
                    BODY_HTML             if first else "",       # Body HTML
                    "Pack",                                       # Option1 Name (every row)
                    v["opt"],                                     # Option1 Value
                    v["sku"],                                     # Variant SKU
                    v["price"],                                   # Variant Price
                    v["compare"],                                 # Variant Compare At Price
                    v["qty"],                                     # Variant Inventory Qty
                    "shopify",                                    # Variant Inventory Tracker
                    "deny",                                       # Variant Inventory Policy
                    "TRUE",                                       # Variant Requires Shipping
                    "TRUE",                                       # Variant Taxable
                    "g",                                          # Variant Weight Unit
                    v["weight"],                                  # Variant Weight
                    "manual",                                     # Variant Fulfillment Service
                    ""                    if first else "",       # Image Src — fill in admin or here
                    "1"                   if first else "",       # Image Position
                    p["title"]            if first else "",       # Image Alt Text
                    # Product-level metafields (only on first variant row)
                    "Fresh, crunchy sprouts in 2–3 days. No smell. No mess. Just water and a jar." if first else "",
                    p["save_badge"]       if first else "",
                    "4.85"                if first else "",
                    "286"                 if first else "",
                    json.dumps(ACTIVITY,  ensure_ascii=False) if first else "",
                    json.dumps(BENEFITS,  ensure_ascii=False) if first else "",
                    json.dumps(TRUST,     ensure_ascii=False) if first else "",
                    p["jar_capacity"]     if first else "",
                    p["help_note"]        if first else "",
                    # Variant-level metafields (every row)
                    v["best_for"],
                    v["tag"],
                ]
                w.writerow(row)
    print(f"Wrote {OUT}")

if __name__ == "__main__":
    main()
