#!/usr/bin/env python3
"""Creates Shopify metafield definitions and metaobject definitions for the
GutBasket PDP system, via the Shopify Admin GraphQL API.

Designed to scale across ALL kit templates (sprout-maker, baking, cultures,
fermentation-kit, prebiotic, spice-refill, …). Metafields are split into:

    1. METAOBJECTS         — repeatable structured content
                             (kit_review, kit_faq, kit_step, kit_component)
    2. SHARED_DEFS         — applies to every kit template
    3. SPROUT_DEFS         — sprout-maker-only extras (jar_capacity,
                             jar_size_chart_image)
    4. VARIANT_DEFS        — per-variant metafields (best_for, tag)

Adding a new kit later? Drop a new list below (e.g. BAKING_DEFS), register
it in MAIN_GROUPS, done.

SETUP (one-time)
================
1. In Shopify admin: Settings → Apps and sales channels → Develop apps →
   enable custom app development if prompted, then Create an app.
2. Configure Admin API scopes — tick:
     read_products, write_products,
     read_metaobjects, write_metaobjects,
     read_metaobject_definitions, write_metaobject_definitions
   (some scope names vary by API version — tick anything that mentions
    metafields/metaobjects).
3. Install app, then "Reveal token once" — copy the shpat_… token.

USAGE
=====
    SHOP_DOMAIN=ferment-jar.myshopify.com \\
    ADMIN_TOKEN=shpat_xxxxxxxxxxxx \\
    python3 create_definitions_via_api.py [--scope SCOPE]

Where SCOPE is one of:
    all       (default) — create everything
    metaobjects         — only metaobjects
    shared              — only the cross-kit metafields
    sprout              — only sprout-maker-specific extras
    variants            — only variant-level metafields

The script is idempotent — existing definitions are skipped (Shopify
returns "TAKEN" and we ignore it).
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
# Each entry: (type, name, [(key, name, type, [validations])])
METAOBJECTS = [
    (
        "kit_review", "Kit Review",
        "Customer review used in PDP UGC review cards.",
        [
            ("photo", "Photo", "file_reference",        [("file_type_options", '["Image"]')]),
            ("quote", "Quote", "single_line_text_field", []),
            ("name",  "Name",  "single_line_text_field", []),
            ("meta",  "Meta",  "single_line_text_field", []),  # e.g. "28, Pune · First-time sprouter"
        ],
    ),
    (
        "kit_faq", "Kit FAQ",
        "Question/answer pair used in PDP FAQ accordion.",
        [
            ("question", "Question", "single_line_text_field", []),
            ("answer",   "Answer",   "multi_line_text_field",   []),
        ],
    ),
    (
        "kit_step", "Kit Step",
        "How-to-make step (numbered) used in PDP step list.",
        [
            ("title",       "Title",       "single_line_text_field", []),
            ("description", "Description", "multi_line_text_field",  []),
            ("icon",        "Icon",        "file_reference",         [("file_type_options", '["Image"]')]),
        ],
    ),
    (
        "kit_component", "Kit Component",
        "Component shown in the What's-in-the-Box pills.",
        [
            ("name",        "Name",        "single_line_text_field", []),
            ("description", "Description", "multi_line_text_field",  []),
            ("icon",        "Icon",        "file_reference",         [("file_type_options", '["Image"]')]),
        ],
    ),
]


# ============================================================
# 2. SHARED METAFIELDS — apply to every kit template
# ============================================================
# Tuple shape: (owner, namespace, key, name, type, description, [extra_validations])
SHARED_DEFS = [
    # Hero copy / branding
    ("PRODUCT", "custom", "activity_items",     "Activity Items",
     "list.single_line_text_field",
     "Hero activity row items. Each entry: \"<emoji>|<text>\".",
     []),
    ("PRODUCT", "custom", "benefits_items",     "Benefits Items",
     "list.single_line_text_field",
     "Hero \"Why this kit\" 2x2 benefits. Each entry: \"<emoji>|<label>\".",
     []),
    ("PRODUCT", "custom", "hero_trust_strip",   "Hero Trust Strip",
     "list.single_line_text_field",
     "Short trust items shown below the ATC button.",
     []),
    ("PRODUCT", "custom", "help_note",          "Help Note",
     "multi_line_text_field",
     "Helper text shown beside the size-chart link in the variant block.",
     []),
    ("PRODUCT", "custom", "capacity",           "Capacity",
     "single_line_text_field",
     "Generic capacity label for kits with size variants. e.g. 700ml / 2L / 1kg.",
     []),
    ("PRODUCT", "custom", "size_chart_image",   "Size Chart Image",
     "file_reference",
     "Image displayed inside the size-chart modal.",
     [("file_type_options", '["Image"]')]),

    # Cross-product references
    ("PRODUCT", "custom", "companion_size_product", "Companion Size Product",
     "product_reference",
     "Sister product at a different capacity (e.g. 700ml ↔ 1L).",
     []),
    ("PRODUCT", "custom", "cross_sell_products",    "Cross-sell Products",
     "list.product_reference",
     "Up to 3 products shown in the Pair It With section.",
     [("max_list_size", "3")]),

    # Section overrides — images & video
    ("PRODUCT", "custom", "comparison_left_image",  "Comparison Left Image",
     "file_reference", "Comparison section — left card image.",
     [("file_type_options", '["Image"]')]),
    ("PRODUCT", "custom", "comparison_right_image", "Comparison Right Image",
     "file_reference", "Comparison section — right card image.",
     [("file_type_options", '["Image"]')]),
    ("PRODUCT", "custom", "box_image",              "Box Image",
     "file_reference", "What's-in-the-Box section image.",
     [("file_type_options", '["Image"]')]),
    ("PRODUCT", "custom", "how_to_make_video",      "How to Make Video",
     "file_reference", "Demo video for the How-to-Make section.",
     [("file_type_options", '["Video"]')]),

    # Icon overrides — SVG / PNG
    ("PRODUCT", "custom", "hero_benefits_icons",    "Hero Benefits Icons",
     "list.file_reference",
     "Icons for the hero \"Why this kit\" 2x2 — same order as benefits_items.",
     [("file_type_options", '["Image"]'), ("max_list_size", "8")]),
    ("PRODUCT", "custom", "benefits_icons",         "Benefits Icons",
     "list.file_reference",
     "Icons for the Quick Benefits cards — same order as benefit blocks.",
     [("file_type_options", '["Image"]'), ("max_list_size", "8")]),
    ("PRODUCT", "custom", "trust_strip_icons",      "Trust Strip Icons",
     "list.file_reference",
     "Icons for the Trust Row — same order as trust_card blocks.",
     [("file_type_options", '["Image"]'), ("max_list_size", "8")]),

    # Repeatable structured content (metaobject lists) — overrides blocks
    ("PRODUCT", "custom", "featured_reviews",       "Featured Reviews",
     "list.metaobject_reference",
     "Per-product UGC reviews (kit_review metaobject).",
     []),  # validations injected at runtime once metaobject ID is known
    ("PRODUCT", "custom", "featured_faqs",          "Featured FAQs",
     "list.metaobject_reference",
     "Per-product FAQ items (kit_faq metaobject).",
     []),
    ("PRODUCT", "custom", "featured_steps",         "Featured Steps",
     "list.metaobject_reference",
     "Per-product How-to-Make steps (kit_step metaobject).",
     []),
    ("PRODUCT", "custom", "featured_components",    "Featured Components",
     "list.metaobject_reference",
     "Per-product What's-in-the-Box components (kit_component metaobject).",
     []),
]


# ============================================================
# 3. SPROUT-MAKER-ONLY METAFIELDS
# ============================================================
SPROUT_DEFS = [
    ("PRODUCT", "custom", "jar_capacity",         "Jar Capacity",
     "single_line_text_field",
     "Sprout-maker-specific capacity label (e.g. 700ml / 1000ml). Use `capacity` for other kits.",
     []),
    ("PRODUCT", "custom", "jar_size_chart_image", "Jar Size Chart Image",
     "file_reference",
     "Sprout-maker-specific size chart image. Use `size_chart_image` for other kits.",
     [("file_type_options", '["Image"]')]),
]


# ============================================================
# 4. VARIANT-LEVEL METAFIELDS — apply to every kit template
# ============================================================
VARIANT_DEFS = [
    ("PRODUCTVARIANT", "custom", "best_for", "Best For",
     "single_line_text_field",
     "Per-variant audience copy under the BEST FOR label inside each pack card.",
     []),
    ("PRODUCTVARIANT", "custom", "tag",      "Variant Tag",
     "single_line_text_field",
     "Optional badge above each variant card (e.g. TOP SELLER, BEST VALUE).",
     []),
]


# Map: metaobject metafield key → metaobject type
METAOBJECT_LINKS = {
    "featured_reviews":    "kit_review",
    "featured_faqs":       "kit_faq",
    "featured_steps":      "kit_step",
    "featured_components": "kit_component",
}


MAIN_GROUPS = {
    "shared":   SHARED_DEFS,
    "sprout":   SPROUT_DEFS,
    "variants": VARIANT_DEFS,
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
    print("\n=== Metaobject definitions ===")
    ok, fail, skip = 0, 0, 0
    for type_, name, desc, fields in METAOBJECTS:
        var = {
            "definition": {
                "type": type_,
                "name": name,
                "description": desc,
                "fieldDefinitions": [
                    {
                        "key": k,
                        "name": n,
                        "type": t,
                        "validations": [{"name": vn, "value": vv} for (vn, vv) in vals],
                    }
                    for (k, n, t, vals) in fields
                ],
            }
        }
        res = gql(CREATE_MO, var)
        errs = res.get("data", {}).get("metaobjectDefinitionCreate", {}).get("userErrors", [])
        top  = res.get("errors", [])
        label = type_.ljust(20)
        if top:
            print(f"  {label} TOP-LEVEL: {top}"); fail += 1
        elif errs and _err_already_exists(errs):
            print(f"  {label} SKIP (exists)"); skip += 1
        elif errs:
            print(f"  {label} ERROR: {errs}"); fail += 1
        else:
            print(f"  {label} CREATED"); ok += 1
    return ok, fail, skip


def create_metafields(defs, header):
    print(f"\n=== {header} ({len(defs)}) ===")
    ok, fail, skip = 0, 0, 0
    for owner, ns, key, name, type_, desc, validations in defs:
        validations = list(validations)  # copy
        # Inject metaobject_definition_id validation for metaobject_reference fields
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
        label = f"{owner.lower()}.{ns}.{key}".ljust(48)
        if top:
            print(f"  {label} TOP-LEVEL: {top}"); fail += 1
        elif errs and _err_already_exists(errs):
            print(f"  {label} SKIP (exists)"); skip += 1
        elif errs:
            msgs = " | ".join(e.get("message", "") for e in errs)
            print(f"  {label} ERROR: {msgs}"); fail += 1
        else:
            print(f"  {label} CREATED"); ok += 1
    return ok, fail, skip


def main():
    parser = argparse.ArgumentParser(description="Create GutBasket PDP metafield + metaobject definitions.")
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
        for i, n in enumerate(create_metaobjects()): totals[i] += n
    if args.scope in ("all", "shared"):
        for i, n in enumerate(create_metafields(SHARED_DEFS, "Shared product metafields")): totals[i] += n
    if args.scope in ("all", "sprout"):
        for i, n in enumerate(create_metafields(SPROUT_DEFS, "Sprout-maker metafields")): totals[i] += n
    if args.scope in ("all", "variants"):
        for i, n in enumerate(create_metafields(VARIANT_DEFS, "Variant-level metafields")): totals[i] += n

    print(f"\n{'='*60}")
    print(f"TOTAL: {totals[0]} created, {totals[2]} skipped, {totals[1]} failed")
    sys.exit(0 if totals[1] == 0 else 1)


if __name__ == "__main__":
    main()
