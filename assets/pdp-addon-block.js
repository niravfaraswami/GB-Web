/* =====================================================================
 * PDP Add-On Block · v2 — selection-only, batch-commit via main ATC
 * =====================================================================
 *
 * Behaviour
 *   - Tapping a row toggles its checkbox + selected state. NO AJAX
 *     fires on toggle — purely visual.
 *   - The main product ATC (and the universal sticky ATC) is the
 *     single cart-commit point. On click, every checked add-on is
 *     bundled with the selected variant and POSTed to /cart/add.js
 *     as a single items[] payload.
 *   - The main ATC's label updates dynamically with the selection
 *     count:
 *         0 selected → original button label (recorded on first run)
 *         1 selected → "ADD <PARENT> + 1 EXTRA"
 *         N selected → "ADD <PARENT> + N EXTRAS"
 *     The sticky bar mirrors this label.
 *
 * Analytics (window.dataLayer)
 *   - gb_addon_block_viewed     — viewport entry (≥ 50 % visible)
 *   - gb_addon_selected         — checkbox checked
 *   - gb_addon_deselected       — checkbox unchecked
 *   - gb_addon_batch_committed  — successful batch add via main ATC
 *   - gb_addon_add_failed       — AJAX failure during batch add
 * ===================================================================== */
(function () {
  'use strict';

  var STATE_SELECTED = 'selected';
  var baseLabels = new WeakMap();

  function getBlock() {
    return document.querySelector('[data-addon-block]');
  }
  function getCheckboxes() {
    return Array.prototype.slice.call(document.querySelectorAll('[data-addon-checkbox]'));
  }
  function getSelected() {
    return getCheckboxes().filter(function (cb) { return cb.checked; });
  }
  function getProductNameShort() {
    var block = getBlock();
    if (!block) return '';
    return (block.dataset.productNameShort || '').toUpperCase();
  }

  function recordBaseLabel(btn) {
    if (!baseLabels.has(btn)) {
      baseLabels.set(btn, (btn.textContent || '').trim());
    }
    return baseLabels.get(btn);
  }

  function computeDynamicLabel(count, name) {
    if (count === 0) return null; // signals "use base label"
    if (count === 1) return 'ADD ' + name + ' + 1 EXTRA';
    return 'ADD ' + name + ' + ' + count + ' EXTRAS';
  }

  function eachAtcButton(cb) {
    document.querySelectorAll('[data-atc], [data-gb-sticky-atc-trigger]').forEach(cb);
  }

  function updateLabels() {
    if (!getBlock()) return; // no addon block on this page — leave labels alone
    var count = getSelected().length;
    var name = getProductNameShort() || 'KIT';
    var dynamic = computeDynamicLabel(count, name);
    eachAtcButton(function (btn) {
      var baseLabel = recordBaseLabel(btn);
      // Don't trample mid-flight states like "Adding…" or "Sold out"
      if (btn.hasAttribute('disabled')) return;
      btn.textContent = dynamic || baseLabel;
    });
  }

  function readAddonRow(cb) {
    var row = cb.closest('.addon-row');
    if (!row) return null;
    return {
      cb: cb,
      row: row,
      variantId: parseInt(row.dataset.variantId, 10),
      addonId: row.dataset.addonId,
      pct: row.dataset.discountPct
    };
  }

  function pushAnalytics(eventName, payload) {
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push(Object.assign({ event: eventName }, payload || {}));
    }
  }

  /* ----- Checkbox change → row state + analytics + label refresh ----- */
  document.addEventListener('change', function (e) {
    var cb = e.target;
    if (!cb || !cb.matches || !cb.matches('[data-addon-checkbox]')) return;
    var info = readAddonRow(cb);
    if (!info) return;
    var block = getBlock();
    var parentId = block ? block.dataset.parentId : '';

    if (cb.checked) {
      info.row.classList.add(STATE_SELECTED);
      pushAnalytics('gb_addon_selected', {
        addon_product_id: info.addonId,
        parent_product_id: parentId,
        discount_pct: info.pct
      });
    } else {
      info.row.classList.remove(STATE_SELECTED);
      pushAnalytics('gb_addon_deselected', {
        addon_product_id: info.addonId,
        parent_product_id: parentId,
        discount_pct: info.pct
      });
    }

    updateLabels();
  });

  /* ----- Batch commit ----------------------------------------------- */

  function batchAdd(mainVariantId, btn) {
    var block = getBlock();
    var parentId = block ? block.dataset.parentId : '';
    var selectedInfo = getSelected().map(readAddonRow).filter(Boolean);

    var items = [{ id: mainVariantId, quantity: 1 }].concat(
      selectedInfo.map(function (info) {
        return {
          id: info.variantId,
          quantity: 1,
          properties: {
            '_source': 'pdp_addon_block',
            '_parent_product_id': parentId
          }
        };
      })
    );

    var originalLabel = btn ? btn.textContent : '';
    if (btn) {
      btn.setAttribute('disabled', 'disabled');
      btn.textContent = 'Adding…';
    }

    return fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ items: items })
    })
      .then(function (r) {
        if (!r.ok) {
          return r.json().catch(function () { return {}; }).then(function (err) {
            throw new Error(err.description || 'Add to cart failed');
          });
        }
        return r.json();
      })
      .then(function () {
        return fetch('/cart.js').then(function (r) { return r.json(); });
      })
      .then(function (cart) {
        document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart, bubbles: true }));

        if (window.GBCartDrawer && typeof window.GBCartDrawer.open === 'function') {
          window.GBCartDrawer.open();
        }

        pushAnalytics('gb_addon_batch_committed', {
          parent_product_id: parentId,
          addon_count: selectedInfo.length,
          addon_product_ids: selectedInfo.map(function (i) { return i.addonId; })
        });

        if (btn) {
          btn.removeAttribute('disabled');
          btn.textContent = originalLabel;
        }
      })
      .catch(function (err) {
        pushAnalytics('gb_addon_add_failed', {
          parent_product_id: parentId,
          addon_count: selectedInfo.length,
          reason: (err && err.message) || 'unknown'
        });
        if (btn) {
          btn.removeAttribute('disabled');
          btn.textContent = originalLabel;
        }
        if (window.console && window.console.warn) {
          window.console.warn('[addon-block] batch add failed:', err);
        }
      });
  }

  /* Capture-phase listener so we run BEFORE the form's native submit
     and BEFORE the sticky bar's own click handler. Only intercepts
     when at least one add-on is checked. */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-atc], [data-gb-sticky-atc-trigger]');
    if (!btn) return;
    if (btn.hasAttribute('disabled')) return;

    var selected = getSelected();
    if (selected.length === 0) return; // let the original handler run

    var isSticky = btn.matches('[data-gb-sticky-atc-trigger]');
    var mainVariantId;
    if (isSticky) {
      mainVariantId = parseInt(btn.dataset.variantId, 10);
    } else {
      var radio = document.querySelector('input[type="radio"][name="id"]:checked');
      if (radio) {
        mainVariantId = parseInt(radio.value, 10);
      } else {
        var hidden = document.querySelector('input[type="hidden"][name="id"]');
        if (hidden) mainVariantId = parseInt(hidden.value, 10);
      }
    }
    if (!mainVariantId) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    batchAdd(mainVariantId, btn);
  }, true);

  /* Also intercept the product form's submit event for the leo
     refactor (e.g. user hits Enter inside a form field). */
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form || form.id !== 'ferment-product-form') return;
    var selected = getSelected();
    if (selected.length === 0) return;

    var radio = form.querySelector('input[type="radio"][name="id"]:checked');
    var hidden = form.querySelector('input[type="hidden"][name="id"]');
    var mainVariantId = radio ? parseInt(radio.value, 10) : (hidden ? parseInt(hidden.value, 10) : null);
    if (!mainVariantId) return;

    e.preventDefault();
    var atcBtn = form.querySelector('[data-atc]');
    batchAdd(mainVariantId, atcBtn);
  }, true);

  /* ----- Impression tracking (one event per block per page load) ---- */
  function setupImpressionTracking() {
    document.querySelectorAll('[data-addon-block]').forEach(function (block) {
      if (block.dataset.impressionBound === '1') return;
      block.dataset.impressionBound = '1';

      if (!('IntersectionObserver' in window)) {
        pushAnalytics('gb_addon_block_viewed', {
          parent_product_id: block.dataset.parentId,
          addon_count: block.querySelectorAll('.addon-row').length
        });
        return;
      }
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

  function init() {
    setupImpressionTracking();
    updateLabels();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('shopify:section:load', init);
})();
