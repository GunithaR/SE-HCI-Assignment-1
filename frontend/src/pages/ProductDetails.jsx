/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import catalogService from '../services/catalogService';
import { useAuth } from '../context/AuthContext';

const BUDGET_CONFIG = {
    LOW:    { label: 'Budget-Friendly', icon: '💰', color: '#16a34a', bg: 'rgba(22,163,74,0.12)',  border: 'rgba(22,163,74,0.35)' },
    MEDIUM: { label: 'Mid-Range',       icon: '💎', color: '#7c3aed', bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.35)' },
    HIGH:   { label: 'Premium',         icon: '👑', color: '#b45309', bg: 'rgba(180,83,9,0.12)',   border: 'rgba(180,83,9,0.35)' },
};

function StarRow({ rating, size = '1.1rem' }) {
    const full  = Math.floor(rating);
    const half  = rating - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
        <span style={{ color: '#f59e0b', fontSize: size, letterSpacing: 2 }}>
            {'★'.repeat(full)}{half ? '⯨' : ''}<span style={{ color: '#ddd6fe' }}>{'★'.repeat(empty)}</span>
        </span>
    );
}

function SpecCard({ icon, label, value }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            background: '#fbf8ff', border: '1.5px solid #ede9fe',
            borderRadius: 14, padding: '14px 16px',
            transition: 'box-shadow 0.2s, border-color 0.2s',
        }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#a78bfa'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(124,58,237,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#ede9fe'; e.currentTarget.style.boxShadow = 'none'; }}
        >
            <span style={{ fontSize: '1.4rem', lineHeight: 1, marginTop: 2 }}>{icon}</span>
            <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e1b4b' }}>{value}</div>
            </div>
        </div>
    );
}

