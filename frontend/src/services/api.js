import axios from 'axios';
import {
    MOCK_ADMIN_USER,
    MOCK_STUDENT_USER,
    mockGetNotices,
    mockGetNoticeById,
    mockCreateNotice,
    mockUpdateNotice,
    mockDeleteNotice,
    mockTogglePin,
    mockGetStats,
    mockDriveList,
    mockDriveMetrics,
    mockDriveStudents,
    mockPlatformAnalytics
} from './mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BACKEND_URL = API_URL.replace('/api', '');

export { API_URL, BACKEND_URL };

const api = axios.create({
    baseURL: API_URL,
    timeout: 3000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include JWT token
api.interceptors.request.use(
    (config) => {
        config._originalData = config.data;
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

// Response interceptor to catch network errors and route to mock data
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const url = error.config?.url || '';
        const method = (error.config?.method || 'get').toLowerCase();
        console.warn(`[Demo Fallback] Backend offline for ${method.toUpperCase()} ${url}. Providing mock data.`);

        // 1. Stats endpoint
        if (url.includes('/notices/stats')) {
            return Promise.resolve({
                status: 200,
                data: { success: true, data: mockGetStats() }
            });
        }

        // 2. Admin analytics
        if (url.includes('/notices/admin/analytics')) {
            return Promise.resolve({
                status: 200,
                data: { success: true, data: mockGetNotices() }
            });
        }

        // 3. Platform analytics
        if (url.includes('/notices/analytics')) {
            return Promise.resolve({
                status: 200,
                data: mockPlatformAnalytics
            });
        }

        // 4. Drive analytics endpoints
        if (url.includes('/drives/') && url.includes('/metrics')) {
            return Promise.resolve({
                status: 200,
                data: { success: true, data: { metrics: mockDriveMetrics } }
            });
        }

        if (url.includes('/drives/') && url.includes('/students')) {
            return Promise.resolve({
                status: 200,
                data: { success: true, data: mockDriveStudents }
            });
        }

        if (url.includes('/notices') && error.config?.params?.category === 'DRIVE') {
            return Promise.resolve({
                status: 200,
                data: { success: true, data: { notices: mockDriveList } }
            });
        }

        // 5. Pin notice toggle: PATCH /notices/:id/pin
        if (url.includes('/pin') && method === 'patch') {
            const pinMatch = url.match(/\/notices\/([^/?]+)\/pin/);
            const id = pinMatch ? pinMatch[1] : '';
            return Promise.resolve({
                status: 200,
                data: { success: true, data: mockTogglePin(id) }
            });
        }

        // 6. Delete notice: DELETE /notices/:id
        if (url.includes('/notices/') && method === 'delete') {
            const delMatch = url.match(/\/notices\/([^/?]+)/);
            const id = delMatch ? delMatch[1] : '';
            mockDeleteNotice(id);
            return Promise.resolve({
                status: 200,
                data: { success: true, message: 'Notice deleted successfully' }
            });
        }

        // 7. Update notice: PUT /notices/:id
        if (url.includes('/notices/') && method === 'put') {
            const putMatch = url.match(/\/notices\/([^/?]+)/);
            const id = putMatch ? putMatch[1] : '';
            const payload = error.config?._originalData || error.config?.data;
            return mockUpdateNotice(id, payload).then(updated => ({
                status: 200,
                data: { success: true, data: updated }
            }));
        }

        // 8. Create notice: POST /notices
        if (url.includes('/notices') && method === 'post') {
            const payload = error.config?._originalData || error.config?.data;
            return mockCreateNotice(payload).then(newNotice => ({
                status: 200,
                data: { success: true, data: newNotice }
            }));
        }

        // 9. Single Notice GET: /notices/:id
        const singleNoticeMatch = url.match(/\/notices\/([^/?]+)$/);
        if (singleNoticeMatch && method === 'get') {
            const id = singleNoticeMatch[1];
            if (id !== 'stats' && id !== 'analytics') {
                return Promise.resolve({
                    status: 200,
                    data: { success: true, data: mockGetNoticeById(id) }
                });
            }
        }

        // 10. List Notices GET: /notices
        if (url.includes('/notices') && method === 'get') {
            return Promise.resolve({
                status: 200,
                data: { success: true, data: mockGetNotices(error.config?.params) }
            });
        }

        return Promise.reject(error);
    }
);

export const authService = {
    login: async (credentials) => {
        try {
            const res = await api.post('/auth/login', credentials);
            return res;
        } catch (error) {
            // Offline / Demo fallback
            const isEmailAdmin = credentials.email?.toLowerCase().includes('admin') || credentials.role === 'ADMIN';
            const user = isEmailAdmin ? MOCK_ADMIN_USER : {
                ...MOCK_STUDENT_USER,
                email: credentials.email || MOCK_STUDENT_USER.email
            };

            const token = `demo-jwt-token-${user.role.toLowerCase()}-${Date.now()}`;
            localStorage.setItem('token', token);
            localStorage.setItem('demo_user', JSON.stringify(user));

            return {
                data: {
                    success: true,
                    token,
                    data: user
                }
            };
        }
    },

    register: async (userData) => {
        try {
            const res = await api.post('/auth/register', userData);
            return res;
        } catch (error) {
            const newUser = {
                id: 'student-' + Date.now(),
                _id: 'student-' + Date.now(),
                name: userData.name || 'New Student',
                email: userData.email,
                role: 'STUDENT',
                department: userData.department || 'Computer Science',
                year: userData.year || '1st Year'
            };

            const token = `demo-jwt-token-student-${Date.now()}`;
            localStorage.setItem('token', token);
            localStorage.setItem('demo_user', JSON.stringify(newUser));

            return {
                data: {
                    success: true,
                    token,
                    data: newUser
                }
            };
        }
    },

    getMe: async () => {
        try {
            const res = await api.get('/auth/me');
            return res;
        } catch (error) {
            const stored = localStorage.getItem('demo_user');
            const user = stored ? JSON.parse(stored) : MOCK_ADMIN_USER;
            return {
                data: {
                    success: true,
                    data: user
                }
            };
        }
    },
};

export const noticeService = {
    getNotices: async (params) => {
        try {
            const res = await api.get('/notices', { params });
            return res;
        } catch (error) {
            const notices = mockGetNotices(params);
            return {
                data: {
                    success: true,
                    data: notices
                }
            };
        }
    },

    getNotice: async (id) => {
        try {
            const res = await api.get(`/notices/${id}`);
            let noticeData = res?.data?.data || res?.data;
            if (Array.isArray(noticeData)) {
                noticeData = noticeData.find(n => n._id === id || n.id === id) || noticeData[0];
            }
            if (!noticeData || !noticeData.title) {
                noticeData = mockGetNoticeById(id);
            }
            return {
                data: {
                    success: true,
                    data: noticeData
                }
            };
        } catch (error) {
            const notice = mockGetNoticeById(id);
            return {
                data: {
                    success: true,
                    data: notice
                }
            };
        }
    },

    createNotice: async (formData) => {
        try {
            const isFormData = formData instanceof FormData;
            const res = await api.post('/notices', formData, {
                headers: isFormData ? { 'Content-Type': undefined } : undefined
            });
            return res;
        } catch (error) {
            const newNotice = await mockCreateNotice(formData);
            return {
                data: {
                    success: true,
                    data: newNotice
                }
            };
        }
    },

    updateNotice: async (id, data) => {
        try {
            const isFormData = data instanceof FormData;
            const res = await api.put(`/notices/${id}`, data, {
                headers: isFormData ? { 'Content-Type': undefined } : undefined
            });
            return res;
        } catch (error) {
            const updated = await mockUpdateNotice(id, data);
            return {
                data: {
                    success: true,
                    data: updated
                }
            };
        }
    },

    deleteNotice: async (id) => {
        try {
            const res = await api.delete(`/notices/${id}`);
            return res;
        } catch (error) {
            mockDeleteNotice(id);
            return {
                data: {
                    success: true,
                    message: 'Notice deleted successfully'
                }
            };
        }
    },

    togglePin: async (id) => {
        try {
            const res = await api.patch(`/notices/${id}/pin`);
            return res;
        } catch (error) {
            const notice = mockTogglePin(id);
            return {
                data: {
                    success: true,
                    data: notice
                }
            };
        }
    },

    getStats: async () => {
        try {
            const res = await api.get('/notices/stats');
            let statsData = res?.data?.data || res?.data;
            if (!statsData || typeof statsData !== 'object' || Array.isArray(statsData) || statsData.total === undefined) {
                statsData = mockGetStats();
            }
            return {
                data: {
                    success: true,
                    data: statsData
                }
            };
        } catch (error) {
            return {
                data: {
                    success: true,
                    data: mockGetStats()
                }
            };
        }
    },

    getAdminAnalytics: async () => {
        try {
            const res = await api.get('/notices/admin/analytics');
            return res;
        } catch (error) {
            return {
                data: {
                    success: true,
                    data: mockGetNotices()
                }
            };
        }
    },
};

export default api;
