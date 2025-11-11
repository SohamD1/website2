import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { AiOutlineMail } from "react-icons/ai";
import { FaGithub, FaLinkedin, FaVideo, FaYoutube } from "react-icons/fa";
import PyjamaBackground from '@/components/PyjamaBackground'
import CommandPalette from '@/components/CommandPalette'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [copyNotification, setCopyNotification] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('sydave@uwaterloo.ca')
      setCopyNotification(true)
      setTimeout(() => setCopyNotification(false), 2000)
    } catch (err) {
      console.error('Failed to copy email: ', err)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <Head>
        <title>Soham Dave</title>
        <meta name="description" content="Management Engineering @ UWaterloo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <PyjamaBackground />
      <CommandPalette />

      <main className="container">
        <header className="intro">
          <div className="intro-content">
            <h1>Soham Dave</h1>
          </div>
          <div className="intro-image">
            <img src="/profile.jpg" alt="Soham Dave" />
          </div>
        </header>

        <section className="highlights">
          <h2><em>recent projects:</em></h2>
          <ul className="highlight-list">
            <li>
              <span className="arrow">↳</span>
              <div className="highlight-content">
                <a href="https://devpost.com/software/stockoverflowasp" target="_blank" rel="noopener noreferrer">
                  <strong>stockoverflow</strong>
                </a> — dual-platform finance app with AI advising, real-time trading, and gamified learning
                <span className="achievement">hackathon • fintech</span>
              </div>
            </li>
            <li>
              <span className="arrow">↳</span>
              <div className="highlight-content">
                <a href="https://arxiv.org/abs/2507.22918" target="_blank" rel="noopener noreferrer">
                  <strong>semantic convergence research</strong>
                </a> — co-authored paper accepted at the world's most prestigious nlp conference
                <span className="achievement">academic research • acl 2025</span>
              </div>
            </li>
            <li>
              <span className="arrow">↳</span>
              <div className="highlight-content">
                <a href="https://devpost.com/software/pianowise" target="_blank" rel="noopener noreferrer">
                  <strong>pianowise</strong>
                </a> — 1st place and $500 at canada's largest ai hackathon with real-time hand-tracking piano tutor
                <span className="achievement">hackathon • $500 prize</span>
              </div>
            </li>
            <li>
              <span className="arrow">↳</span>
              <div className="highlight-content">
                <a href="https://chromewebstore.google.com/detail/tabhive-tab-organizer/loodadfjgkphneblmpegfnhligembail" target="_blank" rel="noopener noreferrer">
                  <strong>tabhive</strong>
                </a> — engineered content-based clustering engine using k-means algorithm to organize browser tabs
                <span className="achievement">chrome extension • gtm time!</span>
              </div>
            </li>
          </ul>
        </section>

        <section className="education">
          <h2><em>education or events:</em></h2>
          <ul className="education-list">
            <li>
              <span className="diamond">◆</span>
              <strong>management engineering</strong> @ university of waterloo
            </li>
            <li>
              <span className="diamond">◆</span>
              <div className="event-content">
                <strong>y combinator's ai startup school</strong>
                <span className="achievement">met cool people</span>
              </div>
            </li>
          </ul>
        </section>

        <section className="experience">
          <h2><em>work experience:</em></h2>
          <ul className="experience-list">
            <li>
              <span className="arrow">↳</span>
              <div className="experience-content">
                <div className="experience-header">
                  <strong>software engineering intern @ kal polymers</strong>
                  <div className="header-right">
                    <span className="duration">may → aug '25</span>
                  </div>
                </div>
                <p className="job-description">developed production optimization software that improved machine efficiency by 45% and first-pass yield by 30%</p>
              </div>
            </li>
            <li>
              <span className="arrow">↳</span>
              <div className="experience-content">
                <div className="experience-header">
                  <strong>full stack developer @ startup</strong>
                  <span className="duration">dec '24 → apr '25</span>
                </div>
                <p className="job-description">built responsive web applications using react and node.js, delivering scalable solutions for client projects</p>
              </div>
            </li>
            <li>
              <span className="arrow">↳</span>
              <div className="experience-content">
                <div className="experience-header">
                  <strong>ai research intern @ algoverse </strong>
                  <span className="duration">oct '24 → may '25</span>
                </div>
                <p className="job-description">conducted research on machine learning algorithms and contributed to natural language processing projects</p>
              </div>
            </li>
          </ul>
        </section>

        <footer className="contact">
          <div className="links">
            <button onClick={copyEmailToClipboard} className="contact-link" title="Copy Email">
              <AiOutlineMail size={24} />
            </button>
            <a href="https://github.com/SohamD1" className="contact-link" title="GitHub" target="_blank" rel="noopener noreferrer">
              <FaGithub size={24} />
            </a>
            <a href="https://linkedin.com/in/sohamdave1" className="contact-link" title="LinkedIn" target="_blank" rel="noopener noreferrer">
              <FaLinkedin size={24} />
            </a>
          </div>

          {copyNotification && (
            <div className="copy-notification">
              copied to clipboard!
            </div>
          )}

        </footer>
      </main>
    </>
  )
}