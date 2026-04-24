import Link from 'next/link'
import { thoughtArticleColumnClassName } from '@/components/thought/ThoughtHeader'
import { Button, Text } from '@/components/ui'

export type ThoughtNeighbor = {
  slug: string
  title: string
} | null

type ThoughtArticleNavFooterProps = {
  prev: ThoughtNeighbor
  next: ThoughtNeighbor
}

const navTileBase =
  'h-auto min-h-[5.5rem] w-full ' +
  '!inline-flex !flex-col !flex-nowrap !justify-center ' +
  '!border-0 !px-04 !py-04 ' +
  '!whitespace-normal !shadow-none ' +
  'hover:bg-layer-hover disabled:opacity-50 ' +
  'focus-visible:!shadow-[inset_0_0_0_2px_var(--brand)]'

function NeighborNavButton({
  kind,
  neighbor,
}: {
  kind: 'prev' | 'next'
  neighbor: ThoughtNeighbor
}) {
  const isPrev = kind === 'prev'
  const label = isPrev ? 'Previous' : 'Next'
  const colAlign = isPrev
    ? '!items-start !text-left'
    : '!items-end !text-right'

  if (neighbor?.slug) {
    return (
      <Button
        as={Link}
        href={`/thought/${neighbor.slug}`}
        variant="ghost"
        className={
          navTileBase +
          ` !gap-01 !text-inherit !no-underline ${colAlign}`
        }
      >
        <Text
          as="span"
          variant="label"
          className={
            (isPrev ? 'text-left' : 'text-right') + ' w-full text-text-muted'
          }
        >
          {label}
        </Text>
        <Text
          as="span"
          variant="body-sm"
          className={
            (isPrev ? 'text-left' : 'text-right') +
            ' line-clamp-3 w-full min-w-0 break-words text-[var(--brand)]'
          }
        >
          {neighbor.title}
        </Text>
      </Button>
    )
  }

  return (
    <Button
      as="button"
      type="button"
      disabled
      variant="ghost"
      className={`${navTileBase} !gap-01 !text-text-muted ${colAlign} disabled:!cursor-not-allowed`}
    >
      <Text
        as="span"
        variant="label"
        className={
          (isPrev ? 'text-left' : 'text-right') + ' w-full text-text-muted'
        }
      >
        {label}
      </Text>
      <Text
        as="span"
        variant="body-sm"
        className={
          (isPrev ? 'text-left' : 'text-right') +
          ' line-clamp-3 w-full min-w-0 break-words text-text-muted'
        }
      >
        —
      </Text>
    </Button>
  )
}

export function ThoughtArticleNavFooter({ prev, next }: ThoughtArticleNavFooterProps) {
  return (
    <footer
      className={`${thoughtArticleColumnClassName} shrink-0 border-t border-border-subtle py-06`}
    >
      <div className="grid w-full min-w-0 grid-cols-2 items-stretch gap-03">
        <NeighborNavButton kind="prev" neighbor={prev} />
        <NeighborNavButton kind="next" neighbor={next} />
      </div>
    </footer>
  )
}
