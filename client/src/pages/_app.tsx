import { Montserrat } from 'next/font/google'

import '@/styles/reset.css'
import '@/styles/globals.css'

import type { AppProps } from 'next/app'

const montserrat = Montserrat({subsets:['latin']})
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps}  className={montserrat.className}/>
}
