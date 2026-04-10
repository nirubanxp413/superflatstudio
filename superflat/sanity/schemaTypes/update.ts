import {defineField, defineType} from 'sanity'

export const updateType = defineType({
  name: 'update',
  title: 'Project Update',
  type: 'document',
  fields: [
    defineField({
      name: 'project',
      title: 'Project',
      type: 'reference',
      to: [{type: 'project'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
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
  ],
  orderings: [
    {
      title: 'Date (newest first)',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
    {
      title: 'Date (oldest first)',
      name: 'dateAsc',
      by: [{field: 'date', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      project: 'project.title',
    },
    prepare({title, date, project}) {
      const dateStr = date ? new Date(date).toLocaleDateString() : ''
      return {
        title: title || 'Untitled update',
        subtitle: `${project || 'No project'} · ${dateStr}`,
      }
    },
  },
})
