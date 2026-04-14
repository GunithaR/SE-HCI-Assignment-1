import apiClient from './apiClient';

/**
 * Rule Management API service — maps to Spring Boot /api/admin/rules endpoints.
 */
const ruleService = {
    getAllRules: () => apiClient.get('/admin/rules').then((r) => r.data),
    getActiveRules: () => apiClient.get('/admin/rules/active').then((r) => r.data),
    getRuleById: (id) => apiClient.get(`/admin/rules/${id}`).then((r) => r.data),
    createRule: (data) => apiClient.post('/admin/rules', data).then((r) => r.data),
    updateRule: (id, data) => apiClient.put(`/admin/rules/${id}`, data).then((r) => r.data),
    toggleRuleStatus: (id) => apiClient.patch(`/admin/rules/${id}/status`).then((r) => r.data),
    deleteRule: (id) => apiClient.delete(`/admin/rules/${id}`).then((r) => r.data),
    getAttributeMeta: () => apiClient.get('/admin/product-attributes/meta').then((r) => r.data),
    getQuestionKeys: () => apiClient.get('/admin/rules/question-keys').then((r) => r.data),
};

export default ruleService;
