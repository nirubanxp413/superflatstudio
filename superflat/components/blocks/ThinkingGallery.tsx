import { Container } from '@/components/ui'

interface GalleryImage {
  image: { url?: string; asset?: { url: string } }
  size?: 'full' | 'half'
}

interface ThinkingGalleryBlock {
  heading?: string
  body?: string
  images?: GalleryImage[]
}

function getUrl(image: GalleryImage['image']): string {
  return image.url ?? image.asset?.url ?? ''
}

export function ThinkingGallery({ block }: { block: ThinkingGalleryBlock }) {
  const images = block.images ?? []

  // Group images into rows: consecutive 'half' images pair up
  const rows: GalleryImage[][] = []
  let i = 0
  while (i < images.length) {
    const img = images[i]
    if (img.size === 'half' && images[i + 1]?.size === 'half') {
      rows.push([img, images[i + 1]])
      i += 2
    } else {
      rows.push([img])
      i += 1
    }
  }

  return (
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

        {/* Left: text column — sticky until gallery scrolls past */}
        <div className="self-start md:sticky md:top-8 flex flex-col gap-3">
          {block.heading && (
            <h3 className="text-2xl font-sans font-medium text-text-primary leading-snug">
              {block.heading}
            </h3>
          )}
          {block.body && (
            <p className="text-base font-sans text-text-secondary leading-relaxed">
              {block.body}
            </p>
          )}
        </div>

        {/* Right: image grid — determines section height, drives sticky */}
        <div className="md:col-span-2 flex flex-col gap-3">
          {rows.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className={`grid gap-3 ${row.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}
            >
              {row.map((item, imgIdx) => (
                <div
                  key={imgIdx}
                  className="relative w-full overflow-hidden rounded-md bg-layer-hover"
                  style={{ aspectRatio: '4/3' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getUrl(item.image)}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>
    </Container>
  )
}
