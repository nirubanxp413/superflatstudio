import type { ReactNode } from 'react'

/**
 * Store product pages assume a light surface (neutral Tailwind blocks).
 * Site `:root` keeps legacy `--bg` / `--text` dark elsewhere; `[data-theme="light"]`
 * aligns those vars here. `flow-root` + bottom padding avoids the last section’s
 * margin collapsing past this wrapper — which exposed the portfolio body (#0a0a0a)
 * as a dark stripe below the footer.
 */
export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-theme="light"
      className="flow-root min-h-screen overflow-x-clip pb-08"
      style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
      }}
    >
      {children}
    </div>
  )
}
