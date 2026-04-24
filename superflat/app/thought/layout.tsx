import type { ReactNode } from 'react'

export default function ThoughtLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-theme="light"
      className="flex min-h-screen min-h-dvh flex-col bg-background text-text-primary"
    >
      {children}
    </div>
  )
}
