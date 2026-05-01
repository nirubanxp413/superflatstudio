import { Text } from '@/components/ui'
import { SiteContainer } from './SiteContainer'
import type { FeatureGridItem } from './types'

type FeatureGridProps = {
  title: string
  items: FeatureGridItem[]
  containerClassName?: string
  className?: string
}

export function FeatureGrid({
  title,
  items,
  containerClassName = '',
  className = '',
}: FeatureGridProps) {
  return (
    <section className={['mb-8', className].filter(Boolean).join(' ')}>
      <SiteContainer className={containerClassName}>
        <div className="pt-08 pb-0">
          <h2 className="text-2xl font-semibold text-neutral-950">{title}</h2>
          <div className="mt-05 grid gap-04 md:grid-cols-3">
            {items.map((item, index) => (
              <article key={`${item.title}-${index}`} className="rounded-md bg-gray-100 p-05">
                <div className="inline-flex rounded-sm bg-gray-200 p-02 text-slate-400">
                  {item.icon}
                </div>
                <h3 className="mt-04 text-body font-semibold text-neutral-950">{item.title}</h3>
                <Text as="p" variant="body" className="mt-02 text-neutral-600">
                  {item.description}
                </Text>
              </article>
            ))}
          </div>
        </div>
      </SiteContainer>
    </section>
  )
}
