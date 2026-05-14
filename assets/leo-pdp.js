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
      var UP_THRESHOLD = parseInt(stickyBar.dataset.upThreshold, 10) || 30;  // px of cumulative scroll-up
      var SHOW_DELAY = parseInt(stickyBar.dataset.showDelay, 10) || 750;     // ms after scroll stops
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

/* GB Learn Blog — TOC smooth-scroll + scroll-spy */
(function () {
  if (window.__gbLearnBlogInit) return;
  window.__gbLearnBlogInit = true;

  function init() {
    var tocLinks = document.querySelectorAll('.article-toc a');
    if (!tocLinks.length) return;
    var sections = document.querySelectorAll('.article-section');
    if (!sections.length) return;

    // Smooth scroll
    tocLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href.charAt(0) !== '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // Scroll-spy
    var scrollTimer = null;
    function spy() {
      var current = '';
      sections.forEach(function (s) {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
      });
      tocLinks.forEach(function (l) {
        l.classList.toggle('active', l.getAttribute('href') === '#' + current);
      });
    }
    window.addEventListener('scroll', function () {
      if (scrollTimer) return;
      scrollTimer = setTimeout(function () { spy(); scrollTimer = null; }, 50);
    }, { passive: true });
    spy();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  document.addEventListener('shopify:section:load', init);
})();

/* GB Learn Recipe — YouTube lazy-load on click (also reused by Guide template) */
(function () {
  if (window.__gbVideoThumbInit) return;
  window.__gbVideoThumbInit = true;

  function init(scope) {
    var root = scope || document;
    var thumbs = root.querySelectorAll('[data-gb-video-thumb]');
    thumbs.forEach(function (t) {
      if (t.dataset.bound) return;
      t.dataset.bound = '1';
      t.addEventListener('click', function () {
        var id = t.getAttribute('data-youtube-id');
        if (!id) return;
        var iframe = document.createElement('iframe');
        iframe.setAttribute('width', '100%');
        iframe.setAttribute('style', 'aspect-ratio: 16/9; border: 0; display: block;');
        iframe.setAttribute('src', 'https://www.youtube.com/embed/' + id + '?autoplay=1');
        iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        t.parentNode.replaceChild(iframe, t);
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); });
  else init();
  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
})();

/* GB Learn Guide — multi-pane navigation state machine */
(function () {
  if (window.__gbLearnGuideInit) return;
  window.__gbLearnGuideInit = true;

  function init() {
    var body = document.querySelector('[data-gb-guide-body]');
    if (!body) return;
    var panes = body.querySelectorAll('[data-gb-guide-pane]');
    var links = body.querySelectorAll('[data-gb-guide-link]');
    var prevBtns = body.querySelectorAll('[data-gb-guide-prev]');
    var nextBtns = body.querySelectorAll('[data-gb-guide-next]');
    var fill = document.querySelector('[data-gb-guide-progress-fill]');
    var label = document.querySelector('[data-gb-guide-progress-label]');
    var totalSections = parseInt(body.getAttribute('data-pane-count'), 10) || links.length;
    if (!totalSections) return;

    var current = 0;

    function show(idx) {
      // idx can be 0..totalSections-1, or 'complete' (== totalSections)
      var isComplete = idx >= totalSections;
      // Hide all panes
      panes.forEach(function (p) { p.classList.remove('active'); });
      // Show the target pane
      var target;
      if (isComplete) {
        target = body.querySelector('[data-gb-guide-pane][data-section-idx="complete"]');
      } else {
        target = body.querySelector('[data-gb-guide-pane][data-section-idx="' + idx + '"]');
      }
      if (target) target.classList.add('active');

      // Sidebar links
      links.forEach(function (link, i) {
        link.classList.remove('active', 'completed');
        if (isComplete || i < idx) link.classList.add('completed');
        else if (i === idx) link.classList.add('active');
      });

      // Progress bar
      var pct = isComplete ? 100 : ((idx + 1) / totalSections) * 100;
      if (fill) fill.style.width = pct + '%';
      if (label) {
        if (isComplete) label.textContent = 'COMPLETE';
        else label.textContent = 'SECTION ' + (idx + 1) + ' OF ' + totalSections;
      }

      // Smooth scroll to top of pane
      try {
        var top = body.getBoundingClientRect().top + window.scrollY - 140;
        window.scrollTo({ top: top, behavior: 'smooth' });
      } catch (_) { window.scrollTo(0, 0); }

      current = isComplete ? totalSections : idx;

      // Optional persistence
      try { localStorage.setItem('gb-guide:' + (window.location.pathname || '') + ':section', String(current)); } catch (_) {}
    }

    // Wire sidebar links
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var idx = parseInt(link.getAttribute('data-section-idx'), 10);
        if (!isNaN(idx)) show(idx);
      });
    });

    // Wire prev/next buttons
    prevBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (current > 0) show(current - 1);
      });
    });
    nextBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        show(current + 1);
      });
    });

    // Restore from localStorage
    try {
      var saved = parseInt(localStorage.getItem('gb-guide:' + (window.location.pathname || '') + ':section'), 10);
      if (!isNaN(saved) && saved >= 0 && saved <= totalSections) {
        show(saved);
        return;
      }
    } catch (_) {}
    show(0);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  document.addEventListener('shopify:section:load', init);
})();

