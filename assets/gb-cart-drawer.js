/* ============================================================
   GUTBASKET CART DRAWER · v1
   Vanilla JS · AJAX Cart API · scoped under window.GBCartDrawer
   ============================================================ */
(function() {
  'use strict';

  var root = document.getElementById('gb-cart-drawer');
  if (!root) return;

  var cfgEl = document.getElementById('gb-cart-drawer-config');
  var cfg = {};
  try { cfg = cfgEl ? JSON.parse(cfgEl.textContent) : {}; } catch (e) { cfg = {}; }

  var state = {
    cart: null,
    isOpen: false,
    lastUnlockedCount: 0,
    lastRemovedLine: null,
    moneyFormat: cfg.money_format || '₹{{amount}}',
    cartVersion: 0  // bumped on every local mutation or authoritative cart write; stale fetches check against this and bail.
  };

  function bumpVersion() { state.cartVersion++; }

  // ---------- Money formatting ----------
  function money(cents) {
    if (cents == null) return '';
    var amount = (cents / 100);
    var rounded = Math.round(amount * 100) / 100;
    var hasDecimals = rounded % 1 !== 0;
    var parts = hasDecimals ? rounded.toFixed(2).split('.') : [String(Math.round(rounded))];
    parts[0] = parts[0].replace(/\B(?=(\d{2})+(\d{1})$)/g, ',');
    var amountStr = parts.join('.');
    return state.moneyFormat.replace(/\{\{\s*amount\s*\}\}/, amountStr).replace(/\{\{\s*amount_no_decimals\s*\}\}/, parts[0]);
  }

  function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, function(c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function img(src, width) {
    if (!src) return '';
    if (src.indexOf('?') > -1) return src;
    return src.replace(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i, '_' + (width || 200) + 'x.$1$2');
  }

  // ---------- API ----------
  function fetchCart() {
    return fetch('/cart.js', { headers: { 'Accept': 'application/json' } }).then(function(r) { return r.json(); });
  }

  function changeLine(key, qty) {
    return fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ id: key, quantity: qty })
    }).then(function(r) { return r.json(); });
  }

  function addLine(id, quantity, properties) {
    var body = { id: id, quantity: quantity || 1 };
    if (properties) body.properties = properties;
    return fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body)
    }).then(function(r) {
      if (!r.ok) return r.json().then(function(e) { return Promise.reject(e); });
      return r.json();
    });
  }

  function applyDiscount(code) {
    return fetch('/discount/' + encodeURIComponent(code), {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin'
    });
  }

  // ---------- Render ----------
  function render() {
    var cart = state.cart;
    if (!cart) return;
    document.documentElement.style.setProperty('--gb-cart-count', cart.item_count);

    root.querySelector('[data-gbcd-count]').textContent = cart.item_count;
    root.querySelector('[data-gbcd-subtotal]').textContent = money(cart.total_price);

    var savings = 0;
    cart.items.forEach(function(it) {
      if (it.original_line_price > it.final_line_price) {
        savings += (it.original_line_price - it.final_line_price);
      }
    });
    var savedEl = root.querySelector('[data-gbcd-saved]');
    if (savings > 0) { savedEl.style.display = ''; savedEl.textContent = 'You save ' + money(savings); }
    else { savedEl.style.display = 'none'; }

    renderItems(cart);
    if (cfg.show_progress) renderProgress(cart);
    if (cfg.show_addons) renderAddons(cart);
    if (cfg.show_upsell) renderUpsell(cart);
    applyKitColor(cart);

    var isEmpty = cart.item_count === 0;
    root.querySelector('[data-gbcd-content]').style.display = isEmpty ? 'none' : '';
    root.querySelector('[data-gbcd-empty]').style.display = isEmpty ? '' : 'none';
    root.querySelector('[data-gbcd-foot]').style.display = isEmpty ? 'none' : '';
  }

  function renderItems(cart) {
    var host = root.querySelector('[data-gbcd-items]');
    if (!host) return;
    host.innerHTML = cart.items.map(function(it) {
      var compare = '';
      if (it.original_price > it.final_price) {
        compare = '<span class="gbcd-item-compare">' + money(it.original_price) + '</span>';
      }
      var isGift = it.properties && (it.properties._gift === 'true' || it.properties._gift === true);
      var giftBadge = isGift ? '<span class="gbcd-item-gift">🎁 Free Gift</span>' : '';
      var variantLine = (it.variant_title && it.variant_title !== 'Default Title') ?
        '<div class="gbcd-item-variant">' + escapeHtml(it.variant_title) + '</div>' : '';
      var disableMinus = isGift || it.quantity <= 1;
      var disableAll = isGift;
      return '' +
        '<div class="gbcd-item" data-line-key="' + escapeHtml(it.key) + '">' +
          '<div class="gbcd-item-img">' +
            (it.image ? '<img loading="lazy" src="' + escapeHtml(img(it.image, 200)) + '" alt="">' : '🫙') +
          '</div>' +
          '<div class="gbcd-item-info">' +
            (it.product_type ? '<div class="gbcd-item-eyebrow">' + escapeHtml(it.product_type) + '</div>' : '') +
            '<a class="gbcd-item-name" href="' + escapeHtml(it.url) + '">' + escapeHtml(it.product_title) + '</a>' +
            variantLine +
            giftBadge +
            '<div class="gbcd-item-row">' +
              '<div class="gbcd-qty">' +
                '<button type="button" data-gbcd-qty="' + (it.quantity - 1) + '" ' + (disableAll || disableMinus ? 'disabled' : '') + '>−</button>' +
                '<span class="gbcd-qty-val">' + it.quantity + '</span>' +
                '<button type="button" data-gbcd-qty="' + (it.quantity + 1) + '" ' + (disableAll ? 'disabled' : '') + '>+</button>' +
              '</div>' +
              '<div class="gbcd-item-price">' + money(it.final_line_price) + compare + '</div>' +
            '</div>' +
          '</div>' +
          (disableAll ? '' : '<button type="button" class="gbcd-item-remove" data-gbcd-remove>Remove</button>') +
        '</div>';
    }).join('');
  }

  function renderProgress(cart) {
    var tiers = (cfg.tiers || []).slice().sort(function(a, b) { return a.threshold - b.threshold; });
    if (tiers.length === 0) {
      root.querySelector('[data-gbcd-progress]').style.display = 'none';
      return;
    }
    root.querySelector('[data-gbcd-progress]').style.display = '';

    var totalCents = cart.total_price;
    var subtotalInr = totalCents / 100;
    var maxThreshold = tiers[tiers.length - 1].threshold;
    var pct = Math.min(100, (subtotalInr / maxThreshold) * 100);
    root.querySelector('[data-gbcd-progress-fill]').style.width = pct + '%';

    var unlockedCount = 0;
    var nextTier = null;
    var pinsHtml = tiers.map(function(t, idx) {
      var unlocked = subtotalInr >= t.threshold;
      if (unlocked) unlockedCount++;
      if (!unlocked && !nextTier) nextTier = t;
      var justClass = '';
      if (unlocked && idx >= state.lastUnlockedCount) justClass = ' just-unlocked';
      return '<div class="gbcd-pin' + (unlocked ? ' unlocked' : '') + justClass + '">' +
        '<span class="gbcd-pin-icon">' + escapeHtml(t.icon || '🎁') + '</span>' +
        escapeHtml(t.label || ('₹' + t.threshold)) +
      '</div>';
    }).join('');
    root.querySelector('[data-gbcd-progress-pins]').innerHTML = pinsHtml;

    var msgEl = root.querySelector('[data-gbcd-progress-message]');
    if (nextTier) {
      var remain = Math.max(0, Math.ceil(nextTier.threshold - subtotalInr));
      msgEl.innerHTML = 'Add <strong>₹' + remain.toLocaleString('en-IN') + '</strong> more for ' + escapeHtml(nextTier.label || 'next reward');
    } else if (unlockedCount > 0) {
      msgEl.innerHTML = '<strong>All rewards unlocked!</strong> 🎉';
    } else {
      msgEl.innerHTML = '';
    }
    state.lastUnlockedCount = unlockedCount;

    if (cfg.free_gift_enabled) maybeManageFreeGift(cart, tiers, subtotalInr);
  }

  function maybeManageFreeGift(cart, tiers, subtotalInr) {
    var giftTiers = tiers.filter(function(t) { return t.type === 'free_gift' && t.variant_id; });
    if (giftTiers.length === 0) return;
    giftTiers.forEach(function(t) {
      var unlocked = subtotalInr >= t.threshold;
      var existing = cart.items.find(function(it) {
        return it.variant_id === t.variant_id && it.properties && (it.properties._gift === 'true' || it.properties._gift === true);
      });
      if (unlocked && !existing) {
        addLine(t.variant_id, 1, { _gift: 'true', _tier: t.label || ('tier-' + t.threshold) })
          .then(function() { return fetchCart(); })
          .then(function(c) { state.cart = c; bumpVersion(); render(); })
          .catch(function() {});
      } else if (!unlocked && existing) {
        changeLine(existing.key, 0)
          .then(function(c) { state.cart = c; bumpVersion(); render(); })
          .catch(function() {});
      }
    });
  }

  function renderAddons(cart) {
    var host = root.querySelector('[data-gbcd-addons]');
    if (!host) return;
    if (cart.item_count === 0) { host.style.display = 'none'; return; }

    var candidates = (cfg.addon_candidates || []).slice();
    var inCartIds = {};
    cart.items.forEach(function(it) { inCartIds[it.product_id] = true; });
    var filtered = candidates.filter(function(p) { return !inCartIds[p.id]; }).slice(0, 6);

    if (filtered.length === 0) { host.style.display = 'none'; return; }
    host.style.display = '';
    root.querySelector('[data-gbcd-addons-list]').innerHTML = filtered.map(function(p) {
      return '' +
        '<div class="gbcd-addon-card">' +
          '<div class="gbcd-addon-img">' + (p.image ? '<img loading="lazy" src="' + escapeHtml(img(p.image, 300)) + '" alt="">' : '🫙') + '</div>' +
          '<div class="gbcd-addon-name">' + escapeHtml(p.title) + '</div>' +
          '<div class="gbcd-addon-price">' + money(p.price) + '</div>' +
          '<button type="button" class="gbcd-addon-add" data-gbcd-addon="' + p.variant_id + '">Add</button>' +
        '</div>';
    }).join('');
  }

  function renderUpsell(cart) {
    var host = root.querySelector('[data-gbcd-upsell]');
    if (!host) return;
    var u = cfg.upsell;
    if (!u || !u.variant_id || cart.item_count === 0) { host.style.display = 'none'; return; }
    var inCart = cart.items.some(function(it) { return it.variant_id === u.variant_id; });
    if (inCart) { host.style.display = 'none'; return; }
    host.style.display = '';
    host.innerHTML = '' +
      '<div class="gbcd-upsell-img">' + (u.image ? '<img loading="lazy" src="' + escapeHtml(img(u.image, 200)) + '" alt="">' : '🎁') + '</div>' +
      '<div>' +
        '<div class="gbcd-upsell-eyebrow">' + escapeHtml(u.eyebrow || 'COMPLETE THE SET') + '</div>' +
        '<div class="gbcd-upsell-h">' + escapeHtml(u.headline || u.title) + '</div>' +
        '<button type="button" class="gbcd-upsell-cta" data-gbcd-upsell="' + u.variant_id + '">Add for ' + money(u.price) + '</button>' +
      '</div>';
  }

  function applyKitColor(cart) {
    if (!cart.items.length) return;
    var last = cart.items[cart.items.length - 1];
    var kc = last.properties && last.properties._kit_color;
    // Try to find a kit color from the candidate list (server included it for products in cart)
    if (!kc && cfg.kit_colors) {
      var found = cfg.kit_colors[last.product_id];
      if (found) kc = found;
    }
    if (kc && /^#[0-9A-Fa-f]{3,8}$/.test(kc)) {
      root.style.setProperty('--kit-color', kc);
    } else {
      root.style.removeProperty('--kit-color');
    }
  }

  // ---------- State updates ----------
  function refresh() {
    var v = state.cartVersion;
    return fetchCart().then(function(c) {
      // If a local mutation bumped the version while we were fetching,
      // the server response is stale relative to the optimistic state.
      if (v !== state.cartVersion) return c;
      state.cart = c;
      bumpVersion();
      render();
      return c;
    });
  }

  // Optimistic helpers — mutate state.cart in place and re-render.
  // The server response replaces state.cart when it lands.
  function optimisticChangeQty(key, newQty) {
    if (!state.cart) return;
    var idx = -1;
    for (var i = 0; i < state.cart.items.length; i++) {
      if (state.cart.items[i].key === key) { idx = i; break; }
    }
    if (idx < 0) return;
    var item = state.cart.items[idx];
    bumpVersion();
    if (newQty <= 0) {
      state.cart.item_count -= item.quantity;
      state.cart.total_price -= item.final_line_price;
      state.cart.items_subtotal_price = Math.max(0, (state.cart.items_subtotal_price || 0) - (item.original_line_price || item.final_line_price));
      state.cart.items.splice(idx, 1);
    } else {
      var oldQty = item.quantity;
      var unitFinal = item.final_line_price / Math.max(1, oldQty);
      var unitOrig  = (item.original_line_price || item.final_line_price) / Math.max(1, oldQty);
      var diff = newQty - oldQty;
      item.quantity = newQty;
      item.final_line_price    = Math.round(unitFinal * newQty);
      item.original_line_price = Math.round(unitOrig  * newQty);
      state.cart.item_count += diff;
      state.cart.total_price += Math.round(unitFinal * diff);
      if (state.cart.items_subtotal_price != null) {
        state.cart.items_subtotal_price += Math.round(unitOrig * diff);
      }
    }
    render();
  }

  function optimisticAdd(line) {
    if (!state.cart) state.cart = { items: [], item_count: 0, total_price: 0, items_subtotal_price: 0 };
    var existing = state.cart.items.find(function(it) { return it.variant_id === line.variant_id && !(it.properties && it.properties._gift); });
    if (existing) {
      optimisticChangeQty(existing.key, existing.quantity + (line.quantity || 1));
      return;
    }
    bumpVersion();
    var qty = line.quantity || 1;
    var unitPrice = line.price || 0;
    var unitOrig  = line.compare_at_price || line.price || 0;
    state.cart.items.push({
      key: 'pending-' + line.variant_id + '-' + Date.now(),
      _pending: true,
      product_id: line.product_id || 0,
      variant_id: line.variant_id,
      product_title: line.title || 'Loading…',
      variant_title: line.variant_title || '',
      product_type: line.product_type || '',
      url: line.url || '#',
      image: line.image || '',
      quantity: qty,
      final_line_price:    unitPrice * qty,
      original_line_price: unitOrig  * qty,
      final_price: unitPrice,
      original_price: unitOrig,
      properties: line.properties || {}
    });
    state.cart.item_count += qty;
    state.cart.total_price += unitPrice * qty;
    if (state.cart.items_subtotal_price != null) {
      state.cart.items_subtotal_price += unitOrig * qty;
    }
    render();
  }

  function open() {
    state.isOpen = true;
    root.classList.add('is-open');
    document.body.classList.add('gb-cart-drawer-active');
    document.body.style.overflow = 'hidden';
    state.lastFocus = document.activeElement;
    var closeBtn = root.querySelector('[data-gbcd-close]');
    if (closeBtn) setTimeout(function() { closeBtn.focus(); }, 320);
    // If we already have a cart in memory, render it immediately —
    // no network round-trip blocks the open animation. Refresh lazily
    // in the background so any stale data converges.
    if (state.cart) {
      render();
      // Background refresh — but discard if any optimistic mutation
      // bumps the version while it's in flight.
      var v = state.cartVersion;
      fetchCart().then(function(c) {
        if (v !== state.cartVersion) return;
        state.cart = c;
        bumpVersion();
        render();
      }).catch(function() {});
    } else {
      refresh();
    }
  }

  function close() {
    state.isOpen = false;
    root.classList.remove('is-open');
    document.body.classList.remove('gb-cart-drawer-active');
    document.body.style.overflow = '';
    if (state.lastFocus && state.lastFocus.focus) state.lastFocus.focus();
  }

  // ---------- Toast (undo remove) ----------
  var toastTimer = null;
  function showToast(message, undoLine) {
    var t = root.querySelector('[data-gbcd-toast]');
    var msg = t.querySelector('[data-gbcd-toast-msg]');
    var undo = t.querySelector('[data-gbcd-toast-undo]');
    msg.textContent = message;
    state.lastRemovedLine = undoLine;
    undo.style.display = undoLine ? '' : 'none';
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() { t.classList.remove('show'); state.lastRemovedLine = null; }, 5000);
  }

  // ---------- Events ----------
  root.addEventListener('click', function(ev) {
    if (ev.target.closest('[data-gbcd-close]') || ev.target.classList.contains('gbcd-overlay')) {
      close();
      return;
    }
    var qtyBtn = ev.target.closest('[data-gbcd-qty]');
    if (qtyBtn) {
      var line = qtyBtn.closest('.gbcd-item');
      var newQty = parseInt(qtyBtn.getAttribute('data-gbcd-qty'), 10);
      var key = line.getAttribute('data-line-key');
      optimisticChangeQty(key, Math.max(0, newQty));
      changeLine(key, Math.max(0, newQty))
        .then(function(c) { state.cart = c; bumpVersion(); render(); })
        .catch(function() { refresh(); });
      return;
    }
    var removeBtn = ev.target.closest('[data-gbcd-remove]');
    if (removeBtn) {
      var line2 = removeBtn.closest('.gbcd-item');
      var key2 = line2.getAttribute('data-line-key');
      var removedItem = state.cart.items.find(function(it) { return it.key === key2; });
      if (removedItem) {
        showToast('Removed ' + removedItem.product_title, { id: removedItem.variant_id, qty: removedItem.quantity, props: removedItem.properties });
      }
      optimisticChangeQty(key2, 0);
      changeLine(key2, 0)
        .then(function(c) { state.cart = c; bumpVersion(); render(); })
        .catch(function() { refresh(); });
      return;
    }
    var undoBtn = ev.target.closest('[data-gbcd-toast-undo]');
    if (undoBtn && state.lastRemovedLine) {
      var u = state.lastRemovedLine;
      addLine(u.id, u.qty, u.props).then(function() { return fetchCart(); }).then(function(c) { state.cart = c; bumpVersion(); render(); });
      root.querySelector('[data-gbcd-toast]').classList.remove('show');
      state.lastRemovedLine = null;
      return;
    }
    var addonBtn = ev.target.closest('[data-gbcd-addon]');
    if (addonBtn) {
      var vid = parseInt(addonBtn.getAttribute('data-gbcd-addon'), 10);
      addonBtn.setAttribute('disabled', 'disabled');
      addonBtn.textContent = 'Adding…';
      // optimistic add — pull title/image/price from the addon card
      var card = addonBtn.closest('.gbcd-addon-card');
      var addonCandidate = (cfg.addon_candidates || []).find(function(p) { return p.variant_id === vid; });
      if (addonCandidate) {
        optimisticAdd({
          variant_id: vid,
          product_id: addonCandidate.id,
          title: addonCandidate.title,
          image: addonCandidate.image,
          price: addonCandidate.price,
          quantity: 1
        });
      }
      addLine(vid, 1).then(function() { return fetchCart(); }).then(function(c) { state.cart = c; bumpVersion(); render(); }).catch(function() {
        addonBtn.removeAttribute('disabled'); addonBtn.textContent = 'Add';
        refresh();
      });
      return;
    }
    var upBtn = ev.target.closest('[data-gbcd-upsell]');
    if (upBtn) {
      var uvid = parseInt(upBtn.getAttribute('data-gbcd-upsell'), 10);
      upBtn.setAttribute('disabled', 'disabled');
      if (cfg.upsell && cfg.upsell.variant_id === uvid) {
        optimisticAdd({
          variant_id: uvid,
          title: cfg.upsell.title || cfg.upsell.headline,
          image: cfg.upsell.image,
          price: cfg.upsell.price,
          quantity: 1
        });
      }
      addLine(uvid, 1).then(function() { return fetchCart(); }).then(function(c) { state.cart = c; bumpVersion(); render(); }).catch(function() { refresh(); });
      return;
    }
    var emptyAdd = ev.target.closest('[data-gbcd-empty-add]');
    if (emptyAdd) {
      var evid = parseInt(emptyAdd.getAttribute('data-gbcd-empty-add'), 10);
      emptyAdd.setAttribute('disabled', 'disabled');
      addLine(evid, 1).then(function() { return fetchCart(); }).then(function(c) { state.cart = c; bumpVersion(); render(); }).catch(function() { refresh(); });
      return;
    }
    var checkoutBtn = ev.target.closest('[data-gbcd-checkout]');
    if (checkoutBtn) {
      window.location.href = '/checkout';
      return;
    }
    var discountSubmit = ev.target.closest('[data-gbcd-discount-submit]');
    if (discountSubmit) {
      var input = root.querySelector('[data-gbcd-discount-input]');
      var code = (input.value || '').trim();
      var msgEl = root.querySelector('[data-gbcd-discount-msg]');
      if (!code) return;
      msgEl.textContent = 'Applying…';
      msgEl.className = 'gbcd-discount-msg';
      applyDiscount(code).then(function() {
        return fetchCart();
      }).then(function(c) {
        state.cart = c; render();
        msgEl.textContent = 'Code ' + code + ' will apply at checkout';
        msgEl.className = 'gbcd-discount-msg success';
      }).catch(function() {
        msgEl.textContent = 'Could not apply that code';
        msgEl.className = 'gbcd-discount-msg error';
      });
      return;
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && state.isOpen) close();
  });

  // Listen for cart:update from anywhere (PDP ATC, BYOK, shop tabs).
  // The cart is attached on detail.resource — render directly without
  // an extra /cart.js round-trip. We do NOT auto-open here; the ATC
  // caller opens the drawer optimistically before the network call.
  document.addEventListener('cart:update', function(ev) {
    var detail = ev.detail || {};
    if (detail.resource) {
      state.cart = detail.resource;
      bumpVersion();
      render();
    } else if (state.isOpen) {
      refresh();
    }
  });

  // Make the header cart icon open our drawer instead of the theme one
  function bindHeaderCartIcon() {
    var triggers = document.querySelectorAll('cart-drawer-component [data-testid="cart-drawer-trigger"], a[href$="/cart"], .header-actions__action[aria-haspopup="dialog"][aria-label*="art" i], .gb-header__cart, [data-gb-cart-icon]');
    triggers.forEach(function(el) {
      if (el.dataset.gbcdBound) return;
      el.dataset.gbcdBound = '1';
      el.addEventListener('click', function(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        open();
      }, true);
    });
  }
  bindHeaderCartIcon();
  // Rebind after dynamic re-renders
  var mo = new MutationObserver(function() { bindHeaderCartIcon(); });
  mo.observe(document.body, { childList: true, subtree: true });

  // Public API
  window.GBCartDrawer = {
    open: open,
    close: close,
    refresh: refresh,
    previewAdd: optimisticAdd,
    state: state
  };

  // Initial cart fetch (so the drawer is ready before first open)
  refresh();
})();
