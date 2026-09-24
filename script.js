/* ============================================================
   GLITTER + FALLING STARS BACKGROUND
   ============================================================ */

const glitterCanvas = document.getElementById('glitterCanvas');
const glitterCtx    = glitterCanvas.getContext('2d');

let glitterParticles = [];
let fallingStars     = [];

const SPARKLE_COLORS = [
    '#f7e7ce', '#e6c068', '#ffc0cb', '#ffffff', '#ff007f'
];

function resizeGlitterCanvas() {
    glitterCanvas.width  = window.innerWidth;
    glitterCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeGlitterCanvas);
resizeGlitterCanvas();

function createGlitterParticles(count) {
    glitterParticles = [];
    for (let i = 0; i < count; i++) {
        glitterParticles.push({
            x: Math.random() * glitterCanvas.width,
            y: Math.random() * glitterCanvas.height,
            size: Math.random() * 1.4 + 0.4,
            baseAlpha: Math.random() * 0.5 + 0.25,
            twinkleSpeed: Math.random() * 0.08 + 0.03,
            twinklePhase: Math.random() * Math.PI * 2,
            color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
        });
    }
}

function createFallingStars(count) {
    fallingStars = [];
    for (let i = 0; i < count; i++) {
        fallingStars.push(createStar(true));
    }
}

function createStar(randomY = false) {
    return {
        x: Math.random() * glitterCanvas.width,
        y: randomY ? Math.random() * glitterCanvas.height : -20,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 1.8 + 0.8,
        sway: Math.random() * 2.5 + 1,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.05 + 0.02,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        alpha: Math.random() * 0.5 + 0.5,
        color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
    };
}

function drawStarShape(ctx, cx, cy, spikes, outerR, innerR, rotation) {
    let rot = Math.PI / 2 * 3 + rotation;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerR);
    for (let i = 0; i < spikes; i++) {
        ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
        rot += step;
        ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerR);
    ctx.closePath();
}

function animateGlitter() {
    glitterCtx.clearRect(0, 0, glitterCanvas.width, glitterCanvas.height);

    glitterParticles.forEach(p => {
        p.twinklePhase += p.twinkleSpeed;
        const alpha = p.baseAlpha * (0.5 + 0.5 * Math.sin(p.twinklePhase));
        glitterCtx.globalAlpha = alpha;
        glitterCtx.fillStyle = p.color;
        glitterCtx.shadowBlur = 12;
        glitterCtx.shadowColor = p.color;
        glitterCtx.beginPath();
        glitterCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        glitterCtx.fill();
    });

    fallingStars.forEach((s, index) => {
        s.y += s.speed;
        s.swayPhase += s.swaySpeed;
        s.rotation += s.rotationSpeed;
        const swayX = Math.sin(s.swayPhase) * s.sway;
        glitterCtx.globalAlpha = s.alpha;
        glitterCtx.fillStyle = s.color;
        glitterCtx.shadowBlur = 12;
        glitterCtx.shadowColor = s.color;
        drawStarShape(glitterCtx, s.x + swayX, s.y, 5, s.size, s.size * 0.45, s.rotation);
        glitterCtx.fill();
        if (s.y > glitterCanvas.height + 20) {
            fallingStars[index] = createStar(false);
        }
    });

    glitterCtx.globalAlpha = 1;
    glitterCtx.shadowBlur  = 0;

    requestAnimationFrame(animateGlitter);
}

createGlitterParticles(450);
createFallingStars(220);
animateGlitter();


/* ============================================================
   ELEMENT REFERENCES
   ============================================================ */

const beginStageEl   = document.getElementById('beginStage');
const beginBtnEl     = document.getElementById('beginBtn');
const countdownStage = document.getElementById('countdown');
const countdownNumEl = document.getElementById('countdownNumber');
const mainStageEl    = document.getElementById('mainStage');
const typedNoteEl    = document.getElementById('typedNote');
const typeCursorEl   = document.getElementById('typeCursor');
const emphasisEl     = document.querySelector('.note-emphasis');
const leftStripEl    = document.querySelector('.photo-strip-left');
const rightStripEl   = document.querySelector('.photo-strip-right');


/* ============================================================
   #11 — BEGIN BUTTON
   ============================================================ */

beginBtnEl.addEventListener('click', () => {
    beginStageEl.classList.add('hidden');
    startCountdown();
});


/* ============================================================
   COUNTDOWN
   ============================================================ */

const COUNTDOWN_SEQUENCE = ['3', '2', '1'];
const COUNTDOWN_INTERVAL = 1000;

function startCountdown() {
    countdownStage.classList.remove('hidden');
    let index = 0;
    showCountdownStep(COUNTDOWN_SEQUENCE[index]);

    const ticker = setInterval(() => {
        index++;
        if (index >= COUNTDOWN_SEQUENCE.length) {
            clearInterval(ticker);
            setTimeout(finishCountdown, 900);
            return;
        }
        showCountdownStep(COUNTDOWN_SEQUENCE[index]);
    }, COUNTDOWN_INTERVAL);
}

