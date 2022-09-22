import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import '@fontsource/inter'
import '@fontsource/inter/600.css'
import '@fontsource/inter/800.css'
import Head from 'next/head'
import { useEffect } from 'react'
import Header from '@/components/Header'
import SessionContext from '@/src/context/SessionContext'

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => document.body.classList.add('with-transition'), [])

  return (
    <>
      <Head>
        <title>DevTube</title>
        <meta name='description' content='Devtube - Plataforma multimedia para desarrolladores' />
      </Head>
      <SessionContext>
        <Header />
        <Component {...pageProps} />
      </SessionContext>
    </>
  )
}
