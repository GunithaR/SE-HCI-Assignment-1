import { useLocation, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { STEPS } from './Wizard';

function ResultCard({ product, rank }) {
    const isTopPick = rank === 1;
    const isTop3 = rank <= 3;

    // Optional attributes if they exist
    const budgetLevel = product.budgetLevel || null;
    const climate = product.climateSuitability || null;
    const maintenance = product.maintenanceLevel || null;
    const durability = product.durabilityRating || null;
    const style = product.style || null;

    const budgetColor = {
        LOW: { bg: 'rgba(34,197,94,0.15)', fg: '#16a34a', border: 'rgba(34,197,94,0.35)' },
        MEDIUM: { bg: 'rgba(245,158,11,0.15)', fg: '#d97706', border: 'rgba(245,158,11,0.35)' },
        HIGH: { bg: 'rgba(239,68,68,0.15)', fg: '#dc2626', border: 'rgba(239,68,68,0.35)' },
    }[budgetLevel] || { bg: 'rgba(148,163,184,0.15)', fg: '#64748b', border: 'rgba(148,163,184,0.4)' };

    return (
        <div
            className={`fade-in-up w-full ${isTopPick ? 'top-recommendation' : ''}`}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                padding: '1.25rem 1.5rem',
                background: 'var(--color-surface)',
                borderRadius: 14,
                border: isTopPick
                    ? '2px solid rgba(245,158,11,0.7)'
                    : '2px solid #a78bfa',
                boxShadow: isTopPick
                    ? '0 10px 30px rgba(245,158,11,0.25)'
                    : '0 6px 20px rgba(139,92,246,0.12)',
            }}
        >
            <div style={{ display: 'flex', gap: 16, alignItems: 'stretch' }}>
                {/* Rank + optional image */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div
                        className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm"
                        style={{
                            background: isTop3
                                ? 'linear-gradient(135deg,#6c63ff,#f59e0b)'
                                : 'var(--color-surface-alt)',
                            color: isTop3 ? '#fff' : 'var(--color-muted)',
                            border: isTop3 ? 'none' : '1px solid var(--color-border)',
                            boxShadow: isTop3 ? '0 0 0 4px rgba(251,191,36,0.35)' : 'none',
                        }}
                    >
                        #{rank}
                    </div>
                    <div
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 10,
                            overflow: 'hidden',
                            border: '1px solid rgba(148,163,184,0.35)',
                            background: 'rgba(15,23,42,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.productName || product.name || 'Product'}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <span style={{ fontSize: '1.8rem', opacity: 0.25 }}>🧱</span>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                            <div style={{ minWidth: 0 }}>
                                <h3
                                    className="truncate"
                                    style={{
                                        fontWeight: 700,
                                        color: 'var(--color-text)',
                                        fontSize: '1.1rem',
                                        marginBottom: 4,
                                    }}
                                >
                                    {product.productName || product.name}
                                </h3>
                                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                                    {product.brandName && <span className="font-medium">{product.brandName} · </span>}
                                    <span>{product.categoryName}</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <div style={{ color: '#8b5cf6', fontWeight: 700, fontSize: '1.25rem' }}>
                                    ${Number(product.basePrice).toFixed(2)}
                                </div>
                                {product.score !== undefined && (
                                    <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: 2 }}>
                                        Score: <span className="font-bold text-violet-600">{product.score}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, fontSize: '0.75rem', marginTop: 12 }}>
                            {budgetLevel && (
                                <span
                                    style={{
                                        padding: '3px 10px',
                                        borderRadius: 9999,
                                        fontWeight: 600,
                                        background: budgetColor.bg,
                                        color: budgetColor.fg,
                                        border: `1px solid ${budgetColor.border}`,
                                    }}
                                >
                                    {budgetLevel} budget
                                </span>
                            )}
                            {climate && (
                                <span style={{ padding: '3px 10px', borderRadius: 9999, background: 'rgba(129,140,248,0.15)', color: '#4f46e5', border: '1px solid rgba(129,140,248,0.5)' }}>
                                    ☁ {climate}
                                </span>
                            )}
                            {maintenance && (
                                <span style={{ padding: '3px 10px', borderRadius: 9999, background: 'rgba(45,212,191,0.12)', color: '#0f766e', border: '1px solid rgba(45,212,191,0.45)' }}>
                                    🔧 {maintenance} maintenance
                                </span>
                            )}
                            {style && (
                                <span style={{ padding: '3px 10px', borderRadius: 9999, background: 'var(--color-surface-alt)', color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}>
                                    {style}
                                </span>
                            )}
                            {durability && (
                                <span style={{ padding: '3px 10px', borderRadius: 9999, background: 'rgba(244,63,94,0.1)', color: '#e11d48', border: '1px solid rgba(244,63,94,0.3)' }}>
                                    🛡️ Durability {durability}/10
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Explanation panel */}
            {(product.explanation || (product.matchedRuleNames && product.matchedRuleNames.length > 0)) && (
                <div
                    style={{
                        padding: '0.85rem 1rem',
                        background: 'rgba(139,92,246,0.05)',
                        borderTop: '1px solid rgba(139,92,246,0.15)',
                        borderRadius: '0 0 10px 10px',
                        marginTop: '0.5rem',
                    }}
                >
                    {product.explanation && (
                        <p style={{ color: 'var(--color-text)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                            <span className="font-semibold text-violet-700 mr-2">Why this?</span>
                            {product.explanation}
                        </p>
                    )}
                    
                    {product.matchedRuleNames && product.matchedRuleNames.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Matched rules:</span>
                            {product.matchedRuleNames.map((ruleName, idx) => (
                                <span
                                    key={idx}
                                    style={{
                                        fontSize: '0.7rem',
                                        padding: '2px 8px',
                                        background: 'rgba(139,92,246,0.15)',
                                        color: '#6d28d9',
                                        borderRadius: 6,
                                        border: '1px solid rgba(139,92,246,0.3)'
                                    }}
                                >
                                    {ruleName}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function CombinationCard({ combination, index }) {
    const totalPrice = combination.reduce((sum, item) => sum + Number(item.product.basePrice || 0), 0);
    const isTopPick = index === 0;

    return (
        <div
            className={`fade-in-up w-full ${isTopPick ? 'top-recommendation' : ''}`}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                padding: '1.25rem 1.5rem',
                background: 'var(--color-surface)',
                borderRadius: 14,
                border: isTopPick
                    ? '2px solid rgba(245,158,11,0.7)'
                    : '2px solid #a78bfa',
                boxShadow: isTopPick
                    ? '0 10px 30px rgba(245,158,11,0.25)'
                    : '0 6px 20px rgba(139,92,246,0.12)',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isTopPick ? '#d97706' : 'var(--color-text)' }}>
                    {isTopPick ? '🏆 Best Combination for Your House' : `Combination #${index + 1}`}
                </h3>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>Est. Total</div>
                    <div style={{ color: '#8b5cf6', fontWeight: 800, fontSize: '1.5rem' }}>
                        ${totalPrice.toFixed(2)}
                    </div>
                </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {combination.map(item => (
                    <div key={item.category} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15,23,42,0.02)', padding: '0.75rem', borderRadius: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: 40, height: 40, borderRadius: 6, overflow: 'hidden', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {item.product.imageUrl ? (
                                    <img src={item.product.imageUrl} alt={item.product.productName || item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ fontSize: '1rem' }}>🧱</span>
                                )}
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>{item.category}:</div>
                                <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{item.product.productName || item.product.name}</div>
                            </div>
                        </div>
                        <div style={{ fontWeight: 700, color: '#8b5cf6' }}>
                            ${Number(item.product.basePrice).toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Results() {
    const { state } = useLocation();
    const allProducts = state?.products ?? [];
    const answers = state?.answers ?? {};

    const [showAllCombinations, setShowAllCombinations] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState({});

    const toggleCategory = (cat) => {
        setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
    };

    const groupedByCategory = useMemo(() => {
        const groups = {};
        allProducts.forEach(p => {
            const cat = p.categoryName || 'Other';
            if (cat.toLowerCase() === 'accessories') return;
            
            if (!groups[cat]) {
                groups[cat] = [];
            }
            groups[cat].push(p);
        });
        return groups;
    }, [allProducts]);

    const combinations = useMemo(() => {
        const categories = Object.keys(groupedByCategory);
        if (categories.length === 0) return [];

        const combs = [];
        let i = 0;
        while (i < 10) { 
            const combo = [];
            let hasProduct = false;
            for (const cat of categories) {
                if (groupedByCategory[cat] && groupedByCategory[cat].length > i) {
                    combo.push({ category: cat, product: groupedByCategory[cat][i] });
                    hasProduct = true;
                }
            }
            if (!hasProduct) break;
            
            if (combo.length > 0) {
                combs.push(combo);
            }
            i++;
        }
        return combs;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupedByCategory]);

    const visibleCombinations = showAllCombinations ? combinations : combinations.slice(0, 3);

    return (
        <div
            className="light-theme min-h-screen pt-28 pb-16 flex justify-center page-with-navbar"
            style={{ background: 'var(--bg-color)' }}
        >
            <div className="fade-in-up w-full max-w-4xl px-6">
                {/* Header */}
                <div className="mb-10 text-center">
                    <p className="text-xs text-violet-600 font-bold uppercase tracking-widest mb-2">
                        Recommendation Results
                    </p>
                    <h1 className="text-4xl text-slate-800 font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        {allProducts.length === 0 ? 'No Matches Found' : 'Your Top Recommendations'}
                    </h1>
                    {Object.keys(answers).length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2 text-sm text-slate-500 mb-2 items-center mt-4">
                            <span className="mr-2">Filtered for:</span>
                            {Object.entries(answers).map(([key, val]) => {
                                const step = STEPS.find(s => s.id === key);
                                const option = step?.options.find(o => o.value === val);
                                const label = option ? option.label : val;
                                // Capitalize the key and add spaces before uppercase letters
                                const formattedKey = key
                                    .replace(/([A-Z])/g, ' $1')
                                    .replace(/^./, str => str.toUpperCase());
                                
                                return (
                                    <span key={key} className="text-violet-700 font-medium bg-violet-50 px-2 py-1 rounded-md border border-violet-200 flex items-center gap-1 shadow-sm">
                                        <span className="text-slate-500 text-xs mr-1 font-semibold">{formattedKey}:</span>
                                        {label}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>

                {allProducts.length === 0 ? (
                    <div
                        className="glass text-center mx-auto"
                        style={{
                            padding: '3.5rem 2.5rem',
                            background: 'var(--color-surface)',
                            border: '2px solid #a78bfa',
                            boxShadow: '0 4px 18px rgba(139,92,246,0.18)',
                            borderRadius: 18,
                        }}
                    >
                        <p className="text-5xl mb-4">🤔</p>
                        <p className="text-slate-700 font-medium mb-2 text-lg">
                            No suitable products were found for your preferences.
                        </p>
                        <p className="text-slate-500 mb-8 text-sm">
                            Try adjusting your answers or browse the full catalog to see more options.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link to="/wizard">
                                <button className="btn-secondary">
                                    Adjust Answers
                                </button>
                            </Link>
                            <Link to="/catalog">
                                <button className="btn-primary">
                                    Browse Catalog
                                </button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-20">
                        {/* Best Combinations Section */}
                        {combinations.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-bold mb-8 text-slate-800 flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                    ✨ Best Combinations
                                </h2>
                                <div className="space-y-6">
                                    {visibleCombinations.map((combo, idx) => (
                                        <CombinationCard key={`combo-${idx}`} combination={combo} index={idx} />
                                    ))}
                                </div>
                                {combinations.length > 3 && (
                                    <div className="mt-6 flex justify-center">
                                        <button 
                                            onClick={() => setShowAllCombinations(!showAllCombinations)}
                                            className="btn-secondary text-sm"
                                        >
                                            {showAllCombinations ? 'Show Top 3 Combinations Only' : `Show ${combinations.length - 3} More Combinations`}
                                        </button>
                                    </div>
                                )}
                            </section>
                        )}
                        
                        <div style={{ height: 2, background: 'rgba(148,163,184,0.15)', width: '100%' }} />
                        
                        {/* Category Wise Section */}
                        <section>
                            <h2 className="text-3xl font-bold mb-10 text-slate-800 flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                📑 Category-Wise Recommendations
                            </h2>
                            <div className="flex flex-col gap-12">
                                {Object.entries(groupedByCategory).map(([category, products]) => {
                                    const isExpanded = expandedCategories[category];
                                    const visibleProducts = isExpanded ? products.slice(0, 10) : products.slice(0, 3);
                                    
                                    return (
                                        <div key={category} className="space-y-4">
                                            <h3 className="text-xl font-bold text-violet-700 flex items-center gap-2">
                                                <span className="w-2 h-6 bg-violet-600 rounded-full inline-block"></span>
                                                {category} <span className="text-sm font-normal text-slate-500">({products.length} products)</span>
                                            </h3>
                                            <div className="space-y-4">
                                                {visibleProducts.map((p, idx) => (
                                                    <ResultCard key={p.productId || p.id} product={p} rank={idx + 1} />
                                                ))}
                                            </div>
                                            {products.length > 3 && (
                                                <div className="mt-4 pl-4">
                                                    <button 
                                                        onClick={() => toggleCategory(category)}
                                                        className="text-violet-600 font-bold text-sm hover:text-violet-800 transition-colors flex items-center gap-1"
                                                    >
                                                        {isExpanded ? '↑ Show Top 3 Only' : `↓ Show ${Math.min(products.length, 10) - 3} More in ${category}`}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                )}

                {allProducts.length > 0 && (
                    <div className="flex justify-center gap-4 mt-12">
                        <Link to="/wizard">
                            <button className="btn-secondary text-sm">← Retake Quiz</button>
                        </Link>
                        <Link to="/catalog">
                            <button className="btn-primary text-sm">Browse Full Catalog</button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
