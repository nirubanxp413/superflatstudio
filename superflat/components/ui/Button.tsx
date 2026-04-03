import type { ElementType, ReactNode } from 'react'

interface ButtonProps {
  children?: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'md' | 'sm'
  as?: ElementType
  disabled?: boolean
  className?: string
  [key: string]: unknown
}

const variantClasses = {
  primary:   'bg-interactive text-white hover:bg-interactive-hover',
  secondary: 'bg-transparent text-interactive border border-interactive hover:bg-layer-hover',
  ghost:     'bg-transparent text-interactive hover:bg-layer-hover',
  danger:    'bg-[#da1e28] text-white hover:bg-[#b81921]',
}

const sizeClasses = {
  md: 'h-10 px-4 text-body-sm',
  sm: 'h-8 px-3 text-body-sm',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  as: Tag = 'button',
  disabled = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <Tag
      className={[
        'inline-flex items-center justify-center font-sans transition-colors duration-150',
        'focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--focus)]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled}
      {...props}
    >
      {children}
    </Tag>
  )
}
