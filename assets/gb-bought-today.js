/* ============================================================
   gb-bought-today — IST-time-of-day-aware "X people bought today"
   counter for PDPs. Renders deterministic per-product daily totals
   that grow along a realistic traffic curve.

   Reset cadence: midnight IST (UTC+5:30). Count for a given
   {product, IST date} is stable across refreshes — same seed.
   ============================================================ */
(function () {
  'use strict';

  // ---- Daily target ranges per category --------------------------
  // Tweak here if the merchant changes their volume estimates.
  var RANGES = {
    'best':         [100, 150],
    'kit':          [45, 55],
    'kanji-refill': [25, 35],
    'refill-other': [15, 25],
    'culture':      [5, 10],
    'jars-tools':   [3, 8],
    'default':      [10, 20]
  };

  // ---- Floor (minimum count near midnight IST) -------------------
  // Starting from 0 looks dead to a visitor refreshing at 12:01 AM.
  // Each category has a floor that the count never drops below; the
  // hourly curve interpolates from FLOOR → TARGET across the day.
  //
  // A two-element array means "pick a value in [low, high] for this
  // {product, day}" so two products in the same category don't show
  // the same floor.
  var FLOORS = {
    'best':         12,        // double-digit
    'kit':          12,        // double-digit
    'kanji-refill': 10,        // double-digit
    'refill-other': [3, 7],    // 3–7 range
    'culture':      3,         // start at 3
    'jars-tools':   3,         // not specified by merchant; mirrors culture
    'default':      5
  };

  // ---- Hourly weights, IST. Sums to 1.0. -------------------------
  // Models a typical Indian D2C traffic pattern: dead overnight,
  // gentle morning ramp, mid-day plateau, evening peak (6–10 PM),
  // late-night taper. Index = hour (0..23).
  var HOURLY = [
    0.005, 0.005, 0.005, 0.005, 0.005, 0.010,  // 00–06  3.5%
    0.020, 0.030, 0.040, 0.050,                // 06–10  14%
    0.060, 0.070, 0.070, 0.060,                // 10–14  26%
    0.050, 0.060, 0.070, 0.080,                // 14–18  26%
    0.080, 0.070, 0.060, 0.050,                // 18–22  26%
    0.020, 0.005                               // 22–24  2.5%
  ];

  // ---- Deterministic PRNG (mulberry32) ---------------------------
  function hashString(s) {
    var h = 1779033703 ^ s.length;
    for (var i = 0; i < s.length; i++) {
      h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return h >>> 0;
  }
  function mulberry32(seed) {
    return function () {
      seed = (seed + 0x6D2B79F5) | 0;
      var t = seed;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---- IST date + hour fraction ----------------------------------
  function getIST() {
    var nowMs = Date.now();
    var istMs = nowMs + (5 * 60 + 30) * 60 * 1000;
    var d = new Date(istMs);
    var y = d.getUTCFullYear();
    var m = String(d.getUTCMonth() + 1).padStart(2, '0');
    var day = String(d.getUTCDate()).padStart(2, '0');
    var hourFrac =
      d.getUTCHours() +
      d.getUTCMinutes() / 60 +
      d.getUTCSeconds() / 3600;
    return { date: y + '-' + m + '-' + day, hourFrac: hourFrac };
  }

  // ---- Compute the count for a product right now -----------------
  function compute(category, handle) {
    var ist = getIST();
    var seed = hashString((handle || '') + ':' + ist.date);
    var rand = mulberry32(seed);

    var range = RANGES[category] || RANGES['default'];
    // Daily target: random within range, but stable for the day.
    var target = Math.floor(range[0] + rand() * (range[1] - range[0] + 1));

    // Cumulative weight from 0 → hourFrac.
    var full = Math.floor(ist.hourFrac);
    var part = ist.hourFrac - full;
    var cum = 0;
    for (var h = 0; h < full && h < 24; h++) cum += HOURLY[h];
    if (full < 24) cum += HOURLY[full] * part;

    // A small per-product jitter ±1 unit so two products in the same
    // category at the same minute don't show identical counts. Stable
    // for the day via a second draw from the seeded PRNG.
    var jitter = Math.floor(rand() * 3) - 1; // -1, 0, or 1

    // Floor: minimum count even at midnight, so the page doesn't open
    // showing "0 people bought this today" (looks dead). Array entries
    // mean "draw deterministically from [low, high]" so two products
    // in the same category land on different floors.
    var floorSpec = FLOORS[category] || FLOORS['default'];
    var floor;
    if (Array.isArray(floorSpec)) {
      floor = Math.floor(floorSpec[0] + rand() * (floorSpec[1] - floorSpec[0] + 1));
    } else {
      floor = floorSpec;
    }

    // Interpolate FLOOR → TARGET along the hourly curve. cum=0 (mid-
    // night) gives ≈floor; cum=1 (end of day) gives ≈target.
    var raw = floor + (target - floor) * cum + jitter;
    return Math.max(floor, Math.floor(raw));
  }

  function paint() {
    var els = document.querySelectorAll('[data-bought-today]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var cat = el.getAttribute('data-bought-category') || 'default';
      var handle = el.getAttribute('data-bought-handle') || '';
      el.textContent = compute(cat, handle);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', paint);
  } else {
    paint();
  }
})();
