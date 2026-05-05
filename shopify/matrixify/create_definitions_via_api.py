#!/usr/bin/env python3
"""Creates all 17 metafield definitions (and the kit_review metaobject)
in your Shopify store via the Admin GraphQL API.

This bypasses Matrixify entirely — useful if Matrixify's definitions
import keeps failing.

SETUP (one-time)
================
1. In Shopify admin go to: Settings → Apps and sales channels → Develop apps
   (you may need to enable custom app development first).
2. Click "Create an app", give it a name like "Sprout Maker Setup".
3. Click "Configure Admin API scopes" and tick:
     - read_products, write_products
     - read_metaobjects, write_metaobjects
     - read_product_listings (optional)
   Save.
4. Click "Install app", then "Reveal token once" — copy the Admin API
   access token (starts with "shpat_...").

USAGE
=====
    SHOP_DOMAIN=ferment-jar.myshopify.com \\
    ADMIN_TOKEN=shpat_xxxxxxxxxxxx \\
    python3 create_definitions_via_api.py

The script is idempotent: existing definitions are skipped (Shopify
returns "TAKEN" and we ignore it).
"""
import json
import os
import sys
import urllib.request
import urllib.error

SHOP   = os.environ.get("SHOP_DOMAIN", "").strip()
TOKEN  = os.environ.get("ADMIN_TOKEN", "").strip()
API_VER = "2025-01"

if not SHOP or not TOKEN:
    sys.exit("Set SHOP_DOMAIN and ADMIN_TOKEN environment variables. See header for setup.")

URL = f"https://{SHOP}/admin/api/{API_VER}/graphql.json"

def gql(query, variables):
    req = urllib.request.Request(
        URL,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": TOKEN,
        },
        data=json.dumps({"query": query, "variables": variables}).encode("utf-8"),
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return {"errors": [{"message": f"HTTP {e.code}: {e.read().decode('utf-8', errors='replace')}"}]}

# ---------- Metaobject: kit_review ----------
KIT_REVIEW_MUTATION = """
mutation CreateKitReview($definition: MetaobjectDefinitionCreateInput!) {
  metaobjectDefinitionCreate(definition: $definition) {
    metaobjectDefinition { id type name }
    userErrors { field message code }
  }
}
"""

KIT_REVIEW_INPUT = {
    "definition": {
        "type": "kit_review",
        "name": "Kit Review",
        "description": "UGC review used on PDP.",
        "fieldDefinitions": [
            {"key": "photo", "name": "Photo", "type": "file_reference",
             "validations": [{"name": "file_type_options", "value": '["IMAGE"]'}]},
            {"key": "quote", "name": "Quote", "type": "single_line_text_field"},
            {"key": "name",  "name": "Name",  "type": "single_line_text_field"},
            {"key": "meta",  "name": "Meta",  "type": "single_line_text_field",
             "description": "e.g. \"28, Pune · First-time sprouter\""},
        ],
    }
}

# ---------- Metafield definitions ----------
MF_MUTATION = """
mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
  metafieldDefinitionCreate(definition: $definition) {
    createdDefinition { id namespace key name type { name } }
    userErrors { field message code }
  }
}
"""

DEFS = [
    # Product-level
    ("PRODUCT", "custom", "activity_items",         "Activity Items",          "list.single_line_text_field", "Hero activity row items. Each entry: \"<emoji>|<text>\"."),
    ("PRODUCT", "custom", "benefits_items",         "Benefits Items",          "list.single_line_text_field", "Hero \"Why this kit\" 2x2 benefits."),
    ("PRODUCT", "custom", "hero_trust_strip",       "Hero Trust Strip",        "list.single_line_text_field", "Short trust items shown below the ATC button."),
    ("PRODUCT", "custom", "jar_capacity",           "Jar Capacity",            "single_line_text_field",      "700ml or 1000ml."),
    ("PRODUCT", "custom", "help_note",              "Help Note",               "multi_line_text_field",       "Helper text beside the Jar Size Chart link."),
    ("PRODUCT", "custom", "jar_size_chart_image",   "Jar Size Chart Image",    "file_reference",              "Image inside the Jar Size Chart modal."),
    ("PRODUCT", "custom", "companion_size_product", "Companion Size Product",  "product_reference",           "The other capacity (700ml <-> 1L)."),
    ("PRODUCT", "custom", "cross_sell_products",    "Cross-sell Products",     "list.product_reference",      "Up to 3 products in Pair It With."),
    ("PRODUCT", "custom", "hero_benefits_icons",    "Hero Benefits Icons",     "list.file_reference",         "Icons for the hero 2x2 (parallel to benefits_items)."),
    ("PRODUCT", "custom", "benefits_icons",         "Benefits Icons",          "list.file_reference",         "Icons for the Quick Benefits 3-card section."),
    ("PRODUCT", "custom", "comparison_left_image",  "Comparison Left Image",   "file_reference",              "Comparison left card image (cloth method)."),
    ("PRODUCT", "custom", "comparison_right_image", "Comparison Right Image",  "file_reference",              "Comparison right card image (sprout maker)."),
    ("PRODUCT", "custom", "box_image",              "Box Image",               "file_reference",              "What's in the Box section image."),
    ("PRODUCT", "custom", "how_to_make_video",      "How to Make Video",       "file_reference",              "Demo video for How to Make section."),
    ("PRODUCT", "custom", "featured_reviews",       "Featured Reviews",        "list.metaobject_reference",   "Per-product UGC reviews. References kit_review metaobjects."),
    # Variant-level
    ("PRODUCTVARIANT", "custom", "best_for", "Best For",    "single_line_text_field", "Per-variant BEST FOR copy."),
    ("PRODUCTVARIANT", "custom", "tag",      "Variant Tag", "single_line_text_field", "Optional badge (e.g. TOP SELLER)."),
]

