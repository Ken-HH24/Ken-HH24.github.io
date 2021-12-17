import { JWT_TOKEN } from './_app'
import Router from 'next/router'
import { parseCookies } from '../helpers'
import Link from 'next/link';
import { useCookies } from 'react-cookie';

export const getServerSideProps = ({ req }) => {
  const data = parseCookies(req);
  const user = data.user;

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  return {
    props: {
      user: JSON.parse(user)
    }
  }
}

export default function Home({ user }) {
  const [, , removeCookie] = useCookies(['user']);

  const handleLogOut = () => {
    window.localStorage.removeItem(JWT_TOKEN);
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
