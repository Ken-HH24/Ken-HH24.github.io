import React, { useEffect, useState } from 'react';
import axios from './axios';

axios.interceptors.request.use(function (config) {
    console.log('request interceptor', config);
    return config;
})

axios.interceptors.response.use(function (response) {
    console.log('response interceptor', response);
    return response;
})

const AxiosDemo = () => {
    const [data, setData] = useState('');

    useEffect(() => {
        axios.get('https://jsonplaceholder.typicode.com/todos/1')
            .then(res => setData(JSON.parse(res.data).title));
    }, [])

    return (
        <div>
            {data}
        </div>
    )
}

export default AxiosDemo;