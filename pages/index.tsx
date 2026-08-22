import { useRef } from 'react'
import Head from 'next/head'
import AsciiParticles from '@/components/AsciiParticles'

type LinkRefProps = {
  href: string
  icon: string
  children: React.ReactNode
}

/* favicon sits outside the anchor so the underline stays under the text */
function LinkRef({ href, icon, children }: LinkRefProps) {
  return (
    <span className="linkref">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="favicon" src={icon} alt="" aria-hidden="true" />
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </span>
  )
}

export default function Home() {
  // the canvas keeps the spinning mark clear of this block, so it needs to
  // measure where the text actually ends
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <Head>
        <title>Soham Dave</title>
        <meta name="description" content="Engineering @ UWaterloo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AsciiParticles contentRef={contentRef} />
      <div className="overlay">
        <div className="content" ref={contentRef}>
          <h1>Soham Dave</h1>
          <p>
            I&apos;m an engineering student at Waterloo. From January to August
            I was at{' '}
            <LinkRef href="https://www.friedmann.ai/" icon="/icons/friedmann.svg">
              Friedmann AI
            </LinkRef>
            , building agentic systems for financial advisors. This fall
            I&apos;m joining{' '}
            <LinkRef href="https://www.finta.com/" icon="/icons/finta.svg">
              Finta
            </LinkRef>
            , which automates bookkeeping and taxes for startups. Before that I
            wrote{' '}
            <LinkRef
              href="https://arxiv.org/abs/2507.22918"
              icon="/icons/acl.ico"
            >
              Semantic Convergence
            </LinkRef>{' '}
            (ACL 2025), a paper on how features line up across model sizes. I
            care most about the gap between ML research and ML that actually
            runs in production. Finance is where that gap costs the most.
          </p>
        </div>
      </div>
    </>
  )
}
