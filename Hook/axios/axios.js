import axios from 'axios';

const instance = axios.create({
    baseURL: "http://192.168.0.101:4500",
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;

//