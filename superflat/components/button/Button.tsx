import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react'

export type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  /** Renders before the label; use for decorative icons when `children` is set. */
  iconLeft?: ReactNode
  /** Renders after the label. */
  iconRight?: ReactNode
}

const baseClass =
  'inline-flex items-center justify-center gap-1.5 px-3 py-3 text-sm rounded-sm border border-[color:var(--border)] bg-[var(--code-bg)] text-[color:var(--text)] transition-[color,background-color,border-color,transform,box-shadow] duration-150 hover:bg-[color-mix(in_srgb,var(--code-bg)_86%,var(--text)_14%)] active:bg-[color-mix(in_srgb,var(--code-bg)_72%,var(--text)_28%)] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:pointer-events-none disabled:opacity-45 disabled:active:translate-y-0 [&_svg]:block [&_svg]:size-4 [&_svg]:shrink-0'

const slotClass = 'inline-flex shrink-0 items-center justify-center'

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className = '',
      type = 'button',
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
        className={[baseClass, className].filter(Boolean).join(' ')}
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
