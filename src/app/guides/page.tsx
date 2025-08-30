import Header from '@/components/Header'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

export const dynamic = 'force-dynamic'

type Guide = { title: string; slug: string; propertySlug?: string }

async function fetchGuides(): Promise<Guide[]> {
  const query = groq`*[_type=="guide"]|order(title asc){
    title,
    "slug": slug.current,
    "propertySlug": *[_type=="property" && references(^._id)][0].slug.current
  }`
  return client.fetch(query, {}, { next: { tags: ['sanity:guide', 'sanity:all'] } })
}

export default async function GuidesPage() {
  const items = await fetchGuides()
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Header title="Guides" rootMenu />
      <main className="max-w-5xl mx-auto px-6 py-10">
        {items.length === 0 ? (
          <p className="text-neutral-300">No guides yet. Check back soon.</p>
        ) : (
          <ul className="divide-y divide-neutral-800 rounded-xl border border-neutral-800 overflow-hidden bg-neutral-900">
            {items.map((i) => (
              <li key={`${i.slug}-${i.propertySlug}`} className="p-4 hover:bg-neutral-800">
                <a
                  href={i.propertySlug ? `/${i.propertySlug}/guide/${i.slug}` : '#'}
                  className="block"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{i.title}</div>
                    {i.propertySlug ? (
                      <span className="text-xs text-neutral-400">View</span>
                    ) : (
                      <span className="text-xs text-neutral-500">Unlinked</span>
                    )}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
