/* RIMUCHAHUI · 内页通用动效
 * - IntersectionObserver → .in-view（reveal / mag-section / page-reveal）
 * - [data-stagger] 逐字标题拆分（SSR 已有文本，这里仅拆 char spans）
 */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function splitStagger() {
    document.querySelectorAll("[data-stagger]").forEach(function (el) {
      if (el.dataset.staggerDone) return;
      el.dataset.staggerDone = "1";
      var text = el.textContent || "";
      el.innerHTML = "";
      for (var i = 0; i < text.length; i++) {
        var span = document.createElement("span");
        span.className = "char";
        if (text[i] === " ") span.innerHTML = "&nbsp;";
        else span.textContent = text[i];
        span.style.transitionDelay = i * 0.04 + "s";
        el.appendChild(span);
      }
    });
  }

  function init() {
    splitStagger();
    if (reduced) {
      document
        .querySelectorAll(".reveal, .mag-section, .page-reveal")
        .forEach(function (el) { el.classList.add("in-view"); });
      return;
    }
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    document
      .querySelectorAll(".reveal, .mag-section, .page-reveal")
      .forEach(function (el) { obs.observe(el); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
