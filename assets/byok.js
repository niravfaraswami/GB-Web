/* =========================================================
   GutBasket · Build Your Own Kit (v2)
   ---------------------------------------------------------
   Vanilla JS, scoped to #byok-page. Drives selection,
   per-ferment batch chips, kit-color cascade, summary
   render, and atomic /cart/add.js submit.

   Talks to the cart drawer via:
     window.GBCartDrawer.open()
     document.dispatchEvent(new CustomEvent('cart:update', {...}))

   Analytics: §15 event names are scaffolded as TODO comments
   at the right call sites — no dataLayer pushes yet.
   ========================================================= */
(function () {
  'use strict';

  var root = document.getElementById('byok-page');
  if (!root) return;

  /* -----------------------------------------------------------------
   * DATA — emitted server-side from the section's <script id="byok-data">
   * ----------------------------------------------------------------- */
  var BYOK_DATA = {};
  try {
    var dataEl = root.querySelector('#byok-data');
    if (dataEl) BYOK_DATA = JSON.parse(dataEl.textContent);
  } catch (err) {
    console.error('[byok] failed to parse #byok-data', err);
  }
  var FERMENT_DATA = (BYOK_DATA && BYOK_DATA.ferments) || {};
  var FREE_SHIPPING_THRESHOLD = (BYOK_DATA && BYOK_DATA.freeShippingThreshold) || 30000; // paise

  // Kit-color cascade map. Adding a new ferment color requires:
  //   1. Adding the token to byok.css under #byok-page (--kanji etc.)
  //   2. Adding a one-line entry here.
  var KIT_COLOR_MAP = {
    'kanji':     { main: '#8B1F40', dark: '#6B1631', soft: '#F4D8E1' },
    'aam-panna': { main: '#DDA738', dark: '#A67D27', soft: '#FAEFCB' },
    'achaar':    { main: '#FF7300', dark: '#E66800', soft: '#FFE4D1' },
    'kimchi':    { main: '#E85C41', dark: '#B23A23', soft: '#FBDED6' }
  };
  var DEFAULT_KIT = { main: '#FF7300', dark: '#E66800', soft: '#FFE4D1', em: '#8B1F40' };

  /* -----------------------------------------------------------------
   * STATE — single source of truth. All renders are pure functions of this.
   * ----------------------------------------------------------------- */
  var state = {
    jars:     [], // [{ id, handle, variantId, label, price, was }]
    ferments: [], // [{ id, name, color, batch: { id, handle, variantId, label, price, was } }]
    tools:    [], // [{ id, handle, variantId, label, price, was }]
    books:    []  // [{ id, handle, variantId, label, price, was }]
  };

  // Tracks last free-shipping side so we can fire the crossing event once.
  var lastFreeShipDir = null;

  /* -----------------------------------------------------------------
   * UTILS
   * ----------------------------------------------------------------- */
  function $(sel, ctx) { return (ctx || root).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || root).querySelectorAll(sel)); }

  // Prices are stored in paise (Shopify's minor unit). Show in rupees with INR grouping.
  function fmtMoney(paise) {
    var rupees = Math.round((paise || 0) / 100);
    return '₹' + rupees.toLocaleString('en-IN');
  }

  function toInt(v) { var n = parseInt(v, 10); return isNaN(n) ? 0 : n; }

  /* -----------------------------------------------------------------
   * KIT-COLOR CASCADE
   * Scoped to #byok-page (NOT document.documentElement) so the cascade
   * cannot leak into the cart drawer or any other page chrome.
   * ----------------------------------------------------------------- */
  function applyKitColor(token) {
    var c = (token && KIT_COLOR_MAP[token]) ? KIT_COLOR_MAP[token] : null;
    var main = c ? c.main : DEFAULT_KIT.main;
    var dark = c ? c.dark : DEFAULT_KIT.dark;
    var soft = c ? c.soft : DEFAULT_KIT.soft;
    root.style.setProperty('--kit-color', main);
    root.style.setProperty('--kit-color-dark', dark);
    root.style.setProperty('--kit-color-soft', soft);
    var em = $('.page-h1 em', root);
    if (em) em.style.color = c ? c.main : DEFAULT_KIT.em;
    /* TODO(v2 analytics): byok_kit_color_cascade { from_color, to_color, trigger_ferment } */
  }

  /* -----------------------------------------------------------------
   * TILE CLICK — uniform multi-select toggle across all groups.
   * For ferment tiles, defers to handleFermentToggle (chip data required).
   * ----------------------------------------------------------------- */
  $$('.tiles').forEach(function (grid) {
    var group = grid.getAttribute('data-group');
    grid.addEventListener('click', function (e) {
      var tile = e.target.closest('.tile');
      if (!tile || !grid.contains(tile)) return;

      var id = tile.getAttribute('data-id');
      var wasSelected = tile.classList.contains('is-selected');

      if (group === 'jar')    return handleSimpleToggle(tile, wasSelected, 'jars');
      if (group === 'tools')  return handleSimpleToggle(tile, wasSelected, 'tools', true);
      if (group === 'books')  return handleSimpleToggle(tile, wasSelected, 'books');
      if (group === 'ferment') return handleFermentToggle(tile, wasSelected);
    });
  });

  function handleSimpleToggle(tile, wasSelected, key, isTools) {
    tile.classList.toggle('is-selected');
    tile.setAttribute('aria-pressed', wasSelected ? 'false' : 'true');
    var id = tile.getAttribute('data-id');

    if (wasSelected) {
      state[key] = state[key].filter(function (x) { return x.id !== id; });
      /* TODO(v2 analytics): byok_tile_deselect { section_id, product_id } */
    } else {
      state[key].push({
        id: id,
        handle: tile.getAttribute('data-handle'),
        variantId: toInt(tile.getAttribute('data-variant-id')),
        label: tile.getAttribute('data-label'),
        price: toInt(tile.getAttribute('data-price')),
        was:   toInt(tile.getAttribute('data-was'))
      });
      /* TODO(v2 analytics): byok_tile_select { section_id, product_id, display_title } */
    }

    if (isTools) {
      var hint = $('#hint-veg');
      if (hint) {
        var hasWeight = state.tools.some(function (t) { return t.handle === 'a-glass-weight'; });
        hint.classList.toggle('is-shown', hasWeight);
      }
    }
    renderSummary();
  }

  function handleFermentToggle(tile, wasSelected) {
    var fermentId = tile.getAttribute('data-ferment');
    var data = FERMENT_DATA[fermentId];
    if (!data || !data.chips || data.chips.length === 0) {
      // No purchasable chips → tile is functionally disabled. Bail silently.
      return;
    }

    tile.classList.toggle('is-selected');
    tile.setAttribute('aria-pressed', wasSelected ? 'false' : 'true');

    if (wasSelected) {
      state.ferments = state.ferments.filter(function (f) { return f.id !== fermentId; });
      /* TODO(v2 analytics): byok_tile_deselect { section_id: 'ferment', product_id: fermentId } */
      // Cascade falls back to remaining most-recent, or default.
      var last = state.ferments[state.ferments.length - 1];
      applyKitColor(last ? last.color : null);
    } else {
      // Default-pick smallest (first) batch chip for friction-less flow.
      var defaultChip = data.chips[0];
      state.ferments.push({
        id: fermentId,
        name: data.name,
        color: data.color,
        batch: {
          id: defaultChip.id,
          handle: defaultChip.handle,
          variantId: defaultChip.variantId,
          label: defaultChip.label,
          price: defaultChip.price,
          was:   defaultChip.was
        }
      });
      /* TODO(v2 analytics): byok_tile_select { section_id: 'ferment', product_id: fermentId, display_title: data.name } */
      applyKitColor(data.color);
    }

    renderSelectedFerments();
    renderSummary();
  }

  /* -----------------------------------------------------------------
   * PER-FERMENT BATCH PICKER STACK
   * ----------------------------------------------------------------- */
  function renderSelectedFerments() {
    var wrap = $('#selected-ferments');
    if (!wrap) return;
    wrap.innerHTML = '';

    if (state.ferments.length === 0) {
      wrap.classList.remove('is-shown');
      return;
    }
    wrap.classList.add('is-shown');

    state.ferments.forEach(function (f) {
      var data = FERMENT_DATA[f.id];
      if (!data) return;

      var row = document.createElement('div');
      row.className = 'sf-row';
      row.setAttribute('data-ferment-id', f.id);

      var head = document.createElement('div');
      head.className = 'sf-head';

      var dot = document.createElement('span');
      dot.className = 'sf-dot';
      dot.style.background = 'var(--' + f.color + ')';
      var name = document.createElement('span');
      name.className = 'sf-name';
      name.textContent = f.name;
      var price = document.createElement('span');
      price.className = 'sf-price';
      price.textContent = fmtMoney(f.batch.price);

      head.appendChild(dot);
      head.appendChild(name);
      head.appendChild(price);
      row.appendChild(head);

      var chips = document.createElement('div');
      chips.className = 'batch-chips';

      data.chips.forEach(function (c) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'batch-chip';
        btn.setAttribute('data-chip-id', c.id);
        if (f.batch.id === c.id) btn.classList.add('is-selected');
        btn.innerHTML = c.label + '<span class="chip-price">' + fmtMoney(c.price) + '</span>';
        btn.addEventListener('click', function () {
          if (f.batch.id === c.id) return;
          var fromChip = f.batch.id;
          f.batch = {
            id: c.id,
            handle: c.handle,
            variantId: c.variantId,
            label: c.label,
            price: c.price,
            was: c.was
          };
          /* TODO(v2 analytics): byok_chip_change { ferment_id: f.id, from_chip: fromChip, to_chip: c.id } */
          renderSelectedFerments();
          renderSummary();
        });
        chips.appendChild(btn);
      });

      row.appendChild(chips);
      wrap.appendChild(row);
    });
  }

  /* -----------------------------------------------------------------
   * SUMMARY / SIDEBAR / MOBILE BAR
   * ----------------------------------------------------------------- */
  function renderSummary() {
    // ----- Jars -----
    fillBundleSlot('jar', '#bs-jar', state.jars, function (j) { return j.label; });
    // ----- Ferments -----
    var fermentItem = $('[data-slot="ferment"]');
    if (state.ferments.length) {
      var fTotal = state.ferments.reduce(function (a, f) { return a + (f.batch ? f.batch.price : 0); }, 0);
      var lines = state.ferments.map(function (f) {
        return escapeHtml(f.name) + ' &middot; ' + escapeHtml(f.batch.label);
      }).join('<br>');
      fermentItem.classList.add('is-filled');
      $('.bi-val', fermentItem).innerHTML =
        state.ferments.length + ' ferment' + (state.ferments.length > 1 ? 's' : '') +
        '<span class="bi-val-multi">' + lines + '</span>';
      $('.bi-price', fermentItem).textContent = fmtMoney(fTotal);
    } else {
      fermentItem.classList.remove('is-filled');
      $('.bi-val', fermentItem).textContent = 'No selection yet';
      $('.bi-price', fermentItem).textContent = '—';
    }
    $('#bs-ferment').classList.toggle('is-done', state.ferments.length > 0);

    // ----- Tools -----
    fillBundleSlot('tools', '#bs-tools', state.tools, function (t) { return t.label; });
    // ----- Books -----
    fillBundleSlot('books', '#bs-book', state.books, function (b) { return b.label; });

    // ----- Totals -----
    var total =
        state.jars.reduce(sumPrice, 0)
      + state.ferments.reduce(function (a, f) { return a + (f.batch ? f.batch.price : 0); }, 0)
      + state.tools.reduce(sumPrice, 0)
      + state.books.reduce(sumPrice, 0);

    var itemCount = state.jars.length + state.ferments.length + state.tools.length + state.books.length;

    $('#bt-amount').textContent = fmtMoney(total);

    // ----- Savings -----
    var comp = 0, anyComp = false;
    state.jars.forEach(function (j)  { if (j.was && j.was > j.price) { comp += j.was; anyComp = true; } else { comp += j.price; } });
    state.ferments.forEach(function (f) {
      if (!f.batch) return;
      if (f.batch.was && f.batch.was > f.batch.price) { comp += f.batch.was; anyComp = true; }
      else comp += f.batch.price;
    });
    state.tools.forEach(function (t) { if (t.was && t.was > t.price) { comp += t.was; anyComp = true; } else { comp += t.price; } });
    state.books.forEach(function (b) { if (b.was && b.was > b.price) { comp += b.was; anyComp = true; } else { comp += b.price; } });
    var savings = comp - total;
    var sEl = $('#bt-savings');
    if (sEl) {
      if (anyComp && savings > 0) {
        sEl.textContent = 'You save ' + fmtMoney(savings);
        sEl.hidden = false;
      } else {
        sEl.hidden = true;
      }
    }

    // ----- CTA + fineprint -----
    var cta = $('#bundle-cta');
    var fp  = $('#bundle-fineprint');
    if (fp) fp.classList.remove('is-error');
    if (itemCount === 0) {
      if (cta) { cta.disabled = true; cta.textContent = 'Add bundle to cart →'; }
      if (fp)  fp.innerHTML = 'Add at least one item to continue.';
    } else {
      if (cta) {
        cta.disabled = false;
        cta.textContent = 'Add ' + itemCount + ' item' + (itemCount > 1 ? 's' : '') + ' to cart →';
      }
      if (fp) {
        fp.innerHTML = (total >= FREE_SHIPPING_THRESHOLD)
          ? '<strong>✓ Free shipping</strong> · Ships next working day'
          : 'Add ' + fmtMoney(FREE_SHIPPING_THRESHOLD - total) + ' more for free shipping';
      }
    }

    // ----- Free-shipping crossing analytics -----
    var dir = total >= FREE_SHIPPING_THRESHOLD ? 'over' : 'under';
    if (lastFreeShipDir !== null && lastFreeShipDir !== dir) {
      /* TODO(v2 analytics): byok_freeship_crossed { direction: dir === 'over' ? 'up' : 'down', total } */
    }
    lastFreeShipDir = dir;

    // ----- Mobile bar -----
    var mbCount = $('#mb-count');
    var mbTotal = $('#mb-total');
    var mbCta   = $('#mb-cta');
    if (mbCount) mbCount.textContent = itemCount === 0 ? 'No items yet' : (itemCount + ' item' + (itemCount > 1 ? 's' : '') + ' · ');
    if (mbTotal) mbTotal.textContent = itemCount === 0 ? '' : fmtMoney(total);
    if (mbCta)   {
      mbCta.disabled = itemCount === 0;
      mbCta.textContent = itemCount === 0 ? 'Add to cart' : ('Add ' + itemCount + ' →');
    }
  }

  function sumPrice(a, b) { return a + (b.price || 0); }

  function fillBundleSlot(slotName, sectionSel, list, labelFn) {
    var item = $('[data-slot="' + slotName + '"]');
    if (!item) return;
    if (list.length) {
      var total = list.reduce(sumPrice, 0);
      var names = list.map(function (x) { return escapeHtml(labelFn(x)); }).join(', ');
      item.classList.add('is-filled');
      var noun = (slotName === 'tools') ? 'item' : (slotName === 'books') ? 'book' : 'jar';
      $('.bi-val', item).innerHTML =
        list.length + ' ' + noun + (list.length > 1 ? 's' : '') +
        '<span class="bi-val-multi">' + names + '</span>';
      $('.bi-price', item).textContent = fmtMoney(total);
    } else {
      item.classList.remove('is-filled');
      $('.bi-val', item).textContent = 'No selection yet';
      $('.bi-price', item).textContent = '—';
    }
    var sectionEl = $(sectionSel);
    if (sectionEl) sectionEl.classList.toggle('is-done', list.length > 0);
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* -----------------------------------------------------------------
   * "MORE" EXPANDERS
   * ----------------------------------------------------------------- */
  $$('.more-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-more');
      var target = $('[data-more-content="' + key + '"]');
      if (!target) return;
      var open = target.classList.toggle('is-shown');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open
        ? btn.textContent.replace('+', '−')
        : btn.textContent.replace('−', '+');
      if (open) {
        /* TODO(v2 analytics): byok_more_open { section_id: key } */
      }
    });
  });

  /* -----------------------------------------------------------------
   * RESET
   * ----------------------------------------------------------------- */
  var resetBtn = $('#reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      var prevCount = state.jars.length + state.ferments.length + state.tools.length + state.books.length;
      state = { jars: [], ferments: [], tools: [], books: [] };
      $$('.tile').forEach(function (t) {
        t.classList.remove('is-selected');
        t.setAttribute('aria-pressed', 'false');
      });
      var sf = $('#selected-ferments');
      if (sf) { sf.classList.remove('is-shown'); sf.innerHTML = ''; }
      var hint = $('#hint-veg');
      if (hint) hint.classList.remove('is-shown');
      applyKitColor(null);
      lastFreeShipDir = null;
      renderSummary();
      /* TODO(v2 analytics): byok_reset { items_at_reset: prevCount } */
    });
  }

  /* -----------------------------------------------------------------
   * ADD TO CART — atomic /cart/add.js with bundle-id grouping property
   * ----------------------------------------------------------------- */
  function buildBundleItems() {
    var bundleId = 'byok-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    var props = { '_byok_bundle_id': bundleId };
    var items = [];
    state.jars.forEach(function (j)  { if (j.variantId) items.push({ id: j.variantId, quantity: 1, properties: props }); });
    state.ferments.forEach(function (f) { if (f.batch && f.batch.variantId) items.push({ id: f.batch.variantId, quantity: 1, properties: props }); });
    state.tools.forEach(function (t) { if (t.variantId) items.push({ id: t.variantId, quantity: 1, properties: props }); });
    state.books.forEach(function (b) { if (b.variantId) items.push({ id: b.variantId, quantity: 1, properties: props }); });
    return { bundleId: bundleId, items: items, props: props };
  }

  function submitBundle(triggerBtn) {
    var build = buildBundleItems();
    if (build.items.length === 0) return;

    /* TODO(v2 analytics): byok_cta_click { item_count, total, savings } */

    var originalLabel = triggerBtn ? triggerBtn.textContent : '';
    var fp = $('#bundle-fineprint');
    var ctas = [$('#bundle-cta'), $('#mb-cta')].filter(Boolean);
    ctas.forEach(function (b) { b.disabled = true; });
    if (triggerBtn) triggerBtn.textContent = 'Adding…';
    if (fp) fp.classList.remove('is-error');

    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({ items: build.items })
    })
      .then(function (res) {
        if (!res.ok) {
          return res.json().then(function (err) { throw err; }, function () { throw { status: res.status, description: 'Cart error (' + res.status + ')' }; });
        }
        return res.json();
      })
      .then(function () {
        return fetch('/cart.js', { headers: { 'Accept': 'application/json' } }).then(function (r) { return r.json(); });
      })
      .then(function (cart) {
        /* TODO(v2 analytics): byok_cart_add_success { bundle_id, item_count, total } */
        if (window.GBCartDrawer && typeof window.GBCartDrawer.open === 'function') {
          window.GBCartDrawer.open();
        }
        document.dispatchEvent(new CustomEvent('cart:update', {
          detail: { resource: cart, sourceId: 'byok' }
        }));
        // Re-enable CTAs; renderSummary will reset their labels accurately.
        ctas.forEach(function (b) { b.disabled = false; });
        if (triggerBtn) triggerBtn.textContent = originalLabel;
      })
      .catch(function (err) {
        /* TODO(v2 analytics): byok_cart_add_fail { bundle_id, error_code, error_message } */
        console.error('[byok] add to cart failed', err);
        ctas.forEach(function (b) { b.disabled = false; });
        if (triggerBtn) triggerBtn.textContent = originalLabel;
        if (fp) {
          var msg = (err && (err.description || err.message)) || 'Couldn’t add bundle. Please try again.';
          fp.textContent = msg;
          fp.classList.add('is-error');
        }
      });
  }

  var bundleCta = $('#bundle-cta');
  if (bundleCta) bundleCta.addEventListener('click', function () { submitBundle(bundleCta); });
  var mobileCta = $('#mb-cta');
  if (mobileCta) mobileCta.addEventListener('click', function () { submitBundle(mobileCta); });

  /* -----------------------------------------------------------------
   * INIT
   * ----------------------------------------------------------------- */
  applyKitColor(null);
  renderSummary();
  /* TODO(v2 analytics): byok_page_view */
})();
