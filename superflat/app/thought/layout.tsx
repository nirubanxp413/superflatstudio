import type { ReactNode } from 'react'

export default function ThoughtLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-theme="light"
      className="min-h-screen bg-background text-text-primary"
    >
      {children}
    </div>
  )
}
