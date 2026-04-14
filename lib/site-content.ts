export const siteMeta = {
  title: 'Soham Dave',
  description: 'Engineering @ UWaterloo',
  baseUrl: 'https://davesoham.com',
}

export const navItems = [
  { href: '/', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
]

export const intro = {
  name: 'Soham Dave',
  role: 'I build product-minded AI systems with a bias for elegant interfaces, fast iteration, and research that turns into usable software.',
  paragraphs: [
    "I'm studying engineering & AI at the University of Waterloo, and currently working on agentic systems at Friedmann AI.",
    'My recent work spans distributed systems, mechanistic interpretability, browser tooling, and product-minded software experiments.',
    'This site is a compact snapshot of the work I care about most right now: building thoughtful software, shipping experimental ideas quickly, and staying close to both the technical and human sides of product development.',
  ],
}

export const projects = [
  {
    name: 'RustVault',
    url: 'https://github.com/SohamD1/RustVault',
    description: 'A mini DynamoDB-inspired key-value store with a Rust LSM-tree engine, Java API layer, consistent hashing, and replica failover across three nodes.',
    note: 'dist. systems',
    year: '2026',
  },
  {
    name: 'Semantic Convergence',
    url: 'https://arxiv.org/abs/2507.22918',
    description: 'A research paper on shared representations across scaled Gemma-2 models, using sparse autoencoders to study how interpretable features align across model sizes.',
    note: 'mech. interp.',
    year: '2025',
  },
  {
    name: 'FOMO Calculator',
    url: 'https://github.com/SohamD1/finance_fomo',
    description: 'A stock-return simulator that shows what an investment would be worth from a chosen date, built with a Rails API, React frontend, and Yahoo Finance data.',
    note: 'finance app',
    year: '2025',
  },
  {
    name: 'TabHive',
    url: 'https://github.com/SohamD1/TabHive',
    description: 'A privacy-first browser extension that clusters similar tabs locally, detects course patterns, and helps clean up overloaded browsing sessions.',
    note: 'browser tool',
    year: '2025',
  },
]

export const experience = [
  {
    title: 'Engineering',
    company: 'Friedmann AI',
    companyUrl: 'https://www.friedmann.ai/',
    duration: 'Present',
    description: 'Building agentic systems and product-facing AI workflows.',
  },
  {
    title: 'Engineering',
    company: 'KAL Polymers',
    duration: "May 2025 - Aug 2025",
    description: 'Worked on throughput optimization and practical systems improvement.',
  },
  {
    title: 'Mechanistic interpretability',
    company: 'Algoverse',
    duration: "Oct 2024 - May 2025",
    description: 'Focused on tracing, model internals, and interpretability workflows.',
  },
]

export const contact = {
  github: 'https://github.com/SohamD1',
  x: 'https://x.com/_sohamdave',
  linkedin: 'https://linkedin.com/in/sohamdave1',
}
