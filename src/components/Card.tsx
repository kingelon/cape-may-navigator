type CardProps = {
  href?: string
  imageUrl?: string | null
  title: string
  description?: string | null
}

export default function Card({ href, imageUrl, title, description }: CardProps) {
  const content = (
    <div className="rounded-xl border border-neutral-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="w-full h-40 object-cover" />
      ) : (
        <div className="w-full h-40 bg-neutral-100" />
      )}
      <div className="p-4">
        <h3 className="text-base font-semibold mb-1 line-clamp-1">{title}</h3>
        {description ? (
          <p className="text-sm text-neutral-600 line-clamp-2">{description}</p>
        ) : null}
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

