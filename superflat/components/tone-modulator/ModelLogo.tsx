'use client'

export function ModelLogo({ logoKey }: { logoKey: string }) {
  const logos: Record<string, React.ReactNode> = {
    gpt: (
      <span className="font-pedal font-bold text-sm tracking-wide text-white/90 drop-shadow-[0_-1px_1px_rgba(0,0,0,0.8)]">
        GPT
      </span>
    ),
    claude: (
      <span className="font-pedal font-bold text-sm tracking-wide text-white/90 drop-shadow-[0_-1px_1px_rgba(0,0,0,0.8)]">
        C
      </span>
    ),
    grok: (
      <span className="font-pedal font-bold text-sm tracking-wide text-white/90 drop-shadow-[0_-1px_1px_rgba(0,0,0,0.8)]">
        X
      </span>
    ),
  }
  return (
    <div className="text-right">
      {logos[logoKey] ?? (
        <span className="font-pedal font-bold text-sm tracking-wide text-white/70">
          {logoKey.toUpperCase().slice(0, 3)}
        </span>
      )}
    </div>
  )
}
