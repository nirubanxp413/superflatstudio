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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderBlock(block: Block): React.ReactNode {
  switch (block._type) {
    case 'heroImage':
      return <HeroImage block={block as Parameters<typeof HeroImage>[0]['block']} />
    case 'heroCodeSketch':
      return <HeroCodeSketch block={block as Parameters<typeof HeroCodeSketch>[0]['block']} />
    case 'pageHeader':
      return <PageHeader block={block as Parameters<typeof PageHeader>[0]['block']} />
    case 'titleBlock':
      return <BlockTitle block={block as Parameters<typeof BlockTitle>[0]['block']} />
    case 'thinkingGallery':
      return <ThinkingGallery block={block as Parameters<typeof ThinkingGallery>[0]['block']} />
    case 'thinking':
      return <Thinking block={block as Parameters<typeof Thinking>[0]['block']} />
    case 'artefact':
      return <Artefact block={block as Parameters<typeof Artefact>[0]['block']} />
    case 'codeCanvas':
      return <CodeCanvas block={block as Parameters<typeof CodeCanvas>[0]['block']} />
    case 'textBlock':
      return <TextBlock block={block as Parameters<typeof TextBlock>[0]['block']} />
    case 'imageBlock':
      return <ImageBlock block={block as Parameters<typeof ImageBlock>[0]['block']} />
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
