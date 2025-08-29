import Header from '@/components/Header'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import Image from 'next/image'

export const dynamic = 'force-static'

type Params = { params: Promise<{ property: string }> }

type GuideLink = { title: string; slug: string; mainImageUrl?: string }
type RecommendationLink = {
  name: string
  category?: string
  slug: string
  mainImageUrl?: string
}
type PropertyDetail = {
  name?: string
  welcomeMessage?: string
  mainImageUrl?: string
  wifiNetwork?: string
  wifiPassword?: string
  checkoutProcedure?: string[]
  guides?: GuideLink[]
  recommendations?: RecommendationLink[]
}

export async function generateStaticParams() {
  const query = groq`*[_type == "property" && defined(slug.current)]{ "slug": slug.current }`
  const slugs: { slug: string }[] = await client.fetch(query)
  return slugs.map(({ slug }) => ({ property: slug }))
}

async function fetchProperty(slug: string): Promise<PropertyDetail | null> {
  const query = groq`*[_type == "property" && slug.current == $slug][0]{
    name,
    welcomeMessage,
    "mainImageUrl": mainImage.asset->url,
    wifiNetwork,
    wifiPassword,
    checkoutProcedure,
    guides[]->{ title, "slug": slug.current, "mainImageUrl": mainImage.asset->url },
    recommendations[]->{ name, category, "slug": slug.current, "mainImageUrl": mainImage.asset->url }
  }`
  return client.fetch(query, { slug })
}

export default async function PropertyHome({ params }: Params) {
  const { property: propertySlug } = await params
  const property = await fetchProperty(propertySlug)

  if (!property) {
    return <div>Property not found</div>
  }

  const checkoutSteps: string[] = Array.isArray(property.checkoutProcedure)
    ? property.checkoutProcedure
    : []

  return (
    <div>
      <Header title={property.name || 'Property'} menuForPropertySlug={propertySlug} />
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      {property.mainImageUrl && (
        <div className="w-full h-48 sm:h-64 md:h-80 overflow-hidden rounded-xl relative">
          <Image
            src={property.mainImageUrl}
            alt={property.name ? `${property.name} banner` : 'Property banner'}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      {property.welcomeMessage && (
        <p className="text-lg text-neutral-300">{property.welcomeMessage}</p>
      )}

      {(property.wifiNetwork || property.wifiPassword) && (
        <section className="rounded-xl border border-neutral-800 p-5 bg-neutral-900 text-neutral-200 shadow-sm">
          <h2 className="text-xl font-semibold text-white tracking-tight mb-3">Wi‑Fi Details</h2>
          <div className="space-y-1">
            {property.wifiNetwork && (
              <p>
                <span className="font-semibold">Network:</span> {property.wifiNetwork}
              </p>
            )}
            {property.wifiPassword && (
              <p>
                <span className="font-semibold">Password:</span>{' '}
                <code className="font-mono px-1 py-0.5 rounded bg-neutral-800 text-neutral-100">
                  {property.wifiPassword}
                </code>
              </p>
            )}
          </div>
        </section>
      )}

      {checkoutSteps.length > 0 && (
        <section className="rounded-xl border border-neutral-800 p-5 bg-neutral-900 text-neutral-200 shadow-sm">
          <h2 className="text-xl font-semibold text-white tracking-tight mb-3">Check‑out Procedure</h2>
          <ol className="list-decimal list-inside pl-5 space-y-2 marker:text-neutral-500">
            {checkoutSteps.map((step: string, idx: number) => (
              <li key={idx} className="leading-relaxed">{step}</li>
            ))}
          </ol>
        </section>
      )}

      {property.guides?.length ? (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Property Guides</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {property.guides.map((g: GuideLink) => (
              <Card
                key={g.slug}
                href={`/${propertySlug}/guide/${g.slug}`}
                imageUrl={g.mainImageUrl}
                title={g.title}
                description={null}
              />
            ))}
          </div>
        </section>
      ) : null}

      {property.recommendations?.length ? (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Local Recommendations</h2>
            <Button href={`/${propertySlug}/recommendations`} variant="secondary">
              View all
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {property.recommendations.map((r: RecommendationLink) => (
              <Card
                key={r.slug}
                href={`/${propertySlug}/recommendations/${r.slug}`}
                imageUrl={r.mainImageUrl}
                title={r.name}
                description={r.category}
              />
            ))}
          </div>
        </section>
      ) : null}
      </div>
      
    </div>
  )
}
