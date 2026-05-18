/* ============================================================
   GUTBASKET CART DRAWER · v2
   Vanilla JS · AJAX Cart API · scoped under window.GBCartDrawer
   - Static brand colors throughout (no per-product kit cascade)
   - Optimistic UI + version-guarded reconciliation preserved
   - Animation-driven row removal preserved
   - Form intercept (with variant-flicker fix) preserved
   ============================================================ */
(function() {
  'use strict';

  var root = document.getElementById('gb-cart-drawer');
  if (!root) return;

  var cfgEl = document.getElementById('gb-cart-drawer-config');
  var cfg = {};
  try { cfg = cfgEl ? JSON.parse(cfgEl.textContent) : {}; } catch (e) { cfg = {}; }

  // Section-rendered Liquid defaults — read off the wrapper so JS renderers
  // can produce strings without losing admin-driven copy. The wrapper
  // never re-renders, so these are static for the lifetime of the page.
  var staticCopy = {
    addonsTitle: 'Frequently added',
    emptyEmoji: '🧺',
    emptyHeading: 'Your basket is empty.',
    emptySubtitle: 'Start with what most first-timers pick — the kits below are our bestsellers.',
    emptyEyebrow: 'Bestsellers',
    subtotalLabel: 'Subtotal',
    checkoutLabel: 'Checkout securely'
  };

  var state = {
    cart: null,
    isOpen: false,
    lastUnlockedCount: 0,
    moneyFormat: cfg.money_format || '₹{{amount}}',
    cartVersion: 0,  // bumped on every local mutation or authoritative cart write; stale fetches check against this and bail.
    discountCode: null,
    discountOpen: false
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
    var w = width || 200;
    // Normalize: strip query string + any existing _NNNx size suffix,
    // then add a consistent _NNNx suffix. This produces a deterministic
    // URL so optimistic and real cart items hit the same browser cache
    // entry — no image flash on the optimistic→real swap.
    var clean = src.split('?')[0].replace(/_\d+x(?=\.\w+$)/i, '');
    return clean.replace(/\.(jpg|jpeg|png|webp|gif)$/i, '_' + w + 'x.$1');
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
  // Coalesce back-to-back render() calls into a single paint via rAF.
  var renderRAF = null;
  function scheduleRender() {
    if (renderRAF) return;
    renderRAF = requestAnimationFrame(function() {
      renderRAF = null;
      renderNow();
    });
  }
  function render() { scheduleRender(); }

  function renderNow() {
    var cart = state.cart;
    if (!cart) return;
    document.documentElement.style.setProperty('--gb-cart-count', cart.item_count);

    // Header count chip
    var countLabel = root.querySelector('[data-gbcd-count-label]');
    if (countLabel) {
      countLabel.textContent = cart.item_count ?
        '· ' + cart.item_count + ' item' + (cart.item_count > 1 ? 's' : '') : '';
    }

    var body = root.querySelector('[data-gbcd-body]');
    var foot = root.querySelector('[data-gbcd-foot]');
    if (!body || !foot) return;

    if (cart.item_count === 0) {
      body.innerHTML = renderEmpty();
      foot.innerHTML = renderEmptyFoot();
      return;
    }

    // Build the body sections. Items use keyed-diff so we have to
    // build the section shell first, then patch line items in place.
    body.innerHTML =
      (cfg.show_progress ? renderProgress(cart) : '') +
      '<div class="line-items" data-gbcd-items></div>' +
      (cfg.show_upsell ? renderUpsell(cart) : '') +
      (cfg.show_addons ? renderAddons(cart) : '') +
      (cfg.show_discount ? renderDiscount() : '') +
      renderDelivery() +
      (cfg.show_trust ? renderTrustStrip() : '');

    renderItems(cart);
    foot.innerHTML = renderFooter(cart);
  }

  // ---------- Items: keyed diff renderer (preserved) ----------
  function lineItemId(it) {
    var isGift = it.properties && (it.properties._gift === 'true' || it.properties._gift === true);
    return (isGift ? 'gift-' : 'var-') + it.variant_id;
  }

  function lineItemHtml(it) {
    var compare = '';
    if (it.original_line_price > it.final_line_price) {
      compare = '<span class="old">' + money(it.original_line_price) + '</span>';
    }
    var isGift = it.properties && (it.properties._gift === 'true' || it.properties._gift === true);
    var giftBadge = isGift ? '<span class="line-item-gift">🎁 Free Gift</span>' : '';
    var variantLine = (it.variant_title && it.variant_title !== 'Default Title') ?
      '<div class="variant"><span>' + escapeHtml(it.variant_title) + '</span></div>' : '';
    var disableMinus = isGift || it.quantity <= 1;
    var disableAll = isGift;

    var imgInner = it.image ?
      '<img loading="lazy" src="' + escapeHtml(img(it.image, 200)) + '" alt="">' :
      '🫙';

    var eyebrow = it.product_type ?
      '<div class="eyebrow">' + escapeHtml(it.product_type) + '</div>' : '';

    return '' +
      '<div class="line-item-img">' + imgInner + '</div>' +
      '<div class="line-item-meta">' +
        eyebrow +
        '<a class="name" href="' + escapeHtml(it.url || '#') + '">' + escapeHtml(it.product_title) + '</a>' +
        variantLine +
        giftBadge +
        '<div class="line-item-row">' +
          '<div class="qty-stepper">' +
            '<button type="button" data-gbcd-qty="' + (it.quantity - 1) + '" aria-label="Decrease" ' + (disableAll || disableMinus ? 'disabled' : '') + '>−</button>' +
            '<span class="qty">' + it.quantity + '</span>' +
            '<button type="button" data-gbcd-qty="' + (it.quantity + 1) + '" aria-label="Increase" ' + (disableAll ? 'disabled' : '') + '>+</button>' +
          '</div>' +
          '<div class="line-item-price">' +
            '<span class="now">' + money(it.final_line_price) + '</span>' +
            compare +
          '</div>' +
        '</div>' +
        (disableAll ? '' :
          '<div class="line-item-actions">' +
            '<button type="button" class="remove-btn" data-gbcd-remove>✕ Remove</button>' +
          '</div>') +
      '</div>';
  }

  function buildLineNode(it) {
    var node = document.createElement('div');
    node.className = 'line-item';
    node.setAttribute('data-line-id', lineItemId(it));
    node.setAttribute('data-line-key', it.key);
    if (it._pending) node.setAttribute('data-pending', '1');
    node.innerHTML = lineItemHtml(it);
    return node;
  }

  // Update mutable fields in place — preserves the <img> element so the
  // browser doesn't recreate it on every render. Every assignment is
  // guarded so identical values don't trigger DOM mutations.
  function updateLineNode(node, it) {
    var isGift = it.properties && (it.properties._gift === 'true' || it.properties._gift === true);
    if (node.getAttribute('data-line-key') !== (it.key || '')) {
      node.setAttribute('data-line-key', it.key);
    }
    if (it._pending) {
      if (node.getAttribute('data-pending') !== '1') node.setAttribute('data-pending', '1');
    } else if (node.hasAttribute('data-pending')) {
      node.removeAttribute('data-pending');
    }

    var qtyVal = node.querySelector('.qty-stepper .qty');
    if (qtyVal && qtyVal.textContent !== String(it.quantity)) qtyVal.textContent = it.quantity;

    var qtyBtns = node.querySelectorAll('[data-gbcd-qty]');
    if (qtyBtns[0]) {
      var minusTarget = String(it.quantity - 1);
      if (qtyBtns[0].getAttribute('data-gbcd-qty') !== minusTarget) {
        qtyBtns[0].setAttribute('data-gbcd-qty', minusTarget);
      }
      var minusDisabled = (isGift || it.quantity <= 1);
      if (minusDisabled !== qtyBtns[0].hasAttribute('disabled')) {
        if (minusDisabled) qtyBtns[0].setAttribute('disabled', 'disabled');
        else qtyBtns[0].removeAttribute('disabled');
      }
    }
    if (qtyBtns[1]) {
      var plusTarget = String(it.quantity + 1);
      if (qtyBtns[1].getAttribute('data-gbcd-qty') !== plusTarget) {
        qtyBtns[1].setAttribute('data-gbcd-qty', plusTarget);
      }
      var plusDisabled = !!isGift;
      if (plusDisabled !== qtyBtns[1].hasAttribute('disabled')) {
        if (plusDisabled) qtyBtns[1].setAttribute('disabled', 'disabled');
        else qtyBtns[1].removeAttribute('disabled');
      }
    }

    var priceWrap = node.querySelector('.line-item-price');
    if (priceWrap) {
      var nowEl = priceWrap.querySelector('.now');
      var oldEl = priceWrap.querySelector('.old');
      var nowText = money(it.final_line_price);
      if (nowEl && nowEl.textContent !== nowText) nowEl.textContent = nowText;
      if (it.original_line_price > it.final_line_price) {
        var oldText = money(it.original_line_price);
        if (!oldEl) {
          var span = document.createElement('span');
          span.className = 'old';
          span.textContent = oldText;
          priceWrap.appendChild(span);
        } else if (oldEl.textContent !== oldText) {
          oldEl.textContent = oldText;
        }
      } else if (oldEl) {
        oldEl.remove();
      }
    }

    var nameEl = node.querySelector('.line-item-meta .name');
    if (nameEl && nameEl.textContent !== it.product_title) {
      nameEl.textContent = it.product_title;
    }
    if (nameEl && nameEl.getAttribute('href') !== (it.url || '#')) {
      nameEl.setAttribute('href', it.url || '#');
    }

    // Variant title (e.g., "2 Kg", "Spicy"). Insert/update/remove as the
    // optimistic preview reconciles with the server.
    var variantEl = node.querySelector('.line-item-meta .variant');
    var wantVariant = it.variant_title && it.variant_title !== 'Default Title';
    if (wantVariant) {
      if (!variantEl) {
        if (nameEl && nameEl.parentNode) {
          variantEl = document.createElement('div');
          variantEl.className = 'variant';
          variantEl.innerHTML = '<span>' + escapeHtml(it.variant_title) + '</span>';
          nameEl.parentNode.insertBefore(variantEl, nameEl.nextSibling);
        }
      } else {
        var inner = variantEl.querySelector('span');
        if (inner && inner.textContent !== it.variant_title) inner.textContent = it.variant_title;
      }
    } else if (variantEl) {
      variantEl.remove();
    }

    // Image transitions
    var imgWrap = node.querySelector('.line-item-img');
    if (imgWrap) {
      var imgEl = imgWrap.querySelector('img');
      var newSrc = it.image ? img(it.image, 200) : '';
      if (newSrc) {
        if (!imgEl) {
          imgWrap.innerHTML = '<img loading="lazy" src="' + escapeHtml(newSrc) + '" alt="">';
        } else if (imgEl.getAttribute('src') !== newSrc) {
          imgEl.setAttribute('src', newSrc);
        }
      } else if (imgEl) {
        imgWrap.innerHTML = '🫙';
      }
    }
  }

  function renderItems(cart) {
    var host = root.querySelector('[data-gbcd-items]');
    if (!host) return;
    var existing = {};
    Array.prototype.forEach.call(host.children, function(el) {
      var id = el.getAttribute('data-line-id');
      if (id) existing[id] = el;
    });
    var newNodes = cart.items.map(function(it) {
      var id = lineItemId(it);
      var node = existing[id];
      if (node) {
        updateLineNode(node, it);
        delete existing[id];
      } else {
        node = buildLineNode(it);
      }
      return node;
    });
    // Phase 1: mark departing items. animationend fires schedule the
    // actual DOM removal; setTimeout fallback for reduced-motion.
    Object.keys(existing).forEach(function(k) {
      var el = existing[k];
      if (el.dataset.removing === '1') return;
      el.dataset.removing = '1';
      el.classList.add('is-removing');
      var removed = false;
      function doRemove() {
        if (removed) return;
        removed = true;
        el.removeEventListener('animationend', onAnimEnd);
        if (el.parentNode && el.dataset.removing === '1') el.remove();
      }
      function onAnimEnd(e) {
        if (e.animationName === 'gbcd-item-out') doRemove();
      }
      el.addEventListener('animationend', onAnimEnd);
      setTimeout(doRemove, 300);
    });
    // Phase 2: cancel removal for any node that came back.
    newNodes.forEach(function(node) {
      if (node.dataset.removing === '1') {
        node.dataset.removing = '';
        node.classList.remove('is-removing');
      }
    });
    // Phase 3: reorder live siblings only, skipping is-removing rows.
    var liveChildren = [];
    for (var i = 0; i < host.children.length; i++) {
      if (host.children[i].dataset.removing !== '1') liveChildren.push(host.children[i]);
    }
    newNodes.forEach(function(node, idx) {
      if (liveChildren[idx] === node) return;
      host.insertBefore(node, liveChildren[idx] || null);
      var oldIdx = liveChildren.indexOf(node);
      if (oldIdx >= 0) liveChildren.splice(oldIdx, 1);
      liveChildren.splice(idx, 0, node);
    });
  }

  // ---------- Progress ----------
  function renderProgress(cart) {
    var tiers = (cfg.tiers || []).slice().sort(function(a, b) { return a.threshold - b.threshold; });
    if (tiers.length === 0) return '';

    var totalCents = cart.total_price || 0;
    var subtotalInr = totalCents / 100;
    var maxThreshold = tiers[tiers.length - 1].threshold;
    var fillPct = Math.min(100, (subtotalInr / maxThreshold) * 100);

    var unlockedCount = 0;
    var nextTier = null;
    tiers.forEach(function(t) {
      if (subtotalInr >= t.threshold) unlockedCount++;
      else if (!nextTier) nextTier = t;
    });

    var headline = '';
    if (!nextTier) {
      headline = '<span class="all-done">🎉 All rewards unlocked!</span> Your basket is fully optimised.';
    } else {
      var remaining = Math.max(0, Math.ceil(nextTier.threshold - subtotalInr));
      var lbl = escapeHtml(nextTier.label || 'next reward');
      if (unlockedCount === 0) {
        headline = 'Add <strong>₹' + remaining.toLocaleString('en-IN') + '</strong> more to unlock <strong>' + lbl + '</strong>';
      } else {
        headline = '🎉 Just <strong>₹' + remaining.toLocaleString('en-IN') + '</strong> more to unlock <strong>' + lbl + '</strong>';
      }
    }

    var pinsHtml = tiers.map(function(t, idx) {
      var pct = (t.threshold / maxThreshold) * 100;
      var unlocked = subtotalInr >= t.threshold;
      var justClass = (unlocked && idx >= state.lastUnlockedCount) ? ' just-unlocked' : '';
      var icon = escapeHtml(t.icon || '🎁');
      return '<div class="progress-tier' + (unlocked ? ' unlocked' : '') + justClass + '" style="left: ' + pct + '%;">' +
        '<div class="tier-label">₹' + t.threshold +
          '<span class="reward">' + icon + '</span>' +
        '</div>' +
      '</div>';
    }).join('');

    state.lastUnlockedCount = unlockedCount;

    if (cfg.free_gift_enabled) {
      // Fire-and-forget; result lands via cart:update / setCart.
      maybeManageFreeGift(cart, tiers, subtotalInr);
    }

    return '' +
      '<section class="progress-section">' +
        '<div class="progress-headline">' + headline + '</div>' +
        '<div class="progress-track">' +
          '<div class="progress-fill" style="width: ' + fillPct + '%;"></div>' +
          pinsHtml +
        '</div>' +
      '</section>';
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
          .then(function(c) { setCart(c); render(); })
          .catch(function() {});
      } else if (!unlocked && existing) {
        changeLine(existing.key, 0)
          .then(function(c) { setCart(c); render(); })
          .catch(function() {});
      }
    });
  }

  // ---------- Add-ons ----------
  function renderAddons(cart) {
    if (cart.item_count === 0) return '';
    var candidates = (cfg.addon_candidates || []).slice();
    var inCartIds = {};
    cart.items.forEach(function(it) { inCartIds[it.product_id] = true; });
    var filtered = candidates.filter(function(p) { return !inCartIds[p.id]; }).slice(0, 6);
    if (filtered.length === 0) return '';

    var cards = filtered.map(function(p) {
      var imgInner = p.image ?
        '<img loading="lazy" src="' + escapeHtml(img(p.image, 300)) + '" alt="">' :
        '🫙';
      return '' +
        '<div class="addon-card">' +
          '<div class="addon-img">' + imgInner + '</div>' +
          '<div class="addon-name">' + escapeHtml(p.title) + '</div>' +
          '<div class="addon-price-row">' +
            '<div class="addon-price">' + money(p.price) + '</div>' +
            '<button type="button" class="addon-btn" data-gbcd-addon="' + p.variant_id + '" aria-label="Add ' + escapeHtml(p.title) + '">+</button>' +
          '</div>' +
        '</div>';
    }).join('');

    return '' +
      '<section class="section-block bg-cream">' +
        '<div class="section-heading">' +
          '<span class="eyebrow">+ ' + escapeHtml(staticCopy.addonsTitle) + '</span>' +
          '<span class="hint">scroll →</span>' +
        '</div>' +
        '<div class="addon-scroll">' + cards + '</div>' +
      '</section>';
  }

  // ---------- Upsell ----------
  function renderUpsell(cart) {
    var u = cfg.upsell;
    if (!u || !u.variant_id || cart.item_count === 0) return '';
    var inCart = cart.items.some(function(it) { return it.variant_id === u.variant_id; });
    if (inCart) return '';

    var savePart = '';
    if (u.compare_at_price && u.compare_at_price > u.price) {
      savePart = '<span class="save">vs ' + money(u.compare_at_price) + ' sep</span>';
    }

    var thumb = u.image ?
      '<img loading="lazy" src="' + escapeHtml(img(u.image, 200)) + '" alt="">' :
      '🎁';

    return '' +
      '<section class="upsell-card">' +
        '<div class="upsell-thumb">' + thumb + '</div>' +
        '<div class="upsell-meta">' +
          '<div class="eyebrow">' + escapeHtml(u.eyebrow || 'COMPLETE THE SET') + '</div>' +
          '<div class="name">' + escapeHtml(u.headline || u.title || '') + '</div>' +
          '<div class="upsell-bottom">' +
            '<div class="upsell-price">' + money(u.price) + savePart + '</div>' +
            '<button type="button" class="upsell-add" data-gbcd-upsell="' + u.variant_id + '">Add →</button>' +
          '</div>' +
        '</div>' +
      '</section>';
  }

  // ---------- Discount ----------
  function renderDiscount() {
    if (state.discountCode) {
      return '' +
        '<div class="discount-row">' +
          '<div class="applied-discount">' +
            '✓ ' + escapeHtml(state.discountCode) + ' QUEUED FOR CHECKOUT' +
            '<span class="remove" data-gbcd-discount-clear title="Remove">✕</span>' +
          '</div>' +
        '</div>';
    }
    var openClass = state.discountOpen ? ' open' : '';
    return '' +
      '<div class="discount-row' + openClass + '" data-gbcd-discount-row>' +
        '<button type="button" class="discount-toggle" data-gbcd-discount-toggle>' +
          '<span>🎟 Have a discount code?</span>' +
          '<span class="chev">▾</span>' +
        '</button>' +
        '<div class="discount-input-wrap">' +
          '<input type="text" data-gbcd-discount-input placeholder="Enter code" aria-label="Discount code" />' +
          '<button type="button" data-gbcd-discount-submit>Apply</button>' +
        '</div>' +
        '<div class="discount-msg" data-gbcd-discount-msg></div>' +
      '</div>';
  }

  // ---------- Delivery (static for v1) ----------
  function renderDelivery() {
    return '' +
      '<div class="delivery-row">' +
        '<div class="left">' +
          '<span class="truck">🚚</span>' +
          '<div class="text">' +
            '<strong>Ships next working day</strong>' +
            '<span class="sub">COD available · Free shipping over ₹999</span>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  // ---------- Trust strip ----------
  // Read trust strip blocks from a hidden seed in the section markup if
  // present; otherwise default to the three brand defaults.
  var trustItemsCache = null;
  function getTrustItems() {
    if (trustItemsCache) return trustItemsCache;
    // The section renders blocks as visible markup in the old layout; the
    // new layout dropped that. Look for a data hint, otherwise default.
    var hint = root.querySelector('[data-gbcd-trust-items]');
    var items = null;
    if (hint) {
      try { items = JSON.parse(hint.textContent); } catch (e) { items = null; }
    }
    if (!items || !items.length) {
      items = ['FSSAI Licensed', 'Secure Pay', 'Easy Returns'];
    }
    trustItemsCache = items;
    return items;
  }
  function renderTrustStrip() {
    var items = getTrustItems();
    var html = items.map(function(t) {
      return '<span class="trust-item"><span class="check">✓</span> ' + escapeHtml(t) + '</span>';
    }).join('');
    return '<div class="trust-strip">' + html + '</div>';
  }

  // ---------- Footer ----------
  function renderFooter(cart) {
    var sub = cart.total_price || 0;

    // Savings: per-line discount + line-item compare_at delta
    var savings = 0;
    cart.items.forEach(function(it) {
      if (it.original_line_price > it.final_line_price) {
        savings += (it.original_line_price - it.final_line_price);
      }
    });

    // Shipping free signal — use first tier threshold (₹) if defined
    var freeShipCents = null;
    if (cfg.tiers && cfg.tiers.length) {
      var firstShipTier = cfg.tiers.find(function(t) { return t.type === 'free_shipping'; }) || cfg.tiers[0];
      if (firstShipTier && firstShipTier.threshold) freeShipCents = firstShipTier.threshold * 100;
    }
    var freeShip = freeShipCents != null && sub >= freeShipCents;
    var shippingRight = freeShip ?
      '<span class="free-tag">FREE</span>' :
      '<span>Calculated at checkout</span>';

    var savedRow = savings > 0 ?
      '<div class="foot-savings">💰 You saved ' + money(savings) + ' today</div>' : '';

    var expressRow = '';
    if (cfg.show_express) {
      var chips = getExpressChips();
      if (chips.length) {
        var chipsHtml = chips.map(function(c) {
          var codClass = /cod/i.test(c) ? ' cod' : '';
          return '<a class="express-chip' + codClass + '" data-gbcd-express href="/checkout">' + escapeHtml(c) + '</a>';
        }).join('');
        expressRow = '' +
          '<div class="express-row">' +
            '<span class="label">Express:</span>' +
            '<div class="express-chips">' + chipsHtml + '</div>' +
          '</div>';
      }
    }

    return '' +
      '<div class="foot-totals">' +
        '<span class="label">' + escapeHtml(staticCopy.subtotalLabel) + '</span>' +
        '<span class="amount">' + money(sub) + '</span>' +
      '</div>' +
      '<div class="foot-shipping">' +
        '<span>Shipping</span>' + shippingRight +
      '</div>' +
      savedRow +
      '<button type="button" class="checkout-btn" data-gbcd-checkout>' +
        '<span>' + escapeHtml(staticCopy.checkoutLabel) + '</span>' +
        '<span class="arrow">→</span>' +
      '</button>' +
      expressRow +
      '<button type="button" class="continue-link" data-gbcd-close>← Continue shopping</button>';
  }

  var expressChipsCache = null;
  function getExpressChips() {
    if (expressChipsCache) return expressChipsCache;
    var hint = root.querySelector('[data-gbcd-express-chips]');
    var items = null;
    if (hint) {
      try { items = JSON.parse(hint.textContent); } catch (e) { items = null; }
    }
    if (!items || !items.length) items = ['UPI', 'GPay', 'PhonePe', 'COD'];
    expressChipsCache = items;
    return items;
  }

  // ---------- Empty ----------
  function renderEmpty() {
    var bestsellers = (cfg.empty_products || []).slice(0, 3);
    var cardsHtml = bestsellers.map(function(p) {
      var imgInner = p.image ?
        '<img loading="lazy" src="' + escapeHtml(img(p.image, 200)) + '" alt="">' :
        '🫙';
      return '' +
        '<button type="button" class="empty-card" data-gbcd-empty-add="' + p.variant_id + '">' +
          '<div class="img">' + imgInner + '</div>' +
          '<div class="info">' +
            '<div class="n">' + escapeHtml(p.title) + '</div>' +
            '<div class="p">' + money(p.price) + '</div>' +
          '</div>' +
          '<div class="add">+</div>' +
        '</button>';
    }).join('');

    var byo = cfg.byo_url ?
      '<a href="' + escapeHtml(cfg.byo_url) + '" class="byo-link">Build your own kit →</a>' : '';

    return '' +
      '<div class="empty-state">' +
        '<div class="empty-icon">' + escapeHtml(staticCopy.emptyEmoji) + '</div>' +
        '<h3>' + escapeHtml(staticCopy.emptyHeading) + '</h3>' +
        '<p>' + escapeHtml(staticCopy.emptySubtitle) + '</p>' +
        (cardsHtml ? '<div class="eyebrow">— ' + escapeHtml(staticCopy.emptyEyebrow) + '</div>' : '') +
        (cardsHtml ? '<div class="empty-cards">' + cardsHtml + '</div>' : '') +
        byo +
      '</div>';
  }
  function renderEmptyFoot() {
    var items = getTrustItems();
    return '<div class="empty-foot">' + escapeHtml(items.join(' · ')) + '</div>';
  }

  // ---------- State updates ----------

  // Preserve drawer item ordering across cart replacements.
  function preserveItemOrder(newCart, prevItems) {
    if (!newCart || !newCart.items || newCart.items.length < 2) return newCart;
    if (!prevItems || prevItems.length === 0) return newCart;
    var oldPos = {};
    prevItems.forEach(function(it, idx) {
      var id = (it.properties && (it.properties._gift === 'true' || it.properties._gift === true) ? 'gift-' : 'var-') + it.variant_id;
      oldPos[id] = idx;
    });
    newCart.items.sort(function(a, b) {
      var aId = (a.properties && (a.properties._gift === 'true' || a.properties._gift === true) ? 'gift-' : 'var-') + a.variant_id;
      var bId = (b.properties && (b.properties._gift === 'true' || b.properties._gift === true) ? 'gift-' : 'var-') + b.variant_id;
      var ap = oldPos[aId], bp = oldPos[bId];
      if (ap === undefined && bp === undefined) return 0;
      if (ap === undefined) return -1;
      if (bp === undefined) return 1;
      return ap - bp;
    });
    return newCart;
  }

  function setCart(c) {
    var prev = (state.cart && state.cart.items) ? state.cart.items : null;
    state.cart = c;
    preserveItemOrder(state.cart, prev);
    bumpVersion();
  }

  function refresh() {
    var v = state.cartVersion;
    return fetchCart().then(function(c) {
      if (v !== state.cartVersion) return c;
      setCart(c);
      render();
      return c;
    });
  }

  // Optimistic helpers — mutate state.cart in place and re-render.
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
    state.cart.items.unshift({
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

  // ---------- Open / close ----------
  function open() {
    state.isOpen = true;
    root.classList.add('is-open');
    root.setAttribute('aria-hidden', 'false');
    document.body.classList.add('gb-cart-drawer-active');
    document.body.style.overflow = 'hidden';
    state.lastFocus = document.activeElement;
    var closeBtn = root.querySelector('[data-gbcd-close]');
    if (closeBtn) setTimeout(function() { closeBtn.focus(); }, 320);
    if (state.cart) {
      render();
      var v = state.cartVersion;
      fetchCart().then(function(c) {
        if (v !== state.cartVersion) return;
        setCart(c);
        render();
      }).catch(function() {});
    } else {
      refresh();
    }
  }

  function close() {
    state.isOpen = false;
    root.classList.remove('is-open');
    root.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('gb-cart-drawer-active');
    document.body.style.overflow = '';
    if (state.lastFocus && state.lastFocus.focus) state.lastFocus.focus();
  }

  // ---------- Events ----------
  root.addEventListener('click', function(ev) {
    if (ev.target.closest('[data-gbcd-close]') || ev.target.classList.contains('cart-overlay')) {
      close();
      return;
    }
    var qtyBtn = ev.target.closest('[data-gbcd-qty]');
    if (qtyBtn) {
      if (qtyBtn.hasAttribute('disabled')) return;
      var line = qtyBtn.closest('.line-item');
      if (!line) return;
      var newQty = parseInt(qtyBtn.getAttribute('data-gbcd-qty'), 10);
      var key = line.getAttribute('data-line-key');
      optimisticChangeQty(key, Math.max(0, newQty));
      var v = state.cartVersion;
      changeLine(key, Math.max(0, newQty))
        .then(function(c) {
          if (v !== state.cartVersion) return;
          setCart(c); render();
        })
        .catch(function() { if (v === state.cartVersion) refresh(); });
      return;
    }
    var removeBtn = ev.target.closest('[data-gbcd-remove]');
    if (removeBtn) {
      var line2 = removeBtn.closest('.line-item');
      if (!line2) return;
      var key2 = line2.getAttribute('data-line-key');
      optimisticChangeQty(key2, 0);
      var v2 = state.cartVersion;
      changeLine(key2, 0)
        .then(function(c) {
          if (v2 !== state.cartVersion) return;
          setCart(c); render();
        })
        .catch(function() { if (v2 === state.cartVersion) refresh(); });
      return;
    }
    var addonBtn = ev.target.closest('[data-gbcd-addon]');
    if (addonBtn) {
      var vid = parseInt(addonBtn.getAttribute('data-gbcd-addon'), 10);
      addonBtn.setAttribute('disabled', 'disabled');
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
      addLine(vid, 1).then(function() { return fetchCart(); }).then(function(c) { setCart(c); render(); }).catch(function() {
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
      addLine(uvid, 1).then(function() { return fetchCart(); }).then(function(c) { setCart(c); render(); }).catch(function() { refresh(); });
      return;
    }
    var emptyAdd = ev.target.closest('[data-gbcd-empty-add]');
    if (emptyAdd) {
      var evid = parseInt(emptyAdd.getAttribute('data-gbcd-empty-add'), 10);
      emptyAdd.setAttribute('disabled', 'disabled');
      addLine(evid, 1).then(function() { return fetchCart(); }).then(function(c) { setCart(c); render(); }).catch(function() { refresh(); });
      return;
    }
    var checkoutBtn = ev.target.closest('[data-gbcd-checkout]');
    if (checkoutBtn) {
      window.location.href = '/checkout';
      return;
    }
    var discountToggle = ev.target.closest('[data-gbcd-discount-toggle]');
    if (discountToggle) {
      var row = discountToggle.closest('[data-gbcd-discount-row]');
      if (row) {
        row.classList.toggle('open');
        state.discountOpen = row.classList.contains('open');
      }
      return;
    }
    var discountClear = ev.target.closest('[data-gbcd-discount-clear]');
    if (discountClear) {
      state.discountCode = null;
      render();
      return;
    }
    var discountSubmit = ev.target.closest('[data-gbcd-discount-submit]');
    if (discountSubmit) {
      var input = root.querySelector('[data-gbcd-discount-input]');
      var code = (input && input.value || '').trim();
      var msgEl = root.querySelector('[data-gbcd-discount-msg]');
      if (!code) return;
      if (msgEl) { msgEl.textContent = 'Applying…'; msgEl.className = 'discount-msg'; }
      applyDiscount(code).then(function() {
        return fetchCart();
      }).then(function(c) {
        setCart(c);
        state.discountCode = code.toUpperCase();
        render();
      }).catch(function() {
        if (msgEl) {
          msgEl.textContent = 'Could not apply that code';
          msgEl.className = 'discount-msg error';
        }
      });
      return;
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && state.isOpen) close();
  });

  // Listen for cart:update from anywhere (PDP ATC, BYOK, shop tabs).
  var SILENT_SOURCES = { 'cart-items-component': true, 'gbcd-internal': true };

  document.addEventListener('cart:update', function(ev) {
    var detail = ev.detail || {};
    var data = detail.data || {};
    if (detail.resource) {
      setCart(detail.resource);
      render();
    } else if (state.isOpen) {
      refresh();
    }
    if (data.didError) return;
    if (data.source && SILENT_SOURCES[data.source]) return;
    if (!state.isOpen) open();
  });

  // ----- Global form intercept -----
  function isCartAddForm(form) {
    if (!form || form.tagName !== 'FORM') return false;
    var action = form.getAttribute('action') || '';
    return /\/cart\/add(\.js)?(\?|$)/.test(action);
  }

  document.addEventListener('submit', function(ev) {
    var form = ev.target;
    if (!isCartAddForm(form)) return;
    if (form.dataset.gbcdSkip === '1') return;
    if (form.closest('product-form-component')) return;
    if (form.closest('[data-gbcd-skip-intercept]')) return;
    ev.preventDefault();
    ev.stopPropagation();

    var btn = form.querySelector('[type="submit"], [name="add"]');
    var origLabel = btn ? btn.textContent : null;
    if (btn) { btn.setAttribute('disabled', 'disabled'); }

    // Read the SELECTED variant — :checked first, then hidden input.
    // (Variant-flicker fix — PR #164/#165.)
    var variantInput = form.querySelector('input[type="radio"][name="id"]:checked') ||
                       form.querySelector('input[type="hidden"][name="id"]') ||
                       form.querySelector('[name="id"]');
    var variantId = variantInput ? parseInt(variantInput.value, 10) : null;
    if (variantId) {
      open();
      var preview = { variant_id: variantId, quantity: 1 };
      var src = (btn && btn.dataset && btn.dataset.productImage) ? btn :
                form.closest('[data-product-id], [data-product-handle]');
      if (src && src.dataset) {
        preview.product_id = parseInt(src.dataset.productId || '0', 10);
        preview.title = src.dataset.productTitle || '';
        preview.image = src.dataset.productImage || '';
        preview.price = parseInt(src.dataset.productPrice || '0', 10);
        preview.url = src.dataset.productUrl || '';
      }
      if (!preview.title) {
        var titleEl = document.querySelector('h1.product__title, h1.product-title, h1.product-name, [data-product-title], main h1');
        if (titleEl) preview.title = (titleEl.textContent || '').trim();
      }
      if (!preview.image) {
        var imgEl = document.querySelector('.gallery-main-img, .gallery-main img, .product__media img, .product-media img, .product-gallery img, [data-product-featured-image]');
        if (imgEl && imgEl.getAttribute('src')) preview.image = imgEl.getAttribute('src');
      }
      var variantEl = form.querySelector('label.variant[data-variant-id="' + variantId + '"]') ||
                      form.querySelector('[data-variant-id="' + variantId + '"]') ||
                      (variantInput && variantInput.closest && variantInput.closest('label.variant'));
      if (variantEl) {
        var packEl = variantEl.querySelector('.variant-pack');
        if (packEl) preview.variant_title = (packEl.textContent || '').trim();
        var illImg = variantEl.querySelector('.variant-illustration img') ||
                     variantEl.querySelector('img');
        if (illImg && illImg.getAttribute('src')) preview.image = illImg.getAttribute('src');
        var cents = variantEl.getAttribute('data-variant-price-cents');
        if (cents) {
          var nCents = parseInt(cents, 10);
          if (!isNaN(nCents)) preview.price = nCents;
        } else {
          var priceStr = variantEl.getAttribute('data-variant-price');
          if (priceStr) {
            var m = String(priceStr).replace(/[^\d.,]/g, '').match(/^(.*?)(?:[.,](\d{1,2}))?$/);
            if (m) {
              var intPart = (m[1] || '').replace(/[.,]/g, '');
              var decPart = m[2] || '';
              decPart = (decPart + '00').slice(0, 2);
              var n2 = (parseInt(intPart || '0', 10) * 100) + parseInt(decPart, 10);
              if (!isNaN(n2)) preview.price = n2;
            }
          }
        }
      }
      if (window.GBCartDrawer && typeof window.GBCartDrawer.previewAdd === 'function') {
        window.GBCartDrawer.previewAdd(preview);
      }
    }

    var fd = new FormData(form);
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      body: fd
    })
      .then(function(r) {
        if (!r.ok) return r.json().then(function(e) { return Promise.reject(e); });
        return fetchCart();
      })
      .then(function(cart) {
        if (btn) { btn.removeAttribute('disabled'); if (origLabel != null) btn.textContent = origLabel; }
        document.dispatchEvent(new CustomEvent('cart:update', {
          bubbles: true,
          detail: { resource: cart, sourceId: 'gb-form-intercept', data: { source: 'gb-form-intercept', itemCount: cart && cart.item_count } }
        }));
      })
      .catch(function() {
        if (btn) { btn.removeAttribute('disabled'); if (origLabel != null) btn.textContent = origLabel; }
        refresh();
      });
  }, true);

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
  var mo = new MutationObserver(function() { bindHeaderCartIcon(); });
  mo.observe(document.body, { childList: true, subtree: true });

  // Public API — UNCHANGED SIGNATURE.
  // open(), close(), refresh(), previewAdd(line), state
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
