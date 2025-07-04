import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://swp.smarttesting.in/api/',
    headers: {
        'X-App-Secret': 'YourStrongAppSecretKey987',
    },
});
