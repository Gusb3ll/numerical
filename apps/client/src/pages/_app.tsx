import '@/styles/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MathJaxContext } from 'better-react-mathjax'
import { Provider as JotaiProvider } from 'jotai'
import { AppProps } from 'next/app'
import { useState } from 'react'
import { Toaster } from 'sonner'

import { Inter } from '@/utils'

const App = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <>
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          <MathJaxContext config={{ loader: { load: ['input/asciimath'] } }}>
            <main className={Inter.className}>
              <Toaster />
              <Component {...pageProps} />
            </main>
          </MathJaxContext>
        </QueryClientProvider>
      </JotaiProvider>
    </>
  )
}

export default App
