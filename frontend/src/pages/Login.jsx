import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(form.email, form.password);
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 md:p-12 xl:p-20 bg-gradient-to-br from-[#f4ebff] via-[#dbccf8] to-[#7f42f0] font-sans antialiased">
            
            {/* Global Container */}
            <div className="max-w-[1700px] w-full flex flex-col xl:flex-row items-center gap-16 2xl:gap-32">
                
                {/* ── Left Side: Brand & Image ───────────────────────────── */}
                <div className="flex-1 w-full mt-12 xl:mt-0 fade-in-up flex flex-col justify-center">
                    <p className="text-violet-600 font-extrabold uppercase tracking-[0.2em] text-sm mb-4">
                        Built on quality choices
                    </p>
                    <h1 className="text-gray-900 text-6xl xl:text-7xl 2xl:text-[5rem] font-black tracking-tight mb-6 leading-none" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        L+ SIVILIMA
                    </h1>
                    <p className="text-gray-700 text-lg xl:text-xl leading-relaxed max-w-2xl mb-12 font-medium">
                        Access your curated construction experience—explore premium materials, manage your projects, and unlock intelligent recommendations.
                    </p>
                    <div className="w-full max-w-[800px] aspect-[16/9] overflow-hidden rounded-[2.5rem] shadow-2xl">
                        <img 
                            src="/login-hero.png" 
                            alt="Premium Interior" 
                            className="w-full h-full object-cover zoom-image"
                        />
                    </div>
                </div>

                {/* ── Right Side: Login Card ─────────────────────────────── */}
                <div className="w-full md:w-[650px] xl:w-[750px] 2xl:w-[850px] shrink-0 fade-in-up md:delay-100 flex justify-center xl:justify-end self-stretch py-8">
                    <div className="w-full min-h-[800px] xl:min-h-[900px] 2xl:min-h-[1000px] flex flex-col justify-evenly bg-gradient-to-b from-[#8B4CF0] via-[#652CD1] to-[#2E0B64] rounded-[3rem] p-12 md:p-16 xl:p-20 shadow-[0_30px_70px_rgba(46,11,100,0.5)] relative overflow-hidden">
                        
                        {/* Header */}
                        <div className="flex flex-col items-start gap-4">
                            <h2 className="text-white text-5xl xl:text-6xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>Welcome Back</h2>
                            <p className="text-white/70 text-base xl:text-lg font-semibold">
                                Enter your credentials to access your architectural projects
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 rounded-2xl bg-red-500/20 text-red-100 text-[0.95rem] font-bold flex items-center gap-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white font-bold shrink-0">!</span>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-evenly py-6">
                            {/* Email Field */}
                            <div className="flex flex-col gap-3">
                                <label className="block text-white/80 text-xs xl:text-[0.8rem] font-extrabold uppercase tracking-[0.2em] pl-3">
                                    Email Address
                                </label>
                                <div className="flex items-center bg-white/10 rounded-full px-6 py-5 border border-transparent focus-within:border-white/30 focus-within:bg-white/15 transition-all">
                                    <svg className="w-5 h-5 xl:w-6 xl:h-6 text-white/50 mr-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="admin@platform.com"
                                        className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-[1.05rem] xl:text-[1.1rem] font-medium"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="flex flex-col gap-3">
                                <label className="block text-white/80 text-xs xl:text-[0.8rem] font-extrabold uppercase tracking-[0.2em] pl-3">
                                    Password
                                </label>
                                <div className="flex items-center bg-white/10 rounded-full px-6 py-5 border border-transparent focus-within:border-white/30 focus-within:bg-white/15 transition-all">
                                    <svg className="w-5 h-5 xl:w-6 xl:h-6 text-white/50 mr-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-[1.05rem] xl:text-[1.1rem] tracking-widest font-medium"
                                    />
                                </div>
                            </div>

                            {/* Remember & Forgot */}
                            <div className="flex items-center justify-between px-3">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input 
                                            type="checkbox" 
                                            name="rememberMe"
                                            checked={form.rememberMe}
                                            onChange={handleChange}
                                            className="form-checkbox w-5 h-5 rounded text-violet-600 bg-white/20 border-none focus:ring-0 cursor-pointer"
                                        />
                                    </div>
                                    <span className="text-[0.85rem] xl:text-[0.95rem] text-white/70 font-semibold group-hover:text-white transition-colors">Remember me</span>
                                </label>
                                <button type="button" className="text-[0.85rem] xl:text-[0.95rem] text-white/70 font-semibold hover:text-white transition-colors">
                                    Forgot Password?
                                </button>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 rounded-full bg-white hover:bg-gray-100 text-gray-900 font-extrabold text-[1.05rem] xl:text-[1.15rem] shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Sign In
                                            <svg className="w-6 h-6 xl:w-7 xl:h-7 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Footer Link */}
                        <div className="text-center pt-4">
                            <span className="text-[0.85rem] xl:text-[0.95rem] text-white/60 font-medium tracking-wide">Don't have an account? </span>
                            <Link to="/catalog" className="text-[0.85rem] xl:text-[0.95rem] text-white font-bold hover:underline tracking-wide">
                                Browse our designs
                            </Link>
                        </div>
                        
                    </div>
                </div>

            </div>
        </div>
    );
}
