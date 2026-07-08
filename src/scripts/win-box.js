// ===== 窗口弹出动画：fade-in & scale（每次进入主页播放） =====
(function () {
  function runWindowPopIn() {
    const boxes = Array.from(document.querySelectorAll(".win-box"));
    if (!boxes.length) return;

    // initialize inline state so animation is visible from 0
    boxes.forEach((el) => {
      const node = el as HTMLElement;
      node.style.opacity = "0";
      node.style.transform = "scale(0.96)";
      node.style.transition = "none";
    });

    // Next frame, staggered add animation class
    requestAnimationFrame(() => {
      boxes.forEach((el, i) => {
        const delay = i * 120; // stagger interval in ms
        setTimeout(() => {
          el.classList.add("pop-in");
          // cleanup inline styles after animation finishes
          const onEnd = () => {
            const node = el as HTMLElement;
            node.style.opacity = "";
            node.style.transform = "";
            node.style.transition = "";
            el.removeEventListener("animationend", onEnd);
          };
          el.addEventListener("animationend", onEnd);
        }, delay);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runWindowPopIn);
  } else {
    runWindowPopIn();
  }
})();
