#!/usr/bin/env python3
"""Creates Shopify metafield + metaobject definitions for the GutBasket
PDP system, via the Shopify Admin GraphQL API.

ARCHITECTURE
============
Six kit templates share one definition registry (sprout-maker today;
baking, cultures, fermentation-kit, prebiotic, spice-refill next).

Repeatable content (FAQs, steps, reviews, components, trust cards,
quick benefits, comparison rows, UGC reels) is stored in METAOBJECTS,
referenced from products via list.metaobject_reference metafields.
This means *adding more reviews / FAQs / steps to a product creates
ZERO extra metafield definitions* — you just add more metaobject
entries.

Per-product unique copy (hero tagline, badge, capacity, etc.) and
section overrides (comparison images, how-to-make video, icons) are
stored as direct product metafields.

GROUPS
======
  metaobjects (8)  — kit_review, kit_faq, kit_step, kit_component,
                     kit_trust_card, kit_quick_benefit,
                     kit_comparison_row, kit_reel
  shared      (28) — applies to every kit template:
                       6  Hero copy / capacity / help_note
                       2  Cross-product refs
                       4  Section image / video overrides
                       2  Section copy overrides (intro etc.)
                       4  Icon list overrides
                       8  Featured-content metaobject list refs
                       2  SEO overrides (optional)
  sprout      (2)  — sprout-maker legacy keys
  variants    (2)  — best_for, tag

Total: 40 definitions. Idempotent (re-runs skip existing).

SETUP (one-time)
================
1. In Shopify admin: Settings → Apps and sales channels → Develop apps
   → enable custom app development if prompted, then Create an app.
2. Configure Admin API scopes — tick read+write for: products,
   metaobjects, metaobject_definitions.
3. Install app, "Reveal token once", copy the shpat_… token.

USAGE
=====
    SHOP_DOMAIN=ferment-jar.myshopify.com \\
    ADMIN_TOKEN=shpat_xxxxxxxxxxxx \\
    python3 create_definitions_via_api.py [--scope SCOPE]

SCOPE: all (default) | metaobjects | shared | sprout | variants
"""
import argparse
import json
import os
import sys
import urllib.request
import urllib.error

SHOP    = os.environ.get("SHOP_DOMAIN", "").strip()
TOKEN   = os.environ.get("ADMIN_TOKEN", "").strip()
API_VER = "2025-01"

URL = f"https://{SHOP}/admin/api/{API_VER}/graphql.json" if SHOP else ""


def gql(query, variables=None):
    req = urllib.request.Request(
        URL,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": TOKEN,
        },
        data=json.dumps({"query": query, "variables": variables or {}}).encode("utf-8"),
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return {"errors": [{"message": f"HTTP {e.code}: {e.read().decode('utf-8', errors='replace')}"}]}


# ============================================================
# 1. METAOBJECTS — repeatable structured content per product
# ============================================================
# Tuple shape: (type, name, description, [(key, name, type, [validations])])
IMG = [("file_type_options", '["Image"]')]
VID = [("file_type_options", '["Video"]')]

METAOBJECTS = [
    (
        "kit_review", "Kit Review",
        "UGC review card on PDP.",
        [
            ("photo", "Photo", "file_reference",         IMG),
            ("quote", "Quote", "single_line_text_field", []),
            ("name",  "Name",  "single_line_text_field", []),
            ("meta",  "Meta",  "single_line_text_field", []),
        ],
    ),
    (
        "kit_faq", "Kit FAQ",
        "Q/A pair shown in PDP FAQ accordion.",
        [
            ("question", "Question", "single_line_text_field", []),
            ("answer",   "Answer",   "multi_line_text_field",  []),
        ],
    ),
    (
        "kit_step", "Kit Step",
        "Numbered how-to-make step.",
        [
            ("title",       "Title",       "single_line_text_field", []),
            ("description", "Description", "multi_line_text_field",  []),
            ("icon",        "Icon",        "file_reference",         IMG),
        ],
    ),
    (
        "kit_component", "Kit Component",
        "What's-in-the-box pill.",
        [
            ("name",        "Name",        "single_line_text_field", []),
            ("description", "Description", "multi_line_text_field",  []),
            ("icon",        "Icon",        "file_reference",         IMG),
        ],
    ),
    (
        "kit_trust_card", "Kit Trust Card",
        "Trust strip card (icon + heading + description).",
        [
            ("heading",     "Heading",     "single_line_text_field", []),
            ("description", "Description", "multi_line_text_field",  []),
            ("icon",        "Icon",        "file_reference",         IMG),
        ],
    ),
    (
        "kit_quick_benefit", "Kit Quick Benefit",
        "Quick benefit card (icon + heading + description).",
        [
            ("heading",     "Heading",     "single_line_text_field", []),
            ("description", "Description", "multi_line_text_field",  []),
            ("icon",        "Icon",        "file_reference",         IMG),
        ],
    ),
    (
        "kit_comparison_row", "Kit Comparison Row",
        "One row in the comparison table (left + right values).",
        [
            ("left_heading",    "Left Heading",    "single_line_text_field", []),
            ("left_subtext",    "Left Subtext",    "multi_line_text_field",  []),
            ("right_heading",   "Right Heading",   "single_line_text_field", []),
            ("right_subtext",   "Right Subtext",   "multi_line_text_field",  []),
        ],
    ),
    (
        "kit_reel", "Kit Reel",
        "UGC vertical video reel (9:16).",
        [
            ("video",   "Video",   "file_reference", VID),
            ("poster",  "Poster",  "file_reference", IMG),
            ("caption", "Caption", "single_line_text_field", []),
            ("handle",  "Handle",  "single_line_text_field", []),
        ],
    ),
]


