import { HomeExperience } from '@/components/home'
import {
  aboutLinkedInUrl,
  aboutParagraphs,
  aboutPortraitSrc,
} from '@/components/home/aboutContent'
import type { PTBlock } from '@/components/blocks/TextBlock'
import type { HomeAboutContent } from '@/components/home/HomeExperience'
import { sanityClient } from '@/lib/sanity/client'
import {
  ABOUT_STATIC_PAGE_SLUG,
  allSketchesQuery,
  allThoughtsQuery,
  staticPageBySlugQuery,
} from '@/lib/sanity/queries'

/** Regenerate the homepage from Sanity after this many seconds (production / `next start`). */
export const revalidate = 60

type HomeSketch = {
  _id: string
  title: string
  slug?: string
  shortDescription: string
  canvasHtml: string
  engine?: string
  publishedAt?: string
}

type HomeThought = {
  _id: string
  title: string
  slug?: string
  shortDescription: string
  coverImageUrl?: string
  publishedAt?: string
}

type StaticAboutDoc = {
  portraitUrl?: string | null
  portraitAlt?: string | null
  body?: PTBlock[] | null
  linkedInUrl?: string | null
} | null

function resolveAboutForHome(doc: StaticAboutDoc): HomeAboutContent {
  const hasBody = Array.isArray(doc?.body) && doc.body.length > 0
  return {
    portraitSrc: doc?.portraitUrl ?? aboutPortraitSrc,
    portraitAlt: doc?.portraitAlt?.trim() ?? '',
    bodyBlocks: hasBody ? doc!.body! : null,
    fallbackParagraphs: aboutParagraphs,
    linkedInUrl: !doc
      ? aboutLinkedInUrl.trim() || null
      : doc.linkedInUrl?.trim() || null,
  }
}

export default async function HomePage() {
  const [sketches, thoughts, staticAbout] = await Promise.all([
    sanityClient.fetch<HomeSketch[]>(allSketchesQuery),
    sanityClient.fetch<HomeThought[]>(allThoughtsQuery),
    sanityClient.fetch<StaticAboutDoc>(staticPageBySlugQuery, {
      slug: ABOUT_STATIC_PAGE_SLUG,
    }),
  ])

  const about = resolveAboutForHome(staticAbout ?? null)

  return (
    <HomeExperience
      sketches={sketches ?? []}
      thoughts={thoughts ?? []}
      about={about}
    />
  )
}
