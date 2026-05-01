import { AppsCtaButton } from './AppsCtaButton'
import { SiteContainer } from './SiteContainer'
import type { AppsCta } from './types'

type FooterCtaProps = {
  title: string
  cta: AppsCta
  containerClassName?: string
  className?: string
}

export function FooterCta({
  title,
  cta,
  containerClassName = '',
  className = '',
}: FooterCtaProps) {
  return (
    <section className={['mb-8', className].filter(Boolean).join(' ')}>
      <SiteContainer className={containerClassName}>
        <div className="flex flex-col items-center gap-06 pt-11 pb-08 text-center">
          <h2 className="text-5xl font-semibold leading-none text-neutral-950 md:text-6xl">
            {title}
          </h2>
          <AppsCtaButton cta={cta} />
        </div>
      </SiteContainer>
    </section>
  )
}
