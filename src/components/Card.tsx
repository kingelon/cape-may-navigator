import Image from 'next/image'

type CardProps = {
  href?: string
  imageUrl?: string | null
  title: string
  description?: string | null
}

export default function Card({ href, imageUrl, title, description }: CardProps) {
  const content = (
    <div className="rounded-xl border overflow-hidden bg-neutral-900 border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
      {imageUrl && (
        <div className="relative w-full h-40">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-base font-semibold text-white mb-1 line-clamp-1">{title}</h3>
        {description ? <p className="text-sm text-neutral-400 line-clamp-2">{description}</p> : null}
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} className="block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-400 rounded-xl">
        {content}
      </a>
    )
  }

  return content
}
