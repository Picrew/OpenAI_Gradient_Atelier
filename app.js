const canvas = document.getElementById("artCanvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const shell = document.getElementById("canvasShell");
const candidateGrid = document.getElementById("candidateGrid");
const seedLabel = document.getElementById("seedLabel");
const bestScore = document.getElementById("bestScore");
const presetTitle = document.getElementById("presetTitle");
const sizeLabel = document.getElementById("sizeLabel");
const qualityLabel = document.getElementById("qualityLabel");

const translations = {
  en: {
    docTitle: "Gradient Atelier",
    brand: "OpenAI Gradient Atelier",
    appTitle: "Diffusion background generator",
    reset: "Reset",
    exportPng: "Export PNG",
    mode: "Mode",
    seed: "seed",
    backgroundStyle: "Background style",
    presetDiffusion: "Diffusion",
    presetHorizon: "Horizon",
    presetAurora: "Aurora",
    presetPrism: "Prism",
    presetWatercolor: "Wash",
    presetMaterial: "Material",
    presetMono: "Mono",
    coreControls: "Core controls",
    randomize: "Randomize",
    colorProgress: "Color progress",
    diffusionSoftness: "Diffusion softness",
    textureProgress: "Texture progress",
    materialDepth: "Material depth",
    horizonBands: "Horizon bands",
    brushMotion: "Brush motion",
    vignette: "Vignette",
    frame: "Frame",
    aspectRatio: "Aspect ratio",
    card: "Card",
    evolutionLab: "Evolution lab",
    best: "best",
    generateCandidates: "Generate 10 candidates",
    generatedCandidates: "Generated candidates",
    liveCanvas: "Live canvas",
    generatedPreview: "Generated background preview",
    generatedCanvas: "Generated gradient background",
    referenceBackgrounds: "Reference backgrounds",
    exportSize: "export",
    grain: "grain",
    score: "score",
    presetTitles: {
      diffusion: "Soft diffusion field",
      horizon: "Horizon color bloom",
      aurora: "Aurora diffusion glow",
      prism: "Prism sky diffusion",
      watercolor: "Watercolor wash",
      material: "Glossy material field",
      mono: "Single-hue grain field",
    },
  },
  zh: {
    docTitle: "渐变工坊",
    brand: "OpenAI 渐变工坊",
    appTitle: "弥散背景生成器",
    reset: "重置",
    exportPng: "导出 PNG",
    mode: "模式",
    seed: "种子",
    backgroundStyle: "背景风格",
    presetDiffusion: "弥散",
    presetHorizon: "地平线",
    presetAurora: "极光",
    presetPrism: "棱镜",
    presetWatercolor: "水彩",
    presetMaterial: "材质",
    presetMono: "单色",
    coreControls: "核心控制",
    randomize: "随机",
    colorProgress: "色彩进度",
    diffusionSoftness: "弥散柔度",
    textureProgress: "质感进度",
    materialDepth: "材质深度",
    horizonBands: "色带强度",
    brushMotion: "笔触流动",
    vignette: "暗角",
    frame: "画幅",
    aspectRatio: "画幅比例",
    card: "卡片",
    evolutionLab: "进化实验",
    best: "最佳",
    generateCandidates: "生成 10 张候选",
    generatedCandidates: "生成候选图",
    liveCanvas: "实时画布",
    generatedPreview: "生成背景预览",
    generatedCanvas: "生成的渐变背景",
    referenceBackgrounds: "参考背景",
    exportSize: "导出",
    grain: "颗粒",
    score: "评分",
    presetTitles: {
      diffusion: "柔和弥散色场",
      horizon: "地平线色彩光晕",
      aurora: "极光弥散光晕",
      prism: "棱镜天空弥散",
      watercolor: "水彩笔触洗染",
      material: "光泽材质色场",
      mono: "单色颗粒色场",
    },
  },
};

const controls = {
  colorMix: document.getElementById("colorMix"),
  softness: document.getElementById("softness"),
  texture: document.getElementById("texture"),
  materialDepth: document.getElementById("materialDepth"),
  bands: document.getElementById("bands"),
  brush: document.getElementById("brush"),
  vignette: document.getElementById("vignette"),
};

const controlReadouts = {
  colorMix: document.getElementById("colorMixValue"),
  softness: document.getElementById("softnessValue"),
  texture: document.getElementById("textureValue"),
  materialDepth: document.getElementById("materialDepthValue"),
  bands: document.getElementById("bandsValue"),
  brush: document.getElementById("brushValue"),
  vignette: document.getElementById("vignetteValue"),
};

const rangeGradients = {
  colorMix: ["#166ed1", "#40bfe8", "#ff9c54", "#8d65ff", "#ff66d0"],
  softness: ["#d7ecff", "#8bd7ff", "#58b7ef", "#4961dc"],
  texture: ["#f5f5fb", "#d8d9e2", "#b8b8c9", "#6e6e73"],
  materialDepth: ["#cfefff", "#7fc9f0", "#365ccf", "#101a39"],
  bands: ["#e8d8ef", "#ff8fc7", "#1730ff", "#1c2731"],
  brush: ["#fff1c6", "#ffd447", "#ff9c54", "#f87635"],
  vignette: ["#f5f5fb", "#c8cedc", "#5b6577", "#16191f"],
};

const presetDefaults = {
  diffusion: { colorMix: 30, softness: 78, texture: 36, materialDepth: 28, bands: 0, brush: 24, vignette: 20 },
  horizon: { colorMix: 66, softness: 84, texture: 58, materialDepth: 22, bands: 0, brush: 18, vignette: 42 },
  aurora: { colorMix: 94, softness: 86, texture: 56, materialDepth: 30, bands: 0, brush: 18, vignette: 38 },
  prism: { colorMix: 16, softness: 88, texture: 34, materialDepth: 46, bands: 0, brush: 12, vignette: 18 },
  watercolor: { colorMix: 78, softness: 42, texture: 68, materialDepth: 14, bands: 0, brush: 88, vignette: 14 },
  material: { colorMix: 18, softness: 54, texture: 34, materialDepth: 82, bands: 0, brush: 42, vignette: 38 },
  mono: { colorMix: 44, softness: 64, texture: 62, materialDepth: 18, bands: 0, brush: 16, vignette: 24 },
};

const palettes = [
  ["#166ed1", "#56d3df", "#4961dc", "#d2f5f2", "#203060"],
  ["#6b55d8", "#40bfe8", "#b16ef0", "#84f2eb", "#1f2370"],
  ["#f55d9e", "#ff9c54", "#ffe8a8", "#c5d6ff", "#5f43c8"],
  ["#15a8d8", "#7bdd74", "#0089d6", "#d4f8cf", "#145c9f"],
  ["#ffb100", "#f87635", "#f7e178", "#9ed8cc", "#fff1c6"],
  ["#8d65ff", "#d97af5", "#a8c9ff", "#f2d5ff", "#6941bf"],
  ["#e8d8ef", "#ff66d0", "#1730ff", "#1c2731", "#f7eef7"],
];

const state = {
  preset: "diffusion",
  frame: "square",
  seed: 1209,
  isSliding: false,
  lang: "en",
  bestScore: 0,
};

let renderRequest = 0;
let settleTimer = 0;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function rgbToCss(rgb, alpha = 1) {
  return `rgba(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)}, ${alpha})`;
}

function mixHex(a, b, t) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return {
    r: lerp(ca.r, cb.r, t),
    g: lerp(ca.g, cb.g, t),
    b: lerp(ca.b, cb.b, t),
  };
}

