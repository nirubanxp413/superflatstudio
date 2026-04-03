import {defineField, defineType} from 'sanity'

export const thinkingBlock = defineType({
  name: 'thinking',
  title: 'Thinking',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'e.g. Process note, Reflection',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {label: 'label'},
    prepare({label}) {
      return {
        title: label || 'Thinking',
        subtitle: 'Process note / reflection',
      }
    },
  },
})
