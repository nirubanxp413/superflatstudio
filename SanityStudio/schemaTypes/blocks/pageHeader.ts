import {defineField, defineType} from 'sanity'

export const pageHeaderBlock = defineType({
  name: 'pageHeader',
  title: 'Page Header',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Optional line shown below the title',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'subtitle'},
    prepare({title, subtitle}) {
      return {
        title: title || 'Page Header',
        subtitle: subtitle || 'Title with optional subtitle',
      }
    },
  },
})
