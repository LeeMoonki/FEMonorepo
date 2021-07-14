import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { add } from '@service/utils';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
export default MyApp
