'use client'

import { useEffect, useState, type SVGProps } from 'react'
import Link from 'next/link'

import { Button } from '@/components/button'

function IconChevronLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <path d="M10 12 6 8l4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconChevronRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <path d="m6 12 4-4-4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconPlus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <path d="M8 3v10M3 8h10" strokeLinecap="round" />
    </svg>
  )
}

/** Literal class strings so Tailwind JIT includes every utility. */
const TEXT_SCALE: { label: string; className: string }[] = [
  { label: 'text-xs', className: 'text-xs leading-tight' },
  { label: 'text-sm', className: 'text-sm leading-tight' },
  { label: 'text-base', className: 'text-base leading-tight' },
  { label: 'text-lg', className: 'text-lg leading-tight' },
  { label: 'text-xl', className: 'text-xl leading-tight' },
  { label: 'text-2xl', className: 'text-2xl leading-tight' },
  { label: 'text-3xl', className: 'text-3xl leading-tight' },
  { label: 'text-4xl', className: 'text-4xl leading-tight' },
  { label: 'text-5xl', className: 'text-5xl leading-tight' },
  { label: 'text-6xl', className: 'text-6xl leading-tight' },
  { label: 'text-7xl', className: 'text-7xl leading-tight' },
  { label: 'text-8xl', className: 'text-8xl leading-tight' },
  { label: 'text-9xl', className: 'text-9xl leading-tight' },
]

const SPACING_SAMPLES: { label: string; className: string }[] = [
  { label: 'p-0', className: 'p-0' },
  { label: 'p-px', className: 'p-px' },
  { label: 'p-0.5', className: 'p-0.5' },
  { label: 'p-1', className: 'p-1' },
  { label: 'p-1.5', className: 'p-1.5' },
  { label: 'p-2', className: 'p-2' },
  { label: 'p-3', className: 'p-3' },
  { label: 'p-4', className: 'p-4' },
  { label: 'p-5', className: 'p-5' },
  { label: 'p-6', className: 'p-6' },
  { label: 'p-8', className: 'p-8' },
  { label: 'p-10', className: 'p-10' },
  { label: 'p-12', className: 'p-12' },
  { label: 'p-16', className: 'p-16' },
  { label: 'p-20', className: 'p-20' },
  { label: 'p-24', className: 'p-24' },
  { label: 'p-32', className: 'p-32' },
]

const FONT_FAMILIES: { token: string; label: string; sampleClass: string; note: string }[] = [
  {
    token: 'font-sans',
    label: 'sans',
    sampleClass: 'mt-1 text-xl font-sans',
    note: 'Tailwind default replaced in config → IBM Plex Sans',
  },
  {
    token: 'font-mono',
    label: 'mono',
    sampleClass: 'mt-1 text-xl font-mono',
    note: 'Tailwind default replaced → IBM Plex Mono',
  },
  {
    token: 'font-pedal',
    label: 'pedal',
    sampleClass: 'mt-1 text-xl font-pedal',
    note: 'Project alias (same stack as mono)',
  },
  {
    token: 'font-bebas',
    label: 'bebas',
    sampleClass: 'mt-1 text-xl font-bebas',
    note: 'Bebas Neue (display)',
  },
  {
    token: 'font-orbitron',
    label: 'orbitron',
    sampleClass: 'mt-1 text-xl font-orbitron',
    note: 'Orbitron (mini-apps)',
  },
]