function showCountdownStep(text) {
    countdownNumEl.classList.remove('tick');
    void countdownNumEl.offsetWidth;
    countdownNumEl.textContent = text;
    countdownNumEl.classList.add('tick');
}

function finishCountdown() {
    countdownStage.classList.add('hidden');
    mainStageEl.classList.remove('hidden');
    runMainStageSequence();
}


/* ============================================================
   MAIN STAGE SEQUENCE
   ============================================================ */

function runMainStageSequence() {
    // 1. Reveal the title + note container
    // (the title has a CSS animation already — fires immediately when visible)

    // 2. #2 — Confetti burst when title appears
    setTimeout(() => {
        triggerConfettiBurst();
    }, 500);

    // 3. #1 — Typing animation for the note (starts after confetti begins)
    setTimeout(() => {
        typeNote();
    }, 1400);

    // 4. Photos slide in
    setTimeout(() => {
        if (leftStripEl) leftStripEl.classList.add('reveal');
    }, 1000);
    setTimeout(() => {
        if (rightStripEl) rightStripEl.classList.add('reveal');
    }, 1400);
}


/* ============================================================
   #1 — TYPING ANIMATION FOR THE NOTE ⌨️
   ============================================================ */

const NOTE_TEXT = "As you scroll through the next chapter of your life,";
const TYPE_SPEED = 45; // ms per letter

function typeNote() {
    let i = 0;
    typedNoteEl.textContent = '';
    typeCursorEl.classList.remove('done');

    const typeNext = () => {
        if (i < NOTE_TEXT.length) {
            typedNoteEl.textContent += NOTE_TEXT.charAt(i);
            i++;
            setTimeout(typeNext, TYPE_SPEED);
        } else {
            // Typing done — hide cursor, then pop the emphasis line
            setTimeout(() => {
                typeCursorEl.classList.add('done');
                if (emphasisEl) emphasisEl.classList.add('reveal');
            }, 400);
        }
    };

    typeNext();
}


/* ============================================================
   #2 — CONFETTI BURST 🎊
   ============================================================ */

const confettiCanvas = document.getElementById('confettiCanvas');
const confettiCtx    = confettiCanvas.getContext('2d');

let confettiPieces   = [];
let confettiActive   = false;
let confettiLoopId   = null;

const CONFETTI_COLORS = [
    '#ff007f', '#ffc0cb', '#e6c068', '#f7e7ce',
    '#ffffff', '#ff4d88', '#ffe066', '#a80030'
];

function resizeConfettiCanvas() {
    confettiCanvas.width  = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfettiCanvas);
resizeConfettiCanvas();


function createConfettiPiece() {
    return {
        x: Math.random() * confettiCanvas.width,
        y: -20 - Math.random() * 200,                // start above screen
        w: Math.random() * 10 + 6,                   // width
        h: Math.random() * 14 + 8,                   // height
        vx: (Math.random() - 0.5) * 2,               // horizontal drift
        vy: Math.random() * 3 + 2,                   // fall speed
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
        sway: Math.random() * 1.5 + 0.5,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.05 + 0.02,
    };
}


function triggerConfettiBurst() {
    // Add 180 confetti pieces
    for (let i = 0; i < 180; i++) {
        confettiPieces.push(createConfettiPiece());
    }

    if (!confettiActive) {
        confettiActive = true;
        animateConfetti();
    }

    // Keep trickling new pieces for 3 seconds
    let trickleCount = 0;
    const trickle = setInterval(() => {
        for (let i = 0; i < 20; i++) {
            confettiPieces.push(createConfettiPiece());
        }
        trickleCount++;
        if (trickleCount >= 8) clearInterval(trickle);
    }, 350);
}


function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = confettiPieces.length - 1; i >= 0; i--) {
        const p = confettiPieces[i];

        p.swayPhase += p.swaySpeed;
        p.x += p.vx + Math.sin(p.swayPhase) * p.sway;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.vy += 0.05;   // slight gravity

        // Remove when off the bottom
        if (p.y > confettiCanvas.height + 30) {
            confettiPieces.splice(i, 1);
            continue;
        }

        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate(p.rotation);
        confettiCtx.fillStyle = p.color;
        confettiCtx.shadowBlur = 8;
        confettiCtx.shadowColor = p.color;

        if (p.shape === 'rect') {
            confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else {
            confettiCtx.beginPath();
            confettiCtx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
            confettiCtx.fill();
        }
        confettiCtx.restore();
    }

    confettiCtx.shadowBlur = 0;

    if (confettiPieces.length > 0) {
        confettiLoopId = requestAnimationFrame(animateConfetti);
    } else {
        confettiActive = false;
    }
}