function paletteAt(progress) {
  const scaled = (progress / 100) * (palettes.length - 1);
  const index = Math.floor(scaled);
  const next = Math.min(index + 1, palettes.length - 1);
  const local = scaled - index;
  return palettes[index].map((color, i) => mixHex(color, palettes[next][i], local));
}

function mulberry32(seed) {
  let value = seed >>> 0;
  return function random() {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function readSettings() {
  return {
    colorMix: Number(controls.colorMix.value),
    softness: Number(controls.softness.value),
    texture: Number(controls.texture.value),
    materialDepth: Number(controls.materialDepth.value),
    bands: Number(controls.bands.value),
    brush: Number(controls.brush.value),
    vignette: Number(controls.vignette.value),
  };
}

function t(key) {
  return translations[state.lang][key] ?? translations.en[key] ?? key;
}

function applyLanguage() {
  document.documentElement.lang = state.lang === "zh" ? "zh-CN" : "en";
  document.title = t("docTitle");
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === state.lang);
  });
  const presetGroup = document.querySelector(".segmented");
  if (presetGroup) presetGroup.setAttribute("aria-label", t("backgroundStyle"));
  const frameGroup = document.querySelector(".button-grid");
  if (frameGroup) frameGroup.setAttribute("aria-label", t("aspectRatio"));
  const candidateList = document.getElementById("candidateGrid");
  if (candidateList) candidateList.setAttribute("aria-label", t("generatedCandidates"));
  const preview = document.querySelector(".preview-area");
  if (preview) preview.setAttribute("aria-label", t("generatedPreview"));
  if (canvas) canvas.setAttribute("aria-label", t("generatedCanvas"));
  const references = document.querySelector(".reference-strip");
  if (references) references.setAttribute("aria-label", t("referenceBackgrounds"));
  bestScore.textContent = `${t("best")} ${state.bestScore.toFixed(2)}`;
  document.querySelectorAll(".candidate").forEach((button, index) => {
    const score = Number(button.dataset.score || 0);
    const label = button.querySelector("span");
    if (label) {
      label.textContent = `${String(index + 1).padStart(2, "0")} ${t("score")} ${score.toFixed(2)}`;
    }
  });
  render();
}

