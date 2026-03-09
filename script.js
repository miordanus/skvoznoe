const PARALLAX_SPEED = {
  back: 0.12,
  mid: 0.32,
  front: 0.55,
};

const sceneObjects = [
  { src: "scene/ostrich.webp", alt: "ostrich engraving", layer: "back", top: "5%", left: "6%", width: 420, rotate: -6, z: 1, floatAmplitude: 10, floatDuration: 15, floatDelay: 0.2, mobile: { top: "6%", left: "-16%", width: 220 } },
  { src: "scene/pelican.webp", alt: "pelican engraving", layer: "back", top: "4%", left: "72%", width: 380, rotate: 4, z: 1, floatAmplitude: 8, floatDuration: 17, floatDelay: 1.3, mobile: { top: "8%", left: "62%", width: 180 } },
  { src: "scene/wine_press.webp", alt: "wine press engraving", layer: "back", top: "41%", left: "78%", width: 300, rotate: -3, z: 1, floatAmplitude: 7, floatDuration: 16, floatDelay: 2.1, mobile: { hidden: true } },
  { src: "scene/duck_roast.webp", alt: "duck roast engraving", layer: "mid", top: "18%", left: "39%", width: 340, rotate: 2, z: 2, floatAmplitude: 10, floatDuration: 14, floatDelay: 0.8, mobile: { top: "18%", left: "42%", width: 220 } },
  { src: "scene/sumo.webp", alt: "sumo engraving", layer: "mid", top: "39%", left: "62%", width: 300, rotate: -2, z: 2, floatAmplitude: 8, floatDuration: 13, floatDelay: 1.1, mobile: { hidden: true } },
  { src: "scene/fish.webp", alt: "fish engraving", layer: "mid", top: "71%", left: "13%", width: 260, rotate: 8, z: 2, floatAmplitude: 9, floatDuration: 12, floatDelay: 2.8, mobile: { top: "78%", left: "4%", width: 150 } },
  { src: "scene/book.webp", alt: "book engraving", layer: "mid", top: "58%", left: "72%", width: 220, rotate: 12, z: 2, floatAmplitude: 7, floatDuration: 11, floatDelay: 0.5, mobile: { hidden: true } },
  { src: "scene/web_designer.webp", alt: "web designer engraving", layer: "mid", top: "79%", left: "81%", width: 210, rotate: -4, z: 2, floatAmplitude: 6, floatDuration: 10, floatDelay: 1.7, mobile: { hidden: true } },
  { src: "scene/knuckles.webp", alt: "knuckles engraving", layer: "front", top: "42%", left: "18%", width: 240, rotate: -12, z: 3, floatAmplitude: 10, floatDuration: 12, floatDelay: 0.4, mobile: { top: "48%", left: "0%", width: 160 } },
  { src: "scene/gold_teeth.webp", alt: "gold teeth engraving", layer: "front", top: "64%", left: "47%", width: 260, rotate: 2, z: 3, floatAmplitude: 8, floatDuration: 10, floatDelay: 1.9, mobile: { top: "72%", left: "38%", width: 180 } },
  { src: "scene/axe_head.webp", alt: "axe in head engraving", layer: "front", top: "12%", left: "48%", width: 240, rotate: -8, z: 3, floatAmplitude: 7, floatDuration: 12, floatDelay: 0.9, mobile: { top: "6%", left: "38%", width: 160 } },
  { src: "scene/matchbox.webp", alt: "matchbox engraving", layer: "front", top: "61%", left: "2%", width: 210, rotate: 6, z: 3, floatAmplitude: 6, floatDuration: 11, floatDelay: 2.2, mobile: { top: "70%", left: "-2%", width: 130 } },
  { src: "scene/yogi.webp", alt: "yogi engraving", layer: "front", top: "73%", left: "26%", width: 210, rotate: -3, z: 3, floatAmplitude: 8, floatDuration: 13, floatDelay: 1.2, mobile: { hidden: true } },
  { src: "scene/priest.webp", alt: "priest engraving", layer: "front", top: "15%", left: "82%", width: 220, rotate: 4, z: 3, floatAmplitude: 7, floatDuration: 15, floatDelay: 2.7, mobile: { hidden: true } },
  { src: "scene/salo.webp", alt: "salo engraving", layer: "front", top: "81%", left: "46%", width: 200, rotate: 1, z: 3, floatAmplitude: 5, floatDuration: 9, floatDelay: 0.6, mobile: { top: "84%", left: "62%", width: 120 } },
];

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
  assetHint.textContent = `Missing assets (${missing.length}). Upload WebPs to /scene/: ${missing.slice(0, 4).join(", ")}${
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
