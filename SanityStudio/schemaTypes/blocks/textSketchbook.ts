import {defineField, defineType} from 'sanity'

export const textSketchbookBlock = defineType({
  name: 'textSketchbook',
  title: 'Text Sketchbook',
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
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      description: 'Images appear at random positions around the text',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Text Sketchbook',
        subtitle: 'Text with images at random positions',
      }
    },
  },
})
