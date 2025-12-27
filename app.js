/* =====================================================
   ELEMENT REFERENCES
===================================================== */
const inputName = document.getElementById("name");
const giftText = document.getElementById("giftText");

const start = document.getElementById("start");
const celebrate = document.getElementById("celebrate");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const starContainer = document.getElementById("screenStars");
const hnyText = document.getElementById("hnyText");
const moonWrap = document.getElementById("moonWrap");

const d = document.getElementById("d");
const h = document.getElementById("h");
const m = document.getElementById("m");
const s = document.getElementById("s");

/* =====================================================
   UTIL
===================================================== */
function getName() {
    const name = inputName?.value?.trim();
    return name && name.length >= 2 ? name : "Satyendra Chaudhary";
}

/* =====================================================
   AUTO NAME FROM URL
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
const NEW_YEAR = new Date("Jan 1, 2026 00:00:00").getTime();

const timerInterval = setInterval(() => {
    const now = Date.now();
    const diff = NEW_YEAR - now;

    // 🎆 NEW YEAR ARRIVED
    if (diff <= 0) {
        clearInterval(timerInterval);

        // hide timer
        document.querySelector(".timer").style.display = "none";

        // show celebration text
        document.getElementById("newYearLive").style.display = "block";

        // optional: change shayari
        const shayari = document.querySelector(".shayari");
        if (shayari) {
            shayari.innerHTML =
                "🎆 नया साल आ गया है 🎆<br>खुशियाँ आपके साथ रहें";
        }

        return;
    }

    // normal countdown
    d.innerText = Math.floor(diff / 86400000);
    h.innerText = Math.floor(diff / 3600000) % 24;
    m.innerText = Math.floor(diff / 60000) % 60;
    s.innerText = Math.floor(diff / 1000) % 60;
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
   BACKGROUND STARS
===================================================== */
const bgStars = Array.from({ length: 180 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    speed: Math.random() * 0.6 + 0.2
}));

/* =====================================================
   🔊 FIREWORK SOUND (5 SECOND SAFE)
===================================================== */
let baseFireworkSound;
let soundEnabled = false;
let activeSounds = 0;

const SOUND_DURATION = 5000;      // 5 seconds
const MAX_SOUNDS = 3;

function initSound() {
    if (soundEnabled) return;

    baseFireworkSound = new Audio("firework.mp3"); // 🔥 file same folder me
    baseFireworkSound.volume = 0.6;
    baseFireworkSound.preload = "auto";

    soundEnabled = true;
}

function playFireworkSound() {
    if (!soundEnabled) return;
    if (activeSounds >= MAX_SOUNDS) return;

    const sound = baseFireworkSound.cloneNode();
    sound.volume = 0.6;
    activeSounds++;

    sound.play().catch(() => {
        activeSounds--;
    });

    // ⏱️ stop sound after 5 seconds
    setTimeout(() => {
        sound.pause();
        sound.currentTime = 0;
        activeSounds--;
    }, SOUND_DURATION);
}

/* =====================================================
   FIREWORK SYSTEM
===================================================== */
let rockets = [];
let particles = [];

const GRAVITY = 0.18;
const MAX_PARTICLES = 1200;

function launchRocket() {
    rockets.push({
        x: Math.random() * canvas.width,
        y: canvas.height,
        vy: -9,
        targetY: canvas.height * 0.35
    });
}

