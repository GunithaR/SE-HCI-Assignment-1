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
                <div className="w-full md:w-[490px] xl:w-[560px] 2xl:w-[640px] shrink-0 fade-in-up md:delay-100 flex py-8 xl:py-12">
                    <div className="w-full bg-gradient-to-b from-[#8B4CF0] via-[#652CD1] to-[#2E0B64] rounded-[2.5rem] p-10 md:p-12 shadow-[0_30px_70px_rgba(46,11,100,0.5)] relative overflow-hidden flex flex-col space-y-8 border border-white/5 h-fit">
                        
                        {/* 1. Header Block */}
                        <div className="flex flex-col space-y-2">
                            <h2 className="text-white text-4xl xl:text-5xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>Welcome Back</h2>
                            <p className="text-white/80 text-sm xl:text-[0.95rem] font-medium leading-relaxed">
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

                        {/* 2. Form Block */}
                        <form onSubmit={handleSubmit} className="flex flex-col space-y-6 w-full">
                            
                            {/* Email Block */}
                            <div className="flex flex-col space-y-2.5">
                                <label className="text-white/90 text-[0.75rem] font-bold uppercase tracking-[0.15em] pl-1">
                                    Email Address
                                </label>
                                <div className="flex items-center bg-white/10 rounded-full px-6 py-[1.15rem] border border-transparent focus-within:border-white/30 focus-within:bg-white/15 transition-all">
                                    <svg className="w-5 h-5 xl:w-[1.4rem] xl:h-[1.4rem] text-white/50 mr-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="admin@platform.com"
                                        className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-[1rem] xl:text-[1.05rem] font-medium"
                                    />
                                </div>
                            </div>

                            {/* Password Block */}
                            <div className="flex flex-col space-y-2.5">
                                <label className="text-white/90 text-[0.75rem] font-bold uppercase tracking-[0.15em] pl-1">
                                    Password
                                </label>
                                <div className="flex items-center bg-white/10 rounded-full px-6 py-[1.15rem] border border-transparent focus-within:border-white/30 focus-within:bg-white/15 transition-all">
                                    <svg className="w-5 h-5 xl:w-[1.4rem] xl:h-[1.4rem] text-white/50 mr-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-[1rem] xl:text-[1.05rem] tracking-widest font-medium"
                                    />
                                </div>
                            </div>

                            {/* Remember & Forgot Block */}
                            <div className="flex items-center justify-between px-1">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center w-5 h-5">
                                        <input 
                                            type="checkbox" 
                                            name="rememberMe"
                                            checked={form.rememberMe}
                                            onChange={handleChange}
                                            className="absolute form-checkbox w-full h-full rounded-full text-[#6D28D9] bg-white/20 border-none focus:ring-0 cursor-pointer appearance-none m-0"
                                        />
                                        <svg className={`w-3.5 h-3.5 text-white absolute pointer-events-none transition-opacity ${form.rememberMe ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-[0.9rem] text-white/80 font-medium group-hover:text-white transition-colors">Remember me</span>
                                </label>
                                <button type="button" className="text-[0.9rem] text-white/90 font-semibold hover:text-white transition-colors">
                                    Forgot Password?
                                </button>
                            </div>

                            {/* Submit Button Block */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-[1.15rem] rounded-full bg-white hover:bg-gray-100 text-gray-900 font-extrabold text-[1.1rem] shadow-[0_10px_25px_rgba(0,0,0,0.15)] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Sign In
                                            <svg className="w-6 h-6 xl:w-[1.6rem] xl:h-[1.6rem] ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* 3. Footer Block */}
                        <div className="text-center w-full pt-4">
                            <span className="text-[0.9rem] text-white/60 font-medium">Don't have an account? </span>
                            <Link to="/catalog" className="text-[0.9rem] text-white font-bold hover:underline">
                                Browse our designs
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
