const heroSceneConfig = window.HERO_SCENE_CONFIG;

if (!heroSceneConfig) {
  throw new Error("Missing HERO_SCENE_CONFIG. Make sure scene-config.js is loaded before script.js");
}

const PARALLAX_SPEED = heroSceneConfig.parallaxSpeed;
const sceneObjects = heroSceneConfig.objects;

const sceneRoot = document.getElementById("scene-objects");
const assetHint = document.getElementById("asset-hint");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let scrollY = 0;
let ticking = false;
const objectNodes = [];

function setVar(el, name, value) {
  if (value !== undefined && value !== null) el.style.setProperty(name, value);
}

function createObject(item) {
  const node = document.createElement("div");
  node.className = `object layer-${item.layer}${item.mobile?.hidden ? " mobile-hidden" : ""}`;

  setVar(node, "--top", item.top);
  setVar(node, "--left", item.left);
  setVar(node, "--width", `${item.width}px`);
  setVar(node, "--z", item.z);
  setVar(node, "--rotate", `${item.rotate}deg`);
  setVar(node, "--float-amplitude", `${item.floatAmplitude}px`);
  setVar(node, "--float-duration", `${item.floatDuration}s`);
  setVar(node, "--float-delay", `${item.floatDelay}s`);
  setVar(node, "--mobile-top", item.mobile?.top);
  setVar(node, "--mobile-left", item.mobile?.left);
  setVar(node, "--mobile-width", item.mobile?.width ? `${item.mobile.width}px` : undefined);

  const floatWrap = document.createElement("div");
  floatWrap.className = "float-wrap";

  const img = document.createElement("img");
  img.src = item.src;
  img.alt = item.alt;
  img.loading = "eager";
  img.decoding = "async";

  floatWrap.appendChild(img);
  node.appendChild(floatWrap);
  sceneRoot.appendChild(node);

  objectNodes.push({ node, layer: item.layer });
  return img;
}

function applyParallax() {
  const disabled = reduceMotion.matches;
  for (const entry of objectNodes) {
    const y = disabled ? 0 : scrollY * PARALLAX_SPEED[entry.layer];
    entry.node.style.setProperty("--parallax-y", `${y}px`);
  }
  ticking = false;
}

function onScroll() {
  scrollY = window.scrollY || window.pageYOffset || 0;
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(applyParallax);
  }
}

function showMissingAssets(missing) {
  if (!missing.length) return;
  assetHint.hidden = false;
  assetHint.textContent = `Missing assets (${missing.length}). Add WEBP files to public/scene: ${missing.slice(0, 4).join(", ")}${
    missing.length > 4 ? "…" : ""
  }`;
}

const probes = sceneObjects.map((item) => createObject(item));
const missing = [];
let settledCount = 0;

function settle() {
  settledCount += 1;
  if (settledCount === probes.length) showMissingAssets(missing);
}

probes.forEach((img, index) => {
  img.addEventListener("error", () => {
    missing.push(sceneObjects[index].src.replace("scene/", ""));
    settle();
  });
  img.addEventListener("load", settle);
});

window.addEventListener("scroll", onScroll, { passive: true });
reduceMotion.addEventListener?.("change", applyParallax);
onScroll();
