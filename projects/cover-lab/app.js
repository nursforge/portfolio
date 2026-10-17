const canvas = document.getElementById("coverCanvas");
const ctx = canvas.getContext("2d");
const titleInput = document.getElementById("albumTitle");
const artistInput = document.getElementById("artistName");
const grainInput = document.getElementById("grain");
const grainValue = document.getElementById("grainValue");
const previewStyle = document.getElementById("previewStyle");
const imagePrompt = document.getElementById("imagePrompt");
const aiButton = document.getElementById("generateAi");
const generationOverlay = document.getElementById("generationOverlay");

const palettes = {
  night: { background: "#0d3441", foreground: "#d4f1e5", accent: "#e3fd87", mid: "#39796e" },
  sunset: { background: "#542447", foreground: "#ffe2c8", accent: "#ffb074", mid: "#df4e76" },
  mono: { background: "#36373a", foreground: "#f1ebdf", accent: "#c4bdb0", mid: "#85827e" },
  acid: { background: "#252a78", foreground: "#f3f4dc", accent: "#d3ff00", mid: "#fc65bd" }
};

const styleNames = { ambient: "AMBIENT", synth: "SYNTHWAVE", jazz: "JAZZ CLUB", brutal: "BRUTALIST" };
let style = "ambient";
let paletteName = "night";
let variation = 1;
let toastTimer;
let aiBackground = null;

function randomGenerator(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function drawBase(colors) {
  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawAmbient(colors, random) {
  drawBase(colors);
  const glow = ctx.createRadialGradient(650, 460, 12, 630, 510, 660);
  glow.addColorStop(0, colors.mid);
  glow.addColorStop(.42, colors.background);
  glow.addColorStop(1, colors.background);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1200, 1200);

  const centerX = 670 + random() * 120 - 60;
  const centerY = 490 + random() * 110 - 55;
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(-.2 + random() * .4);
  for (let i = 0; i < 10; i++) {
    ctx.beginPath();
    ctx.ellipse(0, 0, 185 + i * 47, 95 + i * 26, 0, 0, Math.PI * 2);
    ctx.strokeStyle = i % 3 === 0 ? `${colors.accent}88` : `${colors.foreground}32`;
    ctx.lineWidth = i % 3 === 0 ? 2 : 1;
    ctx.stroke();
  }
  ctx.restore();

  for (let i = 0; i < 42; i++) {
    const x = random() * 1200;
    const y = random() * 880;
    const r = random() * 2.8 + .7;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = random() > .72 ? colors.accent : `${colors.foreground}88`;
    ctx.fill();
  }
  ctx.fillStyle = colors.accent;
  ctx.beginPath(); ctx.arc(centerX, centerY, 5, 0, Math.PI * 2); ctx.fill();
}

function drawSynth(colors, random) {
  const sky = ctx.createLinearGradient(0, 0, 0, 1200);
  sky.addColorStop(0, colors.background);
  sky.addColorStop(.52, colors.mid);
  sky.addColorStop(1, "#17152d");
  ctx.fillStyle = sky; ctx.fillRect(0, 0, 1200, 1200);

  const sunX = 610 + random() * 130;
  const sunY = 440 + random() * 80;
  const sunR = 238 + random() * 50;
  const sun = ctx.createLinearGradient(0, sunY - sunR, 0, sunY + sunR);
  sun.addColorStop(0, colors.accent);
  sun.addColorStop(.5, colors.mid);
  sun.addColorStop(1, colors.background);
  ctx.save(); ctx.beginPath(); ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = sun; ctx.fillRect(sunX - sunR, sunY - sunR, sunR * 2, sunR * 2);
  ctx.fillStyle = colors.background;
  for (let y = sunY + 24; y < sunY + sunR; y += 19) ctx.fillRect(sunX - sunR, y, sunR * 2, 8 + (y - sunY) * .025);
  ctx.restore();

  ctx.strokeStyle = `${colors.accent}aa`; ctx.lineWidth = 2;
  for (let i = 0; i <= 14; i++) {
    const x = i * 100 - 100;
    ctx.beginPath(); ctx.moveTo(600, 600); ctx.lineTo(x, 1200); ctx.stroke();
  }
  for (let i = 1; i <= 10; i++) {
    const y = 600 + i * i * 6;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1200, y); ctx.stroke();
  }
  ctx.fillStyle = `${colors.foreground}25`; ctx.fillRect(0, 590, 1200, 7);
}

