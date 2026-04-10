import {defineField, defineType} from 'sanity'

export const thoughtType = defineType({
  name: 'thought',
  title: 'Thought',
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
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'Short summary used for list views and previews.',
      validation: (Rule) => Rule.required().max(220),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      description: 'Rich text content for the thought.',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
            ],
            annotations: [
              {
                name: 'link',
                title: 'Link',
                type: 'object',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (Rule) =>
                      Rule.uri({
                        allowRelative: true,
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  }),
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {hotspot: true},
        },
      ],
      validation: (Rule) => Rule.required().min(1),
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
      media: 'coverImage',
      publishedAt: 'publishedAt',
    },
    prepare({title, subtitle, media, publishedAt}) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : 'No publish date'
      return {
        title: title || 'Untitled thought',
        subtitle: `${date} · ${subtitle || 'No description'}`,
        media,
      }
    },
  },
})
