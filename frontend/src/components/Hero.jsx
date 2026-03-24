import { Link } from 'react-router-dom';

export default function Hero() {
    return (
        <section
            className="hero"
            style={{ backgroundImage: 'url("/store-bg.jpg")' }}
        >
            <div className="hero-overlay" />
            <div className="hero-content fade-in-up">
                <p style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: 'var(--color-accent-light)',
                    marginBottom: '16px',
                }}>
                    CONSTRUCTION PLATFORM
                </p>
                <h1 className="hero-title">
                    L+ සිවිලිම
                </h1>
                <p className="hero-subtitle">
                    Browse premium construction materials from top brands.
                    Filter by category, compare by budget and climate — all in one place.
                </p>
                <Link to="/catalog" className="hero-cta">
                    Browse Products →
                </Link>
            </div>
        </section>
    );
}
