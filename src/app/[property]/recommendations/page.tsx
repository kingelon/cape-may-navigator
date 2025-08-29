import Card from '@/components/Card'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

export const dynamic = 'force-dynamic'

type Props = { params: { property: string } }

async function fetchRecs(propertySlug: string) {
  const query = groq`*[_type == "property" && slug.current == $slug][0]{
    recommendations[]->{ name, category, "slug": slug.current, "mainImageUrl": mainImage.asset->url }
  }`
  return client.fetch(query, { slug: propertySlug })
}

export default async function RecommendationsIndex({ params }: Props) {
  const data = await fetchRecs(params.property)
  const recs = data?.recommendations || []

  if (!recs.length) {
    return <div>No recommendations yet.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {recs.map((r: any) => (
        <Card
          key={r.slug}
          href={`/${params.property}/recommendations/${r.slug}`}
          imageUrl={r.mainImageUrl}
          title={r.name}
          description={r.category}
        />
      ))}
    </div>
  )
}