function setLanguage(lang) {
  state.lang = lang;
  applyLanguage();
}

function setFrame(frame) {
  state.frame = frame;
  document.querySelectorAll(".frame-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.frame === frame);
  });
  render();
}

function setPreset(preset) {
  state.preset = preset;
  const defaults = presetDefaults[preset];
  Object.entries(defaults).forEach(([key, value]) => {
    controls[key].value = value;
  });
  document.querySelectorAll(".segmented button").forEach((button) => {
    button.classList.toggle("active", button.dataset.preset === preset);
  });
  render();
}

function dimensionsFor(frame, exportSize = false, baseOverride = null) {
  const base = baseOverride ?? (exportSize ? 2160 : 1400);
  if (frame === "wide") return { width: base, height: Math.round(base * 9 / 16) };
  if (frame === "card") return { width: base, height: Math.round(base * 0.563) };
  return { width: base, height: base };
}

function setCanvasDimensions(targetCanvas, frame, exportSize = false, baseOverride = null) {
  const dims = dimensionsFor(frame, exportSize, baseOverride);
  targetCanvas.width = dims.width;
  targetCanvas.height = dims.height;
  const ratio = dims.width / dims.height;
  targetCanvas.style.aspectRatio = `${dims.width} / ${dims.height}`;
  if (ratio > 1.2) {
    targetCanvas.style.width = "100%";
  } else {
    targetCanvas.style.width = "min(100%, 720px)";
  }
  return dims;
}

function updateControlReadouts() {
  Object.entries(controls).forEach(([key, input]) => {
    const value = Number(input.value);
    const min = Number(input.min || 0);
    const max = Number(input.max || 100);
    const pct = ((value - min) / (max - min)) * 100;
    const colors = rangeGradients[key] || rangeGradients.colorMix;
    const filledStops = colors
      .map((color, index) => {
        const stop = colors.length === 1 ? pct : (pct * index) / (colors.length - 1);
        return `${color} ${stop.toFixed(1)}%`;
      })
      .join(", ");
    input.style.background = `linear-gradient(90deg, ${filledStops}, #e8e8ef ${pct.toFixed(1)}%, #e8e8ef 100%)`;
    if (controlReadouts[key]) {
      controlReadouts[key].textContent = String(value);
    }
  });
}

function scheduleRender() {
  updateControlReadouts();
  if (renderRequest) return;
  renderRequest = requestAnimationFrame(() => {
    renderRequest = 0;
    render();
  });
}

function handleControlInput() {
  state.isSliding = true;
  scheduleRender();
  window.clearTimeout(settleTimer);
  settleTimer = window.setTimeout(() => {
    state.isSliding = false;
    render();
  }, 120);
}

function addRadial(ctx2d, x, y, radius, inner, outer, alpha = 1) {
  const gradient = ctx2d.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, rgbToCss(inner, alpha));
  gradient.addColorStop(0.55, rgbToCss(outer, alpha * 0.38));
  gradient.addColorStop(1, rgbToCss(outer, 0));
  ctx2d.fillStyle = gradient;
  ctx2d.fillRect(0, 0, ctx2d.canvas.width, ctx2d.canvas.height);
}

