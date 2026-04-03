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

const alignClasses = {
  start:   'items-start',
  center:  'items-center',
  end:     'items-end',
  stretch: 'items-stretch',
}

const justifyClasses = {
  start:   'justify-start',
  center:  'justify-center',
  end:     'justify-end',
  between: 'justify-between',
}

interface StackProps {
  children: ReactNode
  as?: ElementType
  gap?: GapKey
  align?: keyof typeof alignClasses
  justify?: keyof typeof justifyClasses
  className?: string
}

export function Stack({
  children,
  as: Tag = 'div',
  gap = '06',
  align = 'stretch',
  justify = 'start',
  className = '',
}: StackProps) {
  return (
    <Tag
      className={`flex flex-col ${gapClasses[gap]} ${alignClasses[align]} ${justifyClasses[justify]} ${className}`}
    >
      {children}
    </Tag>
  )
}
