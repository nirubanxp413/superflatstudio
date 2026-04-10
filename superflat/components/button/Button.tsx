import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react'

export type ButtonVariant = 'default' | 'borderless'

/** Shared layout, motion, focus — paired with a surface variant below. */
const buttonSharedClass =
  'inline-flex items-center justify-center gap-1.5 px-3 py-3 text-sm rounded-sm transition-[color,background-color,border-color,transform,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:pointer-events-none disabled:opacity-45 disabled:active:translate-y-0 [&_svg]:block [&_svg]:size-4 [&_svg]:shrink-0'

const defaultSurfaceClass =
  'border border-[color:var(--border)] bg-[var(--code-bg)] text-[color:var(--text)] hover:bg-[color-mix(in_srgb,var(--code-bg)_86%,var(--text)_14%)] active:bg-[color-mix(in_srgb,var(--code-bg)_72%,var(--text)_28%)] active:translate-y-px'

const borderlessSurfaceClass =
  'border-0 bg-transparent text-[color:var(--text)] hover:bg-[color-mix(in_srgb,transparent_92%,var(--text)_8%)] active:bg-[color-mix(in_srgb,transparent_84%,var(--text)_16%)] active:translate-y-px'

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  default: [buttonSharedClass, defaultSurfaceClass].join(' '),
  borderless: [buttonSharedClass, borderlessSurfaceClass].join(' '),
}

export type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: ButtonVariant
  /** Renders before the label; use for decorative icons when `children` is set. */
  iconLeft?: ReactNode
  /** Renders after the label. */
  iconRight?: ReactNode
}

const slotClass = 'inline-flex shrink-0 items-center justify-center'

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className = '',
      type = 'button',
      variant = 'default',
      children,
      iconLeft,
      iconRight,
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={[buttonVariantClasses[variant], className]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {iconLeft != null ? <span className={slotClass}>{iconLeft}</span> : null}
        {children != null ? (
          <span className="min-w-0 text-left">{children}</span>
        ) : null}
        {iconRight != null ? <span className={slotClass}>{iconRight}</span> : null}
      </button>
    )
  },
)
