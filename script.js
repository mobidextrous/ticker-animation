const params = new URLSearchParams(window.location.search);

// Inputs
const start = Number(params.get("start")) || 5000000;
const end = Number(params.get("end")) || 12551236;
const label = params.get("label") || "marketing professionals in the world.";
const note = params.get("note") || "(that we can identify)";
const introText = params.get("intro") || "";

// Animation tuning
const overshoot = Math.round(end * 1.012);
const duration = 4200;
const settleDuration = 500;

// Elements
const ticker = document.getElementById("ticker");
const sentence = document.getElementById("sentence");
const bracket = document.getElementById("bracket");
const intro = document.getElementById("intro");

// Apply content
if (sentence) sentence.textContent = label;
if (bracket) bracket.textContent = note;
if (intro) intro.textContent = introText;

// Helpers
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function formatNumber(num) {
  return Math.round(num).toLocaleString("en-US");
}

// Animation
let startTime = null;

function countUp(ts) {
  if (!startTime) startTime = ts;

  const progress = Math.min((ts - startTime) / duration, 1);
  const eased = easeOutCubic(progress);
  const current = start + (overshoot - start) * eased;

  ticker.textContent = formatNumber(current);

  if (progress < 1) {
    requestAnimationFrame(countUp);
  } else {
    ticker.classList.add("settle");
    startTime = null;
    requestAnimationFrame(settleBack);
  }
}

function settleBack(ts) {
  if (!startTime) startTime = ts;

  const progress = Math.min((ts - startTime) / settleDuration, 1);
  const eased = easeOutBack(progress);
  const current = overshoot + (end - overshoot) * eased;

  ticker.textContent = formatNumber(current);

  if (progress < 1) {
    requestAnimationFrame(settleBack);
  } else {
    ticker.textContent = formatNumber(end);
    ticker.classList.remove("settle");
    ticker.classList.add("final");

    setTimeout(() => {
      bracket.classList.add("show");
    }, 300);
  }
}

// Start
requestAnimationFrame(countUp);
