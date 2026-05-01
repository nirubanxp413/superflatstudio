'use client'

import type { CSSProperties } from 'react'
import { useId, useState } from 'react'
import { Text } from '@/components/ui'
import { APPS_DOT_DENSITY_PX } from './DottedSurface'
import { SiteContainer } from './SiteContainer'
import type { FeatureInteractiveGridItem } from './types'

const INACTIVE_DOT_STYLE = {
  backgroundImage:
    'radial-gradient(circle, var(--brand) 1.2px, transparent 1.2px)',
  backgroundSize: `${APPS_DOT_DENSITY_PX}px ${APPS_DOT_DENSITY_PX}px`,
} satisfies CSSProperties

type FeatureInteractiveGridProps = {
  title: string
  description: string
  /** Exactly three panels — one per column */
  items: [FeatureInteractiveGridItem, FeatureInteractiveGridItem, FeatureInteractiveGridItem]
  defaultSelectedIndex?: 0 | 1 | 2
  containerClassName?: string
  className?: string
}

export function FeatureInteractiveGrid({
  title,
  description,
  items,
  defaultSelectedIndex = 0,
  containerClassName = '',
  className = '',
}: FeatureInteractiveGridProps) {
  const [selected, setSelected] = useState<0 | 1 | 2>(defaultSelectedIndex)
  const groupId = useId()

  return (
    <section className={['mb-8', className].filter(Boolean).join(' ')}>
      <SiteContainer className={containerClassName}>
        <div className="flex flex-col justify-between gap-04 pb-06 md:flex-row md:items-start md:gap-08 md:pb-08">
          <h2 className="max-w-xl text-body font-semibold text-neutral-950">{title}</h2>
          <Text
            as="p"
            variant="body"
            className="max-w-md text-left text-neutral-600 md:ml-auto md:text-right"
          >
            {description}
          </Text>
        </div>
      </SiteContainer>

      <div
        className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2"
        role="radiogroup"
        aria-labelledby={`${groupId}-label`}
      >
        <span id={`${groupId}-label`} className="sr-only">
          {title}
        </span>
        <div className="grid min-h-[min(52vh,520px)] grid-cols-1 md:grid-cols-3">
          {items.map((item, index) => {
            const i = index as 0 | 1 | 2
            const active = selected === i
            return (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={item.ariaLabel ?? item.title}
                onClick={() => setSelected(i)}
                className={[
                  'flex min-h-[280px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden py-06 md:min-h-0',
                  'text-left',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                  active ? 'bg-[var(--brand)] text-white' : 'bg-transparent text-neutral-800',
                ].join(' ')}
                style={active ? { backgroundImage: 'none' } : INACTIVE_DOT_STYLE}
              >
                <div
                  className={[
                    'flex aspect-square w-full max-w-[min(100%,320px)] flex-col items-center justify-center gap-03 py-05 text-center',
                    active ? 'bg-transparent text-white' : 'bg-gray-100 text-neutral-800',
                  ].join(' ')}
                >
                  <span className="text-xs font-medium uppercase tracking-wide">
                    {item.title}
                  </span>
                  {item.children ? (
                    <div
                      className={[
                        'w-full text-sm',
                        active ? 'text-white/95' : 'text-neutral-600',
                      ].join(' ')}
                    >
                      {item.children}
                    </div>
                  ) : (
                    <span
                      className={[
                        'text-xs',
                        active ? 'text-white/85' : 'opacity-80',
                      ].join(' ')}
                    >
                      [ click to select ]
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
