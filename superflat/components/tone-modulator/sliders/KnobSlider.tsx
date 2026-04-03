'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const MIN_DEG = -135
const MAX_DEG = 135

export function KnobSlider({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [dragging, setDragging] = useState(false)
  const startYRef = useRef(0)
  const startValueRef = useRef(0)

  const rotation = MIN_DEG + value * (MAX_DEG - MIN_DEG)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setDragging(true)
      startYRef.current = e.clientY
      startValueRef.current = value
    },
    [value]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const deltaY = startYRef.current - e.clientY
      const deltaValue = deltaY / 200
      let newVal = startValueRef.current + deltaValue
      newVal = Math.max(0, Math.min(1, newVal))
      onChange(newVal)
    },
    [onChange]
  )

  const handleMouseUp = useCallback(() => {
    setDragging(false)
  }, [])

  useEffect(() => {
    if (!dragging) return
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging, handleMouseMove, handleMouseUp])

  return (
    <div className="relative h-20 w-20">
      <div className="absolute inset-[-15px]">
        {Array.from({ length: 11 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-0 h-1.5 w-0.5 bg-white/30"
            style={{
              transform: `rotate(${-135 + i * 27}deg)`,
              transformOrigin: '50% 55px',
            }}
          />
        ))}
      </div>
      <div
        className="relative h-full w-full cursor-grab rounded-full bg-gradient-to-br from-[#e8e8e8] via-[#b8b8b8] to-[#909090] shadow-[0_6px_16px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.6)] active:cursor-grabbing"
        style={{ transform: `rotate(${rotation}deg)` }}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute left-1/2 top-2 h-5 w-0.5 -translate-x-1/2 rounded-sm bg-[#222]" />
      </div>
    </div>
  )
}
