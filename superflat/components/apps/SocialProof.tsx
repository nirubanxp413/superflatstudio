import { Text } from '@/components/ui'
import { SiteContainer } from './SiteContainer'
import type { SocialProofItem } from './types'

type SocialProofProps = {
  title: string
  items: SocialProofItem[]
  containerClassName?: string
  className?: string
}

export function SocialProof({
  title,
  items,
  containerClassName = '',
  className = '',
}: SocialProofProps) {
  return (
    <section className={['mb-8', className].filter(Boolean).join(' ')}>
      <SiteContainer className={containerClassName}>
        <div className="pt-08 pb-0">
          <h2 className="text-2xl font-semibold text-neutral-950">{title}</h2>
          <div className="mt-05 grid gap-04 md:grid-cols-3">
            {items.map((item, index) => (
              <article key={`${item.author}-${index}`} className="rounded-md bg-gray-100 p-05">
                <Text as="p" variant="body" className="text-neutral-800">
                  "{item.quote}"
                </Text>
                <Text as="p" variant="body-sm" className="mt-04 text-neutral-950">
                  {item.author}
                </Text>
                {item.role ? (
                  <Text as="p" variant="caption" className="text-neutral-600">
                    {item.role}
                  </Text>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </SiteContainer>
    </section>
  )
}