function addEllipticalGlow(ctx2d, x, y, radiusX, radiusY, inner, outer, alpha = 1) {
  const scaleY = radiusY / Math.max(radiusX, 1);
  ctx2d.save();
  ctx2d.translate(x, y);
  ctx2d.scale(1, scaleY);
  const gradient = ctx2d.createRadialGradient(0, 0, 0, 0, 0, radiusX);
  gradient.addColorStop(0, rgbToCss(inner, alpha));
  gradient.addColorStop(0.5, rgbToCss(outer, alpha * 0.34));
  gradient.addColorStop(1, rgbToCss(outer, 0));
  ctx2d.fillStyle = gradient;
  ctx2d.fillRect(-ctx2d.canvas.width * 2, -ctx2d.canvas.height * 2, ctx2d.canvas.width * 4, ctx2d.canvas.height * 4);
  ctx2d.restore();
}

function drawBase(ctx2d, width, height, settings, random) {
  const palette = paletteAt(settings.colorMix);
  const angle = random() * Math.PI * 2;
  const x1 = width * (0.5 + Math.cos(angle) * 0.5);
  const y1 = height * (0.5 + Math.sin(angle) * 0.5);
  const x2 = width - x1;
  const y2 = height - y1;
  const base = ctx2d.createLinearGradient(x1, y1, x2, y2);
  base.addColorStop(0, rgbToCss(palette[0], 1));
  base.addColorStop(0.44, rgbToCss(palette[1], 1));
  base.addColorStop(1, rgbToCss(palette[2], 1));
  ctx2d.fillStyle = base;
  ctx2d.fillRect(0, 0, width, height);

  const count = Math.round(4 + settings.softness / 12);
  for (let i = 0; i < count; i += 1) {
    const color = palette[(i + 1) % palette.length];
    const outer = palette[(i + 3) % palette.length];
    addRadial(
      ctx2d,
      lerp(-0.1, 1.1, random()) * width,
      lerp(-0.1, 1.1, random()) * height,
      lerp(0.38, 0.82, random()) * Math.max(width, height) * (settings.softness / 70),
      color,
      outer,
      lerp(0.18, 0.52, random())
    );
  }
}

function drawHorizon(ctx2d, width, height, settings, random, palette) {
  if (settings.bands < 4) return;
  const bottom = height * lerp(0.72, 0.86, random());
  const intensity = settings.bands / 100;
  ctx2d.save();
  ctx2d.globalCompositeOperation = "multiply";
  const dark = ctx2d.createLinearGradient(0, bottom - height * 0.06, width, bottom + height * 0.12);
  dark.addColorStop(0, rgbToCss(palette[4], 0));
  dark.addColorStop(0.52, rgbToCss(palette[4], 0.84 * intensity));
  dark.addColorStop(1, rgbToCss(palette[4], 0.96 * intensity));
  ctx2d.fillStyle = dark;
  ctx2d.fillRect(0, bottom - height * 0.08, width, height * 0.32);
  ctx2d.globalCompositeOperation = "screen";
  for (let i = 0; i < 4; i += 1) {
    const y = bottom - height * (0.03 + i * 0.035);
    const band = ctx2d.createLinearGradient(0, y, width, y + height * 0.04);
    band.addColorStop(0, rgbToCss(palette[(i + 2) % 5], 0));
    band.addColorStop(0.45, rgbToCss(palette[i % 5], 0.4 * intensity));
    band.addColorStop(1, rgbToCss(palette[(i + 1) % 5], 0.66 * intensity));
    ctx2d.fillStyle = band;
    ctx2d.filter = `blur(${Math.round(height * 0.018)}px)`;
    ctx2d.fillRect(0, y, width, height * 0.055);
  }
  ctx2d.restore();
}

