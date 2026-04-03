import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:     ['IBM Plex Sans', 'sans-serif'],
        mono:     ['IBM Plex Mono', 'ui-monospace', 'monospace'],
        display:  ['Fraunces', 'Georgia', 'serif'],
        pedal:    ['IBM Plex Mono', 'ui-monospace', 'monospace'],
        bebas:    ['Bebas Neue', 'sans-serif'],
        orbitron: ['Orbitron', 'monospace'],
      },

      // Carbon type scale — productive (IBM Plex) + expressive (Fraunces)
      fontSize: {
        'label':       ['11px', { lineHeight: '16px', fontWeight: '400' }],
        'caption':     ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'helper':      ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'body-sm':     ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body':        ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'code-sm':     ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'code':        ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'heading-xs':  ['12px', { lineHeight: '16px', fontWeight: '600' }],
        'heading-sm':  ['14px', { lineHeight: '18px', fontWeight: '600' }],
        'heading':     ['16px', { lineHeight: '22px', fontWeight: '600' }],
        'heading-md':  ['20px', { lineHeight: '28px', fontWeight: '400' }],
        'heading-lg':  ['28px', { lineHeight: '36px', fontWeight: '300' }],
        'heading-xl':  ['36px', { lineHeight: '44px', fontWeight: '300' }],
        'display-sm':  ['42px', { lineHeight: '50px', fontWeight: '300' }],
        'display':     ['64px', { lineHeight: '70px', fontWeight: '300' }],
        'display-lg':  ['96px', { lineHeight: '100px', fontWeight: '300' }],
      },

      // Carbon spacing scale — keys use zero-padded format (p-01, gap-06, etc.)
      // Single-digit keys (01–09) don't conflict with Tailwind defaults (1–9)
      // Keys 10–14 do extend/override Tailwind defaults at those steps
      spacing: {
        '01': '2px',
        '02': '4px',
        '03': '8px',
        '04': '12px',
        '05': '16px',
        '06': '24px',
        '07': '32px',
        '08': '40px',
        '09': '48px',
        '10': '64px',
        '11': '80px',
        '12': '96px',
        '13': '120px',
        '14': '160px',
      },

      // Carbon semantic color tokens — maps Tailwind utilities to CSS vars
      colors: {
        background:          'var(--background)',
        layer:               'var(--layer-01)',
        'layer-hover':       'var(--layer-02)',
        'border-subtle':     'var(--border-subtle)',
        'border-strong':     'var(--border-strong)',
        'text-primary':      'var(--text-primary)',
        'text-secondary':    'var(--text-secondary)',
        'text-muted':        'var(--text-muted)',
        interactive:         'var(--interactive)',
        'interactive-hover': 'var(--interactive-hover)',
        // mini-app tokens — available anywhere
        'app-bg':            'var(--app-bg)',
        'app-surface':       'var(--app-surface)',
        'app-border':        'var(--app-border)',
        'app-text':          'var(--app-text)',
        'app-text-muted':    'var(--app-text-muted)',
      },
    },
  },
  plugins: [],
}

export default config
