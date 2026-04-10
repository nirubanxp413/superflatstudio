import { Text } from '@/components/ui'
import { formatPublishedDate } from '@/lib/formatPublishedDate'

/** Padded reading column — header, footer, and any content not wrapped by `Container` */
export const thoughtArticleColumnClassName =
  'max-w-6xl w-full mx-auto px-4 md:px-8'

/** Narrow wrapper for `BlockRenderer` only — blocks use inner `Container` for horizontal padding */
export const thoughtBlocksColumnClassName = 'max-w-6xl w-full mx-auto'

export type ThoughtHeaderProps = {
  title: string
  publishedAt: string
  description?: string | null
}

export function ThoughtHeader({
  title,
  publishedAt,
  description,
}: ThoughtHeaderProps) {
  const dateLabel = formatPublishedDate(publishedAt)

  return (
    <header className={`pt-10 pb-08 ${thoughtArticleColumnClassName}`}>
      <div className="flex flex-col gap-03">
        <h1 className="text-text-primary font-sans font-normal text-6xl leading-[1.08] tracking-tight">
          {title}
        </h1>
        <div className="flex flex-col gap-02">
          {dateLabel ? (
            <Text
              as="time"
              variant="label"
              className="text-text-muted"
              dateTime={publishedAt}
            >
              {dateLabel}
            </Text>
          ) : null}
          {description ? (
            <Text
              as="p"
              variant="body-sm"
              className="text-text-secondary"
            >
              {description}
            </Text>
          ) : null}
        </div>
      </div>
    </header>
  )
}