function drawAurora(ctx2d, width, height, settings, random, palette) {
  const intensity = clamp((settings.softness * 0.48 + settings.texture * 0.24 + settings.materialDepth * 0.28) / 100, 0.32, 0.92);
  const horizonY = height * lerp(0.72, 0.82, random());
  ctx2d.save();

  const air = ctx2d.createLinearGradient(0, 0, 0, height);
  air.addColorStop(0, "rgba(255, 255, 255, 0.22)");
  air.addColorStop(0.58, rgbToCss(palette[3], 0.16 * intensity));
  air.addColorStop(1, rgbToCss(palette[4], 0.1 * intensity));
  ctx2d.globalCompositeOperation = "screen";
  ctx2d.fillStyle = air;
  ctx2d.fillRect(0, 0, width, height);

  ctx2d.filter = `blur(${Math.round(height * 0.032)}px)`;
  for (let i = 0; i < 7; i += 1) {
    addEllipticalGlow(
      ctx2d,
      width * lerp(-0.08, 1.08, random()),
      horizonY + height * lerp(-0.1, 0.13, random()),
      width * lerp(0.38, 0.78, random()),
      height * lerp(0.06, 0.18, random()),
      palette[(i + 1) % palette.length],
      palette[(i + 3) % palette.length],
      lerp(0.16, 0.42, random()) * intensity
    );
  }

  ctx2d.filter = `blur(${Math.round(height * 0.014)}px)`;
  const horizonGlow = ctx2d.createLinearGradient(0, horizonY - height * 0.13, width, horizonY + height * 0.08);
  horizonGlow.addColorStop(0, rgbToCss(palette[3], 0));
  horizonGlow.addColorStop(0.4, rgbToCss(palette[1], 0.34 * intensity));
  horizonGlow.addColorStop(0.68, rgbToCss(palette[0], 0.52 * intensity));
  horizonGlow.addColorStop(1, rgbToCss(palette[2], 0.18 * intensity));
  ctx2d.fillStyle = horizonGlow;
  ctx2d.fillRect(0, horizonY - height * 0.18, width, height * 0.3);

  ctx2d.filter = `blur(${Math.round(height * 0.02)}px)`;
  const rim = ctx2d.createLinearGradient(0, horizonY + height * 0.05, width, horizonY + height * 0.08);
  rim.addColorStop(0, rgbToCss(palette[0], 0.18 * intensity));
  rim.addColorStop(0.42, rgbToCss(palette[1], 0.34 * intensity));
  rim.addColorStop(0.72, rgbToCss(palette[2], 0.42 * intensity));
  rim.addColorStop(1, rgbToCss(palette[4], 0.16 * intensity));
  ctx2d.fillStyle = rim;
  ctx2d.fillRect(0, horizonY - height * 0.02, width, height * 0.16);

  ctx2d.globalCompositeOperation = "multiply";
  ctx2d.filter = "none";
  const ground = ctx2d.createLinearGradient(0, horizonY - height * 0.05, 0, height);
  ground.addColorStop(0, rgbToCss(palette[4], 0));
  ground.addColorStop(0.58, rgbToCss(palette[4], 0.34 * intensity));
  ground.addColorStop(1, rgbToCss(palette[4], 0.72 * intensity));
  ctx2d.fillStyle = ground;
  ctx2d.fillRect(0, horizonY - height * 0.06, width, height * 0.36);

  ctx2d.globalCompositeOperation = "screen";
  ctx2d.filter = `blur(${Math.round(height * 0.018)}px)`;
  const finalRim = ctx2d.createLinearGradient(0, horizonY + height * 0.02, width, horizonY + height * 0.04);
  finalRim.addColorStop(0, rgbToCss(palette[0], 0.1 * intensity));
  finalRim.addColorStop(0.38, rgbToCss(palette[1], 0.28 * intensity));
  finalRim.addColorStop(0.7, rgbToCss(palette[2], 0.36 * intensity));
  finalRim.addColorStop(1, rgbToCss(palette[3], 0.14 * intensity));
  ctx2d.fillStyle = finalRim;
  ctx2d.fillRect(0, horizonY - height * 0.02, width, height * 0.13);
  ctx2d.restore();
}

function drawPrism(ctx2d, width, height, settings, random, palette) {
  const intensity = clamp((settings.softness * 0.52 + settings.materialDepth * 0.32 + settings.brush * 0.16) / 100, 0.34, 0.92);
  ctx2d.save();
  ctx2d.globalCompositeOperation = "screen";
  ctx2d.filter = `blur(${Math.round(width * 0.018)}px)`;

  for (let i = 0; i < 6; i += 1) {
    ctx2d.save();
    ctx2d.translate(width * 0.5, height * 0.5);
    ctx2d.rotate(lerp(-0.72, 0.72, random()));
    const y = height * lerp(-0.62, 0.44, random());
    const beam = ctx2d.createLinearGradient(-width, y, width, y + height * 0.22);
    beam.addColorStop(0, rgbToCss(palette[(i + 2) % palette.length], 0));
    beam.addColorStop(0.38, rgbToCss(palette[i % palette.length], lerp(0.18, 0.42, random()) * intensity));
    beam.addColorStop(0.62, "rgba(255, 255, 255, 0.16)");
    beam.addColorStop(1, rgbToCss(palette[(i + 1) % palette.length], 0));
    ctx2d.fillStyle = beam;
    ctx2d.fillRect(-width * 1.2, y, width * 2.4, height * lerp(0.16, 0.34, random()));
    ctx2d.restore();
  }

  ctx2d.filter = `blur(${Math.round(width * 0.04)}px)`;
  for (let i = 0; i < 5; i += 1) {
    addEllipticalGlow(
      ctx2d,
      width * lerp(-0.08, 1.08, random()),
      height * lerp(0.04, 0.96, random()),
      width * lerp(0.24, 0.52, random()),
      height * lerp(0.2, 0.48, random()),
      palette[(i + 3) % palette.length],
      palette[(i + 1) % palette.length],
      lerp(0.12, 0.28, random()) * intensity
    );
  }

  ctx2d.globalCompositeOperation = "soft-light";
  ctx2d.filter = "none";
  const veil = ctx2d.createLinearGradient(0, 0, width, height);
  veil.addColorStop(0, rgbToCss(palette[4], 0.14 * intensity));
  veil.addColorStop(0.5, "rgba(255, 255, 255, 0.1)");
  veil.addColorStop(1, rgbToCss(palette[2], 0.16 * intensity));
  ctx2d.fillStyle = veil;
  ctx2d.fillRect(0, 0, width, height);
  ctx2d.restore();
}

