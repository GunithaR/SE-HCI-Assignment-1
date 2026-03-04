import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: '', password: '', confirm: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirm) {
            setError('Passwords do not match.');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        try {
            await register(form.email, form.password, 'CUSTOMER');
            navigate('/');
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.email ||
                'Registration failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="light-theme min-h-screen flex items-center justify-center px-4 hero-bg fade-in-up relative">
            {/* Top Purple Accent Line */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500"></div>

            <div className="w-full max-w-md glass p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-violet-100/80 text-violet-600 mb-4 shadow-sm border border-violet-200">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    </div>
                    <h1
                        className="text-2xl font-bold mt-1 text-slate-800"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                        Create Your Account
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Start finding the best materials for your build</p>
                </div>

                {error && (
                    <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form id="register-form" onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email</label>
                        <input
                            id="register-email"
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="input-field shadow-sm bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Password</label>
                        <input
                            id="register-password"
                            name="password"
                            type="password"
                            required
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Min. 6 characters"
                            className="input-field shadow-sm bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Confirm Password</label>
                        <input
                            id="register-confirm"
                            name="confirm"
                            type="password"
                            required
                            value={form.confirm}
                            onChange={handleChange}
                            placeholder="Repeat your password"
                            className="input-field shadow-sm bg-white"
                        />
                    </div>

                    <button
                        id="register-submit-btn"
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3 justify-center"
                    >
                        {loading ? <span className="spinner scale-75" /> : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-slate-500 text-sm mt-6">
                    Already have an account?{' '}
                    <a href="/login" className="text-violet-600 font-semibold hover:text-violet-700 hover:underline transition-colors">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}