/* ============================================================
   GB Collection Shop — filter, sort, count
   ============================================================ */
(function () {
  if (window.__gbCollShopInit) return;
  window.__gbCollShopInit = true;

  function readFilters(scope) {
    var f = { subcategory: [], bucket: [], tag: [], instock: false };
    scope.querySelectorAll('input[type="checkbox"][data-filter]').forEach(function (cb) {
      if (!cb.checked) return;
      var key = cb.getAttribute('data-filter');
      if (key === 'instock') { f.instock = true; return; }
      if (f[key]) f[key].push(cb.value);
    });
    return f;
  }

  function cardMatches(card, f) {
    if (f.subcategory.length && f.subcategory.indexOf(card.getAttribute('data-subcat')) === -1) return false;
    if (f.bucket.length && f.bucket.indexOf(card.getAttribute('data-bucket')) === -1) return false;
    if (f.tag.length) {
      var tags = (card.getAttribute('data-tags') || '').split('|');
      for (var i = 0; i < f.tag.length; i++) {
        if (tags.indexOf(f.tag[i]) === -1) return false;
      }
    }
    if (f.instock && card.getAttribute('data-instock') !== '1') return false;
    return true;
  }

  function applyFilters(scope) {
    var grid = scope.querySelector('[data-gb-coll-grid]');
    if (!grid) return;
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.prod-card'));
    var f = readFilters(scope);
    var visible = 0;
    cards.forEach(function (card) {
      var ok = cardMatches(card, f);
      card.classList.toggle('hidden', !ok);
      if (ok) visible++;
    });
    var total = cards.length;
    var countEl = scope.querySelector('[data-gb-coll-count]');
    if (countEl) countEl.innerHTML = 'Showing <strong>' + visible + '</strong> of ' + total + ' products';
    var empty = scope.querySelector('[data-gb-coll-empty]');
    if (empty) empty.classList.toggle('show', visible === 0 && total > 0);
    var active = f.subcategory.length + f.bucket.length + f.tag.length + (f.instock ? 1 : 0);
    scope.querySelectorAll('[data-gb-coll-active-count]').forEach(function (el) {
      el.textContent = active + ' active';
    });
    scope.querySelectorAll('[data-gb-coll-active-badge]').forEach(function (el) {
      el.textContent = active;
      el.classList.toggle('on', active > 0);
    });
  }

  function applySort(scope) {
    var grid = scope.querySelector('[data-gb-coll-grid]');
    var sel = scope.querySelector('[data-gb-coll-sort]');
    if (!grid || !sel) return;
    var mode = sel.value;
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.prod-card'));
    cards.sort(function (a, b) {
      switch (mode) {
        case 'newest':
          return parseFloat(a.getAttribute('data-days') || '0') - parseFloat(b.getAttribute('data-days') || '0');
        case 'rating':
          return parseFloat(b.getAttribute('data-rating') || '0') - parseFloat(a.getAttribute('data-rating') || '0');
        case 'price-asc':
          return parseFloat(a.getAttribute('data-price') || '0') - parseFloat(b.getAttribute('data-price') || '0');
        case 'price-desc':
          return parseFloat(b.getAttribute('data-price') || '0') - parseFloat(a.getAttribute('data-price') || '0');
        case 'popular':
        default:
          return parseFloat(b.getAttribute('data-reviews') || '0') - parseFloat(a.getAttribute('data-reviews') || '0');
      }
    });
    cards.forEach(function (c) { grid.appendChild(c); });
  }

  function computeFilterCounts(scope) {
    var grid = scope.querySelector('[data-gb-coll-grid]');
    if (!grid) return;
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.prod-card'));
    scope.querySelectorAll('[data-count-subcategory]').forEach(function (el) {
      var v = el.getAttribute('data-count-subcategory');
      el.textContent = cards.filter(function (c) { return c.getAttribute('data-subcat') === v; }).length;
    });
    scope.querySelectorAll('[data-count-bucket]').forEach(function (el) {
      var v = el.getAttribute('data-count-bucket');
      el.textContent = cards.filter(function (c) { return c.getAttribute('data-bucket') === v; }).length;
    });
    scope.querySelectorAll('[data-count-tag]').forEach(function (el) {
      var v = el.getAttribute('data-count-tag');
      el.textContent = cards.filter(function (c) {
        return ((c.getAttribute('data-tags') || '').split('|')).indexOf(v) !== -1;
      }).length;
    });
  }

  function clearFilters(scope) {
    scope.querySelectorAll('input[type="checkbox"][data-filter]').forEach(function (cb) { cb.checked = false; });
    applyFilters(scope);
  }

  function initOne(section) {
    if (section.__gbCollWired) return;
    section.__gbCollWired = true;

    section.querySelectorAll('input[type="checkbox"][data-filter]').forEach(function (cb) {
      cb.addEventListener('change', function () { applyFilters(section); });
    });
    section.querySelectorAll('[data-gb-coll-clear]').forEach(function (btn) {
      btn.addEventListener('click', function () { clearFilters(section); });
    });
    var sortSel = section.querySelector('[data-gb-coll-sort]');
    if (sortSel) sortSel.addEventListener('change', function () { applySort(section); });

    var sidebar = section.querySelector('[data-gb-coll-sidebar]');
    section.querySelectorAll('[data-gb-coll-open]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (sidebar) sidebar.classList.add('open');
        document.body.classList.add('gb-coll-drawer-open');
      });
    });
    section.querySelectorAll('[data-gb-coll-close]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (sidebar) sidebar.classList.remove('open');
        document.body.classList.remove('gb-coll-drawer-open');
      });
    });

    computeFilterCounts(section);
    applyFilters(section);
  }

  function init() {
    document.querySelectorAll('.coll-shop').forEach(initOne);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  document.addEventListener('shopify:section:load', init);
})();

