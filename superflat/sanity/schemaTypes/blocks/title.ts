import {defineField, defineType} from 'sanity'

export const titleBlock = defineType({
  name: 'titleBlock',
  title: 'Title',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {
        title: title || 'Title',
        subtitle: 'Left-aligned title',
      }
    },
  },
})
