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
        <div className="min-h-screen flex items-center justify-center px-4 hero-bg fade-in-up">
            <div className="w-full max-w-md glass p-8">
                <div className="text-center mb-8">
                    <span className="text-4xl">🏠</span>
                    <h1
                        className="text-2xl font-bold mt-3 text-white"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                        Create Your Account
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Start finding the best materials for your build</p>
                </div>

                {error && (
                    <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form id="register-form" onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                        <input
                            id="register-email"
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
                            id="register-password"
                            name="password"
                            type="password"
                            required
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Min. 6 characters"
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Confirm Password</label>
                        <input
                            id="register-confirm"
                            name="confirm"
                            type="password"
                            required
                            value={form.confirm}
                            onChange={handleChange}
                            placeholder="Repeat your password"
                            className="input-field"
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

                <p className="text-center text-slate-400 text-sm mt-6">
                    Already have an account?{' '}
                    <a href="/login" className="text-violet-400 hover:underline">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}
