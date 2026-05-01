import type { CSSProperties } from 'react'
import { Text } from '@/components/ui'
import { AppsCtaButton } from './AppsCtaButton'
import { DottedSurface } from './DottedSurface'
import { SiteContainer } from './SiteContainer'
import type { AppsCta, AppsHeroMediaBackground } from './types'

/** App screenshot in hero: rounded-md + soft black glow (CMS spec) */
const HERO_SCREENSHOT_STYLE = {
  filter: 'drop-shadow(0 0 20px rgba(0, 0, 0, 0.8))',
} satisfies CSSProperties

type HeroType1Props = {
  title: string
  subtitle?: string
  cta?: AppsCta
  /** Background of the large media band: dots or photographic image */
  mediaBackground?: AppsHeroMediaBackground
  /** When `mediaBackground` is `image`, used as cover for the media area (e.g. `/HeroImg.png`) */
  heroBackgroundImageSrc?: string
  /** Optional centered screenshot / artwork inside the media area */
  imageSrc?: string
  imageAlt?: string
  imageFit?: 'contain' | 'cover'
  mediaHeightVh?: number
  containerClassName?: string
  className?: string
}

function HeroMediaImage({
  imageSrc,
  imageAlt,
  imageFit,
}: {
  imageSrc: string
  imageAlt: string
  imageFit: 'contain' | 'cover'
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageSrc}
      alt={imageAlt}
      className={[
        'max-h-full max-w-full rounded-md',
        imageFit === 'cover' ? 'object-cover' : 'object-contain',
      ].join(' ')}
      style={HERO_SCREENSHOT_STYLE}
    />
  )
}

export function HeroType1({
  title,
  subtitle,
  cta,
  mediaBackground = 'dotted',
  heroBackgroundImageSrc,
  imageSrc,
  imageAlt = '',
  imageFit = 'contain',
  mediaHeightVh = 70,
  containerClassName = '',
  className = '',
}: HeroType1Props) {
  const boundedHeightVh = Math.min(mediaHeightVh, 70)
  const heightStyle = { height: `${boundedHeightVh}vh` } satisfies CSSProperties

  const mediaInner = (
    <div className="flex h-full items-center justify-center">
      {imageSrc ? (
        <HeroMediaImage imageSrc={imageSrc} imageAlt={imageAlt} imageFit={imageFit} />
      ) : null}
    </div>
  )

  return (
    <section className={['mb-8', className].filter(Boolean).join(' ')}>
      <SiteContainer className={containerClassName}>
        <div className="pt-10 pb-0">
          <header className="mb-08 flex flex-col items-start gap-03">
            <div className="max-w-[40%] min-w-0">
              <h1 className="text-2xl font-medium leading-tight text-neutral-950">
                {title}
              </h1>
              {subtitle ? (
                <Text as="p" variant="body" className="text-base font-medium text-neutral-700">
                  {subtitle}
                </Text>
              ) : null}
            </div>
            {cta ? <AppsCtaButton cta={cta} /> : null}
          </header>

          {mediaBackground === 'dotted' ? (
            <DottedSurface className="w-full overflow-hidden p-05 md:p-08">
              <div className="flex items-center justify-center" style={heightStyle}>
                {imageSrc ? (
                  <HeroMediaImage imageSrc={imageSrc} imageAlt={imageAlt} imageFit={imageFit} />
                ) : null}
              </div>
            </DottedSurface>
          ) : (
            <div
              className="w-full overflow-hidden rounded-md bg-neutral-200 bg-cover bg-center bg-no-repeat p-05 md:p-08"
              style={{
                ...heightStyle,
                backgroundImage: heroBackgroundImageSrc
                  ? `url(${heroBackgroundImageSrc})`
                  : undefined,
              }}
            >
              {mediaInner}
            </div>
          )}
        </div>
      </SiteContainer>
    </section>
  )
}
