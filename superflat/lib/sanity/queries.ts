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