export default function ProductDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const [product, setProduct]             = useState(null);
    const [reviews, setReviews]             = useState([]);
    const [loading, setLoading]             = useState(true);
    const [error, setError]                 = useState('');
    const [activeImg, setActiveImg]         = useState(0);
    const [score, setScore]                 = useState(5);
    const [hoverScore, setHoverScore]       = useState(0);
    const [comment, setComment]             = useState('');
    const [submitting, setSubmitting]       = useState(false);
    const [reviewError, setReviewError]     = useState('');
    const [reviewSuccess, setReviewSuccess] = useState(false);

    useEffect(() => {
        setLoading(true);
        catalogService.getProductById(id)
            .then(data => { setProduct(data); setActiveImg(0); })
            .catch(err => setError(err.response?.data?.message || 'Failed to load product.'))
            .finally(() => setLoading(false));
        fetchReviews();
    }, [id]);

    const fetchReviews = () => {
        catalogService.getReviews(id)
            .then(data => setReviews(data.content || []))
            .catch(() => {});
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true); setReviewError(''); setReviewSuccess(false);
        try {
            await catalogService.addReview(id, score, comment);
            setComment(''); setScore(5); setReviewSuccess(true);
            fetchReviews();
            const updated = await catalogService.getProductById(id);
            setProduct(updated);
        } catch (err) {
            setReviewError(err.response?.data?.message || err.response?.data?.error || 'Failed to submit review.');
        } finally { setSubmitting(false); }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#fbf8ff' }}>
            <div className="spinner" />
        </div>
    );

    if (error || !product) return (
        <div style={{ minHeight: '100vh', padding: '8rem 1.5rem', background: '#fbf8ff', textAlign: 'center' }}>
            <p style={{ fontSize: '3rem' }}>😕</p>
            <h2 style={{ color: '#dc2626', fontWeight: 700 }}>{error || 'Product not found'}</h2>
            <Link to="/catalog" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: 600, marginTop: '1rem', display: 'inline-block' }}>← Back to Catalog</Link>
        </div>
    );

    const { name, description, basePrice, brandName, categoryName, budgetLevel,
            durabilityRating, climateSuitability, maintenanceLevel, style: pStyle,
            imageUrls, averageRating, reviewCount, isActive } = product;

    const budget  = BUDGET_CONFIG[budgetLevel];
    const inStock = isActive !== false;
    const imgs    = imageUrls && imageUrls.length > 0 ? imageUrls : [];

    const avgScore = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.score, 0) / reviews.length) : 0;
    const distrib  = [5,4,3,2,1].map(s => ({ star: s, count: reviews.filter(r => r.score === s).length }));

    return (
        <div style={{ minHeight: '100vh', background: '#fbf8ff', paddingTop: '6rem', paddingBottom: '5rem', fontFamily: "'Manrope', 'Inter', sans-serif" }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>

                {/* Breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '2rem', fontSize: '0.82rem', color: '#9ca3af' }}>
                    <Link to="/catalog" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        ← Catalog
                    </Link>
                    <span>/</span>
                    {categoryName && <span style={{ color: '#9ca3af' }}>{categoryName}</span>}
                    {categoryName && <span>/</span>}
                    <span style={{ color: '#4c1d95', fontWeight: 600 }}>{name}</span>
                </div>

                {/* ── TOP SECTION ─────────────────────────────────────────── */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'flex-start' }}>

                    {/* LEFT — Image Gallery */}
                    <div style={{ flex: '0 1 460px', maxWidth: 460 }}>
                        {/* Main Image */}
                        <div style={{
                            width: '100%', aspectRatio: '4/3', maxHeight: 360,
                            borderRadius: 20, overflow: 'hidden',
                            background: 'linear-gradient(135deg,#f5f3ff,#ede9fe)',
                            border: '2px solid #ddd6fe',
                            boxShadow: '0 8px 40px rgba(124,58,237,0.13)',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            position: 'relative',
                        }}>
                            {imgs.length > 0 ? (
                                <img src={imgs[activeImg]} alt={name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }} />
                            ) : (
                                <span style={{ fontSize: '4rem', opacity: 0.4 }}>🏗️</span>
                            )}
                            {/* Budget badge overlay */}
                            {budget && (
                                <span style={{
                                    position: 'absolute', top: 14, left: 14,
                                    background: budget.bg, border: `1px solid ${budget.border}`, color: budget.color,
                                    borderRadius: 9999, padding: '5px 12px', fontSize: '0.72rem', fontWeight: 700,
                                    backdropFilter: 'blur(10px)', boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                    display: 'flex', alignItems: 'center', gap: 5,
                                }}>{budget.icon} {budget.label}</span>
                            )}
                            {/* Stock badge overlay */}
                            <span style={{
                                position: 'absolute', top: 14, right: 14,
                                background: inStock ? 'rgba(22,163,74,0.15)' : 'rgba(220,38,38,0.15)',
                                border: `1px solid ${inStock ? 'rgba(22,163,74,0.4)' : 'rgba(220,38,38,0.4)'}`,
                                color: inStock ? '#16a34a' : '#dc2626',
                                borderRadius: 9999, padding: '5px 12px', fontSize: '0.72rem', fontWeight: 700,
                                backdropFilter: 'blur(10px)',
                            }}>{inStock ? '✅ In Stock' : '❌ Out of Stock'}</span>
                        </div>

                        {/* Thumbnails */}
                        {imgs.length > 1 && (
                            <div style={{ display: 'flex', gap: 10, marginTop: 14, overflowX: 'auto', paddingBottom: 4 }}>
                                {imgs.map((url, idx) => (
                                    <button key={idx} onClick={() => setActiveImg(idx)} style={{
                                        width: 72, height: 72, borderRadius: 12, overflow: 'hidden', flexShrink: 0,
                                        border: `2.5px solid ${activeImg === idx ? '#7c3aed' : 'transparent'}`,
                                        padding: 0, cursor: 'pointer', opacity: activeImg === idx ? 1 : 0.55,
                                        transition: 'all 0.2s', boxShadow: activeImg === idx ? '0 4px 14px rgba(124,58,237,0.3)' : 'none',
                                    }}>
                                        <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT — Product Info */}
                    <div style={{ flex: '1 1 340px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Brand / Category */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            {brandName && (
                                <span style={{ background: '#ede9fe', color: '#7c3aed', borderRadius: 9999, padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700 }}>
                                    {brandName}
                                </span>
                            )}
                            {categoryName && (
                                <span style={{ background: '#f0fdf4', color: '#16a34a', borderRadius: 9999, padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(22,163,74,0.2)' }}>
                                    {categoryName}
                                </span>
                            )}
                        </div>

                        {/* Name */}
                        <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 900, color: '#1e1b4b', lineHeight: 1.15, margin: 0 }}>
                            {name}
                        </h1>

                        {/* Rating row */}
                        {(averageRating > 0 || reviewCount > 0) && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <StarRow rating={averageRating || 0} size="1.2rem" />
                                <span style={{ fontWeight: 800, fontSize: '1rem', color: '#1e1b4b' }}>{(averageRating || 0).toFixed(1)}</span>
                                <span style={{ color: '#9ca3af', fontSize: '0.82rem' }}>({reviewCount} review{reviewCount !== 1 && 's'})</span>
                            </div>
                        )}

                        {/* Price */}
                        <div style={{
                            background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
                            border: '1.5px solid #ddd6fe', borderRadius: 16,
                            padding: '1.1rem 1.4rem', display: 'flex', alignItems: 'center', gap: 16,
                        }}>
                            <div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Base Price</div>
                                <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 900, fontSize: '2rem', color: '#7c3aed', lineHeight: 1 }}>
                                    Rs. {Number(basePrice).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {description && (
                            <div>
                                <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Description</h3>
                                <p style={{ color: '#374151', fontSize: '0.97rem', lineHeight: 1.75, margin: 0 }}>{description}</p>
                            </div>
                        )}

                        {/* Specs Grid */}
                        <div>
                            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Specifications</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10 }}>
                                {budgetLevel       && <SpecCard icon="💰" label="Budget Level"    value={budgetLevel} />}
                                {durabilityRating  && <SpecCard icon="🛡️" label="Durability"       value={`${durabilityRating} / 10`} />}
                                {climateSuitability && <SpecCard icon="🌤" label="Climate"         value={climateSuitability} />}
                                {maintenanceLevel  && <SpecCard icon="🔧" label="Maintenance"      value={maintenanceLevel} />}
                                {pStyle            && <SpecCard icon="🎨" label="Style"            value={pStyle} />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── REVIEWS SECTION ──────────────────────────────────────── */}
                <div style={{ marginTop: '4rem' }}>
                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '2.5rem' }}>
                        <div style={{ flex: 1, height: 1, background: '#ede9fe' }} />
                        <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 900, fontSize: '1.5rem', color: '#1e1b4b', margin: 0, whiteSpace: 'nowrap' }}>
                            ⭐ Customer Reviews
                        </h2>
                        <div style={{ flex: 1, height: 1, background: '#ede9fe' }} />
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', alignItems: 'flex-start' }}>

                        {/* Rating Summary */}
                        {reviews.length > 0 && (
                            <div style={{
                                flex: '0 0 220px', background: '#fff', border: '1.5px solid #ede9fe',
                                borderRadius: 20, padding: '1.5rem', boxShadow: '0 2px 16px rgba(124,58,237,0.07)',
                                textAlign: 'center',
                            }}>
                                <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#7c3aed', lineHeight: 1 }}>{avgScore.toFixed(1)}</div>
                                <StarRow rating={avgScore} size="1.3rem" />
                                <div style={{ color: '#9ca3af', fontSize: '0.78rem', marginTop: 6 }}>{reviews.length} review{reviews.length !== 1 && 's'}</div>
                                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {distrib.map(({ star, count }) => (
                                        <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ fontSize: '0.7rem', color: '#6b7280', width: 14, textAlign: 'right' }}>{star}</span>
                                            <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>★</span>
                                            <div style={{ flex: 1, height: 6, borderRadius: 99, background: '#ede9fe', overflow: 'hidden' }}>
                                                <div style={{
                                                    height: '100%', borderRadius: 99, background: '#7c3aed',
                                                    width: reviews.length ? `${(count / reviews.length) * 100}%` : '0%',
                                                    transition: 'width 0.5s ease',
                                                }} />
                                            </div>
                                            <span style={{ fontSize: '0.7rem', color: '#9ca3af', width: 14 }}>{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews List */}
                        <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {reviews.length === 0 ? (
                                <div style={{ background: '#fff', border: '1.5px solid #ede9fe', borderRadius: 20, padding: '2.5rem', textAlign: 'center' }}>
                                    <p style={{ fontSize: '2.5rem', margin: '0 0 8px' }}>💬</p>
                                    <p style={{ color: '#9ca3af', fontWeight: 500, margin: 0 }}>No reviews yet. Be the first!</p>
                                </div>
                            ) : (
                                reviews.map(r => (
                                    <div key={r.id} style={{
                                        background: '#fff', border: '1.5px solid #ede9fe', borderRadius: 16,
                                        padding: '1.2rem 1.4rem', boxShadow: '0 2px 10px rgba(124,58,237,0.05)',
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                            <div>
                                                <div style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '0.88rem' }}>{r.userEmail || 'Anonymous'}</div>
                                                <div style={{ color: '#f59e0b', fontSize: '0.95rem', marginTop: 2 }}>
                                                    {'★'.repeat(r.score)}<span style={{ color: '#ddd6fe' }}>{'★'.repeat(5 - r.score)}</span>
                                                </div>
                                            </div>
                                            <span style={{ color: '#9ca3af', fontSize: '0.72rem', background: '#f5f3ff', padding: '3px 10px', borderRadius: 9999 }}>
                                                {new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        {r.comment && <p style={{ color: '#374151', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>{r.comment}</p>}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Write Review */}
                        <div style={{ flex: '0 1 300px', minWidth: 260 }}>
                            <div style={{
                                background: '#fff', border: '1.5px solid #ddd6fe', borderRadius: 20,
                                padding: '1.5rem', boxShadow: '0 4px 24px rgba(124,58,237,0.09)',
                                position: 'sticky', top: 90,
                            }}>
                                <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#1e1b4b', margin: '0 0 1.2rem' }}>
                                    ✍️ Write a Review
                                </h3>
                                {!user ? (
                                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                                        Please <Link to="/login" style={{ color: '#7c3aed', fontWeight: 700 }}>log in</Link> to leave a review.
                                    </p>
                                ) : (
                                    <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {reviewError && (
                                            <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', color: '#dc2626', borderRadius: 10, padding: '10px 12px', fontSize: '0.82rem' }}>
                                                {reviewError}
                                            </div>
                                        )}
                                        {reviewSuccess && (
                                            <div style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.25)', color: '#16a34a', borderRadius: 10, padding: '10px 12px', fontSize: '0.82rem' }}>
                                                ✅ Review submitted!
                                            </div>
                                        )}

                                        {/* Star Picker */}
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Your Rating</label>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                {[1,2,3,4,5].map(s => (
                                                    <button type="button" key={s}
                                                        onClick={() => setScore(s)}
                                                        onMouseEnter={() => setHoverScore(s)}
                                                        onMouseLeave={() => setHoverScore(0)}
                                                        style={{
                                                            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                                                            fontSize: '2rem', lineHeight: 1,
                                                            color: s <= (hoverScore || score) ? '#f59e0b' : '#ddd6fe',
                                                            transition: 'color 0.15s, transform 0.15s',
                                                            transform: s <= (hoverScore || score) ? 'scale(1.15)' : 'scale(1)',
                                                        }}>★</button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Comment */}
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Comment <span style={{ color: '#9ca3af', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                                            <textarea
                                                value={comment} onChange={e => setComment(e.target.value)}
                                                rows={4} maxLength={1000}
                                                placeholder="What did you like or dislike?"
                                                style={{
                                                    width: '100%', padding: '10px 12px', borderRadius: 12,
                                                    border: '1.5px solid #ddd6fe', fontFamily: 'inherit', fontSize: '0.88rem',
                                                    resize: 'vertical', outline: 'none', color: '#1e1b4b',
                                                    background: '#fbf8ff', boxSizing: 'border-box',
                                                    transition: 'border-color 0.2s',
                                                }}
                                                onFocus={e => { e.target.style.borderColor = '#7c3aed'; }}
                                                onBlur={e => { e.target.style.borderColor = '#ddd6fe'; }}
                                            />
                                        </div>

                                        <button type="submit" disabled={submitting} style={{
                                            background: submitting ? '#a78bfa' : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                                            color: '#fff', border: 'none', borderRadius: 50,
                                            padding: '12px 0', fontWeight: 700, fontSize: '0.92rem',
                                            cursor: submitting ? 'not-allowed' : 'pointer',
                                            fontFamily: "'Manrope', sans-serif",
                                            boxShadow: submitting ? 'none' : '0 4px 16px rgba(124,58,237,0.35)',
                                            transition: 'all 0.2s',
                                        }}>
                                            {submitting ? 'Submitting…' : 'Submit Review'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
