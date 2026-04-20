/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import catalogService from '../services/catalogService';
import { useAuth } from '../context/AuthContext';

export default function ProductDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    
    // UI states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Review form states
    const [score, setScore] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewError, setReviewError] = useState('');

    useEffect(() => {
        setLoading(true);
        catalogService.getProductById(id)
            .then(data => {
                setProduct(data);
                if (data.imageUrls && data.imageUrls.length > 0) {
                    setActiveImageIndex(0);
                }
            })
            .catch(err => setError(err.response?.data?.message || 'Failed to load product details.'))
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
        setReviewSubmitting(true);
        setReviewError('');
        try {
            await catalogService.addReview(id, score, comment);
            setComment('');
            setScore(5);
            fetchReviews();
            
            // Reload product to update the reviewCount and averageRating
            const updatedProduct = await catalogService.getProductById(id);
            setProduct(updatedProduct);
        } catch (err) {
            setReviewError(err.response?.data?.message || err.response?.data?.error || 'Failed to submit review.');
        } finally {
            setReviewSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-color)' }}>
                <div className="spinner" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div style={{ minHeight: '100vh', padding: '7rem 1.5rem', background: 'var(--bg-color)', textAlign: 'center' }}>
                <h2 style={{ color: '#f87171' }}>{error || 'Product not found'}</h2>
                <Link to="/catalog" style={{ color: '#8b5cf6', textDecoration: 'underline', marginTop: '1rem', display: 'inline-block' }}>Back to Catalog</Link>
            </div>
        );
    }

    const {
        name, description, basePrice, brandName, categoryName,
        budgetLevel, durabilityRating, climateSuitability, maintenanceLevel, style,
        imageUrls, averageRating, reviewCount, isActive
    } = product;

    return (
        <div className="light-theme" style={{ minHeight: '100vh', background: 'var(--bg-color)', paddingTop: '6rem', paddingBottom: '4rem' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem' }}>
                
                {/* Back button */}
                <Link to="/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', textDecoration: 'none', marginBottom: '2rem', fontWeight: 500 }}>
                    <span>←</span> Back to Catalog
                </Link>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
                    
                    {/* Left: Image Gallery */}
                    <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{
                            width: '100%', aspectRatio: '4/3', borderRadius: 16, overflow: 'hidden', 
                            background: 'var(--color-surface)', border: '2px solid var(--color-border)',
                            display: 'flex', justifyContent: 'center', alignItems: 'center'
                        }}>
                            {imageUrls && imageUrls.length > 0 ? (
                                <img src={imageUrls[activeImageIndex]} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                                <span style={{ fontSize: '3rem', color: '#cbd5e1' }}>📦</span>
                            )}
                        </div>
                        
                        {/* Thumbnail Strip */}
                        {imageUrls && imageUrls.length > 1 && (
                            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                                {imageUrls.map((url, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => setActiveImageIndex(idx)}
                                        style={{ 
                                            width: 80, height: 80, borderRadius: 10, overflow: 'hidden', 
                                            border: activeImageIndex === idx ? '2px solid #8b5cf6' : '2px solid transparent',
                                            cursor: 'pointer', flexShrink: 0, opacity: activeImageIndex === idx ? 1 : 0.6,
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <img src={url} alt={`${name} ${idx+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Info */}
                    <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <div style={{ display: 'flex', gap: 8, color: '#8b5cf6', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {brandName && <span>{brandName}</span>}
                                {brandName && categoryName && <span>•</span>}
                                {categoryName && <span>{categoryName}</span>}
                            </div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1.1, marginBottom: '0.75rem' }}>
                                {name}
                            </h1>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span style={{ color: '#fbbf24', fontSize: '1.25rem' }}>★</span>
                                    <span style={{ color: 'var(--color-text)', fontSize: '1.1rem', fontWeight: 700 }}>
                                        {averageRating > 0 ? averageRating.toFixed(1) : 'New'}
                                    </span>
                                </div>
                                <span style={{ color: '#cbd5e1' }}>|</span>
                                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                    {reviewCount} review{reviewCount !== 1 && 's'}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#8b5cf6' }}>
                                Rs. {Number(basePrice).toFixed(2)}
                            </span>
                            <span style={{
                                padding: '6px 14px', borderRadius: 9999, fontSize: '0.8rem', fontWeight: 700,
                                background: isActive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                                color: isActive ? '#16a34a' : '#dc2626', border: `1px solid ${isActive ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`
                            }}>
                                {isActive ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>

                        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7 }}>
                            {description || 'This product has no description provided.'}
                        </p>

                        {/* Specs Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--color-surface)', padding: '1.5rem', borderRadius: 16, border: '1px solid var(--color-border)' }}>
                            {budgetLevel && (
                                <div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Budget Level</div>
                                    <div style={{ color: 'var(--color-text)', fontWeight: 600 }}>{budgetLevel}</div>
                                </div>
                            )}
                            {durabilityRating && (
                                <div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Durability</div>
                                    <div style={{ color: 'var(--color-text)', fontWeight: 600 }}>{durabilityRating} / 10</div>
                                </div>
                            )}
                            {climateSuitability && (
                                <div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Climate</div>
                                    <div style={{ color: 'var(--color-text)', fontWeight: 600 }}>{climateSuitability}</div>
                                </div>
                            )}
                            {maintenanceLevel && (
                                <div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Maintenance</div>
                                    <div style={{ color: 'var(--color-text)', fontWeight: 600 }}>{maintenanceLevel}</div>
                                </div>
                            )}
                            {style && (
                                <div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Style</div>
                                    <div style={{ color: 'var(--color-text)', fontWeight: 600 }}>{style}</div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* ── Reviews Section ────────────────────────────────────────── */}
                <div style={{ marginTop: '5rem', borderTop: '1px solid var(--color-border)', paddingTop: '3rem' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '2rem' }}>Customer Reviews</h2>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        
                        {/* Review Content */}
                        <div style={{ gridColumn: 'span 2' }}>
                            {reviews.length === 0 ? (
                                <div style={{ color: '#94a3b8', fontStyle: 'italic', padding: '2rem', background: 'var(--color-surface)', borderRadius: 16, textAlign: 'center' }}>
                                    No reviews yet. Be the first to share your thoughts!
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {reviews.map(r => (
                                        <div key={r.id} style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: 16, border: '1px solid var(--color-border)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                                <div style={{ color: 'var(--color-text)', fontWeight: 700 }}>{r.userEmail || 'Anonymous'}</div>
                                                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{new Date(r.createdAt).toLocaleDateString()}</div>
                                            </div>
                                            <div style={{ color: '#fbbf24', fontSize: '1.1rem', marginBottom: 12 }}>
                                                {'★'.repeat(r.score)}{'☆'.repeat(5 - r.score)}
                                            </div>
                                            {r.comment && (
                                                <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>{r.comment}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Review Form */}
                        <div>
                            <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: 16, border: '2px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '1rem' }}>Write a Review</h3>
                                {!user ? (
                                    <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                        Please <Link to="/login" style={{ color: '#8b5cf6', textDecoration: 'underline' }}>log in</Link> to leave a review.
                                    </div>
                                ) : (
                                    <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {reviewError && <div style={{ color: '#ef4444', fontSize: '0.85rem', background: '#fee2e2', padding: '8px 12px', borderRadius: 8 }}>{reviewError}</div>}
                                        
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-muted)', marginBottom: 6 }}>Rating</label>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                {[1,2,3,4,5].map(star => (
                                                    <span 
                                                        key={star} 
                                                        onClick={() => setScore(star)}
                                                        style={{ fontSize: '1.8rem', cursor: 'pointer', color: star <= score ? '#fbbf24' : '#e2e8f0', transition: 'color 0.2s' }}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-muted)', marginBottom: 6 }}>Comment (Optional)</label>
                                            <textarea 
                                                value={comment}
                                                onChange={e => setComment(e.target.value)}
                                                rows={4}
                                                maxLength={1000}
                                                placeholder="What did you like or dislike?"
                                                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '2px solid #e2e8f0', fontFamily: 'inherit', fontSize: '0.95rem', resize: 'vertical' }}
                                            />
                                        </div>

                                        <button 
                                            type="submit" 
                                            disabled={reviewSubmitting}
                                            style={{ 
                                                background: reviewSubmitting ? '#a78bfa' : '#8b5cf6', 
                                                color: '#fff', border: 'none', padding: '12px', borderRadius: 8, 
                                                fontWeight: 700, fontSize: '0.95rem', cursor: reviewSubmitting ? 'not-allowed' : 'pointer',
                                                transition: 'background 0.2s', marginTop: 4
                                            }}
                                        >
                                            {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
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
