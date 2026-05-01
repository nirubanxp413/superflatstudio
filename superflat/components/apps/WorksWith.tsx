import Link from 'next/link'
import { Text } from '@/components/ui'
import { SiteContainer } from './SiteContainer'
import type { WorksWithApp } from './types'

type WorksWithProps = {
  lead?: string
  apps: WorksWithApp[]
  containerClassName?: string
  className?: string
  tileWidthPx?: number
  squareSizePx?: number
  variant?: 'wordmarkRow' | 'imageSquares'
}

export function WorksWith({
  lead = 'Works with',
  apps,
  containerClassName = '',
  className = '',
  tileWidthPx = 120,
  squareSizePx = 112,
  variant = 'wordmarkRow',
}: WorksWithProps) {
  const tileClassName =
    'flex h-16 shrink-0 items-center justify-center rounded-md bg-gray-100 px-04 transition-[background-color,transform] duration-150 hover:-translate-y-px hover:bg-gray-200 active:translate-y-0'

  const squareClassName =
    'shrink-0 overflow-hidden rounded-xl bg-gray-100 transition-[background-color,transform] duration-150 hover:-translate-y-px hover:bg-gray-200 active:translate-y-0'

  return (
    <section className={['mb-8', className].filter(Boolean).join(' ')}>
      <SiteContainer className={containerClassName}>
        <div className="flex flex-col gap-04 pt-08 pb-0">
          <Text as="p" variant="body-sm" className="text-center text-neutral-700">
            {lead}
          </Text>

          <div
            className={
              variant === 'imageSquares'
                ? 'flex flex-wrap items-center justify-center gap-03'
                : 'flex flex-wrap items-center justify-center gap-03'
            }
          >
            {apps.map((app) => {
              const box =
                variant === 'imageSquares' ? (
                  <div
                    className={squareClassName}
                    style={{ width: `${squareSizePx}px`, height: `${squareSizePx}px` }}
                  >
                    {app.logoSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={app.logoSrc}
                        alt={app.logoAlt ?? app.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full" />
                    )}
                  </div>
                ) : (
                  <div className={tileClassName} style={{ width: `${tileWidthPx}px` }}>
                    {app.logoSvg ? (
                      <div className="h-6 w-full text-neutral-900">{app.logoSvg}</div>
                    ) : app.logoSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={app.logoSrc}
                        alt={app.logoAlt ?? app.name}
                        className="max-h-7 w-auto max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-lg font-medium text-neutral-900">{app.name}</span>
                    )}
                  </div>
                )

              if (app.href) {
                return (
                  <Link
                    key={app.name}
                    href={app.href}
                    aria-label={app.name}
                    className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
                  >
                    {box}
                  </Link>
                )
              }

              return <div key={app.name}>{box}</div>
            })}
          </div>
        </div>
      </SiteContainer>
    </section>
  )
}
