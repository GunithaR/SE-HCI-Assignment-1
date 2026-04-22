/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import catalogService from '../services/catalogService';
import ProductCard from '../components/ProductCard';

// ─────────────────────────────────────────────────────────────────────────────
// Horizontal scrollable product row section
// ─────────────────────────────────────────────────────────────────────────────
function ProductRow({ title, products, loading, onViewAll }) {
    const scrollRef = useRef(null);

    const scroll = (dir) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
        }
    };

    return (
        <section style={{ marginBottom: 80 }}>
            {/* Section header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', marginBottom: 16 }}>
                <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 28, color: '#1e1b4b', letterSpacing: '-0.5px' }}>
                    {title}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button
                        onClick={() => scroll(-1)}
                        style={{ background: '#ede9fe', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed', transition: 'background 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#ddd6fe'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#ede9fe'; }}
                    >‹</button>
                    <button
                        onClick={() => scroll(1)}
                        style={{ background: '#ede9fe', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed', transition: 'background 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#ddd6fe'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#ede9fe'; }}
                    >›</button>
                    <button
                        onClick={onViewAll}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: '#7c3aed', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
                    >
                        View All <span style={{ fontSize: 13 }}>→</span>
                    </button>
                </div>
            </div>

            {/* Scrollable row */}
            <div
                ref={scrollRef}
                style={{
                    display: 'flex', gap: 28, overflowX: 'auto', scrollbarWidth: 'none',
                    padding: '12px 40px 20px', alignItems: 'stretch',
                }}
            >
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} style={{ width: 280, minHeight: 420, borderRadius: 20, background: 'linear-gradient(135deg,#f5f3ff,#ede9fe)', flexShrink: 0, animation: 'pulse 1.5s infinite' }} />
                    ))
                ) : products.length === 0 ? (
                    <div style={{ padding: '3rem 2rem', color: '#9ca3af', textAlign: 'center', width: '100%' }}>
                        No products available.
                    </div>
                ) : (
                    products.map(p => (
                        <div key={p.id} style={{ width: 280, flexShrink: 0 }}>
                            <ProductCard product={p} />
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Home Page
// ─────────────────────────────────────────────────────────────────────────────
export default function Home() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [activeCatId, setActiveCatId] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const categoryRef = useRef(null);

    useEffect(() => {
        Promise.all([
            catalogService.getCategories().catch(() => []),
            catalogService.getAllProducts(0, 48).catch(() => ({ content: [] })),
        ]).then(([cats, page]) => {
            setCategories(cats);
            setAllProducts(page.content ?? []);
            setLoading(false);
        });
    }, []);

    const displayedProducts = activeCatId
        ? allProducts.filter(p => categories.find(c => c.id === activeCatId)?.name === p.categoryName)
        : allProducts;

    const filtered = search
        ? displayedProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
        : displayedProducts;

    // Slice products into sections
    const topRated = [...allProducts]
        .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
        .slice(0, 8);

    const budget   = allProducts.filter(p => p.budgetLevel === 'LOW').slice(0, 8);
    const premium  = allProducts.filter(p => p.budgetLevel === 'HIGH').slice(0, 8);

    const scrollToCategories = () => {
        categoryRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div style={{ minHeight: '100vh', background: '#fbf8ff', position: 'relative' }}>

            {/* ── HERO SECTION ─────────────────────────────────────────────── */}
            <div style={{ position: 'relative', width: '100%', height: '100vh', minHeight: 600, overflow: 'hidden', flexShrink: 0 }}>
                <img
                    src="/store-bg.jpg"
                    alt=""
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none', filter: 'blur(4px)', transform: 'scale(1.05)' }}
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                />
                {/* Dark purple gradient overlay */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} fill="none" preserveAspectRatio="none" viewBox="0 0 1440 923">
                    <path d="M0 40H1440V923H0V40Z" fill="url(#g1)" />
                    <path d="M0 0H1440V923H0V0Z" fill="url(#g2)" />
                    <defs>
                        <linearGradient id="g1" x1="720" x2="720" y1="923" y2="40" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#25005A" stopOpacity="0.55" />
                            <stop offset="1" stopColor="#25005A" stopOpacity="0" />
                        </linearGradient>
                        <radialGradient id="g2" cx="0" cy="0" gradientTransform="translate(720 461.5) scale(864.294 834.241)" gradientUnits="userSpaceOnUse" r="1">
                            <stop offset="0.2" stopOpacity="0" />
                            <stop offset="1" stopOpacity="0.2" />
                        </radialGradient>
                    </defs>
                </svg>

                {/* Hero Content */}
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column', gap: 40,
                    alignItems: 'center', justifyContent: 'center',
                    padding: '80px 24px 40px',
                }}>
                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <h1 style={{
                            fontFamily: 'Manrope, sans-serif', fontWeight: 900,
                            letterSpacing: '-1.5px', lineHeight: 1.05,
                            color: '#ffffff',
                            textShadow: '0 4px 40px rgba(99,14,212,0.5)',
                            transform: 'rotate(0.12deg)', margin: 0,
                        }}>
                            <span style={{ display: 'block', fontSize: 'clamp(4rem, 9vw, 8.5rem)', marginBottom: '0.4em' }}>L+</span>
                            <span style={{ display: 'block', fontSize: 'clamp(3.5rem, 8.5vw, 8rem)' }}>සිවිලිම</span>
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', fontWeight: 500, marginTop: 12, letterSpacing: '-0.3px' }}>
                            Your trusted construction materials platform
                        </p>
                    </div>

                    <div style={{ height: 20 }} />

                    {/* Search bar */}
                    <div style={{
                        width: '100%', maxWidth: 700,
                        background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
                        borderRadius: 9999, padding: 8,
                        display: 'flex', alignItems: 'center',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                    }}>
                        <input
                            placeholder="Search roofing, flooring, ceiling materials…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') scrollToCategories(); }}
                            style={{
                                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                                color: '#fff', fontSize: 16, padding: '8px 20px',
                            }}
                        />
                        <button
                            onClick={scrollToCategories}
                            style={{
                                background: '#7c3aed', color: '#fff', border: 'none',
                                borderRadius: 48, padding: '14px 36px', fontFamily: 'Manrope, sans-serif',
                                fontWeight: 700, fontSize: 16, cursor: 'pointer', whiteSpace: 'nowrap',
                                boxShadow: '0 8px 24px rgba(124,58,237,0.4)',
                                transition: 'background 0.2s, transform 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#6d28d9'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#7c3aed'; e.currentTarget.style.transform = 'scale(1)'; }}
                        >
                            Search
                        </button>
                    </div>

                    {/* CTA buttons */}
                    <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button
                            onClick={scrollToCategories}
                            style={{
                                background: '#7c3aed', color: '#fff', border: 'none',
                                borderRadius: 48, padding: '15px 36px', minWidth: 180,
                                fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 16,
                                cursor: 'pointer', boxShadow: '0 8px 32px rgba(124,58,237,0.4)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(124,58,237,0.5)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,58,237,0.4)'; }}
                        >
                            Browse Materials
                        </button>
                        <button
                            onClick={() => navigate('/catalog')}
                            style={{
                                background: '#7c3aed', color: '#fff', border: 'none',
                                borderRadius: 48, padding: '15px 36px', minWidth: 180,
                                fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 16,
                                cursor: 'pointer', boxShadow: '0 8px 32px rgba(124,58,237,0.4)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(124,58,237,0.5)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,58,237,0.4)'; }}
                        >
                            View Catalog
                        </button>
                        <button
                            onClick={() => navigate('/wizard')}
                            style={{
                                background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)',
                                color: '#fff', border: '1.5px solid rgba(255,255,255,0.45)',
                                borderRadius: 48, padding: '15px 36px',
                                fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 16,
                                cursor: 'pointer', whiteSpace: 'nowrap',
                                transition: 'transform 0.2s, background 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                        >
                            Get Recommendations
                        </button>
                    </div>
                </div>
            </div>

            {/* ── CATEGORY TABS ──────────────────────────────────────────────── */}
            <div
                ref={categoryRef}
                style={{
                    background: '#fff', borderBottom: '1px solid #ede9fe',
                    boxShadow: '0 4px 20px rgba(124,58,237,0.08)',
                    padding: '14px 30px',
                    display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center',
                    position: 'sticky', top: 64, zIndex: 40,
                }}
            >
                <button
                    onClick={() => { setActiveCatId(null); setSearch(''); }}
                    style={{
                        background: activeCatId === null ? '#7c3aed' : '#ede9fe',
                        color: activeCatId === null ? '#fff' : '#4c1d95',
                        border: 'none', borderRadius: 40, padding: '10px 24px',
                        fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
                        fontFamily: 'Manrope, sans-serif',
                    }}
                >
                    All
                </button>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCatId(prev => prev === cat.id ? null : cat.id)}
                        style={{
                            background: activeCatId === cat.id ? '#7c3aed' : '#ede9fe',
                            color: activeCatId === cat.id ? '#fff' : '#4c1d95',
                            border: 'none', borderRadius: 40, padding: '10px 24px',
                            fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
                            fontFamily: 'Manrope, sans-serif',
                        }}
                        onMouseEnter={e => { if (activeCatId !== cat.id) { e.currentTarget.style.background = '#ddd6fe'; } }}
                        onMouseLeave={e => { if (activeCatId !== cat.id) { e.currentTarget.style.background = '#ede9fe'; } }}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* ── CONTENT AREA ───────────────────────────────────────────────── */}
            <div style={{ background: '#fbf8ff', paddingTop: 60 }}>
                {(activeCatId !== null || search) ? (
                    <section style={{ maxWidth: 1400, margin: '0 auto', padding: '0 40px 80px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 26, color: '#1e1b4b' }}>
                                {search ? `Results for "${search}"` : categories.find(c => c.id === activeCatId)?.name}
                                <span style={{ marginLeft: 10, color: '#9ca3af', fontSize: 16, fontWeight: 400 }}>
                                    ({filtered.length} products)
                                </span>
                            </h2>
                            <button
                                onClick={() => { setActiveCatId(null); setSearch(''); }}
                                style={{ background: '#ede9fe', border: 'none', color: '#7c3aed', cursor: 'pointer', fontWeight: 600, fontSize: 13, borderRadius: 20, padding: '6px 16px' }}
                            >
                                ← Show All
                            </button>
                        </div>
                        {loading ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 28 }}>
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} style={{ height: 420, borderRadius: 20, background: 'linear-gradient(135deg,#f5f3ff,#ede9fe)', animation: 'pulse 1.5s infinite' }} />
                                ))}
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 28 }}>
                                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
                                {filtered.length === 0 && (
                                    <p style={{ color: '#9ca3af', gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>
                                        No products found.
                                    </p>
                                )}
                            </div>
                        )}
                    </section>
                ) : (
                    <>
                        <ProductRow title="Top Rated"              products={topRated} loading={loading} onViewAll={() => navigate('/catalog')} />
                        <ProductRow title="Budget-Friendly Picks"  products={budget.length ? budget : topRated.slice(4)} loading={loading} onViewAll={() => navigate('/catalog')} />
                        <ProductRow title="Premium Collection"     products={premium.length ? premium : topRated.slice(0, 4)} loading={loading} onViewAll={() => navigate('/catalog')} />
                    </>
                )}
            </div>

            {/* ── FOOTER ─────────────────────────────────────────────────────── */}
            <footer style={{
                background: '#f8fafc', borderTop: '1px solid #ede9fe',
                display: 'flex', alignItems: 'center',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '48px 48px' }}>
                    <div>
                        <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 24, color: '#4c1d95', letterSpacing: '-1px', marginBottom: 8 }}>
                            L + SIVILIMA
                        </div>
                        <p style={{ color: '#6b7280', fontSize: 14 }}>
                            Sri Lanka's trusted construction materials platform.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 48, color: '#6b7280', fontSize: 14 }}>
                        <div>
                            <strong style={{ display: 'block', color: '#1e1b4b', marginBottom: 8 }}>Navigate</strong>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <a href="/catalog" style={{ color: '#6b7280', textDecoration: 'none' }}>Catalog</a>
                                <a href="/wizard"  style={{ color: '#6b7280', textDecoration: 'none' }}>Recommendations</a>
                            </div>
                        </div>
                        <div>
                            <strong style={{ display: 'block', color: '#1e1b4b', marginBottom: 8 }}>Categories</strong>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {categories.slice(0, 3).map(c => (
                                    <span key={c.id} style={{ color: '#6b7280' }}>{c.name}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