const PALETTE_ROWS: { name: string; cells: { shade: number; className: string }[] }[] = [
  {
    name: 'slate',
    cells: [
      { shade: 50, className: 'bg-slate-50' },
      { shade: 200, className: 'bg-slate-200' },
      { shade: 400, className: 'bg-slate-400' },
      { shade: 600, className: 'bg-slate-600' },
      { shade: 800, className: 'bg-slate-800' },
      { shade: 950, className: 'bg-slate-950' },
    ],
  },
  {
    name: 'gray',
    cells: [
      { shade: 50, className: 'bg-gray-50' },
      { shade: 200, className: 'bg-gray-200' },
      { shade: 400, className: 'bg-gray-400' },
      { shade: 600, className: 'bg-gray-600' },
      { shade: 800, className: 'bg-gray-800' },
      { shade: 950, className: 'bg-gray-950' },
    ],
  },
  {
    name: 'neutral',
    cells: [
      { shade: 50, className: 'bg-neutral-50' },
      { shade: 200, className: 'bg-neutral-200' },
      { shade: 400, className: 'bg-neutral-400' },
      { shade: 600, className: 'bg-neutral-600' },
      { shade: 800, className: 'bg-neutral-800' },
      { shade: 950, className: 'bg-neutral-950' },
    ],
  },
  {
    name: 'red',
    cells: [
      { shade: 50, className: 'bg-red-50' },
      { shade: 200, className: 'bg-red-200' },
      { shade: 400, className: 'bg-red-400' },
      { shade: 600, className: 'bg-red-600' },
      { shade: 800, className: 'bg-red-800' },
      { shade: 950, className: 'bg-red-950' },
    ],
  },
  {
    name: 'orange',
    cells: [
      { shade: 50, className: 'bg-orange-50' },
      { shade: 200, className: 'bg-orange-200' },
      { shade: 400, className: 'bg-orange-400' },
      { shade: 600, className: 'bg-orange-600' },
      { shade: 800, className: 'bg-orange-800' },
      { shade: 950, className: 'bg-orange-950' },
    ],
  },
  {
    name: 'amber',
    cells: [
      { shade: 50, className: 'bg-amber-50' },
      { shade: 200, className: 'bg-amber-200' },
      { shade: 400, className: 'bg-amber-400' },
      { shade: 600, className: 'bg-amber-600' },
      { shade: 800, className: 'bg-amber-800' },
      { shade: 950, className: 'bg-amber-950' },
    ],
  },
  {
    name: 'green',
    cells: [
      { shade: 50, className: 'bg-green-50' },
      { shade: 200, className: 'bg-green-200' },
      { shade: 400, className: 'bg-green-400' },
      { shade: 600, className: 'bg-green-600' },
      { shade: 800, className: 'bg-green-800' },
      { shade: 950, className: 'bg-green-950' },
    ],
  },
  {
    name: 'teal',
    cells: [
      { shade: 50, className: 'bg-teal-50' },
      { shade: 200, className: 'bg-teal-200' },
      { shade: 400, className: 'bg-teal-400' },
      { shade: 600, className: 'bg-teal-600' },
      { shade: 800, className: 'bg-teal-800' },
      { shade: 950, className: 'bg-teal-950' },
    ],
  },
  {
    name: 'blue',
    cells: [
      { shade: 50, className: 'bg-blue-50' },
      { shade: 200, className: 'bg-blue-200' },
      { shade: 400, className: 'bg-blue-400' },
      { shade: 600, className: 'bg-blue-600' },
      { shade: 800, className: 'bg-blue-800' },
      { shade: 950, className: 'bg-blue-950' },
    ],
  },
  {
    name: 'indigo',
    cells: [
      { shade: 50, className: 'bg-indigo-50' },
      { shade: 200, className: 'bg-indigo-200' },
      { shade: 400, className: 'bg-indigo-400' },
      { shade: 600, className: 'bg-indigo-600' },
      { shade: 800, className: 'bg-indigo-800' },
      { shade: 950, className: 'bg-indigo-950' },
    ],
  },
  {
    name: 'violet',
    cells: [
      { shade: 50, className: 'bg-violet-50' },
      { shade: 200, className: 'bg-violet-200' },
      { shade: 400, className: 'bg-violet-400' },
      { shade: 600, className: 'bg-violet-600' },
      { shade: 800, className: 'bg-violet-800' },
      { shade: 950, className: 'bg-violet-950' },
    ],
  },
  {
    name: 'pink',
    cells: [
      { shade: 50, className: 'bg-pink-50' },
      { shade: 200, className: 'bg-pink-200' },
      { shade: 400, className: 'bg-pink-400' },
      { shade: 600, className: 'bg-pink-600' },
      { shade: 800, className: 'bg-pink-800' },
      { shade: 950, className: 'bg-pink-950' },
    ],
  },
]

