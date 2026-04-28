/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
    Plus, Pencil, Trash2, CheckCircle, XCircle, 
    Image as ImageIcon, Upload, X, Package, Layers, 
    Check, AlertTriangle, Star
} from 'lucide-react';
import catalogService from '../services/catalogService';
import { toAbsoluteImageUrl } from '../utils/imageUtils';
import './AdminDashboardUnified.css';

const EMPTY_FORM = {
    categoryId: '', brandId: '', name: '', description: '',
    basePrice: '', budgetLevel: '', durabilityRating: '', climateSuitability: '',
    maintenanceLevel: '', style: '', isActive: true,
};

/* ── Product Form Modal ──────────────────────────────────────────────────── */
function ProductFormModal({ editingProduct, categories, brands, options, onClose, onSuccess }) {
    const isEdit = Boolean(editingProduct);

    // Lock background scroll while modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

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
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState(() => {
        if (isEdit && editingProduct.imageUrls) {
            return editingProduct.imageUrls.map(toAbsoluteImageUrl);
        }
        return [];
    });
    const [mainImageIndex, setMainImageIndex] = useState(0);

    const set = (field) => (e) => { const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value; setForm((f) => ({ ...f, [field]: v })); };
    const handleImageChange = (e) => { const files = Array.from(e.target.files || []); setImageFiles(files); setMainImageIndex(0); if (files.length > 0) setImagePreviews(files.map(f => URL.createObjectURL(f))); else setImagePreviews([]); };
    const clearImage = () => { setImageFiles([]); setMainImageIndex(0); setImagePreviews(isEdit && editingProduct.imageUrls ? editingProduct.imageUrls.map(toAbsoluteImageUrl) : []); };

    const handleSubmit = async (e) => {
        e.preventDefault(); setErrors({}); setSubmitting(true);
        const payload = { ...form, categoryId: Number(form.categoryId), brandId: Number(form.brandId), basePrice: parseFloat(form.basePrice), durabilityRating: parseInt(form.durabilityRating, 10), isActive: form.isActive, mainImageIndex };
        try {
            const result = isEdit ? await catalogService.updateProduct(editingProduct.id, payload, imageFiles) : await catalogService.createProduct(payload, imageFiles);
            onSuccess(`Product "${result.name}" ${isEdit ? 'updated' : 'created'} successfully!`, result); onClose();
        } catch (err) {
            const data = err?.response?.data;
            if (data && typeof data === 'object' && !data.message) setErrors(data);
            else setErrors({ _general: data?.message || `Failed to ${isEdit ? 'update' : 'create'} product.` });
        } finally { setSubmitting(false); }
    };

    const inp = (field) => ({ width: '100%', padding: '10px 14px', borderRadius: 8, background: '#f5f3ff', border: errors[field] ? '2px solid #ef4444' : '1.5px solid #c4b5fd', color: '#1e1b4b', fontSize: '0.9rem', outline: 'none', fontWeight: 500, boxSizing: 'border-box' });
    const lbl = { display: 'block', color: '#4c1d95', fontSize: '0.85rem', marginBottom: 4, fontWeight: 700 };
    const errS = { color: '#f87171', fontSize: '0.72rem', marginTop: 3, fontWeight: 600 };

    return createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div className="admin-modal-content" style={{ maxWidth: 680, maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #ede9fe', paddingBottom: '1rem' }}>
                    <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#1e1b4b', display: 'flex', alignItems: 'center', gap: 10 }}>
                        {isEdit ? <Pencil size={20} color="#7c3aed" /> : <Plus size={20} color="#7c3aed" />}
                        {isEdit ? `Edit: ${editingProduct.name}` : 'Add New Product'}
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex' }}><X size={24} /></button>
                </div>
                {errors._general && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}><AlertTriangle size={16} /> {errors._general}</div>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div><label style={lbl}>Category *</label><select value={form.categoryId} onChange={set('categoryId')} style={inp('categoryId')} required><option value="">Select…</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>{errors.categoryId && <p style={errS}>{errors.categoryId}</p>}</div>
                        <div><label style={lbl}>Product Name *</label><input value={form.name} onChange={set('name')} style={inp('name')} placeholder="e.g. Premium Roof Tiles" required />{errors.name && <p style={errS}>{errors.name}</p>}</div>
                    </div>
                    <div><label style={lbl}>Description</label><textarea value={form.description} onChange={set('description')} rows={2} style={{ ...inp('description'), resize: 'vertical' }} placeholder="Short product description…" />{errors.description && <p style={errS}>{errors.description}</p>}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div><label style={lbl}>Base Price *</label><input type="number" step="0.01" min="0.01" value={form.basePrice} onChange={set('basePrice')} style={inp('basePrice')} placeholder="0.00" required />{errors.basePrice && <p style={errS}>{errors.basePrice}</p>}</div>
                        <div><label style={lbl}>Brand *</label><select value={form.brandId} onChange={set('brandId')} style={inp('brandId')} required><option value="">Select…</option>{brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select>{errors.brandId && <p style={errS}>{errors.brandId}</p>}</div>
                    </div>
                    <p style={{ color: 'var(--color-muted)', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Attributes</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div><label style={lbl}>Budget Level *</label><select value={form.budgetLevel} onChange={set('budgetLevel')} style={inp('budgetLevel')} required><option value="">Select…</option>{(options.budgetLevels || ['LOW', 'MEDIUM', 'HIGH']).map(v => <option key={v} value={v}>{v}</option>)}</select>{errors.budgetLevel && <p style={errS}>{errors.budgetLevel}</p>}</div>
                        <div><label style={lbl}>Climate Suitability *</label><select value={form.climateSuitability} onChange={set('climateSuitability')} style={inp('climateSuitability')} required><option value="">Select…</option>{(options.climateSuitabilities || ['TROPICAL', 'ARID', 'TEMPERATE', 'COLD', 'ALL']).map(v => <option key={v} value={v}>{v}</option>)}</select>{errors.climateSuitability && <p style={errS}>{errors.climateSuitability}</p>}</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div><label style={lbl}>Maintenance Level *</label><select value={form.maintenanceLevel} onChange={set('maintenanceLevel')} style={inp('maintenanceLevel')} required><option value="">Select…</option>{(options.maintenanceLevels || ['LOW', 'MEDIUM', 'HIGH']).map(v => <option key={v} value={v}>{v}</option>)}</select>{errors.maintenanceLevel && <p style={errS}>{errors.maintenanceLevel}</p>}</div>
                        <div><label style={lbl}>Durability Rating * (1–10)</label><input type="number" min="1" max="10" value={form.durabilityRating} onChange={set('durabilityRating')} style={inp('durabilityRating')} placeholder="8" required />{errors.durabilityRating && <p style={errS}>{errors.durabilityRating}</p>}</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'end' }}>
                        <div><label style={lbl}>Style (optional)</label><input value={form.style} onChange={set('style')} style={inp('style')} placeholder="e.g. Modern" />{errors.style && <p style={errS}>{errors.style}</p>}</div>
                        <div>
                            <label style={lbl}>Stock Status</label>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {[{ v: true, label: 'In Stock', icon: <CheckCircle size={16} />, color: '#059669' }, { v: false, label: 'Out of Stock', icon: <XCircle size={16} />, color: '#dc2626' }].map(({ v, label, icon, color }) => (
                                    <button key={String(v)} type="button" onClick={() => setForm((f) => ({ ...f, isActive: v }))}
                                        style={{
                                            flex: 1, padding: '9px 8px', borderRadius: 10, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                                            background: form.isActive === v ? `${color}12` : '#f5f3ff',
                                            border: `1.5px solid ${form.isActive === v ? color : '#ddd6fe'}`,
                                            color: form.isActive === v ? color : '#6b7280',
                                            transition: 'all 0.2s',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                                        }}>
                                        {icon} {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Images */}
                    <div style={{ borderTop: '1px solid #ede9fe', paddingTop: '1rem' }}>
                        <p style={{ color: '#7c3aed', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <ImageIcon size={16} /> Product Images <span style={{ color: '#94a3b8', fontWeight: 400, textTransform: 'none', letterSpacing: 'normal' }}>(optional, up to 5)</span>
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '250px' }}>
                                <label style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px',
                                    borderRadius: 10, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                                    background: 'rgba(124,58,237,0.1)', border: '1.5px solid rgba(124,58,237,0.2)', color: '#7c3aed',
                                }}>
                                    <Upload size={16} /> {imageFiles.length > 0 ? `Change ${imageFiles.length} images` : (isEdit && editingProduct?.imageUrls?.length > 0 ? 'Replace images' : 'Choose images')}
                                    <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: 'none' }} />
                                </label>
                                {imageFiles.length > 0 && (
                                    <button type="button" onClick={clearImage}
                                        style={{ marginLeft: 8, padding: '8px 12px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}>
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', maxWidth: 350 }}>
                                {imagePreviews.length > 0 ? imagePreviews.map((url, idx) => (
                                    <div key={idx} onClick={() => setMainImageIndex(idx)} style={{ width: 70, height: 70, borderRadius: 10, flexShrink: 0, border: mainImageIndex === idx ? '3px solid #8b5cf6' : '1px solid rgba(139,92,246,0.3)', background: 'rgba(255,255,255,0.03)', overflow: 'hidden', position: 'relative', cursor: 'pointer', transition: 'all 0.2s' }}>
                                        <img src={url} alt={`preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: mainImageIndex === idx ? 1 : 0.7 }} />
                                        {mainImageIndex === idx && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#8b5cf6', color: '#fff', fontSize: '9px', fontWeight: 800, textAlign: 'center', padding: '2px 0' }}>MAIN</div>}
                                    </div>
                                )) : <div style={{
                                    width: 70, height: 70, borderRadius: 10, flexShrink: 0,
                                    border: '2px dashed #ddd6fe', background: '#f5f3ff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <ImageIcon size={24} color="#ddd6fe" />
                                </div>}
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                        <button type="button" onClick={onClose}
                            style={{ padding: '10px 22px', borderRadius: 8, background: '#f5f3ff', border: '1.5px solid #ddd6fe', color: '#6b7280', cursor: 'pointer', fontWeight: 500 }}>
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting}
                            style={{ padding: '10px 28px', borderRadius: 8, background: 'linear-gradient(135deg, #6c63ff, #a855f7)', border: 'none', color: '#fff', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                            {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

/* ── Product Management Panel ────────────────────────────────────────────── */
export default function AdminProductPanel({ showToast }) {
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

    useEffect(() => {
        Promise.all([catalogService.getCategories(), catalogService.getBrands(), catalogService.getAttributeOptions()])
            .then(([cats, brnds, opts]) => { setCategories(cats); setBrands(brnds); setOptions(opts); if (cats.length > 0) setActiveCatId(cats[0].id); })
            .catch(() => showToast('Could not load dashboard data.', true))
            .finally(() => setLoadingInit(false));
    }, [showToast]);

    useEffect(() => {
        if (viewAll) {
            setLoadingProds(true);
            catalogService.getAdminAllProducts()
                .then(page => { setProducts(page.content ?? []); setTotalProducts(page.totalElements ?? 0); })
                .catch(() => showToast('Could not load all products.', true))
                .finally(() => setLoadingProds(false));
        } else {
            if (!activeCatId) return;
            setLoadingProds(true);
            catalogService.getProductsByCategory(activeCatId, 0, 50)
                .then(page => { setProducts(page.content ?? []); setTotalProducts(page.totalElements ?? 0); })
                .catch(() => showToast('Could not load products.', true))
                .finally(() => setLoadingProds(false));
        }
    }, [activeCatId, viewAll, showToast]);

    const refreshProducts = () => {
        const loader = viewAll ? catalogService.getAdminAllProducts() : catalogService.getProductsByCategory(activeCatId, 0, 50);
        loader.then(page => { setProducts(page.content ?? []); setTotalProducts(page.totalElements ?? 0); });
    };

    const openCreate = () => { setEditingProduct(null); setShowModal(true); };
    const openEdit = (p) => { setEditingProduct(p); setShowModal(true); };
    const closeModal = () => { setShowModal(false); setEditingProduct(null); };

    const handleFormSuccess = (msg, updatedProduct) => {
        showToast(msg);
        if (editingProduct) setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        else refreshProducts();
    };

    const handleDelete = async (product) => {
        if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
        try { await catalogService.deleteProduct(product.id); showToast(`"${product.name}" deleted.`); setProducts(prev => prev.filter(p => p.id !== product.id)); setTotalProducts(prev => prev - 1); }
        catch (err) { showToast(err?.response?.data?.message || 'Failed to delete.', true); }
    };

    const handleToggleStatus = async (product) => {
        try { const updated = await catalogService.toggleProductStatus(product.id, !product.isActive); showToast(`"${updated.name}" → ${updated.isActive ? 'In Stock' : 'Out of Stock'}`); setProducts(prev => prev.map(p => p.id === updated.id ? updated : p)); }
        catch { showToast('Failed to update stock status.', true); }
    };

    const BUDGET_COLORS = { LOW: { bg: 'rgba(34,197,94,0.1)', fg: '#059669' }, MEDIUM: { bg: 'rgba(245,158,11,0.1)', fg: '#d97706' }, HIGH: { bg: 'rgba(239,68,68,0.1)', fg: '#dc2626' } };

    if (loadingInit) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /><p style={{ color: '#6b7280', marginLeft: 16 }}>Loading…</p></div>;

    return (
        <div className="admin-panel-enter">
            {showModal && <ProductFormModal editingProduct={editingProduct} categories={categories} brands={brands} options={options} onClose={closeModal} onSuccess={handleFormSuccess} />}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
                <div className="panel-header" style={{ marginBottom: 0 }}>
                    <p className="panel-label">Inventory</p>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Package size={32} color="#7c3aed" /> Product Management
                    </h1>
                    <p className="panel-desc">Add, edit, and manage products in the system catalog.</p>
                </div>
                <button className="admin-btn-primary" onClick={openCreate}>
                    <Plus size={18} /> Add Product
                </button>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
                {[
                    { icon: <Layers size={20} />, label: 'Categories', value: categories.length, color: '#f59e0b' },
                    { icon: <Package size={20} />, label: 'Products Shown', value: totalProducts, color: '#7c3aed' },
                    { icon: <CheckCircle size={20} />, label: 'In Stock', value: products.filter(p => p.isActive).length, color: '#059669' },
                    { icon: <XCircle size={20} />, label: 'Out of Stock', value: products.filter(p => !p.isActive).length, color: '#dc2626' },
                ].map(s => (
                    <div key={s.label} className="admin-card stat-card">
                        <div className="stat-accent-bar" style={{ background: s.color }} />
                        <div className="stat-icon" style={{ color: s.color }}>{s.icon}</div>
                        <div className="stat-value" style={{ color: s.color }}>{loadingProds ? '—' : s.value}</div>
                        <div className="stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Category tabs */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24, borderBottom: '1px solid #ede9fe', paddingBottom: 14 }}>
                <button onClick={() => { setViewAll(true); setActiveCatId(null); }} className={`admin-tab${viewAll ? ' active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Star size={14} /> All Products
                </button>
                {categories.map(cat => (
                    <button key={cat.id} onClick={() => { setActiveCatId(cat.id); setViewAll(false); }} className={`admin-tab${!viewAll && activeCatId === cat.id ? ' active' : ''}`}>{cat.name}</button>
                ))}
            </div>

            {/* Products table */}
            <div className="admin-card" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: '2px solid #ede9fe', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '0.95rem' }}>{viewAll ? 'All Products' : categories.find(c => c.id === activeCatId)?.name ?? 'Products'}</h2>
                    <span style={{ color: '#9ca3af', fontSize: '0.78rem' }}>{totalProducts} total</span>
                </div>
                {loadingProds ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>
                ) : products.length === 0 ? (
                    <div style={{ padding: '4rem', textAlign: 'center', color: '#9ca3af' }}>
                        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                            <Package size={48} color="#ddd6fe" />
                        </div>
                        <p style={{ fontWeight: 600, color: '#64748b' }}>No products found.</p>
                        <p style={{ fontSize: '0.82rem', marginTop: 4 }}>Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    {viewAll && <th>Category</th>}
                                    <th>Brand</th><th>Budget</th><th>Price</th><th>Status</th><th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#f5f3ff', border: '1.5px solid #ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {p.imageUrls && p.imageUrls.length > 0
                                                        ? <img src={toAbsoluteImageUrl(p.imageUrls[0])} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        : <ImageIcon size={18} color="#ddd6fe" />}
                                                </div>
                                                <span style={{ fontWeight: 600, color: '#1e1b4b' }}>{p.name}</span>
                                            </div>
                                        </td>
                                        {viewAll && <td style={{ color: '#7c3aed', fontSize: '0.8rem', fontWeight: 600 }}>{p.categoryName ?? '—'}</td>}
                                        <td style={{ color: '#6b7280' }}>{p.brandName ?? '—'}</td>
                                        <td><span className="admin-badge" style={{ background: BUDGET_COLORS[p.budgetLevel]?.bg || '#f3f4f6', color: BUDGET_COLORS[p.budgetLevel]?.fg || '#6b7280' }}>{p.budgetLevel ?? '—'}</span></td>
                                        <td style={{ color: '#7c3aed', fontWeight: 700 }}>Rs. {Number(p.basePrice).toFixed(2)}</td>
                                        <td>
                                            <button onClick={() => handleToggleStatus(p)} title="Click to toggle status"
                                            style={{
                                                padding: '4px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', border: 'none',
                                                background: p.isActive ? 'rgba(5,150,105,0.1)' : 'rgba(220,38,38,0.1)',
                                                color: p.isActive ? '#059669' : '#dc2626',
                                                display: 'flex', alignItems: 'center', gap: 4
                                            }}>
                                            {p.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                            {p.isActive ? 'In Stock' : 'Out of Stock'}
                                        </button>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button onClick={() => openEdit(p)} title="Edit Product"
                                                    style={{ padding: '6px', borderRadius: 8, cursor: 'pointer', background: 'rgba(124,58,237,0.1)', border: '1.5px solid rgba(124,58,237,0.2)', color: '#7c3aed', display: 'flex' }}>
                                                    <Pencil size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(p)} title="Delete Product"
                                                    style={{ padding: '6px', borderRadius: 8, cursor: 'pointer', background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.2)', color: '#ef4444', display: 'flex' }}>
                                                    <Trash2 size={16} />
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
    );
}
