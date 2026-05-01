/** Small monotone icons for app landing CMS blocks (steps + feature grid). */
export type AppsIconName =
  | 'sparkle'
  | 'zap'
  | 'check'
  | 'arrowRight'
  | 'layers'
  | 'shield'

const iconClass = 'h-[1.125rem] w-[1.125rem] shrink-0'

export function AppsBlockIcon({
  name,
  className = '',
}: {
  name?: string | null
  className?: string
}) {
  const icon = (name as AppsIconName | undefined) ?? 'sparkle'
  const svgProps = {
    className: [iconClass, className].filter(Boolean).join(' '),
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg' as const,
    'aria-hidden': true as const,
  }

  switch (icon) {
    case 'zap':
      return (
        <svg {...svgProps}>
          <path
            d="M13 2L4.09 13.87a.48.48 0 00.37.76H11l-1 8.12 8.93-11.87a.48.48 0 00-.37-.76H13V2z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'check':
      return (
        <svg {...svgProps}>
          <path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'arrowRight':
      return (
        <svg {...svgProps}>
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'layers':
      return (
        <svg {...svgProps}>
          <path
            d="M12 4l9 5-9 5-9-5 9-5z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M4 13l8 5 8-5M4 18l8 5 8-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'shield':
      return (
        <svg {...svgProps}>
          <path
            d="M12 3l8 4v6c0 5-3.5 9-8 9.5S4 18 4 13V7l8-4z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'sparkle':
    default:
      return (
        <svg {...svgProps}>
          <path
            d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
  }
}
