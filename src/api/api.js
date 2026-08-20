import axios from 'axios';


const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use(
    (config) => {
        const user = localStorage.getItem('user');
        if (user) {
            const userData = JSON.parse(user);
            if (userData && userData.auth) {
                config.headers.Authorization = `Basic ${userData.auth}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const loginUser = async (username, password) => {
    try {
        
        const auth = btoa(`${username}:${password}`);
        const response = await api.get('/login', {
            headers: {
                'Authorization': `Basic ${auth}`,
            },
        });
        return { message: response.data, auth };
    } catch (error) {
        throw error.response?.data || 'Login failed';
    }
};

export const getUserById = async (id, auth) => {
    try {
        const response = await api.get(`/user/${id}`, {
            headers: {
                'Authorization': `Basic ${auth}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Failed to get user';
    }
};

export default api;