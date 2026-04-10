import {defineField, defineType} from 'sanity'

export const sketchType = defineType({
  name: 'sketch',
  title: 'Sketch',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'engine',
      title: 'Engine',
      type: 'string',
      options: {
        list: [
          {title: 'p5.js', value: 'p5'},
          {title: 'three.js', value: 'three'},
          {title: 'paper.js', value: 'paper'},
        ],
        layout: 'radio',
      },
      initialValue: 'p5',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(220),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: {hotspot: true},
      description: 'Optional preview image for listing pages.',
    }),
    defineField({
      name: 'canvasHtml',
      title: 'Canvas HTML',
      type: 'text',
      rows: 20,
      description:
        'Paste the full HTML sketch payload (CodePen style), including scripts needed to run the canvas.',
      validation: (Rule) => Rule.required().min(20),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Published (newest first)',
      name: 'publishedDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Published (oldest first)',
      name: 'publishedAsc',
      by: [{field: 'publishedAt', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'shortDescription',
      engine: 'engine',
      media: 'thumbnail',
    },
    prepare({title, subtitle, engine, media}) {
      const label = engine ? engine.toUpperCase() : 'ENGINE'
      return {
        title: title || 'Untitled sketch',
        subtitle: `${label} · ${subtitle || 'No description'}`,
        media,
      }
    },
  },
})
