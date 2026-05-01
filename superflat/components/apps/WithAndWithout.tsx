import { Text } from '@/components/ui'
import { SiteContainer } from './SiteContainer'
import type { WithAndWithoutPanel } from './types'

type WithAndWithoutProps = {
  title: string
  description?: string
  left: WithAndWithoutPanel
  right: WithAndWithoutPanel
  containerClassName?: string
  className?: string
}

function Panel({ panel }: { panel: WithAndWithoutPanel }) {
  return (
    <article className="rounded-md border border-gray-200 bg-white p-04">
      {panel.title ? (
        <Text as="p" variant="heading-sm" className="mb-03 text-neutral-700">
          {panel.title}
        </Text>
      ) : null}
      <div className="overflow-hidden rounded-md bg-gray-100">
        {panel.imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={panel.imageSrc}
            alt={panel.imageAlt ?? panel.title}
            className="h-auto w-full object-cover"
          />
        ) : (
          <div className="aspect-[16/10] w-full" />
        )}
      </div>
    </article>
  )
}

export function WithAndWithout({
  title,
  description,
  left,
  right,
  containerClassName = '',
  className = '',
}: WithAndWithoutProps) {
  return (
    <section className={['mb-8', className].filter(Boolean).join(' ')}>
      <SiteContainer className={containerClassName}>
        <div className="flex flex-col gap-04 pt-08 pb-0">
          <h2 className="text-center text-body font-semibold text-neutral-950">{title}</h2>
          {description ? (
            <Text as="p" variant="body" className="mx-auto max-w-3xl text-center text-neutral-600">
              {description}
            </Text>
          ) : null}

          <div className="grid gap-04 md:grid-cols-2">
            <Panel panel={left} />
            <Panel panel={right} />
          </div>
        </div>
      </SiteContainer>
    </section>
  )
}