def create_metaobject_definition():
    print("\n=== Creating metaobject definition: kit_review ===")
    res = gql(KIT_REVIEW_MUTATION, KIT_REVIEW_INPUT)
    errs = res.get("data", {}).get("metaobjectDefinitionCreate", {}).get("userErrors", [])
    top  = res.get("errors", [])
    if top:
        print(f"  TOP-LEVEL ERROR: {top}")
        return False
    if errs:
        msgs = [e.get("message", "") for e in errs]
        if any("taken" in m.lower() or "already exists" in m.lower() for m in msgs):
            print("  SKIP: already exists")
            return True
        print(f"  ERRORS: {errs}")
        return False
    print("  CREATED")
    return True

def create_metafield_definitions():
    print("\n=== Creating metafield definitions ===")
    ok, fail, skip = 0, 0, 0
    # Look up the kit_review metaobject's definition ID for the featured_reviews validation
    kit_review_id = lookup_metaobject_definition_id("kit_review")

    for owner, ns, key, name, type_, desc in DEFS:
        validations = []
        # Restrict featured_reviews to the kit_review metaobject definition
        if key == "featured_reviews" and kit_review_id:
            validations.append({
                "name": "metaobject_definition_id",
                "value": kit_review_id,
            })
        # Restrict file_reference for image fields to images only
        if type_ in ("file_reference", "list.file_reference") and "video" not in key:
            validations.append({"name": "file_type_options", "value": '["Image"]'})
        if "video" in key:
            validations.append({"name": "file_type_options", "value": '["Video"]'})
        # Cap cross_sell_products at 3
        if key == "cross_sell_products":
            validations.append({"name": "max_list_size", "value": "3"})
        # Cap hero_benefits_icons at 4 to match benefits_items
        if key == "hero_benefits_icons":
            validations.append({"name": "max_list_size", "value": "4"})

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
                "validations": validations,
            }
        }
        res = gql(MF_MUTATION, var)
        errs = res.get("data", {}).get("metafieldDefinitionCreate", {}).get("userErrors", [])
        top  = res.get("errors", [])
        label = f"{owner.lower()}.{ns}.{key}".ljust(50)
        if top:
            print(f"  {label} TOP-LEVEL ERROR: {top}")
            fail += 1
        elif errs:
            msgs = " | ".join(e.get("message", "") for e in errs)
            if any("taken" in (e.get("code") or "").lower() or "exists" in (e.get("message") or "").lower() for e in errs):
                print(f"  {label} SKIP: already exists")
                skip += 1
            else:
                print(f"  {label} ERRORS: {msgs}")
                fail += 1
        else:
            print(f"  {label} CREATED")
            ok += 1

    print(f"\nSummary: {ok} created, {skip} skipped, {fail} failed")
    return fail == 0

def lookup_metaobject_definition_id(type_name):
    q = """
    query($type: String!) {
      metaobjectDefinitionByType(type: $type) { id }
    }
    """
    res = gql(q, {"type": type_name})
    return res.get("data", {}).get("metaobjectDefinitionByType", {}).get("id")

def main():
    print(f"Shop: {SHOP}")
    create_metaobject_definition()
    create_metafield_definitions()

if __name__ == "__main__":
    main()
