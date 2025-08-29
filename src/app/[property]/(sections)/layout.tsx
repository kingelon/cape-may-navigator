import Header from '@/components/Header'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

export const dynamic = 'force-static'

type Props = {
  children: React.ReactNode
  params: Promise<{ property: string }>
}

async function fetchPropertyName(slug: string): Promise<string | undefined> {
  const query = groq`*[_type == "property" && slug.current == $slug][0]{ name }`
  const data = await client.fetch(query, { slug })
  return data?.name as string | undefined
}

export async function generateStaticParams() {
  const query = groq`*[_type == "property" && defined(slug.current)]{ "slug": slug.current }`
  const slugs: { slug: string }[] = await client.fetch(query)
  return slugs.map(({ slug }) => ({ property: slug }))
}

export default async function SectionsLayout({ children, params }: Props) {
  const { property } = await params
  const name = await fetchPropertyName(property)
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Header title={name || 'Property'} backHref={`/${property}`} backText="Back" />
      <div className="max-w-4xl mx-auto px-4 py-6">{children}</div>
    </div>
  )
}
