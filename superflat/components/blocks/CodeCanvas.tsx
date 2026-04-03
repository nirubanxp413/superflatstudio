import { Container, Text } from '@/components/ui'
import { CopyButton } from './CopyButton'

interface CodeCanvasBlock {
  code: string
  language?: string
  title?: string
}

export function CodeCanvas({ block }: { block: CodeCanvasBlock }) {
  return (
    <Container>
      <div
        className="rounded-md overflow-hidden"
        style={{ background: 'var(--code-bg)' }}
      >
        {/* Header row: language label + copy button */}
        <div
          className="flex items-center justify-between px-6 py-3 border-b"
          style={{ borderColor: 'var(--code-border)' }}
        >
          <Text as="span" variant="code-sm" style={{ color: 'var(--code-text-muted)' }}>
            {block.language ?? 'plaintext'}
          </Text>
          <div className="flex items-center gap-2">
            {block.title && (
              <Text as="span" variant="code-sm" style={{ color: 'var(--code-text-muted)' }}>
                {block.title}
              </Text>
            )}
            <CopyButton code={block.code} />
          </div>
        </div>

        {/* Code body */}
        <pre
          className="font-mono text-code p-6 overflow-x-auto leading-relaxed"
          style={{ color: 'var(--code-text)' }}
        >
          <code>{block.code}</code>
        </pre>
      </div>
    </Container>
  )
}
