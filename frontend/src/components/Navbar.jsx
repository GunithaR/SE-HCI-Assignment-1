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
        <nav className="fixed left-0 w-full z-50 glass-morph backdrop-blur-lg shadow-lg ring-1 ring-violet-300 transition-all duration-300">
            <div className="px-6 h-16 flex items-center justify-between">

                {/* ── Logo / Brand ─────────────────────────────────────────── */}
                <Link to="/" className="flex items-center gap-3 relative left-3" style={{ textDecoration: 'none' }}>
                    <img src="/anton.png" alt="Anton" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
                    <img src="/gfloor.png" alt="G-Floor" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
                    <img src="/PE+.jpg" alt="PE+" style={{ height: 32, width: 'auto', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                    <img src="/sivilima.png" alt="Sivilima" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
                    <img src="/s-lon.png" alt="S-Lon" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
                    
                </Link>

                {/* ── Right side: Nav links + Theme toggle + Auth ───────────── */}
                <div className="flex items-center gap-4 relative right-3">

                    {/* Nav links — Admin only */}
                    {isAdmin && (
                        <div className="hidden md:flex items-center gap-4 text-[0.95rem]">
                            <Link to="/admin" style={{ textDecoration: 'none' }}>
                                <button
                                    id="nav-admin-btn"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem 1.25rem',
                                        background: 'rgba(255,255,255,0.08)',
                                        color: '#ef4444',
                                        border: '1.5px solid #ef4444',
                                        borderRadius: 9999,
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        whiteSpace: 'nowrap',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(239,68,68,0.25)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    Go to Admin Dashboard
                                </button>
                            </Link>
                        </div>
                    )}

                    {/* Adjusted button sizes to match Sign Up button */}
                    {isAuthenticated ? (
                        <div className="flex flex-col items-end gap-0.5">
                            <button
                                id="nav-logout-btn"
                                onClick={handleLogout}
                                className="btn-secondary !rounded-full text-sm py-2 px-5 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                            >
                                Logout
                            </button>
                            <span
                                className="text-[0.68rem] font-medium hidden sm:block"
                                style={{ color: 'var(--color-muted)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                            >
                                {user?.email}
                            </span>
                        </div>
                    ) : (
                        <>
                            {/* Conditionally render Login and Sign Up buttons */}
                            {!isAuthenticated && window.location.pathname !== '/login' && (
                                <Link to="/login">
                                    <button id="nav-login-btn" className="btn-secondary !rounded-full text-sm py-2 px-5 shadow-lg shadow-indigo-500/30">Login</button>
                                </Link>
                            )}
                            {!isAuthenticated && window.location.pathname !== '/register' && (
                                <Link to="/register">
                                    <button id="nav-register-btn" className="btn-primary !rounded-full text-sm py-2 px-5 shadow-lg shadow-indigo-500/30">Sign Up</button>
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
