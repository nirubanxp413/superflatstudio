import { Container } from '@/components/ui'

interface HeroImageBlock {
  image: { url?: string; asset?: { url: string } }
}

function getUrl(image: HeroImageBlock['image']): string {
  return image.url ?? image.asset?.url ?? ''
}

export function HeroImage({ block }: { block: HeroImageBlock }) {
  const url = getUrl(block.image)
  return (
    <Container bleed>
        <div className="relative w-full" style={{ height: '80vh' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </Container>
  )
}
