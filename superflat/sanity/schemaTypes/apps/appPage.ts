import {defineArrayMember, defineField, defineType} from 'sanity'

export const appPageType = defineType({
  name: 'appPage',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'URL: /store/[slug]',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 3,
      description: 'Shown on the Store index.',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title override',
      type: 'string',
      description: 'Optional. Defaults to Title.',
    }),
    defineField({
      name: 'blocks',
      title: 'Page sections',
      type: 'array',
      description: 'Build the landing page from sections (order matters).',
      of: [
        defineArrayMember({type: 'appBlockHeroType1'}),
        defineArrayMember({type: 'appBlockNavbarHeader'}),
        defineArrayMember({type: 'appBlockFeatureSection'}),
        defineArrayMember({type: 'appBlockWithAndWithout'}),
        defineArrayMember({type: 'appBlockSteps'}),
        defineArrayMember({type: 'appBlockWorksWith'}),
        defineArrayMember({type: 'appBlockFeatureGrid'}),
        defineArrayMember({type: 'appBlockFeatureInteractiveGrid'}),
        defineArrayMember({type: 'appBlockSocialProof'}),
        defineArrayMember({type: 'appBlockUseCasePersona'}),
        defineArrayMember({type: 'appBlockFaqAccordion'}),
        defineArrayMember({type: 'appBlockFinalConversionBand'}),
        defineArrayMember({type: 'appBlockFooterCta'}),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Published (newest)',
      name: 'publishedDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      media: 'thumbnail',
    },
    prepare({title, slug, media}) {
      return {
        title: title || 'Untitled product',
        subtitle: slug ? `/store/${slug}` : 'No slug',
        media,
      }
    },
  },
})
