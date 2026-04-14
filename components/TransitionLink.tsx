import type { MouseEvent, ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

type TransitionDocument = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => void
}

type TransitionLinkProps = {
  href: string
  children: ReactNode
  className?: string
  target?: string
  rel?: string
  onClick?: () => void
}

export default function TransitionLink({ href, children, className, target, rel, onClick }: TransitionLinkProps) {
  const router = useRouter()

  const prefetchRoute = () => {
    if (!href.startsWith('/')) {
      return
    }

    void router.prefetch(href)
  }

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.()

    const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    const isPrimaryClick = event.button === 0
    const isExternalTarget = target === '_blank'
    const isInternalRoute = href.startsWith('/')

    if (!isPrimaryClick || isModifiedClick || isExternalTarget || !isInternalRoute) {
      return
    }

    if (router.asPath === href) {
      event.preventDefault()
      return
    }

    event.preventDefault()

    const navigate = () => router.push(href)
    const transitionDocument = document as TransitionDocument

    if (typeof transitionDocument.startViewTransition === 'function') {
      transitionDocument.startViewTransition(() => navigate())
      return
    }

    void navigate()
  }

  return (
    <Link
      href={href}
      className={className}
      target={target}
      rel={rel}
      onClick={handleClick}
      onMouseEnter={prefetchRoute}
      onTouchStart={prefetchRoute}
      prefetch={href.startsWith('/')}
    >
      {children}
    </Link>
  )
}
