/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import catalogService from '../services/catalogService';


// ─────────────────────────────────────────────────────────────────────────────
// Category accent colors
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORY_META = {
    'Roofing Solution':  { color: '#7c3aed', badge: 'Roofing' },
    'Flooring Solution': { color: '#f59e0b', badge: 'Flooring' },
    'Ceiling Solution':  { color: '#10b981', badge: 'Ceiling' },
    'Wall Solution':     { color: '#3b82f6', badge: 'Wall' },
    'Accessories':       { color: '#a855f7', badge: 'Accessories' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Product Card  — matches Figma design (white card, rounded-[48px])
// ─────────────────────────────────────────────────────────────────────────────
function ProductCard({ product, onViewDetails }) {

    return (
        <div
            style={{
                background: '#fff',
                borderRadius: 48,
                width: 300,
                height: 481,
                flexShrink: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 24px rgba(99,14,212,0.10)',
                position: 'relative',
                isolation: 'isolate',
                transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,14,212,0.18)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(99,14,212,0.10)'; }}
        >
            {/* Product image */}
            <div style={{ height: 256, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ width: '100%', height: '109.37%', objectFit: 'cover', position: 'absolute', top: '-4.69%', left: 0 }}
                        onError={e => { e.currentTarget.parentElement.style.background = '#e9e7f3'; e.currentTarget.style.display = 'none'; }}
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #e9e7f3, #d4c9f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                        📦
                    </div>
                )}
                {/* Badge — budget level */}
                {product.budgetLevel && (
                    <div style={{
                        position: 'absolute', top: 16, left: 16,
                        background: product.budgetLevel === 'LOW' ? '#2d6a4f' : product.budgetLevel === 'HIGH' ? '#93000a' : '#630ed4',
                        borderRadius: 9999, padding: '4px 12px',
                        color: '#fff', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
                    }}>
                        {product.budgetLevel === 'LOW' ? 'Budget Pick' : product.budgetLevel === 'HIGH' ? 'Premium' : 'Best Seller'}
                    </div>
                )}
            </div>

            {/* Card body */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 15px' }}>
                {/* Name + rating */}
                <div style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 20, color: '#1a1b23', lineHeight: '28px', flex: 1, marginRight: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {product.name}
                        </h3>
                        {product.durabilityRating && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#6f46b9', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                                <svg width="11" height="11" viewBox="0 0 12 12" fill="#6f46b9"><path d="M6 1l1.39 2.82L10.5 4.3l-2.25 2.2.53 3.09L6 8.02 3.22 9.59l.53-3.09L1.5 4.3l3.11-.48z"/></svg>
                                {(product.durabilityRating / 2).toFixed(1)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Price */}
                <div style={{ marginBottom: 16 }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 18, color: '#630ed4' }}>
                        Rs.{Number(product.basePrice).toFixed(2)}
                    </span>
                    {product.size && (
                        <span style={{ color: '#7b7487', fontSize: 12, marginLeft: 6 }}>/ {product.size}</span>
                    )}
                </div>

                {/* Attribute badges */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                    {product.climateSuitability && (
                        <span style={{ background: '#e9e7f3', borderRadius: 16, padding: '4px 8px', color: '#4a4455', fontSize: 10, fontWeight: 600 }}>
                            {product.climateSuitability}
                        </span>
                    )}
                    {product.maintenanceLevel && (
                        <span style={{ background: '#e9e7f3', borderRadius: 16, padding: '4px 8px', color: '#4a4455', fontSize: 10, fontWeight: 600 }}>
                            {product.maintenanceLevel} Maint.
                        </span>
                    )}
                    {product.material && (
                        <span style={{ background: '#e9e7f3', borderRadius: 16, padding: '4px 8px', color: '#4a4455', fontSize: 10, fontWeight: 600 }}>
                            {product.material}
                        </span>
                    )}
                </div>

                {/* View Details button */}
                <button
                    onClick={() => onViewDetails && onViewDetails(product)}
                    style={{
                        width: '100%', padding: '13px 1px',
                        border: '1px solid #ccc3d8', borderRadius: 32,
                        background: 'transparent', cursor: 'pointer',
                        color: '#630ed4', fontWeight: 700, fontSize: 16,
                        transition: 'background 0.2s, color 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#630ed4'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#630ed4'; }}
                >
                    View Details
                </button>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Horizontal scrollable product row section
// ─────────────────────────────────────────────────────────────────────────────
function ProductRow({ title, products, loading, onViewAll, onViewDetails }) {
    const scrollRef = useRef(null);

    const scroll = (dir) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir * 360, behavior: 'smooth' });
        }
    };

    return (
        <section style={{ marginBottom: 80 }}>
            {/* Section header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', marginBottom: 16 }}>
                <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 30, color: '#1a1b23', letterSpacing: '-0.75px' }}>
                    {title}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => scroll(-1)} style={{ background: '#e9e7f3', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#630ed4' }}>‹</button>
                    <button onClick={() => scroll(1)}  style={{ background: '#e9e7f3', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#630ed4' }}>›</button>
                    <button
                        onClick={onViewAll}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: '#630ed4', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
                    >
                        View All
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="#630ED4"><path d="M1 5h8M5 1l4 4-4 4"/></svg>
                    </button>
                </div>
            </div>

            {/* Scrollable row */}
            <div
                ref={scrollRef}
                style={{
                    display: 'flex', gap: 40, overflowX: 'auto', scrollbarWidth: 'none',
                    padding: '20px 40px 20px', alignItems: 'flex-start',
                }}
            >
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} style={{ width: 300, height: 481, borderRadius: 48, background: '#e9e7f3', flexShrink: 0, animation: 'pulse 1.5s infinite' }} />
                    ))
                ) : products.length === 0 ? (
                    <div style={{ padding: '3rem 2rem', color: '#94a3b8', textAlign: 'center', width: '100%' }}>No products available.</div>
                ) : (
                    products.map(p => <ProductCard key={p.id} product={p} onViewDetails={onViewDetails} />)
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
    const popular  = allProducts.slice(0, 8);
    const budget   = allProducts.filter(p => p.budgetLevel === 'LOW').slice(0, 8);
    const premium  = allProducts.filter(p => p.budgetLevel === 'HIGH').slice(0, 8);
    const trending = allProducts.slice().reverse().slice(0, 8);

    const handleViewDetails = (product) => navigate('/catalog');

    return (
        <div style={{ minHeight: '100vh', background: '#fbf8ff', position: 'relative' }}>

            {/* ── HERO SECTION — full viewport height so categories only appear on scroll ── */}
            <div style={{ position: 'relative', width: '100%', height: '100vh', minHeight: 600, overflow: 'hidden', flexShrink: 0 }}>
                <img
                    src="/store-bg.jpg"
                    alt=""
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none', filter: 'blur(4px)', transform: 'scale(1.05)' }}
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                />
                {/* Dark purple gradient overlay — exactly from Figma */}
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

                {/* Hero Content — vertically centered within the full-screen hero */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex', flexDirection: 'column', gap: 40,
                    alignItems: 'center', justifyContent: 'center',
                    padding: '80px 24px 40px',
                }}>
                    {/* Brand name — L+ stacked above සිවිලිම */}
                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <h1 style={{
                            fontFamily: 'Manrope, sans-serif', fontWeight: 900,
                            letterSpacing: '-1.5px', lineHeight: 1.05,
                            color: '#ffffff',
                            textShadow: '0 4px 40px rgba(99,14,212,0.5)',
                            transform: 'rotate(0.12deg)',
                            margin: 0,
                        }}>
                            <span style={{ display: 'block', fontSize: 'clamp(4rem, 9vw, 8.5rem)', marginBottom: '0.4em' }}>L+</span>
                            <span style={{ display: 'block', fontSize: 'clamp(3.5rem, 8.5vw, 8rem)' }}>සිවිලිම</span>
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', fontWeight: 500, marginTop: 12, letterSpacing: '-0.3px' }}>
                            Your trusted construction materials platform
                        </p>
                    </div>

                    {/* Extra spacing before search + buttons */}
                    <div style={{ height: 32 }} />

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
                            style={{
                                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                                color: '#fff', fontSize: 16, padding: '8px 20px',
                            }}
                        />
                        <button
                            onClick={() => {}}
                            style={{
                                background: '#630ed4', color: '#fff', border: 'none',
                                borderRadius: 48, padding: '17px 40px', fontFamily: 'Manrope, sans-serif',
                                fontWeight: 700, fontSize: 18, cursor: 'pointer', whiteSpace: 'nowrap',
                                boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                            }}
                        >
                            Search
                        </button>
                    </div>

                    {/* CTA buttons — Browse Materials | View Catalog | Get Recommendations */}
                    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>

                        {/* Shared style for Browse Materials & View Catalog */}
                        {[
                            { label: 'Browse Materials',  path: '/catalog' },
                            { label: 'View Catalog',      path: '/catalog' },
                        ].map(({ label, path }) => (
                            <button
                                key={label}
                                onClick={() => navigate(path)}
                                style={{
                                    background: '#630ed4', color: '#fff', border: 'none',
                                    borderRadius: 48, padding: '17px 40px', minWidth: 200,
                                    fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 18,
                                    cursor: 'pointer', boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    whiteSpace: 'nowrap', textAlign: 'center',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.35)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.25)'; }}
                            >
                                {label}
                            </button>
                        ))}

                        {/* Get Recommendations — glass style */}
                        <button
                            onClick={() => navigate('/wizard')}
                            style={{
                                background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(6px)',
                                color: '#fff', border: '1px solid rgba(255,255,255,0.4)',
                                borderRadius: 48, padding: '17px 40px',
                                fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 18,
                                cursor: 'pointer', whiteSpace: 'nowrap',
                                boxShadow: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)',
                                transition: 'transform 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            Get Recommendations
                        </button>
                    </div>
                </div>
            </div>

            {/* ── CATEGORY TABS ─────────────────────────────────────────────────── */}
            <div style={{
                background: '#fbf8ff', borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
                boxShadow: '0 4px 4px rgba(0,0,0,0.25)', padding: '10px 30px',
                display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center',
            }}>
                <button
                    onClick={() => setActiveCatId(null)}
                    style={{
                        background: activeCatId === null ? '#630ed4' : '#e3e1ed',
                        color: activeCatId === null ? '#fff' : '#1a1b23',
                        border: 'none', borderRadius: 40, padding: '10px 30px',
                        fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
                    }}
                >
                    All
                </button>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCatId(prev => prev === cat.id ? null : cat.id)}
                        style={{
                            background: activeCatId === cat.id ? '#630ed4' : '#e3e1ed',
                            color: activeCatId === cat.id ? '#fff' : '#1a1b23',
                            border: 'none', borderRadius: 40, padding: '10px 30px',
                            fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
                        }}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* ── CONTENT AREA ──────────────────────────────────────────────────── */}
            <div style={{ background: '#fbf8ff', paddingTop: 60 }}>
                {/* If a category is selected or search is active, show filtered grid */}
                {(activeCatId !== null || search) ? (
                    <section style={{ maxWidth: 1400, margin: '0 auto', padding: '0 40px 80px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 26, color: '#1a1b23' }}>
                                {search ? `Results for "${search}"` : categories.find(c => c.id === activeCatId)?.name}
                            </h2>
                            <button
                                onClick={() => { setActiveCatId(null); setSearch(''); }}
                                style={{ background: 'none', border: 'none', color: '#630ed4', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}
                            >
                                ← Show all
                            </button>
                        </div>
                        {loading ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40 }}>
                                {Array.from({length:4}).map((_,i) => <div key={i} style={{width:300,height:481,borderRadius:48,background:'#e9e7f3'}}/>)}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40 }}>
                                {filtered.map(p => <ProductCard key={p.id} product={p} onViewDetails={handleViewDetails} />)}
                                {filtered.length === 0 && <p style={{ color: '#94a3b8' }}>No products found.</p>}
                            </div>
                        )}
                    </section>
                ) : (
                    <>
                        <ProductRow title="Popular Right Now"       products={popular}  loading={loading} onViewAll={() => navigate('/catalog')} onViewDetails={handleViewDetails} />
                        <ProductRow title="Budget Friendly Picks"    products={budget.length ? budget : popular.slice(4)} loading={loading} onViewAll={() => navigate('/catalog')} onViewDetails={handleViewDetails} />
                        <ProductRow title="Premium Collection"       products={premium.length ? premium : trending.slice(0,4)} loading={loading} onViewAll={() => navigate('/catalog')} onViewDetails={handleViewDetails} />
                        <ProductRow title="Trending Now"             products={trending} loading={loading} onViewAll={() => navigate('/catalog')} onViewDetails={handleViewDetails} />
                    </>
                )}
            </div>

            {/* ── FOOTER ────────────────────────────────────────────────────────── */}
            <footer style={{
                background: '#f8fafc', height: 243,
                borderTop: '1px solid rgba(204,195,216,0.1)',
                display: 'flex', alignItems: 'center',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '65px 48px' }}>
                    <div>
                        <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 26, color: '#4c1d95', letterSpacing: '-1.2px', marginBottom: 8 }}>
                            L + SIVILIMA
                        </div>
                        <p style={{ color: '#64748b', fontSize: 14 }}>
                            Sri Lanka's trusted construction materials platform.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 48, color: '#475569', fontSize: 14 }}>
                        <div>
                            <strong style={{ display: 'block', color: '#1a1b23', marginBottom: 8 }}>Navigate</strong>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <a href="/catalog" style={{ color: '#475569', textDecoration: 'none' }}>Catalog</a>
                                <a href="/wizard" style={{ color: '#475569', textDecoration: 'none' }}>Recommendations</a>
                            </div>
                        </div>
                        <div>
                            <strong style={{ display: 'block', color: '#1a1b23', marginBottom: 8 }}>Categories</strong>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {categories.slice(0,3).map(c => (
                                    <span key={c.id} style={{ color: '#475569' }}>{c.name}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
