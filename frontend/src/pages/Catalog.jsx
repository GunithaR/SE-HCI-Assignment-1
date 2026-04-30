/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import catalogService from '../services/catalogService';
import ProductCard from '../components/ProductCard';

import roofingImg from '../assets/roofing image.png';
import flooringImg from '../assets/flooring.png';
import ceilingImg from '../assets/ceiling.png';
import wallImg from '../assets/wall.png';
import accessoriesImg from '../assets/accessories.png';

const CATEGORY_HERO = {
    'Roofing Solution': { title: 'Roofing Solutions', image: roofingImg, description: 'Crafting silhouettes of permanence. Our curated selection of high-end roofing materials combines architectural precision with unparalleled durability for the modern estate.' },
    'Flooring Solution': { title: 'Flooring Solutions', image: flooringImg, description: 'Define the foundation of your space with our curated collection of artisanal hardwoods and rare marbles. Precision-crafted for those who value permanence and elegance.' },
    'Ceiling Solution': { title: 'Ceiling Solutions', image: ceilingImg, description: 'Elevate the structural narrative of your space. Our curated ceiling materials blend acoustic precision with uncompromising architectural beauty, turning fifth walls into masterpieces.' },
    'Wall Solution': { title: 'Wall Solutions', image: wallImg, description: 'Transform vertical planes into architectural statements. Our curated selection of textures and materials brings character, depth, and tactile luxury to every structural surface.' },
    'Accessories': { title: 'Accessories', image: accessoriesImg, description: 'Complete your build with precision. Our curated accessories bring the finishing touches that transform a construction project into an architectural masterpiece.' },
};

// ── Dual-handle price range slider (10 equal steps, snapping) ────────────────
const STEPS = 10;

