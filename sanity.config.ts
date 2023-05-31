/**
 * This config is used to set up Sanity Studio that's mounted on the `/pages/studio/[[...index]].tsx` route
 */

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

import { schemaTypes } from './sanity/schemas/index'

export default defineConfig({
  basePath: '/studio',
  title: "Ian's Sanity Blog",

  projectId: 'dd3b6dwa',
  dataset: 'production',

  schema: {
    types: schemaTypes,
  },
  plugins: [deskTool(), visionTool()],
})
