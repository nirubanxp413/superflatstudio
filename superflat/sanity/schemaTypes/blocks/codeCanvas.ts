import {defineField, defineType} from 'sanity'

export const codeCanvasBlock = defineType({
  name: 'codeCanvas',
  title: 'Code Canvas',
  type: 'object',
  fields: [
    defineField({
      name: 'code',
      title: 'Code',
      type: 'text',
      rows: 12,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          {title: 'JavaScript', value: 'javascript'},
          {title: 'TypeScript', value: 'typescript'},
          {title: 'Python', value: 'python'},
          {title: 'HTML', value: 'html'},
          {title: 'CSS', value: 'css'},
          {title: 'JSON', value: 'json'},
          {title: 'Shell', value: 'shell'},
          {title: 'Other', value: 'plaintext'},
        ],
      },
      initialValue: 'javascript',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional label, e.g. filename',
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {
        title: title || 'Code Canvas',
        subtitle: 'Interactive code canvas',
      }
    },
  },
})
