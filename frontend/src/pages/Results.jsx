import { useLocation, Link } from 'react-router-dom';

function ResultCard({ product, rank }) {
    const budgetLevel = product.budgetLevel;
    const climate = product.climateSuitability;
    const maintenance = product.maintenanceLevel;
    const durability = product.durabilityRating;
    const style = product.style;

    const budgetColor = {
        LOW: { bg: 'rgba(34,197,94,0.15)', fg: '#16a34a', border: 'rgba(34,197,94,0.35)' },
        MEDIUM: { bg: 'rgba(245,158,11,0.15)', fg: '#d97706', border: 'rgba(245,158,11,0.35)' },
        HIGH: { bg: 'rgba(239,68,68,0.15)', fg: '#dc2626', border: 'rgba(239,68,68,0.35)' },
    }[budgetLevel] || { bg: 'rgba(148,163,184,0.15)', fg: '#64748b', border: 'rgba(148,163,184,0.4)' };

    const isTopPick = rank === 1;
    const isTop3 = rank <= 3;

    return (
        <div
            className="fade-in-up max-w-2xl"
            style={{
                display: 'flex',
                gap: 16,
                padding: '1.1rem 1.25rem',
                background: 'var(--color-surface)',
                borderRadius: 14,
                border: isTopPick
                    ? '2px solid rgba(245,158,11,0.7)'
                    : '2px solid #a78bfa',
                boxShadow: isTopPick
                    ? '0 10px 30px rgba(245,158,11,0.25)'
                    : '0 6px 20px rgba(139,92,246,0.12)',
                alignItems: 'stretch',
            }}
        >
            {/* Rank + optional image */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div
                    className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs"
                    style={{
                        background: isTop3
                            ? 'linear-gradient(135deg,#6c63ff,#f59e0b)'
                            : 'var(--color-surface-alt)',
                        color: isTop3 ? '#fff' : 'var(--color-muted)',
                        border: isTop3 ? 'none' : '1px solid var(--color-border)',
                        boxShadow: isTop3 ? '0 0 0 3px rgba(251,191,36,0.35)' : 'none',
                    }}
                >
                    #{rank}
                </div>
                <div
                    style={{
                        width: 70,
                        height: 70,
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
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <span style={{ fontSize: '1.4rem', opacity: 0.25 }}>🧱</span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ minWidth: 0 }}>
                        <h3
                            className="truncate"
                            style={{
                                fontWeight: 600,
                                color: 'var(--color-text)',
                                fontSize: '0.95rem',
                                marginBottom: 2,
                            }}
                        >
                            {product.name}
                        </h3>
                        <p style={{ color: '#64748b', fontSize: '0.75rem' }}>
                            {product.brandName && <span>{product.brandName} · </span>}
                            <span>{product.categoryName}</span>
                        </p>
                    </div>
                    {budgetLevel && (
                        <span
                            style={{
                                padding: '3px 10px',
                                borderRadius: 9999,
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                background: budgetColor.bg,
                                color: budgetColor.fg,
                                border: `1px solid ${budgetColor.border}`,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {budgetLevel} budget
                        </span>
                    )}
                </div>

                <p
                    style={{
                        color: 'var(--color-muted)',
                        fontSize: '0.78rem',
                        lineHeight: 1.55,
                        maxHeight: '3.1rem',
                        overflow: 'hidden',
                    }}
                >
                    {product.description || 'No description available for this product yet.'}
                </p>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        gap: 10,
                        marginTop: 4,
                    }}
                >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, fontSize: '0.7rem' }}>
                        {climate && (
                            <span
                                style={{
                                    padding: '2px 9px',
                                    borderRadius: 9999,
                                    background: 'rgba(129,140,248,0.15)',
                                    color: '#4f46e5',
                                    border: '1px solid rgba(129,140,248,0.5)',
                                }}
                            >
                                ☁ {climate}
                            </span>
                        )}
                        {maintenance && (
                            <span
                                style={{
                                    padding: '2px 9px',
                                    borderRadius: 9999,
                                    background: 'rgba(45,212,191,0.12)',
                                    color: '#0f766e',
                                    border: '1px solid rgba(45,212,191,0.45)',
                                }}
                            >
                                🔧 {maintenance} maintenance
                            </span>
                        )}
                        {style && (
                            <span
                                style={{
                                    padding: '2px 9px',
                                    borderRadius: 9999,
                                    background: 'var(--color-surface-alt)',
                                    color: 'var(--color-muted)',
                                    border: '1px solid var(--color-border)',
                                }}
                            >
                                {style}
                            </span>
                        )}
                    </div>

                    <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                        <div style={{ color: '#8b5cf6', fontWeight: 700, fontSize: '1rem' }}>
                            ${Number(product.basePrice).toFixed(2)}
                        </div>
                        {durability && (
                            <div style={{ color: '#64748b', fontSize: '0.7rem' }}>
                                Durability:{' '}
                                <span style={{ color: '#94a3b8', fontWeight: 600 }}>
                                    {durability}/10
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Results() {
    const { state } = useLocation();
    const products = state?.products ?? [];
    const answers = state?.answers ?? {};

    return (
        <div className="light-theme min-h-screen px-6 pt-28 pb-16 relative page-with-navbar" style={{ background: 'var(--bg-color)', paddingLeft: 70, }}>
            {/* Top Purple Line */}


            <div className="fade-in-up">
                {/* Header */}
                <div className="mb-10">
                    <p className="text-xs text-violet-600 font-bold uppercase tracking-widest mb-2">
                        Recommendation Results
                    </p>
                    <h1 className="text-4xl text-slate-800 font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        {products.length} Product{products.length !== 1 ? 's' : ''} Found
                    </h1>
                    <p className="text-slate-500">
                        Filtered for{' '}
                        <span className="text-violet-600 font-medium">{answers.budget}</span> budget ·{' '}
                        <span className="text-violet-600 font-medium">{answers.climate}</span> climate
                    </p>
                    <p className="text-slate-500 text-xs mt-1">Ranked by durability (highest first)</p>
                </div>

                {products.length === 0 ? (
                    <div
                        className="glass text-center"
                        style={{
                            padding: '3.5rem 2.5rem',
                            background: 'var(--color-surface)',
                            border: '2px solid #a78bfa',
                            boxShadow: '0 4px 18px rgba(139,92,246,0.18)',
                            borderRadius: 18,
                        }}
                    >
                        <p className="text-5xl mb-4">🤔</p>
                        <p className="text-slate-500 mb-2 text-sm">
                            We couldn&apos;t find any strong matches for your selections.
                        </p>
                        <p className="text-slate-400 mb-6 text-xs">
                            Try adjusting your budget or climate preferences to see more options.
                        </p>
                        <Link to="/wizard">
                            <button id="results-retry-btn" className="btn-primary">
                                Adjust Answers
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {products.map((p, idx) => (
                            <ResultCard key={p.id} product={p} rank={idx + 1} />
                        ))}
                    </div>
                )}

                <div className="flex gap-4 mt-10">
                    <Link to="/wizard">
                        <button id="results-new-search-btn" className="btn-secondary">← New Search</button>
                    </Link>
                    <Link to="/catalog">
                        <button id="results-browse-catalog-btn" className="btn-primary">Browse Full Catalog</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
