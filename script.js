/* =========================================================
   PD Cempin — skripta
   ========================================================= */
(function () {
  "use strict";

  var root = document.documentElement;
  var body = document.body;
  var header = document.querySelector(".site-header");
  var hero = document.querySelector(".hero");
  var isHome = body.classList.contains("is-home");
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  root.classList.remove("no-js");

  /* ---------- Temni / svetli način ---------- */
  // Privzeto sledi sistemu (Windows, macOS, Android, iOS, Chrome).
  // Ko uporabnik klikne krog, se izbira shrani.
  var toggle = document.querySelector(".theme-toggle");
  var systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  function currentTheme() {
    return root.getAttribute("data-theme") || (systemDark.matches ? "dark" : "light");
  }
  function setLabel() {
    if (!toggle) return;
    var dark = currentTheme() === "dark";
    toggle.setAttribute("aria-pressed", dark ? "true" : "false");
    toggle.setAttribute("aria-label", dark ? "Preklopi na svetli način" : "Preklopi na temni način");
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("cempin-theme", next); } catch (e) {}
      setLabel();
    });
  }
  // Če uporabnik ni sam izbral, sledimo spremembam sistema v živo
  systemDark.addEventListener("change", function () {
    var saved = null;
    try { saved = localStorage.getItem("cempin-theme"); } catch (e) {}
    if (!saved) { root.removeAttribute("data-theme"); setLabel(); }
  });
  setLabel();

  /* ---------- Mobilni meni ---------- */
  var menuBtn = document.querySelector(".menu-toggle");
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = body.classList.toggle("menu-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      updateHeader();
    });
    document.querySelectorAll(".main-nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        body.classList.remove("menu-open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Glava na naslovni strani ---------- */
  // Najprej je vidna samo slika. Glava se pokaže, ko z miško
  // prideš na vrh strani, ali ko odscrollaš navzdol.
  var mouseNearTop = false;
  var hideTimer = null;

  function heroBottom() {
    return hero ? hero.offsetHeight - header.offsetHeight : 0;
  }

  function updateHeader() {
    if (!isHome || !header) return;
    var y = window.scrollY;
    var pastHero = y > heroBottom();
    var scrolledSome = y > (canHover ? heroBottom() * 0.5 : 40);
    var focused = header.contains(document.activeElement) && document.activeElement !== body;
    // Na telefonu (brez miške) je glava vidna takoj ob odprtju strani
    var show = !canHover || mouseNearTop || scrolledSome || body.classList.contains("menu-open") || focused;

    header.classList.toggle("is-visible", show);
    header.classList.toggle("over-hero", !pastHero && !body.classList.contains("menu-open"));
  }

  if (isHome && header) {
    if (canHover) {
      document.addEventListener("mousemove", function (e) {
        var near = e.clientY < 110;
        if (near) {
          clearTimeout(hideTimer);
          if (!mouseNearTop) { mouseNearTop = true; updateHeader(); }
        } else if (mouseNearTop) {
          // majhen zamik, da glava ne utripa
          clearTimeout(hideTimer);
          hideTimer = setTimeout(function () { mouseNearTop = false; updateHeader(); }, 350);
        }
      }, { passive: true });
      document.addEventListener("mouseleave", function () {
        mouseNearTop = false; updateHeader();
      });
    }
    header.addEventListener("focusin", updateHeader);
    header.addEventListener("focusout", function () { setTimeout(updateHeader, 0); });
    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("resize", updateHeader);
    updateHeader();
  }

  /* ---------- Razkrivanje vsebine ob scrollu ---------- */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Leta od ustanovitve ---------- */
  document.querySelectorAll("[data-years-since]").forEach(function (el) {
    var years = new Date().getFullYear() - parseInt(el.getAttribute("data-years-since"), 10);
    el.textContent = years;
    el.setAttribute("data-count", years);
  });

  /* ---------- Štetje številk ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var end = parseInt(el.getAttribute("data-count"), 10);
        var start = parseInt(el.getAttribute("data-from") || "0", 10);
        co.unobserve(el);
        if (reduce) { el.textContent = end; return; }
        var t0 = null, dur = 1600;
        function step(t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(start + (end - start) * eased);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ---------- Leto v nogi ---------- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
