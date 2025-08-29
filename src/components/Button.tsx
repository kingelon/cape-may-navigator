import { ReactNode } from 'react'

type ButtonProps = {
  href?: string
  children: ReactNode
  variant?: 'primary' | 'secondary'
}

export default function Button({ href, children, variant = 'primary' }: ButtonProps) {
  const classes =
    variant === 'primary'
      ? 'inline-flex items-center justify-center rounded-lg bg-white text-neutral-900 px-4 h-10 hover:bg-neutral-200'
      : 'inline-flex items-center justify-center rounded-lg border border-neutral-700 text-white px-4 h-10 hover:bg-neutral-800'

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  }

  return <button className={classes}>{children}</button>
}
