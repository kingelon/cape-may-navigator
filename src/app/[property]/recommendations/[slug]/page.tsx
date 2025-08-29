import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ property: string; slug: string }> }

type PortableBlock = {
  _type: 'block'
  style?: string
  children?: { _type: string; text?: string }[]
}

function SimplePortableText({ value }: { value: PortableBlock[] }) {
  return (
    <div className="prose prose-neutral max-w-none">
      {value?.map((block, idx) => {
        if (block._type === 'block') {
          const text = block.children?.map((c) => c.text).join('')
          const Tag = (block.style as keyof JSX.IntrinsicElements) || 'p'
          return (
            <Tag key={idx} className="mb-3">
              {text}
            </Tag>
          )
        }
        return null
      })}
    </div>
  )
}

async function fetchRec(slug: string) {
  const query = groq`*[_type == "recommendation" && slug.current == $slug][0]{
    name,
    category,
    description,
    "mainImageUrl": mainImage.asset->url,
    address,
    websiteUrl
  }`
  return client.fetch(query, { slug })
}

export default async function RecommendationPage({ params }: Props) {
  const { slug } = await params
  const rec = await fetchRec(slug)
  if (!rec) return <div>Recommendation not found</div>
  return (
    <article className="space-y-4">
      {rec.mainImageUrl && (
        <div className="relative w-full h-56">
          <Image
            src={rec.mainImageUrl}
            alt={rec.name}
            fill
            sizes="100vw"
            className="object-cover rounded-lg"
          />
        </div>
      )}
      <h1 className="text-2xl font-semibold">{rec.name}</h1>
      <p className="text-sm text-neutral-600">{rec.category}</p>
      {rec.description ? <SimplePortableText value={rec.description} /> : null}
      {(rec.address || rec.websiteUrl) && (
        <div className="rounded-lg border border-neutral-200 p-4">
          {rec.address && <p className="mb-1"><span className="font-semibold">Address:</span> {rec.address}</p>}
          {rec.websiteUrl && (
            <p>
              <span className="font-semibold">Website:</span>{' '}
              <a href={rec.websiteUrl} className="text-blue-600 underline" target="_blank" rel="noreferrer">
                {rec.websiteUrl}
              </a>
            </p>
          )}
        </div>
      )}
    </article>
  )
}
