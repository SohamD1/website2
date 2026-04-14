import SiteLayout from '@/components/SiteLayout'
import { projects } from '@/lib/site-content'

export default function ProjectsPage() {
  return (
    <SiteLayout currentPath="/projects" pageTitle="Projects" description="Selected projects, research, and product work by Soham Dave.">
      <section className="section-block">
        <h1 className="page-title">Projects</h1>
        <p className="page-intro">
          A selection of builds from my GitHub across browser tools, applied AI, developer systems, and product experiments.
        </p>
      </section>

      <section className="section-block">
        <ul className="entry-list project-list" aria-label="Projects">
          {projects.map((project) => (
            <li key={project.name} className="project-entry">
              <span className="project-year">{project.year}</span>
              <h3 className="project-title">
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  {project.name}
                </a>
              </h3>
              <span className="project-note">{project.note}</span>
              <p className="project-description">{project.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </SiteLayout>
  )
}
