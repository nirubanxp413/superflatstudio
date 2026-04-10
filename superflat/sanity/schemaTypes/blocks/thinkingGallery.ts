import {defineField, defineType} from 'sanity'

export const thinkingGalleryBlock = defineType({
  name: 'thinkingGallery',
  title: 'Thinking Gallery',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'size',
              title: 'Size',
              type: 'string',
              options: {
                list: [
                  {title: 'Full width', value: 'full'},
                  {title: 'Half width', value: 'half'},
                ],
              },
              initialValue: 'full',
            }),
          ],
          preview: {
            select: {media: 'image'},
            prepare({media}) {
              return {title: 'Image', media}
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {
        title: heading || 'Thinking Gallery',
        subtitle: '1/3 text, 2/3 images',
      }
    },
  },
})
