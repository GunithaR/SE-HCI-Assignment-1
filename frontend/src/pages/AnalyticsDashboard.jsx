import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import catalogService from '../services/catalogService';

export default function AnalyticsDashboard() {
    const navigate = useNavigate();
    const [visits, setVisits] = useState(null);
    const [users, setUsers] = useState(null);
    const [sessions, setSessions] = useState(null);
    const [activeRules, setActiveRules] = useState(null);
    const [ruleUsage, setRuleUsage] = useState(null);
    const [topProducts, setTopProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch all independently loading analytics endpoints
        Promise.all([
            catalogService.getAnalyticsVisits().catch(() => null),
            catalogService.getAnalyticsUsers().catch(() => null),
            catalogService.getAnalyticsSessions().catch(() => null),
            catalogService.getAnalyticsActiveRules().catch(() => null),
            catalogService.getAnalyticsRuleUsage().catch(() => null),
            catalogService.getAnalyticsTopProducts().catch(() => null)
        ]).then(([visitsData, usersData, sessionsData, rulesData, ruleUsageData, topProductsData]) => {
            if (visitsData) setVisits(visitsData);
            if (usersData) setUsers(usersData);
            if (sessionsData) setSessions(sessionsData);
            if (rulesData) setActiveRules(rulesData);
            if (ruleUsageData) setRuleUsage(ruleUsageData);
            if (topProductsData) setTopProducts(topProductsData);
            if (!visitsData && !usersData && !sessionsData && !rulesData && !ruleUsageData && !topProductsData) setError("Failed to load analytics data.");
            setLoading(false);
        }).catch(() => {
            setError("A critical error occurred loading the analytics dashboard.");
            setLoading(false);
        });
    }, []);

    // Helper to format rule effect
    const formatEffect = (rule) => {
        if (rule.effectType === 'ADD_SCORE') return <span style={{ color: '#10b981', fontWeight: 700 }}>+{rule.effectValue} Score</span>;
        if (rule.effectType === 'DEDUCT_SCORE') return <span style={{ color: '#ef4444', fontWeight: 700 }}>-{rule.effectValue} Score</span>;
        if (rule.effectType === 'FILTER_OUT') return <span style={{ color: '#64748b', fontWeight: 700 }}>Filter Out</span>;
        return rule.effectType;
    };

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

                {/* Phase 3: Recommendation Engine Row */}
                <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '1.5rem', borderBottom: '2px solid rgba(139,92,246,0.1)', paddingBottom: 8 }}>
                        Recommendation Engine Activity
                    </h2>
                    
                    {loading && !sessions ? (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div className="skeleton-box" style={{ width: 250, height: 120, borderRadius: 12 }} />
                            <div className="skeleton-box" style={{ width: 250, height: 120, borderRadius: 12 }} />
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                            <StatCard 
                                icon="🧠" 
                                title="Today's Sessions" 
                                value={sessions?.lastDay || 0} 
                                subtitle="Last 24 hours" 
                                accent="#6366f1" 
                            />
                            <StatCard 
                                icon="📊" 
                                title="This Week" 
                                value={sessions?.lastWeek || 0} 
                                subtitle="Last 7 days" 
                                accent="#a855f7" 
                            />
                            <StatCard 
                                icon="🗓️" 
                                title="This Month" 
                                value={sessions?.lastMonth || 0} 
                                subtitle="Last 30 days" 
                                accent="#d946ef" 
                            />
                            <StatCard 
                                icon="📜" 
                                title="All Sessions" 
                                value={sessions?.total || 0} 
                                subtitle="Total historical logs" 
                                accent="#64748b" 
                            />
                        </div>
                    )}
                </div>

                {/* Grid container for Phase 2 and Phase 4 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '3rem' }}>
                    
                    {/* Phase 2: Users Row */}
                    <div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '1.5rem', borderBottom: '2px solid rgba(139,92,246,0.1)', paddingBottom: 8 }}>
                            User Base
                        </h2>
                        
                        {loading && !users ? (
                            <div className="skeleton-box" style={{ width: '100%', height: 120, borderRadius: 12 }} />
                        ) : (
                            <StatCard 
                                icon="👥" 
                                title="Total Registered Users" 
                                value={users?.total || 0} 
                                subtitle="Accounts in system" 
                                accent="#ec4899" 
                            />
                        )}
                    </div>

                    {/* Phase 4: Active Rules Row */}
                    <div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '1.5rem', borderBottom: '2px solid rgba(139,92,246,0.1)', paddingBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            Currently Active Rules
                            <span style={{ fontSize: '0.85rem', background: '#ecfdf5', color: '#10b981', padding: '2px 8px', borderRadius: 999 }}>{activeRules?.length || 0} Active</span>
                        </h2>
                        
                        {loading && !activeRules ? (
                            <div className="skeleton-box" style={{ width: '100%', height: 150, borderRadius: 12 }} />
                        ) : (
                            <div className="card" style={{ background: 'var(--color-surface)', borderRadius: 12, border: '1px solid rgba(0,0,0,0.05)', maxHeight: 300, overflowY: 'auto' }}>
                                {activeRules?.length === 0 ? (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                                        No active rules. Recommendations are purely mathematical right now.
                                    </div>
                                ) : (
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ background: 'var(--color-surface-alt)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                                <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Rule Name</th>
                                                <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Priority</th>
                                                <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Effect</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activeRules.map(rule => (
                                                <tr key={rule.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                                                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#4c1d95' }}>{rule.name}</td>
                                                    <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text)' }}>{rule.priority}</td>
                                                    <td style={{ padding: '0.75rem 1rem' }}>{formatEffect(rule)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Phase 6: Most Used Rules Comparison */}
                <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '1.5rem', borderBottom: '2px solid rgba(139,92,246,0.1)', paddingBottom: 8 }}>
                        🏆 Most Used Rules
                    </h2>

                    {loading && !ruleUsage ? (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div className="skeleton-box" style={{ flex: 1, height: 200, borderRadius: 12 }} />
                            <div className="skeleton-box" style={{ flex: 1, height: 200, borderRadius: 12 }} />
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <RuleUsageTable title="This Week" accentColor="#6366f1" rows={ruleUsage?.thisWeek || []} />
                            <RuleUsageTable title="Last Week" accentColor="#94a3b8" rows={ruleUsage?.lastWeek || []} />
                        </div>
                    )}
                </div>

                {/* Phase 7: Top Recommended Products by Category */}
                <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '1.5rem', borderBottom: '2px solid rgba(139,92,246,0.1)', paddingBottom: 8 }}>
                        🛆 Top Recommended Products by Category
                    </h2>

                    {loading && !topProducts ? (
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <div className="skeleton-box" style={{ width: 340, height: 220, borderRadius: 12 }} />
                            <div className="skeleton-box" style={{ width: 340, height: 220, borderRadius: 12 }} />
                        </div>
                    ) : (
                        (() => {
                            // Collect all categories from both weeks
                            const allCategories = new Set([
                                ...Object.keys(topProducts?.thisWeek || {}),
                                ...Object.keys(topProducts?.lastWeek || {})
                            ]);

                            if (allCategories.size === 0) {
                                return (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', background: 'var(--color-surface)', borderRadius: 12 }}>
                                        No recommendation data yet. Run the recommendation wizard to start tracking!
                                    </div>
                                );
                            }

                            return (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {[...allCategories].map(category => (
                                        <div key={category} className="card" style={{ background: 'var(--color-surface)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.07)' }}>
                                            <div style={{ padding: '0.85rem 1.25rem', background: 'rgba(139,92,246,0.08)', borderBottom: '1px solid rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                <span style={{ fontSize: '1.1rem' }}>📦</span>
                                                <span style={{ fontWeight: 800, color: '#6d28d9', fontSize: '1rem' }}>{category}</span>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                                                <div style={{ padding: '1rem', borderRight: '1px solid rgba(0,0,0,0.06)' }}>
                                                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>
                                                        ● This Week
                                                    </p>
                                                    <ProductRankList products={topProducts?.thisWeek?.[category] || []} accentColor="#6366f1" />
                                                </div>
                                                <div style={{ padding: '1rem' }}>
                                                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>
                                                        ● Last Week
                                                    </p>
                                                    <ProductRankList products={topProducts?.lastWeek?.[category] || []} accentColor="#94a3b8" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })()
                    )}
                </div>
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

function RuleUsageTable({ title, accentColor, rows }) {
    const maxCount = rows.length > 0 ? rows[0].count : 1;

    return (
        <div className="card" style={{ background: 'var(--color-surface)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '2px solid rgba(139,92,246,0.08)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: accentColor }} />
                <span style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.95rem' }}>{title}</span>
            </div>

            {rows.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                    No rules were applied during this period.
                </div>
            ) : (
                <div style={{ padding: '0.75rem' }}>
                    {rows.map((row, idx) => {
                        const pct = Math.round((row.count / maxCount) * 100);
                        return (
                            <div key={row.name} style={{ marginBottom: '0.85rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>
                                        <span style={{ color: accentColor, marginRight: 6, fontWeight: 800 }}>#{idx + 1}</span>
                                        {row.name}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: accentColor }}>
                                        {row.count}x
                                    </span>
                                </div>
                                <div style={{ height: 6, borderRadius: 99, background: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${pct}%`, background: accentColor, borderRadius: 99, transition: 'width 0.6s ease' }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function ProductRankList({ products, accentColor }) {
    const medals = ['🥇', '🥈', '🥉'];

    if (products.length === 0) {
        return <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>No data this period.</p>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {products.map((product, idx) => (
                <div key={product.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '6px 8px', borderRadius: 8, background: idx === 0 ? `${accentColor}12` : 'transparent' }}>
                    <span style={{ fontSize: '1rem', width: 22, textAlign: 'center' }}>
                        {medals[idx] || `#${idx + 1}`}
                    </span>
                    <span style={{ flex: 1, fontSize: '0.85rem', fontWeight: idx === 0 ? 700 : 500, color: idx === 0 ? 'var(--color-text)' : '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {product.name}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: accentColor, background: `${accentColor}18`, padding: '2px 7px', borderRadius: 99, flexShrink: 0 }}>
                        {product.count}x
                    </span>
                </div>
            ))}
        </div>
    );
}
