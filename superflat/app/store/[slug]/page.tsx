import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { StoreSanityBlocks } from '@/components/apps/StoreSanityBlocks'
import { storeProductBySlugQuery, storeProductSlugsQuery } from '@/lib/sanity/queries'
import { sanityClient } from '@/lib/sanity/client'

export const revalidate = 60

type StoreProductDoc = {
  title?: string | null
  seoTitle?: string | null
  slug?: string | null
  description?: string | null
  blocks?: unknown[] | null
} | null

async function getStoreProduct(slug: string): Promise<StoreProductDoc> {
  return sanityClient.fetch<StoreProductDoc>(storeProductBySlugQuery, {slug})
}

export async function generateStaticParams() {
  const rows =
    (await sanityClient.fetch<{slug: string}[]>(storeProductSlugsQuery)) ?? []
  return rows.filter((r) => r.slug).map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const doc = await getStoreProduct(params.slug)
  if (!doc?.title) {
    return { title: 'Product' }
  }
  const headline = typeof doc.seoTitle === 'string' && doc.seoTitle.trim()
    ? doc.seoTitle.trim()
    : doc.title
  const description =
    typeof doc.description === 'string' && doc.description.trim()
      ? doc.description.trim()
      : undefined
  return {
    title: `${headline} — Store`,
    description,
  }
}

export default async function StoreProductPage({
  params,
}: {
  params: { slug: string }
}) {
  const doc = await getStoreProduct(params.slug)
  if (!doc?.title || !doc.slug) {
    notFound()
  }

  return (
    <>
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center gap-03 px-05 py-03 text-body-sm text-neutral-700">
          <Link href="/" className="hover:text-neutral-950">
            Home
          </Link>
          <span className="text-neutral-400" aria-hidden>
            /
          </span>
          <Link href="/store" className="hover:text-neutral-950">
            Store
          </Link>
          <span className="text-neutral-400" aria-hidden>
            /
          </span>
          <span className="truncate text-neutral-950">{doc.title}</span>
        </nav>
      </div>

      <StoreSanityBlocks blocks={doc.blocks ?? []} />
    </>
  )
}
