import axios from 'axios';
import { authStorage } from '../features/auth/auth.storage';

const axiosClient = axios.create({
    baseURL: import.meta?.env?.VITE_API_URL || 'http://localhost:8081',
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000 // 15 seconds
});

let isRedirectingToLogin = false;

axiosClient.interceptors.request.use((config) => {
    const token = authStorage.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

axiosClient.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response?.status === 401) {
        authStorage.clearSession();
        if (!isRedirectingToLogin && window.location.pathname !== '/login') {
            isRedirectingToLogin = true;
            window.location.replace('/login');
        }
    }
    return Promise.reject(error);
});

export default axiosClient;
