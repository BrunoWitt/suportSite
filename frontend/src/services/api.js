import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001',
});

// Interceptor para incluir o Token automaticamente em todas as chamadas
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Padrão esperado pelo seu authMiddleware
    }
    return config;
});

export default api;