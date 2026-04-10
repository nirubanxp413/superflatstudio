export type HomePage = 'home' | 'projects' | 'sketches'

/** Hero footer / content-row transition lifecycle (projects & sketches scenes). */
export type HeroNavTransitionPhase = 'idle' | 'exiting' | 'entering'

export type PocProject = { title: string; description: string }

export const POC_PROJECTS: PocProject[] = [
  {
    title: "King's Command",
    description:
      'Turn-based tactics game with natural-language command architecture.',
  },
  {
    title: 'Tone Modulator',
    description: 'Prompt chains modeled as modular pedal signal flow.',
  },
  {
    title: 'Tamil Glyphs',
    description:
      'Generative studies of script geometry and parametric rhythm.',
  },
  {
    title: 'RedOwl Platform',
    description: 'Agentic workflows for working capital decision systems.',
  },
  {
    title: 'Signal Chain',
    description:
      'Visual language for composable LLM transformation blocks.',
  },
]

export const POC_SKETCHES: string[] = [
  'ASSCIICK VER 1.15',
  'INTERFERENCE FIELD',
  'PARTICLE WEAVE',
  'GLYPH DRIFT',
]

export const POC_SKETCH_DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis.`

export type PocThought = {
  title: string
  image: string
  /** ISO date — same formatter as /thought/[slug] */
  publishedAt: string
  /** Longform slug when a CMS-backed page exists */
  slug?: string
}

export const POC_THOUGHTS: PocThought[] = [
  {
    title: 'Against neutral interfaces',
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2025-08-12T00:00:00.000Z',
    slug: 'against-neutral-interfaces',
  },
  {
    title: 'Taste as product infrastructure',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2025-06-02T00:00:00.000Z',
    slug: 'taste-as-product-infrastructure',
  },
  {
    title: 'Sketching system behavior',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2025-04-20T00:00:00.000Z',
    slug: 'sketching-system-behavior',
  },
  {
    title: 'Interfaces for model steering',
    image:
      'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2025-02-01T00:00:00.000Z',
    slug: 'interfaces-for-model-steering',
  },
  {
    title: 'Composing creative tools',
    image:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2024-11-18T00:00:00.000Z',
    slug: 'composing-creative-tools',
  },
]

export const SKETCHES_SCENE_ENTRY_MS = 800
export const SKETCHES_SCENE_EXIT_MS = 1000

export const PROJECTS_CARD_DURATION_MS = 600
export const PROJECTS_STAGGER_MS = 200

export const CAROUSEL = {
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
} as const

export function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

export function easeOutQuart(t: number) {
  return 1 - (1 - t) ** 4
}

export function easeInQuart(t: number) {
  return t ** 4
}

export function easeOutCubic(t: number) {
  const u = 1 - t
  return 1 - u * u * u
}

/** Card width as fraction of clip width — large deck */
export const CAROUSEL_CARD_WIDTH_FRAC = 0.97

export type CarouselFocusRender = {
  /** Physical slot index 0..numVisible-1 */
  focusedSlot: number | null
  /** Extra translateY (px) on the focused card toward hero center */
  focusLiftPx: number
  /** Extra translateX (px) after -50% — toward hero horizontal center */
  focusShiftXPx: number
  /** Blur and dim other cards */
  blurOthers: boolean
}

export function projectsSceneTotalMs(numVisible: number) {
  return (numVisible - 1) * PROJECTS_STAGGER_MS + PROJECTS_CARD_DURATION_MS
}

export function sceneCardTimeWindow(seq: number) {
  const startMs = seq * PROJECTS_STAGGER_MS
  const endMs = startMs + PROJECTS_CARD_DURATION_MS
  return { startMs, endMs }
}

export const SCENE_MOTION_FALLBACK_PX = 560

export function sceneTransitionAdjust(
  i: number,
  numVisible: number,
  baseOpacity: number,
  transition:
    | null
    | { kind: 'enter'; ms: number }
    | { kind: 'exit'; ms: number },
  motionPx: { enter: number; exit: number } | null
) {
  if (!transition) {
    return { opacity: baseOpacity, translateYAdd: 0 }
  }
  const enterLift = motionPx?.enter ?? SCENE_MOTION_FALLBACK_PX
  const exitDrop = motionPx?.exit ?? SCENE_MOTION_FALLBACK_PX
  const n = numVisible
  const totalMs = projectsSceneTotalMs(n)
  const ms = Math.min(transition.ms, totalMs)

  let seq: number
  if (transition.kind === 'enter') {
    seq = n - 1 - i
  } else {
    seq = i
  }

  const { startMs, endMs } = sceneCardTimeWindow(seq)
  const span = Math.max(endMs - startMs, 1e-6)
  let t = (ms - startMs) / span
  t = Math.max(0, Math.min(1, t))

  if (transition.kind === 'enter') {
    const eMove = easeOutQuart(t)
    return {
      opacity: baseOpacity,
      translateYAdd: (1 - eMove) * enterLift,
    }
  }
  if (transition.kind === 'exit') {
    const eMove = easeInQuart(t)
    return {
      opacity: baseOpacity,
      translateYAdd: eMove * exitDrop,
    }
  }
  return { opacity: baseOpacity, translateYAdd: 0 }
}

export function escapeHtml(text: string) {
  const d = document.createElement('div')
  d.textContent = text
  return d.innerHTML
}

export function renderProjectCarousel(
  pos: number,
  projs: readonly PocProject[],
  cards: HTMLDivElement[],
  clipW: number,
  sceneTransition:
    | null
    | { kind: 'enter'; ms: number }
    | { kind: 'exit'; ms: number } = null,
  clipEl: HTMLElement | null = null,
  clipH: number | null = null,
  focus: CarouselFocusRender | null = null
) {
  const TOTAL = projs.length
  if (TOTAL === 0) return
  const { numVisible, zSpacing, ySpacing } = CAROUSEL

  let cardWidth = clipW * CAROUSEL_CARD_WIDTH_FRAC
  let cardHeight = cardWidth * (9 / 16)
  if (clipH != null && clipH > 40) {
    const maxH = clipH * 0.74
    if (cardHeight > maxH) {
      cardHeight = maxH
      cardWidth = cardHeight * (16 / 9)
    }
  }

  let motionPx: { enter: number; exit: number } | null = null
  if (sceneTransition && clipEl) {
    const ch = clipEl.getBoundingClientRect().height
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800
    motionPx = {
      enter: Math.max(ch + cardHeight + 140, vh * 0.62, 580),
      exit: Math.max(ch + cardHeight + 100, vh * 0.55, 520),
    }
  }

  const rounded = Math.round(pos)
  const frontSlot = ((Math.floor(pos) % numVisible) + numVisible) % numVisible

  for (let i = 0; i < numVisible; i += 1) {
    const card = cards[i]
    if (!card) continue

    const slotDepth = (i - pos + numVisible * 100) % numVisible
    const fractionalPos = pos % 1
    let depth = slotDepth

    if (i === frontSlot) {
      depth = -fractionalPos
    }

    const z = -Math.max(0, depth) * zSpacing
    const y = -Math.max(0, depth) * ySpacing
    const scale = Math.max(0.7, 1 - Math.max(0, depth) * 0.04)

    let opacity = 1
    if (depth >= numVisible - 2) {
      opacity = Math.max(0, 1 - (depth - (numVisible - 2)) * 0.5)
    } else if (depth < 0) {
      const exitProgress = Math.abs(depth)
      if (exitProgress > 0.67) {
        opacity = Math.max(0, 1 - (exitProgress - 0.67) * 3)
      }
    }

    let rotateX = 0
    let extraY = 0
    if (depth < 0) {
      const exitProgress = Math.abs(depth)
      rotateX = -exitProgress * 90
      extraY = exitProgress * 400
    }

    const adj = sceneTransitionAdjust(
      i,
      numVisible,
      opacity,
      sceneTransition,
      motionPx
    )
    let ty = y + extraY + adj.translateYAdd
    const shiftX =
      focus?.focusedSlot === i ? (focus.focusShiftXPx ?? 0) : 0
    if (focus?.focusedSlot === i) {
      ty += focus.focusLiftPx
    }

    const blurThis =
      focus?.blurOthers &&
      focus.focusedSlot !== null &&
      i !== focus.focusedSlot

    card.style.width = `${cardWidth}px`
    card.style.height = `${cardHeight}px`
    card.style.transform = `
        translateX(calc(-50% + ${shiftX}px))
        translateZ(${z}px)
        translateY(${ty}px)
        scale(${scale})
        rotateX(${rotateX}deg)
      `
    let op = adj.opacity
    if (blurThis) {
      op *= 0.22
    }
    card.style.opacity = String(op)
    card.style.filter = blurThis ? 'blur(16px)' : ''
    card.style.zIndex = String(
      Math.round((numVisible - depth) * 10) + (focus?.focusedSlot === i ? 100 : 0)
    )

    const relativeSlot = (i - frontSlot + numVisible) % numVisible
    const projIdx = mod(rounded + relativeSlot, TOTAL)
    const p = projs[projIdx]
    card.innerHTML = `<div class="carousel-card-inner">
      <span class="carousel-card-num">${escapeHtml(String(projIdx + 1).padStart(2, '0'))}</span>
      <span class="carousel-card-title">${escapeHtml(p.title)}</span>
    </div>`
  }
}

export type ProjectsSceneRef = {
  getPos: () => number
  projs: readonly PocProject[]
  cards: HTMLDivElement[]
  clip: HTMLElement
  measureClipW: () => number
  measureClipH: () => number
}
