import { sceneObjects } from "./sceneConfig.js";

const RADIUS_FACTOR = 0.32;
const INITIAL_SPEED = 28;
const DAMPING = 0.999;
const WANDER = 6;
const RESTITUTION = 0.98;
const MIN_SPEED = 8;
const MAX_SPEED = 90;

const sceneRoot = document.getElementById("scene-objects");
const assetHint = document.getElementById("asset-hint");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

function setVar(el, name, value) {
  if (value !== undefined && value !== null) el.style.setProperty(name, value);
}

function pctToPx(v, total) {
  if (typeof v === "string" && v.endsWith("%")) return (parseFloat(v) / 100) * total;
  return parseFloat(v) || 0;
}

function createObject(item) {
  const node = document.createElement("div");
  node.className = `object layer-${item.layer}${item.mobile?.hidden ? " mobile-hidden" : ""}`;
  setVar(node, "--z", item.z);
  setVar(node, "--rotate", `${item.rotate}deg`);

  const img = document.createElement("img");
  img.src = item.src;
  img.alt = item.alt || "";
  img.loading = "eager";
  img.decoding = "async";
  node.appendChild(img);
  sceneRoot.appendChild(node);
  return { node, img, item };
}

const entries = sceneObjects.map(createObject);
const bodies = [];

function layout() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const mob = isMobile();
  bodies.length = 0;
  for (const entry of entries) {
    const { node, item } = entry;
    if (mob && item.mobile?.hidden) continue;
    const top = mob && item.mobile?.top !== undefined ? item.mobile.top : item.top;
    const left = mob && item.mobile?.left !== undefined ? item.mobile.left : item.left;
    const width = mob && item.mobile?.width !== undefined ? item.mobile.width : item.width;
    setVar(node, "--width", `${width}px`);
    const x = pctToPx(left, vw) + width / 2;
    const y = pctToPx(top, vh) + width / 2;
    const ang = Math.random() * Math.PI * 2;
    bodies.push({
      node,
      x,
      y,
      vx: Math.cos(ang) * INITIAL_SPEED,
      vy: Math.sin(ang) * INITIAL_SPEED,
      r: width * RADIUS_FACTOR,
      w: width,
    });
  }
}

function clampSpeed(b) {
  const s = Math.hypot(b.vx, b.vy);
  if (s > MAX_SPEED) {
    b.vx = (b.vx / s) * MAX_SPEED;
    b.vy = (b.vy / s) * MAX_SPEED;
  } else if (s < MIN_SPEED) {
    const ang = s > 0 ? Math.atan2(b.vy, b.vx) : Math.random() * Math.PI * 2;
    b.vx = Math.cos(ang) * MIN_SPEED;
    b.vy = Math.sin(ang) * MIN_SPEED;
  }
}

function step(dt) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  for (const b of bodies) {
    b.vx += (Math.random() - 0.5) * WANDER * dt;
    b.vy += (Math.random() - 0.5) * WANDER * dt;
    b.vx *= DAMPING;
    b.vy *= DAMPING;
    clampSpeed(b);
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    if (b.x - b.r < 0) { b.x = b.r; b.vx = Math.abs(b.vx); }
    else if (b.x + b.r > vw) { b.x = vw - b.r; b.vx = -Math.abs(b.vx); }
    if (b.y - b.r < 0) { b.y = b.r; b.vy = Math.abs(b.vy); }
    else if (b.y + b.r > vh) { b.y = vh - b.r; b.vy = -Math.abs(b.vy); }
  }

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i], c = bodies[j];
      const dx = c.x - a.x, dy = c.y - a.y;
      const minD = a.r + c.r;
      const dist2 = dx * dx + dy * dy;
      if (dist2 >= minD * minD || dist2 < 0.0001) continue;
      const dist = Math.sqrt(dist2);
      const nx = dx / dist, ny = dy / dist;
      const overlap = (minD - dist) / 2;
      a.x -= nx * overlap; a.y -= ny * overlap;
      c.x += nx * overlap; c.y += ny * overlap;
      const rvx = c.vx - a.vx, rvy = c.vy - a.vy;
      const relN = rvx * nx + rvy * ny;
      if (relN >= 0) continue;
      const p = (1 + RESTITUTION) * relN / 2;
      a.vx += p * nx; a.vy += p * ny;
      c.vx -= p * nx; c.vy -= p * ny;
    }
  }

  for (const b of bodies) {
    b.node.style.setProperty("--x", `${b.x - b.w / 2}px`);
    b.node.style.setProperty("--y", `${b.y - b.w / 2}px`);
  }
}

let lastT = 0;
let running = false;
function frame(t) {
  if (!running) return;
  const dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 0.016;
  lastT = t;
  if (!reduceMotion.matches) step(dt);
  requestAnimationFrame(frame);
}

function start() {
  if (running) return;
  running = true;
  lastT = 0;
  requestAnimationFrame(frame);
}

let settled = 0;
const missing = [];
function onSettled() {
  settled += 1;
  if (settled !== entries.length) return;
  if (missing.length && assetHint) {
    assetHint.hidden = false;
    assetHint.textContent = `Missing (${missing.length}): ${missing.slice(0, 4).join(", ")}${missing.length > 4 ? "…" : ""}`;
  }
  layout();
  start();
}
entries.forEach(({ img, item }) => {
  img.addEventListener("error", () => {
    missing.push(item.src.replace("assets/skvoznoe/", ""));
    onSettled();
  });
  img.addEventListener("load", onSettled);
});

let resizeRaf = 0;
window.addEventListener("resize", () => {
  if (resizeRaf) cancelAnimationFrame(resizeRaf);
  resizeRaf = requestAnimationFrame(layout);
});