function drawBrush(ctx2d, width, height, settings, random, palette) {
  if (settings.brush < 5) return;
  ctx2d.save();
  ctx2d.globalCompositeOperation = state.preset === "watercolor" ? "multiply" : "soft-light";
  ctx2d.lineCap = "round";
  ctx2d.lineJoin = "round";
  const count = Math.round(8 + settings.brush / 4);
  for (let i = 0; i < count; i += 1) {
    const color = palette[i % palette.length];
    ctx2d.strokeStyle = rgbToCss(color, lerp(0.04, 0.16, random()) * (settings.brush / 70));
    ctx2d.lineWidth = lerp(width * 0.025, width * 0.12, random());
    ctx2d.beginPath();
    const startY = lerp(-0.1, 1.1, random()) * height;
    ctx2d.moveTo(-width * 0.12, startY);
    ctx2d.bezierCurveTo(
      width * lerp(0.15, 0.35, random()),
      height * lerp(-0.2, 1.2, random()),
      width * lerp(0.58, 0.8, random()),
      height * lerp(-0.2, 1.2, random()),
      width * 1.12,
      height * lerp(-0.1, 1.1, random())
    );
    ctx2d.stroke();
  }
  ctx2d.restore();
}

function drawMaterial(ctx2d, width, height, settings, random, palette) {
  if (settings.materialDepth < 5) return;
  const depth = settings.materialDepth / 100;
  ctx2d.save();
  ctx2d.globalCompositeOperation = "screen";
  for (let i = 0; i < 5; i += 1) {
    const y = height * lerp(-0.2, 1.1, random());
    const x = width * lerp(-0.2, 0.8, random());
    const gradient = ctx2d.createLinearGradient(x, y, x + width * 0.7, y + height * 0.35);
    gradient.addColorStop(0, rgbToCss(palette[(i + 3) % 5], 0));
    gradient.addColorStop(0.4, rgbToCss(palette[(i + 1) % 5], 0.22 * depth));
    gradient.addColorStop(0.55, "rgba(255, 255, 255, 0.30)");
    gradient.addColorStop(1, rgbToCss(palette[i % 5], 0));
    ctx2d.fillStyle = gradient;
    ctx2d.filter = `blur(${Math.round(18 + depth * 42)}px)`;
    ctx2d.translate(width * 0.5, height * 0.5);
    ctx2d.rotate(lerp(-0.75, 0.75, random()));
    ctx2d.translate(-width * 0.5, -height * 0.5);
    ctx2d.fillRect(-width * 0.1, y, width * 1.2, height * lerp(0.12, 0.28, random()));
    ctx2d.setTransform(1, 0, 0, 1, 0, 0);
  }
  ctx2d.restore();
}

function drawParticles(ctx2d, width, height, settings, random, palette) {
  if (state.preset !== "material" && settings.materialDepth < 70) return;
  ctx2d.save();
  ctx2d.globalCompositeOperation = "screen";
  const count = 120 + Math.round(settings.materialDepth * 2.4);
  for (let i = 0; i < count; i += 1) {
    const x = random() * width;
    const y = random() * height;
    const radius = lerp(1, 6, random()) * (width / 1400);
    ctx2d.fillStyle = rgbToCss(palette[(i + 2) % palette.length], lerp(0.08, 0.28, random()));
    ctx2d.beginPath();
    ctx2d.arc(x, y, radius, 0, Math.PI * 2);
    ctx2d.fill();
  }
  ctx2d.restore();
}