# ============================================================
# 2. SHARED METAFIELDS — apply to every kit template
# ============================================================
# Tuple shape: (owner, namespace, key, name, type, description, [extra_validations])
SHARED_DEFS = [
    # ---- Hero copy / capacity / help_note ----
    ("PRODUCT", "custom", "activity_items",     "Activity Items",
     "list.single_line_text_field",
     "Hero activity row items. Each entry: \"<emoji>|<text>\".", []),
    ("PRODUCT", "custom", "benefits_items",     "Benefits Items",
     "list.single_line_text_field",
     "Hero \"Why this kit\" 2x2 benefits. Each entry: \"<emoji>|<label>\".", []),
    ("PRODUCT", "custom", "hero_trust_strip",   "Hero Trust Strip",
     "list.single_line_text_field",
     "Short trust items below the ATC button.", []),
    ("PRODUCT", "custom", "help_note",          "Help Note",
     "multi_line_text_field",
     "Helper text shown beside the size-chart link in the variant block.", []),
    ("PRODUCT", "custom", "capacity",           "Capacity",
     "single_line_text_field",
     "Generic capacity label (e.g. 700ml / 2L / 1kg). Sprout-maker uses jar_capacity.", []),
    ("PRODUCT", "custom", "size_chart_image",   "Size Chart Image",
     "file_reference",
     "Image inside the size-chart modal.", IMG),

    # ---- Cross-product references ----
    ("PRODUCT", "custom", "companion_size_product", "Companion Size Product",
     "product_reference",
     "Sister product at a different capacity (700ml ↔ 1L).", []),
    ("PRODUCT", "custom", "cross_sell_products",    "Cross-sell Products",
     "list.product_reference",
     "Up to 3 products in the Pair It With section.",
     [("max_list_size", "3")]),

    # ---- Section image / video overrides ----
    ("PRODUCT", "custom", "comparison_left_image",  "Comparison Left Image",
     "file_reference", "Comparison section — left card image.", IMG),
    ("PRODUCT", "custom", "comparison_right_image", "Comparison Right Image",
     "file_reference", "Comparison section — right card image.", IMG),
    ("PRODUCT", "custom", "box_image",              "Box Image",
     "file_reference", "What's-in-the-Box section image.", IMG),
    ("PRODUCT", "custom", "how_to_make_video",      "How to Make Video",
     "file_reference", "Demo video for the How-to-Make section.", VID),

    # ---- Section copy overrides ----
    ("PRODUCT", "custom", "comparison_intro",       "Comparison Intro",
     "multi_line_text_field",
     "Intro paragraph above the comparison table.", []),
    ("PRODUCT", "custom", "box_note",               "Box Note",
     "multi_line_text_field",
     "Tagline shown below the What's-in-the-Box pills.", []),

    # ---- Icon list overrides ----
    ("PRODUCT", "custom", "hero_benefits_icons",    "Hero Benefits Icons",
     "list.file_reference",
     "Icons for hero \"Why this kit\" 2x2 — same order as benefits_items.",
     IMG + [("max_list_size", "8")]),
    ("PRODUCT", "custom", "benefits_icons",         "Benefits Icons",
     "list.file_reference",
     "Icons for Quick Benefits cards — same order as benefit blocks.",
     IMG + [("max_list_size", "8")]),
    ("PRODUCT", "custom", "trust_strip_icons",      "Trust Strip Icons",
     "list.file_reference",
     "Icons for Trust Row — same order as trust_card blocks.",
     IMG + [("max_list_size", "8")]),
    ("PRODUCT", "custom", "step_icons",             "Step Icons",
     "list.file_reference",
     "Icons for How-to-Make steps — same order as step blocks.",
     IMG + [("max_list_size", "8")]),

    # ---- Featured-content metaobject list refs (one per metaobject) ----
    ("PRODUCT", "custom", "featured_reviews",          "Featured Reviews",
     "list.metaobject_reference",
     "UGC reviews shown in the PDP. References kit_review entries.", []),
    ("PRODUCT", "custom", "featured_faqs",             "Featured FAQs",
     "list.metaobject_reference",
     "FAQ items shown in the PDP. References kit_faq entries.", []),
    ("PRODUCT", "custom", "featured_steps",            "Featured Steps",
     "list.metaobject_reference",
     "How-to-make steps shown in the PDP. References kit_step entries.", []),
    ("PRODUCT", "custom", "featured_components",       "Featured Components",
     "list.metaobject_reference",
     "What's-in-the-box components. References kit_component entries.", []),
    ("PRODUCT", "custom", "featured_trust_cards",      "Featured Trust Cards",
     "list.metaobject_reference",
     "Trust strip cards. References kit_trust_card entries.", []),
    ("PRODUCT", "custom", "featured_quick_benefits",   "Featured Quick Benefits",
     "list.metaobject_reference",
     "Quick benefit cards. References kit_quick_benefit entries.", []),
    ("PRODUCT", "custom", "featured_comparison_rows",  "Featured Comparison Rows",
     "list.metaobject_reference",
     "Comparison table rows. References kit_comparison_row entries.", []),
    ("PRODUCT", "custom", "featured_reels",            "Featured Reels",
     "list.metaobject_reference",
     "UGC reels. References kit_reel entries.", []),

    # ---- SEO overrides (optional) ----
    ("PRODUCT", "custom", "seo_title_override",       "SEO Title Override",
     "single_line_text_field",
     "Optional override for the page <title>.", []),
    ("PRODUCT", "custom", "seo_description_override", "SEO Description Override",
     "multi_line_text_field",
     "Optional override for the meta description.", []),
]


