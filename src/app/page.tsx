import Card from '@/components/Card'
import { groq } from 'next-sanity'
import { client } from '../sanity/lib/client'

export const dynamic = 'force-static'

type PropertyCard = {
  name: string
  slug: string
  mainImageUrl?: string
  welcomeMessage?: string
}

async function fetchProperties(): Promise<PropertyCard[]> {
  const query = groq`*[_type == "property" && defined(slug.current)]|order(name asc){
    name,
    "slug": slug.current,
    "mainImageUrl": mainImage.asset->url,
    welcomeMessage
  }`
  return client.fetch(query)
}

export default async function Home() {
  const properties = await fetchProperties()

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Properties</h1>
      {properties.length === 0 ? (
        <p className="text-neutral-600">No properties yet. Add one in Studio.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {properties.map((p) => (
            <Card
              key={p.slug}
              href={`/${p.slug}`}
              imageUrl={p.mainImageUrl}
              title={p.name}
              description={p.welcomeMessage || ''}
            />
          ))}
        </div>
      )}
    </main>
  )
}
