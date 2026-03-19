const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const cycle = 8; // total loop length in seconds

const rows = Array.from({ length: 12 }, (_, i) => {
    const dir = i % 2 === 0 ? 1 : -1;
    const speed = 18 + i * 4;
    const y = 90 + i * 38;
    const text = generateBinaryString(90 + (i % 3) * 20);
    return { dir, speed, y, text, offset: Math.random() * 500 };
});

function generateBinaryString(length) {
    let out = "";
    for (let i = 0; i < length; i++) {
        out += Math.random() > 0.5 ? "1" : "0";
        if (i % 6 === 5) out += " ";
    }
    return out;
}

function drawRoundedRect(x, y, w, h, r, fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fill();
}

function drawCoderScene(w, h, time) {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#07090d");
    grad.addColorStop(1, "#121826");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // soft glow behind monitor
    const glow = ctx.createRadialGradient(w * 0.5, h * 0.42, 20, w * 0.5, h * 0.42, 360);
    glow.addColorStop(0, "rgba(90, 160, 255, 0.22)");
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // desk
    drawRoundedRect(w * 0.18, h * 0.72, w * 0.64, 18, 8, "#3b2f28");
    ctx.fillStyle = "#261d18";
    ctx.fillRect(w * 0.2, h * 0.74, w * 0.6, h * 0.14);

    // old box computer / CRT monitor
    drawRoundedRect(w * 0.52, h * 0.42, 170, 130, 12, "#d7c7a1");
    drawRoundedRect(w * 0.55, h * 0.45, 120, 70, 8, "#0b1621");

    // monitor screen glow and scanlines
    ctx.fillStyle = "rgba(120, 255, 170, 0.08)";
    ctx.fillRect(w * 0.56, h * 0.46, 108, 58);

    ctx.strokeStyle = "rgba(120, 255, 170, 0.15)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
        const yLine = h * 0.47 + i * 9 + Math.sin(time * 2 + i) * 1;
        ctx.beginPath();
        ctx.moveTo(w * 0.56, yLine);
        ctx.lineTo(w * 0.66, yLine);
        ctx.stroke();
    }

    // keyboard
    drawRoundedRect(w * 0.45, h * 0.66, 200, 28, 6, "#b7aa8b");
    ctx.fillStyle = "#9c8f70";
    for (let i = 0; i < 14; i++) {
        for (let j = 0; j < 3; j++) {
            ctx.fillRect(w * 0.465 + i * 13, h * 0.675 + j * 6, 9, 3);
        }
    }

    // person from behind
    ctx.fillStyle = "#0e0f12";
    ctx.beginPath();
    ctx.arc(w * 0.33, h * 0.48, 48, 0, Math.PI * 2);
    ctx.fill();

    // subtle head highlight
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.beginPath();
    ctx.arc(w * 0.315, h * 0.465, 28, 0, Math.PI * 2);
    ctx.fill();

    // neck
    ctx.fillStyle = "#0b0b0d";
    ctx.fillRect(w * 0.31, h * 0.52, 30, 30);

    // shoulders / torso
    ctx.beginPath();
    ctx.moveTo(w * 0.22, h * 0.72);
    ctx.quadraticCurveTo(w * 0.33, h * 0.56, w * 0.45, h * 0.72);
    ctx.quadraticCurveTo(w * 0.36, h * 0.79, w * 0.22, h * 0.72);
    ctx.closePath();
    ctx.fillStyle = "#101216";
    ctx.fill();

    // chair back
    drawRoundedRect(w * 0.24, h * 0.54, 40, 110, 16, "#1a1d24");

    // room vignette
    const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.2, w / 2, h / 2, Math.max(w, h) * 0.8);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, "rgba(0,0,0,0.5)");
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, w, h);
}

function drawBinaryScene(w, h, time) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#020304");
    grad.addColorStop(1, "#07120b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // soft digital haze
    const glow = ctx.createRadialGradient(w * 0.5, h * 0.5, 20, w * 0.5, h * 0.5, 500);
    glow.addColorStop(0, "rgba(0, 255, 140, 0.08)");
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    ctx.font = "20px 'Courier New', monospace";
    ctx.textBaseline = "middle";

    rows.forEach((row, i) => {
        const speed = row.speed;
        row.offset += row.dir * speed * 0.016 * 60;

        const textWidth = ctx.measureText(row.text).width + 60;
        let x = -textWidth + (row.offset % textWidth);

        const green = 110 + (i * 10) % 120;
        ctx.fillStyle = `rgba(80, ${green}, 120, 0.8)`;

        for (; x < w + textWidth; x += textWidth) {
            ctx.fillText(row.text, x, row.y + Math.sin(time * 2 + i) * 2);
        }
    });

    // horizontal motion streaks
    ctx.strokeStyle = "rgba(120, 255, 190, 0.08)";
    for (let i = 0; i < 22; i++) {
        const y = (i / 22) * h + Math.sin(time * 1.5 + i) * 3;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
    }

    // vignette
    const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.2, w / 2, h / 2, Math.max(w, h) * 0.8);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, "rgba(0,0,0,0.45)");
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, w, h);
}

function drawBackground(now) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const t = now / 1000;
    const phase = t % cycle;

    // transition map
    let coderAlpha = 0;
    let binaryAlpha = 0;

    if (phase < 3.2) {
        coderAlpha = 1;
    } else if (phase < 4.0) {
        const p = (phase - 3.2) / 0.8;
        coderAlpha = 1 - p;
        binaryAlpha = p;
    } else if (phase < 7.2) {
        binaryAlpha = 1;
    } else {
        const p = (phase - 7.2) / 0.8;
        coderAlpha = p;
        binaryAlpha = 1 - p;
    }

    ctx.clearRect(0, 0, w, h);

    if (coderAlpha > 0) {
        ctx.save();
        ctx.globalAlpha = coderAlpha;
        drawCoderScene(w, h, t);
        ctx.restore();
    }

    if (binaryAlpha > 0) {
        ctx.save();
        ctx.globalAlpha = binaryAlpha;
        drawBinaryScene(w, h, t);
        ctx.restore();
    }

    requestAnimationFrame(drawBackground);
}

requestAnimationFrame(drawBackground);