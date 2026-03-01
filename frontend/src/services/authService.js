import apiClient from './apiClient';

/**
 * Auth API service — maps to Spring Boot /api/auth/** endpoints.
 */
const authService = {
    /**
     * POST /api/auth/login
     * @param {string} email
     * @param {string} password
     * @returns {Promise<{token, email, role, expiresIn}>}
     */
    login: (email, password) =>
        apiClient.post('/auth/login', { email, password }).then((r) => r.data),

    /**
     * POST /api/auth/register
     * @param {string} email
     * @param {string} password
     * @param {string} [role='CUSTOMER']
     * @returns {Promise<{token, email, role, expiresIn}>}
     */
    register: (email, password, role = 'CUSTOMER') =>
        apiClient.post('/auth/register', { email, password, role }).then((r) => r.data),
};

export default authService;
