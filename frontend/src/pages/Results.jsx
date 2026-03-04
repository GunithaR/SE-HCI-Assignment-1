import { useLocation, Link } from 'react-router-dom';

function ResultCard({ product, rank }) {
    const attr = product.attribute || {};
    return (
        <div className="card p-5 fade-in-up flex gap-4" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            {/* Rank badge */}
            <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                style={{ background: rank <= 3 ? 'linear-gradient(135deg,#6c63ff,#f59e0b)' : 'var(--color-surface-alt)', color: rank <= 3 ? '#fff' : 'var(--color-muted)', border: rank > 3 ? '1px solid var(--color-border)' : 'none' }}>
                #{rank}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-slate-800 text-sm truncate" style={{ color: 'var(--color-text)' }}>{product.name}</h3>
                    <span className={`badge badge-budget-${attr.budgetLevel?.toLowerCase()} shrink-0`}>
                        {attr.budgetLevel}
                    </span>
                </div>
                <p className="text-slate-500 text-xs mb-2">
                    {product.brand?.name} · {product.category?.name}
                </p>
                <p className="text-slate-500 text-xs leading-relaxed mb-3 line-clamp-2">
                    {product.description || 'No description.'}
                </p>
                <div className="flex items-center justify-between text-xs">
                    <div className="flex gap-2 flex-wrap">
                        <span className="badge badge-climate">{attr.climateSuitability}</span>
                        {attr.style && (
                            <span className="badge" style={{ background: 'var(--color-surface-alt)', color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}>
                                {attr.style}
                            </span>
                        )}
                    </div>
                    <div className="text-right shrink-0">
                        <div className="text-violet-600 font-bold">${Number(product.basePrice).toFixed(2)}</div>
                        <div className="text-slate-500 text-[10px]">Durability: {attr.durabilityRating}/10</div>
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
        <div className="light-theme min-h-screen px-6 py-28 relative" style={{ background: 'var(--bg-color)' }}>
            {/* Top Purple Line */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500"></div>

            <div className="max-w-4xl mx-auto fade-in-up">
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
                    <div className="glass p-12 text-center" style={{ background: 'var(--color-surface)' }}>
                        <p className="text-4xl mb-4">🔍</p>
                        <p className="text-slate-500 mb-6">
                            No products matched your criteria. Try broadening your filters.
                        </p>
                        <Link to="/wizard">
                            <button id="results-retry-btn" className="btn-primary">Try Again</button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
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
