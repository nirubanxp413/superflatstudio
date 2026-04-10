import {defineField, defineType} from 'sanity'

export const heroImageBlock = defineType({
  name: 'heroImage',
  title: 'Hero Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {media: 'image'},
    prepare({media}) {
      return {
        title: 'Hero Image',
        media,
      }
    },
  },
})
