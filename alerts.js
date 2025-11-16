// ===============================
//  SAMPLE ALERT DATA
// ===============================
const alerts = [
  {
    category: "Traffic",
    title: "Heavy Traffic at City Center",
    desc: "A breakdown near the metro station is causing delays. Expected clearance in 45 minutes.",
    time: "12 mins ago"
  },
  {
    category: "Weather",
    title: "Rainfall Expected Tonight",
    desc: "Light showers predicted between 8 PM – 11 PM. Avoid low-lying areas.",
    time: "1 hour ago"
  },
  {
    category: "Health",
    title: "Free Vaccine Camp",
    desc: "City Hospital is organizing a free vaccination camp this weekend.",
    time: "3 hours ago"
  },
  {
    category: "Public",
    title: "Water Supply Interruption",
    desc: "Maintenance work in Sector 9. Water supply may be irregular from 2 PM – 5 PM.",
    time: "Yesterday"
  },
  {
    category: "Traffic",
    title: "Flyover Closed",
    desc: "The Ring Road flyover is closed for repairs until Monday.",
    time: "Yesterday"
  }
];



// ===============================
//  DOM ELEMENTS
// ===============================
const alertContainer = document.getElementById("alertsContainer");
const filterButtons = document.querySelectorAll(".filters button");



// ===============================
//  RENDER ALERT CARDS
// ===============================
function renderAlerts(filter = "all") {
  alertContainer.innerHTML = "";

  const filtered = (filter === "all")
    ? alerts
    : alerts.filter(a => a.category === filter);

  filtered.forEach(alert => {
    const div = document.createElement("div");
    div.className = "alert-card";
    div.innerHTML = `
      <div class="alert-title">${alert.title}</div>
      <div class="alert-category">${alert.category}</div>
      <div class="alert-desc">${alert.desc}</div>
      <div class="alert-time">${alert.time}</div>
    `;
    alertContainer.appendChild(div);
  });
}

// initial load
renderAlerts();



// ===============================
//  FILTER BUTTON HANDLING
// ===============================
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {

    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");
    renderAlerts(filter);
  });
});



// ===============================
//  THEME SYNC FROM HOMEPAGE
// ===============================
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



// ===============================
//  APPLY SAVED THEME IMMEDIATELY
// ===============================
const savedTheme = localStorage.getItem("citypulse-theme") || "day";
applyTheme(savedTheme);



// ===============================
//  APPLY SAVED MOON PHASE
// ===============================
const savedPhase = localStorage.getItem("citypulse-moonphase");

if (savedPhase !== null) {
  const moon = document.querySelector(".moon");

  for (let i = 0; i < 8; i++) moon.classList.remove(`phase-${i}`);
  moon.classList.add(`phase-${savedPhase}`);
}



// ===============================
//  LIVE SYNC IF HOME CHANGES
// ===============================
window.addEventListener("storage", () => {
  const updatedTheme = localStorage.getItem("citypulse-theme") || "day";
  const updatedPhase = localStorage.getItem("citypulse-moonphase");

  applyTheme(updatedTheme);

  if (updatedPhase !== null) {
    const moon = document.querySelector(".moon");
    for (let i = 0; i < 8; i++) moon.classList.remove(`phase-${i}`);
    moon.classList.add(`phase-${updatedPhase}`);
  }
});
