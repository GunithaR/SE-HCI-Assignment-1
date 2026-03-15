/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import catalogService from '../services/catalogService';

// ── Product Card ─────────────────────────────────────────────────────────────
// Reads the FLAT ProductResponseDTO shape returned by our Phase 2 API:
// { id, name, description, basePrice, brandName, categoryName,
//   budgetLevel, durabilityRating, climateSuitability, maintenanceLevel, style }
function ProductCard({ product }) {
    const budgetColor = {
        LOW: '#22c55e',
        MEDIUM: '#f59e0b',
        HIGH: '#ef4444',
    }[product.budgetLevel] || '#94a3b8';

    return (
        <div className="card fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 0, overflow: 'hidden', padding: 0, background: 'var(--color-surface)', border: '2px solid #a78bfa', boxShadow: '0 4px 12px rgba(139,92,246,0.1)' }}>
            {/* Product Image */}
            {product.imageUrl && (
                <div style={{ width: '100%', height: 180, overflow: 'hidden', background: 'var(--color-surface-alt)' }}>
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
                    />
                </div>
            )}

            {/* Card body */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '1.25rem', flex: 1 }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h3 style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.95rem', marginBottom: 2 }}>
                            {product.name}
                        </h3>
                        <p style={{ color: '#64748b', fontSize: '0.75rem' }}>
                            {product.brandName && <span>{product.brandName} · </span>}
                            {product.categoryName}
                        </p>
                    </div>
                    {product.budgetLevel && (
                        <span style={{
                            background: budgetColor + '22',
                            color: budgetColor,
                            border: `1px solid ${budgetColor}44`,
                            borderRadius: '9999px',
                            padding: '2px 10px',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                        }}>
                            {product.budgetLevel}
                        </span>
                    )}
                </div>

                {/* Description */}
                <p style={{ color: 'var(--color-muted)', fontSize: '0.78rem', lineHeight: 1.6, flex: 1 }}>
                    {product.description || 'No description available.'}
                </p>

                {/* Attribute badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {product.climateSuitability && (
                        <span style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '9999px', padding: '2px 8px', fontSize: '0.7rem' }}>
                            ☁ {product.climateSuitability}
                        </span>
                    )}
                    {product.maintenanceLevel && (
                        <span style={{ background: 'rgba(20,184,166,0.15)', color: '#14b8a6', border: '1px solid rgba(20,184,166,0.3)', borderRadius: '9999px', padding: '2px 8px', fontSize: '0.7rem' }}>
                            🔧 {product.maintenanceLevel}
                        </span>
                    )}
                    {product.style && (
                        <span style={{ background: 'var(--color-surface-alt)', color: 'var(--color-muted)', border: '1px solid var(--color-border)', borderRadius: '9999px', padding: '2px 8px', fontSize: '0.7rem' }}>
                            {product.style}
                        </span>
                    )}
                </div>

                {/* Footer: price + durability */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: '1.1rem' }}>
                        ${Number(product.basePrice).toFixed(2)}
                    </span>
                    {product.durabilityRating && (
                        <span style={{ color: '#64748b', fontSize: '0.72rem' }}>
                            Durability: <strong style={{ color: '#94a3b8' }}>{product.durabilityRating}/10</strong>
                        </span>
                    )}
                </div>
            </div>{/* end card body */}
        </div>
    );
}

