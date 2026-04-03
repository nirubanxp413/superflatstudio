import type { CSSProperties, ElementType, ReactNode } from 'react'

// display-* variants intentionally use font-sans (IBM Plex Sans) until a
// geometric sans display typeface is confirmed. CLAUDE.md: "must be
// ultra-futurist geometric sans-serif (not serif, not retro) — decision pending."

export type TextVariant =
  | 'label'
  | 'caption'
  | 'helper'
  | 'body-sm'
  | 'body'
  | 'code-sm'
  | 'code'
  | 'heading-xs'
  | 'heading-sm'
  | 'heading'
  | 'heading-md'
  | 'heading-lg'
  | 'heading-xl'
  | 'display-sm'
  | 'display'
  | 'display-lg'

const variantClasses: Record<TextVariant, string> = {
  'label':      'text-label font-sans',
  'caption':    'text-caption font-sans',
  'helper':     'text-helper font-sans',
  'body-sm':    'text-body-sm font-sans',
  'body':       'text-body font-sans',
  'code-sm':    'text-code-sm font-mono',
  'code':       'text-code font-mono',
  'heading-xs': 'text-heading-xs font-sans uppercase tracking-widest',
  'heading-sm': 'text-heading-sm font-sans',
  'heading':    'text-heading font-sans font-semibold',
  'heading-md': 'text-heading-md font-sans',
  'heading-lg': 'text-heading-lg font-sans',
  'heading-xl': 'text-heading-xl font-sans',
  // display-* uses IBM Plex Sans until a display geometric sans is confirmed
  'display-sm': 'text-display-sm font-sans',
  'display':    'text-display font-sans',
  'display-lg': 'text-display-lg font-sans',
}

interface TextProps {
  as: ElementType
  variant: TextVariant
  children?: ReactNode
  className?: string
  style?: CSSProperties
  [key: string]: unknown
}

export function Text({
  as: Tag,
  variant,
  children,
  className = '',
  style,
  ...props
}: TextProps) {
  return (
    <Tag
      className={`${variantClasses[variant]} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </Tag>
  )
}
