import { Text } from '@/components/ui'
import { AppsCtaButton } from './AppsCtaButton'
import { SiteContainer } from './SiteContainer'
import type { AppsCta } from './types'

type FinalConversionBandProps = {
  title: string
  description?: string
  primaryCta: AppsCta
  secondaryCta?: AppsCta
  containerClassName?: string
  className?: string
}

export function FinalConversionBand({
  title,
  description,
  primaryCta,
  secondaryCta,
  containerClassName = '',
  className = '',
}: FinalConversionBandProps) {
  return (
    <section className={['mb-8', className].filter(Boolean).join(' ')}>
      <SiteContainer className={containerClassName}>
        <div className="rounded-md bg-gray-100 px-06 py-10 text-center">
          <h2 className="text-2xl font-semibold text-neutral-950">{title}</h2>
          {description ? (
            <Text as="p" variant="body" className="mx-auto mt-03 max-w-2xl text-neutral-600">
              {description}
            </Text>
          ) : null}

          <div className="mt-05 flex flex-wrap items-center justify-center gap-03">
            <AppsCtaButton cta={primaryCta} />
            {secondaryCta ? <AppsCtaButton cta={secondaryCta} /> : null}
          </div>
        </div>
      </SiteContainer>
    </section>
  )
}
