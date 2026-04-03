import { Container, Text } from '@/components/ui'

interface ImageBlockData {
  image: { url?: string; asset?: { url: string } }
  caption?: string
}

function getUrl(image: ImageBlockData['image']): string {
  return image.url ?? image.asset?.url ?? ''
}

export function ImageBlock({ block }: { block: ImageBlockData }) {
  return (
    <Container>
      <figure className="w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getUrl(block.image)}
          alt={block.caption ?? ''}
          className="w-full h-auto block rounded-md"
        />
        {block.caption && (
          <figcaption className="mt-02">
            <Text as="span" variant="caption" className="text-text-secondary">
              {block.caption}
            </Text>
          </figcaption>
        )}
      </figure>
    </Container>
  )
}
