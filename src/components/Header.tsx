type HeaderProps = {
  title?: string
  backHref?: string
}

export default function Header({ title, backHref }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
        {backHref && (
          <a
            href={backHref}
            aria-label="Back"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 text-neutral-700 hover:bg-neutral-100"
          >
            ←
          </a>
        )}
        <h1 className="text-lg font-semibold truncate">{title}</h1>
      </div>
    </header>
  )
}

