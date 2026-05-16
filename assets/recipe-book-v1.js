/* ============================================================
   recipe-book-v1.js
   PDP behavior for the printed Recipe Book template.

   Public API: window.RecipeBookV1
     - atc(btn)         : AJAX add-to-cart from hero or sticky bar
     - swapThumb(btn)   : Gallery thumbnail click handler
     - toggleFaq(btn)   : FAQ accordion toggle (a11y-aware)

   Integrates with:
     - window.GBCartDrawer.open() / previewAdd() for optimistic UI
     - cart:update CustomEvent for drawer sync (matches gb-cart-drawer.js)
     - window.dataLayer for analytics (11 events per §12)
   ============================================================ */
(function () {
  'use strict';

  // ---------- helpers ----------
  function dl() {
    window.dataLayer = window.dataLayer || [];
    return window.dataLayer;
  }
  function track(event, props) {
    try {
      dl().push(Object.assign({ event: event }, props || {}));
    } catch (e) { /* noop */ }
  }
  function getRoot() {
    return document.querySelector('.recipe-book-pdp');
  }
  function getProductMeta() {
    var root = getRoot();
    if (!root) return {};
    return {
      product_id: root.getAttribute('data-product-id') || '',
      product_title: root.getAttribute('data-product-title') || '',
      is_bundle: root.getAttribute('data-is-bundle') === 'true'
    };
  }

  // ---------- ATC ----------
  function openCartDrawer() {
    if (window.GBCartDrawer && typeof window.GBCartDrawer.open === 'function') {
      window.GBCartDrawer.open();
      return;
    }
    // Fallback: dispatch a synthetic event the drawer may listen for, then /cart
    var drawer = document.querySelector('cart-drawer-component');
    if (drawer && typeof drawer.open === 'function') {
      drawer.open();
      return;
    }
    // Last resort
    window.location.href = '/cart';
  }

  function handleAtc(btn) {
    if (!btn || btn.hasAttribute('disabled')) return;
    var variantId = btn.getAttribute('data-variant-id');
    if (!variantId) return;

    var productId = btn.getAttribute('data-product-id') || '';
    var productTitle = btn.getAttribute('data-product-title') || '';
    var productImage = btn.getAttribute('data-product-image') || '';
    var productPrice = parseInt(btn.getAttribute('data-product-price') || '0', 10);
    var productUrl = btn.getAttribute('data-product-url') || '';
    var source = btn.getAttribute('data-source') || 'recipe-book-v1';

    // Sticky bar click telemetry (separate event)
    if (source === 'sticky') {
      track('recipe_book_sticky_atc_click', { product_id: productId });
    }

    track('recipe_book_atc_click', {
      product_id: productId,
      variant_id: variantId,
      price: productPrice
    });

    var origHtml = btn.innerHTML;
    btn.innerHTML = '<span>Adding…</span>';
    btn.setAttribute('disabled', 'disabled');

    // Hide any prior error
    var errEl = document.querySelector('.recipe-book-pdp .atc-error');
    if (errEl) errEl.classList.remove('visible');

    // Optimistic drawer open + preview line
    openCartDrawer();
    if (window.GBCartDrawer && typeof window.GBCartDrawer.previewAdd === 'function') {
      window.GBCartDrawer.previewAdd({
        variant_id: parseInt(variantId, 10),
        product_id: parseInt(productId || '0', 10),
        title: productTitle,
        image: productImage,
        price: productPrice,
        url: productUrl,
        quantity: 1
      });
    }

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: 1 })
    })
      .then(function (r) {
        if (!r.ok) return r.json().then(function (e) { return Promise.reject(e); });
        return fetch('/cart.js').then(function (r2) { return r2.json(); });
      })
      .then(function (cart) {
        btn.classList.add('added');
        btn.innerHTML = '<span>✓ Added</span>';
        track('recipe_book_atc_success', {
          product_id: productId,
          variant_id: variantId
        });
        document.dispatchEvent(new CustomEvent('cart:update', {
          bubbles: true,
          detail: {
            resource: cart,
            sourceId: 'recipe-book-v1',
            data: { source: 'recipe-book-v1', itemCount: cart && cart.item_count }
          }
        }));
        setTimeout(function () {
          btn.classList.remove('added');
          btn.innerHTML = origHtml;
          btn.removeAttribute('disabled');
        }, 1200);
      })
      .catch(function (err) {
        track('recipe_book_atc_error', {
          product_id: productId,
          error_code: (err && (err.status || err.description || err.message)) || 'unknown'
        });
        btn.innerHTML = origHtml;
        btn.removeAttribute('disabled');
        if (errEl) {
          errEl.textContent = (err && err.description) || 'Could not add to cart. Please try again.';
          errEl.classList.add('visible');
        }
      });
  }

  // ---------- Gallery thumb swap ----------
  function swapThumb(btn) {
    if (!btn) return;
    var root = getRoot();
    if (!root) return;
    var src = btn.getAttribute('data-full-src');
    var alt = btn.getAttribute('data-full-alt') || '';
    var idx = btn.getAttribute('data-thumb-index') || '';
    var label = btn.getAttribute('data-thumb-label') || '';

    // Update active state
    root.querySelectorAll('.gallery-thumb').forEach(function (t) {
      t.classList.remove('active');
      t.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');

    // Swap main image
    var mainImg = root.querySelector('.gallery-main img.gallery-main-img');
    if (mainImg && src) {
      mainImg.setAttribute('src', src);
      mainImg.setAttribute('alt', alt);
    }

    var meta = getProductMeta();
    track('recipe_book_gallery_thumb_click', {
      product_id: meta.product_id,
      thumb_index: idx,
      thumb_label: label
    });
  }

  // ---------- FAQ ----------
  function toggleFaq(btn) {
    if (!btn) return;
    var item = btn.closest('.faq-item');
    if (!item) return;
    var willOpen = !item.classList.contains('open');
    item.classList.toggle('open');
    btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    if (willOpen) {
      var meta = getProductMeta();
      track('recipe_book_faq_open', {
        product_id: meta.product_id,
        question_index: item.getAttribute('data-faq-index') || ''
      });
    }
  }

  // ---------- Sticky ATC observers ----------
  function initStickyAtc() {
    var root = getRoot();
    if (!root) return;
    var sticky = root.querySelector('.sticky-atc');
    var heroBtn = root.querySelector('.pdp-hero .atc-btn');
    var reviews = root.querySelector('.reviews-section');
    if (!sticky || !heroBtn) return;

    var heroVisible = true;   // start true; hero is on screen at load
    var nearFooter = false;
    var shownOnce = false;

    function reflect() {
      var shouldShow = !heroVisible && !nearFooter;
      var isShown = sticky.classList.contains('is-visible');
      if (shouldShow && !isShown) {
        sticky.classList.add('is-visible');
        if (!shownOnce) {
          shownOnce = true;
          var meta = getProductMeta();
          track('recipe_book_sticky_atc_shown', { product_id: meta.product_id });
        }
      } else if (!shouldShow && isShown) {
        sticky.classList.remove('is-visible');
      }
    }

    if ('IntersectionObserver' in window) {
      var heroIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          heroVisible = e.intersectionRatio > 0;
          reflect();
        });
      }, { threshold: [0, 0.1] });
      heroIo.observe(heroBtn);

      if (reviews) {
        var revIo = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            nearFooter = e.isIntersecting;
            reflect();
          });
        }, { rootMargin: '0px 0px -200px 0px' });
        revIo.observe(reviews);
      }
    }
  }

  // ---------- Specs strip view (IO) ----------
  function initSpecsIo() {
    var root = getRoot();
    if (!root) return;
    var strip = root.querySelector('.specs-strip');
    if (!strip || !('IntersectionObserver' in window)) return;
    var fired = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !fired) {
          fired = true;
          var meta = getProductMeta();
          track('recipe_book_specs_strip_view', { product_id: meta.product_id });
          io.disconnect();
        }
      });
    }, { threshold: 0.5 });
    io.observe(strip);
  }

  // ---------- Click telemetry for kit + supply cards ----------
  function initCardClicks() {
    var root = getRoot();
    if (!root) return;
    var meta = getProductMeta();

    var kitCta = root.querySelector('.kit-card .kit-cta');
    if (kitCta) {
      kitCta.addEventListener('click', function () {
        track('recipe_book_kit_card_click', {
          product_id: meta.product_id,
          kit_product_id: kitCta.getAttribute('data-kit-product-id') || ''
        });
      });
    }

    root.querySelectorAll('.supply-card').forEach(function (card, idx) {
      card.addEventListener('click', function () {
        track('recipe_book_supply_card_click', {
          product_id: meta.product_id,
          supply_product_id: card.getAttribute('data-supply-product-id') || '',
          position: idx
        });
      });
    });
  }

  // ---------- Init ----------
  function init() {
    var meta = getProductMeta();
    track('recipe_book_pdp_view', {
      product_id: meta.product_id,
      product_title: meta.product_title,
      is_bundle: meta.is_bundle
    });
    initStickyAtc();
    initSpecsIo();
    initCardClicks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ---------- Public API ----------
  window.RecipeBookV1 = {
    atc: handleAtc,
    swapThumb: swapThumb,
    toggleFaq: toggleFaq
  };
})();
