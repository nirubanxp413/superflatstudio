import type { PedalConfig } from '@/types/pedal'

export const DEFAULT_PEDALS: PedalConfig[] = [
  {
    id: 'warmth',
    name: 'WARMTH',
    modelId: 'openai/gpt-4-turbo',
    modelDisplayName: 'GPT-4 Turbo',
    logoKey: 'gpt',
    systemPrompt: `You are a tone transformer. Your task is to add emotional warmth and empathy to the given text. 
Preserve the original meaning and structure, but make the language feel more human, caring, and emotionally resonant. 
Avoid being saccharine or over-the-top. Keep it natural and genuine.`,
    color: 'crimson',
    sliderType: 'fader',
  },
  {
    id: 'clarity',
    name: 'CLARITY',
    modelId: 'anthropic/claude-3.5-sonnet',
    modelDisplayName: 'Claude 3.5',
    logoKey: 'claude',
    systemPrompt: `You are a tone transformer. Your task is to sharpen the precision and logical structure of the given text. 
Improve clarity, remove ambiguity, and make the argument or narrative flow more logically. 
Use precise language and clear transitions. Avoid unnecessary verbosity.`,
    color: 'emerald',
    sliderType: 'knob',
  },
  {
    id: 'edge',
    name: 'EDGE',
    modelId: 'x-ai/grok-3-mini',
    modelDisplayName: 'Grok-3 Mini',
    logoKey: 'grok',
    systemPrompt: `You are a tone transformer. Your task is to add wit, irreverence, and directness to the given text. 
Make it punchier and more engaging. Use subtle humor and confident phrasing. 
Don't be mean or offensive—just sharper and more memorable.`,
    color: 'cobalt',
    sliderType: 'gauge',
  },
  {
    id: 'formal',
    name: 'FORMAL',
    modelId: 'openai/gpt-4-turbo',
    modelDisplayName: 'GPT-4 Turbo',
    logoKey: 'gpt',
    systemPrompt: `You are a tone transformer. Your task is to make the given text more formal and professional. 
Use polished, business-appropriate language. Maintain clarity while elevating the register. 
Avoid colloquialisms and casual phrasing.`,
    color: 'amber',
    sliderType: 'fader',
  },
  {
    id: 'concise',
    name: 'CONCISE',
    modelId: 'anthropic/claude-3.5-sonnet',
    modelDisplayName: 'Claude 3.5',
    logoKey: 'claude',
    systemPrompt: `You are a tone transformer. Your task is to make the given text more concise. 
Remove redundancy, tighten phrasing, and preserve the core message. 
Keep it clear and impactful—every word should earn its place.`,
    color: 'violet',
    sliderType: 'knob',
  },
]
