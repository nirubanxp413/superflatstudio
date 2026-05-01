import type { CSSProperties, ReactNode } from 'react'

type DottedSurfaceProps = {
  children?: ReactNode
  className?: string
  dotDensityPx?: number
}

export const APPS_DOT_DENSITY_PX = 5

export function DottedSurface({
  children,
  className = '',
  dotDensityPx = APPS_DOT_DENSITY_PX,
}: DottedSurfaceProps) {
  const style = {
    backgroundImage:
      'radial-gradient(circle, var(--brand) 1.2px, transparent 1.2px)',
    backgroundSize: `${dotDensityPx}px ${dotDensityPx}px`,
  } satisfies CSSProperties

  return (
    <div
      className={[
        'relative overflow-hidden rounded-md bg-transparent',
        className,
      ].join(' ')}
      style={style}
    >
      {children}
    </div>
  )
}
