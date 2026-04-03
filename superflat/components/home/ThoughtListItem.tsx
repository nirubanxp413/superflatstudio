'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { easeOutQuart } from './homeExperienceLib'

const HOVER_MS = 300

type ThoughtListItemProps = {
  title: string
  count: string
  image: string
  onThoughtEnter: (image: string) => void
  onThoughtLeave: () => void
}

export function ThoughtListItem({
  title,
  count,
  image,
  onThoughtEnter,
  onThoughtLeave,
}: ThoughtListItemProps) {
  const progressRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const [, setFrame] = useState(0)

  const flush = useCallback(() => {
    setFrame((n) => n + 1)
  }, [])

  const animateTo = useCallback(
    (target: number) => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      const from = progressRef.current
      const start = performance.now()

      const step = (now: number) => {
        const elapsed = now - start
        const t = Math.min(1, elapsed / HOVER_MS)
        const e = easeOutQuart(t)
        progressRef.current = from + (target - from) * e
        flush()
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step)
        } else {
          progressRef.current = target
          rafRef.current = null
          flush()
        }
      }
      rafRef.current = requestAnimationFrame(step)
    },
    [flush]
  )

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const p = progressRef.current
  const stopPct = `${p * 100}%`

  return (
    <div
      className="thought-item"
      onMouseEnter={() => {
        onThoughtEnter(image)
        animateTo(1)
      }}
      onMouseLeave={() => {
        onThoughtLeave()
        animateTo(0)
      }}
    >
      <div
        className="thought-item-bg"
        style={{ width: stopPct }}
        aria-hidden
      />
      <div
        className="thought-item-text"
        style={{
          backgroundImage: `linear-gradient(90deg, #ffffff 0%, #ffffff ${stopPct}, var(--ink) ${stopPct}, var(--ink) 100%)`,
        }}
      >
        <span>{title}</span>
        <span className="thought-item-count">{count}</span>
      </div>
    </div>
  )
}
