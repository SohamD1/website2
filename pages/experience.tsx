import SiteLayout from '@/components/SiteLayout'
import { contact, experience } from '@/lib/site-content'

export default function ExperiencePage() {
  return (
    <SiteLayout
      currentPath="/experience"
      pageTitle="experience"
      description="experience across agentic systems, optimization, and mechanistic interpretability."
    >
      <section className="section-block">
        <h1 className="page-title">experience</h1>
        <p className="page-intro">
          my recent work has lived at the intersection of engineering craft, applied ai, and research-driven product thinking.
        </p>
      </section>

      <section className="section-block">
        <ul className="entry-list" aria-label="Experience">
          {experience.map((item) => (
            <li key={`${item.title}-${item.company}`} className="entry">
              <div className="entry-meta">
                <span>{item.duration}</span>
              </div>
              <div className="entry-content">
                <h3>
                  {item.title}{' '}
                  {item.companyUrl ? (
                    <a href={item.companyUrl} target="_blank" rel="noopener noreferrer">
                      @ {item.company}
                    </a>
                  ) : (
                    <span>@ {item.company}</span>
                  )}
                </h3>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="section-block contact-block">
        <p>
          reach out on <a href={contact.x} target="_blank" rel="noopener noreferrer">x</a>, browse code on{' '}
          <a href={contact.github} target="_blank" rel="noopener noreferrer">github</a>, or connect on{' '}
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">linkedin</a>.
        </p>
      </section>
    </SiteLayout>
  )
}
