import type { ElementType, ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  /** When true: full-width, no padding — for full-bleed hero blocks */
  bleed?: boolean
  as?: ElementType
  className?: string
}

export function Container({
  children,
  bleed = false,
  as: Tag = 'div',
  className = '',
}: ContainerProps) {
  if (bleed) {
    return <Tag className={`w-full ${className}`}>{children}</Tag>
  }
  return (
    <Tag className={`max-w-[1584px] mx-auto px-4 md:px-8 ${className}`}>
      {children}
    </Tag>
  )
}
