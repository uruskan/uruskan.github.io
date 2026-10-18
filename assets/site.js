(function () {
  "use strict";
  var root = document.documentElement;

  var themeBtn = document.querySelector("[data-theme-toggle]");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var dark = root.dataset.theme
        ? root.dataset.theme === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.dataset.theme = dark ? "light" : "dark";
      try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
    });
  }

  var menuBtn = document.querySelector("[data-menu-toggle]");
  var links = document.querySelector(".navlinks");
  if (menuBtn && links) {
    menuBtn.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) { links.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
    });
  }

  var grid = document.querySelector(".post-grid");
  if (grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".post-card"));
    var search = document.getElementById("post-search");
    var tagSel = document.getElementById("post-tag");
    var typeSel = document.getElementById("post-type");
    var count = document.getElementById("post-count");
    var empty = document.getElementById("post-empty");

    var tags = {};
    cards.forEach(function (c) {
      (c.dataset.tags || "").split(",").forEach(function (t) { t = t.trim(); if (t) tags[t] = true; });
    });
    Object.keys(tags).sort(function (a, b) { return a.localeCompare(b); }).forEach(function (t) {
      var o = document.createElement("option");
      o.value = t; o.textContent = t;
      tagSel.appendChild(o);
    });

    var apply = function () {
      var q = (search.value || "").trim().toLowerCase();
      var tag = tagSel.value;
      var type = typeSel.value;
      var shown = 0;
      cards.forEach(function (c) {
        var ok = (!q || c.textContent.toLowerCase().indexOf(q) !== -1)
          && (!tag || (c.dataset.tags || "").split(",").map(function (t) { return t.trim(); }).indexOf(tag) !== -1)
          && (!type || c.dataset.type === type);
        c.hidden = !ok;
        if (ok) shown++;
      });
      count.textContent = shown === cards.length
        ? cards.length + (cards.length === 1 ? " post" : " posts")
        : shown + " of " + cards.length + " posts";
      empty.classList.toggle("show", shown === 0);
    };
    search.addEventListener("input", apply);
    tagSel.addEventListener("change", apply);
    typeSel.addEventListener("change", apply);
    var reset = document.getElementById("post-reset");
    if (reset) reset.addEventListener("click", function () { search.value = ""; tagSel.value = ""; typeSel.value = ""; apply(); });
    apply();
  }

  var sections = Array.prototype.slice.call(document.querySelectorAll("[data-section]"));
  if (sections.length && "IntersectionObserver" in window) {
    var marks = Array.prototype.slice.call(document.querySelectorAll(".navlinks a, .dots a"));
    var mark = function (id) {
      marks.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === id); });
    };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) mark("#" + en.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { io.observe(s); });
    window.addEventListener("scroll", function () {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        mark("#" + sections[sections.length - 1].id);
      }
    }, { passive: true });
  }
})();
