import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

type WebhookBody = {
  _type?: string
  type?: string
  document?: { _type?: string }
  payload?: { _type?: string }
  event?: { type?: string }
  secret?: string
}

export async function POST(req: NextRequest) {
  const urlSecret = req.nextUrl.searchParams.get('secret') || undefined
  const headerSecret =
    req.headers.get('x-revalidate-secret') || req.headers.get('x-sanity-secret') || undefined
  let body: WebhookBody | undefined
  try {
    body = (await req.json()) as WebhookBody
  } catch {
    body = undefined
  }
  const bodySecret = body?.secret

  const provided = (urlSecret || headerSecret || bodySecret || '').toString().trim()
  const expected = (process.env.REVALIDATE_SECRET || '').toString().trim()

  if (!expected || provided !== expected) {
    return NextResponse.json({ ok: false, message: 'Invalid secret' }, { status: 401 })
  }

  try {
    const typeCandidate =
      body?._type || body?.type || body?.document?._type || body?.payload?._type || body?.event?.type

    const tags = new Set<string>(['sanity:all'])
    if (typeof typeCandidate === 'string') {
      tags.add(`sanity:${typeCandidate}`)
    }

    for (const tag of tags) {
      revalidateTag(tag)
    }

    return NextResponse.json({ ok: true, revalidated: Array.from(tags) })
  } catch (err) {
    return NextResponse.json({ ok: false, message: (err as Error).message }, { status: 500 })
  }
}
