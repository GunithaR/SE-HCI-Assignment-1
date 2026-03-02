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
        <div className="card fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 0, overflow: 'hidden', padding: 0 }}>
            {/* Product Image */}
            {product.imageUrl && (
                <div style={{ width: '100%', height: 180, overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
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
                    <h3 style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem', marginBottom: 2 }}>
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
            <p style={{ color: '#94a3b8', fontSize: '0.78rem', lineHeight: 1.6, flex: 1 }}>
                {product.description || 'No description available.'}
            </p>

            {/* Attribute badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {product.climateSuitability && (
                    <span style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '9999px', padding: '2px 8px', fontSize: '0.7rem' }}>
                        ☁ {product.climateSuitability}
                    </span>
                )}
                {product.maintenanceLevel && (
                    <span style={{ background: 'rgba(20,184,166,0.15)', color: '#2dd4bf', border: '1px solid rgba(20,184,166,0.3)', borderRadius: '9999px', padding: '2px 8px', fontSize: '0.7rem' }}>
                        🔧 {product.maintenanceLevel}
                    </span>
                )}
                {product.style && (
                    <span style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', borderRadius: '9999px', padding: '2px 8px', fontSize: '0.7rem' }}>
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
    const [search, setSearch] = useState('');

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

    // 2. Load products whenever the active category or page changes
    useEffect(() => {
        if (!activeCategoryId) return;
        setLoadingProds(true);
        setError('');
        catalogService
            .getProductsByCategory(activeCategoryId, pagination.page, 12)
            .then((pageData) => {
                // Spring Page shape: { content, totalPages, totalElements, number }
                setProducts(pageData.content ?? []);
                setPagination((prev) => ({
                    ...prev,
                    totalPages: pageData.totalPages ?? 0,
                    totalElements: pageData.totalElements ?? 0,
                }));
            })
            .catch(() => setError('Could not load products for this category.'))
            .finally(() => setLoadingProds(false));
    }, [activeCategoryId, pagination.page]);

    // When switching categories, reset to page 0
    const handleCategoryChange = (catId) => {
        setActiveCategoryId(catId);
        setPagination({ page: 0, totalPages: 0, totalElements: 0 });
        setSearch('');
    };

    const filteredProducts = search
        ? products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
        : products;

    return (
        <div style={{ minHeight: '100vh', padding: '7rem 1.5rem 3rem', maxWidth: 1280, margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: 6 }}>
                Product Catalog
            </h1>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>
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
                                    ? '1px solid rgba(139,92,246,0.7)'
                                    : '1px solid rgba(255,255,255,0.1)',
                                background: activeCategoryId === cat.id
                                    ? 'rgba(139,92,246,0.2)'
                                    : 'rgba(255,255,255,0.03)',
                                color: activeCategoryId === cat.id ? '#a78bfa' : '#94a3b8',
                                fontWeight: activeCategoryId === cat.id ? 600 : 400,
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
            <div style={{ marginBottom: '1.5rem', maxWidth: 400 }}>
                <input
                    id="catalog-search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products in this category…"
                    className="input-field"
                    style={{ width: '100%' }}
                />
            </div>

            {/* ── Error state ──────────────────────────────────────────────── */}
            {error && (
                <div className="glass" style={{ padding: '1.5rem', textAlign: 'center', color: '#f87171', marginBottom: '1.5rem' }}>
                    {error}
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
                    <p>No products found in this category yet.</p>
                    <p style={{ fontSize: '0.8rem', marginTop: 8, color: '#475569' }}>
                        An admin can add products via <code>POST /api/admin/products</code>
                    </p>
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
    );
}
