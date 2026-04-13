export const siteMeta = {
  title: 'Soham Dave',
  description: 'engineering @ uwaterloo',
  baseUrl: 'https://davesoham.com',
}

export const navItems = [
  { href: '/', label: 'about' },
  { href: '/projects', label: 'projects' },
  { href: '/experience', label: 'experience' },
]

export const intro = {
  name: 'Soham Dave',
  role: 'i build product-minded ai systems with a bias for elegant interfaces, fast iteration, and research that turns into usable software.',
  paragraphs: [
    "i'm studying engineering & ai at the university of waterloo, and currently working on agentic systems at friedmann ai.",
    'my recent work spans mechanistic interpretability, browser tooling, real-time music learning, and applied automation.',
    'this site is a compact snapshot of the work i care about most right now: building thoughtful software, shipping experimental ideas quickly, and staying close to both the technical and human sides of product development.',
  ],
}

export const projects = [
  {
    name: 'rustvault',
    url: 'https://github.com/SohamD1/RustVault',
    description: 'a mini dynamodb-inspired key-value store with a rust lsm-tree engine, java api layer, consistent hashing, and replica failover across three nodes.',
    note: 'distributed systems',
    year: '2026',
  },
  {
    name: 'semantic convergence',
    url: 'https://arxiv.org/abs/2507.22918',
    description: 'a research paper on shared representations across scaled gemma-2 models, using sparse autoencoders to study how interpretable features align across model sizes.',
    note: 'mechanistic interpretability',
    year: '2025',
  },
  {
    name: 'fomo calculator',
    url: 'https://github.com/SohamD1/finance_fomo',
    description: 'a stock-return simulator that shows what an investment would be worth from a chosen date, built with a rails api, react frontend, and yahoo finance data.',
    note: 'rails + react',
    year: '2025',
  },
  {
    name: 'tabhive',
    url: 'https://github.com/SohamD1/TabHive',
    description: 'a privacy-first browser extension that clusters similar tabs locally, detects course patterns, and helps clean up overloaded browsing sessions.',
    note: 'browser extension',
    year: '2025',
  },
]

export const experience = [
  {
    title: 'engineering',
    company: 'friedmann ai',
    companyUrl: 'https://www.friedmann.ai/',
    duration: 'present',
    description: 'building agentic systems and product-facing ai workflows.',
  },
  {
    title: 'engineering',
    company: 'kal polymers',
    duration: "may 2025 - aug 2025",
    description: 'worked on throughput optimization and practical systems improvement.',
  },
  {
    title: 'mechanistic interpretability',
    company: 'algoverse',
    duration: "oct 2024 - may 2025",
    description: 'focused on tracing, model internals, and interpretability workflows.',
  },
]

export const contact = {
  github: 'https://github.com/SohamD1',
  x: 'https://x.com/_sohamdave',
  linkedin: 'https://linkedin.com/in/sohamdave1',
}
