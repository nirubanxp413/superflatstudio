'use client'

import { useState } from 'react'

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback for older browsers
      const el = document.createElement('textarea')
      el.value = code
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="font-mono text-xs transition-colors duration-150 px-2 py-1 rounded"
      style={{
        color: copied ? 'var(--code-text)' : 'var(--code-text-muted)',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
      }}
      aria-label="Copy code to clipboard"
    >
      {copied ? 'copied!' : 'copy'}
    </button>
  )
}
