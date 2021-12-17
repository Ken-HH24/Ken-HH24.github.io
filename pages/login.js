import axios from 'axios';
import Router from 'next/router';
import { useRef } from 'react';
import { useMutation } from 'react-query';
import { useCookies } from 'react-cookie';

const loginPost = async ({ username, password }) => {
    const res = await axios.post('http://127.0.0.1:8080/user/login', {
        username,
        password
    })
    return res;
}

const Login = () => {
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const [, setCookie] = useCookies(['user']);

    const loginMutation = useMutation(loginPost, {
        onSuccess: ({ data }) => {
            const token = data.token;
            const user = JSON.parse(data.user);

            // jwt token
            // window.localStorage.setItem(JWT_TOKEN, token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // user cookie
            setCookie('token', token, {
                path: '/',
                maxAge: 60 * 60 * 24,
                sameSite: true
            })

            // redirect
            Router.push(`/Todo/${user.ID}`);
        },

        onError: (error) => {
            console.log(error);
        }
    })

    const handleLogin = () => {
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        loginMutation.mutate({ username, password });
    }

    return (
        <div>
            <h1>Login</h1>
            {loginMutation.error && <h2 style={{ color: 'red' }}>error</h2>}
            <div>
                <label>uesrname: </label>
                <input ref={usernameRef} />
            </div>
            <div>
                <label>password: </label>
                <input ref={passwordRef} />
            </div>
            <button onClick={handleLogin}>
                Login
            </button>
        </div>
    )
}

export default Login;