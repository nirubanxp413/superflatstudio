import Link from 'next/link'
import { AppsCtaButton } from './AppsCtaButton'
import { SiteContainer } from './SiteContainer'
import type { AppsCta, AppsNavItem } from './types'

type NavbarHeaderProps = {
  brand: string
  navItems: AppsNavItem[]
  cta?: AppsCta
  containerClassName?: string
  className?: string
}

export function NavbarHeader({
  brand,
  navItems,
  cta,
  containerClassName = '',
  className = '',
}: NavbarHeaderProps) {
  return (
    <header className={['mb-8', className].filter(Boolean).join(' ')}>
      <SiteContainer className={containerClassName}>
        <div className="flex items-center justify-between gap-04 py-05">
          <Link href="/" className="text-body font-semibold text-neutral-950">
            {brand}
          </Link>

          <nav className="hidden items-center gap-05 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-body-sm text-neutral-700 transition-colors hover:text-neutral-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {cta ? <AppsCtaButton cta={cta} /> : null}
        </div>
      </SiteContainer>
    </header>
  )
}
