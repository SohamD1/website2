import type { AppProps } from 'next/app'
import { Lora, Inter } from 'next/font/google'
import '@/styles/globals.css'

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600'],
  variable: '--font-serif',
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
  variable: '--font-sans',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${lora.variable} ${inter.variable}`}>
      <Component {...pageProps} />
    </div>
  )
}
