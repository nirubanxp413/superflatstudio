import {defineField, defineType} from 'sanity'

export const artefactBlock = defineType({
  name: 'artefact',
  title: 'Artefact',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. Prototype, Design doc',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'badges',
      title: 'Badges',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Tags like Prototype, Code, Design doc',
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {
        title: title || 'Artefact',
        subtitle: 'Link to deliverable',
      }
    },
  },
})
