import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminAnalyticsPanel from './AdminAnalyticsPanel';
import AdminProductPanel from './AdminProductPanel';
import AdminRules from './AdminRules';
import AdminUserPanel from './AdminUserPanel';
import './AdminDashboardUnified.css';

/* ── Toast ────────────────────────────────────────────────────────────────── */
function Toast({ msg, isError }) {
    if (!msg) return null;
    return <div className={`admin-toast ${isError ? 'error' : 'success'}`}>{msg}</div>;
}

/* ── Navigation Items Config ─────────────────────────────────────────────── */
const NAV_ITEMS = [
    { id: 'analytics', icon: '📈', label: 'Analytics', sub: [{ id: 'history', icon: '📜', label: 'Rec. History' }] },
    { id: 'products', icon: '📦', label: 'Product Management' },
    { id: 'rules', icon: '⚙️', label: 'Rule Management' },
    { id: 'users', icon: '👥', label: 'User Management' },
];

/* ── Main Unified Dashboard ──────────────────────────────────────────────── */
export default function AdminDashboardUnified() {
    const { user, logout, isFullAdmin } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('analytics');
    const [analyticsTab, setAnalyticsTab] = useState('overview');
    const [toastMsg, setToastMsg] = useState('');
    const [toastErr, setToastErr] = useState(false);

    /* Override #root constraints for full-width layout */
    useEffect(() => {
        const root = document.getElementById('root');
        if (root) root.classList.add('admin-dashboard-root');
        return () => { if (root) root.classList.remove('admin-dashboard-root'); };
    }, []);

    const showToast = useCallback((msg, isError = false) => {
        setToastMsg(msg);
        setToastErr(isError);
        setTimeout(() => { setToastMsg(''); setToastErr(false); }, 3500);
    }, []);

    const handleNavClick = (id) => {
        if (id === 'history') {
            setActiveSection('analytics');
            setAnalyticsTab('history');
        } else {
            setActiveSection(id);
            if (id === 'analytics') setAnalyticsTab('overview');
        }
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <div className="light-theme" style={{ minHeight: '100vh', background: '#fbf8ff' }}>
            <Toast msg={toastMsg} isError={toastErr} />

            {/* ── Sidebar ─────────────────────────────────────────────── */}
            <aside className="admin-sidebar">
                {/* Brand */}
                <div className="admin-sidebar-brand">
                    <h2>🏠 L+ SIVILIMA</h2>
                    <p>Admin Dashboard</p>
                </div>

                {/* Navigation */}
                <nav className="admin-nav">
                    {NAV_ITEMS.map(item => (
                        <div key={item.id}>
                            <button
                                className={`admin-nav-item${activeSection === item.id ? ' active' : ''}`}
                                onClick={() => handleNavClick(item.id)}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                {item.label}
                            </button>
                            {/* Sub items (e.g. Rec. History under Analytics) */}
                            {item.sub && activeSection === item.id && (
                                <div className="admin-nav-sub">
                                    {item.sub.map(sub => (
                                        <button
                                            key={sub.id}
                                            className={`admin-nav-item${analyticsTab === sub.id ? ' active' : ''}`}
                                            onClick={() => handleNavClick(sub.id)}
                                        >
                                            <span className="nav-icon">{sub.icon}</span>
                                            {sub.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div className="admin-sidebar-footer">
                    <button className="catalog-link" onClick={() => navigate('/catalog')}>
                        <span>🔗</span> View Catalog
                    </button>
                    <div className="admin-user-info">
                        <div>
                            <div className="user-email">{user?.email}</div>
                            <span className={`user-role ${isFullAdmin ? 'role-admin' : 'role-sub-admin'}`}>
                                {user?.role === 'SUB_ADMIN' ? 'Sub-Admin' : 'Admin'}
                            </span>
                        </div>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </aside>

            {/* ── Content Area ─────────────────────────────────────────── */}
            <main className="admin-content">
                {activeSection === 'analytics' && (
                    <AdminAnalyticsPanel showToast={showToast} analyticsTab={analyticsTab} />
                )}
                {activeSection === 'products' && (
                    <AdminProductPanel showToast={showToast} />
                )}
                {activeSection === 'rules' && (
                    <AdminRules embedded externalShowToast={showToast} />
                )}
                {activeSection === 'users' && (
                    <AdminUserPanel showToast={showToast} />
                )}
            </main>
        </div>
    );
}
