const BUDGET_COLORS = {
    LOW: 'badge-budget-low',
    MEDIUM: 'badge-budget-medium',
    HIGH: 'badge-budget-high',
};

export default function ProductCard({ product }) {
    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Product Image */}
            {product.imageUrl && (
                <div style={{ width: '100%', height: 200, overflow: 'hidden', background: 'var(--color-surface-alt)' }}>
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                            transition: 'transform var(--transition-slow)',
                        }}
                        onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    />
                </div>
            )}

            {/* Card Body */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '20px', flex: 1 }}>
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text)', marginBottom: 2 }}>
                            {product.name}
                        </h3>
                        <p style={{ color: 'var(--color-muted)', fontSize: '0.78rem' }}>
                            {product.brandName && <span>{product.brandName}</span>}
                            {product.brandName && product.categoryName && <span> · </span>}
                            {product.categoryName && <span style={{ color: 'var(--color-primary-light)' }}>{product.categoryName}</span>}
                        </p>
                    </div>
                    {product.budgetLevel && (
                        <span className={`badge ${BUDGET_COLORS[product.budgetLevel] || 'badge-neutral'}`}>
                            {product.budgetLevel}
                        </span>
                    )}
                </div>

                {/* Description */}
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem', lineHeight: 1.65, flex: 1 }}>
                    {product.description || 'Premium construction material.'}
                </p>

                {/* Attribute Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {product.climateSuitability && (
                        <span className="badge badge-info">☁ {product.climateSuitability}</span>
                    )}
                    {product.maintenanceLevel && (
                        <span className="badge badge-success">🔧 {product.maintenanceLevel}</span>
                    )}
                    {product.durabilityRating && (
                        <span className="badge badge-neutral">★ {product.durabilityRating}/10</span>
                    )}
                    {product.style && (
                        <span className="badge badge-neutral">{product.style}</span>
                    )}
                </div>

                {/* Footer: Price + Status */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--color-border)',
                    paddingTop: 12,
                    marginTop: 4,
                }}>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.1rem' }}>
                        Rs. {Number(product.basePrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    {product.isActive !== undefined && (
                        <span className={`badge ${product.isActive ? 'badge-success' : 'badge-error'}`}>
                            {product.isActive ? 'In Stock' : 'Out of Stock'}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
