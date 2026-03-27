/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import catalogService from '../services/catalogService';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_FORM = {
    categoryId: '', brandId: '', name: '', description: '',
    basePrice: '', budgetLevel: '', durabilityRating: '', climateSuitability: '',
    maintenanceLevel: '', style: '', isActive: true,
};

// ─────────────────────────────────────────────────────────────────────────────
// Toast
// ─────────────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
    if (!toast.msg) return null;
    return (
        <div style={{
            position: 'fixed', top: 80, right: 24, zIndex: 9999,
            padding: '12px 20px', borderRadius: 12, fontSize: '0.85rem', fontWeight: 500,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            background: toast.isError ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
            color: toast.isError ? '#f87171' : '#4ade80',
            border: `1px solid ${toast.isError ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
        }}>
            {toast.msg}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// AddSubAdminModal — create a new Sub-Admin account
// ─────────────────────────────────────────────────────────────────────────────
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
            onSuccess(`Sub-Admin "${result.email}" created successfully! ✅`);
            onClose();
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to create Sub-Admin.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="card" style={{ width: '100%', maxWidth: 440, padding: '2rem', borderRadius: 16, background: 'var(--color-surface)', border: '2px solid #a78bfa', boxShadow: '0 10px 40px rgba(139,92,246,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#f59e0b' }}>➕ Add Sub-Admin</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '1.2rem' }}>
                    Sub-admins can manage products and brands, but cannot create new admins.
                </p>
                {error && <p style={{ color: '#f87171', fontSize: '0.82rem', marginBottom: '1rem', background: 'rgba(239,68,68,0.08)', padding: '8px 12px', borderRadius: 8 }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', color: '#4c1d95', fontSize: '0.85rem', marginBottom: 4, fontWeight: 700 }}>Email</label>
                        <input type="email" value={form.email} onChange={set('email')} required
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: 'var(--color-surface-alt)', border: '2px solid #c4b5fd', color: '#3b0764', fontSize: '0.9rem', boxSizing: 'border-box', fontWeight: 500 }} />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', color: '#4c1d95', fontSize: '0.85rem', marginBottom: 4, fontWeight: 700 }}>Password</label>
                        <input type="password" value={form.password} onChange={set('password')} required minLength={6}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: 'var(--color-surface-alt)', border: '2px solid #c4b5fd', color: '#3b0764', fontSize: '0.9rem', boxSizing: 'border-box', fontWeight: 500 }} />
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button type="submit" disabled={submitting}
                            style={{ flex: 1, padding: '10px', borderRadius: 10, cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '0.9rem', background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.35)' }}>
                            {submitting ? 'Creating…' : 'Create Sub-Admin'}
                        </button>
                        <button type="button" onClick={onClose}
                            style={{ padding: '10px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', cursor: 'pointer', fontWeight: 500 }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color, loading }) {
    return (
        <div className="card" style={{ padding: '1.5rem', background: 'var(--color-surface)', border: '2px solid #a78bfa', boxShadow: '0 4px 12px rgba(139,92,246,0.1)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>{icon}</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color, marginBottom: 4 }}>
                {loading ? '—' : value}
            </div>
            <div style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>{label}</div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Product Form Modal (used for both Create and Edit)
// ─────────────────────────────────────────────────────────────────────────────
function ProductFormModal({ editingProduct, categories, brands, options, onClose, onSuccess }) {
    const isEdit = Boolean(editingProduct);

    const [form, setForm] = useState(() => {
        if (isEdit) {
            return {
                categoryId: editingProduct.categoryId ?? '',
                brandId: editingProduct.brandId ?? '',
                name: editingProduct.name ?? '',
                description: editingProduct.description ?? '',
                basePrice: editingProduct.basePrice ?? '',
                budgetLevel: editingProduct.budgetLevel ?? '',
                durabilityRating: editingProduct.durabilityRating ?? '',
                climateSuitability: editingProduct.climateSuitability ?? '',
                maintenanceLevel: editingProduct.maintenanceLevel ?? '',
                style: editingProduct.style ?? '',
                isActive: editingProduct.isActive ?? true,
            };
        }
        return EMPTY_FORM;
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    // Image state
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(
        isEdit && editingProduct.imageUrl ? editingProduct.imageUrl : null
    );

    const set = (field) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm((f) => ({ ...f, [field]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setImageFile(null);
        // If editing and had an existing image, restore its preview
        setImagePreview(isEdit && editingProduct.imageUrl ? editingProduct.imageUrl : null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSubmitting(true);
        const payload = {
            ...form,
            categoryId: Number(form.categoryId),
            brandId: Number(form.brandId),
            basePrice: parseFloat(form.basePrice),
            durabilityRating: parseInt(form.durabilityRating, 10),
            isActive: form.isActive,
        };
        try {
            let result;
            if (isEdit) {
                result = await catalogService.updateProduct(editingProduct.id, payload, imageFile || undefined);
            } else {
                result = await catalogService.createProduct(payload, imageFile || undefined);
            }
            onSuccess(`Product "${result.name}" ${isEdit ? 'updated' : 'created'} successfully! ✅`, result);
            onClose();
        } catch (err) {
            const data = err?.response?.data;
            if (data && typeof data === 'object' && !data.message) {
                setErrors(data);
            } else {
                setErrors({ _general: data?.message || `Failed to ${isEdit ? 'update' : 'create'} product.` });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const inp = (field) => ({
        width: '100%', padding: '10px 14px', borderRadius: 8,
        background: 'var(--color-surface-alt)',
        border: errors[field] ? '2px solid #ef4444' : '2px solid #c4b5fd',
        color: '#3b0764', fontSize: '0.9rem', outline: 'none', fontWeight: 500,
    });
    const lbl = { display: 'block', color: '#4c1d95', fontSize: '0.85rem', marginBottom: 4, fontWeight: 700 };
    const err = { color: '#f87171', fontSize: '0.72rem', marginTop: 3, fontWeight: 600 };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div className="glass" style={{ background: 'var(--color-surface)', border: '2px solid #a78bfa', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 680, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 40px rgba(139,92,246,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-text)' }}>
                        {isEdit ? `✏️ Edit: ${editingProduct.name}` : '➕ Add New Product'}
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.4rem' }}>✕</button>
                </div>

                {errors._general && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem' }}>
                        ⚠ {errors._general}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Category + Name */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={lbl}>Category *</label>
                            <select value={form.categoryId} onChange={set('categoryId')} style={inp('categoryId')} required>
                                <option value="">Select category…</option>
                                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            {errors.categoryId && <p style={err}>{errors.categoryId}</p>}
                        </div>
                        <div>
                            <label style={lbl}>Product Name *</label>
                            <input value={form.name} onChange={set('name')} style={inp('name')} placeholder="e.g. Premium Roof Tiles" required />
                            {errors.name && <p style={err}>{errors.name}</p>}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label style={lbl}>Description</label>
                        <textarea value={form.description} onChange={set('description')} rows={2} style={{ ...inp('description'), resize: 'vertical' }} placeholder="Short product description…" />
                        {errors.description && <p style={err}>{errors.description}</p>}
                    </div>

                    {/* Price + Brand */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={lbl}>Base Price *</label>
                            <input type="number" step="0.01" min="0.01" value={form.basePrice} onChange={set('basePrice')} style={inp('basePrice')} placeholder="0.00" required />
                            {errors.basePrice && <p style={err}>{errors.basePrice}</p>}
                        </div>
                        <div>
                            <label style={lbl}>Brand *</label>
                            <select value={form.brandId} onChange={set('brandId')} style={inp('brandId')} required>
                                <option value="">Select brand…</option>
                                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                            {errors.brandId && <p style={err}>{errors.brandId}</p>}
                        </div>
                    </div>

                    {/* Divider */}
                    <p style={{ color: 'var(--color-muted)', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Attributes</p>

                    {/* Budget + Climate */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={lbl}>Budget Level *</label>
                            <select value={form.budgetLevel} onChange={set('budgetLevel')} style={inp('budgetLevel')} required>
                                <option value="">Select…</option>
                                {(options.budgetLevels || ['LOW', 'MEDIUM', 'HIGH']).map((v) => <option key={v} value={v}>{v}</option>)}
                            </select>
                            {errors.budgetLevel && <p style={err}>{errors.budgetLevel}</p>}
                        </div>
                        <div>
                            <label style={lbl}>Climate Suitability *</label>
                            <select value={form.climateSuitability} onChange={set('climateSuitability')} style={inp('climateSuitability')} required>
                                <option value="">Select…</option>
                                {(options.climateSuitabilities || ['TROPICAL', 'ARID', 'TEMPERATE', 'COLD', 'ALL']).map((v) => <option key={v} value={v}>{v}</option>)}
                            </select>
                            {errors.climateSuitability && <p style={err}>{errors.climateSuitability}</p>}
                        </div>
                    </div>

                    {/* Maintenance + Durability */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={lbl}>Maintenance Level *</label>
                            <select value={form.maintenanceLevel} onChange={set('maintenanceLevel')} style={inp('maintenanceLevel')} required>
                                <option value="">Select…</option>
                                {(options.maintenanceLevels || ['LOW', 'MEDIUM', 'HIGH']).map((v) => <option key={v} value={v}>{v}</option>)}
                            </select>
                            {errors.maintenanceLevel && <p style={err}>{errors.maintenanceLevel}</p>}
                        </div>
                        <div>
                            <label style={lbl}>Durability Rating * (1–10)</label>
                            <input type="number" min="1" max="10" value={form.durabilityRating} onChange={set('durabilityRating')} style={inp('durabilityRating')} placeholder="8" required />
                            {errors.durabilityRating && <p style={err}>{errors.durabilityRating}</p>}
                        </div>
                    </div>

                    {/* Style + Status */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'end' }}>
                        <div>
                            <label style={lbl}>Style (optional)</label>
                            <input value={form.style} onChange={set('style')} style={inp('style')} placeholder="e.g. Contemporary, Rustic…" />
                            {errors.style && <p style={err}>{errors.style}</p>}
                        </div>
                        <div>
                            <label style={lbl}>Stock Status</label>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {[{ v: true, label: '✅ In Stock', color: '#15803d' }, { v: false, label: '⛔ Out of Stock', color: '#b91c1c' }].map(({ v, label, color }) => (
                                    <button key={String(v)} type="button" onClick={() => setForm((f) => ({ ...f, isActive: v }))}
                                        style={{
                                            flex: 1, padding: '9px 8px', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                                            background: form.isActive === v ? `${color}22` : 'var(--color-surface-alt)',
                                            border: `2px solid ${form.isActive === v ? color : '#c4b5fd'}`,
                                            color: form.isActive === v ? color : '#4c1d95',
                                            transition: 'all 0.2s',
                                        }}>
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Image Upload ───────────────────────────────────────── */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                        <p style={{ color: '#a78bfa', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>
                            🖼️ Product Image <span style={{ color: '#475569', fontWeight: 400, textTransform: 'none', letterSpacing: 'normal' }}>(optional)</span>
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            {/* Preview box */}
                            <div style={{
                                width: 90, height: 90, borderRadius: 10, flexShrink: 0,
                                border: imagePreview ? '1px solid rgba(139,92,246,0.4)' : '2px dashed rgba(255,255,255,0.12)',
                                background: 'rgba(255,255,255,0.03)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                            }}>
                                {imagePreview
                                    ? <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : <span style={{ fontSize: '2rem', opacity: 0.2 }}>📷</span>}
                            </div>
                            {/* Upload controls */}
                            <div style={{ flex: 1 }}>
                                <label style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px',
                                    borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500,
                                    background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.35)', color: '#a78bfa',
                                }}>
                                    📁 {imageFile ? 'Change image' : (isEdit && editingProduct?.imageUrl ? 'Replace image' : 'Choose image')}
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/gif"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                                <p style={{ color: '#475569', fontSize: '0.73rem', marginTop: 6 }}>
                                    {imageFile
                                        ? `Selected: ${imageFile.name}`
                                        : isEdit && editingProduct?.imageUrl
                                            ? 'Current image kept — choose a file to replace it'
                                            : 'JPG, PNG or WebP — max 10 MB'}
                                </p>
                                {imageFile && (
                                    <button type="button" onClick={clearImage}
                                        style={{ marginTop: 4, padding: '4px 12px', borderRadius: 7, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '0.73rem', cursor: 'pointer' }}>
                                        ✕ Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                        <button type="button" onClick={onClose}
                            style={{ padding: '10px 22px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', cursor: 'pointer' }}>
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting}
                            style={{ padding: '10px 28px', borderRadius: 8, background: 'linear-gradient(135deg, #6c63ff, #a855f7)', border: 'none', color: '#fff', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                            {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────────────────────
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

    // Init: load categories, brands, attribute options
    useEffect(() => {
        Promise.all([
            catalogService.getCategories(),
            catalogService.getBrands(),
            catalogService.getAttributeOptions(),
        ])
            .then(([cats, brnds, opts]) => {
                setCategories(cats);
                setBrands(brnds);
                setOptions(opts);
                if (cats.length > 0) setActiveCatId(cats[0].id);
            })
            .catch(() => showToast('Could not load dashboard data. Is the backend running?', true))
            .finally(() => setLoadingInit(false));
    }, []);

    // Load products when active category or view-all changes
    useEffect(() => {
        if (viewAll) {
            setLoadingProds(true);
            catalogService.getAdminAllProducts()
                .then((page) => { setProducts(page.content ?? []); setTotalProducts(page.totalElements ?? 0); })
                .catch(() => showToast('Could not load all products.', true))
                .finally(() => setLoadingProds(false));
        } else {
            if (!activeCatId) return;
            setLoadingProds(true);
            catalogService.getProductsByCategory(activeCatId, 0, 50)
                .then((page) => { setProducts(page.content ?? []); setTotalProducts(page.totalElements ?? 0); })
                .catch(() => showToast('Could not load products for this category.', true))
                .finally(() => setLoadingProds(false));
        }
    }, [activeCatId, viewAll]);

    const refreshProducts = () => {
        const loader = viewAll
            ? catalogService.getAdminAllProducts()
            : catalogService.getProductsByCategory(activeCatId, 0, 50);
        loader.then((page) => { setProducts(page.content ?? []); setTotalProducts(page.totalElements ?? 0); });
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    const openCreate = () => { setEditingProduct(null); setShowModal(true); };
    const openEdit = (product) => { setEditingProduct(product); setShowModal(true); };
    const closeModal = () => { setShowModal(false); setEditingProduct(null); };

    const handleFormSuccess = (msg, updatedProduct) => {
        showToast(msg);
        if (editingProduct) {
            // Update in-place without re-fetch
            setProducts((prev) => prev.map((p) => p.id === updatedProduct.id ? updatedProduct : p));
        } else {
            refreshProducts();
        }
    };

    const handleDelete = async (product) => {
        if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
        try {
            await catalogService.deleteProduct(product.id);
            showToast(`"${product.name}" deleted.`);
            setProducts((prev) => prev.filter((p) => p.id !== product.id));
            setTotalProducts((prev) => prev - 1);
        } catch (err) {
            showToast(err?.response?.data?.message || 'Failed to delete product.', true);
        }
    };

    const handleToggleStatus = async (product) => {
        const newStatus = !product.isActive;
        try {
            const updated = await catalogService.toggleProductStatus(product.id, newStatus);
            showToast(`"${updated.name}" set to ${newStatus ? 'In Stock ✅' : 'Out of Stock ⛔'}`);
            setProducts((prev) => prev.map((p) => p.id === updated.id ? updated : p));
        } catch {
            showToast('Failed to update stock status.', true);
        }
    };

    if (loadingInit) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner" />
                <p style={{ color: '#64748b', marginLeft: 16 }}>Loading dashboard…</p>
            </div>
        );
    }

    const BUDGET_COLORS = { LOW: { bg: 'rgba(34,197,94,0.12)', fg: '#4ade80' }, MEDIUM: { bg: 'rgba(245,158,11,0.12)', fg: '#fbbf24' }, HIGH: { bg: 'rgba(239,68,68,0.12)', fg: '#f87171' } };

    return (
        <div className="light-theme" style={{ minHeight: '100vh', background: 'var(--bg-color)', padding: '7rem 1.5rem 3rem', position: 'relative' }}>
            {/* Top Purple Line */}


            <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                <Toast toast={toast} />
                {showModal && (
                    <ProductFormModal
                        editingProduct={editingProduct}
                        categories={categories}
                        brands={brands}
                        options={options}
                        onClose={closeModal}
                        onSuccess={handleFormSuccess}
                    />
                )}
                {showSubAdminModal && (
                    <AddSubAdminModal
                        onClose={() => setShowSubAdminModal(false)}
                        onSuccess={(msg) => { showToast(msg); setShowSubAdminModal(false); }}
                    />
                )}

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <p style={{ color: '#8b5cf6', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>Admin Panel</p>
                        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: 'var(--color-text)', marginBottom: 4 }}>Dashboard</h1>
                        <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>Logged in as <span style={{ color: '#8b5cf6' }}>{user?.email}</span>
                            {' '}<span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 9999, background: isFullAdmin ? 'rgba(168,85,247,0.15)' : 'rgba(245,158,11,0.15)', color: isFullAdmin ? '#a78bfa' : '#f59e0b', fontWeight: 600, marginLeft: 4 }}>{user?.role === 'SUB_ADMIN' ? 'Sub-Admin' : 'Admin'}</span>
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button id="admin-add-product-btn" onClick={openCreate}
                            style={{ padding: '10px 22px', borderRadius: 10, background: 'linear-gradient(135deg, #6c63ff, #a855f7)', border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                            + Add Product
                        </button>
                        <button onClick={() => navigate('/admin/rules')}
                            style={{ padding: '10px 18px', borderRadius: 10, background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.35)', color: '#0ea5e9', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                            ⚙️ Manage Rules
                        </button>
                        {isFullAdmin && (
                            <button onClick={() => setShowSubAdminModal(true)}
                                style={{ padding: '10px 18px', borderRadius: 10, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.35)', color: '#f59e0b', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                                + Add Sub-Admin
                            </button>
                        )}
                        <button onClick={handleLogout}
                            style={{ padding: '10px 18px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', cursor: 'pointer', fontSize: '0.9rem' }}>
                            Logout
                        </button>
                    </div>
                </div>

                {/* Stat Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                    <StatCard icon="🏷️" label="Categories" value={categories.length} color="#f59e0b" loading={false} />
                    <StatCard icon="📦" label="Products Shown" value={totalProducts} color="#6c63ff" loading={loadingProds} />
                    <StatCard icon="✅" label="In Stock" value={products.filter((p) => p.isActive).length} color="#10b981" loading={loadingProds} />
                    <StatCard icon="⛔" label="Out of Stock" value={products.filter((p) => !p.isActive).length} color="#ef4444" loading={loadingProds} />
                </div>

                {/* Category Tabs + All Products */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '1rem', alignItems: 'center' }}>
                    <button onClick={() => { setViewAll(true); setActiveCatId(null); }} style={{
                        padding: '7px 16px', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.83rem',
                        fontWeight: viewAll ? 700 : 400,
                        border: viewAll ? '1px solid rgba(251,191,36,0.7)' : '1px solid rgba(255,255,255,0.08)',
                        background: viewAll ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.03)',
                        color: viewAll ? '#fbbf24' : '#64748b', transition: 'all 0.2s',
                    }}>⭐ All Products</button>
                    <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
                    {categories.map((cat) => (
                        <button key={cat.id} onClick={() => { setActiveCatId(cat.id); setViewAll(false); }} style={{
                            padding: '7px 16px', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.83rem',
                            fontWeight: !viewAll && activeCatId === cat.id ? 600 : 400,
                            border: !viewAll && activeCatId === cat.id ? '1px solid rgba(139,92,246,0.6)' : '1px solid rgba(255,255,255,0.08)',
                            background: !viewAll && activeCatId === cat.id ? 'rgba(139,92,246,0.18)' : 'rgba(255,255,255,0.03)',
                            color: !viewAll && activeCatId === cat.id ? '#a78bfa' : '#64748b', transition: 'all 0.2s',
                        }}>{cat.name}</button>
                    ))}
                </div>

                {/* Products Table */}
                <div className="glass" style={{ overflow: 'hidden', borderRadius: 14, border: '2px solid #a78bfa', boxShadow: '0 4px 12px rgba(139,92,246,0.1)' }}>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '2px solid #a78bfa', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-surface)' }}>
                        <h2 style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.95rem' }}>
                            {viewAll ? 'All Products' : categories.find((c) => c.id === activeCatId)?.name ?? 'Products'}
                        </h2>
                        <span style={{ color: 'var(--color-muted)', fontSize: '0.78rem' }}>{totalProducts} total</span>
                    </div>

                    {loadingProds ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>
                    ) : products.length === 0 ? (
                        <div style={{ padding: '4rem', textAlign: 'center', color: '#475569' }}>
                            <p style={{ fontSize: '2.5rem', marginBottom: 12 }}>📭</p>
                            <p style={{ color: '#64748b' }}>No products here yet.</p>
                            <p style={{ fontSize: '0.78rem', marginTop: 8 }}>Click <strong style={{ color: '#a78bfa' }}>+ Add Product</strong> to create the first one.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table id="admin-products-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', background: 'var(--color-surface)' }}>
                                <thead>
                                    <tr style={{ color: 'var(--color-muted)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.08em', borderBottom: '1px solid var(--color-border)' }}>
                                        {(viewAll ? ['Product', 'Category', 'Brand', 'Budget', 'Price', 'Status', 'Actions'] : ['Product', 'Brand', 'Budget', 'Price', 'Status', 'Actions']).map((h) => (
                                            <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600 }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p) => (
                                        <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s' }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-alt)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                            <td style={{ padding: '10px 16px', color: 'var(--color-text)', fontWeight: 500 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div style={{ width: 36, height: 36, borderRadius: 7, overflow: 'hidden', flexShrink: 0, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {p.imageUrl
                                                            ? <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            : <span style={{ fontSize: '1rem', opacity: 0.25 }}>🖼️</span>}
                                                    </div>
                                                    {p.name}
                                                </div>
                                            </td>
                                            {viewAll && <td style={{ padding: '12px 16px', color: '#8b5cf6', fontSize: '0.8rem' }}>{p.categoryName ?? '—'}</td>}
                                            <td style={{ padding: '12px 16px', color: 'var(--color-muted)' }}>{p.brandName ?? '—'}</td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{
                                                    padding: '2px 10px', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 600,
                                                    background: BUDGET_COLORS[p.budgetLevel]?.bg || 'rgba(148,163,184,0.1)',
                                                    color: BUDGET_COLORS[p.budgetLevel]?.fg || '#94a3b8',
                                                }}>{p.budgetLevel ?? '—'}</span>
                                            </td>
                                            <td style={{ padding: '12px 16px', color: '#a78bfa', fontWeight: 700 }}>Rs. {Number(p.basePrice).toFixed(2)}</td>
                                            {/* Stock toggle */}
                                            <td style={{ padding: '12px 16px' }}>
                                                <button
                                                    onClick={() => handleToggleStatus(p)}
                                                    title="Click to toggle In Stock / Out of Stock"
                                                    style={{
                                                        padding: '3px 12px', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', border: 'none',
                                                        background: p.isActive ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                                                        color: p.isActive ? '#4ade80' : '#f87171',
                                                        transition: 'all 0.2s',
                                                    }}>
                                                    {p.isActive ? '✅ In Stock' : '⛔ Out of Stock'}
                                                </button>
                                            </td>
                                            {/* Actions */}
                                            <td style={{ padding: '12px 16px' }}>
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <button
                                                        id={`admin-edit-product-${p.id}`}
                                                        onClick={() => openEdit(p)}
                                                        style={{ padding: '5px 14px', borderRadius: 8, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa', transition: 'all 0.2s' }}
                                                        onMouseEnter={(e) => e.target.style.background = 'rgba(139,92,246,0.25)'}
                                                        onMouseLeave={(e) => e.target.style.background = 'rgba(139,92,246,0.12)'}>
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        id={`admin-delete-product-${p.id}`}
                                                        onClick={() => handleDelete(p)}
                                                        style={{ padding: '5px 14px', borderRadius: 8, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', transition: 'all 0.2s' }}
                                                        onMouseEnter={(e) => e.target.style.background = 'rgba(239,68,68,0.22)'}
                                                        onMouseLeave={(e) => e.target.style.background = 'rgba(239,68,68,0.10)'}>
                                                        🗑 Delete
                                                    </button>
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
