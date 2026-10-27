/*
 * Cookie consent + the Google tag, for every page of avivardi.online (the React homepage and the
 * static SEO pages both load this one file, so the banner, the consent rules and the conversion
 * ids exist in exactly one place).
 *
 * Google Consent Mode v2, basic implementation: all four consent types default to "denied", and
 * gtag.js is not even requested until the visitor presses "מאשר". Before that nothing at all is
 * sent to Google — not a pageview, not a cookieless ping, not a queued conversion (the click
 * listener below drops conversions while consent is missing instead of queueing them).
 *
 * The choice lives in localStorage under KEY. Any element with [data-cookie-settings], or a call
 * to window.avvConsent.open(), re-opens the banner; choosing "רק הכרחיות" after having agreed
 * clears Google's first-party cookies and reloads, because a loaded gtag.js cannot be unloaded.
 */
(function () {
  var TAG = "AW-18195393649";
  var CONV_WHATSAPP = "AW-18195393649/MprvCJ2By-kcEPHYnuRD"; // WhatsApp Click (id 7737622685)
  var CONV_PHONE = "AW-18195393649/gblNCKCBy-kcEPHYnuRD"; // Phone Click (id 7737622688)
  var KEY = "avv-consent-v1";
  var ALL = ["ad_storage", "ad_user_data", "ad_personalization", "analytics_storage"];

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  function consent(value) {
    var o = {};
    for (var i = 0; i < ALL.length; i++) o[ALL[i]] = value;
    return o;
  }
  gtag("consent", "default", consent("denied"));

  function read() {
    try { var s = JSON.parse(localStorage.getItem(KEY) || "null"); return s && s.v; } catch (e) { return null; }
  }
  function write(v) {
    try { localStorage.setItem(KEY, JSON.stringify({ v: v, t: new Date().toISOString() })); } catch (e) {}
  }

  var choice = read(); // "granted" | "denied" | null (never asked)
  var loaded = false;

  function loadGoogleTag() {
    if (loaded) return;
    loaded = true;
    gtag("consent", "update", consent("granted"));
    gtag("js", new Date());
    gtag("config", TAG);
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + TAG;
    document.head.appendChild(s);
  }

  function clearGoogleCookies() {
    var host = location.hostname;
    var domains = ["", host, "." + host, "." + host.replace(/^www\./, "")];
    document.cookie.split(";").forEach(function (c) {
      var name = c.split("=")[0].trim();
      if (!/^(_gcl|_ga|_gid|_gac|_gat)/.test(name)) return;
      domains.forEach(function (d) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + (d ? "; domain=" + d : "");
      });
    });
  }

  if (choice === "granted") loadGoogleTag();

  // One delegated listener catches every tel: / WhatsApp link, including ones React renders later.
  // Capture phase so a stopPropagation elsewhere can't swallow it; never preventDefault — gtag
  // ships conversions via sendBeacon, which survives the navigation the link is about to cause.
  document.addEventListener("click", function (e) {
    if (choice !== "granted") return;
    var a = e.target && e.target.closest && e.target.closest('a[href^="tel:"], a[href*="wa.me"]');
    if (!a) return;
    gtag("event", "conversion", { send_to: a.href.indexOf("wa.me") !== -1 ? CONV_WHATSAPP : CONV_PHONE });
  }, true);

  /* ------------------------------------------------------------------ banner */

  var CSS =
    "#avv-consent{position:fixed;z-index:2147483000;inset-inline:1rem;bottom:1rem;margin:0 auto;max-width:34rem;" +
    "background:#1c1917;color:#faf7f1;border:1px solid rgba(212,162,38,.45);border-radius:1rem;" +
    "box-shadow:0 18px 40px -12px rgba(0,0,0,.45);padding:1rem 1.15rem;font:400 .9rem/1.6 Heebo,system-ui,Arial,sans-serif;text-align:right}" +
    "#avv-consent:focus{outline:3px solid #d4a226;outline-offset:2px}" +
    "#avv-consent p{margin:0 0 .8rem}" +
    "#avv-consent a{color:#e8c468;text-decoration:underline;font-weight:700}" +
    "#avv-consent .avv-row{display:flex;flex-wrap:wrap;gap:.6rem}" +
    "#avv-consent button{font:inherit;font-weight:800;cursor:pointer;border-radius:.55rem;padding:.6rem 1.3rem;min-height:44px}" +
    "#avv-consent .avv-yes{background:#d4a226;color:#0c0a09;border:2px solid #d4a226}" +
    "#avv-consent .avv-no{background:transparent;color:#faf7f1;border:2px solid rgba(250,247,241,.6)}" +
    "#avv-consent button:hover{opacity:.9}" +
    "#avv-consent button:focus-visible,#avv-consent a:focus-visible{outline:3px solid #faf7f1;outline-offset:2px}" +
    "#avv-consent .avv-now{font-size:.8rem;color:#d6d3d1;margin:-.3rem 0 .8rem}";

  var el = null;
  var returnFocusTo = null;

  function close() {
    if (el) { el.remove(); el = null; }
    document.removeEventListener("keydown", onKey);
    if (returnFocusTo && document.contains(returnFocusTo)) returnFocusTo.focus();
    returnFocusTo = null;
  }

  function onKey(e) {
    // Esc only dismisses a re-opened banner; on first visit a choice is still needed.
    if (e.key === "Escape" && choice) close();
  }

  function decide(v) {
    var wasGranted = choice === "granted";
    choice = v;
    write(v);
    if (v === "granted") {
      loadGoogleTag();
      close();
    } else if (wasGranted) {
      gtag("consent", "update", consent("denied"));
      clearGoogleCookies();
      location.reload();
    } else {
      close();
    }
  }

  function show(focus) {
    if (!document.body) return;
    if (el) { if (focus) el.focus(); return; }
    if (!document.getElementById("avv-consent-css")) {
      var st = document.createElement("style");
      st.id = "avv-consent-css";
      st.textContent = CSS;
      document.head.appendChild(st);
    }
    el = document.createElement("div");
    el.id = "avv-consent";
    el.setAttribute("role", "region");
    el.setAttribute("aria-label", "הגדרות עוגיות");
    el.setAttribute("dir", "rtl");
    el.setAttribute("lang", "he");
    el.tabIndex = -1;
    el.innerHTML =
      "<p>האתר משתמש בעוגיות של Google כדי למדוד את יעילות המודעות שלנו (למשל, אם הגעתם ממודעה והתקשרתם). " +
      "הן נטענות רק אם תאשרו. <a href=\"/#privacy\">מדיניות הפרטיות</a></p>" +
      (choice ? "<p class=\"avv-now\">הבחירה הנוכחית: " + (choice === "granted" ? "אישרתם עוגיות מדידה" : "רק עוגיות הכרחיות") + "</p>" : "") +
      "<div class=\"avv-row\">" +
      "<button type=\"button\" class=\"avv-yes\" data-v=\"granted\">מאשר</button>" +
      "<button type=\"button\" class=\"avv-no\" data-v=\"denied\">רק הכרחיות</button>" +
      "</div>";
    el.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-v]");
      if (b) decide(b.getAttribute("data-v"));
      // Following the privacy link from the homepage only changes the hash; let the dialog take over.
      if (e.target.closest("a") && choice) close();
    });
    // First in the tab order, so keyboard and screen-reader users meet it before the page.
    document.body.insertBefore(el, document.body.firstChild);
    document.addEventListener("keydown", onKey);
    if (focus) el.focus();
  }

  window.avvConsent = {
    open: function () {
      returnFocusTo = document.activeElement;
      show(true);
    },
  };

  document.addEventListener("click", function (e) {
    var t = e.target && e.target.closest && e.target.closest("[data-cookie-settings]");
    if (!t) return;
    e.preventDefault();
    window.avvConsent.open();
  });

  function init() { if (!choice) show(false); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
