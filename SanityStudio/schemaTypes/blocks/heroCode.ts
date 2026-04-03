import {defineField, defineType} from 'sanity'

export const heroCodeBlock = defineType({
  name: 'heroCode',
  title: 'Hero Code',
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
  ],
  preview: {
    prepare() {
      return {
        title: 'Hero Code',
        subtitle: 'Full viewport interactive code',
      }
    },
  },
})
