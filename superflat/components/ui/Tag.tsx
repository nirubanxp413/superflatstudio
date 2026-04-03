import type { ReactNode } from 'react'

interface TagProps {
  children: ReactNode
  /** default = Carbon gray bg; interactive = brand blue */
  variant?: 'default' | 'interactive'
  className?: string
}

export function Tag({ children, variant = 'default', className = '' }: TagProps) {
  const base = 'inline-flex items-center h-6 px-2 text-label font-sans uppercase tracking-widest whitespace-nowrap'
  const variants = {
    default:     'bg-layer-hover text-text-secondary',
    interactive: 'bg-interactive text-white',
  }
  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
