import SiteLayout from '@/components/SiteLayout'
import { projects } from '@/lib/site-content'

export default function ProjectsPage() {
  return (
    <SiteLayout currentPath="/projects" pageTitle="Projects" description="Selected projects, research, and product work by Soham Dave.">
      <section className="section-block">
        <h1 className="page-title">Projects</h1>
        <p className="page-intro">
          A few of the strongest builds from my GitHub across browser tools, applied AI, developer systems, and product experiments.
        </p>
      </section>

      <section className="section-block">
        <ul className="entry-list" aria-label="Projects">
          {projects.map((project) => (
            <li key={project.name} className="entry">
              <div className="entry-meta">
                <span>{project.year}</span>
                <span>{project.note}</span>
              </div>
              <div className="entry-content">
                <h3>
                  <a href={project.url} target="_blank" rel="noopener noreferrer">
                    {project.name}
                  </a>
                </h3>
                <p>{project.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </SiteLayout>
  )
}
