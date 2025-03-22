import axios from 'axios';

const instance = axios.create({
    baseURL: "http://localhost:4500",
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;

//