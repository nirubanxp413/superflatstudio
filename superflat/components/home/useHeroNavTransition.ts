'use client'

import {
  useCallback,
  useRef,
  useState,
  type MutableRefObject,
} from 'react'
import type { HomePage, HeroNavTransitionPhase } from './homeExperienceLib'

export type { HeroNavTransitionPhase }

export type HeroNavTransitionDeps = {
  activePageRef: MutableRefObject<HomePage>
  animateProjectsExit: () => Promise<void>
  animateSketchesExit: () => Promise<void>
  clearHeroScene: () => void
  updateMainViewportHeight: () => void
  buildProjects: () => Promise<void>
  buildSketches: () => Promise<void>
  /** Turn off thought strip + scroll reset; called at the start of each navigation. */
  exitThoughtMode: () => void
}

/**
 * Single-flight hero navigation: exit completes before enter; nav highlights the
 * requested page immediately. Duplicate clicks to the same target while busy are ignored.
 * A different target while busy is stored (latest wins) and run after the current transition finishes.
 */
export function useHeroNavTransition(deps: HeroNavTransitionDeps) {
  const [navPage, setNavPage] = useState<HomePage>('home')
  const [transitionPhase, setTransitionPhase] =
    useState<HeroNavTransitionPhase>('idle')

  const runningRef = useRef(false)
  const pendingRef = useRef<HomePage | null>(null)
  const navPageRef = useRef<HomePage>('home')
  navPageRef.current = navPage

  const runPipeline = useCallback(
    async (firstTarget: HomePage) => {
      if (runningRef.current) return
      runningRef.current = true
      try {
        let target = firstTarget
        while (true) {
          setNavPage(target)
          navPageRef.current = target

          deps.exitThoughtMode()

          const from = deps.activePageRef.current
          const needsProjectsExit = from === 'projects' && target !== 'projects'
          const needsSketchesExit = from === 'sketches' && target !== 'sketches'

          if (needsProjectsExit || needsSketchesExit) {
            setTransitionPhase('exiting')
            if (needsProjectsExit) await deps.animateProjectsExit()
            if (needsSketchesExit) await deps.animateSketchesExit()
          }

          setTransitionPhase('entering')
          deps.activePageRef.current = target
          deps.clearHeroScene()
          deps.updateMainViewportHeight()

          if (target === 'projects') await deps.buildProjects()
          else if (target === 'sketches') await deps.buildSketches()

          setTransitionPhase('idle')

          const pending = pendingRef.current
          pendingRef.current = null
          if (pending == null || pending === target) break
          target = pending
        }
      } finally {
        runningRef.current = false
      }
    },
    [deps]
  )

  const requestNavigate = useCallback(
    (page: HomePage) => {
      if (runningRef.current) {
        if (page === navPageRef.current) return
        pendingRef.current = page
        setNavPage(page)
        navPageRef.current = page
        return
      }
      void runPipeline(page)
    },
    [runPipeline]
  )

  return {
    navPage,
    transitionPhase,
    requestNavigate,
  }
}
