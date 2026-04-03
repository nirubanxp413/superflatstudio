'use client'

import { useCallback, useRef, useState } from 'react'

export function GaugeSlider({
  value,
  onChange,
  color,
}: {
  value: number
  onChange: (v: number) => void
  color: 'crimson' | 'emerald' | 'cobalt' | 'amber' | 'violet'
}) {
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const degrees = -90 + value * 180

  const updateFromMouse = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + 80

      const dx = e.clientX - centerX
      const dy = centerY - e.clientY

      let deg = (Math.atan2(dx, dy) * 180) / Math.PI
      deg = Math.max(-90, Math.min(90, deg))
      const pct = (deg + 90) / 180
      onChange(pct)
    },
    [onChange]
  )

  return (
    <div
      ref={containerRef}
      className="relative h-[90px] w-40 cursor-pointer"
      onMouseDown={(e) => {
        setDragging(true)
        updateFromMouse(e)
      }}
    >
      <div className="absolute h-20 w-40 rounded-t-[80px] border-2 border-b-0 border-white/20" />
      <div
        className="absolute bottom-0 left-1/2 h-[65px] w-0.5 -translate-x-1/2 rounded-sm bg-white/90"
        style={{
          transform: `translateX(-50%) rotate(${degrees}deg)`,
          transformOrigin: '50% 100%',
        }}
      />
      <div className="absolute -bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gradient-to-br from-[#888] via-[#555] to-[#333] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]" />
      {dragging && (
        <div
          className="fixed inset-0 z-50"
          onMouseMove={updateFromMouse}
          onMouseUp={() => setDragging(false)}
          onMouseLeave={() => setDragging(false)}
        />
      )}
    </div>
  )
}
