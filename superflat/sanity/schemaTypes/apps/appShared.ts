import {defineField, defineType} from 'sanity'

export const appsCtaType = defineType({
  name: 'appsCta',
  title: 'CTA',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL or path',
      type: 'string',
      description: 'e.g. /store/other-product or https://example.com',
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (typeof value !== 'string' || !value.trim()) return 'Required'
          const v = value.trim()
          if (v.startsWith('/') || v.startsWith('#')) return true
          try {
            // eslint-disable-next-line no-new
            new URL(v)
            return true
          } catch {
            return 'Use a full URL or a path starting with /'
          }
        }),
    }),
    defineField({
      name: 'variant',
      title: 'Style',
      type: 'string',
      initialValue: 'primary',
      options: {
        list: [
          {title: 'Primary', value: 'primary'},
          {title: 'Secondary', value: 'secondary'},
          {title: 'Ghost', value: 'ghost'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})

export const appsNavLinkType = defineType({
  name: 'appsNavLink',
  title: 'Nav link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL or path',
      type: 'string',
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (typeof value !== 'string' || !value.trim()) return 'Required'
          const v = value.trim()
          if (v.startsWith('/') || v.startsWith('#')) return true
          try {
            // eslint-disable-next-line no-new
            new URL(v)
            return true
          } catch {
            return 'Use a full URL or a path starting with /'
          }
        }),
    }),
  ],
})
