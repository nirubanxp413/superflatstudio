import Link from 'next/link'
import { buttonVariantClasses } from '@/components/button'
import type { AppsCta } from './types'

export function AppsCtaButton({ cta }: { cta: AppsCta }) {
  const isExternal = cta.openInNewTab === true

  const brandSurfaceClass =
    '!border-transparent !bg-[var(--brand)] !text-white hover:!bg-[color-mix(in_srgb,var(--brand)_86%,black_14%)] active:!bg-[color-mix(in_srgb,var(--brand)_74%,black_26%)]'

  return (
    <Link
      href={cta.href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={[buttonVariantClasses.default, brandSurfaceClass].join(' ')}
    >
      {cta.label}
    </Link>
  )
}
