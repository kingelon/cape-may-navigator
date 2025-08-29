import Header from '@/components/Header'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

export const dynamic = 'force-static'

type Props = {
  children: React.ReactNode
  params: { property: string }
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

export default async function PropertyLayout({ children, params }: Props) {
  const name = await fetchPropertyName(params.property)
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Header title={name || 'Property'} backHref="/" />
      <div className="max-w-4xl mx-auto px-4 py-6">{children}</div>
    </div>
  )
}
