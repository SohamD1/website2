import SiteLayout from '@/components/SiteLayout'
import { contact, experience } from '@/lib/site-content'

export default function ExperiencePage() {
  return (
    <SiteLayout
      currentPath="/experience"
      pageTitle="Experience"
      description="Experience across agentic systems, optimization, and mechanistic interpretability."
    >
      <section className="section-block">
        <h1 className="page-title">Experience</h1>
        <p className="page-intro">
          My recent work has lived at the intersection of engineering craft, applied AI, and research-driven product thinking.
        </p>
      </section>

      <section className="section-block">
        <ul className="entry-list project-list" aria-label="Experience">
          {experience.map((item) => (
            <li key={`${item.title}-${item.company}`} className="project-entry">
              <span className="project-year">{item.duration}</span>
              <h3 className="project-title">{item.title}</h3>
              <span className="project-note">
                {item.companyUrl ? (
                  <a href={item.companyUrl} target="_blank" rel="noopener noreferrer">
                    {item.company}
                  </a>
                ) : (
                  <span>{item.company}</span>
                )}
              </span>
              <p className="project-description">{item.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section-block contact-block">
        <p>
          Reach out on <a href={contact.x} target="_blank" rel="noopener noreferrer">X</a>, browse code on{' '}
          <a href={contact.github} target="_blank" rel="noopener noreferrer">GitHub</a>, or connect on{' '}
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>.
        </p>
      </section>
    </SiteLayout>
  )
}
