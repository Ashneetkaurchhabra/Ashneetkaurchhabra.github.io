// -----------------------------
// FEEDBACK FORM ELEMENTS
// -----------------------------
const fbForm = document.getElementById("feedbackForm");
const fbName = document.getElementById("fbName");
const fbEmail = document.getElementById("fbEmail");
const fbMessage = document.getElementById("fbMessage");

const fbPopup = document.getElementById("fbPopup");
const closePopup = document.getElementById("closePopup");

// -----------------------------
// FORM VALIDATION + POPUP
// -----------------------------
fbForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let errors = [];

  if (fbName.value.trim() === "") errors.push("Name is required.");
  if (!fbEmail.value.includes("@") || !fbEmail.value.includes(".")) errors.push("A valid email is required.");
  if (fbMessage.value.trim().length < 5) errors.push("Message is too short.");

  if (errors.length > 0) {
    alert(errors.join("\n"));
    return;
  }

  fbPopup.classList.add("show");
});

// -----------------------------
// CLOSE POPUP + RESET FORM
// -----------------------------
closePopup.addEventListener("click", () => {
  fbPopup.classList.remove("show");

  fbName.value = "";
  fbEmail.value = "";
  fbMessage.value = "";
});

// -----------------------------
// NO SKY LOGIC HERE
// script.js handles the background + theme syncing
// -----------------------------
// -----------------------------
// APPLY SAVED MOON PHASE (same as alerts.js)
// -----------------------------
const savedPhase = localStorage.getItem("citypulse-moonphase");

if (savedPhase !== null) {
  const moon = document.querySelector(".moon");

  for (let i = 0; i < 8; i++) {
    moon.classList.remove(`phase-${i}`);
  }

  moon.classList.add(`phase-${savedPhase}`);
}

// -----------------------------
// UPDATE LIVE WHEN HOME CHANGES
// -----------------------------
window.addEventListener("storage", () => {
  const updatedPhase = localStorage.getItem("citypulse-moonphase");

  if (updatedPhase !== null) {
    const moon = document.querySelector(".moon");

    for (let i = 0; i < 8; i++) {
      moon.classList.remove(`phase-${i}`);
    }

    moon.classList.add(`phase-${updatedPhase}`);
  }
});
