'use client'

/**
 * Configuration for Sanity Studio mounted at `/studio` via Next.js.
 *
 * Important: When deploying the Studio with `sanity deploy`, only
 * environment variables prefixed with `SANITY_STUDIO_` are exposed
 * to the browser bundle. We therefore support both prefixes below
 * so the same config works in Next.js and in hosted Studio builds.
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {schema} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

// Helper: read from Next-style env first, then Studio env when `sanity deploy` builds with Vite
function readEnv(nextKey: string, studioKey: string): string | undefined {
  if (typeof process !== 'undefined' && process?.env?.[nextKey]) {
    return process.env[nextKey]
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const viteEnv = (typeof import.meta !== 'undefined' && (import.meta as any)?.env) || undefined
  // Using direct property access helps Vite inline values in hosted builds
  return viteEnv?.[studioKey]
}

function assertValue(v: string | undefined, name: string): string {
  if (!v) throw new Error(`Missing environment variable: ${name}`)
  return v
}

const projectId = assertValue(
  readEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'SANITY_STUDIO_PROJECT_ID'),
  'NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_STUDIO_PROJECT_ID'
)
const dataset = assertValue(
  readEnv('NEXT_PUBLIC_SANITY_DATASET', 'SANITY_STUDIO_DATASET'),
  'NEXT_PUBLIC_SANITY_DATASET or SANITY_STUDIO_DATASET'
)
const apiVersion =
  readEnv('NEXT_PUBLIC_SANITY_API_VERSION', 'SANITY_STUDIO_API_VERSION') || '2025-08-29'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