/* ============================================================
 * Alternating section backgrounds (white / cream)
 * Walks rendered `.ferment-pdp-leo` sections in DOM order and
 * paints them white / cream alternately. Empty sections never
 * emit `.ferment-pdp-leo`, so the pattern stays correct across
 * gating-metafield gaps. Sticky ATC lacks the marker class and
 * is naturally skipped. Mirrors the fkv3 shim, scoped via the
 * leo marker so it applies to every leo-based product template
 * (spice-refill-v2, prebiotic-v2, baking-v2, etc.).
 * ============================================================ */
(function () {
  'use strict';
  var COLORS = ['#ffffff', '#fff9ee'];

  function alternateBackgrounds() {
    var nodes = document.querySelectorAll('.ferment-pdp-leo');
    if (!nodes.length) return;
    Array.prototype.forEach.call(nodes, function (el, i) {
      var bg = COLORS[i % 2];
      el.style.background = bg;
      var outer = el.parentElement;
      if (outer && outer.classList && outer.classList.contains('shopify-section')) {
        outer.style.background = bg;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', alternateBackgrounds);
  } else {
    alternateBackgrounds();
  }
  document.addEventListener('shopify:section:load', alternateBackgrounds);
  document.addEventListener('shopify:section:unload', alternateBackgrounds);
})();
