import Card from '@/components/Card'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ property: string }> }

type GuideLink = { title: string; slug: string; mainImageUrl?: string }

async function fetchGuides(propertySlug: string) {
  const query = groq`*[_type == "property" && slug.current == $slug][0]{
    guides[]->{ title, "slug": slug.current, "mainImageUrl": mainImage.asset->url }
  }`
  return client.fetch(query, { slug: propertySlug })
}

export default async function GuidesIndex({ params }: Props) {
  const { property } = await params
  const data = await fetchGuides(property)
  const guides: GuideLink[] = data?.guides || []

  if (!guides.length) {
    return <div>No guides yet.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {guides.map((g) => (
        <Card
          key={g.slug}
          href={`/${property}/guide/${g.slug}`}
          imageUrl={g.mainImageUrl}
          title={g.title}
          description={null}
        />
      ))}
    </div>
  )
}

