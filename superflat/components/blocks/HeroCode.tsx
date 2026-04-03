import { Container } from '@/components/ui'

interface HeroCodeBlock {
  code: string
  language?: string
}

export function HeroCode({ block }: { block: HeroCodeBlock }) {
  return (
    <Container bleed>
      <div
        className="relative w-full flex items-center justify-center"
        style={{
          minHeight: '70vh',
          background: 'var(--app-bg)',
          color: 'var(--app-text)',
        }}
      >
        <div className="absolute top-4 right-6 text-code-sm font-mono opacity-50"
          style={{ color: 'var(--app-text-muted)' }}>
          {block.language ?? 'code'}
        </div>
        <pre
          className="font-mono text-code leading-relaxed overflow-x-auto max-w-4xl w-full px-10 py-12"
          style={{ color: 'var(--app-text)' }}
        >
          <code>{block.code}</code>
        </pre>
      </div>
    </Container>
  )
}
