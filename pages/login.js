import axios from 'axios';
import { JWT_TOKEN } from './_app';
import Router from 'next/router';
import { useRef } from 'react';
import { useMutation } from 'react-query';

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

    const loginMutation = useMutation(loginPost, {
        onSuccess: (data) => {
            const token = data.data.token;
            window.localStorage.setItem(JWT_TOKEN, token);
            Router.push('/');
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