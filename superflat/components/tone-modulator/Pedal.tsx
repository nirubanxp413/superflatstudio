'use client'

import type { PedalConfig, TransformerState } from '@/types/pedal'
import { ModelLogo } from './ModelLogo'
import { PedalCanvas } from './PedalCanvas'
import { StateBar } from './StateBar'
import { FaderSlider } from './sliders/FaderSlider'
import { GaugeSlider } from './sliders/GaugeSlider'
import { KnobSlider } from './sliders/KnobSlider'

export interface PedalProps extends PedalConfig {
  intensity: number
  onIntensityChange: (v: number) => void
  state: TransformerState
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
}

const COLOR_CLASSES = {
  crimson: 'pedal-crimson',
  emerald: 'pedal-emerald',
  cobalt: 'pedal-cobalt',
  amber: 'pedal-amber',
  violet: 'pedal-violet',
} as const

export function Pedal({
  name,
  modelDisplayName,
  logoKey,
  color,
  sliderType,
  intensity,
  onIntensityChange,
  state,
  dragHandleProps,
}: PedalProps) {
  return (
    <div
      className={`pedal group relative h-[480px] w-[280px] cursor-default rounded-xl transition-transform duration-300 hover:-translate-y-1 ${COLOR_CLASSES[color]}`}
    >
      {dragHandleProps && (
        <div
          {...dragHandleProps}
          className="absolute left-0 top-0 z-20 -translate-x-full -translate-y-1/2 cursor-grab rounded-md p-1 opacity-0 transition-opacity duration-150 hover:opacity-100 group-hover:opacity-100 active:cursor-grabbing"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/90">
            <circle cx="9" cy="5" r="1" fill="currentColor" />
            <circle cx="9" cy="12" r="1" fill="currentColor" />
            <circle cx="9" cy="19" r="1" fill="currentColor" />
            <circle cx="15" cy="5" r="1" fill="currentColor" />
            <circle cx="15" cy="12" r="1" fill="currentColor" />
            <circle cx="15" cy="19" r="1" fill="currentColor" />
          </svg>
        </div>
      )}
      <div className="pedal-body relative h-full w-full overflow-hidden rounded-xl">
        <PedalCanvas color={color} />
        <StateBar state={state} />
        <div className="absolute left-6 right-6 top-[235px] flex justify-between">
          <div>
            <div className="font-pedal text-[26px] font-semibold tracking-[3px] text-white/90 [text-shadow:0_-1px_1px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.15),0_2px_3px_rgba(0,0,0,0.3)]">
              {name}
            </div>
            <div className="mt-0.5 font-pedal text-[9px] tracking-wider text-white/70 [text-shadow:0_-1px_1px_rgba(0,0,0,0.6),0_1px_1px_rgba(255,255,255,0.1)]">
              {modelDisplayName}
            </div>
          </div>
          <ModelLogo logoKey={logoKey} />
        </div>
        <div className="absolute bottom-[30px] left-6 right-6 top-[310px] flex flex-col items-center justify-center">
          {sliderType === 'fader' && (
            <FaderSlider value={intensity} onChange={onIntensityChange} />
          )}
          {sliderType === 'knob' && (
            <KnobSlider value={intensity} onChange={onIntensityChange} />
          )}
          {sliderType === 'gauge' && (
            <GaugeSlider value={intensity} onChange={onIntensityChange} color={color} />
          )}
        </div>
      </div>
    </div>
  )
}
