import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
    Users, Shield, Key, User, Search, 
    X, Lock, Mail, Plus, CheckCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import catalogService from '../services/catalogService';
import './AdminDashboardUnified.css';

/* ── Add Sub-Admin Modal ─────────────────────────────────────────────────── */
function AddSubAdminModal({ onClose, onSuccess }) {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

    // Lock background scroll while modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.email || !form.password) { setError('Email and password are required.'); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        setSubmitting(true);
        try {
            const result = await catalogService.createSubAdminUser(form);
            onSuccess(`Sub-Admin "${result.email}" created successfully!`);
            onClose();
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to create Sub-Admin.');
        } finally { setSubmitting(false); }
    };

    const inp = { width: '100%', padding: '9px 12px', borderRadius: 8, background: '#f5f3ff', border: '1.5px solid #c4b5fd', color: '#1e1b4b', fontSize: '0.9rem', boxSizing: 'border-box', fontWeight: 500 };

    return createPortal(
        <div className="admin-modal-overlay light-theme" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="admin-modal-content" style={{ maxWidth: 440 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #ede9fe', paddingBottom: '1rem' }}>
                    <h2 style={{ fontWeight: 800, fontSize: '1.2rem', color: '#7c3aed', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Plus size={20} /> Add Sub-Admin
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '1.3rem', cursor: 'pointer', display: 'flex' }}><X size={24} /></button>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '1.2rem' }}>Sub-admins can manage products and brands, but cannot create new admins.</p>
                {error && <p style={{ color: '#f87171', fontSize: '0.82rem', marginBottom: '1rem', background: 'rgba(239,68,68,0.08)', padding: '8px 12px', borderRadius: 8 }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', color: '#4c1d95', fontSize: '0.85rem', marginBottom: 4, fontWeight: 700 }}>Email</label>
                        <input type="email" value={form.email} onChange={set('email')} required style={inp} />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', color: '#4c1d95', fontSize: '0.85rem', marginBottom: 4, fontWeight: 700 }}>Password</label>
                        <input type="password" value={form.password} onChange={set('password')} required minLength={6} style={inp} />
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button type="submit" disabled={submitting}
                            style={{ flex: 1, padding: '10px', borderRadius: 10, cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '0.9rem', background: 'rgba(124,58,237,0.1)', color: '#7c3aed', border: '1.5px solid rgba(124,58,237,0.35)' }}>
                            {submitting ? 'Creating…' : 'Create Sub-Admin'}
                        </button>
                        <button type="button" onClick={onClose}
                            style={{ padding: '10px 18px', borderRadius: 10, background: '#f5f3ff', border: '1.5px solid #ddd6fe', color: '#6b7280', cursor: 'pointer', fontWeight: 500 }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

/* ── User Management Panel ───────────────────────────────────────────────── */
export default function AdminUserPanel({ showToast }) {
    const { isFullAdmin } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showSubAdminModal, setShowSubAdminModal] = useState(false);

    useEffect(() => {
        if (!isFullAdmin) { setLoading(false); return; }
        catalogService.getAllUsers()
            .then(setUsers)
            .catch(() => showToast('Failed to load users.', true))
            .finally(() => setLoading(false));
    }, [isFullAdmin, showToast]);

    const filtered = search ? users.filter(u => u.email.toLowerCase().includes(search.toLowerCase())) : users;

    const ROLE_STYLES = {
        ADMIN: { bg: 'rgba(124,58,237,0.1)', color: '#7c3aed' },
        SUB_ADMIN: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
        CUSTOMER: { bg: 'rgba(107,114,128,0.1)', color: '#6b7280' },
    };

    if (!isFullAdmin) {
        return (
            <div className="admin-panel-enter">
                <div className="panel-header">
                    <p className="panel-label">Administration</p>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Users size={32} color="#7c3aed" /> User Management
                    </h1>
                </div>
                <div className="admin-card" style={{ padding: '3rem', textAlign: 'center' }}>
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                        <Lock size={48} color="#ddd6fe" />
                    </div>
                    <p style={{ color: '#64748b', fontWeight: 600 }}>Only full Admins can manage users.</p>
                    <p style={{ color: '#9ca3af', fontSize: '0.82rem', marginTop: 8 }}>Contact a full administrator for access.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-panel-enter">
            {showSubAdminModal && (
                <AddSubAdminModal
                    onClose={() => setShowSubAdminModal(false)}
                    onSuccess={(msg) => {
                        showToast(msg);
                        setShowSubAdminModal(false);
                        catalogService.getAllUsers().then(setUsers).catch(() => {});
                    }}
                />
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
                <div className="panel-header" style={{ marginBottom: 0 }}>
                    <p className="panel-label">Administration</p>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Users size={32} color="#7c3aed" /> User Management
                    </h1>
                    <p className="panel-desc">{users.length} registered users in the system.</p>
                </div>
                <button className="admin-btn-primary" onClick={() => setShowSubAdminModal(true)}>
                    <Plus size={18} /> Add Sub-Admin
                </button>
            </div>

            {/* Stat row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
                {[
                    { icon: <Users size={20} />, label: 'Total Users', value: users.length, color: '#7c3aed' },
                    { icon: <Shield size={20} />, label: 'Admins', value: users.filter(u => u.role === 'ADMIN').length, color: '#7c3aed' },
                    { icon: <Key size={20} />, label: 'Sub-Admins', value: users.filter(u => u.role === 'SUB_ADMIN').length, color: '#f59e0b' },
                    { icon: <User size={20} />, label: 'Regular Users', value: users.filter(u => u.role === 'CUSTOMER').length, color: '#6b7280' },
                ].map(s => (
                    <div key={s.label} className="admin-card stat-card">
                        <div className="stat-accent-bar" style={{ background: s.color }} />
                        <div className="stat-icon" style={{ color: s.color }}>{s.icon}</div>
                        <div className="stat-value" style={{ color: s.color }}>{loading ? '—' : s.value}</div>
                        <div className="stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="admin-search">
                <Search size={18} color="#a78bfa" />
                <input placeholder="Search users by email…" value={search} onChange={e => setSearch(e.target.value)} />
                {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: '#a78bfa', cursor: 'pointer', display: 'flex' }}><X size={18} /></button>}
            </div>

            {/* Table */}
            <div className="admin-card" style={{ overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                        {search ? 'No users match your search.' : 'No users found.'}
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(u => (
                                <tr key={u.id}>
                                    <td style={{ fontWeight: 600, color: '#1e1b4b' }}>{u.email}</td>
                                    <td>
                                        <span className="admin-badge" style={{ background: ROLE_STYLES[u.role]?.bg, color: ROLE_STYLES[u.role]?.color }}>
                                            {u.role === 'SUB_ADMIN' ? 'Sub-Admin' : (u.role === 'CUSTOMER' ? 'Regular User' : u.role)}
                                        </span>
                                    </td>
                                    <td style={{ color: '#6b7280', fontSize: '0.82rem' }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
