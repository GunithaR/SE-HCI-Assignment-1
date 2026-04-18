import apiClient from './apiClient';

/**
 * Product catalog API service — maps to Spring Boot /api/public/** and /api/admin/** endpoints.
 */
const catalogService = {
    // ── Public endpoints (no auth required) ──────────────────────────────────

    getProductsByCategory: (categoryId, page = 0, size = 20, filters = {}) =>
        apiClient
            .get(`/public/categories/${categoryId}/products`, { params: { page, size, ...filters } })
            .then((r) => r.data),

    getProductById: (id) => apiClient.get(`/public/products/${id}`).then((r) => r.data),

    getCategories: () => apiClient.get('/public/categories').then((r) => r.data),

    getBrands: () => apiClient.get('/public/brands').then((r) => r.data),

    getAttributeOptions: () => apiClient.get('/public/attributes/options').then((r) => r.data),

    /**
     * GET /api/public/products — all in-stock products across every category.
     * No authentication required — used by the public home page.
     */
    getAllProducts: (page = 0, size = 24, filters = {}) =>
        apiClient.get('/public/products', { params: { page, size, ...filters } }).then((r) => r.data),

    /**
     * Recommendation endpoint used by the wizard.
     * POST /api/public/recommendations
     */
    getRecommendations: (payload) =>
        apiClient
            .post('/public/recommendations', payload)
            .then((r) => r.data),

    /**
     * Hybrid recommendation endpoint used by the wizard.
     * POST /api/public/recommendations/hybrid
     */
    getHybridRecommendations: (payload) =>
        apiClient
            .post('/public/recommendations/hybrid', payload)
            .then((r) => r.data),

    /**
     * Generates a narrative explanation for a specific recommendation
     * POST /api/public/explanations
     */
    getExplanation: (payload) =>
        apiClient
            .post('/public/explanations', payload)
            .then((r) => r.data),

    /**
     * Compare two or more recommended products side-by-side.
     * POST /api/public/recommendations/compare
     */
    compareRecommendations: (payload) =>
        apiClient
            .post('/public/recommendations/compare', payload)
            .then((r) => r.data),

    /**
     * GET /api/public/questions/categories — available recommendation categories
     */
    getQuestionCategories: () =>
        apiClient.get('/public/questions/categories').then((r) => r.data),

    /**
     * GET /api/public/questions/{category} — category-specific questions
     */
    getQuestions: (category) =>
        apiClient
            .get(`/public/questions/${encodeURIComponent(category)}`)
            .then((r) => r.data),


    // ── Admin endpoints (ADMIN role required) ────────────────────────────────

    /** GET /api/admin/products — ALL products including out-of-stock (admin only) */
    getAdminAllProducts: (page = 0, size = 200) =>
        apiClient.get('/admin/products', { params: { page, size } }).then((r) => r.data),

    /** POST /api/admin/products — create a new product (multipart: data + optional image) */
    createProduct: (data, imageFile) => {
        const form = new FormData();
        form.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
        if (imageFile) form.append('image', imageFile);
        return apiClient.post('/admin/products', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
    },

    /** PUT /api/admin/products/{id} — fully replace an existing product (multipart: data + optional image) */
    updateProduct: (id, data, imageFile) => {
        const form = new FormData();
        form.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
        if (imageFile) form.append('image', imageFile);
        return apiClient.put(`/admin/products/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
    },

    /** PATCH /api/admin/products/{id}/status?inStock=true|false */
    toggleProductStatus: (id, inStock) =>
        apiClient.patch(`/admin/products/${id}/status`, null, { params: { inStock } }).then((r) => r.data),

    /** DELETE /api/admin/products/{id} */
    deleteProduct: (id) => apiClient.delete(`/admin/products/${id}`),

    /** POST /api/admin/brands */
    createBrand: (data) => apiClient.post('/admin/brands', data).then((r) => r.data),

    /** POST /api/admin/sub-admins */
    createSubAdminUser: (data) => apiClient.post('/admin/sub-admins', data).then((r) => r.data),

    /** GET /api/admin/recommendation-history */
    getRecommendationHistory: () => apiClient.get('/admin/recommendation-history').then((r) => r.data),

    /** GET /api/admin/analytics/visits */
    getAnalyticsVisits: () => apiClient.get('/admin/analytics/visits').then((r) => r.data),

    /** GET /api/admin/analytics/users */
    getAnalyticsUsers: () => apiClient.get('/admin/analytics/users').then((r) => r.data),

    /** GET /api/admin/analytics/sessions */
    getAnalyticsSessions: () => apiClient.get('/admin/analytics/sessions').then((r) => r.data),

    /** GET /api/admin/analytics/rules/active */
    getAnalyticsActiveRules: () => apiClient.get('/admin/analytics/rules/active').then((r) => r.data),

    /** POST /api/public/analytics/visit */
    recordVisit: () => apiClient.post('/public/analytics/visit').then((r) => r.data),
};

export default catalogService;