function drawJazz(colors, random) {
  ctx.fillStyle = colors.foreground; ctx.fillRect(0, 0, 1200, 1200);
  ctx.fillStyle = colors.background; ctx.fillRect(0, 0, 1200, 1200);
  ctx.save(); ctx.translate(670 + random() * 80, 450 + random() * 100); ctx.rotate(-.22 + random() * .44);
  ctx.fillStyle = colors.mid; ctx.beginPath(); ctx.ellipse(0, 0, 340, 430, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = colors.accent; ctx.beginPath(); ctx.arc(40, -20, 225, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = colors.background; ctx.lineWidth = 2;
  for (let i = -4; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(-450, i * 100); ctx.lineTo(450, i * 100 + 240); ctx.stroke(); }
  ctx.restore();
  ctx.fillStyle = colors.background; ctx.fillRect(0, 0, 28, 1200);
  ctx.fillStyle = colors.mid; ctx.fillRect(83, 120, 12, 780);
  for (let i = 0; i < 15; i++) {
    ctx.fillStyle = i % 2 ? colors.background : colors.mid;
    ctx.fillRect(145 + i * 54, 1040, 29, 10);
  }
}

function drawBrutal(colors, random) {
  drawBase(colors);
  ctx.fillStyle = colors.foreground;
  ctx.save(); ctx.translate(-30, 70 + random() * 150); ctx.rotate(-.14 + random() * .28);
  ctx.fillRect(110, 95, 610, 530);
  ctx.fillStyle = colors.accent; ctx.fillRect(475, 205, 590, 590);
  ctx.fillStyle = colors.mid; ctx.fillRect(180, 675, 835, 210);
  ctx.fillStyle = colors.background; ctx.beginPath(); ctx.arc(895, 355, 94 + random() * 55, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = colors.background; ctx.lineWidth = 11;
  ctx.beginPath(); ctx.moveTo(50, 600); ctx.lineTo(1100, 120); ctx.stroke();
  ctx.restore();
  ctx.fillStyle = `${colors.foreground}28`;
  for (let y = 0; y < 1200; y += 36) ctx.fillRect(0, y, 1200, 1);
}

function drawAiBackground(colors) {
  ctx.drawImage(aiBackground, 0, 0, canvas.width, canvas.height);
  const wash = ctx.createLinearGradient(0, 0, 0, canvas.height);
  wash.addColorStop(0, "#1015136c");
  wash.addColorStop(.44, "#10151300");
  wash.addColorStop(.67, "#10151328");
  wash.addColorStop(1, "#101513d9");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = `${colors.accent}cc`;
  ctx.fillRect(82, 117, 90, 5);
}

function drawLabel(text, x, y, color, fontSize = 18, align = "left") {
  ctx.fillStyle = color;
  ctx.font = `500 ${fontSize}px "Cascadia Code", Consolas, monospace`;
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(text.toLocaleUpperCase("ru-RU"), x, y);
  ctx.textAlign = "left";
}

function breakTitle(title, maxLength) {
  const words = title.trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    if (line && `${line} ${word}`.length > maxLength) { lines.push(line); line = word; }
    else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return lines.length ? lines.slice(0, 3) : ["БЕЗ НАЗВАНИЯ"];
}

function drawTypography(colors, hasAiBackground = false) {
  const title = titleInput.value.trim() || "Без названия";
  const artist = artistInput.value.trim() || "Без имени";
  const isJazz = style === "jazz";
  const textColor = hasAiBackground ? "#fffdf5" : isJazz ? colors.background : colors.foreground;
  const x = 82;
  const maxChars = style === "brutal" ? 13 : 16;
  const lines = breakTitle(title, maxChars);
  drawLabel(`${artist}  /  ORIGINAL RELEASE`, x, 94, textColor, 16);
  ctx.fillStyle = colors.accent;
  ctx.fillRect(x, 117, 90, 5);

  if (style === "brutal") {
    ctx.fillStyle = textColor;
    ctx.font = "900 108px Arial, sans-serif";
    ctx.textBaseline = "alphabetic";
    lines.forEach((line, index) => ctx.fillText(line.toLocaleUpperCase("ru-RU"), x, 890 + index * 112, 1020));
    drawLabel("SIDE A     •     VOL. 001", x, 1127, textColor, 14);
    return;
  }

  const titleSize = style === "synth" ? 106 : style === "jazz" ? 108 : 105;
  ctx.fillStyle = textColor;
  ctx.textBaseline = "alphabetic";
  ctx.font = style === "synth"
    ? `800 ${titleSize}px Arial, sans-serif`
    : style === "jazz"
      ? `italic 500 ${titleSize}px Georgia, serif`
      : `500 ${titleSize}px Georgia, serif`;
  const lineHeight = titleSize * .94;
  const startY = 880 - Math.max(0, lines.length - 1) * lineHeight;
  lines.forEach((line, index) => ctx.fillText(line.toLocaleUpperCase("ru-RU"), x, startY + index * lineHeight, 1030));
  ctx.fillStyle = isJazz ? colors.mid : colors.accent;
  ctx.fillRect(x, 964, 1030, 2);
  drawLabel("SIDE A   /   01:00 ━━━━━━━━━━━━━━━  04:12", x, 1014, textColor, 14);
  ctx.globalAlpha = .7;
  drawLabel("COVER LAB · VISUALS FOR SOUND", x, 1115, textColor, 13);
  ctx.globalAlpha = 1;
}

function drawGrain(amount, seed) {
  if (amount <= 0) return;
  const noiseCanvas = document.createElement("canvas");
  const noiseCtx = noiseCanvas.getContext("2d");
  const size = 180;
  noiseCanvas.width = size;
  noiseCanvas.height = size;
  const imageData = noiseCtx.createImageData(size, size);
  const random = randomGenerator(seed ^ 0x9e3779b9);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const shade = Math.floor(random() * 255);
    imageData.data[i] = shade;
    imageData.data[i + 1] = shade;
    imageData.data[i + 2] = shade;
    imageData.data[i + 3] = 255;
  }
  noiseCtx.putImageData(imageData, 0, 0);
  ctx.save();
  ctx.globalAlpha = (amount / 100) * .24;
  ctx.globalCompositeOperation = "soft-light";
  ctx.drawImage(noiseCanvas, 0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function renderCover() {
  const colors = palettes[paletteName];
  const seed = variation * 7919 + style.length * 997 + paletteName.length * 31;
  const random = randomGenerator(seed);
  if (aiBackground?.complete && aiBackground.naturalWidth > 0) drawAiBackground(colors);
  else {
    if (style === "ambient") drawAmbient(colors, random);
    if (style === "synth") drawSynth(colors, random);
    if (style === "jazz") drawJazz(colors, random);
    if (style === "brutal") drawBrutal(colors, random);
  }
  drawTypography(colors, Boolean(aiBackground?.complete && aiBackground.naturalWidth > 0));
  drawGrain(Number(grainInput.value), seed);
  previewStyle.textContent = `${styleNames[style]} / ${String(variation).padStart(3, "0")}`;
  grainValue.value = `${grainInput.value}%`;
  grainValue.textContent = `${grainInput.value}%`;
  const percent = Number(grainInput.value) / Number(grainInput.max) * 100;
  grainInput.style.background = `linear-gradient(90deg, var(--green) 0 ${percent}%, #d5d8cf ${percent}% 100%)`;
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.append(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

document.querySelectorAll("[data-style]").forEach((button) => button.addEventListener("click", () => {
  style = button.dataset.style;
  document.querySelectorAll("[data-style]").forEach((option) => option.classList.toggle("selected", option === button));
  renderCover();
}));

document.querySelectorAll("[data-palette]").forEach((button) => button.addEventListener("click", () => {
  paletteName = button.dataset.palette;
  document.querySelectorAll("[data-palette]").forEach((option) => option.classList.toggle("active", option === button));
  renderCover();
}));

titleInput.addEventListener("input", renderCover);
artistInput.addEventListener("input", renderCover);
grainInput.addEventListener("input", renderCover);
document.getElementById("generate").addEventListener("click", () => {
  aiBackground = null;
  variation = variation >= 999 ? 1 : variation + 1;
  renderCover();
  showToast("Новый графический вариант готов");
});

aiButton.addEventListener("click", async () => {
  const idea = imagePrompt.value.trim();
  if (!idea) { showToast("Сначала опиши идею для фона"); imagePrompt.focus(); return; }
  aiButton.disabled = true;
  aiButton.classList.add("loading");
  aiButton.querySelector("span:nth-child(2)").textContent = "Создаём изображение…";
  generationOverlay.hidden = false;
  try {
    const response = await fetch("/api/generate-cover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea, style, palette: paletteName })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "Сервис генерации вернул ошибку.");
    const nextImage = new Image();
    nextImage.onload = () => {
      aiBackground = nextImage;
      variation = variation >= 999 ? 1 : variation + 1;
      renderCover();
      showToast("ИИ-фон готов — название уже на обложке");
      generationOverlay.hidden = true;
    };
    nextImage.onerror = () => { generationOverlay.hidden = true; showToast("Не удалось открыть сгенерированный фон"); };
    nextImage.src = `data:image/png;base64,${result.image}`;
  } catch (error) {
    const message = error instanceof TypeError
      ? "Запусти сайт через npm start и проверь API-ключ в .env"
      : error.message;
    showToast(message);
    generationOverlay.hidden = true;
  } finally {
    aiButton.disabled = false;
    aiButton.classList.remove("loading");
    aiButton.querySelector("span:nth-child(2)").textContent = "Создать фон с ИИ";
  }
});
document.getElementById("download").addEventListener("click", () => {
  const slug = (titleInput.value.trim() || "cover").toLocaleLowerCase("ru-RU")
    .replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
  canvas.toBlob((blob) => {
    if (!blob) { showToast("Не удалось подготовить файл"); return; }
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slug || "music-cover"}-cover.png`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Обложка скачана в PNG");
  }, "image/png");
});

renderCover();
