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
        <nav className="light-theme fixed left-0 w-full z-50 glass-pill backdrop-blur-md shadow-lg     ring-1 ring-indigo-300 transition-all duration-300">
            <div className="px-6 h-16 flex items-center justify-between">

                {/* ── Logo / Brand ─────────────────────────────────────────── */}
                <Link to="/" className="flex items-center gap-3 relative left-3" style={{ textDecoration: 'none' }}>
                    <img src="/anton.png" alt="Anton" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
                    <img src="/gfloor.png" alt="G-Floor" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
                    <img src="/PE+.jpg" alt="PE+" style={{ height: 32, width: 'auto', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                    <img src="/sivilima.png" alt="Sivilima" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
                    <img src="/s-lon.png" alt="S-Lon" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
                    
                    {/*}
                    <span
                        style={{
                            fontFamily: 'Outfit, sans-serif',
                            fontWeight: 900,
                            fontSize: '1.2rem',
                            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.02em',
                            lineHeight: 1,
                        }}
                    >
                        L<span style={{ color: 'var(--color-primary)', WebkitTextFillColor: 'var(--color-primary)' }}>+</span>
                        {' '}
                        <span style={{ fontWeight: 400, fontSize: '0.85rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                            SIVILIMA
                        </span> 
                    </span>
                    */}
                    
                </Link>

                {/* ── Nav links ────────────────────────────────────────────── */}
                <div className="hidden md:flex flex-1 justify-center items-center gap-8 text-[0.95rem]">
                    <Link to="/catalog" className="nav-link">Catalog</Link>
                    <Link to="/wizard" className="nav-link">Get Recommendations</Link>
                    {isAdmin && (
                        <Link to="/admin" className="nav-link !font-bold !text-violet-600">
                            Admin
                        </Link>
                    )}
                </div>

                {/* ── Auth actions ─────────────────────────────────────────── */}
                <div className="flex items-center gap-3 relative right-3">
                    {isAuthenticated ? (
                        <>
                            <span className="text-xs hidden sm:block font-medium px-3 py-1 rounded-full border" style={{ color: 'var(--color-muted)', borderColor: 'var(--color-border)', background: 'var(--color-surface-alt)' }}>{user?.email}</span>
                            <button id="nav-logout-btn" onClick={handleLogout} className="btn-secondary !rounded-full text-sm py-2 px-5 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <button id="nav-login-btn" className="btn-secondary !rounded-full text-sm py-2 px-5">Login</button>
                            </Link>
                            <Link to="/register">
                                <button id="nav-register-btn" className="btn-primary !rounded-full text-sm py-2 px-5 shadow-lg shadow-indigo-500/30">Sign Up</button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
