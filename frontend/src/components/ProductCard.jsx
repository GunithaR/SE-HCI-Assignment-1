import { Link } from 'react-router-dom';

// ── Budget tier config (friendly labels) ─────────────────────────────────────
const BUDGET_CONFIG = {
    LOW:    { label: 'Budget-Friendly', icon: null, color: '#16a34a', bg: 'rgba(22,163,74,0.13)',  border: 'rgba(22,163,74,0.4)' },
    MEDIUM: { label: 'Mid-Range',       icon: null, color: '#7c3aed', bg: 'rgba(124,58,237,0.13)', border: 'rgba(124,58,237,0.4)' },
    HIGH:   { label: 'Premium',         icon: null, color: '#b45309', bg: 'rgba(180,83,9,0.13)',   border: 'rgba(180,83,9,0.4)' },
};

// ── Maintenance level config ──────────────────────────────────────────────────
const MAINTENANCE_CONFIG = {
    LOW:    { label: 'Easy Care',    icon: null },
    MEDIUM: { label: 'Standard',     icon: null },
    HIGH:   { label: 'High Upkeep', icon: null },
};

// ── Star display (filled/empty) ───────────────────────────────────────────────
function StarRating({ rating }) {
    const full  = Math.floor(rating);
    const half  = rating - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
        <span style={{ color: '#f59e0b', fontSize: '0.8rem', letterSpacing: 1 }}>
            {'★'.repeat(full)}
            {half ? '½' : ''}
            <span style={{ color: '#d1d5db' }}>{'☆'.repeat(empty)}</span>
        </span>
    );
}

