import { Container } from '@/components/ui'
import { renderPortableInlineSpans } from './textBlockUtils'

export type PTChild = { _key?: string; _type: 'span'; text: string; marks?: string[] }

export type PTMarkDef = {
  _key: string
  _type: string
  href?: string
}

export type PTBlock = {
  _key?: string
  _type: 'block'
  style: 'normal' | 'h2' | 'h3' | 'blockquote'
  children: PTChild[]
  markDefs?: PTMarkDef[]
}

export type TextBlockAlign = 'left' | 'right' | 'center'

interface TextBlockData {
  content?: PTBlock[]
  align?: TextBlockAlign
}

function renderBlock(block: PTBlock, idx: number) {
  const text = renderPortableInlineSpans(block.children, block.markDefs, {
    codeClassName: 'font-mono text-code-sm bg-layer px-01 rounded-none',
  })

  switch (block.style) {
    case 'h2':
      return (
        <h2 key={idx} className="text-heading-md font-sans text-text-primary mt-06 mb-03">
          {text}
        </h2>
      )
    case 'h3':
      return (
        <h3 key={idx} className="text-heading font-sans font-semibold text-text-primary mt-05 mb-02">
          {text}
        </h3>
      )
    case 'blockquote':
      return (
        <blockquote
          key={idx}
          className="pl-06 border-l-2 text-text-secondary text-base my-05"
          style={{ borderLeftColor: 'var(--interactive)' }}
        >
          {text}
        </blockquote>
      )
    default:
      return (
        <p key={idx} className="text-base font-sans text-text-primary mb-04">
          {text}
        </p>
      )
  }
}

const alignClass: Record<TextBlockAlign, string> = {
  left:   'w-1/2 mr-auto',
  right:  'w-1/2 ml-auto',
  center: 'w-1/2 mx-auto',
}

export function TextBlock({ block }: { block: TextBlockData }) {
  const content = block.content ?? []
  const align = block.align ?? 'left'

  return (
    <Container>
      <div className={alignClass[align]}>
        {content.map((b, i) => renderBlock(b, i))}
      </div>
    </Container>
  )
}
