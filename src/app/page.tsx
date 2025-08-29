import { groq } from 'next-sanity'
import { client } from '../sanity/lib/client'

export const dynamic = 'force-static'

type Property = {
  name?: string
  welcomeMessage?: string
  mainImageUrl?: string
  wifiNetwork?: string
  wifiPassword?: string
  checkoutProcedure?: string
}

async function fetchProperties(): Promise<Property[]> {
  const query = groq`*[_type == "property"]{
    name,
    welcomeMessage,
    "mainImageUrl": mainImage.asset->url,
    wifiNetwork,
    wifiPassword,
    checkoutProcedure
  }`
  return client.fetch(query)
}

export default async function Home() {
  const properties = await fetchProperties()
  const property = properties?.[0]

  if (!property) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-2xl text-center">
          <h1 className="text-3xl font-semibold">No property found</h1>
          <p className="text-neutral-600 mt-2">
            Add a “property” document in Sanity Studio to see content here.
          </p>
        </div>
      </main>
    )
  }

  const checkoutSteps = property.checkoutProcedure
    ? property.checkoutProcedure
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
    : []

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {property.mainImageUrl && (
        <div className="w-full h-64 sm:h-80 md:h-96 overflow-hidden">
          <img
            src={property.mainImageUrl}
            alt={property.name ? `${property.name} banner` : 'Property banner'}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <main className="max-w-4xl mx-auto px-6 py-10">
        {property.name && (
          <h1 className="text-4xl font-bold text-center mb-4">{property.name}</h1>
        )}

        {property.welcomeMessage && (
          <p className="text-lg text-center text-neutral-700 mb-10">
            {property.welcomeMessage}
          </p>
        )}

        {(property.wifiNetwork || property.wifiPassword) && (
          <section className="mb-10 rounded-lg border border-neutral-200 p-6 bg-neutral-50">
            <h2 className="text-2xl font-semibold mb-3">Wi‑Fi Details</h2>
            <div className="space-y-1">
              {property.wifiNetwork && (
                <p>
                  <span className="font-semibold">Network:</span>{' '}
                  <span>{property.wifiNetwork}</span>
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
          <section className="mb-6 rounded-lg border border-neutral-200 p-6">
            <h2 className="text-2xl font-semibold mb-3">Check‑out Procedure</h2>
            <ol className="list-decimal list-inside space-y-1 text-neutral-800">
              {checkoutSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </section>
        )}
      </main>
    </div>
  )
}
