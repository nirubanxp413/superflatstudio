const state = {
  currentPage: "home",
  workOpen: false,
  thoughtMode: false,
};

const PROJECTS = [
  {
    title: "King's Command",
    description: "Turn-based tactics game with natural-language command architecture.",
  },
  {
    title: "Tone Modulator",
    description: "Prompt chains modeled as modular pedal signal flow.",
  },
  {
    title: "Tamil Glyphs",
    description: "Generative studies of script geometry and parametric rhythm.",
  },
  {
    title: "RedOwl Platform",
    description: "Agentic workflows for working capital decision systems.",
  },
  {
    title: "Signal Chain",
    description: "Visual language for composable LLM transformation blocks.",
  },
];

const SKETCHES = [
  "ASSCIICK VER 1.15",
  "INTERFERENCE FIELD",
  "PARTICLE WEAVE",
  "GLYPH DRIFT",
];

const SKETCH_DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis.`;

const THOUGHTS = [
  {
    title: "Against neutral interfaces",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Taste as product infrastructure",
    image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Sketching system behavior",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Interfaces for model steering",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Composing creative tools",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
  },
];

const appShell = document.getElementById("appShell");
const mainScrollViewport = document.getElementById("mainScrollViewport");
const headerRow = document.getElementById("headerRow");
const contentRow = document.getElementById("contentRow");
const thoughtsArea = document.getElementById("thoughtsArea");
const thoughtsList = document.getElementById("thoughtsList");
const workButton = document.getElementById("workButton");
const thoughtButton = document.getElementById("thoughtButton");
const aboutButton = document.getElementById("aboutButton");
const workReveal = document.getElementById("workReveal");
const workTargets = Array.from(document.querySelectorAll("[data-target]"));

let sketchTimer = null;
/** @type {null | (() => void)} */
let disposeProjectsCarousel = null;

/** @type {null | { getPos: () => number; projs: typeof PROJECTS; cards: HTMLDivElement[]; clip: Element; measureClipW: () => number; meta: Element }} */
let projectsSceneRef = null;

/** @type {null | { wrapper: HTMLElement }} */
let sketchesSceneRef = null;

/** Sketches: canvas slide 0.6s; text fades up 0.4s starting at 0.4s → 0.8s total entry */
const SKETCHES_SCENE_ENTRY_MS = 800;
/** Exit: text 0.4s then canvas 0.6s */
const SKETCHES_SCENE_EXIT_MS = 1000;

function updateMainViewportHeight() {
  if (!mainScrollViewport) return;
  appShell.style.setProperty("--main-viewport-h", `${mainScrollViewport.clientHeight}px`);
}

/** Each slide animates for this long; next slide starts `PROJECTS_STAGGER_MS` after previous start */
const PROJECTS_CARD_DURATION_MS = 600;
const PROJECTS_STAGGER_MS = 200;

function projectsSceneTotalMs(numVisible) {
  return (numVisible - 1) * PROJECTS_STAGGER_MS + PROJECTS_CARD_DURATION_MS;
}

/** Ported from superflat/app/page.tsx (3D perspective carousel + physics) */
const CAROUSEL = {
  numVisible: 8,
  friction: 0.92,
  scrollMult: 0.0006,
  snapPull: 0.05,
  velocityDead: 0.0004,
  settleDead: 0.002,
  zSpacing: 160,
  ySpacing: 70,
  velClamp: 0.25,
  keyNudge: 0.06,
};

function mod(n, m) {
  return ((n % m) + m) % m;
}

/** easeOutQuart — entry motion */
function easeOutQuart(t) {
  return 1 - (1 - t) ** 4;
}

/** easeInQuart — exit motion */
function easeInQuart(t) {
  return t ** 4;
}

/**
 * Card `seq` (0..n-1): starts at seq * stagger, runs for `PROJECTS_CARD_DURATION_MS`.
 * @returns {{ startMs: number; endMs: number }}
 */
function sceneCardTimeWindow(seq) {
  const startMs = seq * PROJECTS_STAGGER_MS;
  const endMs = startMs + PROJECTS_CARD_DURATION_MS;
  return { startMs, endMs };
}

/** Fallback if clip metrics missing (px) */
const SCENE_MOTION_FALLBACK_PX = 560;

/**
 * Staggered card motion — position only (no scene opacity): off-screen → pose.
 * @param {number} i card slot index (0 = front, numVisible-1 = back)
 * @param {{ enter: number; exit: number } | null} motionPx travel from below / down out of frame
 */
function sceneTransitionAdjust(i, numVisible, baseOpacity, transition, motionPx) {
  if (!transition) {
    return { opacity: baseOpacity, translateYAdd: 0 };
  }
  const enterLift = motionPx?.enter ?? SCENE_MOTION_FALLBACK_PX;
  const exitDrop = motionPx?.exit ?? SCENE_MOTION_FALLBACK_PX;
  const n = numVisible;
  const totalMs = projectsSceneTotalMs(n);
  const ms = Math.min(transition.ms, totalMs);

  let seq;
  if (transition.kind === "enter") {
    seq = n - 1 - i;
  } else {
    seq = i;
  }

  const { startMs, endMs } = sceneCardTimeWindow(seq);
  const span = Math.max(endMs - startMs, 1e-6);
  let t = (ms - startMs) / span;
  t = Math.max(0, Math.min(1, t));

  if (transition.kind === "enter") {
    const eMove = easeOutQuart(t);
    return {
      opacity: baseOpacity,
      translateYAdd: (1 - eMove) * enterLift,
    };
  }
  if (transition.kind === "exit") {
    const eMove = easeInQuart(t);
    return {
      opacity: baseOpacity,
      translateYAdd: eMove * exitDrop,
    };
  }
  return { opacity: baseOpacity, translateYAdd: 0 };
}

function escapeHtml(text) {
  const d = document.createElement("div");
  d.textContent = text;
  return d.innerHTML;
}

function clearHeroScene() {
  if (sketchTimer) {
    clearInterval(sketchTimer);
    sketchTimer = null;
  }
  if (disposeProjectsCarousel) {
    disposeProjectsCarousel();
    disposeProjectsCarousel = null;
  }
  projectsSceneRef = null;
  sketchesSceneRef = null;
  contentRow.classList.remove("content-row--carousel-bleed");
  headerRow.innerHTML = "";
  contentRow.innerHTML = "";
}

function clearThoughtsArea() {
  thoughtsList.innerHTML = "";
}

function updateNav() {
  workReveal.classList.toggle("open", state.workOpen);
  workTargets.forEach((button) => {
    const target = button.dataset.target;
    button.classList.toggle("selected", !state.thoughtMode && state.currentPage === target);
  });
}

function setWorkOpen(open, { bounce = false } = {}) {
  state.workOpen = open;
  workReveal.classList.remove("work-reveal--bounce");
  updateNav();
  if (!open || !bounce) return;
  const inner = workReveal.querySelector(".work-reveal-inner");
  if (!inner) return;
  void workReveal.offsetWidth;
  workReveal.classList.add("work-reveal--bounce");
  const onEnd = (e) => {
    if (e.target !== inner) return;
    inner.removeEventListener("animationend", onEnd);
    workReveal.classList.remove("work-reveal--bounce");
  };
  inner.addEventListener("animationend", onEnd);
}

function setThoughtMode(on) {
  state.thoughtMode = on;
  appShell.classList.toggle("thought-mode", on);
  thoughtsArea.setAttribute("aria-hidden", String(!on));
  if (!on) {
    thoughtsArea.scrollTop = 0;
  }
  updateNav();
  /* Footer becomes fixed in thought mode — recalc strip page height */
  requestAnimationFrame(() => updateMainViewportHeight());
}

/** Same header for home, projects, sketches (Penpot Projects top line). */
function fillHeaderRow() {
  headerRow.innerHTML = "";
  const tagline = document.createElement("div");
  tagline.className = "hero-tagline";
  tagline.innerHTML = "VISUALLY OPINIONATED<br/>SYSTEMS THINKER";
  headerRow.appendChild(tagline);
}

function buildHome() {
  /* Header comes from fillHeaderRow(); content row stays empty on home. */
}

/**
 * @param {number} pos
 * @param {typeof PROJECTS} projs
 * @param {HTMLDivElement[]} cards
 * @param {number} clipW
 * @param {null | { kind: 'enter'; ms: number } | { kind: 'exit'; ms: number }} [sceneTransition]
 * @param {Element | null} [clipEl] carousel clip — used to size off-screen travel
 */
function renderProjectCarousel(pos, projs, cards, clipW, sceneTransition = null, clipEl = null) {
  const TOTAL = projs.length;
  if (TOTAL === 0) return;
  const { numVisible, zSpacing, ySpacing } = CAROUSEL;

  const cardWidth = clipW * 0.72;
  const cardHeight = cardWidth * (9 / 16);

  let motionPx = null;
  if (sceneTransition && clipEl) {
    const ch = clipEl.getBoundingClientRect().height;
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    motionPx = {
      enter: Math.max(ch + cardHeight + 140, vh * 0.62, 580),
      exit: Math.max(ch + cardHeight + 100, vh * 0.55, 520),
    };
  }

  const rounded = Math.round(pos);
  const frontSlot = ((Math.floor(pos) % numVisible) + numVisible) % numVisible;

  for (let i = 0; i < numVisible; i += 1) {
    const card = cards[i];
    if (!card) continue;

    const slotDepth = (i - pos + numVisible * 100) % numVisible;
    const fractionalPos = pos % 1;
    let depth = slotDepth;

    if (i === frontSlot) {
      depth = -fractionalPos;
    }

    const z = -Math.max(0, depth) * zSpacing;
    const y = -Math.max(0, depth) * ySpacing;
    const scale = Math.max(0.7, 1 - Math.max(0, depth) * 0.04);

    let opacity = 1;
    if (depth >= numVisible - 2) {
      opacity = Math.max(0, 1 - (depth - (numVisible - 2)) * 0.5);
    } else if (depth < 0) {
      const exitProgress = Math.abs(depth);
      if (exitProgress > 0.67) {
        opacity = Math.max(0, 1 - (exitProgress - 0.67) * 3);
      }
    }

    let rotateX = 0;
    let extraY = 0;
    if (depth < 0) {
      const exitProgress = Math.abs(depth);
      rotateX = -exitProgress * 90;
      extraY = exitProgress * 400;
    }

    const adj = sceneTransitionAdjust(i, numVisible, opacity, sceneTransition, motionPx);
    const ty = y + extraY + adj.translateYAdd;

    card.style.width = `${cardWidth}px`;
    card.style.height = `${cardHeight}px`;
    card.style.transform = `
        translateX(-50%)
        translateZ(${z}px)
        translateY(${ty}px)
        scale(${scale})
        rotateX(${rotateX}deg)
      `;
    card.style.opacity = String(adj.opacity);
    card.style.zIndex = String(Math.round((numVisible - depth) * 10));

    const relativeSlot = (i - frontSlot + numVisible) % numVisible;
    const projIdx = mod(rounded + relativeSlot, TOTAL);
    const p = projs[projIdx];
    card.innerHTML = `<div class="carousel-card-inner">
      <span class="carousel-card-num">${escapeHtml(String(projIdx + 1).padStart(2, "0"))}</span>
      <span class="carousel-card-title">${escapeHtml(p.title)}</span>
    </div>`;
  }
}

function buildProjects() {
  contentRow.classList.add("content-row--carousel-bleed");
  const wrapper = document.createElement("section");
  wrapper.className = "projects-wrapper projects-wrapper--carousel-bleed";

  const first = PROJECTS[0];
  wrapper.innerHTML = `
    <div class="projects-text" id="projectsMeta">
      <div class="projects-index">01</div>
      <div class="projects-title">${escapeHtml(first.title)}</div>
      <div class="projects-desc">${escapeHtml(first.description)}</div>
    </div>
    <div class="projects-carousel">
      <div class="projects-carousel-clip" id="projectsCarouselClip">
        <div class="projects-carousel-stage" id="projectsCarouselStage"></div>
      </div>
    </div>
  `;

  contentRow.appendChild(wrapper);

  const stage = wrapper.querySelector("#projectsCarouselStage");
  const meta = wrapper.querySelector("#projectsMeta");
  const clip = wrapper.querySelector("#projectsCarouselClip");
  const projs = PROJECTS;

  meta.classList.add("projects-text--enter");

  const sceneTotalMs = projectsSceneTotalMs(CAROUSEL.numVisible);
  meta.style.setProperty("--projects-scene-total-ms", `${sceneTotalMs}ms`);

  const cards = [];
  for (let i = 0; i < CAROUSEL.numVisible; i += 1) {
    const card = document.createElement("div");
    card.className = "carousel-card";
    card.setAttribute("role", "img");
    card.setAttribute("aria-hidden", "true");
    stage.appendChild(card);
    cards.push(card);
  }

  let posRef = 0;
  let velRef = 0;
  let lastMetaIdx = -1;
  let rafId = 0;
  const entryStart = performance.now();

  function syncMeta(idx) {
    if (idx === lastMetaIdx) return;
    lastMetaIdx = idx;
    const p = projs[idx];
    meta.querySelector(".projects-index").textContent = String(idx + 1).padStart(2, "0");
    meta.querySelector(".projects-title").textContent = p.title;
    meta.querySelector(".projects-desc").textContent = p.description;
  }

  function measureClipW() {
    const w = clip.getBoundingClientRect().width;
    return w > 40 ? w : window.innerWidth * 0.5;
  }

  function tick() {
    if (state.currentPage !== "projects") return;
    const TOTAL = projs.length;
    if (TOTAL === 0) {
      rafId = requestAnimationFrame(tick);
      return;
    }

    const { friction, velocityDead, settleDead, snapPull } = CAROUSEL;

    velRef *= friction;

    if (Math.abs(velRef) < velocityDead) {
      const nearest = Math.round(posRef);
      const diff = nearest - posRef;
      if (Math.abs(diff) < settleDead) {
        posRef = nearest;
        velRef = 0;
      } else {
        posRef += diff * snapPull;
      }
    }

    posRef += velRef;

    const clipW = measureClipW();
    const entryAge = performance.now() - entryStart;
    const sceneTransition =
      entryAge < sceneTotalMs ? { kind: "enter", ms: entryAge } : null;
    renderProjectCarousel(posRef, projs, cards, clipW, sceneTransition, clip);

    const aIdx = mod(Math.round(posRef), TOTAL);
    syncMeta(aIdx);

    rafId = requestAnimationFrame(tick);
  }

  const onWheel = (e) => {
    if (state.currentPage !== "projects") return;
    e.preventDefault();
    velRef += e.deltaY * CAROUSEL.scrollMult;
    velRef = Math.max(-CAROUSEL.velClamp, Math.min(CAROUSEL.velClamp, velRef));
  };

  let touchY = 0;
  const onTouchStart = (e) => {
    if (state.currentPage !== "projects") return;
    touchY = e.touches[0].clientY;
    velRef = 0;
  };
  const onTouchMove = (e) => {
    if (state.currentPage !== "projects") return;
    e.preventDefault();
    const y = e.touches[0].clientY;
    velRef = (touchY - y) * 0.003;
    touchY = y;
  };

  const onKeyDown = (e) => {
    if (state.currentPage !== "projects") return;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") velRef += CAROUSEL.keyNudge;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") velRef -= CAROUSEL.keyNudge;
  };

  const onResize = () => {
    if (state.currentPage !== "projects") return;
    const entryAge = performance.now() - entryStart;
    const sceneTransition =
      entryAge < sceneTotalMs ? { kind: "enter", ms: entryAge } : null;
    renderProjectCarousel(posRef, projs, cards, measureClipW(), sceneTransition, clip);
  };

  clip.addEventListener("wheel", onWheel, { passive: false });
  clip.addEventListener("touchstart", onTouchStart, { passive: true });
  clip.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("resize", onResize);

  lastMetaIdx = -1;
  syncMeta(0);
  renderProjectCarousel(0, projs, cards, measureClipW(), { kind: "enter", ms: 0 }, clip);

  projectsSceneRef = {
    getPos: () => posRef,
    projs,
    cards,
    clip,
    measureClipW,
    meta,
  };

  rafId = requestAnimationFrame(tick);

  disposeProjectsCarousel = () => {
    cancelAnimationFrame(rafId);
    clip.removeEventListener("wheel", onWheel);
    clip.removeEventListener("touchstart", onTouchStart);
    clip.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("resize", onResize);
  };

  return new Promise((resolve) => {
    window.setTimeout(() => resolve({ wrapper, cards, meta }), sceneTotalMs);
  });
}

function buildSketches() {
  const wrapper = document.createElement("section");
  wrapper.className = "sketches-wrapper";
  const dots = Array.from({ length: 7 })
    .map((_, index) => `<span class="sketches-dot ${index === 0 ? "active" : ""}"></span>`)
    .join("");

  wrapper.innerHTML = `
    <div class="sketches-frame" id="sketchesFrame">
      <div class="sketch-stage">
        <div class="sketch-noise"></div>
        <div id="sketchTitle">${SKETCHES[0]}</div>
      </div>
    </div>
    <div class="sketches-right">
      <div class="sketches-descriptor">
        <div class="sketches-meta" id="sketchesMeta">
          <div class="sketches-title">${SKETCHES[0]}</div>
          <div class="sketches-desc">${SKETCH_DESCRIPTION}</div>
        </div>
      </div>
      <div class="sketches-indicators">${dots}</div>
    </div>
  `;
  contentRow.appendChild(wrapper);
  wrapper.classList.add("sketches-scene-enter");
  sketchesSceneRef = { wrapper };

  const titleEl = wrapper.querySelector("#sketchTitle");
  const metaTitleEl = wrapper.querySelector(".sketches-title");
  const dotsEls = Array.from(wrapper.querySelectorAll(".sketches-dot"));

  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.setTimeout(() => {
          let index = 0;
          sketchTimer = setInterval(() => {
            index = (index + 1) % SKETCHES.length;
            titleEl.textContent = SKETCHES[index];
            metaTitleEl.textContent = SKETCHES[index];
            dotsEls.forEach((dot, dotIndex) => {
              dot.classList.toggle("active", dotIndex === index % dotsEls.length);
            });
          }, 1700);
          resolve({
            wrapper,
            frame: wrapper.querySelector("#sketchesFrame"),
            meta: wrapper.querySelector("#sketchesMeta"),
          });
        }, SKETCHES_SCENE_ENTRY_MS);
      });
    });
  });
}

function buildThoughtsList() {
  const items = THOUGHTS.map((item, index) => {
    const n = String(index + 1).padStart(2, "0");
    return `
      <div class="thought-item" data-image="${item.image}">
        <span>${item.title}</span>
        <span class="thought-item-count">${n}</span>
      </div>
    `;
  }).join("");

  thoughtsList.innerHTML = `
    ${items}
    <img class="thought-preview" id="thoughtPreview" alt="Thought preview" />
  `;

  const stage = thoughtsList;
  const preview = thoughtsList.querySelector("#thoughtPreview");
  const itemsEls = Array.from(thoughtsList.querySelectorAll(".thought-item"));

  itemsEls.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      const bounds = stage.getBoundingClientRect();
      const w = Math.min(bounds.width * 0.35, 400);
      const h = Math.min(bounds.height * 0.32, 280);
      const x = Math.random() * Math.max(10, bounds.width - w - 20);
      const y = Math.random() * Math.max(10, bounds.height - h - 20);

      preview.src = item.dataset.image;
      preview.style.left = `${x}px`;
      preview.style.top = `${y}px`;
      preview.classList.add("visible");
    });

    item.addEventListener("mouseleave", () => {
      preview.classList.remove("visible");
    });
  });

  return { stage, items: itemsEls };
}

function animateProjectsExit() {
  if (!projectsSceneRef) return Promise.resolve();
  const ref = projectsSceneRef;
  const posSnapshot = ref.getPos();
  const { projs, cards, clip, measureClipW, meta } = ref;

  if (disposeProjectsCarousel) {
    disposeProjectsCarousel();
    disposeProjectsCarousel = null;
  }

  meta.classList.remove("projects-text--enter");
  meta.classList.add("projects-text--exit");

  const sceneTotalMs = projectsSceneTotalMs(CAROUSEL.numVisible);
  meta.style.setProperty("--projects-scene-total-ms", `${sceneTotalMs}ms`);

  return new Promise((resolve) => {
    const start = performance.now();
    function frame() {
      const ms = performance.now() - start;
      const t = Math.min(ms, sceneTotalMs);
      renderProjectCarousel(posSnapshot, projs, cards, measureClipW(), { kind: "exit", ms: t }, clip);
      if (ms >= sceneTotalMs) {
        resolve();
        return;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
}

function animateSketchesExit() {
  if (!sketchesSceneRef?.wrapper) return Promise.resolve();
  const { wrapper } = sketchesSceneRef;
  wrapper.classList.remove("sketches-scene-enter");
  wrapper.classList.add("sketches-scene-exit");
  return new Promise((resolve) => {
    window.setTimeout(() => {
      sketchesSceneRef = null;
      resolve();
    }, SKETCHES_SCENE_EXIT_MS);
  });
}

async function goToHeroPage(page) {
  if (state.thoughtMode) {
    setThoughtMode(false);
    clearThoughtsArea();
    updateMainViewportHeight();
  }
  if (state.currentPage === "projects" && page !== "projects") {
    await animateProjectsExit();
  }
  if (state.currentPage === "sketches" && page !== "sketches") {
    await animateSketchesExit();
  }
  state.currentPage = page;
  clearHeroScene();
  fillHeaderRow();
  updateMainViewportHeight();
  if (page === "projects") {
    await buildProjects();
    updateNav();
    return;
  }
  if (page === "sketches") {
    await buildSketches();
    updateNav();
    return;
  }
  buildHome();
  updateNav();
}

function goToThoughts() {
  if (state.thoughtMode) return;
  clearThoughtsArea();
  buildThoughtsList();
  updateMainViewportHeight();
  thoughtsArea.scrollTop = 0;
  setThoughtMode(true);
}

workButton.addEventListener("click", () => {
  if (state.thoughtMode) {
    void goToHeroPage("home");
    setWorkOpen(true, { bounce: true });
    return;
  }
  const next = !state.workOpen;
  setWorkOpen(next);
});

workTargets.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.target;
    if (!target) return;
    setWorkOpen(true);
    void goToHeroPage(target);
  });
});

thoughtButton.addEventListener("click", () => {
  goToThoughts();
});

aboutButton.addEventListener("click", () => {
  void goToHeroPage("home");
});

async function init() {
  updateMainViewportHeight();
  window.addEventListener("resize", updateMainViewportHeight);
  updateNav();
  await goToHeroPage("home");
}

init();