const FONT_WEIGHT_SAMPLES: { label: string; className: string }[] = [
  { label: 'font-thin', className: 'font-thin text-lg' },
  { label: 'font-extralight', className: 'font-extralight text-lg' },
  { label: 'font-light', className: 'font-light text-lg' },
  { label: 'font-normal', className: 'font-normal text-lg' },
  { label: 'font-medium', className: 'font-medium text-lg' },
  { label: 'font-semibold', className: 'font-semibold text-lg' },
  { label: 'font-bold', className: 'font-bold text-lg' },
  { label: 'font-extrabold', className: 'font-extrabold text-lg' },
  { label: 'font-black', className: 'font-black text-lg' },
]

const TRACKING_SAMPLES: { label: string; className: string }[] = [
  { label: 'tracking-tighter', className: 'tracking-tighter text-lg' },
  { label: 'tracking-tight', className: 'tracking-tight text-lg' },
  { label: 'tracking-normal', className: 'tracking-normal text-lg' },
  { label: 'tracking-wide', className: 'tracking-wide text-lg' },
  { label: 'tracking-wider', className: 'tracking-wider text-lg' },
  { label: 'tracking-widest', className: 'tracking-widest text-lg' },
]

const ROUNDED_SAMPLES: { label: string; className: string }[] = [
  { label: 'rounded-none', className: 'h-16 w-24 rounded-none border border-neutral-600 bg-neutral-800' },
  { label: 'rounded-sm', className: 'h-16 w-24 rounded-sm border border-neutral-600 bg-neutral-800' },
  { label: 'rounded-md', className: 'h-16 w-24 rounded-md border border-neutral-600 bg-neutral-800' },
  { label: 'rounded-lg', className: 'h-16 w-24 rounded-lg border border-neutral-600 bg-neutral-800' },
  { label: 'rounded-xl', className: 'h-16 w-24 rounded-xl border border-neutral-600 bg-neutral-800' },
  { label: 'rounded-2xl', className: 'h-16 w-24 rounded-2xl border border-neutral-600 bg-neutral-800' },
  { label: 'rounded-3xl', className: 'h-16 w-24 rounded-3xl border border-neutral-600 bg-neutral-800' },
  { label: 'rounded-full', className: 'h-16 w-24 rounded-full border border-neutral-600 bg-neutral-800' },
]

const SHADOW_SAMPLES: { label: string; className: string }[] = [
  { label: 'shadow-sm', className: 'h-20 w-28 rounded-md border border-neutral-700 bg-neutral-800 shadow-sm' },
  { label: 'shadow-md', className: 'h-20 w-28 rounded-md border border-neutral-700 bg-neutral-800 shadow-md' },
  { label: 'shadow-lg', className: 'h-20 w-28 rounded-md border border-neutral-700 bg-neutral-800 shadow-lg' },
  { label: 'shadow-xl', className: 'h-20 w-28 rounded-md border border-neutral-700 bg-neutral-800 shadow-xl' },
  { label: 'shadow-2xl', className: 'h-20 w-28 rounded-md border border-neutral-700 bg-neutral-800 shadow-2xl' },
  { label: 'shadow-inner', className: 'h-20 w-28 rounded-md border border-neutral-700 bg-neutral-800 shadow-inner' },
  { label: 'shadow-none', className: 'h-20 w-28 rounded-md border border-neutral-700 bg-neutral-800 shadow-none' },
]

const ROOT_VARS = [
  { name: '--bg', desc: 'Site background' },
  { name: '--text', desc: 'Primary text' },
  { name: '--gray', desc: 'Muted / secondary' },
  { name: '--border', desc: 'Borders' },
  { name: '--brand', desc: 'Brand accent' },
  { name: '--muted', desc: 'Muted UI' },
  { name: '--code-bg', desc: 'Code blocks' },
] as const

