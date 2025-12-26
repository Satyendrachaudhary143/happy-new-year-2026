/* =====================================================
   ELEMENT REFERENCES
===================================================== */
const inputName = document.getElementById("name");
const giftText = document.getElementById("giftText");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const starContainer = document.getElementById("screenStars");
const hnyText = document.getElementById("hnyText");

/* =====================================================
   UTILITY FUNCTIONS
===================================================== */
function getName() {
    return inputName?.value?.trim() || "Satyendra Chaudhary";
}

/* =====================================================
   GET NAME FROM URL (AUTO FILL)
===================================================== */
(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedName = params.get("name");

    if (sharedName) {
        inputName.value = sharedName;
        giftText.innerHTML = `<b>${sharedName}</b> ने आपके लिए कुछ भेजा है 🎁`;
    }
})();

/* =====================================================
   COUNTDOWN TIMER
===================================================== */
const NEW_YEAR = new Date("Jan 1, 2026").getTime();

setInterval(() => {
    const diff = NEW_YEAR - Date.now();

    d.innerText = Math.floor(diff / 86400000);
    h.innerText = Math.floor(diff / 3600000) % 24;
    m.innerText = Math.floor(diff / 60000) % 60;
    s.innerText = Math.floor(diff / 1000) % 60;

    giftText.innerHTML = `<b>${getName()}</b> ने आपके लिए कुछ भेजा है 🎁`;
}, 1000);

/* =====================================================
   CANVAS SETUP
===================================================== */
function resizeCanvas() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* =====================================================
   BACKGROUND STARS (CANVAS)
===================================================== */
const bgStars = Array.from({ length: 200 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 3 + 1.5,
    speed: Math.random() * 0.8 + 0.3
}));

/* =====================================================
   FIREWORK SYSTEM
===================================================== */
let rockets = [];
let particles = [];
const GRAVITY = 0.18;

function launchRocket() {
    rockets.push({
        x: Math.random() * canvas.width,
        y: canvas.height,
        vy: -9,
        targetY: canvas.height / 3
    });
}

function explode(x, y) {
    const app = document.getElementById("app");
    app.classList.add("shake");
    setTimeout(() => app.classList.remove("shake"), 300);

    for (let i = 0; i < 120; i++) {
        particles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 1.2) * 6,
            life: 120,
            color: `hsl(${Math.random() * 360},100%,60%)`
        });
    }
}

function animate() {
    ctx.fillStyle = "rgba(0,0,0,.3)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // stars
    bgStars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) star.y = 0;
        ctx.fillStyle = "#fff";
        ctx.fillRect(star.x, star.y, star.r, star.r);
    });

    // rockets
    rockets.forEach((r, i) => {
        r.y += r.vy;
        ctx.fillRect(r.x, r.y, 3, 10);

        if (r.y <= r.targetY) {
            explode(r.x, r.y);
            rockets.splice(i, 1);
        }
    });

    // particles
    particles.forEach((p, i) => {
        p.vy += GRAVITY;
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 2, 2);

        if (p.life <= 0 || p.y > canvas.height) {
            particles.splice(i, 1);
        }
    });

    requestAnimationFrame(animate);
}

/* =====================================================
   START SHOW (GIFT CLICK)
===================================================== */
function startShow() {
    start.style.display = "none";
    celebrate.style.display = "flex";
    document.getElementById("moonWrap").style.display = "block";

    playLetterAnimation();
    setInterval(launchRocket, 900);
    requestAnimationFrame(animate);
}

/* =====================================================
   HAPPY NEW YEAR LETTER ANIMATION
===================================================== */
const HNY_LINES = ["HAPPY", "NEW", "YEAR"];
const LETTER_DELAY = 700;
const LINE_DELAY = 300;
const RESTART_DELAY = 60000;

function playLetterAnimation() {
    hnyText.innerHTML = "";
    let delay = 0;

    HNY_LINES.forEach(word => {
        const line = document.createElement("div");
        line.className = "line";
        hnyText.appendChild(line);

        [...word].forEach(char => {
            setTimeout(() => {
                const span = document.createElement("span");
                span.className = "letter";
                if (word === "YEAR") span.classList.add("year");
                span.textContent = char;
                line.appendChild(span);
            }, delay);

            delay += LETTER_DELAY;
        });

        delay += LINE_DELAY;
    });

    setTimeout(playLetterAnimation, delay + RESTART_DELAY);
}

/* =====================================================
   FULL SCREEN STARS (20–50 AUTO)
===================================================== */
const STAR_COUNT = Math.floor(Math.random() * 200) + 20;

for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement("span");
    star.className = "s-star";

    star.style.top = Math.random() * 100 + "%";
    star.style.left = Math.random() * 100 + "%";

    const size = Math.random() * 3 + 2;
    star.style.width = size + "px";
    star.style.height = size + "px";
    star.style.animationDelay = Math.random() * 5 + "s";

    starContainer.appendChild(star);
}

/* =====================================================
   WHATSAPP SHARE
===================================================== */
function share() {
    const sname = getName();
    const name = sname.toUpperCase();
    const baseUrl = window.location.origin + window.location.pathname;
    const link = `${baseUrl}?name=${encodeURIComponent(name)}`;

    const message = `${name} ने आपके लिए कुछ भेजा है ${link}`;

    window.open(
        `https://wa.me/?text=${encodeURIComponent(message)}`,
        "_blank"
    );
}
