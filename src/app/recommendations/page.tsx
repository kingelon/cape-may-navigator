import Header from '@/components/Header'
import Card from '@/components/Card'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

export const dynamic = 'force-dynamic'

type Rec = {
  name: string
  category?: string
  slug: string
  propertySlug?: string
  mainImageUrl?: string
}

async function fetchRecommendations(): Promise<Rec[]> {
  const query = groq`*[_type=="recommendation"]|order(name asc){
    name,
    category,
    "slug": slug.current,
    "propertySlug": *[_type=="property" && references(^._id)][0].slug.current,
    "mainImageUrl": mainImage.asset->url
  }`
  return client.fetch(query)
}

export default async function RecommendationsPage() {
  const items = await fetchRecommendations()

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Header title="Recommendations" rootMenu />
      <main className="max-w-6xl mx-auto px-6 py-10">
        {items.length === 0 ? (
          <p className="text-neutral-300">No recommendations yet. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((r) => (
              <Card
                key={`${r.slug}-${r.propertySlug}`}
                href={r.propertySlug ? `/${r.propertySlug}/recommendations/${r.slug}` : '#'}
                imageUrl={r.mainImageUrl}
                title={r.name}
                description={r.category || ''}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

