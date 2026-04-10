import { HeroImage } from './HeroImage'
import { HeroCodeSketch } from './HeroCodeSketch'
import { PageHeader } from './PageHeader'
import { BlockTitle } from './BlockTitle'
import { ThinkingGallery } from './ThinkingGallery'
import { Thinking } from './Thinking'
import { Artefact } from './Artefact'
import { CodeCanvas } from './CodeCanvas'
import { TextBlock } from './TextBlock'
import { ImageBlock } from './ImageBlock'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Block = { _type: string; _key?: string; [key: string]: any }

const HERO_TYPES = new Set(['heroImage', 'heroCodeSketch', 'pageHeader'])

function BlockWrapper({
  type,
  isFirst,
  children,
}: {
  type: string
  isFirst: boolean
  children: React.ReactNode
}) {
  if (HERO_TYPES.has(type)) {
    // Hero blocks: no padding, flush
    return <>{children}</>
  }
  if (type === 'titleBlock') {
    // Title block manages its own internal padding
    return <>{children}</>
  }
  return (
    <div className={isFirst ? '' : 'pt-8'}>
      {children}
    </div>
  )
}

function renderBlock(block: Block): React.ReactNode {
  // Runtime block shapes come from Sanity; components own their prop types.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const b: any = block
  switch (b._type) {
    case 'heroImage':
      return <HeroImage block={b} />
    case 'heroCodeSketch':
      return <HeroCodeSketch block={b} />
    case 'pageHeader':
      return <PageHeader block={b} />
    case 'titleBlock':
      return <BlockTitle block={b} />
    case 'thinkingGallery':
      return <ThinkingGallery block={b} />
    case 'thinking':
      return <Thinking block={b} />
    case 'artefact':
      return <Artefact block={b} />
    case 'codeCanvas':
      return <CodeCanvas block={b} />
    case 'textBlock':
      return <TextBlock block={b} />
    case 'imageBlock':
      return <ImageBlock block={b} />
    default:
      return null
  }
}

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        const rendered = renderBlock(block)
        if (!rendered) return null
        return (
          <BlockWrapper key={block._key ?? i} type={block._type} isFirst={i === 0}>
            {rendered}
          </BlockWrapper>
        )
      })}
    </>
  )
}
