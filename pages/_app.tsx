import type { AppProps } from 'next/app'
import { Lora } from 'next/font/google'
import '@/styles/globals.css'

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600'],
  variable: '--font-serif',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={lora.variable}>
      <Component {...pageProps} />
    </div>
  )
}
