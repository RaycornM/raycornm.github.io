// ===== 波浪网格背景动画 =====
(function () {
  const canvas = document.getElementById("wave-grid");
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const canvasEl = canvas;
  const ctxEl = ctx;

  let timeRef = 0;
  let mousePos = { x: 0.5, y: 0.5 };
  let animFrameId = null;

  const CANVAS_WIDTH = 1500;
  const CANVAS_HEIGHT = 460;

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvasEl.width = CANVAS_WIDTH * dpr;
    canvasEl.height = CANVAS_HEIGHT * dpr;
    ctxEl.scale(dpr, dpr);
  }

  resizeCanvas();

  canvasEl.addEventListener("mousemove", (e) => {
    const rect = canvasEl.getBoundingClientRect();
    mousePos.x = (e.clientX - rect.left) / rect.width;
    mousePos.y = (e.clientY - rect.top) / rect.height;
  });

  const gridSize = 50;
  const waveAmplitude = 12;
  const waveFrequency = 0.015;
  const waveSpeed = 0.015;

  function animate() {
    timeRef += waveSpeed;

    ctxEl.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctxEl.strokeStyle = "#1A1A2E";
    ctxEl.lineWidth = 1;

    for (let y = 0; y <= CANVAS_HEIGHT; y += gridSize) {
      ctxEl.beginPath();
      for (let x = 0; x <= CANVAS_WIDTH; x += 4) {
        const distToMouse = Math.sqrt(
          Math.pow(x / CANVAS_WIDTH - mousePos.x, 2) +
            Math.pow(y / CANVAS_HEIGHT - mousePos.y, 2),
        );
        const mouseEffect = Math.max(0, 1 - distToMouse * 3) * 15;

        const waveY =
          y +
          Math.sin(x * waveFrequency + timeRef) * waveAmplitude +
          Math.sin(x * waveFrequency * 2 + timeRef * 1.3) *
            (waveAmplitude * 0.5) +
          mouseEffect * Math.sin(x * 0.03 + timeRef * 2);

        if (x === 0) ctxEl.moveTo(x, waveY);
        else ctxEl.lineTo(x, waveY);
      }
      ctxEl.stroke();
    }

    for (let x = 0; x <= CANVAS_WIDTH; x += gridSize) {
      ctxEl.beginPath();
      for (let y = 0; y <= CANVAS_HEIGHT; y += 4) {
        const distToMouse = Math.sqrt(
          Math.pow(x / CANVAS_WIDTH - mousePos.x, 2) +
            Math.pow(y / CANVAS_HEIGHT - mousePos.y, 2),
        );
        const mouseEffect = Math.max(0, 1 - distToMouse * 3) * 15;

        const waveX =
          x +
          Math.sin(y * waveFrequency + timeRef) * waveAmplitude +
          Math.sin(y * waveFrequency * 2 + timeRef * 1.3) *
            (waveAmplitude * 0.5) +
          mouseEffect * Math.sin(y * 0.03 + timeRef * 2);

        if (y === 0) ctxEl.moveTo(waveX, y);
        else ctxEl.lineTo(waveX, y);
      }
      ctxEl.stroke();
    }

    animFrameId = requestAnimationFrame(animate);
  }

  /* 页面可见性感知：标签页隐藏时暂停动画，恢复时衔接 */
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    } else {
      if (!animFrameId) animate();
    }
  });

  animate();
})();
