import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // enables static HTML export
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.join(__dirname),
  },
  // optional: trailingSlash: true,
}

export default nextConfig
