import '../styles/globals.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import axios from 'axios';

export const JWT_TOKEN = 'jwt-token';
const BEARER = 'Bearer';

const queryClient = new QueryClient();

axios.interceptors.request.use(config => {
  const token = window.localStorage.getItem(JWT_TOKEN);
  if (token) {
    config.headers.Authorization = BEARER + ' ' + token;
  }
  return config;
}, err => Promise.reject(err));

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}

export default MyApp
