import Card from '@/components/Card'
import Button from '@/components/Button'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import Image from 'next/image'

export const dynamic = 'force-static'

type Params = { params: { property: string } }

type GuideLink = { title: string; slug: string }
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
    guides[]->{ title, "slug": slug.current },
    recommendations[]->{ name, category, "slug": slug.current, "mainImageUrl": mainImage.asset->url }
  }`
  return client.fetch(query, { slug })
}

export default async function PropertyHome({ params }: Params) {
  const property = await fetchProperty(params.property)

  if (!property) {
    return <div>Property not found</div>
  }

  const checkoutSteps: string[] = Array.isArray(property.checkoutProcedure)
    ? property.checkoutProcedure
    : []

  return (
    <div className="space-y-8">
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
        <p className="text-lg text-neutral-700">{property.welcomeMessage}</p>
      )}

      {(property.wifiNetwork || property.wifiPassword) && (
        <section className="rounded-lg border border-neutral-200 p-5 bg-neutral-50">
          <h2 className="text-xl font-semibold mb-3">Wi‑Fi Details</h2>
          <div className="space-y-1">
            {property.wifiNetwork && (
              <p>
                <span className="font-semibold">Network:</span> {property.wifiNetwork}
              </p>
            )}
            {property.wifiPassword && (
              <p>
                <span className="font-semibold">Password:</span>{' '}
                <code className="font-mono px-1 py-0.5 rounded bg-neutral-200/60">
                  {property.wifiPassword}
                </code>
              </p>
            )}
          </div>
        </section>
      )}

      {checkoutSteps.length > 0 && (
        <section className="rounded-lg border border-neutral-200 p-5">
          <h2 className="text-xl font-semibold mb-3">Check‑out Procedure</h2>
          <ol className="list-decimal list-inside space-y-1 text-neutral-800">
            {checkoutSteps.map((step: string, idx: number) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      {property.guides?.length ? (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Property Guides</h2>
            <Button href={`/${params.property}/guide/wifi-details`} variant="secondary">
              Example
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {property.guides.map((g: GuideLink) => (
              <Card
                key={g.slug}
                href={`/${params.property}/guide/${g.slug}`}
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
            <Button href={`/${params.property}/recommendations`} variant="secondary">
              View all
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {property.recommendations.map((r: RecommendationLink) => (
              <Card
                key={r.slug}
                href={`/${params.property}/recommendations/${r.slug}`}
                imageUrl={r.mainImageUrl}
                title={r.name}
                description={r.category}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
