import type { AppProps } from 'next/app'
import { Cormorant_Garamond } from 'next/font/google'
import '@/styles/globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={cormorant.variable}>
      <Component {...pageProps} />
    </div>
  )
}
