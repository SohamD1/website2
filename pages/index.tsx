import Head from 'next/head'
import Image from 'next/image'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import LiquidBackground from '@/components/LiquidBackground'
import CommandPalette from '@/components/CommandPalette'

const copy = {
  meta: {
    title: 'Soham Dave',
    description: 'Engineering @ UWaterloo',
  },
  profile: {
    name: 'Soham Dave',
    imageAlt: 'Soham Dave',
  },
  sections: {
    projectsTitle: 'projects:',
    educationTitle: 'education:',
    experienceTitle: 'experience:',
  },
  projects: [
    {
      name: 'semantic convergence research',
      url: 'https://arxiv.org/abs/2507.22918',
      smallText: 'mechanistic interpretability',
      outcome: 'accepted @ acl',
      year: '2025',
    },
    {
      name: 'pianowise',
      url: 'https://devpost.com/software/pianowise',
      smallText: 'real-time hand-tracking piano tutor',
      outcome: '1st place',
      year: '2025',
    },
    {
      name: 'tabhive',
      url: 'https://chromewebstore.google.com/detail/tabhive-tab-organizer/loodadfjgkphneblmpegfnhligembail',
      smallText: 'semantic browser tab clustering extension',
      outcome: 'active users',
      year: '2025',
    },
  ],
  education: [
    {
      title: 'engineering + ai',
      detail: '@ university of waterloo',
      detailAsAchievement: false,
    },
  ],
  experience: [
    {
      role: 'engineering @',
      roleLinkText: 'friedmann ai',
      roleLinkHref: 'https://www.friedmann.ai/',
      duration: 'present',
      description: 'agentic systems',
    },
    {
      role: 'engineering @ kal polymers',
      roleLinkText: '',
      roleLinkHref: '',
      duration: "may '25 -> aug '25",
      description: 'throughput optimization',
    },
    {
      role: 'mech interp @ algoverse',
      roleLinkText: '',
      roleLinkHref: '',
      duration: "oct '24 -> may '25",
      description: 'tracing & internals',
    },
  ],
  contact: {
    xTitle: 'X',
    githubTitle: 'GitHub',
    linkedInTitle: 'LinkedIn',
  },
}

export default function Home() {
  return (
    <>
      <Head>
        <title>{copy.meta.title}</title>
        <meta name="description" content={copy.meta.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LiquidBackground />
      <CommandPalette />

      <main className="container">
        <header className="intro">
          <div className="intro-content">
            <h1>{copy.profile.name}</h1>
          </div>
          <div className="intro-image">
            <Image src="/profile.jpg" alt={copy.profile.imageAlt} width={80} height={80} priority unoptimized />
          </div>
        </header>

        <section className="experience">
          <h2>
            <em>{copy.sections.experienceTitle}</em>
          </h2>
          <ul className="experience-list">
            {copy.experience.map((job) => (
              <li key={job.role}>
                <span className="arrow">-&gt;</span>
                <div className="experience-content">
                  <div className="experience-header">
                    <strong>
                      {job.role}
                      {job.roleLinkHref ? (
                        <>
                          {' '}
                          <a className="experience-company-link" href={job.roleLinkHref} target="_blank" rel="noopener noreferrer">
                            {job.roleLinkText}
                          </a>
                        </>
                      ) : null}
                    </strong>
                    <div className="header-right">
                      <span className="duration">{job.duration}</span>
                    </div>
                  </div>
                  <p className="job-description">{job.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="highlights">
          <h2>
            <em>{copy.sections.projectsTitle}</em>
          </h2>
          <ul className="highlight-list">
            {copy.projects.map((project) => (
              <li key={project.name} className="project-row">
                <span className="arrow">-&gt;</span>
                <div className="highlight-content">
                  <a href={project.url} target="_blank" rel="noopener noreferrer">
                    <strong>{project.name}</strong>
                  </a>
                  <span className="project-small-text">{project.smallText}</span>
                </div>
                <div className="project-side">
                  <span className="project-outcome">{project.outcome}</span>
                  <span className="project-year">{project.year}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="education">
          <h2>
            <em>{copy.sections.educationTitle}</em>
          </h2>
          <ul className="education-list">
            {copy.education.map((item) => (
              <li key={item.title}>
                <span className="diamond">&bull;</span>
                <div className="event-content">
                  <strong>{item.title}</strong>
                  {item.detailAsAchievement ? <span className="achievement">{item.detail}</span> : ' ' + item.detail}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <footer className="contact">
          <div className="links">
            <a href="https://x.com/_sohamdave" className="contact-link" title={copy.contact.xTitle} target="_blank" rel="noopener noreferrer">
              <FaXTwitter size={24} />
            </a>
            <a href="https://github.com/SohamD1" className="contact-link" title={copy.contact.githubTitle} target="_blank" rel="noopener noreferrer">
              <FaGithub size={24} />
            </a>
            <a href="https://linkedin.com/in/sohamdave1" className="contact-link" title={copy.contact.linkedInTitle} target="_blank" rel="noopener noreferrer">
              <FaLinkedin size={24} />
            </a>
          </div>
        </footer>
      </main>
    </>
  )
}
