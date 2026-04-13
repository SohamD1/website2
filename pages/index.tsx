import SiteLayout from '@/components/SiteLayout'
import { contact, intro } from '@/lib/site-content'

export default function Home() {
  return (
    <SiteLayout currentPath="/" description={intro.role}>
      <section className="section-block intro-block">
        <h1 className="name-display">{intro.name}</h1>
        <p>{intro.role}</p>
        <p>
          i&apos;m studying engineering and ai at the <a href="https://uwaterloo.ca/" target="_blank" rel="noopener noreferrer">university
          of waterloo</a>, and currently working on agentic systems at{' '}
          <a href="https://www.friedmann.ai/" target="_blank" rel="noopener noreferrer">
            friedmann ai
          </a>
          .
        </p>
        <p>{intro.paragraphs[1]}</p>
        <p>
          {intro.paragraphs[2]} you can find me on <a href={contact.github} target="_blank" rel="noopener noreferrer">github</a>,{' '}
          <a href={contact.x} target="_blank" rel="noopener noreferrer">
            x
          </a>
          , and <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">linkedin</a>.
        </p>
      </section>
    </SiteLayout>
  )
}
