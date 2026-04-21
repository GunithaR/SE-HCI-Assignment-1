import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import vectorImg from '../assets/vector.jpg';

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
        <div className="login-page-container">
            <div className="login-content-wrapper">
                {/* Left Section */}
                <div className="login-left-section">
                    <div className="login-left-subtitle">Built on quality choices</div>
                    <h1 className="login-left-title">L+ SIVILIMA</h1>
                    <p className="login-left-description">
                        Access your curated construction experience—explore premium materials, manage your projects, and unlock intelligent recommendations
                    </p>
                    <img src={vectorImg} alt="Construction Platform Vector" className="login-image" />
                </div>

                {/* Right Section / Form */}
                <div className="login-right-section">
                    <div className="login-card">
                        <h2>Create Your Account</h2>
                        <p>Start finding the best materials for your build</p>

                        {error && (
                            <div className="login-error">{error}</div>
                        )}

                        <form id="register-form" onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="login-form-group-label">Email</label>
                                <input
                                    id="register-email"
                                    name="email"
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="login-input"
                                />
                            </div>

                            <div>
                                <label className="login-form-group-label">Password</label>
                                <input
                                    id="register-password"
                                    name="password"
                                    type="password"
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Min. 6 characters"
                                    className="login-input"
                                />
                            </div>

                            <div>
                                <label className="login-form-group-label">Confirm Password</label>
                                <input
                                    id="register-confirm"
                                    name="confirm"
                                    type="password"
                                    required
                                    value={form.confirm}
                                    onChange={handleChange}
                                    placeholder="Repeat your password"
                                    className="login-input"
                                />
                            </div>

                            <button
                                id="register-submit-btn"
                                type="submit"
                                disabled={loading}
                                className="login-submit-btn"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        <div className="login-footer">
                            Already have an account?{' '}
                            <a href="/login" className="login-link">
                                Sign in
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
