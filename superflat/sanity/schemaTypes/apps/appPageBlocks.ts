import {defineArrayMember, defineField, defineType} from 'sanity'

const iconList = [
  {title: 'Sparkle', value: 'sparkle'},
  {title: 'Zap', value: 'zap'},
  {title: 'Check', value: 'check'},
  {title: 'Arrow right', value: 'arrowRight'},
  {title: 'Layers', value: 'layers'},
  {title: 'Shield', value: 'shield'},
] as const

export const appBlockHeroType1 = defineType({
  name: 'appBlockHeroType1',
  title: 'Hero (Type 1)',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'text', rows: 3}),
    defineField({name: 'cta', title: 'CTA', type: 'appsCta'}),
    defineField({
      name: 'mediaBackground',
      title: 'Media background',
      type: 'string',
      initialValue: 'dotted',
      options: {
        list: [
          {title: 'Dotted', value: 'dotted'},
          {title: 'Image', value: 'image'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'heroBackgroundImage',
      title: 'Hero background image',
      type: 'image',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.mediaBackground !== 'image',
    }),
    defineField({
      name: 'screenshot',
      title: 'Screenshot (rounded + drop shadow in layout)',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'screenshotAlt',
      title: 'Screenshot alt text',
      type: 'string',
      description:
        'Describe the screenshot for assistive tech when it carries meaning.',
    }),
    defineField({
      name: 'imageFit',
      title: 'Screenshot fit',
      type: 'string',
      initialValue: 'contain',
      options: {
        list: [
          {title: 'Contain', value: 'contain'},
          {title: 'Cover', value: 'cover'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'mediaHeightVh',
      title: 'Media height (vh, max 70 in UI)',
      type: 'number',
      initialValue: 70,
      validation: (Rule) => Rule.min(20).max(100),
    }),
  ],
  preview: {prepare: () => ({title: 'Hero (Type 1)'})},
})

export const appBlockNavbarHeader = defineType({
  name: 'appBlockNavbarHeader',
  title: 'Navbar header',
  type: 'object',
  fields: [
    defineField({
      name: 'brand',
      title: 'Brand label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'navItems',
      title: 'Nav links',
      type: 'array',
      of: [defineArrayMember({type: 'appsNavLink'})],
    }),
    defineField({name: 'cta', title: 'CTA', type: 'appsCta'}),
  ],
  preview: {prepare: () => ({title: 'Navbar header'})},
})

export const appBlockFeatureSection = defineType({
  name: 'appBlockFeatureSection',
  title: 'Feature section',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'paragraph',
      title: 'Body',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mode',
      title: 'Text / media order (desktop)',
      type: 'string',
      initialValue: 'textLeft',
      options: {
        list: [
          {title: 'Text left, media right', value: 'textLeft'},
          {title: 'Text right, media left', value: 'textRight'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'image',
      title: 'Image in dotted area',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'imageAlt',
      title: 'Image alt',
      type: 'string',
    }),
    defineField({
      name: 'imageAlign',
      title: 'Image align',
      type: 'string',
      initialValue: 'center',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
      },
    }),
    defineField({name: 'cta', title: 'CTA', type: 'appsCta'}),
  ],
  preview: {prepare: () => ({title: 'Feature section'})},
})

export const appBlockWithAndWithout = defineType({
  name: 'appBlockWithAndWithout',
  title: 'With / without',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({
      name: 'leftTitle',
      title: 'Left panel title',
      type: 'string',
    }),
    defineField({
      name: 'leftImage',
      title: 'Left image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({name: 'leftImageAlt', title: 'Left image alt', type: 'string'}),
    defineField({
      name: 'rightTitle',
      title: 'Right panel title',
      type: 'string',
    }),
    defineField({
      name: 'rightImage',
      title: 'Right image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({name: 'rightImageAlt', title: 'Right image alt', type: 'string'}),
  ],
  preview: {prepare: () => ({title: 'With / without'})},
})

export const appBlockSteps = defineType({
  name: 'appBlockSteps',
  title: 'Steps (3 cards)',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      validation: (Rule) =>
        Rule.required().min(3).max(3).error('Add exactly three steps.'),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'stepLabel',
              title: 'Step label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {list: [...iconList], layout: 'dropdown'},
              initialValue: 'sparkle',
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {t: 'title', s: 'stepLabel'},
            prepare({t, s}) {
              return {title: t || 'Step', subtitle: s}
            },
          },
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Steps'})},
})

export const appBlockWorksWith = defineType({
  name: 'appBlockWorksWith',
  title: 'Works with',
  type: 'object',
  fields: [
    defineField({
      name: 'lead',
      title: 'Lead line',
      type: 'string',
      initialValue: 'Works with',
    }),
    defineField({
      name: 'variant',
      title: 'Layout',
      type: 'string',
      initialValue: 'wordmarkRow',
      options: {
        list: [
          {title: 'Wordmark row', value: 'wordmarkRow'},
          {title: 'Image squares', value: 'imageSquares'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'tiles',
      title: 'Tiles',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({name: 'href', title: 'Link (optional)', type: 'string'}),
            defineField({
              name: 'logo',
              title: 'Logo image (optional)',
              type: 'image',
              options: {hotspot: true},
            }),
            defineField({
              name: 'logoAlt',
              title: 'Logo alt',
              type: 'string',
            }),
          ],
          preview: {
            select: {n: 'name'},
            prepare({n}) {
              return {title: n || 'Tile'}
            },
          },
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Works with'})},
})

export const appBlockFeatureGrid = defineType({
  name: 'appBlockFeatureGrid',
  title: 'Feature grid',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Features',
      type: 'array',
      validation: (Rule) => Rule.required().min(1).max(12),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {list: [...iconList], layout: 'dropdown'},
              initialValue: 'sparkle',
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {t: 'title'},
            prepare({t}) {
              return {title: t || 'Feature'}
            },
          },
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Feature grid'})},
})

export const appBlockFeatureInteractiveGrid = defineType({
  name: 'appBlockFeatureInteractiveGrid',
  title: 'Feature interactive grid',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title (left)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description (right)',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'defaultSelectedIndex',
      title: 'Default selected column',
      type: 'number',
      options: {
        list: [
          {title: '1', value: 0},
          {title: '2', value: 1},
          {title: '3', value: 2},
        ],
      },
      initialValue: 0,
    }),
    defineField({
      name: 'columns',
      title: 'Columns (exactly 3)',
      type: 'array',
      validation: (Rule) =>
        Rule.required().min(3).max(3).error('Add exactly three columns.'),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'id',
              title: 'Id (stable key)',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'ariaLabel',
              title: 'Accessible label override',
              type: 'string',
            }),
            defineField({
              name: 'body',
              title: 'Body (shown when column active)',
              type: 'text',
              rows: 4,
            }),
          ],
          preview: {
            select: {t: 'title', id: 'id'},
            prepare({t, id}) {
              return {title: t || id || 'Column'}
            },
          },
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Feature interactive grid'})},
})

export const appBlockSocialProof = defineType({
  name: 'appBlockSocialProof',
  title: 'Social proof',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Testimonials',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'quote',
              title: 'Quote',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'author',
              title: 'Author',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({name: 'role', title: 'Role', type: 'string'}),
          ],
          preview: {
            select: {author: 'author', quote: 'quote'},
            prepare({author, quote}) {
              return {
                title: author || 'Testimonial',
                subtitle: quote ? `${quote.slice(0, 60)}…` : undefined,
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Social proof'})},
})

export const appBlockUseCasePersona = defineType({
  name: 'appBlockUseCasePersona',
  title: 'Use case personas',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tabs',
      title: 'Personas (tabs)',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'id',
              title: 'Id',
              description: 'Stable id for client state.',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Tab label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'bullets',
              title: 'Bullets',
              type: 'array',
              of: [defineArrayMember({type: 'string'})],
            }),
            defineField({name: 'cta', title: 'CTA', type: 'appsCta'}),
          ],
          preview: {
            select: {l: 'label', t: 'title'},
            prepare({l, t}) {
              return {title: l || t || 'Persona'}
            },
          },
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Use case personas'})},
})

export const appBlockFaqAccordion = defineType({
  name: 'appBlockFaqAccordion',
  title: 'FAQ accordion',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {q: 'question'},
            prepare({q}) {
              return {title: q || 'FAQ item'}
            },
          },
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'FAQ accordion'})},
})

export const appBlockFinalConversionBand = defineType({
  name: 'appBlockFinalConversionBand',
  title: 'Final conversion band',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'description', title: 'Copy', type: 'text', rows: 4}),
    defineField({
      name: 'primaryCta',
      title: 'Primary CTA',
      type: 'appsCta',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'secondaryCta', title: 'Secondary CTA', type: 'appsCta'}),
  ],
  preview: {prepare: () => ({title: 'Final conversion band'})},
})

export const appBlockFooterCta = defineType({
  name: 'appBlockFooterCta',
  title: 'Footer CTA',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cta',
      title: 'CTA',
      type: 'appsCta',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {prepare: () => ({title: 'Footer CTA'})},
})

export const appPageBlockTypes = [
  appBlockHeroType1,
  appBlockNavbarHeader,
  appBlockFeatureSection,
  appBlockWithAndWithout,
  appBlockSteps,
  appBlockWorksWith,
  appBlockFeatureGrid,
  appBlockFeatureInteractiveGrid,
  appBlockSocialProof,
  appBlockUseCasePersona,
  appBlockFaqAccordion,
  appBlockFinalConversionBand,
  appBlockFooterCta,
]
