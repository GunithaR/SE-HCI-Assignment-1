/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import catalogService from '../services/catalogService';

const EMPTY_FORM = {
    categoryId: '', brandId: '', name: '', description: '',
    basePrice: '', budgetLevel: '', durabilityRating: '', climateSuitability: '',
    maintenanceLevel: '', style: '', isActive: true,
};

function Toast({ toast }) {
    if (!toast.msg) return null;
    return (
        <div className={`toast ${toast.isError ? 'toast-error' : 'toast-success'}`}>
            {toast.msg}
        </div>
    );
}

function AddSubAdminModal({ onClose, onSuccess }) {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.email || !form.password) { setError('Email and password are required.'); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        setSubmitting(true);
        try {
            const result = await catalogService.createSubAdminUser(form);
            onSuccess(`Sub-Admin "${result.email}" created successfully!`);
            onClose();
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to create Sub-Admin.');
        } finally { setSubmitting(false); }
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-card" style={{ maxWidth: 440 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ fontWeight: 700, fontSize: '1.15rem' }}>Add Sub-Admin</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-muted)', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
                </div>
                {error && <div style={{ color: 'var(--color-error)', fontSize: '0.85rem', marginBottom: 12, background: 'var(--color-error-bg)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 16 }}>
                        <label className="input-label">Email</label>
                        <input type="email" value={form.email} onChange={set('email')} required className="input-field" />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <label className="input-label">Password</label>
                        <input type="password" value={form.password} onChange={set('password')} required minLength={6} className="input-field" />
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button type="submit" disabled={submitting} className="btn-primary" style={{ flex: 1 }}>{submitting ? 'Creating…' : 'Create Sub-Admin'}</button>
                        <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, loading }) {
    return (
        <div className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>{icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 4 }}>{loading ? '—' : value}</div>
            <div style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>{label}</div>
        </div>
    );
}

function ProductFormModal({ editingProduct, categories, brands, options, onClose, onSuccess }) {
    const isEdit = Boolean(editingProduct);
    const [form, setForm] = useState(() => {
        if (isEdit) {
            return {
                categoryId: editingProduct.categoryId ?? '', brandId: editingProduct.brandId ?? '',
                name: editingProduct.name ?? '', description: editingProduct.description ?? '',
                basePrice: editingProduct.basePrice ?? '', budgetLevel: editingProduct.budgetLevel ?? '',
                durabilityRating: editingProduct.durabilityRating ?? '', climateSuitability: editingProduct.climateSuitability ?? '',
                maintenanceLevel: editingProduct.maintenanceLevel ?? '', style: editingProduct.style ?? '',
                isActive: editingProduct.isActive ?? true,
            };
        }
        return EMPTY_FORM;
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(isEdit && editingProduct.imageUrl ? editingProduct.imageUrl : null);

    const set = (field) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm((f) => ({ ...f, [field]: value }));
    };
    const handleImageChange = (e) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
        if (file) { const reader = new FileReader(); reader.onload = (ev) => setImagePreview(ev.target.result); reader.readAsDataURL(file); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSubmitting(true);
        const payload = {
            ...form,
            categoryId: Number(form.categoryId), brandId: Number(form.brandId),
            basePrice: parseFloat(form.basePrice), durabilityRating: parseInt(form.durabilityRating, 10),
            isActive: form.isActive,
        };
        try {
            let result;
            if (isEdit) { result = await catalogService.updateProduct(editingProduct.id, payload, imageFile || undefined); }
            else { result = await catalogService.createProduct(payload, imageFile || undefined); }
            onSuccess(`Product "${result.name}" ${isEdit ? 'updated' : 'created'} successfully!`, result);
            onClose();
        } catch (err) {
            const data = err?.response?.data;
            if (data && typeof data === 'object' && !data.message) setErrors(data);
            else setErrors({ _general: data?.message || `Failed to ${isEdit ? 'update' : 'create'} product.` });
        } finally { setSubmitting(false); }
    };

    const fieldErr = (field) => errors[field] ? { borderColor: 'var(--color-error)' } : {};

    return (
        <div className="modal-overlay">
            <div className="modal-card" style={{ maxWidth: 680 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ fontWeight: 700, fontSize: '1.15rem' }}>{isEdit ? `Edit: ${editingProduct.name}` : 'Add New Product'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', fontSize: '1.4rem' }}>✕</button>
                </div>

                {errors._general && (
                    <div style={{ background: 'var(--color-error-bg)', border: '1px solid rgba(220,38,38,0.15)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: 'var(--color-error)', fontSize: '0.85rem', marginBottom: 16 }}>
                        {errors._general}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label className="input-label">Category *</label>
                            <select value={form.categoryId} onChange={set('categoryId')} className="input-field" style={fieldErr('categoryId')} required>
                                <option value="">Select…</option>
                                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Product Name *</label>
                            <input value={form.name} onChange={set('name')} className="input-field" style={fieldErr('name')} required />
                        </div>
                    </div>

                    <div>
                        <label className="input-label">Description</label>
                        <textarea value={form.description} onChange={set('description')} rows={2} className="input-field" style={{ resize: 'vertical' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label className="input-label">Base Price (Rs.) *</label>
                            <input type="number" step="0.01" min="0.01" value={form.basePrice} onChange={set('basePrice')} className="input-field" style={fieldErr('basePrice')} required />
                        </div>
                        <div>
                            <label className="input-label">Brand *</label>
                            <select value={form.brandId} onChange={set('brandId')} className="input-field" style={fieldErr('brandId')} required>
                                <option value="">Select…</option>
                                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="divider" style={{ margin: '4px 0' }} />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label className="input-label">Budget Level *</label>
                            <select value={form.budgetLevel} onChange={set('budgetLevel')} className="input-field" required>
                                <option value="">Select…</option>
                                {(options.budgetLevels || ['LOW', 'MEDIUM', 'HIGH']).map((v) => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Climate Suitability *</label>
                            <select value={form.climateSuitability} onChange={set('climateSuitability')} className="input-field" required>
                                <option value="">Select…</option>
                                {(options.climateSuitabilities || ['TROPICAL', 'ARID', 'TEMPERATE', 'COLD', 'ALL']).map((v) => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label className="input-label">Maintenance Level *</label>
                            <select value={form.maintenanceLevel} onChange={set('maintenanceLevel')} className="input-field" required>
                                <option value="">Select…</option>
                                {(options.maintenanceLevels || ['LOW', 'MEDIUM', 'HIGH']).map((v) => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Durability (1–10) *</label>
                            <input type="number" min="1" max="10" value={form.durabilityRating} onChange={set('durabilityRating')} className="input-field" required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label className="input-label">Style</label>
                            <input value={form.style} onChange={set('style')} className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Status</label>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {[{ v: true, l: 'In Stock' }, { v: false, l: 'Out of Stock' }].map(({ v, l }) => (
                                    <button key={String(v)} type="button" onClick={() => setForm((f) => ({ ...f, isActive: v }))}
                                        className={form.isActive === v ? 'btn-primary' : 'btn-ghost'}
                                        style={{ flex: 1, padding: '9px 8px', fontSize: '0.85rem' }}>{l}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
                        <label className="input-label">Product Image</label>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                            <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-md)', flexShrink: 0, border: '1px solid var(--color-border)', background: 'var(--color-surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {imagePreview ? <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ opacity: 0.3 }}>📷</span>}
                            </div>
                            <label className="btn-ghost" style={{ cursor: 'pointer', fontSize: '0.85rem', padding: '8px 16px' }}>
                                Choose image
                                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                            </label>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                        <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
                        <button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const { user, logout, isFullAdmin } = useAuth();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [options, setOptions] = useState({});
    const [activeCatId, setActiveCatId] = useState(null);
    const [viewAll, setViewAll] = useState(false);
    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loadingInit, setLoadingInit] = useState(true);
    const [loadingProds, setLoadingProds] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [toast, setToast] = useState({ msg: '', isError: false });
    const [showSubAdminModal, setShowSubAdminModal] = useState(false);

    const showToast = (msg, isError = false) => {
        setToast({ msg, isError });
        setTimeout(() => setToast({ msg: '', isError: false }), 3500);
    };

    useEffect(() => {
        Promise.all([catalogService.getCategories(), catalogService.getBrands(), catalogService.getAttributeOptions()])
            .then(([cats, brnds, opts]) => { setCategories(cats); setBrands(brnds); setOptions(opts); if (cats.length > 0) setActiveCatId(cats[0].id); })
            .catch(() => showToast('Could not load dashboard data.', true))
            .finally(() => setLoadingInit(false));
    }, []);

    useEffect(() => {
        if (viewAll) {
            setLoadingProds(true);
            catalogService.getAdminAllProducts()
                .then((page) => { setProducts(page.content ?? []); setTotalProducts(page.totalElements ?? 0); })
                .catch(() => showToast('Could not load products.', true))
                .finally(() => setLoadingProds(false));
        } else {
            if (!activeCatId) return;
            setLoadingProds(true);
            catalogService.getProductsByCategory(activeCatId, 0, 50)
                .then((page) => { setProducts(page.content ?? []); setTotalProducts(page.totalElements ?? 0); })
                .catch(() => showToast('Could not load products.', true))
                .finally(() => setLoadingProds(false));
        }
    }, [activeCatId, viewAll]);

    const refreshProducts = () => {
        const loader = viewAll ? catalogService.getAdminAllProducts() : catalogService.getProductsByCategory(activeCatId, 0, 50);
        loader.then((page) => { setProducts(page.content ?? []); setTotalProducts(page.totalElements ?? 0); });
    };

    const handleLogout = () => { logout(); navigate('/login'); };
    const openCreate = () => { setEditingProduct(null); setShowModal(true); };
    const openEdit = (product) => { setEditingProduct(product); setShowModal(true); };
    const closeModal = () => { setShowModal(false); setEditingProduct(null); };

    const handleFormSuccess = (msg, updatedProduct) => {
        showToast(msg);
        if (editingProduct) setProducts((prev) => prev.map((p) => p.id === updatedProduct.id ? updatedProduct : p));
        else refreshProducts();
    };

    const handleDelete = async (product) => {
        if (!window.confirm(`Delete "${product.name}"?`)) return;
        try {
            await catalogService.deleteProduct(product.id);
            showToast(`"${product.name}" deleted.`);
            setProducts((prev) => prev.filter((p) => p.id !== product.id));
            setTotalProducts((prev) => prev - 1);
        } catch (err) { showToast(err?.response?.data?.message || 'Failed to delete.', true); }
    };

    const handleToggleStatus = async (product) => {
        try {
            const updated = await catalogService.toggleProductStatus(product.id, !product.isActive);
            showToast(`"${updated.name}" → ${updated.isActive ? 'In Stock' : 'Out of Stock'}`);
            setProducts((prev) => prev.map((p) => p.id === updated.id ? updated : p));
        } catch { showToast('Failed to update status.', true); }
    };

    if (loadingInit) {
        return (
            <div className="page-with-navbar" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner" />
            </div>
        );
    }

    const BB = { LOW: 'badge-budget-low', MEDIUM: 'badge-budget-medium', HIGH: 'badge-budget-high' };

    return (
        <div className="page-with-navbar" style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
            <div className="page-container fade-in-up">
                <Toast toast={toast} />
                {showModal && <ProductFormModal editingProduct={editingProduct} categories={categories} brands={brands} options={options} onClose={closeModal} onSuccess={handleFormSuccess} />}
                {showSubAdminModal && <AddSubAdminModal onClose={() => setShowSubAdminModal(false)} onSuccess={(msg) => { showToast(msg); setShowSubAdminModal(false); }} />}

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <p style={{ color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>Admin Panel</p>
                        <h1 className="section-title" style={{ fontSize: '2rem' }}>Dashboard</h1>
                        <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>
                            Logged in as <span style={{ color: 'var(--color-primary)' }}>{user?.email}</span>
                            {' '}<span className={`badge ${isFullAdmin ? 'badge-primary' : 'badge-warning'}`}>{user?.role === 'SUB_ADMIN' ? 'Sub-Admin' : 'Admin'}</span>
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button id="admin-add-product-btn" onClick={openCreate} className="btn-primary">+ Add Product</button>
                        <button onClick={() => navigate('/admin/rules')} className="btn-secondary">Manage Rules</button>
                        {isFullAdmin && <button onClick={() => setShowSubAdminModal(true)} className="btn-ghost">+ Sub-Admin</button>}
                        <button onClick={handleLogout} className="btn-logout">Logout</button>
                    </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
                    <StatCard icon="🏷️" label="Categories" value={categories.length} />
                    <StatCard icon="📦" label="Products" value={totalProducts} loading={loadingProds} />
                    <StatCard icon="✅" label="In Stock" value={products.filter((p) => p.isActive).length} loading={loadingProds} />
                    <StatCard icon="⛔" label="Out of Stock" value={products.filter((p) => !p.isActive).length} loading={loadingProds} />
                </div>

                {/* Category Tabs */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
                    <button onClick={() => { setViewAll(true); setActiveCatId(null); }} className={`category-pill${viewAll ? ' active' : ''}`}>All Products</button>
                    {categories.map((cat) => (
                        <button key={cat.id} onClick={() => { setActiveCatId(cat.id); setViewAll(false); }} className={`category-pill${!viewAll && activeCatId === cat.id ? ' active' : ''}`}>{cat.name}</button>
                    ))}
                </div>

                {/* Products Table */}
                <div className="card" style={{ overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontWeight: 600, fontSize: '0.95rem' }}>{viewAll ? 'All Products' : categories.find((c) => c.id === activeCatId)?.name ?? 'Products'}</h2>
                        <span style={{ color: 'var(--color-muted)', fontSize: '0.82rem' }}>{totalProducts} total</span>
                    </div>
                    {loadingProds ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}><div className="spinner" /></div>
                    ) : products.length === 0 ? (
                        <div style={{ padding: '64px 20px', textAlign: 'center', color: 'var(--color-muted)' }}>
                            <p style={{ fontSize: '2.5rem', marginBottom: 12 }}>📭</p>
                            <p>No products yet. Click <strong style={{ color: 'var(--color-primary)' }}>+ Add Product</strong>.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table id="admin-products-table" className="data-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        {viewAll && <th>Category</th>}
                                        <th>Brand</th>
                                        <th>Budget</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p) => (
                                        <tr key={p.id}>
                                            <td style={{ fontWeight: 500 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0, background: 'var(--color-surface-alt)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {p.imageUrl ? <img src={p.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ opacity: 0.25 }}>📦</span>}
                                                    </div>
                                                    {p.name}
                                                </div>
                                            </td>
                                            {viewAll && <td style={{ color: 'var(--color-primary)', fontSize: '0.82rem' }}>{p.categoryName ?? '—'}</td>}
                                            <td style={{ color: 'var(--color-muted)' }}>{p.brandName ?? '—'}</td>
                                            <td><span className={`badge ${BB[p.budgetLevel] || 'badge-neutral'}`}>{p.budgetLevel ?? '—'}</span></td>
                                            <td style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Rs. {Number(p.basePrice).toFixed(2)}</td>
                                            <td>
                                                <button onClick={() => handleToggleStatus(p)} className={`badge ${p.isActive ? 'badge-success' : 'badge-error'}`}
                                                    style={{ cursor: 'pointer', border: 'none', padding: '4px 12px' }}>{p.isActive ? 'In Stock' : 'Out of Stock'}</button>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <button id={`admin-edit-product-${p.id}`} onClick={() => openEdit(p)} className="btn-ghost" style={{ padding: '5px 14px', fontSize: '0.82rem' }}>Edit</button>
                                                    <button id={`admin-delete-product-${p.id}`} onClick={() => handleDelete(p)} className="btn-ghost"
                                                        style={{ padding: '5px 14px', fontSize: '0.82rem', color: 'var(--color-error)', borderColor: 'rgba(220,38,38,0.3)' }}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
