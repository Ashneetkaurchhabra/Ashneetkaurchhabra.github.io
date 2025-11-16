// =========================
//  UTIL SHORTCUT
// =========================
function $id(id) {
  return document.getElementById(id);
}



// =========================
//  DUMMY DATA
// =========================
const data = {
  temperature: 26 + Math.floor(Math.random() * 6),
  tempHistory: Array.from({ length: 12 }, () => 20 + Math.floor(Math.random() * 10)),

  aqi: 60 + Math.floor(Math.random() * 60),
  aqiWeek: Array.from({ length: 7 }, () => 55 + Math.floor(Math.random() * 80)),

  traffic: 30 + Math.floor(Math.random() * 60),
  trafficHistory: Array.from({ length: 12 }, () => 25 + Math.floor(Math.random() * 65)),
};



// =========================
//  UPDATE METRICS
// =========================
function updateUI() {
  $id("tempVal").textContent = data.temperature + " °C";
  $id("aqiVal").textContent = data.aqi;
  $id("trafficVal").textContent = data.traffic + "%";
}



// =========================
//  LIVE CLOCK
// =========================
function updateClock() {
  const now = new Date();
  const text = now.toLocaleString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  $id("clockBox").textContent = text;
  setTimeout(updateClock, 1000);
}



// =========================
//  APPLY THEME (Day/Night)
// =========================
function applyTheme(theme) {
  const body = document.body;
  const sun = document.querySelector(".sun");
  const moon = document.querySelector(".moon");
  const stars = document.querySelector(".stars");

  if (theme === "night") {
    body.classList.add("night");
    body.classList.remove("day");

    sun.style.opacity = "0";
    moon.style.opacity = "1";
    stars.style.opacity = "1";

  } else {
    body.classList.add("day");
    body.classList.remove("night");

    sun.style.opacity = "1";
    moon.style.opacity = "0";
    stars.style.opacity = "0";
  }
}



// =========================
//  DECIDE THEME FOR TODAY
// =========================
function updateTheme() {
  const hour = new Date().getHours();
  const theme = (hour >= 18 || hour < 6) ? "night" : "day";

  // save for all pages
  localStorage.setItem("citypulse-theme", theme);

  // apply theme
  applyTheme(theme);
}



// =========================
//  MOON PHASE CALCULATION
// =========================
function getMoonPhase() {
  const now = new Date();

  // NASA reference new moon
  const knownNewMoon = new Date("2000-01-06T18:14:00Z");
  const lunarCycle = 29.53058867;

  const diff = now - knownNewMoon;
  const days = diff / (1000 * 60 * 60 * 24);

  return Math.floor((days % lunarCycle) / (lunarCycle / 8)); // 0–7
}



function updateMoonPhase() {
  const moon = document.querySelector(".moon");
  const phase = getMoonPhase();

  // remove old phases
  for (let i = 0; i < 8; i++) moon.classList.remove(`phase-${i}`);

  moon.classList.add(`phase-${phase}`);

  // ⭐ Save for all other pages
  localStorage.setItem("citypulse-moonphase", phase);
}



// =========================
//  CHART DRAWING FUNCTIONS
// =========================
function hexToRgba(hex, alpha = 1) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}



function drawLineChart(canvasId, arr, color, xLabelCount) {
  const c = $id(canvasId);
  const parent = c.parentElement;

  const clientW = parent.clientWidth;
  const clientH = 260;

  c.width = clientW;
  c.height = clientH;

  const ctx = c.getContext("2d");
  const w = c.width;
  const h = c.height;
  const pad = 36;

  ctx.clearRect(0, 0, w, h);

  let max = Math.max(...arr);
  let min = Math.min(...arr);
  if (max === min) { max += 1; min -= 1; }

  // Axes
  ctx.strokeStyle = "#7e7e7e";
  ctx.beginPath();
  ctx.moveTo(pad, pad);
  ctx.lineTo(pad, h - pad);
  ctx.lineTo(w - pad, h - pad);
  ctx.stroke();

  // Y labels
  ctx.fillStyle = "#444";
  ctx.font = "12px Poppins";

  const ySteps = 4;
  for (let i = 0; i <= ySteps; i++) {
    const v = min + (i / ySteps) * (max - min);
    const y = h - pad - (i / ySteps) * (h - 2 * pad);

    ctx.fillText(Math.round(v), 6, y + 4);

    ctx.beginPath();
    ctx.moveTo(pad - 4, y);
    ctx.lineTo(pad, y);
    ctx.stroke();
  }

  // X labels
  ctx.fillStyle = "#444";
  ctx.font = "11px Poppins";

  const n = arr.length;
  const stepX = Math.max(1, Math.floor(n / (xLabelCount || n)));

  for (let i = 0; i < n; i++) {
    if (i % stepX !== 0 && i !== n - 1) continue;

    const x = pad + (i * (w - 2 * pad)) / (n - 1);
    ctx.fillText(i + 1, x - 4, h - 10);
  }

  // Line
  ctx.beginPath();
  arr.forEach((v, i) => {
    const x = pad + (i * (w - 2 * pad)) / (n - 1);
    const y = h - pad - ((v - min) / (max - min)) * (h - 2 * pad);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Fill under graph
  ctx.lineTo(w - pad, h - pad);
  ctx.lineTo(pad, h - pad);
  ctx.closePath();
  ctx.fillStyle = hexToRgba(color, 0.15);
  ctx.fill();

  // Points
  arr.forEach((v, i) => {
    const x = pad + (i * (w - 2 * pad)) / (n - 1);
    const y = h - pad - ((v - min) / (max - min)) * (h - 2 * pad);

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });
}



// =========================
//  DRAW ALL CHARTS
// =========================
function drawAllCharts() {
  drawLineChart("tempChart", data.tempHistory, "#ff82c8", 6);
  drawLineChart("aqiChart", data.aqiWeek, "#8e6bff", 7);
  drawLineChart("trafficChart", data.trafficHistory, "#ffd480", 6);
}



// =========================
//  INIT PAGE
// =========================
window.addEventListener("DOMContentLoaded", () => {

  // Apply saved theme instantly (no flicker)
  const savedTheme = localStorage.getItem("citypulse-theme") || "day";
  applyTheme(savedTheme);

  // Decide today's theme + re-save it
  updateTheme();

  updateUI();
  updateClock();
  updateMoonPhase();

  setTimeout(drawAllCharts, 150);

  // Update moon phase hourly
  setInterval(updateMoonPhase, 1000 * 60 * 60);

  // Update theme hourly
  setInterval(updateTheme, 1000 * 60 * 60);

  // Redraw charts on resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(drawAllCharts, 150);
  });
});
