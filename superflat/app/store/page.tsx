import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityClient } from '@/lib/sanity/client'
import { storeProductsListQuery } from '@/lib/sanity/queries'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Store — Superflat Studio',
  description: 'Digital products — landing pages CMS-built per product.',
}

type ProductRow = {
  title?: string | null
  slug?: string | null
  description?: string | null
  thumbnailUrl?: string | null
}

export default async function StoreIndexPage() {
  const rows =
    (await sanityClient.fetch<ProductRow[]>(storeProductsListQuery)) ?? []

  const list = rows.filter(
    (a): a is ProductRow & { slug: string; title: string } =>
      Boolean(a.slug && a.title && String(a.slug).trim() && String(a.title).trim())
  )

  return (
    <main className="mx-auto max-w-3xl px-06 py-10">
      <p className="text-body-sm text-neutral-600">
        <Link href="/" className="underline-offset-4 hover:underline">
          Home
        </Link>
      </p>
      <h1 className="mt-04 text-3xl font-semibold text-neutral-950">Store</h1>
      <p className="mt-03 text-neutral-600">
        Each product has a CMS-built page at{' '}
        <code className="rounded bg-gray-100 px-02 py-01 text-body-sm">
          /store/&lt;slug&gt;
        </code>
        .
      </p>

      {list.length === 0 ? (
        <p className="mt-08 rounded-md bg-gray-100 p-05 text-neutral-700">
          No products yet. Create a{' '}
          <strong className="font-medium">Product</strong> document in Sanity
          Studio (Content → Store).
        </p>
      ) : (
        <ul className="mt-08 grid gap-04 sm:grid-cols-2">
          {list.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/store/${encodeURIComponent(p.slug)}`}
                className="flex flex-col rounded-md border border-gray-200 bg-white p-04 transition-colors hover:bg-gray-50"
              >
                {p.thumbnailUrl ? (
                  <div className="relative mb-03 aspect-video w-full overflow-hidden rounded-md bg-gray-100">
                    {/* Sanity CDN thumbnails */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.thumbnailUrl}
                      alt=""
                      className="h-full w-full object-cover"
                      width={640}
                      height={360}
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="mb-03 aspect-video w-full rounded-md bg-gray-100" />
                )}
                <span className="text-body font-semibold text-neutral-950">
                  {p.title}
                </span>
                {p.description ? (
                  <span className="mt-02 line-clamp-3 text-body-sm text-neutral-600">
                    {p.description}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
