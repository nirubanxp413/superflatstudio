import type { ElementType, ReactNode } from 'react'
import { Container } from '@/components/ui'

type SiteContainerProps = {
  children: ReactNode
  as?: ElementType
  className?: string
}

/**
 * Product / apps page content width — matches dev tailwind showcase (`max-w-6xl`).
 * Wider layouts can override via `className` (e.g. `!max-w-[1584px]`).
 */
export function SiteContainer({
  children,
  as = 'div',
  className = '',
}: SiteContainerProps) {
  return (
    <Container
      as={as}
      className={['!max-w-6xl', className].filter(Boolean).join(' ')}
    >
      {children}
    </Container>
  )
}
