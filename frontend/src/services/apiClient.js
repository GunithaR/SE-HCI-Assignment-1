import axios from 'axios';

/**
 * Central Axios instance.
 * - Base URL points to Vite's proxy which forwards /api → Spring Boot :8080
 * - JWT is auto-injected from localStorage via request interceptor
 * - 401 responses trigger automatic logout
 */
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 60000,
});

// ── Request interceptor: attach Bearer token ──────────────────────────────
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 globally ────────────────────────────
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
