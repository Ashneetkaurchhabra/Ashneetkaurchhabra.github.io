// ======================
// Basic interactive map logic: pan, zoom, modal
// ======================

const svg = document.getElementById("townSVG");
const canvas = document.getElementById("mapCanvas");
const zoomIn = document.getElementById("zoomIn");
const zoomOut = document.getElementById("zoomOut");
const resetView = document.getElementById("resetView");

let scale = 1.0;
const minScale = 0.6;
const maxScale = 2.6;
let isPanning = false;
let startX = 0;
let startY = 0;
let panX = 0;
let panY = 0;

// Apply transform
function applyTransform() {
  svg.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
}

// Zoom in
zoomIn.addEventListener("click", () => {
  scale = Math.min(maxScale, +(scale + 0.15).toFixed(2));
  applyTransform();
});

// Zoom out
zoomOut.addEventListener("click", () => {
  scale = Math.max(minScale, +(scale - 0.15).toFixed(2));
  applyTransform();
});

// Reset view
resetView.addEventListener("click", () => {
  scale = 1.0;
  panX = 0;
  panY = 0;
  applyTransform();
});

// Mouse pan start
canvas.addEventListener("mousedown", (e) => {
  isPanning = true;
  startX = e.clientX - panX;
  startY = e.clientY - panY;
  canvas.style.cursor = "grabbing";
});

// Mouse move pan
window.addEventListener("mousemove", (e) => {
  if (!isPanning) return;
  panX = e.clientX - startX;
  panY = e.clientY - startY;
  applyTransform();
});

// Mouse up stop pan
window.addEventListener("mouseup", () => {
  isPanning = false;
  canvas.style.cursor = "default";
});

// Touch pan
canvas.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1) {
    isPanning = true;
    startX = e.touches[0].clientX - panX;
    startY = e.touches[0].clientY - panY;
  }
}, { passive: true });

canvas.addEventListener("touchmove", (e) => {
  if (!isPanning) return;
  panX = e.touches[0].clientX - startX;
  panY = e.touches[0].clientY - startY;
  applyTransform();
}, { passive: true });

canvas.addEventListener("touchend", () => {
  isPanning = false;
});

// ======================
// MODAL
// ======================

const modal = document.getElementById("mapModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalContact = document.getElementById("modalContact");
const closeModal = document.getElementById("closeModal");

closeModal.addEventListener("click", () => {
  modal.classList.remove("show");
});

// ======================
// ZONE DATA — UPDATED FULL
// ======================

const zoneData = {

  // MAIN BUILDINGS
  "City Park": {
    desc: "City Park — swings, trees, fountain and green area.",
    contact: "Park Office: 98291-11234"
  },
  "Central School": {
    desc: "Central School — Kindergarten to 12th. Buses available.",
    contact: "School Reception: 98765-44321"
  },
  "City Hospital": {
    desc: "City Hospital — Emergency, OPD & Pharmacy open 24/7.",
    contact: "Emergency: 108 | Hospital Desk: 99234-88776"
  },
  "Rainbow Mall": {
    desc: "Rainbow Mall — food court, stores & entertainment.",
    contact: "Mall Helpdesk: 90012-55678"
  },
  "Town Market": {
    desc: "Town Market — groceries, vegetables, and small shops.",
    contact: "Market Office: 91234-00123"
  },
  "St. Mark's Church": {
    desc: "A peaceful community church with weekly gatherings.",
    contact: "Office: 90011-22334"
  },
  "Dairy Corner": {
    desc: "Dairy Corner — milk, butter and daily essentials.",
    contact: "Shop: 90111-22345"
  },
  "Railway Station": {
    desc: "Station for local & long-distance trains.",
    contact: "Railway Enquiry: 139"
  },
  "Central Bus Stand": {
    desc: "Main bus stand — local & express buses available.",
    contact: "Bus Enquiry: 90123-44556"
  },
  "Police Station": {
    desc: "Main Police Headquarters of the town.",
    contact: "Dial 100 | Station Desk: 91234-00991"
  },
  "Fire Station": {
    desc: "Fire & Rescue station — available 24/7.",
    contact: "Fire Emergency: 101"
  },
  "Post Office": {
    desc: "Post Office — letters, parcels and speed post.",
    contact: "Desk: 90123-33211"
  },
  "Community Well": {
    desc: "Public well for fresh groundwater.",
    contact: "Maintenance: 90000-77221"
  },

  // HOUSES WITH DETAILS
  "House 1": {
    desc: "Cozy home on upper Meadow Lane.",
    contact: "Owner: Aarav Sharma — 98761-11223"
  },
  "House 2": {
    desc: "Peaceful house with small garden.",
    contact: "Owner: Riya Mehta — 99881-34112"
  },
  "House 3": {
    desc: "Near the central lane, very sunny home.",
    contact: "Owner: Dev Singh — 90112-88991"
  },
  "House 4": {
    desc: "Corner house with tall trees around it.",
    contact: "Owner: Simran Kaur — 99122-44771"
  },
  "House 5": {
    desc: "Modern home on the southern lane.",
    contact: "Owner: Kabir Kapoor — 99771-00482"
  },
  "House 6": {
    desc: "Meadow Lane home with mailbox & tree.",
    contact: "Owner: Ishita Malik — 99882-77134"
  },
  "House 7": {
    desc: "Townhouse close to Meadow Lane junction.",
    contact: "Owner: Arjun Verma — 98991-66721"
  },
  "House 8": {
    desc: "Quiet home near east Meadow Lane.",
    contact: "Owner: Neha Batra — 90881-55623"
  }
};

// ======================
// Add click listener to every zone
// ======================

document.querySelectorAll("#townSVG .zone").forEach(zone => {
  zone.style.pointerEvents = "auto";

  zone.addEventListener("click", (e) => {
    const key = zone.dataset.zone;
    const info = zoneData[key] || {
      desc: "No information available.",
      contact: ""
    };

    modalTitle.textContent = key;
    modalDesc.textContent = info.desc;
    modalContact.textContent = info.contact;

    modal.classList.add("show");
    e.stopPropagation();
  });
});

// Close modal by clicking outside
document.addEventListener("click", (e) => {
  if (modal.classList.contains("show") && !modal.contains(e.target)) {
    modal.classList.remove("show");
  }
});


// APPLY SAVED MOON PHASE ON MAP ALSO
const savedPhase = localStorage.getItem("citypulse-moonphase");

if (savedPhase !== null) {
  const moon = document.querySelector(".moon");

  for (let i = 0; i < 8; i++) moon.classList.remove(`phase-${i}`);
  moon.classList.add(`phase-${savedPhase}`);
}

// Initial transform
applyTransform();
