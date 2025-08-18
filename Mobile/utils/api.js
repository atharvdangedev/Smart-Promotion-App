// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BASE_URL, API_KEY } from '@env';

// export const api = axios.create({
//     baseURL: BASE_URL,
//     headers: {
//         'X-App-Secret': API_KEY,
//     },
// });


// api.interceptors.request.use(
//     async (config) => {
//         const token = await AsyncStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         if (error.response?.status === 401) {
//             await AsyncStorage.multiRemove([
//                 "token",
//                 "user_type",
//                 "user_id",
//                 "username",
//                 "profile_pic",
//             ]);

//         }
//         return Promise.reject(error);
//     }
// );

import axios from "axios";
import { BASE_URL, API_KEY } from "@env";
import { useAuthStore } from "../store/useAuthStore";
// import { useAuthStore } from "../stores/AuthStore";

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "X-App-Secret": API_KEY,
    },
});

// Attach token from Zustand store
api.interceptors.request.use(
    async (config) => {
        const { token } = useAuthStore.getState();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle 401 errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);
