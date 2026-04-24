import {defineField, defineType} from 'sanity'

/** Site slices like About — one document per slug (e.g. `about-me`). */
export const staticPageType = defineType({
  name: 'staticPage',
  title: 'Static page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal label in the desk (e.g. About me).',
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
      name: 'portrait',
      title: 'Portrait image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'portraitAlt',
      title: 'Portrait alt text',
      type: 'string',
      description: 'Leave empty only if the image is decorative.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      description: 'About copy — paragraphs, links, and basic formatting.',
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
      ],
    }),
    defineField({
      name: 'linkedInUrl',
      title: 'LinkedIn URL',
      type: 'url',
      description: 'Shown as the LinkedIn link in the About overlay. Leave empty to hide.',
      validation: (Rule) =>
        Rule.uri({
          allowRelative: false,
          scheme: ['http', 'https'],
        }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      media: 'portrait',
    },
    prepare({title, slug, media}) {
      return {
        title: title || 'Untitled',
        subtitle: slug ? `/${slug}` : 'No slug',
        media,
      }
    },
  },
})
