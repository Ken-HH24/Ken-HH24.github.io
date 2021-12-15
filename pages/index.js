import axios from 'axios'
import Head from 'next/head'
import { JWT_TOKEN } from './_app'
import Router from 'next/router'

export default function Home() {
  const handleLogOut = () => {
    window.localStorage.removeItem(JWT_TOKEN);
    Router.push('/login');
  }

  return (
    <div>
      Welcome
      <button onClick={handleLogOut}>log out</button>
    </div>
  )
}
