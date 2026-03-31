/**
 * Construction Capital Analytics & Heatmap Tracker
 * Lightweight, cookieless, GDPR-friendly
 *
 * Usage: <script defer src="https://yourdomain.com/t.js" data-site="SITE_ID"></script>
 */
(function () {
  "use strict";

  var script = document.currentScript;
  if (!script) return;

  var siteId = script.getAttribute("data-site");
  if (!siteId) return;

  // Derive the collection endpoint from the script's origin
  var origin = new URL(script.src).origin;
  var endpoint = origin + "/api/collect";

  // ── Session & Visitor ──────────────────────────────────────
  var SESSION_KEY = "_cca_s";
  var VISITOR_KEY = "_cca_v";

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
  }

  var sessionId;
  try {
    sessionId = sessionStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = uid();
      sessionStorage.setItem(SESSION_KEY, sessionId);
    }
  } catch (e) {
    sessionId = uid();
  }

  var visitorId;
  var isNewVisitor = false;
  try {
    visitorId = localStorage.getItem(VISITOR_KEY);
    if (!visitorId) {
      visitorId = uid();
      isNewVisitor = true;
      localStorage.setItem(VISITOR_KEY, visitorId);
    }
  } catch (e) {
    visitorId = uid();
    isNewVisitor = true;
  }

  // ── Event Queue & Batching ─────────────────────────────────
  var queue = [];
  var FLUSH_MS = 3000;
  var MAX_BATCH = 20;
  var timer = null;

  function flush() {
    if (queue.length === 0) return;
    var batch = queue.splice(0, MAX_BATCH);
    var payload = JSON.stringify({
      site_id: siteId,
      session_id: sessionId,
      visitor_id: visitorId,
      is_new: isNewVisitor,
      events: batch,
    });

    // Prefer sendBeacon for reliability on page unload
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, payload);
    } else {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", endpoint, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(payload);
    }
  }

  function schedule() {
    if (timer) return;
    timer = setTimeout(function () {
      timer = null;
      flush();
    }, FLUSH_MS);
  }

  function track(type, data) {
    queue.push({
      t: type,
      ts: Date.now(),
      d: data || {},
    });
    if (queue.length >= MAX_BATCH) {
      flush();
    } else {
      schedule();
    }
  }

  // ── Describe Element (for click heatmaps) ──────────────────
  function descEl(el) {
    if (!el || !el.tagName) return "";
    var s = el.tagName.toLowerCase();
    if (el.id) s += "#" + el.id;
    if (el.className && typeof el.className === "string") {
      s += "." + el.className.trim().split(/\s+/).slice(0, 2).join(".");
    }
    var text = (el.textContent || "").trim().substring(0, 50);
    if (text) s += "[" + text + "]";
    return s;
  }

  // ── UTM Helper ─────────────────────────────────────────────
  function param(name) {
    try {
      return new URL(location.href).searchParams.get(name) || "";
    } catch (e) {
      return "";
    }
  }

  // ── Page View ──────────────────────────────────────────────
  function trackPageView() {
    track("pageview", {
      url: location.href,
      path: location.pathname,
      ref: document.referrer,
      title: document.title,
      sw: screen.width,
      sh: screen.height,
      vw: window.innerWidth,
      vh: window.innerHeight,
      lang: navigator.language,
      utm_s: param("utm_source"),
      utm_m: param("utm_medium"),
      utm_c: param("utm_campaign"),
    });
  }

  trackPageView();

  // ── Click Tracking (Heatmap) ───────────────────────────────
  document.addEventListener(
    "click",
    function (e) {
      track("click", {
        x: e.pageX,
        y: e.pageY,
        vx: e.clientX,
        vy: e.clientY,
        path: location.pathname,
        el: descEl(e.target),
        pw: document.documentElement.scrollWidth,
        ph: document.documentElement.scrollHeight,
      });
    },
    true
  );

  // ── Scroll Depth ───────────────────────────────────────────
  var maxScroll = 0;
  var scrollMarks = { 25: false, 50: false, 75: false, 100: false };

  function onScroll() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    var pct = Math.min(Math.round((scrollTop / docHeight) * 100), 100);

    if (pct > maxScroll) {
      maxScroll = pct;
      var marks = [25, 50, 75, 100];
      for (var i = 0; i < marks.length; i++) {
        if (pct >= marks[i] && !scrollMarks[marks[i]]) {
          scrollMarks[marks[i]] = true;
          track("scroll", { depth: marks[i], path: location.pathname });
        }
      }
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // ── SPA Support (History API) ──────────────────────────────
  var origPushState = history.pushState;
  var origReplaceState = history.replaceState;

  function onRouteChange() {
    // Reset scroll tracking for new page
    maxScroll = 0;
    scrollMarks = { 25: false, 50: false, 75: false, 100: false };
    // Small delay to let the page update
    setTimeout(trackPageView, 100);
  }

  history.pushState = function () {
    origPushState.apply(this, arguments);
    onRouteChange();
  };

  history.replaceState = function () {
    origReplaceState.apply(this, arguments);
    onRouteChange();
  };

  window.addEventListener("popstate", onRouteChange);

  // ── Flush on Page Unload ───────────────────────────────────
  function onLeave() {
    track("leave", {
      path: location.pathname,
      scroll: maxScroll,
      dur: Math.round((Date.now() - loadTime) / 1000),
    });
    flush();
  }

  var loadTime = Date.now();

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") onLeave();
  });

  window.addEventListener("pagehide", onLeave);
})();
