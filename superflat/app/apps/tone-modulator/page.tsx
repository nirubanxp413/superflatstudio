'use client'

import { useState, useCallback } from 'react'
import { AppHeader } from '@/components/tone-modulator/AppHeader'
import { Pedalboard } from '@/components/tone-modulator/Pedalboard'
import { useTransformerChain } from '@/hooks/useTransformerChain'
import { DEFAULT_PEDALS } from '@/constants/pedals'
import type { PedalConfig } from '@/types/pedal'

export default function ToneModulatorPage() {
  const [pedals, setPedals] = useState<PedalConfig[]>(DEFAULT_PEDALS)
  const [inputText, setInputText] = useState('')
  const [runError, setRunError] = useState<string | null>(null)

  const { runChain, chainResult, isRunning, pedalStates } = useTransformerChain({
    pedals,
  })

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!inputText.trim() || isRunning) return
      setRunError(null)
      void runChain(inputText.trim()).catch((error: unknown) => {
        if (error instanceof Error && error.message) {
          setRunError(error.message)
          return
        }
        setRunError('Failed to transform text. Please try again.')
      })
    },
    [inputText, isRunning, runChain]
  )

  return (
    <main
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: 'var(--app-bg)' }}
    >
      <AppHeader />

      <section className="w-full shrink-0 px-6 py-8">
        <Pedalboard
          pedals={pedals}
          onPedalsChange={setPedals}
          pedalStates={pedalStates}
        />
      </section>

      <section className="grid flex-1 grid-cols-3 gap-6 px-6 pb-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to transform..."
            disabled={isRunning}
            className="min-h-0 flex-1 resize-none rounded-md border px-4 py-3 font-pedal text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
            style={{
              backgroundColor: 'var(--app-input-bg)',
              borderColor: 'var(--app-border)',
              color: 'var(--app-text)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--app-border-focus)'
              e.target.style.backgroundColor = 'var(--app-input-bg-hover)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--app-border)'
              e.target.style.backgroundColor = 'var(--app-input-bg)'
            }}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isRunning}
            className="shrink-0 rounded-md px-6 py-3 font-pedal text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              backgroundColor: 'var(--app-btn-bg)',
              color: 'var(--app-text)',
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = 'var(--app-btn-bg-hover)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--app-btn-bg)'
            }}
          >
            {isRunning ? 'Transforming...' : 'Submit'}
          </button>
        </form>

        <div
          className="rounded-md border px-4 py-3"
          style={{
            backgroundColor: 'var(--app-input-bg)',
            borderColor: 'var(--app-border)',
          }}
        >
          {runError ? (
            <div className="mb-2 font-pedal text-xs text-red-400">Error: {runError}</div>
          ) : null}
          <div
            className="mb-2 font-pedal text-xs"
            style={{ color: 'var(--app-text-muted)' }}
          >
            Output
          </div>
          <div
            className="font-pedal text-sm whitespace-pre-wrap"
            style={{ color: 'var(--app-text)' }}
          >
            {chainResult || (
              <span style={{ color: 'var(--app-text-placeholder)' }}>
                Transformed text will appear here…
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <p
            className="font-pedal text-sm leading-relaxed"
            style={{ color: 'var(--app-text-muted)' }}
          >
            Chain LLM transformers to shape your tone of voice. Each pedal applies a distinct
            voice characteristic—warmth, clarity, edge, formality, or concision. Drag pedals to
            reorder the chain. Adjust intensity with the sliders.
          </p>
          <p
            className="mt-4 font-pedal text-xs"
            style={{ color: 'var(--app-text-placeholder)' }}
          >
            ALL RIGHTS RESERVED SUPERFLAT STUDIO
          </p>
        </div>
      </section>
    </main>
  )
}
