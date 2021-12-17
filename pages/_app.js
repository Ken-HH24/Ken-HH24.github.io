import '../styles/globals.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import axios from 'axios';
import { CookiesProvider } from 'react-cookie';
import { parseCookies } from '../helpers';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <CookiesProvider>
        <Component {...pageProps} />
      </CookiesProvider>
    </QueryClientProvider>
  )
}

export default MyApp
