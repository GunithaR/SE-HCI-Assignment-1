import { Link } from 'react-router-dom';

const BUDGET_COLORS = {
    LOW: { bg: 'rgba(34,197,94,0.12)', fg: '#4ade80' },
    MEDIUM: { bg: 'rgba(245,158,11,0.12)', fg: '#fbbf24' },
    HIGH: { bg: 'rgba(239,68,68,0.12)', fg: '#f87171' },
};

export default function ProductCard({ product }) {
    const bc = BUDGET_COLORS[product.budgetLevel] || { bg: 'rgba(148,163,184,0.1)', fg: '#94a3b8' };
    const imageToDisplay = (product.imageUrls && product.imageUrls.length > 0) ? product.imageUrls[0] : null;

    return (
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', display: 'flex' }}>
            <div style={{
                background: 'var(--color-surface)',
                border: '2px solid #a78bfa',
                boxShadow: '0 4px 12px rgba(139,92,246,0.1)',
                borderRadius: 16,
                overflow: 'hidden',
                padding: 0,
                display: 'flex', flexDirection: 'column', gap: 0,
                transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
                width: '100%'
            }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; e.currentTarget.style.boxShadow = 'var(--shadow-glow)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
                {imageToDisplay && (
                    <div style={{ width: '100%', height: 180, overflow: 'hidden', background: 'var(--color-surface-alt)' }}>
                        <img
                            src={imageToDisplay}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
                        />
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '1.25rem', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ color: 'var(--color-text)', fontWeight: 600, fontSize: '0.95rem', marginBottom: 2 }}>
                                {product.name}
                            </h3>
                            <p style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>
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
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: -4 }}>
                        <span style={{ color: '#fbbf24', fontSize: '0.85rem' }}>★</span>
                        <span style={{ color: 'var(--color-text)', fontSize: '0.8rem', fontWeight: 600 }}>
                            {product.averageRating > 0 ? product.averageRating.toFixed(1) : 'No rating'}
                        </span>
                        <span style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>
                            ({product.reviewCount || 0})
                        </span>
                    </div>

                    <p style={{ color: 'var(--color-muted)', fontSize: '0.78rem', lineHeight: 1.65, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {product.description || 'Premium construction material.'}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {product.climateSuitability && (
                            <span style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 9999, padding: '2px 9px', fontSize: '0.68rem' }}>
                                ☁ {product.climateSuitability}
                            </span>
                        )}
                        {product.maintenanceLevel && (
                            <span style={{ background: 'rgba(20,184,166,0.12)', color: '#14b8a6', border: '1px solid rgba(20,184,166,0.25)', borderRadius: 9999, padding: '2px 9px', fontSize: '0.68rem' }}>
                                🔧 {product.maintenanceLevel}
                            </span>
                        )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: 10, marginTop: 'auto' }}>
                        <span style={{ color: '#8b5cf6', fontWeight: 700, fontSize: '1.15rem' }}>
                            Rs. {Number(product.basePrice).toFixed(2)}
                        </span>
                        <span style={{
                            padding: '3px 10px', borderRadius: 9999, fontSize: '0.68rem', fontWeight: 600,
                            background: product.isActive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                            color: product.isActive ? '#16a34a' : '#dc2626',
                        }}>
                            {product.isActive ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
