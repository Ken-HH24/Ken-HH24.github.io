import axios from 'axios';
import Router from 'next/router';
import { useRef } from 'react';
import { useMutation } from 'react-query';

const signupPost = async ({ username, password }) => {
    const res = await axios.post('http://127.0.0.1:8080/user/signup', {
        username,
        password
    })
    return res;
}

const SignUp = () => {
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    const signupMutation = useMutation(signupPost, {
        onSuccess: () => {
            Router.push('/login');
        },

        onError: (error) => {
            console.log(error);
        }
    })

    const handleSignUp = () => {
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        signupMutation.mutate({ username, password });
    }

    return (
        <div>
            <h1>Sign Up</h1>
            <div>
                <label>uesrname: </label>
                <input ref={usernameRef} />
            </div>
            <div>
                <label>password: </label>
                <input type='password' ref={passwordRef} />
            </div>
            <button onClick={handleSignUp}>
                Sign Up
            </button>
        </div>
    )
}

export default SignUp;