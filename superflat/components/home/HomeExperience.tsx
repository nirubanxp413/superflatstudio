'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  CAROUSEL,
  POC_PROJECTS,
  POC_SKETCH_DESCRIPTION,
  POC_SKETCHES,
  POC_THOUGHTS,
  SKETCHES_SCENE_ENTRY_MS,
  SKETCHES_SCENE_EXIT_MS,
  easeOutQuart,
  escapeHtml,
  mod,
  projectsSceneTotalMs,
  renderProjectCarousel,
  type CarouselFocusRender,
  type HomePage,
  type ProjectsSceneRef,
} from './homeExperienceLib'
import './homeExperience.css'
import { ThoughtListItem } from './ThoughtListItem'
import {
  useHeroNavTransition,
  type HeroNavTransitionDeps,
} from './useHeroNavTransition'

function navLinkClass(active: boolean) {
  const base =
    'nav-button text-2xl font-semibold leading-tight transition-colors duration-150'
  if (active) return `${base} text-[var(--brand)]`
  return `${base} text-[var(--muted)] hover:text-[var(--gray)]`
}

export function HomeExperience() {
  const activePageRef = useRef<HomePage>('home')
  const [thoughtMode, setThoughtMode] = useState(false)
  const [carouselBleed, setCarouselBleed] = useState(false)
  const [thoughtPreview, setThoughtPreview] = useState<{
    src: string
    x: number
    y: number
    visible: boolean
  }>({ src: '', x: 0, y: 0, visible: false })

  const mainScrollViewportRef = useRef<HTMLDivElement>(null)
  const appShellRef = useRef<HTMLElement>(null)
  const contentRowRef = useRef<HTMLDivElement>(null)
  const thoughtsAreaRef = useRef<HTMLElement>(null)
  const thoughtsListRef = useRef<HTMLDivElement>(null)

  const disposeProjectsCarouselRef = useRef<(() => void) | null>(null)
  const projectsSceneRef = useRef<ProjectsSceneRef | null>(null)
  const sketchesSceneWrapperRef = useRef<HTMLElement | null>(null)
  const sketchTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const updateMainViewportHeight = useCallback(() => {
    const vp = mainScrollViewportRef.current
    const shell = appShellRef.current
    if (!vp || !shell) return
    shell.style.setProperty('--main-viewport-h', `${vp.clientHeight}px`)
  }, [])

  const exitThoughtMode = useCallback(() => {
    setThoughtMode((m) => {
      if (!m) return m
      if (thoughtsAreaRef.current) thoughtsAreaRef.current.scrollTop = 0
      return false
    })
    updateMainViewportHeight()
  }, [updateMainViewportHeight])

  const clearHeroScene = useCallback(() => {
    if (sketchTimerRef.current) {
      clearInterval(sketchTimerRef.current)
      sketchTimerRef.current = null
    }
    disposeProjectsCarouselRef.current?.()
    disposeProjectsCarouselRef.current = null
    projectsSceneRef.current = null
    sketchesSceneWrapperRef.current = null
    setCarouselBleed(false)
    const row = contentRowRef.current
    if (row) row.innerHTML = ''
  }, [])

  const animateProjectsExit = useCallback((): Promise<void> => {
    const ref = projectsSceneRef.current
    if (!ref) return Promise.resolve()

    const posSnapshot = ref.getPos()
    const { projs, cards, clip, measureClipW, measureClipH } = ref

    disposeProjectsCarouselRef.current?.()
    disposeProjectsCarouselRef.current = null

    const sceneTotalMs = projectsSceneTotalMs(CAROUSEL.numVisible)

    return new Promise<void>((resolve) => {
      const start = performance.now()
      function frame() {
        const ms = performance.now() - start
        const t = Math.min(ms, sceneTotalMs)
        renderProjectCarousel(
          posSnapshot,
          projs,
          cards,
          measureClipW(),
          { kind: 'exit', ms: t },
          clip,
          measureClipH(),
          null
        )
        if (ms >= sceneTotalMs) {
          resolve()
          return
        }
        requestAnimationFrame(frame)
      }
      requestAnimationFrame(frame)
    })
  }, [])

  const animateSketchesExit = useCallback((): Promise<void> => {
    const w = sketchesSceneWrapperRef.current
    if (!w) return Promise.resolve()
    w.classList.remove('sketches-scene-enter')
    w.classList.add('sketches-scene-exit')
    return new Promise<void>((resolve) => {
      window.setTimeout(() => {
        sketchesSceneWrapperRef.current = null
        resolve()
      }, SKETCHES_SCENE_EXIT_MS)
    })
  }, [])

  const buildProjects = useCallback((): Promise<void> => {
    const contentRow = contentRowRef.current
    if (!contentRow) return Promise.resolve()

    const FOCUS_MS = 620
    /** Matches Tailwind `p-4` / Carbon spacing-04 */
    const FOCUS_LABEL_GAP_PX = 16
    const FULLSCREEN_EXPAND_MS = 500
    const FULLSCREEN_EXPAND_EASE = 'cubic-bezier(0.25, 1, 0.5, 1)'
    const CARD_RADIUS_PX = 16

    setCarouselBleed(true)
    const wrapper = document.createElement('section')
    wrapper.className = 'projects-wrapper projects-wrapper--carousel-bleed'

    wrapper.innerHTML = `
    <div class="projects-carousel">
      <div class="projects-carousel-clip" id="projectsCarouselClip">
        <div class="projects-carousel-stage" id="projectsCarouselStage">
          <div class="projects-carousel-deck" id="projectsCarouselDeck"></div>
          <div class="projects-focus-label" id="projectsFocusLabel" aria-hidden="true"></div>
        </div>
      </div>
    </div>
    <div class="projects-fullscreen-overlay" id="projectsFullscreen" hidden>
      <button type="button" class="projects-fullscreen-close" aria-label="Close">×</button>
      <div class="projects-fullscreen-inner">
        <h2 class="projects-fullscreen-title"></h2>
        <p class="projects-fullscreen-status">Loading project…</p>
      </div>
    </div>
  `

    contentRow.appendChild(wrapper)

    const deck = wrapper.querySelector('#projectsCarouselDeck') as HTMLDivElement
    const clip = wrapper.querySelector('#projectsCarouselClip') as HTMLElement
    const labelEl = wrapper.querySelector('#projectsFocusLabel') as HTMLElement
    const fullscreenEl = wrapper.querySelector('#projectsFullscreen') as HTMLElement
    const fullscreenTitle = wrapper.querySelector(
      '.projects-fullscreen-title'
    ) as HTMLElement
    const fullscreenStatus = wrapper.querySelector(
      '.projects-fullscreen-status'
    ) as HTMLElement
    const fullscreenClose = wrapper.querySelector(
      '.projects-fullscreen-close'
    ) as HTMLButtonElement

    const projs = POC_PROJECTS
    const sceneTotalMs = projectsSceneTotalMs(CAROUSEL.numVisible)

    const cards: HTMLDivElement[] = []
    for (let i = 0; i < CAROUSEL.numVisible; i += 1) {
      const card = document.createElement('div')
      card.className = 'carousel-card'
      card.setAttribute('role', 'button')
      card.tabIndex = 0
      deck.appendChild(card)
      cards.push(card)
    }

    let posRef = 0
    let velRef = 0
    let rafId = 0
    const entryStart = performance.now()

    const focus = {
      mode: 'browse' as
        | 'browse'
        | 'selecting'
        | 'focused'
        | 'deselecting'
        | 'detail',
      slot: null as number | null,
      offsetX: 0,
      offsetY: 0,
      t0: 0,
      /** Lift/shift scale at deselect start (1 when fully focused; lower if cancelling mid-select). */
      deselectK0: 1,
    }

    function measureClipW() {
      const w = clip.getBoundingClientRect().width
      return w > 40 ? w : window.innerWidth * 0.5
    }

    function measureClipH() {
      const h = clip.getBoundingClientRect().height
      return h > 40 ? h : window.innerHeight * 0.45
    }

    /**
     * Nudge focused card to center of `.content-row` (hero area below the tagline header),
     * clamped so the card stays inside that row and is not clipped by the hero top.
     */
    function measureShiftToContentArea(cardEl: HTMLElement) {
      const area =
        (clip.closest('.content-row') as HTMLElement | null) ??
        (clip.closest('.hero-container') as HTMLElement | null) ??
        clip
      const br = area.getBoundingClientRect()
      const cr = cardEl.getBoundingClientRect()
      const targetCx = br.left + br.width / 2
      const targetCy = br.top + br.height / 2
      const cardCx = cr.left + cr.width / 2
      const cardCy = cr.top + cr.height / 2
      let dy = targetCy - cardCy
      const margin = 8
      const halfH = cr.height / 2
      const newTop = cardCy + dy - halfH
      const newBottom = cardCy + dy + halfH
      if (newTop < br.top + margin) {
        dy = br.top + margin + halfH - cardCy
      } else if (newBottom > br.bottom - margin) {
        dy = br.bottom - margin - halfH - cardCy
      }
      return { dx: targetCx - cardCx, dy }
    }

    function updateFocusLabelPosition() {
      if (focus.slot == null) return
      if (
        focus.mode !== 'focused' &&
        focus.mode !== 'selecting'
      )
        return
      const card = cards[focus.slot]
      const stage = labelEl.parentElement
      if (!card || !stage) return
      const sr = stage.getBoundingClientRect()
      const cr = card.getBoundingClientRect()
      labelEl.style.top = `${Math.round(cr.bottom - sr.top + FOCUS_LABEL_GAP_PX)}px`
    }

    function hardResetFocus() {
      focus.mode = 'browse'
      focus.slot = null
      focus.offsetX = 0
      focus.offsetY = 0
      focus.deselectK0 = 1
      cards.forEach((c) => c.classList.remove('carousel-card--loading'))
      labelEl.textContent = ''
      labelEl.classList.remove('projects-focus-label--visible')
      labelEl.setAttribute('aria-hidden', 'true')
      labelEl.style.removeProperty('top')
      clip.classList.remove('projects-carousel-clip--focus')
    }

    function beginDeselect() {
      if (
        focus.mode === 'browse' ||
        focus.mode === 'detail' ||
        focus.mode === 'deselecting'
      )
        return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        hardResetFocus()
        return
      }

      let k0 = 1
      if (focus.mode === 'selecting') {
        const pSel = Math.min(
          1,
          (performance.now() - focus.t0) / FOCUS_MS
        )
        k0 = easeOutQuart(pSel)
      }

      focus.mode = 'deselecting'
      focus.t0 = performance.now()
      focus.deselectK0 = k0
      labelEl.classList.remove('projects-focus-label--visible')
      labelEl.setAttribute('aria-hidden', 'true')
      labelEl.style.removeProperty('top')
      cards.forEach((c) => c.classList.remove('carousel-card--loading'))
    }

    function getFocusRender(): CarouselFocusRender | null {
      if (focus.mode === 'browse' || focus.mode === 'detail') return null
      if (focus.slot == null) return null

      if (focus.mode === 'deselecting') {
        const p = Math.min(1, (performance.now() - focus.t0) / FOCUS_MS)
        const e = easeOutQuart(p)
        const k = focus.deselectK0 * (1 - e)
        if (p >= 1) {
          hardResetFocus()
          return null
        }
        return {
          focusedSlot: focus.slot,
          focusLiftPx: k * focus.offsetY,
          focusShiftXPx: k * focus.offsetX,
          blurOthers: true,
        }
      }

      let p = 1
      if (focus.mode === 'selecting') {
        p = Math.min(1, (performance.now() - focus.t0) / FOCUS_MS)
        if (p >= 1) {
          focus.mode = 'focused'
          const c = cards[focus.slot]
          if (c) c.classList.add('carousel-card--loading')
          labelEl.classList.add('projects-focus-label--visible')
          labelEl.setAttribute('aria-hidden', 'false')
        }
      }
      const e = easeOutQuart(p)
      return {
        focusedSlot: focus.slot,
        focusLiftPx: e * focus.offsetY,
        focusShiftXPx: e * focus.offsetX,
        blurOthers: true,
      }
    }

    function projectIndexForSlot(slot: number): number {
      const TOTAL = projs.length
      const rounded = Math.round(posRef)
      const frontSlot =
        ((Math.floor(posRef) % CAROUSEL.numVisible) + CAROUSEL.numVisible) %
        CAROUSEL.numVisible
      const relativeSlot =
        (slot - frontSlot + CAROUSEL.numVisible) % CAROUSEL.numVisible
      return mod(rounded + relativeSlot, TOTAL)
    }

    function clearFullscreenExpandStyles() {
      fullscreenEl.style.removeProperty('left')
      fullscreenEl.style.removeProperty('top')
      fullscreenEl.style.removeProperty('width')
      fullscreenEl.style.removeProperty('height')
      fullscreenEl.style.removeProperty('border-radius')
      fullscreenEl.style.removeProperty('box-shadow')
      fullscreenEl.style.removeProperty('transition')
    }

    /** Grey panel morphs from the focused card rect to viewport (FLIP-style). */
    function openFullscreen(
      project: (typeof POC_PROJECTS)[0],
      cardEl: HTMLElement
    ) {
      focus.mode = 'detail'
      const r = cardEl.getBoundingClientRect()
      cardEl.classList.add('carousel-card--fullscreen-source')
      labelEl.classList.remove('projects-focus-label--visible')
      labelEl.setAttribute('aria-hidden', 'true')
      labelEl.style.removeProperty('top')
      clearFullscreenExpandStyles()
      document.body.appendChild(fullscreenEl)
      fullscreenEl.hidden = false
      fullscreenTitle.textContent = project.title
      fullscreenStatus.textContent = 'Loading project…'
      document.body.style.overflow = 'hidden'

      const dur = `${FULLSCREEN_EXPAND_MS / 1000}s`
      const tr = `left ${dur} ${FULLSCREEN_EXPAND_EASE}, top ${dur} ${FULLSCREEN_EXPAND_EASE}, width ${dur} ${FULLSCREEN_EXPAND_EASE}, height ${dur} ${FULLSCREEN_EXPAND_EASE}, border-radius ${dur} ${FULLSCREEN_EXPAND_EASE}, box-shadow ${dur} ${FULLSCREEN_EXPAND_EASE}`

      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      fullscreenEl.style.transition = 'none'
      fullscreenEl.style.left = `${r.left}px`
      fullscreenEl.style.top = `${r.top}px`
      fullscreenEl.style.width = `${r.width}px`
      fullscreenEl.style.height = `${r.height}px`
      fullscreenEl.style.borderRadius = `${CARD_RADIUS_PX}px`
      fullscreenEl.style.boxShadow =
        '0 -4px 20px rgba(0, 0, 0, 0.1), 0 16px 48px rgba(0, 0, 0, 0.18)'

      fullscreenEl.offsetHeight

      const goFull = () => {
        fullscreenEl.style.left = '0'
        fullscreenEl.style.top = '0'
        fullscreenEl.style.width = '100vw'
        fullscreenEl.style.height = '100vh'
        fullscreenEl.style.borderRadius = '0'
        fullscreenEl.style.boxShadow = 'none'
      }

      if (reduceMotion) {
        goFull()
      } else {
        requestAnimationFrame(() => {
          fullscreenEl.style.transition = tr
          requestAnimationFrame(goFull)
        })
      }

      window.setTimeout(() => {
        fullscreenStatus.textContent =
          'Project content would load here (route / data next).'
      }, 1000)
    }

    function closeFullscreen() {
      cards.forEach((c) =>
        c.classList.remove('carousel-card--fullscreen-source')
      )
      clearFullscreenExpandStyles()
      fullscreenEl.hidden = true
      wrapper.appendChild(fullscreenEl)
      document.body.style.overflow = ''
      if (focus.slot != null) {
        focus.mode = 'focused'
        labelEl.classList.add('projects-focus-label--visible')
        labelEl.setAttribute('aria-hidden', 'false')
      } else {
        focus.mode = 'browse'
      }
    }

    function tick() {
      if (activePageRef.current !== 'projects') return
      const TOTAL = projs.length
      if (TOTAL === 0) {
        rafId = requestAnimationFrame(tick)
        return
      }

      if (focus.mode === 'browse') {
        const { friction, velocityDead, settleDead, snapPull } = CAROUSEL
        velRef *= friction
        if (Math.abs(velRef) < velocityDead) {
          const nearest = Math.round(posRef)
          const diff = nearest - posRef
          if (Math.abs(diff) < settleDead) {
            posRef = nearest
            velRef = 0
          } else {
            posRef += diff * snapPull
          }
        }
        posRef += velRef
      } else {
        velRef = 0
      }

      const clipW = measureClipW()
      const ch = measureClipH()
      const entryAge = performance.now() - entryStart
      const sceneTransition =
        entryAge < sceneTotalMs ? { kind: 'enter' as const, ms: entryAge } : null
      renderProjectCarousel(
        posRef,
        projs,
        cards,
        clipW,
        sceneTransition,
        clip,
        ch,
        getFocusRender()
      )
      clip.classList.toggle(
        'projects-carousel-clip--focus',
        focus.mode === 'focused' ||
          focus.mode === 'selecting' ||
          focus.mode === 'deselecting'
      )
      updateFocusLabelPosition()

      rafId = requestAnimationFrame(tick)
    }

    const onWheel = (e: WheelEvent) => {
      if (activePageRef.current !== 'projects') return
      if (focus.mode !== 'browse') {
        e.preventDefault()
        return
      }
      e.preventDefault()
      velRef += e.deltaY * CAROUSEL.scrollMult
      velRef = Math.max(-CAROUSEL.velClamp, Math.min(CAROUSEL.velClamp, velRef))
    }

    let touchY = 0
    const onTouchStart = (e: TouchEvent) => {
      if (activePageRef.current !== 'projects') return
      if (focus.mode !== 'browse') return
      touchY = e.touches[0].clientY
      velRef = 0
    }
    const onTouchMove = (e: TouchEvent) => {
      if (activePageRef.current !== 'projects') return
      if (focus.mode !== 'browse') {
        e.preventDefault()
        return
      }
      e.preventDefault()
      const y = e.touches[0].clientY
      velRef = (touchY - y) * 0.003
      touchY = y
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !fullscreenEl.hidden) {
        e.preventDefault()
        closeFullscreen()
        return
      }
      if (activePageRef.current !== 'projects') return
      if (focus.mode !== 'browse') return
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') velRef += CAROUSEL.keyNudge
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') velRef -= CAROUSEL.keyNudge
    }

    const onResize = () => {
      if (activePageRef.current !== 'projects') return
      if (
        focus.slot != null &&
        (focus.mode === 'focused' || focus.mode === 'selecting')
      ) {
        const c = cards[focus.slot]
        if (c) {
          const { dx, dy } = measureShiftToContentArea(c)
          focus.offsetX = dx
          focus.offsetY = dy
        }
      }
      const entryAge = performance.now() - entryStart
      const sceneTransition =
        entryAge < sceneTotalMs ? { kind: 'enter' as const, ms: entryAge } : null
      renderProjectCarousel(
        posRef,
        projs,
        cards,
        measureClipW(),
        sceneTransition,
        clip,
        measureClipH(),
        getFocusRender()
      )
      clip.classList.toggle(
        'projects-carousel-clip--focus',
        focus.mode === 'focused' ||
          focus.mode === 'selecting' ||
          focus.mode === 'deselecting'
      )
      updateFocusLabelPosition()
    }

    const onClipClick = (e: MouseEvent) => {
      if (activePageRef.current !== 'projects') return
      if (focus.mode === 'detail') return
      const card = (e.target as HTMLElement).closest('.carousel-card') as
        | HTMLDivElement
        | undefined
      if (!card) return
      const slot = cards.indexOf(card)
      if (slot < 0) return

      const projIdx = projectIndexForSlot(slot)

      if (focus.mode === 'focused' && focus.slot === slot) {
        openFullscreen(projs[projIdx], card)
        return
      }
      if (focus.mode === 'focused' && focus.slot !== slot) {
        beginDeselect()
        return
      }
      if (focus.mode === 'deselecting') return
      if (focus.mode === 'selecting') return

      posRef = Math.round(posRef)
      velRef = 0
      focus.mode = 'selecting'
      focus.slot = slot
      focus.t0 = performance.now()
      labelEl.textContent = projs[projIdx].title
      labelEl.classList.remove('projects-focus-label--visible')
      cards.forEach((c) => c.classList.remove('carousel-card--loading'))

      const { dx, dy } = measureShiftToContentArea(cards[slot])
      focus.offsetX = dx
      focus.offsetY = dy
    }

    const onDocumentClickDismiss = (e: MouseEvent) => {
      if (focus.mode !== 'focused' && focus.mode !== 'selecting') return
      const t = e.target as HTMLElement
      if (t.closest('.carousel-card')) return
      beginDeselect()
    }

    fullscreenClose.addEventListener('click', closeFullscreen)

    document.addEventListener('click', onDocumentClickDismiss)
    clip.addEventListener('click', onClipClick)
    clip.addEventListener('wheel', onWheel, { passive: false })
    clip.addEventListener('touchstart', onTouchStart, { passive: true })
    clip.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)

    renderProjectCarousel(
      0,
      projs,
      cards,
      measureClipW(),
      { kind: 'enter', ms: 0 },
      clip,
      measureClipH(),
      null
    )

    projectsSceneRef.current = {
      getPos: () => posRef,
      projs,
      cards,
      clip,
      measureClipW,
      measureClipH,
    }

    rafId = requestAnimationFrame(tick)

    disposeProjectsCarouselRef.current = () => {
      hardResetFocus()
      cards.forEach((c) =>
        c.classList.remove('carousel-card--fullscreen-source')
      )
      clip.classList.remove('projects-carousel-clip--focus')
      cancelAnimationFrame(rafId)
      document.removeEventListener('click', onDocumentClickDismiss)
      clip.removeEventListener('click', onClipClick)
      clip.removeEventListener('wheel', onWheel)
      clip.removeEventListener('touchstart', onTouchStart)
      clip.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
      fullscreenClose.removeEventListener('click', closeFullscreen)
      document.body.style.overflow = ''
      clearFullscreenExpandStyles()
      fullscreenEl.hidden = true
      if (fullscreenEl.parentNode === document.body) {
        document.body.removeChild(fullscreenEl)
      }
    }

    return new Promise<void>((resolve) => {
      window.setTimeout(() => resolve(), sceneTotalMs)
    })
  }, [])

  const buildSketches = useCallback((): Promise<void> => {
    const contentRow = contentRowRef.current
    if (!contentRow) return Promise.resolve()

    const wrapper = document.createElement('section')
    wrapper.className = 'sketches-wrapper'
    const dots = Array.from({ length: 7 })
      .map((_, index) => `<span class="sketches-dot ${index === 0 ? 'active' : ''}"></span>`)
      .join('')

    wrapper.innerHTML = `
    <div class="sketches-frame" id="sketchesFrame">
      <div class="sketch-stage">
        <div class="sketch-noise"></div>
        <div id="sketchTitle">${POC_SKETCHES[0]}</div>
      </div>
    </div>
    <div class="sketches-right">
      <div class="sketches-descriptor">
        <div class="sketches-meta" id="sketchesMeta">
          <div class="sketches-title">${POC_SKETCHES[0]}</div>
          <div class="sketches-desc">${escapeHtml(POC_SKETCH_DESCRIPTION)}</div>
        </div>
      </div>
      <div class="sketches-indicators">${dots}</div>
    </div>
  `
    contentRow.appendChild(wrapper)
    wrapper.classList.add('sketches-scene-enter')
    sketchesSceneWrapperRef.current = wrapper

    const titleEl = wrapper.querySelector('#sketchTitle')
    const metaTitleEl = wrapper.querySelector('.sketches-title')
    const dotsEls = Array.from(wrapper.querySelectorAll('.sketches-dot'))

    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.setTimeout(() => {
            let index = 0
            sketchTimerRef.current = setInterval(() => {
              index = (index + 1) % POC_SKETCHES.length
              const label = POC_SKETCHES[index]
              if (titleEl) titleEl.textContent = label
              if (metaTitleEl) metaTitleEl.textContent = label
              dotsEls.forEach((dot, dotIndex) => {
                dot.classList.toggle('active', dotIndex === index % dotsEls.length)
              })
            }, 1700)
            resolve()
          }, SKETCHES_SCENE_ENTRY_MS)
        })
      })
    })
  }, [])

  const transitionDeps = useMemo<HeroNavTransitionDeps>(
    () => ({
      activePageRef,
      animateProjectsExit,
      animateSketchesExit,
      clearHeroScene,
      updateMainViewportHeight,
      buildProjects,
      buildSketches,
      exitThoughtMode,
    }),
    [
      animateProjectsExit,
      animateSketchesExit,
      clearHeroScene,
      updateMainViewportHeight,
      buildProjects,
      buildSketches,
      exitThoughtMode,
    ]
  )

  const { navPage, transitionPhase, requestNavigate } =
    useHeroNavTransition(transitionDeps)

  const goToThoughts = useCallback(() => {
    if (thoughtMode) return
    if (thoughtsAreaRef.current) thoughtsAreaRef.current.scrollTop = 0
    setThoughtMode(true)
    updateMainViewportHeight()
  }, [thoughtMode, updateMainViewportHeight])

  useEffect(() => {
    updateMainViewportHeight()
    window.addEventListener('resize', updateMainViewportHeight)
    void requestNavigate('home')
    return () => {
      window.removeEventListener('resize', updateMainViewportHeight)
      clearHeroScene()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount / unmount only
  }, [])

  const onThoughtEnter = useCallback((image: string) => {
    const stage = thoughtsListRef.current
    if (!stage) return
    const bounds = stage.getBoundingClientRect()
    const w = Math.min(bounds.width * 0.35, 400)
    const h = Math.min(bounds.height * 0.32, 280)
    const x = Math.random() * Math.max(10, bounds.width - w - 20)
    const y = Math.random() * Math.max(10, bounds.height - h - 20)
    setThoughtPreview({ src: image, x, y, visible: true })
  }, [])

  const onThoughtLeave = useCallback(() => {
    setThoughtPreview((p) => ({ ...p, visible: false }))
  }, [])

  return (
    <div className="homeShell">
      <main
        ref={appShellRef}
        className={`app-shell${thoughtMode ? ' thought-mode' : ''}`}
      >
        <div className="main-scroll-viewport" ref={mainScrollViewportRef}>
          <div className="vertical-strip">
            <div className="strip-hero">
              <div
                className={`hero-container${carouselBleed ? ' hero-container--projects-bleed' : ''}`}
              >
                <div className="content">
                  <div className="header-row">
                    <div className="hero-tagline text-5xl font-semibold leading-tight">
                      VISUALLY OPINIONATED
                      <br />
                      SYSTEMS THINKER
                    </div>
                  </div>
                  <div
                    ref={contentRowRef}
                    className={`content-row${carouselBleed ? ' content-row--carousel-bleed' : ''}`}
                  />
                </div>
              </div>
            </div>
            <section
              ref={thoughtsAreaRef}
              className="thoughts-area"
              aria-hidden={!thoughtMode}
            >
              <div ref={thoughtsListRef} className="thoughts-list">
                {thoughtMode &&
                  POC_THOUGHTS.map((item, index) => {
                    const n = String(index + 1).padStart(2, '0')
                    return (
                      <ThoughtListItem
                        key={item.title}
                        title={item.title}
                        count={n}
                        image={item.image}
                        onThoughtEnter={onThoughtEnter}
                        onThoughtLeave={onThoughtLeave}
                      />
                    )
                  })}
                {thoughtMode && (
                  <img
                    className={`thought-preview${thoughtPreview.visible ? ' visible' : ''}`}
                    src={thoughtPreview.src || undefined}
                    alt=""
                    style={{
                      left: thoughtPreview.x,
                      top: thoughtPreview.y,
                    }}
                  />
                )}
              </div>
            </section>
          </div>
        </div>

        <footer
          className="hero-footer"
          aria-busy={transitionPhase !== 'idle'}
        >
          <div className="hero-footer-left gap-2">
            <button
              type="button"
              className={navLinkClass(thoughtMode)}
              onClick={goToThoughts}
            >
              Thought
            </button>
            <button
              type="button"
              className={navLinkClass(!thoughtMode && navPage === 'home')}
              onClick={() => void requestNavigate('home')}
            >
              Work
            </button>
            <button
              type="button"
              className={navLinkClass(!thoughtMode && navPage === 'projects')}
              onClick={() => void requestNavigate('projects')}
            >
              Projects
            </button>
            <button
              type="button"
              className={navLinkClass(!thoughtMode && navPage === 'sketches')}
              onClick={() => void requestNavigate('sketches')}
            >
              Sketches
            </button>
          </div>
          <button
            type="button"
            className={navLinkClass(!thoughtMode && navPage === 'home')}
            onClick={() => void requestNavigate('home')}
          >
            About
          </button>
        </footer>
      </main>
    </div>
  )
}
