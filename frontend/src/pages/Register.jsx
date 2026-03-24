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
        if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        setLoading(true);
        try {
            await register(form.email, form.password, 'CUSTOMER');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.email || 'Registration failed. Please try again.');
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)' }}>
                        Create Your Account
                    </h1>
                    <p style={{ color: 'var(--color-muted)', fontSize: '0.88rem', marginTop: 4 }}>
                        Start finding the best materials for your build
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

                <form id="register-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label className="input-label">Email</label>
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
                        <label className="input-label">Password</label>
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
                        <label className="input-label">Confirm Password</label>
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
                        className="btn-primary"
                        style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
                    >
                        {loading ? <span className="spinner-sm" /> : 'Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: 'var(--color-muted)', fontSize: '0.88rem', marginTop: '24px' }}>
                    Already have an account?{' '}
                    <a href="/login" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}
