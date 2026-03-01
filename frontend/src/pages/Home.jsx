import { useEffect, useState, useCallback } from 'react';
import catalogService from '../services/catalogService';

// ─────────────────────────────────────────────────────────────────────────────
// Category metadata — icons + accent colours for the 5 blocks
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORY_META = {
    'Roofing Solution': { icon: '🏠', color: '#6c63ff', desc: 'Durable roofing for every climate' },
    'Flooring Solution': { icon: '🪵', color: '#f59e0b', desc: 'Tiles, wood & beyond' },
    'Ceiling Solution': { icon: '🏛️', color: '#10b981', desc: 'Finish every room with style' },
    'Wall Solution': { icon: '🧱', color: '#3b82f6', desc: 'Insulation, cladding & renders' },
    'Accessories': { icon: '🔩', color: '#a855f7', desc: 'Fittings, fixings & more' },
};

const BUDGET_COLORS = {
    LOW: { bg: 'rgba(34,197,94,0.12)', fg: '#4ade80' },
    MEDIUM: { bg: 'rgba(245,158,11,0.12)', fg: '#fbbf24' },
    HIGH: { bg: 'rgba(239,68,68,0.12)', fg: '#f87171' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Product Card
// ─────────────────────────────────────────────────────────────────────────────
function ProductCard({ product }) {
    const bc = BUDGET_COLORS[product.budgetLevel] || { bg: 'rgba(148,163,184,0.1)', fg: '#94a3b8' };
    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16,
            padding: '1.25rem',
            display: 'flex', flexDirection: 'column', gap: 12,
            transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
            cursor: 'default',
        }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.95rem', marginBottom: 2 }}>
                        {product.name}
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.75rem' }}>
                        {product.brandName && <span>{product.brandName}</span>}
                        {product.brandName && product.categoryName && <span> · </span>}
                        {product.categoryName && <span style={{ color: '#a78bfa' }}>{product.categoryName}</span>}
                    </p>
                </div>
                {product.budgetLevel && (
                    <span style={{ background: bc.bg, color: bc.fg, border: `1px solid ${bc.fg}44`, borderRadius: 9999, padding: '2px 10px', fontSize: '0.7rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {product.budgetLevel}
                    </span>
                )}
            </div>

            {/* Description */}
            <p style={{ color: '#94a3b8', fontSize: '0.78rem', lineHeight: 1.65, flex: 1 }}>
                {product.description || 'Premium construction material.'}
            </p>

            {/* Attribute badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {product.climateSuitability && (
                    <span style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 9999, padding: '2px 9px', fontSize: '0.68rem' }}>
                        ☁ {product.climateSuitability}
                    </span>
                )}
                {product.maintenanceLevel && (
                    <span style={{ background: 'rgba(20,184,166,0.12)', color: '#2dd4bf', border: '1px solid rgba(20,184,166,0.25)', borderRadius: 9999, padding: '2px 9px', fontSize: '0.68rem' }}>
                        🔧 {product.maintenanceLevel}
                    </span>
                )}
                {product.durabilityRating && (
                    <span style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', borderRadius: 9999, padding: '2px 9px', fontSize: '0.68rem' }}>
                        ★ {product.durabilityRating}/10
                    </span>
                )}
            </div>

            {/* Price */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10 }}>
                <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: '1.15rem' }}>
                    ${Number(product.basePrice).toFixed(2)}
                </span>
                <span style={{
                    padding: '3px 10px', borderRadius: 9999, fontSize: '0.68rem', fontWeight: 600,
                    background: product.isActive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    color: product.isActive ? '#4ade80' : '#f87171',
                }}>
                    {product.isActive ? 'In Stock' : 'Out of Stock'}
                </span>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Home Page
// ─────────────────────────────────────────────────────────────────────────────
export default function Home() {
    const [categories, setCategories] = useState([]);
    const [activeCatId, setActiveCatId] = useState(null); // null = show all
    const [products, setProducts] = useState([]);
    const [loadingCats, setLoadingCats] = useState(true);
    const [loadingProds, setLoadingProds] = useState(false);
    const [search, setSearch] = useState('');

    // Load categories on mount
    useEffect(() => {
        catalogService.getCategories()
            .then((cats) => setCategories(cats))
            .catch(() => { })
            .finally(() => setLoadingCats(false));
    }, []);

    // Load products whenever active category changes
    const loadProducts = useCallback((catId) => {
        setLoadingProds(true);
        const fetcher = catId
            ? catalogService.getProductsByCategory(catId, 0, 24)
            : catalogService.getAllProducts(0, 24);

        fetcher
            .then((data) => {
                // getAllProducts returns a Page, getProductsByCategory too
                setProducts(data.content ?? []);
            })
            .catch(() => setProducts([]))
            .finally(() => setLoadingProds(false));
    }, []);

    // Load all products initially (after categories loaded)
    useEffect(() => {
        if (!loadingCats) loadProducts(activeCatId);
    }, [activeCatId, loadingCats, loadProducts]);

    const handleCatClick = (catId) => {
        // clicking the active category deselects it → show all
        setActiveCatId((prev) => (prev === catId ? null : catId));
        setSearch('');
    };

    const filtered = search
        ? products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
        : products;

    const activeCat = categories.find((c) => c.id === activeCatId);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary, #0a0b0f)' }}>

            {/* ── HERO ──────────────────────────────────────────────────────────── */}
            <section style={{ textAlign: 'center', padding: '9rem 1.5rem 4rem', position: 'relative', overflow: 'hidden' }}>
                {/* Glow blobs */}
                <div style={{ position: 'absolute', top: '20%', left: '15%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '10%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <p style={{ color: '#a78bfa', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.2rem' }}>
                    L+ SIVILIMA · Construction Platform
                </p>

                <h1 style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: 'clamp(3.5rem, 10vw, 8rem)',
                    fontWeight: 900,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    color: '#fff',
                    marginBottom: '1.5rem',
                }}>
                    CONSTRUCTION
                </h1>

                <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: 520, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
                    Browse premium construction materials from top brands. Filter by category, compare by budget and climate — all in one place.
                </p>
            </section>

            {/* ── 5 CATEGORY BLOCKS ─────────────────────────────────────────────── */}
            <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem 4rem' }}>
                <h2 style={{ textAlign: 'center', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#fff', marginBottom: '0.5rem' }}>
                    Browse by Category
                </h2>
                <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.85rem', marginBottom: '2rem' }}>
                    Click any category to filter products below
                </p>

                {loadingCats ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                        <div className="spinner" />
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                        {categories.map((cat) => {
                            const meta = CATEGORY_META[cat.name] || { icon: '📦', color: '#6c63ff', desc: '' };
                            const isActive = activeCatId === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCatClick(cat.id)}
                                    style={{
                                        background: isActive
                                            ? `linear-gradient(135deg, ${meta.color}33, ${meta.color}11)`
                                            : 'rgba(255,255,255,0.03)',
                                        border: isActive
                                            ? `2px solid ${meta.color}99`
                                            : '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: 20,
                                        padding: '1.75rem 1rem',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.25s',
                                        transform: isActive ? 'translateY(-6px)' : 'translateY(0)',
                                        boxShadow: isActive ? `0 12px 40px ${meta.color}33` : 'none',
                                    }}
                                    onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = `${meta.color}15`; e.currentTarget.style.borderColor = `${meta.color}55`; e.currentTarget.style.transform = 'translateY(-3px)'; } }}
                                    onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; } }}
                                >
                                    <div style={{ fontSize: '2.8rem', marginBottom: '0.75rem' }}>{meta.icon}</div>
                                    <div style={{ color: isActive ? '#fff' : '#e2e8f0', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                                        {cat.name}
                                    </div>
                                    <div style={{ color: isActive ? `${meta.color}cc` : '#475569', fontSize: '0.72rem', lineHeight: 1.4 }}>
                                        {meta.desc}
                                    </div>
                                    {isActive && (
                                        <div style={{ marginTop: '0.75rem', width: 32, height: 3, borderRadius: 9999, background: meta.color, margin: '0.75rem auto 0' }} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* ── PRODUCTS GRID ─────────────────────────────────────────────────── */}
            <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem 5rem' }}>
                {/* Section header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: '1.5rem' }}>
                    <div>
                        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: '#fff', marginBottom: 2 }}>
                            {activeCat ? activeCat.name : 'All Products'}
                        </h2>
                        {activeCatId && (
                            <button onClick={() => setActiveCatId(null)} style={{ background: 'none', border: 'none', color: '#6c63ff', fontSize: '0.78rem', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
                                ← Show all categories
                            </button>
                        )}
                    </div>

                    {/* Search */}
                    <input
                        placeholder="Search products…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            padding: '8px 16px', borderRadius: 10, fontSize: '0.85rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#e2e8f0', outline: 'none', width: 220,
                        }}
                    />
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: '2rem' }} />

                {loadingProds ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}>
                        <div className="spinner" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem', color: '#475569' }}>
                        <p style={{ fontSize: '3rem', marginBottom: 12 }}>📭</p>
                        <p style={{ color: '#64748b', marginBottom: 8 }}>
                            {search ? `No products match "${search}"` : 'No products in this category yet.'}
                        </p>
                        {search && (
                            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: '#a78bfa', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}>
                                Clear search
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <p style={{ color: '#475569', fontSize: '0.78rem', marginBottom: '1.25rem' }}>
                            {filtered.length} product{filtered.length !== 1 ? 's' : ''}
                            {activeCat ? ` in ${activeCat.name}` : ' across all categories'}
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.25rem' }}>
                            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}
