import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['200', '300', '400', '500', '600'],
  variable: '--font-inter',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.variable}>
      <Component {...pageProps} />
    </div>
  )
}
