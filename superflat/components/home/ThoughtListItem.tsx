'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import Link from 'next/link'
import { easeOutQuart } from './homeExperienceLib'

const HOVER_MS = 300

type ThoughtListItemProps = {
  title: string
  /** Right column — index (e.g. 01) or formatted date */
  meta: string
  image: string
  /** When set, the row navigates to this href (e.g. /thought/slug) */
  href?: string
  onThoughtEnter: (image: string) => void
  onThoughtLeave: () => void
}

export function ThoughtListItem({
  title,
  meta,
  href,
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

  const shellProps = {
    className: href
      ? 'thought-item block no-underline text-inherit cursor-pointer'
      : 'thought-item',
    onMouseEnter: () => {
      if (image) onThoughtEnter(image)
      animateTo(1)
    },
    onMouseLeave: () => {
      onThoughtLeave()
      animateTo(0)
    },
  }

  const inner = (
    <>
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
        <span className="thought-item-count">{meta}</span>
      </div>
    </>
  )

  if (href) {
    return (
      <Link href={href} {...shellProps}>
        {inner}
      </Link>
    )
  }

  return <div {...shellProps}>{inner}</div>
}