function drawTexture(ctx2d, width, height, settings, random) {
  if (settings.texture < 1) return;
  const amount = settings.texture / 100;
  const image = ctx2d.getImageData(0, 0, width, height);
  const data = image.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (random() - 0.5) * 56 * amount;
    data[i] = clamp(data[i] + noise, 0, 255);
    data[i + 1] = clamp(data[i + 1] + noise, 0, 255);
    data[i + 2] = clamp(data[i + 2] + noise, 0, 255);
  }
  ctx2d.putImageData(image, 0, 0);

  if (amount > 0.32) {
    ctx2d.save();
    ctx2d.globalCompositeOperation = "soft-light";
    ctx2d.strokeStyle = `rgba(255, 255, 255, ${0.035 * amount})`;
    ctx2d.lineWidth = Math.max(1, width / 900);
    for (let y = -height; y < height * 2; y += 9) {
      ctx2d.beginPath();
      ctx2d.moveTo(-width * 0.1, y);
      ctx2d.lineTo(width * 1.1, y + width * 0.18);
      ctx2d.stroke();
    }
    ctx2d.restore();
  }
}

function drawVignette(ctx2d, width, height, settings) {
  const amount = settings.vignette / 100;
  if (amount < 0.01) return;
  const gradient = ctx2d.createRadialGradient(width * 0.52, height * 0.42, 0, width * 0.52, height * 0.42, Math.max(width, height) * 0.76);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
  gradient.addColorStop(0.62, "rgba(255, 255, 255, 0)");
  gradient.addColorStop(1, `rgba(10, 12, 20, ${0.42 * amount})`);
  ctx2d.fillStyle = gradient;
  ctx2d.fillRect(0, 0, width, height);
}

function renderTo(targetCanvas, settings, seed, frame, exportSize = false, baseOverride = null) {
  const targetCtx = targetCanvas.getContext("2d", { willReadFrequently: true });
  const { width, height } = setCanvasDimensions(targetCanvas, frame, exportSize, baseOverride);
  const random = mulberry32(seed);
  const palette = paletteAt(settings.colorMix);
  targetCtx.clearRect(0, 0, width, height);
  targetCtx.filter = "none";
  targetCtx.globalCompositeOperation = "source-over";

  drawBase(targetCtx, width, height, settings, random);

  if (state.preset === "horizon") {
    drawHorizon(targetCtx, width, height, settings, random, palette);
  } else if (state.preset === "aurora") {
    drawAurora(targetCtx, width, height, settings, random, palette);
  } else if (state.preset === "prism") {
    drawPrism(targetCtx, width, height, settings, random, palette);
  } else if (state.preset === "watercolor") {
    drawBrush(targetCtx, width, height, { ...settings, brush: Math.max(settings.brush, 82) }, random, palette);
  } else if (state.preset === "material") {
    drawMaterial(targetCtx, width, height, settings, random, palette);
    drawParticles(targetCtx, width, height, settings, random, palette);
  } else if (state.preset === "mono") {
    targetCtx.save();
    targetCtx.globalCompositeOperation = "color";
    targetCtx.fillStyle = rgbToCss(palette[2], 0.5);
    targetCtx.fillRect(0, 0, width, height);
    targetCtx.restore();
  }

  if (state.preset !== "watercolor" && state.preset !== "aurora") {
    drawBrush(targetCtx, width, height, settings, random, palette);
  }
  if (state.preset !== "horizon") {
    drawHorizon(targetCtx, width, height, settings, random, palette);
  }
  drawMaterial(targetCtx, width, height, { ...settings, materialDepth: settings.materialDepth * 0.45 }, random, palette);
  drawVignette(targetCtx, width, height, settings);
  drawTexture(targetCtx, width, height, settings, random);
}

function render() {
  const settings = readSettings();
  updateControlReadouts();
  const previewBase = state.isSliding ? 920 : null;
  renderTo(canvas, settings, state.seed, state.frame, false, previewBase);
  const exportDims = dimensionsFor(state.frame, true);
  seedLabel.textContent = `${t("seed")} ${state.seed}`;
  presetTitle.textContent = t("presetTitles")[state.preset];
  sizeLabel.textContent = `${exportDims.width} x ${exportDims.height} ${t("exportSize")}`;
  qualityLabel.textContent = `${t("grain")} ${settings.texture}`;
}

