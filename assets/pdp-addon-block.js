/* =====================================================================
 * PDP Add-On Block · silent-add, lock-on-success.
 * One row per add-on. Tap "+ Add" → optimistic UI flips, AJAX add fires,
 * row locks into "Added" state. Failure rolls UI back and logs an
 * analytics event. No drawer open, no toast — quiet by design.
 * ===================================================================== */
(function () {
  'use strict';

  // Listen on document so blocks injected by section reloads (Shopify
  // theme editor) still bind. Selector below resolves the nearest block.
  document.addEventListener('click', function (event) {
    var btn = event.target.closest('[data-add-button]');
    if (!btn) return;

    var row = btn.closest('.addon-row');
    if (!row) return;
    var block = row.closest('[data-addon-block]');
    if (!block) return;

    // Guard: already selected, disabled, or in-flight
    if (
      row.classList.contains('selected') ||
      row.classList.contains('disabled') ||
      btn.dataset.inFlight === '1'
    ) {
      return;
    }

    var variantId = row.dataset.variantId;
    var addonId = row.dataset.addonId;
    var pct = row.dataset.discountPct;
    var parentId = block.dataset.parentId;
    if (!variantId) return;

    btn.dataset.inFlight = '1';
    btn.setAttribute('aria-busy', 'true');

    // Optimistic UI — flip visual before the network completes
    row.classList.add('selected');
    var labelEl = btn.querySelector('.label-txt');
    if (labelEl) labelEl.textContent = 'Added';

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        items: [{
          id: parseInt(variantId, 10),
          quantity: 1,
          properties: {
            '_source': 'pdp_addon_block',
            '_parent_product_id': parentId
          }
        }]
      })
    })
      .then(function (resp) {
        if (!resp.ok) {
          return resp.json().catch(function () { return {}; }).then(function (err) {
            throw new Error(err.description || 'Add to cart failed');
          });
        }
        return resp.json();
      })
      .then(function () {
        // Refresh cart state so the header badge / drawer can update
        return fetch('/cart.js').then(function (r) { return r.json(); });
      })
      .then(function (cart) {
        document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart, bubbles: true }));

        pushAnalytics('gb_addon_added', {
          addon_product_id: addonId,
          variant_id: variantId,
          parent_product_id: parentId,
          discount_pct: pct,
          source: 'pdp_addon_block'
        });

        // Lock permanently — the .selected guard at the top prevents
        // any further clicks from triggering another add.
        btn.dataset.inFlight = '';
        btn.removeAttribute('aria-busy');
      })
      .catch(function (err) {
        // Rollback UI
        row.classList.remove('selected');
        if (labelEl) labelEl.textContent = 'Add';
        btn.dataset.inFlight = '';
        btn.removeAttribute('aria-busy');

        pushAnalytics('gb_addon_add_failed', {
          addon_product_id: addonId,
          variant_id: variantId,
          parent_product_id: parentId,
          reason: (err && err.message) || 'unknown'
        });

        if (window.console && window.console.warn) {
          window.console.warn('[addon-block] add failed:', err);
        }
      });
  });

  // Impression tracking: one event per block on first 50% visibility
  function setupImpressionTracking() {
    document.querySelectorAll('[data-addon-block]').forEach(function (block) {
      if (block.dataset.impressionBound === '1') return;
      block.dataset.impressionBound = '1';

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            pushAnalytics('gb_addon_block_viewed', {
              parent_product_id: block.dataset.parentId,
              addon_count: block.querySelectorAll('.addon-row').length
            });
            observer.disconnect();
          }
        });
      }, { threshold: 0.5 });
      observer.observe(block);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupImpressionTracking);
  } else {
    setupImpressionTracking();
  }
  document.addEventListener('shopify:section:load', setupImpressionTracking);

  function pushAnalytics(eventName, payload) {
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push(Object.assign({ event: eventName }, payload || {}));
    }
  }
})();
