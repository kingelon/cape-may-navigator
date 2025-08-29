"use client"

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

type HeaderProps = {
  title?: string
  backHref?: string
  backText?: string
  menuForPropertySlug?: string
  rootMenu?: boolean
}

export default function Header({ title, backHref, backText, menuForPropertySlug, rootMenu }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  return (
    <header className="sticky top-0 z-10 bg-neutral-950/80 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60 border-b border-neutral-800 text-white">
      <div className="max-w-4xl mx-auto px-4 h-14 grid grid-cols-[auto_1fr_auto] items-center gap-2">
        <div className="flex items-center gap-2" ref={menuRef}>
          {(menuForPropertySlug || rootMenu) && (
            <div className="relative">
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-neutral-700 hover:bg-neutral-800"
              >
                <span aria-hidden>≡</span>
              </button>
              {open && (
                <nav className="absolute left-0 mt-2 w-56 rounded-xl border border-neutral-800 bg-neutral-900/95 shadow-lg backdrop-blur p-2 space-y-1 text-sm">
                  <Link href="/" className="block rounded-lg px-3 py-2 hover:bg-neutral-800" onClick={() => setOpen(false)}>
                    Home
                  </Link>
                  <Link
                    href={menuForPropertySlug ? `/${menuForPropertySlug}/guides` : `/guides`}
                    className="block rounded-lg px-3 py-2 hover:bg-neutral-800"
                    onClick={() => setOpen(false)}
                  >
                    Guides
                  </Link>
                  <Link
                    href={menuForPropertySlug ? `/${menuForPropertySlug}/recommendations` : `/recommendations`}
                    className="block rounded-lg px-3 py-2 hover:bg-neutral-800"
                    onClick={() => setOpen(false)}
                  >
                    Recommendations
                  </Link>
                  <Link
                    href="/activities"
                    className="block rounded-lg px-3 py-2 hover:bg-neutral-800"
                    onClick={() => setOpen(false)}
                  >
                    Activities
                  </Link>
                  <Link
                    href="/about"
                    className="block rounded-lg px-3 py-2 hover:bg-neutral-800"
                    onClick={() => setOpen(false)}
                  >
                    About Us
                  </Link>
                </nav>
              )}
            </div>
          )}

          {!menuForPropertySlug && backHref && (
            <Link
              href={backHref}
              aria-label={backText ? `Back: ${backText}` : 'Back'}
              className="inline-flex items-center gap-2 px-3 h-9 rounded-md border border-neutral-700 hover:bg-neutral-800"
            >
              <span aria-hidden>←</span>
              {backText ? <span className="hidden sm:inline">{backText}</span> : null}
            </Link>
          )}
        </div>

        <h1 className="justify-self-center text-lg font-semibold truncate">{title}</h1>
        <span />
      </div>
    </header>
  )
}
