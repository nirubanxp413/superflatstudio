import { Container, Text } from '@/components/ui'

interface ArtefactBlock {
  title: string
  url: string
  description?: string
}

export function Artefact({ block }: { block: ArtefactBlock }) {
  const displayUrl = block.url.replace(/^https?:\/\//, '').slice(0, 48)

  return (
    <Container>
      <a
        href={block.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex justify-between items-start gap-06 p-06 border border-border-subtle rounded-md hover:bg-layer-hover transition-colors duration-150 group"
        style={{ minHeight: '400px' }}
      >
        {/* Left: title + description */}
        <div className="flex flex-col gap-02 min-w-0">
          <Text as="span" variant="heading-sm" className="text-text-primary">
            {block.title}
          </Text>
          {block.description && (
            <Text as="p" variant="body-sm" className="text-text-secondary">
              {block.description}
            </Text>
          )}
        </div>

        {/* Right: arrow + URL */}
        <div className="flex flex-col items-end gap-01 flex-shrink-0">
          <span className="text-heading-sm text-interactive group-hover:translate-x-0.5 transition-transform">
            →
          </span>
          <Text as="span" variant="code-sm" className="text-text-muted">
            {displayUrl}
          </Text>
        </div>
      </a>
    </Container>
  )
}
