import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const api = axios.create({
    baseURL: 'https://swp.smarttesting.in/api/',
    headers: {
        'X-App-Secret': 'YourStrongAppSecretKey987',
    },
});

// Add token to every request
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token'); // or whatever key you're using
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
