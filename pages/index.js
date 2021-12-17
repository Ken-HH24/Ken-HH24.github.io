import Router from 'next/router'
import { parseCookies } from '../helpers'
import Link from 'next/link';
import { useCookies } from 'react-cookie';
import axios from 'axios';

export const getServerSideProps = async ({ req }) => {
  try {
    const { token } = parseCookies(req);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const res = await axios.get('http://127.0.0.1:8080/user/info');
    const user = res.data.user;

    return {
      props: {
        user: JSON.parse(user)
      }
    }
  } catch (err) {
    console.log(err);
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }
}

export default function Home({ user }) {
  const [, , removeCookie] = useCookies(['user']);

  const handleLogOut = () => {
    // window.localStorage.removeItem(JWT_TOKEN);
    removeCookie('user');
    Router.push('/login');
  }

  return (
    <div>
      <h1>Welcome {user.username}</h1>
      <div><Link href={`Todo/${user.ID}`}>get Todo</Link></div>
      <button onClick={handleLogOut}>log out</button>
    </div>
  )
}
