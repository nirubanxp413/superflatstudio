import { Text } from '@/components/ui'
import { AppsBlockIcon } from './AppsBlockIcon'
import { AppsCtaButton } from './AppsCtaButton'
import { DottedSurface } from './DottedSurface'
import { SiteContainer } from './SiteContainer'
import type { AppsCta, AppsFeatureImageAlign, AppsFeatureMode } from './types'

type FeatureSectionProps = {
  title: string
  paragraph: string
  mode?: AppsFeatureMode
  imageSrc?: string
  imageAlt?: string
  imageAlign?: AppsFeatureImageAlign
  /** When false, CTA is hidden even if `cta` is set (CMS toggle). */
  showCta?: boolean
  /** Same preset icons as Feature grid cards; shown above the heading when enabled. */
  showHeadingIcon?: boolean
  headingIcon?: string | null
  cta?: AppsCta
  containerClassName?: string
  className?: string
}

const modeClass: Record<AppsFeatureMode, string> = {
  textLeft: '',
  textRight: 'md:[&>.apps-feature-copy]:order-2 md:[&>.apps-feature-media]:order-1',
}

const imageAlignClass: Record<AppsFeatureImageAlign, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

export function FeatureSection({
  title,
  paragraph,
  mode = 'textLeft',
  imageSrc,
  imageAlt = '',
  imageAlign = 'center',
  showCta = true,
  showHeadingIcon = false,
  headingIcon = 'sparkle',
  cta,
  containerClassName = '',
  className = '',
}: FeatureSectionProps) {
  const effectiveCta = showCta ? cta : undefined

  return (
    <section className={['mb-8', className].filter(Boolean).join(' ')}>
      <SiteContainer className={containerClassName}>
        <div className="rounded-md bg-gray-100 px-05 py-05 md:px-08 md:py-08">
          <div className={`grid gap-06 md:grid-cols-3 ${modeClass[mode]}`}>
            <div className="apps-feature-copy flex flex-col items-start justify-center gap-04">
              {showHeadingIcon ? (
                <div className="inline-flex rounded-sm bg-gray-200 p-02 text-slate-400">
                  <AppsBlockIcon name={headingIcon} />
                </div>
              ) : null}
              <Text as="h2" variant="body" className="font-semibold text-neutral-950">
                {title}
              </Text>
              <Text as="p" variant="body" className="text-neutral-600">
                {paragraph}
              </Text>
              {effectiveCta ? <AppsCtaButton cta={effectiveCta} /> : null}
            </div>

            <div className="apps-feature-media md:col-span-2">
              <DottedSurface className="h-full min-h-[360px] p-05 md:min-h-[520px] md:p-08">
                <div
                  className={`flex h-full w-full items-center ${imageAlignClass[imageAlign]}`}
                >
                  {imageSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageSrc}
                      alt={imageAlt}
                      className="h-auto max-h-full w-auto max-w-full object-contain"
                    />
                  ) : null}
                </div>
              </DottedSurface>
            </div>
          </div>
        </div>
      </SiteContainer>
    </section>
  )
}
