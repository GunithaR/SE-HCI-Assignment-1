import apiClient from './apiClient';

/**
 * Product catalog API service — maps to Spring Boot /api/public/** and /api/admin/** endpoints.
 */
const catalogService = {
    // ── Public endpoints (no auth required) ──────────────────────────────────

    getProductsByCategory: (categoryId, page = 0, size = 20) =>
        apiClient
            .get(`/public/categories/${categoryId}/products`, { params: { page, size } })
            .then((r) => r.data),

    getProductById: (id) => apiClient.get(`/public/products/${id}`).then((r) => r.data),

    getCategories: () => apiClient.get('/public/categories').then((r) => r.data),

    getBrands: () => apiClient.get('/public/brands').then((r) => r.data),

    getAttributeOptions: () => apiClient.get('/public/attributes/options').then((r) => r.data),

    /**
     * GET /api/public/products — all in-stock products across every category.
     * No authentication required — used by the public home page.
     */
    getAllProducts: (page = 0, size = 24) =>
        apiClient.get('/public/products', { params: { page, size } }).then((r) => r.data),

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
};

export default catalogService;