# ============================================================
# 3. SPROUT-MAKER-ONLY METAFIELDS
# ============================================================
SPROUT_DEFS = [
    ("PRODUCT", "custom", "jar_capacity",         "Jar Capacity",
     "single_line_text_field",
     "Sprout-maker-only capacity label (700ml / 1000ml). Other kits use `capacity`.",
     []),
    ("PRODUCT", "custom", "jar_size_chart_image", "Jar Size Chart Image",
     "file_reference",
     "Sprout-maker-only size-chart image. Other kits use `size_chart_image`.",
     IMG),
]


# ============================================================
# 4. VARIANT-LEVEL METAFIELDS
# ============================================================
VARIANT_DEFS = [
    ("PRODUCTVARIANT", "custom", "best_for", "Best For",
     "single_line_text_field",
     "Per-variant audience copy under the BEST FOR label inside each pack card.", []),
    ("PRODUCTVARIANT", "custom", "tag",      "Variant Tag",
     "single_line_text_field",
     "Optional badge above each variant card (e.g. TOP SELLER, BEST VALUE).", []),
]


# Map: metaobject metafield key → metaobject type used to inject
# a metaobject_definition_id validation at runtime.
METAOBJECT_LINKS = {
    "featured_reviews":         "kit_review",
    "featured_faqs":            "kit_faq",
    "featured_steps":           "kit_step",
    "featured_components":      "kit_component",
    "featured_trust_cards":     "kit_trust_card",
    "featured_quick_benefits":  "kit_quick_benefit",
    "featured_comparison_rows": "kit_comparison_row",
    "featured_reels":           "kit_reel",
}


# ============================================================
# GraphQL helpers
# ============================================================

LOOKUP_MO = """
query($type: String!) {
  metaobjectDefinitionByType(type: $type) { id }
}
"""

CREATE_MO = """
mutation CreateMetaobjectDefinition($definition: MetaobjectDefinitionCreateInput!) {
  metaobjectDefinitionCreate(definition: $definition) {
    metaobjectDefinition { id type name }
    userErrors { field message code }
  }
}
"""

CREATE_MF = """
mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
  metafieldDefinitionCreate(definition: $definition) {
    createdDefinition { id namespace key name type { name } }
    userErrors { field message code }
  }
}
"""


