import { useEffect, type ReactNode } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import TransitionLink from '@/components/TransitionLink'
import { navItems, siteMeta } from '@/lib/site-content'

type SiteLayoutProps = {
  currentPath: string
  pageTitle?: string
  description?: string
  children: ReactNode
}

export default function SiteLayout({ currentPath, pageTitle, description, children }: SiteLayoutProps) {
  const router = useRouter()
  const title = pageTitle ? `${pageTitle} | ${siteMeta.title}` : siteMeta.title
  const pageUrl = `${siteMeta.baseUrl}${currentPath === '/' ? '' : currentPath}`

  useEffect(() => {
    navItems
      .filter((item) => item.href !== currentPath)
      .forEach((item) => {
        void router.prefetch(item.href)
      })
  }, [currentPath, router])

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description ?? siteMeta.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description ?? siteMeta.description} />
        <meta property="og:image" content={`${siteMeta.baseUrl}/profile.jpg`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@_sohamdave" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description ?? siteMeta.description} />
        <meta name="twitter:image" content={`${siteMeta.baseUrl}/profile.jpg`} />
      </Head>

      <div className="site-shell">
        <nav className="site-nav" aria-label="Primary">
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <TransitionLink
                  href={item.href}
                  className={item.href === currentPath ? 'site-nav-link active' : 'site-nav-link'}
                >
                  {item.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <main className="site-main">
          <div className="site-divider" aria-hidden="true" />
          <article className="site-article">{children}</article>
        </main>
      </div>
    </>
  )
}
