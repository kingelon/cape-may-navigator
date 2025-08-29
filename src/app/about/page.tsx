import Header from '@/components/Header'

export const dynamic = 'force-static'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Header title="About Us" rootMenu />
      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        <p className="text-neutral-300 text-lg leading-relaxed">
          Cape May Navigator is your simple, friendly guide for a great stay. We curate helpful house info and local tips so you can relax and enjoy.
        </p>
        <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
          <h2 className="text-xl font-semibold mb-2">Contact</h2>
          <div className="space-y-1 text-neutral-200">
            <p>Email: <a className="underline" href="mailto:hello@capemaynavigator.app">hello@capemaynavigator.app</a></p>
            <p>Phone: (555) 123‑4567</p>
          </div>
        </section>
      </main>
    </div>
  )
}

