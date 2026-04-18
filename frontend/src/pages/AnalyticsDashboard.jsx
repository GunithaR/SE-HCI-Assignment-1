import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import catalogService from '../services/catalogService';

export default function AnalyticsDashboard() {
    const navigate = useNavigate();
    const [visits, setVisits] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch all independently loading analytics endpoints
        Promise.all([
            catalogService.getAnalyticsVisits().catch(() => null)
        ]).then(([visitsData]) => {
            if (visitsData) setVisits(visitsData);
            else setError("Failed to load some analytics data.");
            setLoading(false);
        });
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)', padding: '7rem 1.5rem 3rem' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <p style={{ color: '#8b5cf6', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                            System Overview
                        </p>
                        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: 8 }}>
                            📈 Analytics Dashboard
                        </h1>
                        <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem' }}>
                            Monitor system traffic, user behavior, and recommendation trends.
                        </p>
                    </div>
                    <button onClick={() => navigate('/admin/dashboard')}
                        style={{ padding: '10px 18px', borderRadius: 10, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', color: '#8b5cf6', cursor: 'pointer', fontWeight: 600 }}>
                        ← Back to Admin Panel
                    </button>
                </div>

                {error && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '1rem', borderRadius: 8, marginBottom: '2rem' }}>
                        {error}
                    </div>
                )}

                {/* Phase 1: Visits Row */}
                <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '1.5rem', borderBottom: '2px solid rgba(139,92,246,0.1)', paddingBottom: 8 }}>
                        Site Traffic
                    </h2>
                    
                    {loading && !visits ? (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div className="skeleton-box" style={{ width: 250, height: 120, borderRadius: 12 }} />
                            <div className="skeleton-box" style={{ width: 250, height: 120, borderRadius: 12 }} />
                            <div className="skeleton-box" style={{ width: 250, height: 120, borderRadius: 12 }} />
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                            <StatCard 
                                icon="📅" 
                                title="Today's Visits" 
                                value={visits?.lastDay || 0} 
                                subtitle="Last 24 hours" 
                                accent="#3b82f6" 
                            />
                            <StatCard 
                                icon="📈" 
                                title="This Week's Visits" 
                                value={visits?.lastWeek || 0} 
                                subtitle="Last 7 days" 
                                accent="#8b5cf6" 
                            />
                            <StatCard 
                                icon="🌍" 
                                title="This Month's Visits" 
                                value={visits?.lastMonth || 0} 
                                subtitle="Last 30 days" 
                                accent="#10b981" 
                            />
                            <StatCard 
                                icon="🏢" 
                                title="All-Time Visits" 
                                value={visits?.total || 0} 
                                subtitle="Lifetime tracking" 
                                accent="#f59e0b" 
                            />
                        </div>
                    )}
                </div>

                {/* Placeholder for future phases */}
            </div>
        </div>
    );
}

function StatCard({ icon, title, value, subtitle, accent }) {
    return (
        <div className="card" style={{ background: 'var(--color-surface)', borderRadius: 16, padding: '1.5rem', position: 'relative', overflow: 'hidden', border: `1px solid rgba(255,255,255,0.05)`, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: accent }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {title}
                </p>
                <div style={{ fontSize: '1.5rem', opacity: 0.8 }}>{icon}</div>
            </div>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 0.25rem 0', fontFamily: 'Outfit, sans-serif' }}>
                {value.toLocaleString()}
            </h3>
            <p style={{ color: accent, fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>
                {subtitle}
            </p>
        </div>
    );
}
