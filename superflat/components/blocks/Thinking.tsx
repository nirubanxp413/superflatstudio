import { Container } from '@/components/ui'

interface ThinkingBlock {
  text: string
}

export function Thinking({ block }: { block: ThinkingBlock }) {
  return (
    <Container>
      <div
        className="rounded-md p-8"
        style={{ background: 'var(--code-bg)' }}
      >
        <p
          className="font-sans text-base leading-relaxed"
          style={{ color: 'var(--code-text)' }}
        >
          {block.text}
        </p>
      </div>
    </Container>
  )
}
