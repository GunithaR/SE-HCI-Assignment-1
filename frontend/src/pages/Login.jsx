import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await login(form.email, form.password);
            navigate(data.role === 'ADMIN' ? '/admin' : '/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="light-theme min-h-screen flex items-center justify-center px-4 hero-bg fade-in-up relative pt-24">
            {/* Top Purple Accent Line */}


            <div className="w-full max-w-md glass p-8" style={{ border: '2px solid #a78bfa', boxShadow: '0 4px 12px rgba(139,92,246,0.1)' }}>
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-violet-100/80 text-violet-600 mb-4 shadow-sm border border-violet-200">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <h1
                        className="text-2xl font-bold mt-1 text-slate-800"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                        Welcome Back
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Sign in to your L+ SIVILIMA account</p>
                </div>

                {error && (
                    <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form id="login-form" onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-indigo-950 mb-1.5 uppercase tracking-wide">Email</label>
                        <input
                            id="login-email"
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="input-field shadow-sm bg-white"
                            style={{ border: '2px solid #c4b5fd', color: '#3b0764', fontWeight: 500 }}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-indigo-950 mb-1.5 uppercase tracking-wide">Password</label>
                        <input
                            id="login-password"
                            name="password"
                            type="password"
                            required
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="input-field shadow-sm bg-white"
                            style={{ border: '2px solid #c4b5fd', color: '#3b0764', fontWeight: 500 }}
                        />
                    </div>

                    <button
                        id="login-submit-btn"
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3 justify-center"
                    >
                        {loading ? <span className="spinner scale-75" /> : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-slate-500 text-sm mt-6">
                    Don&apos;t have an account?{' '}
                    <a href="/register" className="text-violet-600 font-semibold hover:text-violet-700 hover:underline transition-colors">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}