function randomize() {
  state.seed = Math.floor(Math.random() * 900000) + 1000;
  controls.colorMix.value = Math.floor(Math.random() * 101);
  controls.softness.value = Math.floor(45 + Math.random() * 50);
  controls.texture.value = Math.floor(20 + Math.random() * 68);
  controls.materialDepth.value = Math.floor(Math.random() * 88);
  controls.bands.value = Math.floor(Math.random() * 95);
  controls.brush.value = Math.floor(12 + Math.random() * 82);
  controls.vignette.value = Math.floor(Math.random() * 55);
  render();
}

function scoreCandidate(settings) {
  const diffusionScore = 1 - Math.abs(settings.softness - 72) / 100;
  const textureScore = 1 - Math.abs(settings.texture - 56) / 100;
  const colorScore = settings.colorMix > 8 && settings.colorMix < 92 ? 1 : 0.72;
  const specialScore = Math.max(settings.materialDepth, settings.bands, settings.brush) / 100;
  return clamp((diffusionScore * 0.32 + textureScore * 0.26 + colorScore * 0.18 + specialScore * 0.24), 0, 1);
}

function mutateSettings(base, random) {
  const next = { ...base };
  ["colorMix", "softness", "texture", "materialDepth", "bands", "brush", "vignette"].forEach((key) => {
    const swing = key === "colorMix" ? 34 : 26;
    next[key] = Math.round(clamp(next[key] + (random() - 0.5) * swing, 0, 100));
  });
  return next;
}

function evolve() {
  const base = readSettings();
  candidateGrid.innerHTML = "";
  const random = mulberry32(state.seed + 4417);
  let best = { score: -1, settings: base, seed: state.seed };

  for (let i = 0; i < 10; i += 1) {
    const candidateSettings = mutateSettings(base, random);
    const candidateSeed = state.seed + 101 + i * 37 + Math.floor(random() * 999);
    const score = scoreCandidate(candidateSettings);
    if (score > best.score) best = { score, settings: candidateSettings, seed: candidateSeed };

    const button = document.createElement("button");
    button.className = "candidate";
    button.type = "button";
    button.dataset.seed = String(candidateSeed);
    button.dataset.score = score.toFixed(2);
    button.dataset.settings = JSON.stringify(candidateSettings);
    const candidateCanvas = document.createElement("canvas");
    renderTo(candidateCanvas, candidateSettings, candidateSeed, "square", false, 260);
    candidateCanvas.style.width = "100%";
    candidateCanvas.style.aspectRatio = "1";
    const label = document.createElement("span");
    label.textContent = `${String(i + 1).padStart(2, "0")} ${t("score")} ${score.toFixed(2)}`;
    button.append(candidateCanvas, label);
    button.addEventListener("click", () => {
      applyCandidate(candidateSeed, candidateSettings, button);
    });
    candidateGrid.appendChild(button);
  }

  state.bestScore = best.score;
  bestScore.textContent = `${t("best")} ${best.score.toFixed(2)}`;
}

function applyCandidate(seed, settings, button) {
  state.seed = seed;
  Object.entries(settings).forEach(([key, value]) => {
    if (controls[key]) controls[key].value = value;
  });
  document.querySelectorAll(".candidate").forEach((item) => item.classList.remove("active"));
  if (button) button.classList.add("active");
  render();
}

function exportPng() {
  const exportCanvas = document.createElement("canvas");
  renderTo(exportCanvas, readSettings(), state.seed, state.frame, true);
  const link = document.createElement("a");
  link.download = `gradient-atelier-${state.preset}-${state.seed}.png`;
  link.href = exportCanvas.toDataURL("image/png");
  link.click();
}

Object.values(controls).forEach((control) => {
  control.addEventListener("input", handleControlInput);
  control.addEventListener("change", () => {
    state.isSliding = false;
    render();
  });
});

document.querySelectorAll(".segmented button").forEach((button) => {
  button.addEventListener("click", () => setPreset(button.dataset.preset));
});

document.querySelectorAll(".frame-button").forEach((button) => {
  button.addEventListener("click", () => setFrame(button.dataset.frame));
});

document.querySelectorAll("[data-lang]").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

document.getElementById("randomizeButton").addEventListener("click", randomize);
document.getElementById("resetButton").addEventListener("click", () => setPreset(state.preset));
document.getElementById("evolveButton").addEventListener("click", evolve);
document.getElementById("exportButton").addEventListener("click", exportPng);

applyLanguage();
evolve();
