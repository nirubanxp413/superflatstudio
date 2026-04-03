'use client'

import { useEffect, useRef } from 'react'
import type { PedalColor } from '@/types/pedal'

type AnimCtx = {
  c2d: CanvasRenderingContext2D
  width: number
  height: number
  millis: number
  grid?: { char: string; alpha: number }[][]
}

const ANIMATIONS: Record<PedalColor, (p: AnimCtx) => void> = {
  crimson: ({ c2d, width, height, millis }) => {
    const cols = 29, rows = 16
    const chars = '·•○◎●◉'
    const cellW = width / cols, cellH = height / rows
    const time = millis * 0.001
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const wave = Math.sin(time * 1.5 + y * 0.3 + (x + y) * 0.1)
        const intensity = (wave + 1) / 2
        const charIndex = Math.floor(intensity * (chars.length - 1))
        const alpha = 80 + intensity * 175
        c2d.fillStyle = `rgba(255, 80, 150, ${alpha / 255})`
        c2d.font = '8px monospace'
        c2d.textAlign = 'center'
        c2d.textBaseline = 'middle'
        c2d.fillText(chars[charIndex], cellW * (x + 0.5), cellH * (y + 0.5))
      }
    }
  },
  emerald: ({ c2d, width, height, millis }) => {
    const cols = 29, rows = 16
    const chars = '·+×◇◆□■'
    const cellW = width / cols, cellH = height / rows
    const time = millis * 0.001
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const wave = Math.sin(time * 2 + x * 0.2 + y * 0.15)
        const intensity = (wave + 1) / 2
        const charIndex = Math.floor(intensity * (chars.length - 1))
        const alpha = 60 + intensity * 195
        c2d.fillStyle = `rgba(120, 100, 255, ${alpha / 255})`
        c2d.font = '8px monospace'
        c2d.textAlign = 'center'
        c2d.textBaseline = 'middle'
        c2d.fillText(chars[charIndex], cellW * (x + 0.5), cellH * (y + 0.5))
      }
    }
  },
  cobalt: (ctx) => {
    const { c2d, width, height } = ctx
    const cols = 29, rows = 16
    const chars = '░▒▓█▌▐│─'
    const cellW = width / cols, cellH = height / rows
    if (!ctx.grid) {
      ctx.grid = []
      for (let y = 0; y < rows; y++) {
        ctx.grid[y] = []
        for (let x = 0; x < cols; x++) {
          ctx.grid[y][x] = { char: chars[0], alpha: 60 }
        }
      }
    }
    const g = ctx.grid!
    if (Math.random() < 0.15) {
      const row = Math.floor(Math.random() * rows)
      for (let x = 0; x < cols; x++) {
        g[row][x] = { char: chars[Math.floor(Math.random() * chars.length)], alpha: 150 + Math.random() * 105 }
      }
    }
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (Math.random() < 0.03) g[y][x] = { char: chars[0], alpha: 60 }
      }
    }
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = g[y][x]
        c2d.fillStyle = `rgba(180, 110, 255, ${cell.alpha / 255})`
        c2d.font = '8px monospace'
        c2d.textAlign = 'center'
        c2d.textBaseline = 'middle'
        c2d.fillText(cell.char, cellW * (x + 0.5), cellH * (y + 0.5))
      }
    }
  },
  amber: ({ c2d, width, height, millis }) => {
    const cols = 29, rows = 16
    const chars = '·◦●◆◇■□'
    const cellW = width / cols, cellH = height / rows
    const time = millis * 0.001
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const wave = Math.sin(time * 1.2 + x * 0.25 + y * 0.2)
        const intensity = (wave + 1) / 2
        const charIndex = Math.floor(intensity * (chars.length - 1))
        const alpha = 70 + intensity * 185
        c2d.fillStyle = `rgba(110, 180, 255, ${alpha / 255})`
        c2d.font = '8px monospace'
        c2d.textAlign = 'center'
        c2d.textBaseline = 'middle'
        c2d.fillText(chars[charIndex], cellW * (x + 0.5), cellH * (y + 0.5))
      }
    }
  },
  violet: ({ c2d, width, height, millis }) => {
    const cols = 29, rows = 16
    const chars = '·○◐◑●◒◓◎'
    const cellW = width / cols, cellH = height / rows
    const time = millis * 0.001
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const wave = Math.sin(time * 1.8 + (x + y) * 0.18)
        const intensity = (wave + 1) / 2
        const charIndex = Math.floor(intensity * (chars.length - 1))
        const alpha = 65 + intensity * 190
        c2d.fillStyle = `rgba(120, 255, 170, ${alpha / 255})`
        c2d.font = '8px monospace'
        c2d.textAlign = 'center'
        c2d.textBaseline = 'middle'
        c2d.fillText(chars[charIndex], cellW * (x + 0.5), cellH * (y + 0.5))
      }
    }
  },
}

export function PedalCanvas({ color }: { color: PedalColor }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>()
  const gridRef = useRef<{ char: string; alpha: number }[][]>()

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      if (w > 0 && h > 0) { canvas.width = w; canvas.height = h }
    }

    const draw = () => {
      const w = canvas.width, h = canvas.height
      if (w > 0 && h > 0) {
        ctx.clearRect(0, 0, w, h)
        const animCtx: AnimCtx = { c2d: ctx, width: w, height: h, millis: performance.now(), grid: gridRef.current }
        ANIMATIONS[color](animCtx)
        if (animCtx.grid) gridRef.current = animCtx.grid
      }
      animRef.current = requestAnimationFrame(draw)
    }

    resize()
    draw()
    const ro = new ResizeObserver(() => resize())
    ro.observe(container)
    return () => { ro.disconnect(); if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [color])

  return (
    <div ref={containerRef} className="absolute left-6 right-6 top-[25px] h-[160px] w-[calc(100%-48px)] overflow-hidden bg-transparent">
      <canvas ref={canvasRef} className="block h-full w-full" style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
