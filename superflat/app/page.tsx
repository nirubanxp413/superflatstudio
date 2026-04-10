import { HomeExperience } from '@/components/home'
import { sanityClient } from '@/lib/sanity/client'
import { allSketchesQuery, allThoughtsQuery } from '@/lib/sanity/queries'

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

export default async function HomePage() {
  const sketches = await sanityClient.fetch<HomeSketch[]>(allSketchesQuery)
  const thoughts = await sanityClient.fetch<HomeThought[]>(allThoughtsQuery)
  return <HomeExperience sketches={sketches ?? []} thoughts={thoughts ?? []} />
}
