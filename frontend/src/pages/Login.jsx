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
        <div className="min-h-screen flex items-center justify-center px-4 hero-bg fade-in-up">
            <div className="w-full max-w-md glass p-8">
                <div className="text-center mb-8">
                    <span className="text-4xl">🔐</span>
                    <h1
                        className="text-2xl font-bold mt-3 text-white"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                        Welcome Back
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Sign in to your L+ SIVILIMA account</p>
                </div>

                {error && (
                    <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form id="login-form" onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                        <input
                            id="login-email"
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
                        <input
                            id="login-password"
                            name="password"
                            type="password"
                            required
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="input-field"
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

                <p className="text-center text-slate-400 text-sm mt-6">
                    Don&apos;t have an account?{' '}
                    <a href="/register" className="text-violet-400 hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}
