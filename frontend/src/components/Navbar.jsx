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
                <div className="hidden md:flex flex-1 justify-center items-center gap-10 text-[0.92rem] font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    <Link to="/catalog" className="nav-link tracking-wide opacity-80 hover:opacity-100 transition-opacity">Catalog</Link>
                    <Link to="/wizard" className="nav-link tracking-wide opacity-80 hover:opacity-100 transition-opacity">Get Recommendations</Link>
                    {isAdmin && (
                        <Link to="/admin" className="nav-link !text-violet-600 font-bold">
                            Admin Dashboard
                        </Link>
                    )}
                </div>

                {/* ── Auth actions ─────────────────────────────────────────── */}
                <div className="flex items-center gap-4 relative right-3">
                    {isAuthenticated ? (
                        <>
                            <span className="text-[0.7rem] hidden sm:block font-bold px-4 py-1.5 rounded-full border border-indigo-200/50 text-indigo-900/60 bg-indigo-50/30 uppercase tracking-widest" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                {user?.email}
                            </span>
                            <button
                                id="nav-logout-btn"
                                onClick={handleLogout}
                                className="text-[0.85rem] font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-widest px-2"
                                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <Link to="/login">
                            <button
                                id="nav-login-btn"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[0.85rem] py-2.5 px-8 rounded-full shadow-lg shadow-indigo-600/20 active:scale-95 transition-all uppercase tracking-widest"
                                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                            >
                                Sign In
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
