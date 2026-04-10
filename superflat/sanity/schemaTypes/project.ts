import {defineField, defineType} from 'sanity'
import {blockTypes} from './blocks'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
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
      name: 'type',
      title: 'Entry type',
      type: 'string',
      description: 'Case studies use the full project layout; longform entries render as thought pieces at /thought/[slug].',
      options: {
        list: [
          {title: 'Case study / project', value: 'caseStudy'},
          {title: 'Longform (thought)', value: 'longform'},
          {title: 'Sketch', value: 'sketch'},
        ],
        layout: 'radio',
      },
      initialValue: 'caseStudy',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      description: 'Used for thought pages and listings. Falls back to last modified if empty.',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'e.g. GAME DESIGN, CREATIVE TOOL, PRODUCT DESIGN',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      description: 'Brief summary for the homepage carousel',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'pageContent',
      title: 'Page Content',
      type: 'array',
      description:
        'Add any content blocks, mix block types freely, and drag to reorder them for the final page sequence.',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      of: blockTypes as any[],
    }),
  ],
  orderings: [
    {
      title: 'Manual order',
      name: 'manualOrder',
      by: [{field: '_createdAt', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      type: 'type',
    },
    prepare({title, subtitle, type: entryType}) {
      const typeLabel =
        entryType === 'longform'
          ? 'Longform'
          : entryType === 'sketch'
            ? 'Sketch'
            : 'Case study'
      return {
        title: title ?? 'Untitled',
        subtitle: [typeLabel, subtitle].filter(Boolean).join(' · '),
      }
    },
  },
})
