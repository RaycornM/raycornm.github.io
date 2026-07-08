// ===== 北京时间实时时钟 =====
(function () {
  const timeDisplay = document.getElementById("beijing-time");
  if (!timeDisplay) return;

  function updateBeijingTime() {
    const now = new Date();
    const beijingTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Shanghai" }),
    );
    const hours = String(beijingTime.getHours()).padStart(2, "0");
    const minutes = String(beijingTime.getMinutes()).padStart(2, "0");
    timeDisplay.textContent = `${hours}:${minutes}`;
  }

  updateBeijingTime();
  setInterval(updateBeijingTime, 1000);
})();
