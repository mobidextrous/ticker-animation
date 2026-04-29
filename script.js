const start = 5000000;
const end = 12551236;
const overshoot = 12725000;
const duration = 4200;
const settleDuration = 500;

const ticker = document.getElementById("ticker");
const bracket = document.getElementById("bracket");

let startTime = null;

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

function countUp(timestamp) {
    if (!startTime) startTime = timestamp;

    const progress = Math.min((timestamp - startTime) / duration, 1);
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

function settleBack(timestamp) {
    if (!startTime) startTime = timestamp;

    const progress = Math.min((timestamp - startTime) / settleDuration, 1);
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

requestAnimationFrame(countUp);
