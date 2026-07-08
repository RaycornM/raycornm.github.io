// ===== 随机轮播图 =====
(function () {
  const images = [
    "/assets/1d442f5857f54f17818bcb2bf6b53730.png",
    "/assets/2025-10-17_183005_789.png",
    "/assets/2025-10-17_185645_393.png",
    "/assets/2025-10-17_185917_944.png",
  ];

  const carouselImg = document.querySelector(
    ".carousel-image",
  ) as HTMLImageElement;
  if (!carouselImg) return;

  const randomIndex = Math.floor(Math.random() * images.length);
  carouselImg.src = images[randomIndex];
})();
