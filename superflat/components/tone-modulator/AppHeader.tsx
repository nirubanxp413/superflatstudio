'use client'

import { useState, useRef, useEffect } from 'react'

const APPS = [
  { id: 'tone-transformer', name: 'Tone Transformer', icon: '〄' },
  { id: 'app-2', name: 'Coming soon', icon: '○' },
]

export function AppHeader() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentApp = APPS[0]

  return (
    <header
      className="flex h-14 shrink-0 items-center border-b px-6"
      style={{ borderColor: 'var(--app-border)' }}
    >
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 font-pedal text-sm transition-colors hover:bg-white/5"
          style={{ color: 'var(--app-text)' }}
        >
          <span className="text-lg" aria-hidden>{currentApp.icon}</span>
          <span>{currentApp.name}</span>
          <span className={`transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden>▾</span>
        </button>
        {open && (
          <div
            className="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-md py-1 shadow-lg"
            style={{
              backgroundColor: 'var(--app-surface)',
              border: '1px solid var(--app-border)',
            }}
          >
            {APPS.map((app) => (
              <button
                key={app.id}
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-left font-pedal text-sm transition-colors hover:bg-white/5"
                style={{
                  color: app.id === currentApp.id ? 'var(--app-text)' : 'var(--app-text-muted)',
                }}
                onClick={() => setOpen(false)}
              >
                <span className="text-base">{app.icon}</span>
                {app.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
