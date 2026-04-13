import SiteLayout from '@/components/SiteLayout'
import TransitionLink from '@/components/TransitionLink'
import { contact, intro } from '@/lib/site-content'

export default function Home() {
  return (
    <SiteLayout currentPath="/" description={intro.role}>
      <section className="section-block intro-block">
        <h1>{intro.name}</h1>
        <p>{intro.role}</p>
        <p>
          I&apos;m studying engineering and AI at the <a href="https://uwaterloo.ca/" target="_blank" rel="noopener noreferrer">University
          of Waterloo</a>, and currently working on agentic systems at{' '}
          <a href="https://www.friedmann.ai/" target="_blank" rel="noopener noreferrer">
            Friedmann AI
          </a>
          .
        </p>
        <p>{intro.paragraphs[1]}</p>
        <p>
          {intro.paragraphs[2]} You can find me on <a href={contact.github} target="_blank" rel="noopener noreferrer">GitHub</a>,{' '}
          <a href={contact.x} target="_blank" rel="noopener noreferrer">
            X
          </a>
          , and <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>.
        </p>
      </section>

      <section className="section-block aside-block">
        <h2>Browse</h2>
        <p>
          For selected shipped work, head to <TransitionLink href="/projects">projects</TransitionLink>. For the ongoing arc of how I work,
          move over to <TransitionLink href="/experience">experience</TransitionLink>.
        </p>
      </section>
    </SiteLayout>
  )
}
