import { createClient } from '@sanity/client'

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'jihmnp1s'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  /** API in dev so publishes show up immediately; CDN in prod (ISR revalidates the page). */
  useCdn: process.env.NODE_ENV === 'production',
})