const APP_VARS = [
  { name: '--app-bg', desc: 'Mini-app background' },
  { name: '--app-surface', desc: 'Surfaces' },
  { name: '--app-border', desc: 'Borders' },
  { name: '--app-border-focus', desc: 'Focus ring' },
  { name: '--app-text', desc: 'Primary' },
  { name: '--app-text-muted', desc: 'Muted' },
  { name: '--app-text-placeholder', desc: 'Placeholder' },
  { name: '--app-input-bg', desc: 'Input fill' },
  { name: '--app-input-bg-hover', desc: 'Input hover' },
  { name: '--app-btn-bg', desc: 'Button' },
  { name: '--app-btn-bg-hover', desc: 'Button hover' },
  { name: '--app-btn-disabled', desc: 'Disabled' },
] as const

function Section({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section
      className="mb-16 border p-6 md:p-8"
      style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}
    >
      <header className="mb-6 border-b pb-4" style={{ borderBottomColor: 'var(--border)' }}>
        <h2 className="font-mono text-sm font-semibold uppercase tracking-widest text-[color:var(--gray)]">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 max-w-3xl text-sm text-[color:var(--gray)] opacity-90">{subtitle}</p>
        ) : null}
      </header>
      {children}
    </section>
  )
}

export default function TailwindShowcasePage() {
  const [siteLight, setSiteLight] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (siteLight) root.setAttribute('data-theme', 'light')
    else root.removeAttribute('data-theme')
    return () => root.removeAttribute('data-theme')
  }, [siteLight])

  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
        <header
          className="mb-12 flex flex-col gap-4 border-b pb-8 md:flex-row md:items-end md:justify-between"
          style={{ borderBottomColor: 'var(--border)' }}
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[color:var(--gray)]">Dev / reference</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Tailwind showcase</h1>
            <p className="mt-3 max-w-2xl text-sm text-[color:var(--gray)]">
              Default Tailwind utilities (colors, spacing, type, radii, shadows) plus what this repo extends in{' '}
              <code
                className="rounded px-1.5 py-0.5 font-mono text-xs"
                style={{
                  backgroundColor: 'var(--code-bg)',
                  color: 'var(--text)',
                }}
              >
                tailwind.config.ts
              </code>{' '}
              and overrides in{' '}
              <code
                className="rounded px-1.5 py-0.5 font-mono text-xs"
                style={{
                  backgroundColor: 'var(--code-bg)',
                  color: 'var(--text)',
                }}
              >
                globals.css
              </code>{' '}
              (CSS variables, fonts).
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setSiteLight((v) => !v)}
              className="border px-4 py-2 font-mono text-xs uppercase tracking-wide transition-colors hover:opacity-90"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--code-bg)',
                color: 'var(--text)',
              }}
            >
              Site vars: {siteLight ? 'light' : 'dark'} (toggle)
            </button>
            <Link
              href="/"
              className="border px-4 py-2 font-mono text-xs transition-colors hover:opacity-80"
              style={{ borderColor: 'var(--border)', color: 'var(--gray)' }}
            >
              ← Home
            </Link>
          </div>
        </header>

        <Section
          title="Overrides vs defaults"
          subtitle="tailwind.config.ts only extends fontFamily (sans, mono, pedal, bebas, orbitron). Color, spacing, breakpoints, etc. are Tailwind defaults unless you add them to theme.extend. globals.css defines :root and [data-theme='light'] tokens used with var(--*) — not Tailwind theme keys unless you wire them in."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div className="border border-emerald-900/60 bg-emerald-950/20 p-4">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-emerald-400">Tailwind defaults</h3>
              <p className="mt-2 text-sm text-neutral-400">
                Utility classes like <code className="font-mono text-emerald-200/90">text-slate-500</code>,{' '}
                <code className="font-mono text-emerald-200/90">p-4</code>,{' '}
                <code className="font-mono text-emerald-200/90">rounded-lg</code> use the stock theme unless overridden.
              </p>
            </div>
            <div className="border border-sky-900/60 bg-sky-950/20 p-4">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-sky-400">Config extension</h3>
              <p className="mt-2 text-sm text-neutral-400">
                <code className="font-mono text-sky-200/90">font-sans</code> /{' '}
                <code className="font-mono text-sky-200/90">font-mono</code> point at IBM Plex. Extra families:{' '}
                <code className="font-mono text-sky-200/90">font-pedal</code>,{' '}
                <code className="font-mono text-sky-200/90">font-bebas</code>,{' '}
                <code className="font-mono text-sky-200/90">font-orbitron</code>.
              </p>
            </div>
            <div className="border border-amber-900/60 bg-amber-950/20 p-4">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-amber-400">CSS variables</h3>
              <p className="mt-2 text-sm text-neutral-400">
                Layout can set <code className="font-mono text-amber-200/90">style=&#123;&#123; color: &apos;var(--text)&apos; &#125;&#125;</code>{' '}
                — that bypasses Tailwind color scales. Mini-apps use <code className="font-mono text-amber-200/90">--app-*</code>.
              </p>
            </div>
          </div>
        </Section>

        <Section
          title="Button (core)"
          subtitle="Shared primitive in components/button — base styles, hover / active / focus-visible / disabled. Variants can compose this later. Icon slots are optional React nodes (e.g. SVG); use aria-label when the button has no text."
        >
          <div className="flex flex-col gap-8">
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[color:var(--gray)]">
                Default · hover · active
              </p>
              <p className="mb-4 max-w-2xl text-sm text-[color:var(--gray)]">
                Hover lightens the fill with <code className="font-mono text-[color:var(--text)] opacity-90">color-mix</code>{' '}
                against <code className="font-mono text-[color:var(--text)] opacity-90">var(--text)</code>. Active state
                darkens further and nudges down <code className="font-mono text-[color:var(--text)] opacity-90">1px</code>{' '}
                (<code className="font-mono text-[color:var(--text)] opacity-90">active:translate-y-px</code>).
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button type="button">Label</Button>
                <Button type="button" disabled>
                  Disabled
                </Button>
              </div>
            </div>

            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[color:var(--gray)]">
                iconLeft · iconRight
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button type="button" iconLeft={<IconChevronLeft />}>
                  Back
                </Button>
                <Button type="button" iconRight={<IconChevronRight />}>
                  Next
                </Button>
                <Button type="button" iconLeft={<IconPlus />} iconRight={<IconChevronRight />}>
                  Both slots
                </Button>
              </div>
            </div>

            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[color:var(--gray)]">
                Icon only (aria-label required)
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button type="button" aria-label="Add" iconLeft={<IconPlus />} />
                <Button type="button" aria-label="Go forward" iconRight={<IconChevronRight />} />
              </div>
            </div>
          </div>
        </Section>

        <Section
          title="Font families"
          subtitle="Compare font-* utilities. sans/mono are overridden in tailwind.config.ts."
        >
          <div className="space-y-6">
            {FONT_FAMILIES.map(({ token, label, sampleClass, note }) => (
              <div key={token} className="border-l-2 pl-4" style={{ borderLeftColor: 'var(--border)' }}>
                <p className="font-mono text-xs text-[color:var(--gray)]">
                  {token} <span className="opacity-80">· {label}</span>
                </p>
                <p className={sampleClass}>The quick brown fox jumps over the lazy dog. 0123456789</p>
                <p className="mt-1 text-xs text-[color:var(--gray)] opacity-90">{note}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Type scale" subtitle="Tailwind default text-* sizes (inherits font-sans from page).">
          <div className="space-y-3 font-sans">
            {TEXT_SCALE.map(({ label, className }) => (
              <div
                key={label}
                className="flex flex-col gap-1 border-b py-2 sm:flex-row sm:items-baseline sm:gap-6"
                style={{ borderBottomColor: 'var(--border)' }}
              >
                <code className="shrink-0 font-mono text-xs text-[color:var(--gray)]">{label}</code>
                <p className={className}>Agency of the line — Superflat Studio</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Font weight & tracking" subtitle="Tailwind font-* and tracking-* utilities.">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 font-sans">
              {FONT_WEIGHT_SAMPLES.map(({ label, className }) => (
                <p key={label} className={className}>
                  <span className="font-mono text-xs text-[color:var(--gray)]">{label}</span> — Modulated tone
                </p>
              ))}
            </div>
            <div className="space-y-2 font-sans">
              {TRACKING_SAMPLES.map(({ label, className }) => (
                <p key={label} className={className}>
                  <span className="font-mono text-xs text-[color:var(--gray)]">{label}</span> — SIGNAL CHAIN
                </p>
              ))}
            </div>
          </div>
        </Section>

        <Section
          title="Tailwind color palettes (sample)"
          subtitle="Default Tailwind colors — your app pages often use neutral-* for UI chrome here; product pages may use var(--*) instead."
        >
          <div className="space-y-4 overflow-x-auto">
            {PALETTE_ROWS.map(({ name, cells }) => (
              <div key={name} className="flex min-w-max items-stretch gap-1">
                <span className="w-20 shrink-0 self-center font-mono text-xs text-[color:var(--gray)]">{name}</span>
                {cells.map(({ shade, className }) => (
                  <div key={shade} className="flex flex-col">
                    <div
                      className={`h-12 w-14 border ${className}`}
                      style={{ borderColor: 'var(--border)' }}
                      title={className}
                    />
                    <span className="mt-1 text-center font-mono text-[10px] text-[color:var(--gray)] opacity-90">
                      {shade}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Section>

        <Section title="Spacing scale" subtitle="Padding steps (Tailwind default). Inner box uses the listed p-* class.">
          <div className="flex flex-wrap gap-4">
            {SPACING_SAMPLES.map(({ label, className }) => (
              <div key={label} className="text-center">
                <div
                  className="inline-block border border-dashed"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'color-mix(in srgb, var(--text) 6%, var(--bg))',
                  }}
                >
                  <div className={`border bg-neutral-700 ${className}`} style={{ borderColor: 'var(--border)' }}>
                    <div className="h-3 w-3 bg-white" />
                  </div>
                </div>
                <p className="mt-1 font-mono text-[10px] text-[color:var(--gray)]">{label}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Border radius" subtitle="Tailwind rounded-* utilities.">
          <div className="flex flex-wrap gap-4">
            {ROUNDED_SAMPLES.map(({ label, className }) => (
              <div key={label} className="text-center">
                <div className={className} />
                <p className="mt-2 font-mono text-xs text-[color:var(--gray)]">{label}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Shadows" subtitle="Tailwind shadow-* utilities.">
          <div
            className="flex flex-wrap gap-6 p-6"
            style={{ backgroundColor: 'color-mix(in srgb, var(--text) 6%, var(--bg))' }}
          >
            {SHADOW_SAMPLES.map(({ label, className }) => (
              <div key={label} className="text-center">
                <div className={className} />
                <p className="mt-2 font-mono text-xs text-[color:var(--gray)]">{label}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Site CSS variables (:root)"
          subtitle="From globals.css. Toggle “Site vars” above to compare dark default vs data-theme='light'."
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ROOT_VARS.map(({ name, desc }) => (
              <div
                key={name}
                className="flex items-center gap-3 border p-3"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--bg)',
                }}
              >
                <div
                  className="h-12 w-12 shrink-0 border"
                  style={{
                    borderColor: 'var(--border)',
                    background:
                      name === '--text'
                        ? 'var(--text)'
                        : name === '--bg'
                          ? 'var(--bg)'
                          : `var(${name})`,
                  }}
                />
                <div className="min-w-0">
                  <code className="font-mono text-xs text-[color:var(--gray)]">{name}</code>
                  <p className="text-xs text-[color:var(--gray)] opacity-90">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Mini-app CSS variables (--app-*)" subtitle="Used for Tone Modulator and other /apps/* surfaces; separate from site :root.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {APP_VARS.map(({ name, desc }) => (
              <div
                key={name}
                className="flex items-center gap-3 border p-3"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg)' }}
              >
                <div
                  className="h-12 w-12 shrink-0 border"
                  style={{ borderColor: 'var(--border)', background: `var(${name})` }}
                />
                <div className="min-w-0">
                  <code className="font-mono text-xs text-[color:var(--gray)]">{name}</code>
                  <p className="text-xs text-[color:var(--gray)] opacity-90">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <footer
          className="border-t pt-8 font-mono text-xs text-[color:var(--gray)]"
          style={{ borderTopColor: 'var(--border)' }}
        >
          Route: <code className="text-[color:var(--text)] opacity-80">/dev/tailwind-showcase</code> — safe to remove or
          gate in production.
        </footer>
      </div>
    </div>
  )
}
