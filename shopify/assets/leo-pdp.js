/* Shared JS for Fermentation Kit Leo refactor sections.
   Loaded by every section that needs interactivity via {{ 'leo-pdp.js' | asset_url | script_tag }}.
   Shopify's script_tag filter dedupes across the page so loading from each section is safe. */
(function () {
  if (window.__leoPdpInit) return;
  window.__leoPdpInit = true;
  window.__gbSvgCache = window.__gbSvgCache || {};

  function rgb(s) { var m = String(s).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/); return m ? [+m[1], +m[2], +m[3]] : null; }
  function lightnessOf(c) { return (Math.max(c[0], c[1], c[2]) + Math.min(c[0], c[1], c[2])) / 2 / 255; }
  function recolorSvg(svgRoot) {
    if (!svgRoot) return;
    svgRoot.querySelectorAll('*').forEach(function (el) {
      var cs = getComputedStyle(el);
      var fillC = rgb(cs.fill);
      var strokeC = rgb(cs.stroke);
      if (cs.fill && cs.fill !== 'none' && fillC && cs.fill !== 'rgba(0, 0, 0, 0)') {
        el.setAttribute('data-fill-tone', lightnessOf(fillC) > 0.7 ? 'light' : 'dark');
      }
      if (cs.stroke && cs.stroke !== 'none' && strokeC && cs.stroke !== 'rgba(0, 0, 0, 0)') {
        el.setAttribute('data-has-stroke', '1');
      }
    });
  }

  function bindScope(scope) {
    var root = scope || document;

    // Inline SVG icons + recolor pass
    root.querySelectorAll('.kit-icon-svg[data-svg-src]').forEach(function (el) {
      if (el.dataset.svgBound) return;
      el.dataset.svgBound = '1';
      var src = el.getAttribute('data-svg-src');
      if (!src) return;
      var setMarkup = function (txt) {
        var clean = String(txt).replace(/<\?xml[^?]*\?>\s*/, '').replace(/<!DOCTYPE[^>]*>\s*/i, '');
        el.innerHTML = clean;
        el.removeAttribute('data-svg-src');
        requestAnimationFrame(function () { recolorSvg(el.querySelector('svg')); });
      };
      var cached = window.__gbSvgCache[src];
      if (typeof cached === 'string') { setMarkup(cached); return; }
      if (cached && cached.then) { cached.then(setMarkup); return; }
      var pr = fetch(src).then(function (r) { return r.text(); }).then(function (txt) { window.__gbSvgCache[src] = txt; return txt; });
      window.__gbSvgCache[src] = pr;
      pr.then(setMarkup).catch(function () {});
    });

    // FAQ toggles
    root.querySelectorAll('[data-faq]').forEach(function (i) {
      if (i.dataset.bound) return;
      i.dataset.bound = '1';
      i.addEventListener('click', function () { i.classList.toggle('open'); });
    });

    // Hero accordion tabs
    root.querySelectorAll('[data-accordion]').forEach(function (i) {
      if (i.dataset.bound) return;
      i.dataset.bound = '1';
      var trigger = i.querySelector('.hero-accordion-trigger');
      if (trigger) trigger.addEventListener('click', function () {
        var open = i.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });

    // Size modal
    var modal = root.querySelector ? root.querySelector('[data-size-modal]') : null;
    if (modal && !modal.dataset.bound) {
      modal.dataset.bound = '1';
      document.querySelectorAll('[data-open-size-modal]').forEach(function (b) {
        b.addEventListener('click', function () { modal.classList.add('open'); });
      });
      modal.addEventListener('click', function (e) {
        if (e.target === modal || (e.target.closest && e.target.closest('[data-close-size-modal]'))) modal.classList.remove('open');
      });
    }

    // Variant grid + price sync (with sticky bar price)
    root.querySelectorAll('.variant-grid').forEach(function (grid) {
      if (grid.dataset.bound) return;
      grid.dataset.bound = '1';
      grid.addEventListener('change', function (e) {
        if (!e.target.classList.contains('variant-input')) return;
        grid.querySelectorAll('.variant').forEach(function (v) { v.classList.remove('active'); });
        var card = e.target.closest('.variant');
        if (card) {
          card.classList.add('active');
          var price = card.dataset.variantPrice;
          if (price) {
            document.querySelectorAll('[data-atc-price], [data-sticky-price]').forEach(function (el) { el.textContent = price; });
          }
        }
        try { var u = new URL(window.location.href); u.searchParams.set('variant', e.target.value); history.replaceState({}, '', u); } catch (err) {}
      });
    });

    // Gallery thumbs + nav
    var galleries = root.querySelectorAll ? root.querySelectorAll('.gallery-stack') : [];
    galleries.forEach(function (gallery) {
      if (gallery.dataset.bound) return;
      gallery.dataset.bound = '1';
      var mainImg = gallery.querySelector('.gallery-main-img');
      var thumbs = gallery.querySelectorAll('.gallery-thumb');
      function activateThumb(t) {
        var s = t.getAttribute('data-full-src');
        var a = t.getAttribute('data-full-alt');
        if (!s || !mainImg) return;
        mainImg.removeAttribute('srcset'); mainImg.removeAttribute('sizes');
        mainImg.setAttribute('src', s); if (a) mainImg.setAttribute('alt', a);
        thumbs.forEach(function (x) { x.classList.remove('active'); });
        t.classList.add('active');
      }
      function step(delta) {
        if (!thumbs.length) return;
        var current = 0;
        thumbs.forEach(function (x, i) { if (x.classList.contains('active')) current = i; });
        var next = (current + delta + thumbs.length) % thumbs.length;
        activateThumb(thumbs[next]);
      }
      if (mainImg && thumbs.length) {
        thumbs.forEach(function (t) {
          t.addEventListener('click', function (e) { e.preventDefault(); activateThumb(t); });
        });
        var prevBtn = gallery.querySelector('[data-gallery-prev]');
        var nextBtn = gallery.querySelector('[data-gallery-next]');
        if (prevBtn) prevBtn.addEventListener('click', function (e) { e.preventDefault(); step(-1); });
        if (nextBtn) nextBtn.addEventListener('click', function (e) { e.preventDefault(); step(1); });
      }
    });

    // Sticky ATC bar — show after main ATC scrolls out of view AND user scrolls up
    var stickyBar = document.querySelector('[data-sticky-atc]');
    var mainAtc = document.querySelector('.atc-btn');
    if (stickyBar && mainAtc && !stickyBar.dataset.bound) {
      stickyBar.dataset.bound = '1';

      var lastY = window.pageYOffset;
      var upAccum = 0;
      var DOWN_THRESHOLD = 6;   // dead-zone for jitter
      var UP_THRESHOLD = 30;    // px of cumulative scroll-up to qualify
      var SHOW_DELAY = 750;     // ms after scroll stops before showing
      var showTimer = null;

      function isMainAtcVisible() {
        var rect = mainAtc.getBoundingClientRect();
        return rect.top < (window.innerHeight - 40) && rect.bottom > 0;
      }
      function showBar() {
        stickyBar.classList.add('is-visible');
        stickyBar.setAttribute('aria-hidden', 'false');
      }
      function hideBar() {
        stickyBar.classList.remove('is-visible');
        stickyBar.setAttribute('aria-hidden', 'true');
      }

      function onScroll() {
        var y = window.pageYOffset;
        var delta = y - lastY;
        lastY = y;

        if (isMainAtcVisible()) {
          hideBar();
          upAccum = 0;
          clearTimeout(showTimer);
          return;
        }
        if (delta > DOWN_THRESHOLD) {
          // scrolling down — hide & reset
          hideBar();
          upAccum = 0;
          clearTimeout(showTimer);
        } else if (delta < -DOWN_THRESHOLD) {
          // scrolling up — accumulate, schedule show after pause
          upAccum += -delta;
          if (upAccum >= UP_THRESHOLD) {
            clearTimeout(showTimer);
            showTimer = setTimeout(function () {
              if (!isMainAtcVisible()) showBar();
            }, SHOW_DELAY);
          }
        }
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', function () {
        if (isMainAtcVisible()) hideBar();
      });

      var trigger = stickyBar.querySelector('[data-sticky-atc-trigger]');
      if (trigger) {
        trigger.addEventListener('click', function () {
          var form = document.querySelector('#ferment-product-form');
          if (form) {
            if (typeof form.requestSubmit === 'function') form.requestSubmit();
            else form.submit();
          }
        });
      }
    }
  }

  function init() { bindScope(document); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  document.addEventListener('shopify:section:load', function (e) { bindScope(e.target); });
})();
