'use client'

import { Container } from '@/components/ui'

interface HeroCodeSketchBlock {
  code?: string
  language?: string
}

export function HeroCodeSketch({ block }: { block: HeroCodeSketchBlock }) {
  return (
    <Container bleed>
      <div
        className="relative w-full"
        style={{
          height: '80vh',
          background: 'var(--app-bg)',
        }}
      >
        {/* Sketch canvas would be mounted here */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-mono text-sm"
            style={{ color: 'var(--app-text-muted)' }}
          >
            {block.language ?? 'p5.js'} · interactive sketch
          </span>
        </div>

        {/* Language badge — bottom left */}
        <div
          className="absolute bottom-4 left-6 font-mono text-xs"
          style={{ color: 'var(--app-text-muted)' }}
        >
          {block.language ?? 'p5.js'}
        </div>
      </div>
    </Container>
  )
}
