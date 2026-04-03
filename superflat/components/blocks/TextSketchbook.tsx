import { Container } from '@/components/ui'
import type { PTBlock } from './TextBlock'
import { renderPortableTextSimple } from './textBlockUtils'

interface SketchImage {
  image: { url?: string; asset?: { url: string } }
  caption?: string
}

interface TextSketchbookBlock {
  content?: PTBlock[]
  images?: SketchImage[]
}

function getUrl(image: SketchImage['image']): string {
  return image.url ?? image.asset?.url ?? ''
}

// Deterministic offsets per image index — CSS-only, no JS
const OFFSETS: { rotate: string; tx: string; ty: string }[] = [
  { rotate: '-2deg', tx: '3%',  ty: '-2%' },
  { rotate: '1.5deg', tx: '-2%', ty: '1%'  },
  { rotate: '-1deg',  tx: '2%',  ty: '3%'  },
  { rotate: '2.5deg', tx: '-3%', ty: '-1%' },
]

export function TextSketchbook({ block }: { block: TextSketchbookBlock }) {
  const content = block.content ?? []
  const images = block.images ?? []

  return (
    <Container>
      <div className="relative">
        {/* Offset images — absolute positioned within the prose flow */}
        {images.map((item, i) => {
          const offset = OFFSETS[i % OFFSETS.length]
          return (
            <div
              key={i}
              className="hidden md:block absolute w-48 border border-border-subtle shadow-sm overflow-hidden"
              style={{
                right: i % 2 === 0 ? '-80px' : 'auto',
                left:  i % 2 !== 0 ? '-80px' : 'auto',
                top: `${(i + 1) * 22}%`,
                transform: `rotate(${offset.rotate}) translate(${offset.tx}, ${offset.ty})`,
                zIndex: 10,
                background: 'var(--layer-01)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getUrl(item.image)}
                alt={item.caption ?? ''}
                className="w-full object-cover"
                style={{ aspectRatio: '4/3' }}
              />
            </div>
          )
        })}

        {/* Prose content */}
        <div className="max-w-[60ch]">
          {renderPortableTextSimple(content)}
        </div>
      </div>
    </Container>
  )
}
