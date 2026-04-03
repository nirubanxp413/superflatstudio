'use client'

import { useCallback, useState } from 'react'
import type { PedalConfig, TransformerState } from '@/types/pedal'

export interface UseTransformerChainOptions {
  pedals: PedalConfig[]
  onComplete?: (finalText: string) => void
}

export function useTransformerChain({ pedals, onComplete }: UseTransformerChainOptions) {
  const [pedalStates, setPedalStates] = useState<Record<string, TransformerState>>({})
  const [currentPedalIndex, setCurrentPedalIndex] = useState(-1)
  const [chainResult, setChainResult] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)

  const runChain = useCallback(
    async (inputText: string) => {
      if (pedals.length === 0) {
        onComplete?.(inputText)
        return
      }
      setIsRunning(true)
      setChainResult('')
      let text = inputText

      for (let i = 0; i < pedals.length; i++) {
        const pedal = pedals[i]
        setCurrentPedalIndex(i)
        setPedalStates((prev) => ({ ...prev, [pedal.id]: 'working' }))

        try {
          const res = await fetch('/api/transform', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text,
              systemPrompt: pedal.systemPrompt,
              modelId: pedal.modelId,
              stream: false,
            }),
          })
          const body = await res.text()
          if (!res.ok) {
            let errMsg = res.statusText
            try {
              const parsed = JSON.parse(body) as { error?: string; message?: string }
              errMsg = parsed.error ?? parsed.message ?? errMsg
            } catch {
              if (body && body.length < 200) errMsg = body
            }
            throw new Error(errMsg)
          }
          const data = JSON.parse(body) as { text: string }
          text = data.text
          setPedalStates((prev) => ({ ...prev, [pedal.id]: 'static' }))
        } catch (e) {
          setPedalStates((prev) => ({ ...prev, [pedal.id]: 'error' }))
          setIsRunning(false)
          throw e
        }
      }

      setChainResult(text)
      setCurrentPedalIndex(-1)
      setIsRunning(false)
      onComplete?.(text)
    },
    [pedals, onComplete]
  )

  return {
    runChain,
    chainResult,
    isRunning,
    pedalStates,
    currentPedalIndex,
  }
}
