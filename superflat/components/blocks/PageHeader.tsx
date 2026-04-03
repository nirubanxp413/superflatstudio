import { Container } from '@/components/ui'

interface PageHeaderBlock {
  title: string
  subtitle?: string
}

export function PageHeader({ block }: { block: PageHeaderBlock }) {
  return (
    <Container>
      <div className="py-10 flex flex-col gap-3">
        <h1 className="text-7xl font-sans font-semibold text-text-primary leading-none tracking-tight">
          {block.title}
        </h1>
        {block.subtitle && (
          <p
            className="text-lg font-bold font-sans"
            style={{ color: 'var(--brand)' }}
          >
            {block.subtitle}
          </p>
        )}
      </div>
    </Container>
  )
}
