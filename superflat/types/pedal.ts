export type PedalColor = 'crimson' | 'emerald' | 'cobalt' | 'amber' | 'violet'

export type SliderType = 'fader' | 'knob' | 'gauge'

export type TransformerState = 'static' | 'working' | 'streaming' | 'error'

export type ModelId =
  | 'openai/gpt-4-turbo'
  | 'anthropic/claude-3.5-sonnet'
  | 'x-ai/grok-3-mini'
  | string

export interface PedalConfig {
  id: string
  name: string
  modelId: ModelId
  modelDisplayName: string
  logoKey: string
  systemPrompt: string
  color: PedalColor
  sliderType: SliderType
}
