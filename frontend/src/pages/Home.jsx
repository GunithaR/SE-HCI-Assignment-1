/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useCallback } from 'react';
import catalogService from '../services/catalogService';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';

// ─────────────────────────────────────────────────────────────────────────────
// Category metadata
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORY_META = {
    'Roofing Solution': { img: '/Roofing_Solution.jpg', desc: 'Durable roofing for every climate' },
    'Flooring Solution': { img: '/Flooring_Solution.jpg', desc: 'Tiles, wood & beyond' },
    'Ceiling Solution': { img: '/Ceiling_Solution.jpg', desc: 'Finish every room with style' },
    'Wall Solution': { img: '/Wall_Solution.jpg', desc: 'Insulation, cladding & renders' },
    'Accessories': { img: '/Accessories.jpg', desc: 'Fittings, fixings & more' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Home Page
// ─────────────────────────────────────────────────────────────────────────────
export default function Home() {
    const [categories, setCategories] = useState([]);
    const [activeCatId, setActiveCatId] = useState(null);
    const [products, setProducts] = useState([]);
    const [loadingCats, setLoadingCats] = useState(true);
    const [loadingProds, setLoadingProds] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        catalogService.getCategories()
            .then((cats) => setCategories(cats))
            .catch(() => { })
            .finally(() => setLoadingCats(false));
    }, []);

    const loadProducts = useCallback((catId) => {
        setLoadingProds(true);
        const fetcher = catId
            ? catalogService.getProductsByCategory(catId, 0, 24)
            : catalogService.getAllProducts(0, 24);

        fetcher
            .then((data) => setProducts(data.content ?? []))
            .catch(() => setProducts([]))
            .finally(() => setLoadingProds(false));
    }, []);

    useEffect(() => {
        if (!loadingCats) loadProducts(activeCatId);
    }, [activeCatId, loadingCats, loadProducts]);

    const handleCatClick = (catId) => {
        setActiveCatId((prev) => (prev === catId ? null : catId));
        setSearch('');
    };

    const filtered = search
        ? products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
        : products;

    const activeCat = categories.find((c) => c.id === activeCatId);

    return (
        <div className="page-with-navbar" style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
            {/* ── Hero ──────────────────────────────────────── */}
            <Hero />

            {/* ── Categories ───────────────────────────────── */}
            <section className="page-container fade-in-up">
                <h2 className="section-title" style={{ textAlign: 'center' }}>Browse by Category</h2>
                <p className="section-subtitle" style={{ textAlign: 'center' }}>
                    Click any category to filter products below
                </p>

                {loadingCats ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
                        <div className="spinner" />
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                    }}>
                        {categories.map((cat) => {
                            const meta = CATEGORY_META[cat.name] || { desc: '' };
                            const isActive = activeCatId === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCatClick(cat.id)}
                                    className="card"
                                    style={{
                                        padding: '24px 16px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        border: isActive ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                        background: isActive ? 'var(--color-primary-muted)' : 'var(--color-surface)',
                                        transform: isActive ? 'translateY(-4px)' : undefined,
                                        boxShadow: isActive ? 'var(--shadow-card-hover)' : undefined,
                                    }}
                                >
                                    <div style={{ height: 64, marginBottom: 12, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        {meta.img ? (
                                            <img
                                                src={meta.img}
                                                alt={cat.name}
                                                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', borderRadius: 8 }}
                                            />
                                        ) : (
                                            <span style={{ fontSize: '2.5rem' }}>📦</span>
                                        )}
                                    </div>
                                    <div style={{
                                        color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                                        fontWeight: 600,
                                        fontSize: '0.92rem',
                                        marginBottom: 4,
                                    }}>
                                        {cat.name}
                                    </div>
                                    <div style={{
                                        color: 'var(--color-muted)',
                                        fontSize: '0.78rem',
                                        lineHeight: 1.4,
                                    }}>
                                        {meta.desc}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* ── Products Grid ─────────────────────────────── */}
            <section className="page-container" style={{ paddingTop: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: '16px' }}>
                    <div>
                        <h2 className="section-title" style={{ fontSize: '1.4rem', marginBottom: 2 }}>
                            {activeCat ? activeCat.name : 'All Products'}
                        </h2>
                        {activeCatId && (
                            <button
                                onClick={() => setActiveCatId(null)}
                                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.82rem', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                            >
                                ← Show all categories
                            </button>
                        )}
                    </div>
                    <input
                        placeholder="Search products…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field"
                        style={{ width: 240 }}
                    />
                </div>

                <div className="divider" style={{ margin: '0 0 24px' }} />

                {loadingProds ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
                        <div className="spinner" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '64px 16px', color: 'var(--color-muted)' }}>
                        <p style={{ fontSize: '3rem', marginBottom: 12 }}>📭</p>
                        <p>{search ? `No products match "${search}"` : 'No products in this category yet.'}</p>
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline', marginTop: 8 }}
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <p style={{ color: 'var(--color-muted)', fontSize: '0.82rem', marginBottom: '16px' }}>
                            {filtered.length} product{filtered.length !== 1 ? 's' : ''}
                            {activeCat ? ` in ${activeCat.name}` : ' across all categories'}
                        </p>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '20px',
                        }}>
                            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}
