interface DividerProps {
  className?: string
}

export function Divider({ className = '' }: DividerProps) {
  return (
    <hr className={`block h-px w-full border-0 bg-border-subtle ${className}`} />
  )
}