// ── Catalog Page ─────────────────────────────────────────────────────────────
export default function Catalog() {
    const [categories, setCategories] = useState([]);
    const [activeCategoryId, setActiveCategoryId] = useState(null);
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0 });
    const [loadingCats, setLoadingCats] = useState(true);
    const [loadingProds, setLoadingProds] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [search, setSearch] = useState('');

    const [brands, setBrands] = useState([]);
    const [attrOptions, setAttrOptions] = useState({ sizes: [], materials: [] });

    const [brandId, setBrandId] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [productSize, setProductSize] = useState('');
    const [material, setMaterial] = useState('');

    // 1. Load categories on mount
    useEffect(() => {
        catalogService
            .getCategories()
            .then((cats) => {
                setCategories(cats);
                if (cats.length > 0) setActiveCategoryId(cats[0].id); // auto-select first
            })
            .catch(() => setError('Could not load categories. Is the backend running on :8080?'))
            .finally(() => setLoadingCats(false));
    }, []);

    // 1b. Load filter options (brands, sizes/materials)
    useEffect(() => {
        Promise.all([catalogService.getBrands(), catalogService.getAttributeOptions()])
            .then(([b, opts]) => {
                setBrands(b ?? []);
                setAttrOptions({
                    sizes: opts?.sizes ?? [],
                    materials: opts?.materials ?? [],
                });
            })
            .catch(() => {
                // Non-fatal: the catalog can still load without filters.
            });
    }, []);

    // 2. Load products whenever the active category or page changes
    useEffect(() => {
        if (!activeCategoryId) return;
        setLoadingProds(true);
        setError('');
        setInfo('');

        const filters = {
            ...(brandId ? { brandId: Number(brandId) } : {}),
            ...(minPrice ? { minPrice: Number(minPrice) } : {}),
            ...(maxPrice ? { maxPrice: Number(maxPrice) } : {}),
            ...(productSize ? { productSize } : {}),
            ...(material ? { material } : {}),
        };

        catalogService
            .getProductsByCategory(activeCategoryId, pagination.page, 12, filters)
            .then((pageData) => {
                // Spring Page shape: { content, totalPages, totalElements, number }
                setProducts(pageData.content ?? []);
                setPagination((prev) => ({
                    ...prev,
                    totalPages: pageData.totalPages ?? 0,
                    totalElements: pageData.totalElements ?? 0,
                }));
            })
            .catch((err) => {
                const msg = err?.response?.data?.message
                    || err?.response?.data?.error
                    || 'Could not load products for this category.';
                setError(msg);
            })
            .finally(() => setLoadingProds(false));
    }, [activeCategoryId, pagination.page, brandId, minPrice, maxPrice, productSize, material]);

    // When switching categories, reset to page 0
    const handleCategoryChange = (catId) => {
        setActiveCategoryId(catId);
        setPagination({ page: 0, totalPages: 0, totalElements: 0 });
        setSearch('');
        setBrandId('');
        setMinPrice('');
        setMaxPrice('');
        setProductSize('');
        setMaterial('');
    };

    const filteredProducts = search
        ? products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
        : products;

    return (
        <div className="light-theme" style={{ minHeight: '100vh', padding: '7rem 1.5rem 3rem', background: 'var(--bg-color)', position: 'relative' }}>
            {/* Top Purple Line */}


            <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: 6, color: 'var(--color-text)' }}>
                    Product Catalog
                </h1>
                <p style={{ color: 'var(--color-muted)', marginBottom: '2rem' }}>
                    Browse construction materials by category.
                </p>

                {/* ── Category Tab Bar ────────────────────────────────────────── */}
                {loadingCats ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                        <div className="spinner" />
                    </div>
                ) : (
                    <div style={{
                        display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: '1.5rem',
                        borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem'
                    }}>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                style={{
                                    padding: '8px 18px',
                                    borderRadius: '9999px',
                                    border: activeCategoryId === cat.id
                                        ? '2px solid #8b5cf6'
                                        : '2px solid #c4b5fd',
                                    background: activeCategoryId === cat.id
                                        ? 'rgba(139,92,246,0.1)'
                                        : 'var(--color-surface)',
                                    color: activeCategoryId === cat.id ? '#8b5cf6' : '#4c1d95',
                                    fontWeight: activeCategoryId === cat.id ? 700 : 500,
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── Search within category ───────────────────────────────────── */}
                <div style={{ marginBottom: '1rem', maxWidth: 520, display: 'grid', gap: 10 }}>
                    <input
                        id="catalog-search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products in this category…"
                        className="input-field"
                        style={{ width: '100%', border: '2px solid #c4b5fd', color: '#3b0764', fontWeight: 500, background: 'var(--color-surface)' }}
                    />

                    {/* Filters */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
                        <select
                            value={brandId}
                            onChange={(e) => { setBrandId(e.target.value); setPagination((p) => ({ ...p, page: 0 })); }}
                            className="input-field"
                            style={{ border: '2px solid #c4b5fd', color: '#3b0764', fontWeight: 500, background: 'var(--color-surface)' }}
                        >
                            <option value="">All brands</option>
                            {brands.map((b) => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>

                        <select
                            value={material}
                            onChange={(e) => { setMaterial(e.target.value); setPagination((p) => ({ ...p, page: 0 })); }}
                            className="input-field"
                            style={{ border: '2px solid #c4b5fd', color: '#3b0764', fontWeight: 500, background: 'var(--color-surface)' }}
                        >
                            <option value="">All materials</option>
                            {(attrOptions.materials ?? []).map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>

                        <select
                            value={productSize}
                            onChange={(e) => { setProductSize(e.target.value); setPagination((p) => ({ ...p, page: 0 })); }}
                            className="input-field"
                            style={{ border: '2px solid #c4b5fd', color: '#3b0764', fontWeight: 500, background: 'var(--color-surface)' }}
                        >
                            <option value="">All sizes</option>
                            {(attrOptions.sizes ?? []).map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
                            <input
                                value={minPrice}
                                onChange={(e) => { setMinPrice(e.target.value); setPagination((p) => ({ ...p, page: 0 })); }}
                                placeholder="Min price"
                                inputMode="decimal"
                                className="input-field"
                                style={{ width: '100%', border: '2px solid #c4b5fd', color: '#3b0764', fontWeight: 500, background: 'var(--color-surface)' }}
                            />
                            <input
                                value={maxPrice}
                                onChange={(e) => { setMaxPrice(e.target.value); setPagination((p) => ({ ...p, page: 0 })); }}
                                placeholder="Max price"
                                inputMode="decimal"
                                className="input-field"
                                style={{ width: '100%', border: '2px solid #c4b5fd', color: '#3b0764', fontWeight: 500, background: 'var(--color-surface)' }}
                            />
                        </div>
                    </div>

                    {(brandId || minPrice || maxPrice || productSize || material) && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                            <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
                                Filters active
                            </div>
                            <button
                                onClick={() => {
                                    setBrandId('');
                                    setMinPrice('');
                                    setMaxPrice('');
                                    setProductSize('');
                                    setMaterial('');
                                    setPagination((p) => ({ ...p, page: 0 }));
                                }}
                                style={{
                                    padding: '6px 10px',
                                    borderRadius: 8,
                                    background: 'rgba(139,92,246,0.12)',
                                    border: '1px solid rgba(139,92,246,0.3)',
                                    color: '#7c3aed',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                }}
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>

                {/* ── Error state ──────────────────────────────────────────────── */}
                {error && (
                    <div className="glass" style={{ padding: '1.5rem', textAlign: 'center', color: '#f87171', marginBottom: '1.5rem' }}>
                        {error}
                    </div>
                )}
                {!error && info && (
                    <div className="glass" style={{ padding: '0.9rem 1.2rem', textAlign: 'center', color: '#475569', marginBottom: '1.2rem', fontSize: '0.85rem' }}>
                        {info}
                    </div>
                )}

                {/* ── Products grid ────────────────────────────────────────────── */}
                {loadingProds ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                        <div className="spinner" />
                    </div>
                ) : !error && filteredProducts.length === 0 ? (
                    <div className="glass" style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
                        <p style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📭</p>
                        {brandId || minPrice || maxPrice || productSize || material ? (
                            <>
                                <p>No products match the selected filters.</p>
                                <p style={{ fontSize: '0.8rem', marginTop: 8, color: '#475569' }}>
                                    Try relaxing one or more filters or{' '}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setBrandId('');
                                            setMinPrice('');
                                            setMaxPrice('');
                                            setProductSize('');
                                            setMaterial('');
                                            setPagination((p) => ({ ...p, page: 0 }));
                                        }}
                                        style={{
                                            border: 'none',
                                            background: 'transparent',
                                            color: '#7c3aed',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            textDecoration: 'underline',
                                            padding: 0,
                                        }}
                                    >
                                        clear all filters
                                    </button>
                                    .
                                </p>
                            </>
                        ) : (
                            <>
                                <p>No products found in this category yet.</p>
                                <p style={{ fontSize: '0.8rem', marginTop: 8, color: '#475569' }}>
                                    An admin can add products via <code>POST /api/admin/products</code>
                                </p>
                            </>
                        )}
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '1.25rem',
                    }}>
                        {filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
                    </div>
                )}

                {/* ── Pagination ───────────────────────────────────────────────── */}
                {pagination.totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: '2rem' }}>
                        <button
                            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                            disabled={pagination.page === 0}
                            style={{
                                padding: '8px 18px', borderRadius: 8,
                                background: 'rgba(139,92,246,0.15)',
                                border: '1px solid rgba(139,92,246,0.3)',
                                color: '#a78bfa', cursor: 'pointer',
                                opacity: pagination.page === 0 ? 0.4 : 1,
                            }}
                        >
                            ← Prev
                        </button>
                        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                            Page {pagination.page + 1} of {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                            disabled={pagination.page >= pagination.totalPages - 1}
                            style={{
                                padding: '8px 18px', borderRadius: 8,
                                background: 'rgba(139,92,246,0.15)',
                                border: '1px solid rgba(139,92,246,0.3)',
                                color: '#a78bfa', cursor: 'pointer',
                                opacity: pagination.page >= pagination.totalPages - 1 ? 0.4 : 1,
                            }}
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
