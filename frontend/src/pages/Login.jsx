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
        <div className="page-with-navbar" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: 'var(--color-bg)',
        }}>
            <div className="card fade-in-up" style={{ width: '100%', maxWidth: 420, padding: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        background: 'var(--color-primary-muted)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '16px',
                    }}>
                        <svg style={{ width: 24, height: 24, color: 'var(--color-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)' }}>
                        Welcome Back
                    </h1>
                    <p style={{ color: 'var(--color-muted)', fontSize: '0.88rem', marginTop: 4 }}>
                        Sign in to your L+ SIVILIMA account
                    </p>
                </div>

                {error && (
                    <div style={{
                        marginBottom: '16px',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-error-bg)',
                        color: 'var(--color-error)',
                        fontSize: '0.85rem',
                        border: '1px solid rgba(220,38,38,0.15)',
                    }}>
                        {error}
                    </div>
                )}

                <form id="login-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label className="input-label">Email</label>
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
                        <label className="input-label">Password</label>
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
                        className="btn-primary"
                        style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
                    >
                        {loading ? <span className="spinner-sm" /> : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: 'var(--color-muted)', fontSize: '0.88rem', marginTop: '24px' }}>
                    Don&apos;t have an account?{' '}
                    <a href="/register" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}
