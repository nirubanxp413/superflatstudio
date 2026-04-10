import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './sanity/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Superflat Studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'jihmnp1s',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',

  basePath: '/sanitystudio',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Projects')
              .child(S.documentTypeList('project').title('Projects')),
            S.listItem()
              .title('Project Updates')
              .child(S.documentTypeList('update').title('Project Updates')),
            S.listItem()
              .title('Thoughts')
              .child(S.documentTypeList('thought').title('Thoughts')),
            S.listItem()
              .title('Sketches')
              .child(S.documentTypeList('sketch').title('Sketches')),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
