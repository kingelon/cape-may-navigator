import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import Image from 'next/image'
import type { ElementType } from 'react'

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
          const map = {
            normal: 'p',
            h1: 'h1',
            h2: 'h2',
            h3: 'h3',
            h4: 'h4',
            blockquote: 'blockquote',
          } as const
          type StyleKey = keyof typeof map
          const Tag = (map[(block.style as StyleKey) ?? 'normal']) as ElementType
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
  return client.fetch(query, { slug }, { next: { tags: ['sanity:recommendation', 'sanity:all'] } })
}

export default async function RecommendationPage({ params }: Props) {
  const { slug } = await params
  const rec = await fetchRec(slug)
  if (!rec) return <div>Recommendation not found</div>
  return (
    <article className="space-y-4 text-neutral-200">
      {rec.mainImageUrl && (
        <div className="relative w-full h-56 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900">
          <Image
            src={rec.mainImageUrl}
            alt={rec.name}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}
      <section className="rounded-lg border border-neutral-800 bg-neutral-900 p-5">
        <h1 className="text-2xl font-semibold text-white">{rec.name}</h1>
        {rec.category && <p className="text-sm text-neutral-400 mt-1">{rec.category}</p>}
        {rec.description ? <div className="mt-4"><SimplePortableText value={rec.description} /></div> : null}
      </section>
      {(rec.address || rec.websiteUrl) && (
        <section className="rounded-lg border border-neutral-800 bg-neutral-900 p-5">
          {rec.address && (
            <p className="mb-1"><span className="font-semibold text-white">Address:</span> {rec.address}</p>
          )}
          {rec.websiteUrl && (
            <p>
              <span className="font-semibold text-white">Website:</span>{' '}
              <a href={rec.websiteUrl} className="text-blue-400 underline" target="_blank" rel="noreferrer">
                {rec.websiteUrl}
              </a>
            </p>
          )}
        </section>
      )}
    </article>
  )
}
