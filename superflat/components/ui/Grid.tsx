import type { ElementType, ReactNode } from 'react'

type GapKey = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10'

const gapClasses: Record<GapKey, string> = {
  '01': 'gap-01',
  '02': 'gap-02',
  '03': 'gap-03',
  '04': 'gap-04',
  '05': 'gap-05',
  '06': 'gap-06',
  '07': 'gap-07',
  '08': 'gap-08',
  '09': 'gap-09',
  '10': 'gap-10',
}

// Responsive cols: number = fixed; object = { sm, md, lg }
type ColsValue = 1 | 2 | 3 | 4 | 6 | 12
type ColsConfig = ColsValue | { sm?: ColsValue; md?: ColsValue; lg?: ColsValue }

const colClass = (n: ColsValue) => `grid-cols-${n}`

function buildColsClass(cols: ColsConfig): string {
  if (typeof cols === 'number') return colClass(cols)
  const parts: string[] = []
  if (cols.sm) parts.push(colClass(cols.sm))
  if (cols.md) parts.push(`md:${colClass(cols.md)}`)
  if (cols.lg) parts.push(`lg:${colClass(cols.lg)}`)
  return parts.join(' ')
}

interface GridProps {
  children: ReactNode
  as?: ElementType
  cols?: ColsConfig
  gap?: GapKey
  className?: string
}

export function Grid({
  children,
  as: Tag = 'div',
  cols = 1,
  gap = '06',
  className = '',
}: GridProps) {
  return (
    <Tag
      className={`grid ${buildColsClass(cols)} ${gapClasses[gap]} ${className}`}
    >
      {children}
    </Tag>
  )
}
