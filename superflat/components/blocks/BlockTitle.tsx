import { Container } from '@/components/ui'

interface TitleBlock {
  title: string
}

export function BlockTitle({ block }: { block: TitleBlock }) {
  return (
    <Container>
      <p className="font-mono text-sm font-bold uppercase tracking-widest text-text-secondary">
        {block.title}
      </p>
    </Container>
  )
}