function PriceRangeSlider({ min, max, low, high, onChange }) {
    const stepSize = (max - min) / STEPS;

    const stepToPrice = (step) => {
        if (step === 0) return min;
        if (step === STEPS) return max;
        return Math.round(min + step * stepSize);
    };

    const priceToStep = (price) => Math.round((price - min) / stepSize);

    const lowStep = priceToStep(low);
    const highStep = priceToStep(high);
    const pct = (step) => (step / STEPS) * 100;

    const handleMin = (e) => {
        const step = Math.min(Number(e.target.value), highStep - 1);
        onChange(stepToPrice(step), high);
    };
    const handleMax = (e) => {
        const step = Math.max(Number(e.target.value), lowStep + 1);
        onChange(low, stepToPrice(step));
    };

    const ticks = Array.from({ length: STEPS + 1 }, (_, i) => i);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#7c3aed' }}>
                    Rs. {low.toLocaleString()}
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#7c3aed' }}>
                    Rs. {high.toLocaleString()}
                </span>
            </div>

            <div className="price-range-wrap">
                <div className="price-range-track" />
                <div className="price-range-fill" style={{ left: `${pct(lowStep)}%`, width: `${pct(highStep) - pct(lowStep)}%` }} />
                <div className="price-range-thumb" style={{ left: `${pct(lowStep)}%` }} />
                <div className="price-range-thumb" style={{ left: `${pct(highStep)}%` }} />
                <input type="range" className="price-slider"
                    min={0} max={STEPS} step={1} value={lowStep}
                    onChange={handleMin}
                    style={{ zIndex: lowStep > STEPS / 2 ? 3 : 5 }} />
                <input type="range" className="price-slider"
                    min={0} max={STEPS} step={1} value={highStep}
                    onChange={handleMax}
                    style={{ zIndex: 4 }} />
            </div>

            <div style={{ position: 'relative', height: 28, marginTop: 4 }}>
                {ticks.map((step) => (
                    <div key={step} style={{
                        position: 'absolute',
                        left: `${pct(step)}%`,
                        transform: 'translateX(-50%)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        gap: 2,
                    }}>
                        <div style={{
                            width: 1.5, height: 6,
                            background: step >= lowStep && step <= highStep ? '#7c3aed' : '#d1d5db',
                            borderRadius: 2,
                        }} />
                        {(step === 0 || step === STEPS || step % 2 === 0) && (
                            <span style={{
                                fontSize: '0.6rem', color: '#9ca3af', whiteSpace: 'nowrap',
                                fontWeight: step === 0 || step === STEPS ? 600 : 400,
                            }}>
                                {step === STEPS
                                    ? `${(stepToPrice(step) / 1000).toFixed(0)}k`
                                    : step === 0
                                        ? `${(min / 1000).toFixed(0)}k`
                                        : `${(stepToPrice(step) / 1000).toFixed(0)}k`
                                }
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Main Catalog Page ─────────────────────────────────────────────────────────
export default function Catalog() {
    const [activeCategoryId, setActiveCategoryId] = useState(null);
    const [activeCategoryName, setActiveCategoryName] = useState('');
    const [pagination, setPagination] = useState({ page: 0 });
    const [search, setSearch] = useState('');
    const [heroVisible, setHeroVisible] = useState(true);
    const [gridVisible, setGridVisible] = useState(true);

    const [brandId, setBrandId] = useState('');
    const [productSize, setProductSize] = useState('');
    const [material, setMaterial] = useState('');

    // Price range state
    const [priceAbsMin, setPriceAbsMin] = useState(0);
    const [priceAbsMax, setPriceAbsMax] = useState(100000);
    const [priceLow, setPriceLow] = useState(0);
    const [priceHigh, setPriceHigh] = useState(100000);
    const [priceActive, setPriceActive] = useState(false);

    // Queries
    const { data: categories = [], isLoading: loadingCats } = useQuery({
        queryKey: ['categories'],
        queryFn: catalogService.getCategories,
        onSuccess: (cats) => {
            if (cats.length > 0 && !activeCategoryId) {
                setActiveCategoryId(cats[0].id);
                setActiveCategoryName(cats[0].name);
            }
        }
    });

    // Handle initial category selection
    useEffect(() => {
        if (!activeCategoryId && categories.length > 0) {
            setActiveCategoryId(categories[0].id);
            setActiveCategoryName(categories[0].name);
        }
    }, [categories, activeCategoryId]);

    const { data: brands = [] } = useQuery({
        queryKey: ['brands'],
        queryFn: catalogService.getBrands,
    });

    const { data: attrOptions = { sizes: [], materials: [] } } = useQuery({
        queryKey: ['options'],
        queryFn: catalogService.getAttributeOptions,
    });

    // Fetch ALL products for current category to compute price range
    useQuery({
        queryKey: ['products-price-range', activeCategoryId],
        queryFn: () => catalogService.getProductsByCategory(activeCategoryId, 0, 500, {}),
        enabled: Boolean(activeCategoryId),
        onSuccess: (data) => {
            const prices = (data.content ?? []).map(p => Number(p.basePrice)).filter(n => !isNaN(n) && n > 0);
            if (prices.length > 0) {
                const mn = Math.floor(Math.min(...prices));
                const mx = Math.ceil(Math.max(...prices));
                setPriceAbsMin(mn);
                setPriceAbsMax(mx);
                setPriceLow(mn);
                setPriceHigh(mx);
                setPriceActive(false);
            }
        }
    });

    const minPrice = priceActive ? priceLow : '';
    const maxPrice = priceActive ? priceHigh : '';

    const filters = useMemo(() => ({
        ...(brandId ? { brandId: Number(brandId) } : {}),
        ...(minPrice !== '' ? { minPrice: Number(minPrice) } : {}),
        ...(maxPrice !== '' ? { maxPrice: Number(maxPrice) } : {}),
        ...(productSize ? { productSize } : {}),
        ...(material ? { material } : {}),
    }), [brandId, minPrice, maxPrice, productSize, material]);

    const { data: productsData = { content: [], totalPages: 0, totalElements: 0 }, isLoading: loadingProds, error } = useQuery({
        queryKey: ['products', activeCategoryId, pagination.page, filters],
        queryFn: () => catalogService.getProductsByCategory(activeCategoryId, pagination.page, 12, filters),
        enabled: Boolean(activeCategoryId),
        keepPreviousData: true,
    });

    const handleCategoryChange = useCallback((catId, catName) => {
        if (catId === activeCategoryId) return;
        setHeroVisible(false);
        setGridVisible(false);
        setTimeout(() => {
            setActiveCategoryId(catId);
            setActiveCategoryName(catName);
            setPagination({ page: 0 });
            setSearch(''); setBrandId(''); setProductSize(''); setMaterial('');
            setPriceActive(false);
            setHeroVisible(true);
            setGridVisible(true);
        }, 320);
    }, [activeCategoryId]);

    const handlePriceChange = (lo, hi) => {
        setPriceLow(lo);
        setPriceHigh(hi);
        setPriceActive(lo > priceAbsMin || hi < priceAbsMax);
        setPagination({ page: 0 });
    };

    const clearAllFilters = () => {
        setBrandId(''); setProductSize(''); setMaterial('');
        setPriceLow(priceAbsMin); setPriceHigh(priceAbsMax); setPriceActive(false);
        setPagination({ page: 0 });
    };

    const filtersActive = !!(brandId || productSize || material || priceActive);
    const products = productsData.content ?? [];
    const filteredProducts = search
        ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
        : products;
    const hero = CATEGORY_HERO[activeCategoryName];

    const sel = {
        padding: '8px 12px', borderRadius: 10, border: '1.5px solid #ddd6fe',
        background: '#fbf8ff', color: '#1e1b4b', fontWeight: 500,
        fontSize: '0.83rem', outline: 'none', width: '100%', cursor: 'pointer',
    };

    return (
        <div style={{ minHeight: '100vh', background: '#fbf8ff' }}>

            <div style={{
                position: 'relative', width: '100%', height: 660,
                overflow: 'hidden',
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}>
                {hero
                    ? <img className="ken-burns" src={hero.image} alt={hero.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                    : <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#4c1d95,#7c3aed)' }} />
                }

                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(10,4,30,0.72) 0%, rgba(10,4,30,0.38) 40%, transparent 70%)',
                }} />

                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: '0 5% 40px',
                }}>
                    <p style={{
                        color: '#c4b5fd', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 10px',
                        opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease 0.1s'
                    }}>
                        Our Collection
                    </p>
                    <h1 style={{
                        fontFamily: 'Manrope, sans-serif', fontWeight: 900,
                        fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#fff',
                        lineHeight: 1.1, margin: '0 0 12px',
                        textShadow: '0 2px 16px rgba(0,0,0,0.5)',
                        opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease 0.2s'
                    }}>
                        {hero?.title || 'Product Catalog'}
                    </h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.82)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0, maxWidth: 560,
                        opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease 0.3s'
                    }}>
                        {hero?.description || 'Browse our curated selection of premium construction materials.'}
                    </p>
                </div>
            </div>

            <div style={{
                background: '#fff', borderBottom: '1px solid #ede9fe',
                boxShadow: '0 4px 20px rgba(124,58,237,0.08)',
                padding: '14px 30px',
                display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center',
                position: 'sticky', top: 64, zIndex: 40,
            }}>
                {loadingCats
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} style={{ height: 40, width: 130, borderRadius: 40, background: '#ede9fe' }} />
                    ))
                    : categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat.id, cat.name)}
                            style={{
                                background: activeCategoryId === cat.id ? '#7c3aed' : '#ede9fe',
                                color: activeCategoryId === cat.id ? '#fff' : '#4c1d95',
                                border: 'none', borderRadius: 40, padding: '10px 24px',
                                fontWeight: 600, fontSize: 14, cursor: 'pointer',
                                transition: 'all 0.2s', fontFamily: 'Manrope, sans-serif',
                                boxShadow: activeCategoryId === cat.id ? '0 4px 14px rgba(124,58,237,0.35)' : 'none',
                            }}
                            onMouseEnter={e => { if (activeCategoryId !== cat.id) e.currentTarget.style.background = '#ddd6fe'; }}
                            onMouseLeave={e => { if (activeCategoryId !== cat.id) e.currentTarget.style.background = '#ede9fe'; }}
                        >
                            {cat.name}
                        </button>
                    ))
                }
            </div>

            <div style={{ maxWidth: 1320, margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
                <div style={{
                    background: '#fff', borderRadius: 16, border: '1.5px solid #ede9fe',
                    padding: '1.25rem 1.5rem', marginBottom: '2rem',
                    boxShadow: '0 2px 16px rgba(124,58,237,0.06)',
                }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        background: '#fbf8ff', borderRadius: 50, border: '1.5px solid #ddd6fe',
                        padding: '6px 16px', marginBottom: '1.25rem',
                    }}>
                        <span style={{ color: '#a78bfa' }}>🔍</span>
                        <input
                            id="catalog-search"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder={`Search in ${activeCategoryName || 'this category'}…`}
                            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', color: '#1e1b4b', fontSize: '0.9rem', fontWeight: 500 }}
                        />
                        {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: '#a78bfa', cursor: 'pointer', fontSize: '1rem' }}>✕</button>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: '1.25rem' }}>
                        <select value={brandId} onChange={e => { setBrandId(e.target.value); setPagination({ page: 0 }); }} style={sel}>
                            <option value="">All Brands</option>
                            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                        <select value={material} onChange={e => { setMaterial(e.target.value); setPagination({ page: 0 }); }} style={sel}>
                            <option value="">All Materials</option>
                            {(attrOptions.materials ?? []).map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <select value={productSize} onChange={e => { setProductSize(e.target.value); setPagination({ page: 0 }); }} style={sel}>
                            <option value="">All Sizes</option>
                            {(attrOptions.sizes ?? []).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    {priceAbsMax > priceAbsMin && (
                        <div style={{ padding: '0.25rem 0 0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#4c1d95' }}>💰 Price Range</span>
                                {priceActive && (
                                    <button onClick={() => { setPriceLow(priceAbsMin); setPriceHigh(priceAbsMax); setPriceActive(false); setPagination({ page: 0 }); }}
                                        style={{ background: 'none', border: 'none', color: '#a78bfa', fontSize: '0.73rem', cursor: 'pointer', fontWeight: 600 }}>
                                        Reset
                                    </button>
                                )}
                            </div>
                            <PriceRangeSlider
                                min={priceAbsMin} max={priceAbsMax}
                                low={priceLow} high={priceHigh}
                                onChange={handlePriceChange}
                            />
                        </div>
                    )}

                    {filtersActive && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
                            <span style={{ background: '#ede9fe', color: '#7c3aed', borderRadius: 9999, padding: '3px 12px', fontSize: '0.75rem', fontWeight: 600 }}>
                                🎚 Filters active
                            </span>
                            <button onClick={clearAllFilters}
                                style={{ background: 'none', border: '1px solid #c4b5fd', color: '#7c3aed', borderRadius: 9999, padding: '3px 12px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                                Clear all
                            </button>
                        </div>
                    )}
                </div>

                {!loadingProds && !error && (
                    <div style={{ marginBottom: '1.25rem', color: '#6b7280', fontSize: '0.85rem' }}>
                        Showing <strong style={{ color: '#7c3aed' }}>{filteredProducts.length}</strong> products
                        {activeCategoryName && <> in <strong style={{ color: '#1e1b4b' }}>{activeCategoryName}</strong></>}
                    </div>
                )}

                {error && (
                    <div style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 12, padding: '1.25rem', textAlign: 'center', color: '#dc2626', marginBottom: '1.5rem' }}>
                        {error?.response?.data?.message || 'Could not load products.'}
                    </div>
                )}

                {loadingProds && !products.length ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="skeleton" style={{ height: 420, borderRadius: 20 }} />
                        ))}
                    </div>
                ) : !error && filteredProducts.length === 0 ? (
                    <div style={{ background: '#fff', border: '1.5px solid #ede9fe', borderRadius: 20, padding: '4rem 2rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</p>
                        <p style={{ color: '#374151', fontWeight: 600, marginBottom: 8 }}>
                            {filtersActive ? 'No products match the selected filters.' : 'No products in this category yet.'}
                        </p>
                        {filtersActive && (
                            <button onClick={clearAllFilters} style={{ marginTop: 12, background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 50, padding: '10px 24px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div
                        key={activeCategoryId + pagination.page}
                        className={gridVisible ? 'card-entrance' : ''}
                        style={{
                            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem',
                            opacity: gridVisible ? 1 : 0,
                            transition: 'opacity 0.3s ease'
                        }}
                    >
                        {filteredProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                    </div>
                )}

                {productsData.totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: '2.5rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                            disabled={pagination.page === 0}
                            style={{ padding: '9px 20px', borderRadius: 50, border: '1.5px solid #ddd6fe', background: '#fff', color: '#7c3aed', fontWeight: 600, fontSize: '0.85rem', cursor: pagination.page === 0 ? 'not-allowed' : 'pointer', opacity: pagination.page === 0 ? 0.4 : 1 }}
                        >← Prev</button>

                        {Array.from({ length: productsData.totalPages }).map((_, i) => (
                            <button key={i} onClick={() => setPagination({ page: i })}
                                style={{ width: 38, height: 38, borderRadius: '50%', border: '1.5px solid #ddd6fe', background: pagination.page === i ? '#7c3aed' : '#fff', color: pagination.page === i ? '#fff' : '#7c3aed', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', boxShadow: pagination.page === i ? '0 4px 12px rgba(124,58,237,0.3)' : 'none' }}>
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                            disabled={pagination.page >= productsData.totalPages - 1}
                            style={{ padding: '9px 20px', borderRadius: 50, border: '1.5px solid #ddd6fe', background: '#fff', color: '#7c3aed', fontWeight: 600, fontSize: '0.85rem', cursor: pagination.page >= productsData.totalPages - 1 ? 'not-allowed' : 'pointer', opacity: pagination.page >= productsData.totalPages - 1 ? 0.4 : 1 }}
                        >Next →</button>
                    </div>
                )}
            </div>
        </div>
    );
}