def _err_already_exists(errs):
    for e in errs:
        msg = (e.get("message") or "").lower()
        code = (e.get("code") or "").lower()
        if "taken" in msg or "already exists" in msg or code == "taken":
            return True
    return False


def lookup_metaobject_id(type_name):
    res = gql(LOOKUP_MO, {"type": type_name})
    return res.get("data", {}).get("metaobjectDefinitionByType", {}).get("id")


def create_metaobjects():
    print(f"\n=== Metaobject definitions ({len(METAOBJECTS)}) ===")
    ok, fail, skip = 0, 0, 0
    for type_, name, desc, fields in METAOBJECTS:
        var = {
            "definition": {
                "type": type_,
                "name": name,
                "description": desc,
                "fieldDefinitions": [
                    {
                        "key": k, "name": n, "type": t,
                        "validations": [{"name": vn, "value": vv} for (vn, vv) in vals],
                    }
                    for (k, n, t, vals) in fields
                ],
            }
        }
        res = gql(CREATE_MO, var)
        errs = res.get("data", {}).get("metaobjectDefinitionCreate", {}).get("userErrors", [])
        top  = res.get("errors", [])
        label = type_.ljust(24)
        if top:                          print(f"  {label} TOP-LEVEL: {top}"); fail += 1
        elif errs and _err_already_exists(errs): print(f"  {label} SKIP (exists)");      skip += 1
        elif errs:                       print(f"  {label} ERROR: {errs}");              fail += 1
        else:                            print(f"  {label} CREATED");                    ok += 1
    return ok, fail, skip


def create_metafields(defs, header):
    print(f"\n=== {header} ({len(defs)}) ===")
    ok, fail, skip = 0, 0, 0
    for owner, ns, key, name, type_, desc, validations in defs:
        validations = list(validations)  # copy
        if key in METAOBJECT_LINKS:
            mo_id = lookup_metaobject_id(METAOBJECT_LINKS[key])
            if mo_id:
                validations.append(("metaobject_definition_id", mo_id))

        var = {
            "definition": {
                "name": name,
                "namespace": ns,
                "key": key,
                "ownerType": owner,
                "type": type_,
                "description": desc,
                "pin": True,
                "access": {"storefront": "PUBLIC_READ"},
                "validations": [{"name": vn, "value": vv} for (vn, vv) in validations],
            }
        }
        res = gql(CREATE_MF, var)
        errs = res.get("data", {}).get("metafieldDefinitionCreate", {}).get("userErrors", [])
        top  = res.get("errors", [])
        label = f"{owner.lower()}.{ns}.{key}".ljust(52)
        if top:                          print(f"  {label} TOP-LEVEL: {top}"); fail += 1
        elif errs and _err_already_exists(errs): print(f"  {label} SKIP (exists)");      skip += 1
        elif errs:
            msgs = " | ".join(e.get("message", "") for e in errs)
            print(f"  {label} ERROR: {msgs}");                                            fail += 1
        else:                            print(f"  {label} CREATED");                    ok += 1
    return ok, fail, skip


def main():
    parser = argparse.ArgumentParser(
        description="Create GutBasket PDP metafield + metaobject definitions.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--scope",
        choices=["all", "metaobjects", "shared", "sprout", "variants"],
        default="all",
        help="Which group(s) to create. Default: all.",
    )
    args = parser.parse_args()

    if not SHOP or not TOKEN:
        sys.exit("Set SHOP_DOMAIN and ADMIN_TOKEN environment variables. See script header for setup.")

    print(f"Shop:  {SHOP}")
    print(f"Scope: {args.scope}")

    totals = [0, 0, 0]  # ok, fail, skip
    if args.scope in ("all", "metaobjects"):
        for i, n in enumerate(create_metaobjects()):                                     totals[i] += n
    if args.scope in ("all", "shared"):
        for i, n in enumerate(create_metafields(SHARED_DEFS,  "Shared product metafields")): totals[i] += n
    if args.scope in ("all", "sprout"):
        for i, n in enumerate(create_metafields(SPROUT_DEFS,  "Sprout-maker metafields")):   totals[i] += n
    if args.scope in ("all", "variants"):
        for i, n in enumerate(create_metafields(VARIANT_DEFS, "Variant-level metafields")): totals[i] += n

    print(f"\n{'='*64}")
    print(f"TOTAL: {totals[0]} created, {totals[2]} skipped, {totals[1]} failed")
    sys.exit(0 if totals[1] == 0 else 1)


if __name__ == "__main__":
    main()
