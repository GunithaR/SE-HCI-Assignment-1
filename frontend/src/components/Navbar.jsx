import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { isAuthenticated, isAdmin, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="light-theme fixed top-0 left-0 right-0 z-50 glass border-b" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* ── Logo / Brand ─────────────────────────────────────────── */}
                <Link to="/" className="flex items-center gap-4" style={{ textDecoration: 'none' }}>
                    <img src="/anton.png" alt="Anton" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
                    <img src="/gfloor.png" alt="G-Floor" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
                    <img src="/PE+.jpg" alt="PE+" style={{ height: 32, width: 'auto', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                    <img src="/sivilima.png" alt="Sivilima" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
                    <img src="/s-lon.png" alt="S-Lon" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
                </Link>

                {/* ── Nav links ────────────────────────────────────────────── */}
                <div className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                    <Link to="/catalog" className="transition-colors hover:text-violet-600">Catalog</Link>
                    <Link to="/wizard" className="transition-colors hover:text-violet-600">Get Recommendations</Link>
                    {isAdmin && (
                        <Link to="/admin" className="transition-colors text-violet-600 hover:text-violet-800 font-bold">
                            Admin
                        </Link>
                    )}
                </div>

                {/* ── Auth actions ─────────────────────────────────────────── */}
                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            <span className="text-xs hidden sm:block" style={{ color: 'var(--color-muted)' }}>{user?.email}</span>
                            <button id="nav-logout-btn" onClick={handleLogout} className="btn-secondary text-sm py-2 px-4">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <button id="nav-login-btn" className="btn-secondary text-sm py-2 px-4">Login</button>
                            </Link>
                            <Link to="/register">
                                <button id="nav-register-btn" className="btn-primary text-sm py-2 px-4">Sign Up</button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
