'use client'

import { useEffect, useRef } from 'react'
import type { TransformerState } from '@/types/pedal'

const ROWS = 3
const COLS = 30

export function StateBar({ state }: { state: TransformerState }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const streamIndexRef = useRef(0)
  const errorBlinksRef = useRef(0)
  const errorOnRef = useRef(false)

  useEffect(() => {
    const circles = containerRef.current?.querySelectorAll('.state-circle')
    if (!circles?.length) return

    const animate = () => {
      switch (state) {
        case 'static':
          circles.forEach((c) => c.classList.remove('on'))
          break
        case 'working':
          circles.forEach((c) => {
            if (Math.random() < 0.1) c.classList.toggle('on')
          })
          break
        case 'streaming': {
          const colIndex = Math.floor(streamIndexRef.current / ROWS) % COLS
          circles.forEach((c, i) => {
            const circleCol = Math.floor(i / ROWS)
            if (circleCol === colIndex) c.classList.add('on')
            else if (circleCol === (colIndex - 4 + COLS) % COLS) c.classList.remove('on')
          })
          streamIndexRef.current++
          break
        }
        case 'error':
          if (errorBlinksRef.current < 6) {
            errorOnRef.current = !errorOnRef.current
            circles.forEach((c) => c.classList.toggle('on', errorOnRef.current))
            errorBlinksRef.current++
          } else {
            circles.forEach((c) => c.classList.remove('on'))
          }
          break
      }
      const delay = state === 'error' ? 100 : state === 'streaming' ? 40 : 100
      frameRef.current = setTimeout(animate, delay)
    }

    streamIndexRef.current = 0
    errorBlinksRef.current = 0
    animate()
    return () => { if (frameRef.current) clearTimeout(frameRef.current) }
  }, [state])

  return (
    <div className="absolute left-6 right-6 top-[195px] flex h-6 items-center justify-start">
      <div
        ref={containerRef}
        className="grid h-full gap-[3px]"
        style={{ gridTemplateRows: `repeat(${ROWS}, 1fr)`, gridAutoFlow: 'column' }}
      >
        {Array.from({ length: ROWS * COLS }).map((_, i) => (
          <div
            key={i}
            className="state-circle h-[5px] w-[5px] rounded-full bg-black/40 transition-colors duration-100 data-[on]:bg-white/90"
            data-on={undefined}
          />
        ))}
      </div>
    </div>
  )
}
