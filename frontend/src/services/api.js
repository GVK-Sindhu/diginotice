import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BACKEND_URL = API_URL.replace('/api', '');

export { API_URL, BACKEND_URL };

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me'),
};

export const noticeService = {
    getNotices: (params) => api.get('/notices', { params }),
    getNotice: (id) => api.get(`/notices/${id}`),
    createNotice: (formData) => api.post('/notices', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    updateNotice: (id, data) => api.put(`/notices/${id}`, data),
    deleteNotice: (id) => api.delete(`/notices/${id}`),
    togglePin: (id) => api.patch(`/notices/${id}/pin`),
    getStats: () => api.get('/notices/stats'),
    getAdminAnalytics: () => api.get('/notices/admin/analytics'),
};

export default api;
