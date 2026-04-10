import {defineField, defineType} from 'sanity'

export const heroCodeSketchBlock = defineType({
  name: 'heroCodeSketch',
  title: 'Hero Code Sketch',
  type: 'object',
  fields: [
    defineField({
      name: 'code',
      title: 'Code',
      type: 'text',
      rows: 16,
      description: 'p5.js sketch code. Use setup() and draw() or instance mode.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional label for the sketch',
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {
        title: title || 'Hero Code Sketch',
        subtitle: 'p5.js canvas — full viewport',
      }
    },
  },
})
