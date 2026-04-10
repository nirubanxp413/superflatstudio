import {defineField, defineType} from 'sanity'

export const textBlock = defineType({
  name: 'textBlock',
  title: 'Text',
  type: 'object',
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Text',
        subtitle: 'Rich text',
      }
    },
  },
})
