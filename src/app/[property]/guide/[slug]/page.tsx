import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
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

async function fetchGuide(slug: string) {
  const query = groq`*[_type == "guide" && slug.current == $slug][0]{ title, content }`
  return client.fetch(query, { slug })
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params
  const guide = await fetchGuide(slug)
  if (!guide) return <div>Guide not found</div>
  return (
    <article className="space-y-4">
      <h1 className="text-2xl font-semibold">{guide.title}</h1>
      {guide.content ? <SimplePortableText value={guide.content} /> : null}
    </article>
  )
}
