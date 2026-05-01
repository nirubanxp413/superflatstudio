import type { ReactNode } from 'react'

export type AppsCta = {
  label: string
  href: string
  variant?: 'primary' | 'secondary' | 'ghost'
  openInNewTab?: boolean
}

export type AppsFeatureMode = 'textLeft' | 'textRight'
export type AppsFeatureImageAlign = 'left' | 'center' | 'right'

/** HeroType-1 media area: dotted pattern or full-bleed image */
export type AppsHeroMediaBackground = 'dotted' | 'image'

export type WorksWithApp = {
  name: string
  logoSvg?: ReactNode
  logoSrc?: string
  logoAlt?: string
  href?: string
}

export type WithAndWithoutPanel = {
  title?: string
  imageSrc?: string
  imageAlt?: string
}

export type AppsStepItem = {
  stepLabel: string
  title: string
  description: string
  icon: ReactNode
}

export type AppsNavItem = {
  label: string
  href: string
}

export type SocialProofItem = {
  quote: string
  author: string
  role?: string
}

export type FeatureGridItem = {
  icon: ReactNode
  title: string
  description: string
}

export type PersonaTab = {
  id: string
  label: string
  title: string
  description: string
  bullets?: string[]
  cta?: AppsCta
}

export type FaqItem = {
  question: string
  answer: string
}

export type FeatureInteractiveGridItem = {
  id: string
  title: string
  /** Overrides `title` for screen readers when content is visual-only */
  ariaLabel?: string
  children?: ReactNode
}
