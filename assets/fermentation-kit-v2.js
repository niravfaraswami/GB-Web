/* ============================================================
 * fermentation-kit-v2.js
 * Section-scoped interactivity for FK v2 PDPs:
 *  - FAQ + hero-accordion toggles
 *  - Variant grid selection + URL ?variant= sync
 *  - Gallery thumb swap + prev/next + keyboard + touch swipe
 *  - Jar size modal open/close
 *  - Inline-SVG fetch + recolour for kit_icon snippets
 *  - Coupon code copy-to-clipboard
 *  - Reels: pause when offscreen (IntersectionObserver)
 * Reinitialises on shopify:section:load so the Theme Editor works.
 * ============================================================ */
(function () {
  'use strict';

  function init(scope) {
    var root = scope || document;
    var pages = [];
    if (root.matches && root.matches('.fk-page')) {
      pages.push(root);
    } else if (root.querySelectorAll) {
      root.querySelectorAll('.fk-page').forEach(function (p) { pages.push(p); });
    }
    if (!pages.length) return;
    pages.forEach(initPage);
  }

  function initPage(pdp) {
    if (pdp.dataset.fkv2Bound === '1') return;
    pdp.dataset.fkv2Bound = '1';

    // FAQ + hero accordion toggles
    pdp.querySelectorAll('[data-faq], [data-acc]').forEach(function (i) {
      i.addEventListener('click', function () { i.classList.toggle('open'); });
    });

    // Jar size modal
    var modal = pdp.querySelector('[data-size-modal]') || document.querySelector('[data-size-modal]');
    if (modal) {
      pdp.querySelectorAll('[data-open-size-modal]').forEach(function (b) {
        b.addEventListener('click', function () { modal.classList.add('open'); });
      });
      if (!modal.dataset.fkBound) {
        modal.dataset.fkBound = '1';
        modal.addEventListener('click', function (e) {
          if (e.target === modal || (e.target.closest && e.target.closest('[data-close-size-modal]'))) {
            modal.classList.remove('open');
          }
        });
      }
    }

    // Variant grid
    var grid = pdp.querySelector('.variant-grid');
    if (grid) {
      grid.addEventListener('change', function (e) {
        if (!e.target.classList.contains('variant-input')) return;
        grid.querySelectorAll('.variant').forEach(function (v) { v.classList.remove('active'); });
        var card = e.target.closest('.variant');
        if (card) card.classList.add('active');
        try {
          var u = new URL(window.location.href);
          u.searchParams.set('variant', e.target.value);
          history.replaceState({}, '', u);
        } catch (err) {}
      });
    }

    // Inline-SVG fetch + recolour
    window.__gbSvgCache = window.__gbSvgCache || {};
    function recolorSvg(svgRoot) {
      if (!svgRoot) return;
      var rgb = function (s) {
        var m = String(s).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        return m ? [+m[1], +m[2], +m[3]] : null;
      };
      var lightnessOf = function (c) {
        return (Math.max(c[0], c[1], c[2]) + Math.min(c[0], c[1], c[2])) / 2 / 255;
      };
      var transparentBlack = function (c) { return c[0] === 0 && c[1] === 0 && c[2] === 0; };
      svgRoot.querySelectorAll('*').forEach(function (el) {
        var cs = getComputedStyle(el);
        var fillC = rgb(cs.fill);
        var strokeC = rgb(cs.stroke);
        if (cs.fill && cs.fill !== 'none' && fillC && !(transparentBlack(fillC) && cs.fillOpacity === '1' && el.tagName === 'svg')) {
          if (cs.fill !== 'rgba(0, 0, 0, 0)') {
            el.setAttribute('data-fill-tone', lightnessOf(fillC) > 0.7 ? 'light' : 'dark');
          }
        }
        if (cs.stroke && cs.stroke !== 'none' && strokeC && cs.stroke !== 'rgba(0, 0, 0, 0)') {
          el.setAttribute('data-has-stroke', '1');
        }
      });
    }
    pdp.querySelectorAll('.kit-icon-svg[data-svg-src]').forEach(function (el) {
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
      var promise = fetch(src).then(function (r) { return r.text(); }).then(function (txt) {
        window.__gbSvgCache[src] = txt;
        return txt;
      });
      window.__gbSvgCache[src] = promise;
      promise.then(setMarkup).catch(function () { /* leave placeholder empty */ });
    });

    // Gallery thumb swap + prev/next + keyboard + touch
    var mainImg = pdp.querySelector('.gallery-main-img');
    var thumbs = pdp.querySelectorAll('.gallery-thumb');
    function activateThumb(t) {
      var s = t.getAttribute('data-full-src');
      var a = t.getAttribute('data-full-alt');
      if (!s || !mainImg) return;
      mainImg.removeAttribute('srcset'); mainImg.removeAttribute('sizes');
      mainImg.setAttribute('src', s);
      if (a) mainImg.setAttribute('alt', a);
      thumbs.forEach(function (x) { x.classList.remove('active'); });
      t.classList.add('active');
      try { t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' }); } catch (_) {}
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
      var prevBtn = pdp.querySelector('[data-gallery-prev]');
      var nextBtn = pdp.querySelector('[data-gallery-next]');
      if (prevBtn) prevBtn.addEventListener('click', function (e) { e.preventDefault(); step(-1); });
      if (nextBtn) nextBtn.addEventListener('click', function (e) { e.preventDefault(); step(1); });
      var galleryMain = pdp.querySelector('.gallery-main');
      if (galleryMain) {
        galleryMain.setAttribute('tabindex', '0');
        galleryMain.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowLeft')  { e.preventDefault(); step(-1); }
          if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
        });
        var touchStartX = null;
        galleryMain.addEventListener('touchstart', function (e) {
          touchStartX = e.touches[0].clientX;
        }, { passive: true });
        galleryMain.addEventListener('touchend', function (e) {
          if (touchStartX === null) return;
          var dx = e.changedTouches[0].clientX - touchStartX;
          if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
          touchStartX = null;
        }, { passive: true });
      }
    }

    // Coupon code copy-to-clipboard
    pdp.querySelectorAll('[data-coupon-code]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var code = btn.getAttribute('data-clip') || btn.textContent.trim();
        var done = function () {
          btn.classList.add('is-copied');
          setTimeout(function () { btn.classList.remove('is-copied'); }, 1500);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).then(done).catch(function () { fallbackCopy(code); done(); });
        } else {
          fallbackCopy(code);
          done();
        }
      });
    });
    function fallbackCopy(text) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (_) {}
      document.body.removeChild(ta);
    }

    // Reels: pause when offscreen
    var reelVideos = pdp.querySelectorAll('.reel-tile video');
    if (reelVideos.length && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var v = entry.target;
          if (entry.isIntersecting) {
            var play = v.play();
            if (play && play.catch) play.catch(function () {});
          } else if (typeof v.pause === 'function') {
            v.pause();
          }
        });
      }, { threshold: 0.3 });
      reelVideos.forEach(function (v) { io.observe(v); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(); });
  } else {
    init();
  }
  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
})();
