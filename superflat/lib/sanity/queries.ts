/**
 * Longform thought entries are `project` documents with `type == "longform"`.
 * `pageContent` projections resolve image assets for the block renderer.
 */
export const longformBySlugQuery = `
*[_type == "project" && slug.current == $slug && type == "longform"][0] {
  _id,
  title,
  "slug": slug.current,
  description,
  type,
  "publishedAt": coalesce(publishedAt, _updatedAt),
  mainImage {
    asset->{url, metadata},
    hotspot,
    crop
  },
  "mainImageUrl": mainImage.asset->url,
  pageContent[] {
    ...,
    _type == "heroImage" => {
      "image": {"url": image.asset->url, "asset": image.asset->{url}}
    },
    _type == "imageBlock" => {
      caption,
      "image": {"url": image.asset->url, "asset": image.asset->{url}}
    },
    _type == "thinkingGallery" => {
      _key,
      _type,
      heading,
      body,
      images[] {
        size,
        "image": {"url": image.asset->url, "asset": image.asset->{url}}
      }
    }
  }
}
`

export const allLongformSlugsQuery = `
*[_type == "project" && type == "longform" && defined(slug.current)] {
  "slug": slug.current
}
`

export const allSketchesQuery = `
*[_type == "sketch"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  canvasHtml,
  engine,
  publishedAt
}
`

export const allThoughtsQuery = `
*[_type == "thought"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  "coverImageUrl": coverImage.asset->url,
  publishedAt
}
`

export const thoughtBySlugQuery = `
*[_type == "thought" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  "publishedAt": coalesce(publishedAt, _updatedAt),
  "coverImageUrl": coverImage.asset->url,
  content[] {
    ...,
    _type == "image" => {
      ...,
      "url": asset->url,
      "alt": coalesce(alt, "")
    }
  }
}
`

export const allThoughtSlugsQuery = `
*[_type == "thought" && defined(slug.current)] {
  "slug": slug.current
}
`

/** Older / newer neighbors by publish time (chronological previous & next). */
export const thoughtNeighborsQuery = `
{
  "prev": *[_type == "thought" && coalesce(publishedAt, _updatedAt) < $publishedAt] | order(coalesce(publishedAt, _updatedAt) desc)[0] {
    title,
    "slug": slug.current
  },
  "next": *[_type == "thought" && coalesce(publishedAt, _updatedAt) > $publishedAt] | order(coalesce(publishedAt, _updatedAt) asc)[0] {
    title,
    "slug": slug.current
  }
}
`

/** Slug for the homepage About overlay document in Sanity (Static page). */
export const ABOUT_STATIC_PAGE_SLUG = 'about-me'

/** Homepage About overlay — create a Static page with slug \`about-me\`. */
export const staticPageBySlugQuery = `
*[_type == "staticPage" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  "portraitUrl": portrait.asset->url,
  portraitAlt,
  body,
  linkedInUrl
}
`

export const storeProductsListQuery = `
*[_type == "appPage" && defined(slug.current)] | order(coalesce(publishedAt, _updatedAt) desc) {
  title,
  "slug": slug.current,
  description,
  "thumbnailUrl": thumbnail.asset->url
}
`

export const storeProductSlugsQuery = `
*[_type == "appPage" && defined(slug.current)] {
  "slug": slug.current
}
`

export const storeProductBySlugQuery = `
*[_type == "appPage" && slug.current == $slug][0] {
  _id,
  title,
  seoTitle,
  description,
  "slug": slug.current,
  "publishedAt": coalesce(publishedAt, _updatedAt),
  "thumbnailUrl": thumbnail.asset->url,
  blocks[] {
    ...,
    _type == "appBlockHeroType1" => {
      "heroBackgroundImageUrl": heroBackgroundImage.asset->url,
      "screenshotUrl": screenshot.asset->url
    },
    _type == "appBlockFeatureSection" => {
      "imageUrl": image.asset->url
    },
    _type == "appBlockWithAndWithout" => {
      "leftImageUrl": leftImage.asset->url,
      "rightImageUrl": rightImage.asset->url
    },
    _type == "appBlockWorksWith" => {
      lead,
      variant,
      tiles[] {
        name,
        href,
        logoAlt,
        "logoUrl": logo.asset->url
      }
    }
  }
}
`
