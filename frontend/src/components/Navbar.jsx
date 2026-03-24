import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
    const { isAuthenticated, isAdmin, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    const closeMenu = () => setMenuOpen(false);

    const navLinks = (
        <>
            <Link
                to="/catalog"
                className={`nav-link${isActive('/catalog') ? ' active' : ''}`}
                onClick={closeMenu}
            >
                Catalog
            </Link>
            <Link
                to="/wizard"
                className={`nav-link${isActive('/wizard') ? ' active' : ''}`}
                onClick={closeMenu}
            >
                Recommendations
            </Link>
            {isAdmin && (
                <Link
                    to="/admin"
                    className={`nav-link${isActive('/admin') ? ' active' : ''}`}
                    onClick={closeMenu}
                >
                    Admin
                </Link>
            )}
        </>
    );

    return (
        <>
            <nav className="navbar">
                <div className="navbar-inner">
                    {/* ── Left: Brand Logos ─────────────────────────── */}
                    <Link to="/" className="navbar-logos" style={{ textDecoration: 'none' }}>
                        <img src="/anton.png" alt="Anton" className="navbar-logo-img" />
                        <img src="/gfloor.png" alt="G-Floor" className="navbar-logo-img" />
                        <img src="/PE+.jpg" alt="PE+" className="navbar-logo-img" style={{ mixBlendMode: 'multiply' }} />
                        <img src="/sivilima.png" alt="Sivilima" className="navbar-logo-img" />
                        <img src="/s-lon.png" alt="S-Lon" className="navbar-logo-img" />
                    </Link>

                    {/* ── Center: Navigation ────────────────────────── */}
                    <div className="navbar-links">
                        {navLinks}
                    </div>

                    {/* ── Right: Auth Section ───────────────────────── */}
                    <div className="navbar-auth">
                        {isAuthenticated ? (
                            <>
                                <span className="navbar-email">{user?.email}</span>
                                <button
                                    id="nav-logout-btn"
                                    onClick={handleLogout}
                                    className="btn-logout"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <button id="nav-login-btn" className="btn-ghost" style={{ borderRadius: 'var(--radius-full)', fontSize: '0.85rem', padding: '7px 18px' }}>
                                        Login
                                    </button>
                                </Link>
                                <Link to="/register">
                                    <button id="nav-register-btn" className="btn-primary" style={{ borderRadius: 'var(--radius-full)', fontSize: '0.85rem', padding: '7px 18px' }}>
                                        Sign Up
                                    </button>
                                </Link>
                            </>
                        )}

                        {/* ── Hamburger (mobile) ─────────────────────── */}
                        <button
                            className="navbar-hamburger"
                            onClick={() => setMenuOpen((o) => !o)}
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? (
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Mobile Menu ─────────────────────────────────── */}
            <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
                {navLinks}
                {isAuthenticated && (
                    <div style={{ paddingTop: 'var(--space-sm)', borderTop: '1px solid var(--color-border)', marginTop: 'var(--space-sm)' }}>
                        <span style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-muted)', marginBottom: '8px' }}>{user?.email}</span>
                        <button onClick={handleLogout} className="btn-logout" style={{ width: '100%', justifyContent: 'center' }}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
