/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import catalogService from '../services/catalogService';
import ProductCard from '../components/ProductCard';

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

    useEffect(() => {
        catalogService
            .getCategories()
            .then((cats) => {
                setCategories(cats);
                if (cats.length > 0) setActiveCategoryId(cats[0].id);
            })
            .catch(() => setError('Could not load categories. Is the backend running on :8080?'))
            .finally(() => setLoadingCats(false));
    }, []);

    useEffect(() => {
        Promise.all([catalogService.getBrands(), catalogService.getAttributeOptions()])
            .then(([b, opts]) => {
                setBrands(b ?? []);
                setAttrOptions({ sizes: opts?.sizes ?? [], materials: opts?.materials ?? [] });
            })
            .catch(() => { });
    }, []);

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
                setProducts(pageData.content ?? []);
                setPagination((prev) => ({
                    ...prev,
                    totalPages: pageData.totalPages ?? 0,
                    totalElements: pageData.totalElements ?? 0,
                }));
            })
            .catch((err) => {
                const msg = err?.response?.data?.message || err?.response?.data?.error || 'Could not load products for this category.';
                setError(msg);
            })
            .finally(() => setLoadingProds(false));
    }, [activeCategoryId, pagination.page, brandId, minPrice, maxPrice, productSize, material]);

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

    const clearFilters = () => {
        setBrandId('');
        setMinPrice('');
        setMaxPrice('');
        setProductSize('');
        setMaterial('');
        setPagination((p) => ({ ...p, page: 0 }));
    };

    const filteredProducts = search
        ? products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
        : products;

    const hasFilters = brandId || minPrice || maxPrice || productSize || material;

    return (
        <div className="page-with-navbar" style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
            <div className="page-container fade-in-up">
                <h1 className="section-title" style={{ fontSize: '2rem' }}>Product Catalog</h1>
                <p className="section-subtitle">Browse construction materials by category.</p>

                {/* ── Category Tab Bar ─────────────────────────── */}
                {loadingCats ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
                        <div className="spinner" />
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: '24px' }}>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`category-pill${activeCategoryId === cat.id ? ' active' : ''}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── Filters ─────────────────────────────────── */}
                <div style={{ marginBottom: '24px', maxWidth: 560, display: 'grid', gap: 10 }}>
                    <input
                        id="catalog-search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products in this category…"
                        className="input-field"
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
                        <select
                            value={brandId}
                            onChange={(e) => { setBrandId(e.target.value); setPagination((p) => ({ ...p, page: 0 })); }}
                            className="input-field"
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
                            />
                            <input
                                value={maxPrice}
                                onChange={(e) => { setMaxPrice(e.target.value); setPagination((p) => ({ ...p, page: 0 })); }}
                                placeholder="Max price"
                                inputMode="decimal"
                                className="input-field"
                            />
                        </div>
                    </div>

                    {hasFilters && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                            <span style={{ color: 'var(--color-muted)', fontSize: '0.82rem' }}>Filters active</span>
                            <button onClick={clearFilters} className="btn-ghost" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>

                {/* ── Error / Info ──────────────────────────────── */}
                {error && (
                    <div style={{
                        padding: '16px 20px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-error-bg)',
                        color: 'var(--color-error)',
                        border: '1px solid rgba(220,38,38,0.15)',
                        marginBottom: '20px',
                        fontSize: '0.9rem',
                    }}>
                        {error}
                    </div>
                )}
                {!error && info && (
                    <div style={{
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-surface-alt)',
                        color: 'var(--color-text-secondary)',
                        marginBottom: '16px',
                        fontSize: '0.85rem',
                    }}>
                        {info}
                    </div>
                )}

                {/* ── Products Grid ──────────────────────────────── */}
                {loadingProds ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
                        <div className="spinner" />
                    </div>
                ) : !error && filteredProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '64px 16px', color: 'var(--color-muted)' }}>
                        <p style={{ fontSize: '2.5rem', marginBottom: 16 }}>📭</p>
                        {hasFilters ? (
                            <>
                                <p>No products match the selected filters.</p>
                                <p style={{ fontSize: '0.85rem', marginTop: 8 }}>
                                    Try relaxing one or more filters or{' '}
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        style={{ border: 'none', background: 'transparent', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                                    >
                                        clear all filters
                                    </button>.
                                </p>
                            </>
                        ) : (
                            <>
                                <p>No products found in this category yet.</p>
                                <p style={{ fontSize: '0.85rem', marginTop: 8, color: 'var(--color-muted)' }}>
                                    An admin can add products via <code>POST /api/admin/products</code>
                                </p>
                            </>
                        )}
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '20px',
                    }}>
                        {filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
                    </div>
                )}

                {/* ── Pagination ─────────────────────────────────── */}
                {pagination.totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: '32px' }}>
                        <button
                            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                            disabled={pagination.page === 0}
                            className="btn-ghost"
                            style={{ opacity: pagination.page === 0 ? 0.4 : 1 }}
                        >
                            ← Prev
                        </button>
                        <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>
                            Page {pagination.page + 1} of {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                            disabled={pagination.page >= pagination.totalPages - 1}
                            className="btn-ghost"
                            style={{ opacity: pagination.page >= pagination.totalPages - 1 ? 0.4 : 1 }}
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
