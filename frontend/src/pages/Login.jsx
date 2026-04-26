import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';
import vectorImg from '../assets/vector.jpg';

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
        <div className="login-page-container">
            <div className="login-content-wrapper">
                
                {/* Left Section */}
                <div className="login-left-section">
                    <div className="login-left-subtitle">Built on quality choices</div>
                    <h1 className="login-left-title">L+ SIVILIMA</h1>
                    <p className="login-left-description">
                        Access your curated construction experience—explore premium materials, manage your projects, and unlock intelligent recommendations
                    </p>
                    <div className="login-image-container">
                        <img src={vectorImg} alt="Construction Platform Vector" className="login-image ken-burns" />
                    </div>
                </div>

                {/* Right Section / Form */}
                <div className="login-right-section">
                    <div className="login-card">
                        <h2>Welcome Back</h2>
                        <p>Enter your credentials to access your architectural projects</p>

                        {error && <div className="login-error">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="login-form-group">
                                <label htmlFor="email">Email Address</label>
                                <div className="login-input-container">
                                    <svg className="login-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="login-input"
                                        placeholder="admin@platform.com"
                                        required
                                        value={form.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="login-form-group">
                                <label htmlFor="password">Password</label>
                                <div className="login-input-container">
                                    <svg className="login-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        className="login-input"
                                        placeholder="••••••••"
                                        required
                                        value={form.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="login-options">
                                <label className="login-remember">
                                    <input type="checkbox" className="login-checkbox" />
                                    Remember me
                                </label>
                                <a href="#" className="login-forgot">Forgot Password?</a>
                            </div>

                            <button type="submit" className="login-submit-btn" disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign In'} 
                                {!loading && (
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                )}
                            </button>
                        </form>

                        <div className="login-footer">
                            Don&apos;t have an account?{' '}
                            <a href="/register" className="login-link">
                                Create an account
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
