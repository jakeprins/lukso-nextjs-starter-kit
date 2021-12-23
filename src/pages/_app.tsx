import 'styles/tailwind.css'

import { AppProps } from 'next/app'
import { Web3Provider } from 'utils/web3'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Web3Provider>
      <Component {...pageProps} />
    </Web3Provider>
  )
}