// ── Pill tag component ────────────────────────────────────────────────────────
function Pill({ icon, label, color = '#7c3aed', bg = 'rgba(124,58,237,0.09)', border = 'rgba(124,58,237,0.25)' }) {
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            background: bg, border: `1px solid ${border}`, color,
            borderRadius: 9999, padding: '3px 9px',
            fontSize: '0.68rem', fontWeight: 600, whiteSpace: 'nowrap',
        }}>
            {icon && <span style={{ fontSize: '0.72rem' }}>{icon}</span>}
            {label}
        </span>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ProductCard({ product, index = 0 }) {
    // Unified field resolution — handles both Home & Catalog data shapes
    const imageToDisplay = product.imageUrl || product.imageUrls?.[0] || null;
    const rating = product.averageRating != null
        ? product.averageRating
        : (product.durabilityRating != null ? product.durabilityRating / 2 : null);
    const reviewCount  = product.reviewCount ?? null;
    const budget       = BUDGET_CONFIG[product.budgetLevel];
    const maintenance  = MAINTENANCE_CONFIG[product.maintenanceLevel];
    const isTopRated   = rating != null && rating >= 4.5;
    // isActive defaults to true when field is absent (Home products)
    const inStock      = product.isActive !== false;

    return (
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
            <div
                className="card-entrance"
                style={{
                    background: '#fff',
                    border: '1.5px solid #ede9fe',
                    borderRadius: 20,
                    overflow: 'hidden',
                    display: 'flex', flexDirection: 'column',
                    height: '100%',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                    boxShadow: '0 2px 16px rgba(124,58,237,0.08)',
                    cursor: 'pointer',
                    animationDelay: `${index * 0.06}s`,
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 20px 48px rgba(124,58,237,0.22)';
                    e.currentTarget.style.borderColor = '#a78bfa';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 16px rgba(124,58,237,0.08)';
                    e.currentTarget.style.borderColor = '#ede9fe';
                }}
            >
                {/* ── Image ───────────────────────────────────────────────── */}
                <div style={{
                    position: 'relative', height: 200, flexShrink: 0, overflow: 'hidden',
                    background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
                }}>
                    {imageToDisplay ? (
                        <img
                            src={imageToDisplay}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                            onError={e => { e.currentTarget.style.display = 'none'; }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                        />
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '3rem', opacity: 0.45 }}>
                            No image
                        </div>
                    )}

                    {/* Budget badge — top left */}
                    {budget && (
                        <span style={{
                            position: 'absolute', top: 10, left: 10,
                            background: budget.bg, border: `1px solid ${budget.border}`, color: budget.color,
                            borderRadius: 9999, padding: '4px 10px',
                            fontSize: '0.67rem', fontWeight: 700,
                            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                        }}>
                            {budget.label}
                        </span>
                    )}

                    {/* Top Rated badge — top right */}
                    {isTopRated && (
                        <span style={{
                            position: 'absolute', top: 10, right: 10,
                            background: 'rgba(251,191,36,0.18)', border: '1px solid rgba(251,191,36,0.55)', color: '#92400e',
                            borderRadius: 9999, padding: '4px 10px',
                            fontSize: '0.67rem', fontWeight: 700,
                            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                        }}>
                            Top Rated
                        </span>
                    )}
                </div>

                {/* ── Body ────────────────────────────────────────────────── */}
                <div style={{ padding: '1rem 1.15rem 1.2rem', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>

                    {/* Name */}
                    <h3 style={{
                        fontFamily: "'Manrope', 'Inter', sans-serif",
                        fontWeight: 700, fontSize: '0.97rem',
                        color: '#1e1b4b', lineHeight: 1.35, margin: 0,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                        {product.name}
                    </h3>

                    {/* Brand · Category */}
                    {(product.brandName || product.categoryName) && (
                        <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.72rem', lineHeight: 1.4 }}>
                            {product.brandName && <span>{product.brandName}</span>}
                            {product.brandName && product.categoryName && <span> · </span>}
                            {product.categoryName && <span style={{ color: '#8b5cf6' }}>{product.categoryName}</span>}
                        </p>
                    )}

                    {/* Rating */}
                    {rating != null && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <StarRating rating={rating} />
                            <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#374151' }}>
                                {rating.toFixed(1)}
                            </span>
                            {reviewCount != null && (
                                <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>({reviewCount})</span>
                            )}
                        </div>
                    )}

                    {/* Description */}
                    {product.description && (
                        <p style={{
                            margin: 0, color: '#6b7280', fontSize: '0.75rem', lineHeight: 1.6,
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                            {product.description}
                        </p>
                    )}

                    {/* Attribute pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 2 }}>
                        {product.climateSuitability && (
                            <Pill
                                icon={null}
                                label={product.climateSuitability}
                                color="#0369a1"
                                bg="rgba(3,105,161,0.08)"
                                border="rgba(3,105,161,0.25)"
                            />
                        )}
                        {maintenance && (
                            <Pill
                                icon={maintenance.icon}
                                label={maintenance.label}
                                color="#7c3aed"
                                bg="rgba(124,58,237,0.08)"
                                border="rgba(124,58,237,0.25)"
                            />
                        )}
                        {product.material && (
                            <Pill
                                icon={null}
                                label={product.material}
                                color="#374151"
                                bg="rgba(55,65,81,0.07)"
                                border="rgba(55,65,81,0.2)"
                            />
                        )}
                    </div>

                    {/* Spacer */}
                    <div style={{ flex: 1, minHeight: 4 }} />

                    {/* Price row */}
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        borderTop: '1px solid #f3f0ff', paddingTop: 10, marginTop: 4,
                    }}>
                        <div>
                            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#7c3aed' }}>
                                Rs. {Number(product.basePrice).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            {product.size && (
                                <span style={{ color: '#9ca3af', fontSize: '0.7rem', marginLeft: 4 }}>/ {product.size}</span>
                            )}
                        </div>
                        <span style={{
                            padding: '3px 10px', borderRadius: 9999, fontSize: '0.67rem', fontWeight: 700,
                            background: inStock ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)',
                            color: inStock ? '#16a34a' : '#dc2626',
                            border: `1px solid ${inStock ? 'rgba(22,163,74,0.3)' : 'rgba(220,38,38,0.3)'}`,
                        }}>
                            {inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>

                    {/* View Details button */}
                    <button
                        style={{
                            width: '100%', padding: '10px 0',
                            border: '1.5px solid #7c3aed', borderRadius: 50,
                            background: 'transparent', cursor: 'pointer',
                            color: '#7c3aed', fontWeight: 700, fontSize: '0.88rem',
                            fontFamily: "'Manrope', sans-serif",
                            transition: 'background 0.22s, color 0.22s, box-shadow 0.22s',
                            marginTop: 4,
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = '#7c3aed';
                            e.currentTarget.style.color = '#fff';
                            e.currentTarget.style.boxShadow = '0 4px 18px rgba(124,58,237,0.35)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#7c3aed';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        View Details
                    </button>
                </div>
            </div>
        </Link>
    );
}
