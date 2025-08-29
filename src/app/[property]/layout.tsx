export const dynamic = 'force-static'

type Props = {
  children: React.ReactNode
  params: Promise<{ property: string }>
}

export default async function PropertyLayout({ children }: Props) {
  return <div className="min-h-screen bg-neutral-950 text-white">{children}</div>
}
