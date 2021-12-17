import '../styles/globals.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import axios from 'axios';
import { CookiesProvider } from 'react-cookie';

export const JWT_TOKEN = 'jwt-token';
const BEARER = 'Bearer';

axios.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem(JWT_TOKEN);
    if (token) {
      config.headers.Authorization = BEARER + ' ' + token;
    }
  }
  return config;
}, err => Promise.reject(err));

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