function explode(x, y) {
    if (particles.length > MAX_PARTICLES) return;

    playFireworkSound(); // 🔊 SOUND HERE

    document.getElementById("app").classList.add("shake");
    setTimeout(() => {
        document.getElementById("app").classList.remove("shake");
    }, 300);

    for (let i = 0; i < 110; i++) {
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

/* =====================================================
   ANIMATION LOOP
===================================================== */
function animate() {
    ctx.fillStyle = "rgba(0,0,0,.3)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // stars
    for (const star of bgStars) {
        star.y += star.speed;
        if (star.y > canvas.height) star.y = 0;
        ctx.fillStyle = "#fff";
        ctx.fillRect(star.x, star.y, star.r, star.r);
    }

    // rockets
    for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;
        ctx.fillRect(r.x, r.y, 3, 10);

        if (r.y <= r.targetY) {
            explode(r.x, r.y);
            rockets.splice(i, 1);
        }
    }

    // particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += GRAVITY;
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 2, 2);

        if (p.life <= 0 || p.y > canvas.height) {
            particles.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

/* =====================================================
   FIREWORK CONTROLLER
===================================================== */
let fireworksStarted = false;

function startFireworks() {
    if (fireworksStarted) return;
    fireworksStarted = true;

    setInterval(launchRocket, 900);
    requestAnimationFrame(animate);
}

/* =====================================================
   START SHOW (🎁 CLICK)
===================================================== */
function startShow() {
    initSound(); // 🔊 unlock sound

    const giftBox = document.querySelector(".gift-wrap");
    const funnyBox = document.getElementById("funnyBox");
    const funnyText = document.getElementById("funnyText");
    const funnyEmoji = document.getElementById("funnyEmoji");

    // prevent multiple click
    giftBox.style.pointerEvents = "none";

    /* STEP 1: Gift screen hide */
    giftBox.style.display = "none";
    funnyBox.style.display = "flex";

    /* FUNNY CONTENT */
    const funnyMessages = [
        { emoji: "😂", text: "इतनी जल्दी क्या है जी, गिफ्ट भागा नहीं जा रहा है।" },
        { emoji: "😜", text: "ज़रा सब्र रखो जी, आपका गिफ्ट तैयार किया जा रहा है।" },
        { emoji: "🥳", text: "इतना इंतज़ार किया है तो थोड़ा और सही।" },
        { emoji: "🎁", text: "गिफ्ट खुलने से पहले suspense ज़रूरी है।" },
        { emoji: "🔥", text: "तैयारी चल रही है, पटाखे गरम हो रहे हैं।" },
        { emoji: "😆", text: "अरे, अब मुस्कुरा भी दो 😄 गिफ्ट खुल गया है!" }
    ];


    let index = 0;

    funnyEmoji.innerText = funnyMessages[0].emoji;
    funnyText.innerText = funnyMessages[0].text;

    /* STEP 2: Rotate funny messages for 1 MINUTE */
    const interval = setInterval(() => {
        index = (index + 1) % funnyMessages.length;
        funnyEmoji.innerText = funnyMessages[index].emoji;
        funnyText.innerText = funnyMessages[index].text;
    }, 5000); // every 4 sec

    /* STEP 3: After 1 minute → Celebration */
    setTimeout(() => {
        clearInterval(interval);

        funnyBox.style.display = "none";

        // flash
        const flash = document.createElement("div");
        flash.className = "flash";
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 600);

    // show celebration
        start.style.display = "none";
        celebrate.style.display = "flex";
        moonWrap.style.display = "block";

        playLetterAnimation();
        startFireworks();

    }, 30000); // ⏱️ 1 minute
}




/* =====================================================
   HAPPY NEW YEAR TEXT
===================================================== */
const HNY_LINES = ["HAPPY", "NEW", "YEAR"];
const LETTER_DELAY = 120;
const LINE_DELAY = 300;
const RESTART_DELAY = 2 * 60 * 1000;

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
   FULL SCREEN STARS (DOM)
===================================================== */
const STAR_COUNT = Math.floor(Math.random() * 40) + 20;

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
    const name = getName().toUpperCase();
    const baseUrl = window.location.origin + window.location.pathname;
    const link = `${baseUrl}?name=${encodeURIComponent(name)}`;

    const message = `${name} ने आपके लिए कुछ खास भेजा है 😄
👇 यहाँ क्लिक करें
${link}`;

    window.open(
        `https://wa.me/?text=${encodeURIComponent(message)}`,
        "_blank"
    );
}
