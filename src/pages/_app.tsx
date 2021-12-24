import 'styles/tailwind.css'

import { AppProps } from 'next/app'
import { ToastProvider } from '@apideck/components'
import { Web3Provider } from 'utils/web3'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Web3Provider>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </Web3Provider>
  )
}
