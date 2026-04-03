'use client'

import { useCallback, useRef, useState } from 'react'

export function FaderSlider({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [dragging, setDragging] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  const updateFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current
      if (!track) return
      const rect = track.getBoundingClientRect()
      const x = clientX - rect.left
      const pct = Math.max(0, Math.min(1, x / rect.width))
      onChange(pct)
    },
    [onChange]
  )

  return (
    <div className="fader-container relative flex h-[50px] w-full items-center justify-center">
      <div
        ref={trackRef}
        className="fader-track absolute h-1.5 w-[90%] cursor-pointer rounded-md bg-gradient-to-b from-black/50 via-black/30 to-black/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
        onMouseDown={(e) => {
          setDragging(true)
          updateFromClientX(e.clientX)
        }}
      />
      <div className="fader-scale absolute top-[calc(50%+18px)] flex w-[90%] justify-between px-1">
        {Array.from({ length: 11 }).map((_, i) => (
          <div
            key={i}
            className={`h-2 w-px bg-white/25 ${i % 5 === 0 ? 'h-3 w-0.5 bg-white/40' : ''}`}
          />
        ))}
      </div>
      <div
        className="fader-knob absolute top-1/2 h-9 w-5 -translate-y-1/2 cursor-grab rounded bg-gradient-to-r from-[#a8a8a8] via-[#e8e8e8] to-[#a8a8a8] shadow-[0_4px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.8)] active:cursor-grabbing"
        style={{ left: `calc(5% + ${value * 90}%)`, transform: 'translate(-50%, -50%)' }}
        onMouseDown={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
      />
      {dragging && (
        <div
          className="fixed inset-0 z-50"
          onMouseMove={(e) => updateFromClientX(e.clientX)}
          onMouseUp={() => setDragging(false)}
          onMouseLeave={() => setDragging(false)}
        />
      )}
    </div>
  )
}
