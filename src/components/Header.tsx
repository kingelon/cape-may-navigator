type HeaderProps = {
  title?: string
  backHref?: string
  backText?: string
}

export default function Header({ title, backHref, backText }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-neutral-950/80 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60 border-b border-neutral-800 text-white">
      <div className="max-w-4xl mx-auto px-4 h-14 grid grid-cols-[auto_1fr_auto] items-center">
        {backHref ? (
          <a
            href={backHref}
            aria-label={backText ? `Back: ${backText}` : 'Back'}
            className="inline-flex items-center gap-2 px-3 h-9 rounded-md border border-neutral-700 text-white hover:bg-neutral-800"
          >
            <span aria-hidden>←</span>
            {backText ? <span className="hidden sm:inline">{backText}</span> : null}
          </a>
        ) : (
          <span />
        )}
        <h1 className="justify-self-center text-lg font-semibold truncate">{title}</h1>
        <span />
      </div>
    </header>
  )
}
