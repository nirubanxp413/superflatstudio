import type { ReactNode } from 'react'
import { AppsBlockIcon } from './AppsBlockIcon'
import {
  FaqAccordion,
  FeatureGrid,
  FeatureInteractiveGrid,
  FeatureSection,
  FinalConversionBand,
  FooterCta,
  HeroType1,
  NavbarHeader,
  SocialProof,
  Steps,
  UseCasePersona,
  WithAndWithout,
  WorksWith,
} from '@/components/apps'
import type {
  AppsCta,
  AppsHeroMediaBackground,
  AppsNavItem,
  FaqItem,
  FeatureGridItem,
  FeatureInteractiveGridItem,
  PersonaTab,
  SocialProofItem,
  WithAndWithoutPanel,
  WorksWithApp,
} from '@/components/apps/types'

function toCta(raw: unknown): AppsCta | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const o = raw as Record<string, unknown>
  if (typeof o.label !== 'string' || typeof o.href !== 'string') return undefined
  const variant = o.variant
  return {
    label: o.label,
    href: o.href,
    variant:
      variant === 'secondary' || variant === 'ghost' ? variant : 'primary',
    openInNewTab: Boolean(o.openInNewTab),
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

function randomId(): string {
  const g = globalThis as { crypto?: Crypto }
  const id = g.crypto?.randomUUID?.()
  if (id) return id
  return `tab-${Math.random().toString(36).slice(2, 11)}`
}

function renderInteractiveBody(text: unknown): ReactNode {
  if (typeof text !== 'string' || !text.trim()) return undefined
  return (
    <p className="text-sm leading-relaxed whitespace-pre-wrap">{text.trim()}</p>
  )
}

/** Renders CMS-driven product landing sections from a Sanity `appPage.blocks` array. */
export function StoreSanityBlocks({ blocks }: { blocks: unknown }) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null

  const nodes: React.ReactNode[] = []

  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i]
    if (!isRecord(block)) continue
    const key = (typeof block._key === 'string' && block._key) || `app-block-${i}`
    const _type = block._type

    switch (_type) {
      case 'appBlockHeroType1': {
        const title = block.title
        if (typeof title !== 'string' || !title.trim()) break
        const mediaBackground =
          block.mediaBackground === 'image' ? 'image' : 'dotted'
        const imageFit =
          block.imageFit === 'cover' || block.imageFit === 'contain'
            ? block.imageFit
            : 'contain'
        const mediaHeightVh =
          typeof block.mediaHeightVh === 'number' && !Number.isNaN(block.mediaHeightVh)
            ? block.mediaHeightVh
            : 70
        const screenshotUrl =
          typeof block.screenshotUrl === 'string' ? block.screenshotUrl : undefined
        const heroBgUrl =
          typeof block.heroBackgroundImageUrl === 'string'
            ? block.heroBackgroundImageUrl
            : undefined

        nodes.push(
          <HeroType1
            key={key}
            title={title}
            subtitle={typeof block.subtitle === 'string' ? block.subtitle : undefined}
            cta={toCta(block.cta)}
            mediaBackground={mediaBackground as AppsHeroMediaBackground}
            heroBackgroundImageSrc={
              mediaBackground === 'image' ? heroBgUrl : undefined
            }
            imageSrc={screenshotUrl}
            imageAlt={
              typeof block.screenshotAlt === 'string'
                ? block.screenshotAlt
                : ''
            }
            imageFit={imageFit}
            mediaHeightVh={mediaHeightVh}
          />
        )
        break
      }
      case 'appBlockNavbarHeader': {
        const brand = block.brand
        if (typeof brand !== 'string' || !brand.trim()) break
        const rawNav = block.navItems
        const navItems: AppsNavItem[] = Array.isArray(rawNav)
          ? rawNav
              .filter(isRecord)
              .map((n) => ({
                label: typeof n.label === 'string' ? n.label : '',
                href: typeof n.href === 'string' ? n.href : '#',
              }))
              .filter((n) => n.label && n.href)
          : []
        nodes.push(
          <NavbarHeader
            key={key}
            brand={brand}
            navItems={navItems}
            cta={toCta(block.cta)}
          />
        )
        break
      }
      case 'appBlockFeatureSection': {
        const title = block.title
        const paragraph = block.paragraph
        if (typeof title !== 'string' || typeof paragraph !== 'string') break
        const mode =
          block.mode === 'textRight' || block.mode === 'textLeft'
            ? block.mode
            : 'textLeft'
        const imageAlign =
          block.imageAlign === 'left' ||
          block.imageAlign === 'center' ||
          block.imageAlign === 'right'
            ? block.imageAlign
            : 'center'
        const imageUrl =
          typeof block.imageUrl === 'string' ? block.imageUrl : undefined
        const showCta = block.showCta !== false
        const showHeadingIcon = block.showHeadingIcon === true
        const headingIcon =
          typeof block.headingIcon === 'string' ? block.headingIcon : 'sparkle'
        nodes.push(
          <FeatureSection
            key={key}
            title={title}
            paragraph={paragraph}
            mode={mode}
            imageSrc={imageUrl}
            imageAlt={
              typeof block.imageAlt === 'string' ? block.imageAlt : undefined
            }
            imageAlign={imageAlign}
            showCta={showCta}
            showHeadingIcon={showHeadingIcon}
            headingIcon={headingIcon}
            cta={toCta(block.cta)}
          />
        )
        break
      }
      case 'appBlockWithAndWithout': {
        const title = block.title
        if (typeof title !== 'string') break
        const left: WithAndWithoutPanel = {
          title:
            typeof block.leftTitle === 'string' ? block.leftTitle : undefined,
          imageSrc:
            typeof block.leftImageUrl === 'string'
              ? block.leftImageUrl
              : undefined,
          imageAlt:
            typeof block.leftImageAlt === 'string'
              ? block.leftImageAlt
              : undefined,
        }
        const right: WithAndWithoutPanel = {
          title:
            typeof block.rightTitle === 'string' ? block.rightTitle : undefined,
          imageSrc:
            typeof block.rightImageUrl === 'string'
              ? block.rightImageUrl
              : undefined,
          imageAlt:
            typeof block.rightImageAlt === 'string'
              ? block.rightImageAlt
              : undefined,
        }
        nodes.push(
          <WithAndWithout
            key={key}
            title={title}
            description={
              typeof block.description === 'string' ? block.description : undefined
            }
            left={left}
            right={right}
          />
        )
        break
      }
      case 'appBlockSteps': {
        const title = block.title
        const rawSteps = block.steps
        if (typeof title !== 'string' || !Array.isArray(rawSteps)) break
        const steps = rawSteps.filter(isRecord).map((s) => ({
          stepLabel:
            typeof s.stepLabel === 'string' ? s.stepLabel : `Step`,
          title: typeof s.title === 'string' ? s.title : 'Untitled',
          description: typeof s.body === 'string' ? s.body : '',
          icon: (
            <AppsBlockIcon name={typeof s.icon === 'string' ? s.icon : 'sparkle'} />
          ),
        }))
        nodes.push(<Steps key={key} title={title} steps={steps} />)
        break
      }
      case 'appBlockWorksWith': {
        const rawTiles = block.tiles
        const rawVariant = block.variant
        const variant =
          rawVariant === 'imageSquares'
            ? 'imageSquares'
            : rawVariant === 'icons'
              ? 'icons'
              : 'text'
        const tiles: WorksWithApp[] = Array.isArray(rawTiles)
          ? rawTiles.filter(isRecord).map((t) => {
              const name = typeof t.name === 'string' ? t.name : 'Partner'
              const href =
                typeof t.href === 'string' && t.href.trim()
                  ? t.href.trim()
                  : undefined
              const logoSrc =
                typeof t.logoUrl === 'string' && t.logoUrl ? t.logoUrl : undefined
              const iconSvgSrc =
                typeof t.iconSvgUrl === 'string' && t.iconSvgUrl
                  ? t.iconSvgUrl
                  : undefined
              const logoAlt =
                typeof t.logoAlt === 'string' ? t.logoAlt : undefined
              return {name, href, logoSrc, iconSvgSrc, logoAlt}
            })
          : []
        const lead =
          typeof block.lead === 'string' && block.lead.trim()
            ? block.lead.trim()
            : 'Works with'
        nodes.push(
          <WorksWith
            key={key}
            lead={lead}
            apps={tiles}
            variant={variant}
          />
        )
        break
      }
      case 'appBlockFeatureGrid': {
        const title = block.title
        const rawItems = block.items
        if (typeof title !== 'string' || !Array.isArray(rawItems)) break
        const items: FeatureGridItem[] = rawItems.filter(isRecord).map((it) => ({
          icon: (
            <AppsBlockIcon name={typeof it.icon === 'string' ? it.icon : 'sparkle'} />
          ),
          title: typeof it.title === 'string' ? it.title : 'Feature',
          description:
            typeof it.description === 'string' ? it.description : '',
        }))
        nodes.push(<FeatureGrid key={key} title={title} items={items} />)
        break
      }
      case 'appBlockFeatureInteractiveGrid': {
        const title = block.title
        const description = block.description
        if (typeof title !== 'string' || typeof description !== 'string') break
        const cols = Array.isArray(block.columns) ? block.columns.filter(isRecord) : []
        if (cols.length !== 3) break
        const defaultIdxRaw = Number(block.defaultSelectedIndex)
        const defaultSelectedIndex =
          defaultIdxRaw === 1 ? 1 : defaultIdxRaw === 2 ? 2 : 0
        const items = cols.map((c, idx) => {
          const item: FeatureInteractiveGridItem = {
            id:
              typeof c.id === 'string' && c.id.trim()
                ? c.id.trim()
                : `column-${idx + 1}`,
            title: typeof c.title === 'string' ? c.title : `Panel ${idx + 1}`,
            ariaLabel:
              typeof c.ariaLabel === 'string' && c.ariaLabel.trim()
                ? c.ariaLabel.trim()
                : undefined,
            children: renderInteractiveBody(c.body),
          }
          return item
        }) as [FeatureInteractiveGridItem, FeatureInteractiveGridItem, FeatureInteractiveGridItem]

        nodes.push(
          <FeatureInteractiveGrid
            key={key}
            title={title}
            description={description}
            items={items}
            defaultSelectedIndex={defaultSelectedIndex}
          />
        )
        break
      }
      case 'appBlockSocialProof': {
        const title = block.title
        const rawItems = block.items
        if (typeof title !== 'string' || !Array.isArray(rawItems)) break
        const items: SocialProofItem[] = rawItems.filter(isRecord).map((it) => ({
          quote: typeof it.quote === 'string' ? it.quote : '',
          author: typeof it.author === 'string' ? it.author : '',
          role: typeof it.role === 'string' ? it.role : undefined,
        }))
        nodes.push(<SocialProof key={key} title={title} items={items} />)
        break
      }
      case 'appBlockUseCasePersona': {
        const title = block.title
        const rawTabs = block.tabs
        if (typeof title !== 'string' || !Array.isArray(rawTabs)) break
        const tabs: PersonaTab[] = rawTabs.filter(isRecord).map((tab) => {
          const bulletsRaw = tab.bullets
          const bullets = Array.isArray(bulletsRaw)
            ? bulletsRaw.filter((b): b is string => typeof b === 'string')
            : []
          const id =
            typeof tab.id === 'string' && tab.id.trim()
              ? tab.id.trim()
              : randomId()
          return {
            id,
            label: typeof tab.label === 'string' ? tab.label : id,
            title: typeof tab.title === 'string' ? tab.title : 'Untitled',
            description:
              typeof tab.description === 'string' ? tab.description : '',
            bullets: bullets.length ? bullets : undefined,
            cta: toCta(tab.cta),
          }
        })
        if (!tabs.length) break
        nodes.push(<UseCasePersona key={key} title={title} tabs={tabs} />)
        break
      }
      case 'appBlockFaqAccordion': {
        const title = block.title
        const rawItems = block.items
        if (typeof title !== 'string' || !Array.isArray(rawItems)) break
        const items: FaqItem[] = rawItems.filter(isRecord).map((it) => ({
          question:
            typeof it.question === 'string' ? it.question : 'Question',
          answer: typeof it.answer === 'string' ? it.answer : '',
        }))
        nodes.push(<FaqAccordion key={key} title={title} items={items} />)
        break
      }
      case 'appBlockFinalConversionBand': {
        const title = block.title
        const primary = toCta(block.primaryCta)
        if (typeof title !== 'string' || !primary) break
        nodes.push(
          <FinalConversionBand
            key={key}
            title={title}
            description={
              typeof block.description === 'string'
                ? block.description
                : undefined
            }
            primaryCta={primary}
            secondaryCta={toCta(block.secondaryCta)}
          />
        )
        break
      }
      case 'appBlockFooterCta': {
        const title = block.title
        const cta = toCta(block.cta)
        if (typeof title !== 'string' || !cta) break
        nodes.push(<FooterCta key={key} title={title} cta={cta} />)
        break
      }
      default:
        break
    }
  }

  return <div className="text-neutral-950">{nodes}</div>
}
