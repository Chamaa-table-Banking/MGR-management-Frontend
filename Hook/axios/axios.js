import axios from 'axios';

const instance = axios.create({
    baseURL: "https://chamaa-gateway.onrender.com",
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;

//