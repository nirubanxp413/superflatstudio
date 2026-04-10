import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { PTBlock } from '@/components/blocks/TextBlock'
import { renderPortableTextSimple } from '@/components/blocks/textBlockUtils'
import {
  ThoughtHeader,
  thoughtArticleColumnClassName,
} from '@/components/thought/ThoughtHeader'
import { Button } from '@/components/ui'
import {
  allThoughtSlugsQuery,
  thoughtBySlugQuery,
} from '@/lib/sanity/queries'
import { sanityClient } from '@/lib/sanity/client'

type ThoughtImageBlock = {
  _key?: string
  _type: 'image'
  url?: string
  alt?: string
}

type ThoughtContentItem = PTBlock | ThoughtImageBlock

type ThoughtDoc = {
  title: string
  shortDescription?: string | null
  publishedAt?: string | null
  content?: ThoughtContentItem[] | null
  coverImageUrl?: string | null
} | null

async function getThought(slug: string): Promise<ThoughtDoc> {
  return sanityClient.fetch(thoughtBySlugQuery, { slug })
}

function renderThoughtContent(items: ThoughtContentItem[]) {
  return items.map((item, idx) => {
    if (item._type === 'image') {
      if (!item.url) return null
      return (
        <figure key={item._key ?? `img-${idx}`} className="my-08">
          <img src={item.url} alt={item.alt ?? ''} className="w-full h-auto" />
        </figure>
      )
    }
    return (
      <div key={item._key ?? `pt-${idx}`} className="my-02">
        {renderPortableTextSimple([item])}
      </div>
    )
  })
}

export async function generateStaticParams() {
  const rows: { slug: string }[] = await sanityClient.fetch(
    allThoughtSlugsQuery,
  )
  return rows.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const { slug } = params
  const doc = await getThought(slug)
  if (!doc) {
    return { title: 'Thought' }
  }
  const title = doc.title
  const description = doc.shortDescription ?? undefined
  const images = doc.coverImageUrl ? [doc.coverImageUrl] : undefined
  return {
    title: `${title} — Thought`,
    description,
    openGraph: {
      title,
      description,
      images,
      type: 'article',
    },
  }
}

export default async function ThoughtPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params
  const doc = await getThought(slug)
  if (!doc || !doc.title) {
    notFound()
  }

  const publishedAt = doc.publishedAt ?? new Date().toISOString()
  const contentItems = doc.content ?? []

  return (
    <article className="pb-14">
      <ThoughtHeader
        title={doc.title}
        publishedAt={publishedAt}
        description={doc.shortDescription}
      />

      <div className={`${thoughtArticleColumnClassName} pb-10`}>
        <div className="max-w-[65ch]">
          {renderThoughtContent(contentItems)}
        </div>
      </div>

      <div className={thoughtArticleColumnClassName}>
        <div className="pt-06 border-t border-border-subtle">
          <Button as={Link} href="/#thought" scroll={false} variant="ghost" size="sm">
            ← Back to Thought
          </Button>
        </div>
      </div>
    </article>
  )
}
