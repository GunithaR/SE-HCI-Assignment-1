import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import { 
    TrendingUp, Calendar, Globe, Building, Brain, BarChart2, 
    CalendarDays, FileText, Users, Trophy, Package, Medal, 
    ClipboardList, X 
} from 'lucide-react';
import catalogService from '../services/catalogService';
import './AdminDashboardUnified.css';

/* ── Stat Card ───────────────────────────────────────────────────────────── */
function StatCard({ icon, title, value, subtitle, accent }) {
    return (
        <div className="admin-card stat-card">
            <div className="stat-accent-bar" style={{ background: accent }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <p style={{ color: '#6b7280', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{title}</p>
                <div style={{ color: accent, opacity: 0.8 }}>{icon}</div>
            </div>
            <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1e1b4b', margin: '0 0 2px', fontFamily: 'Outfit, sans-serif' }}>{value.toLocaleString()}</h3>
            <p style={{ color: accent, fontSize: '0.78rem', fontWeight: 600, margin: 0 }}>{subtitle}</p>
        </div>
    );
}

/* ── Rule Usage Table ────────────────────────────────────────────────────── */
function RuleUsageTable({ title, accentColor, rows }) {
    const maxCount = rows.length > 0 ? rows[0].count : 1;
    return (
        <div className="admin-card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '2px solid #ede9fe', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: accentColor }} />
                <span style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '0.95rem' }}>{title}</span>
            </div>
            {rows.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem' }}>No rules applied this period.</div>
            ) : (
                <div style={{ padding: '0.75rem' }}>
                    {rows.map((row, idx) => {
                        const pct = Math.round((row.count / maxCount) * 100);
                        return (
                            <div key={row.name} style={{ marginBottom: '0.85rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e1b4b' }}><span style={{ color: accentColor, marginRight: 6, fontWeight: 800 }}>#{idx + 1}</span>{row.name}</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: accentColor }}>{row.count}x</span>
                                </div>
                                <div style={{ height: 6, borderRadius: 99, background: '#ede9fe', overflow: 'hidden' }}>
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

/* ── Product Rank List ───────────────────────────────────────────────────── */
function ProductRankList({ products, accentColor }) {
    const medalIcons = [
        <Medal size={18} color="#f59e0b" />, 
        <Medal size={18} color="#94a3b8" />, 
        <Medal size={18} color="#d97706" />
    ];
    if (products.length === 0) return <p style={{ color: '#9ca3af', fontSize: '0.85rem', fontStyle: 'italic' }}>No data this period.</p>;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {products.map((product, idx) => (
                <div key={product.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '6px 8px', borderRadius: 8, background: idx === 0 ? `${accentColor}12` : 'transparent' }}>
                    <span style={{ width: 22, display: 'flex', justifyContent: 'center' }}>{medalIcons[idx] || <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8' }}>{idx + 1}</span>}</span>
                    <span style={{ flex: 1, fontSize: '0.85rem', fontWeight: idx === 0 ? 700 : 500, color: idx === 0 ? '#1e1b4b' : '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: accentColor, background: `${accentColor}18`, padding: '2px 7px', borderRadius: 99, flexShrink: 0 }}>{product.count}x</span>
                </div>
            ))}
        </div>
    );
}

/* ── Session Details Modal ───────────────────────────────────────────────── */
function SessionDetailsModal({ session, onClose }) {
    const answers = JSON.parse(session.answersJson || '{}');
    const resultSummary = JSON.parse(session.resultSummaryJson || '{}');
    const recommendations = resultSummary.recommendations || [];
    const appliedRules = JSON.parse(session.appliedRulesJson || '[]');

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    return createPortal(
        <div className="admin-modal-overlay light-theme" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="admin-modal-content" style={{ maxWidth: 700 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #ede9fe', paddingBottom: '1rem' }}>
                    <h2 style={{ fontWeight: 800, fontSize: '1.3rem', color: '#1e1b4b', fontFamily: 'Manrope', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <ClipboardList size={22} color="#7c3aed" /> Session #{session.id} Details
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '1.4rem', cursor: 'pointer', display: 'flex' }}><X size={24} /></button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div><p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: 2, fontWeight: 600 }}>User</p><p style={{ fontWeight: 600, color: session.userEmail ? '#059669' : '#9ca3af', margin: 0 }}>{session.userEmail || 'Anonymous'}</p></div>
                    <div><p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: 2, fontWeight: 600 }}>Category</p><p style={{ fontWeight: 600, color: '#7c3aed', margin: 0 }}>{session.category}</p></div>
                    <div><p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: 2, fontWeight: 600 }}>Started</p><p style={{ fontWeight: 500, color: '#1e1b4b', margin: 0 }}>{new Date(session.startedAt).toLocaleString()}</p></div>
                    <div><p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: 2, fontWeight: 600 }}>Completed</p><p style={{ fontWeight: 500, color: '#1e1b4b', margin: 0 }}>{new Date(session.completedAt).toLocaleString()}</p></div>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e1b4b', marginBottom: '0.75rem', borderBottom: '1px solid #ede9fe', paddingBottom: 8 }}>Rules Applied</h3>
                    {appliedRules.length === 0 ? <p style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '0.88rem' }}>No rules intervened.</p> : (
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {appliedRules.map((rule, idx) => {
                                const isPos = rule.includes('[+'), isNeg = rule.includes('[-'), isFilter = rule.includes('[FILTER_OUT]');
                                let bg = '#f1f5f9', col = '#64748b';
                                if (isPos) { bg = '#ecfdf5'; col = '#059669'; }
                                if (isNeg) { bg = '#fef2f2'; col = '#dc2626'; }
                                if (isFilter) { bg = '#fefce8'; col = '#ca8a04'; }
                                return <span key={idx} style={{ background: bg, color: col, padding: '4px 10px', borderRadius: 6, fontSize: '0.82rem', fontWeight: 600 }}>{rule}</span>;
                            })}
                        </div>
                    )}
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e1b4b', marginBottom: '0.75rem', borderBottom: '1px solid #ede9fe', paddingBottom: 8 }}>User Answers</h3>
                    {Object.keys(answers).length === 0 ? <p style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '0.88rem' }}>No answers recorded.</p> : (
                        <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {Object.entries(answers).map(([k, v]) => (
                                <li key={k} style={{ background: '#f5f3ff', padding: '10px 14px', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.88rem' }}>{k}:</span>
                                    <span style={{ color: '#7c3aed', fontWeight: 700, fontSize: '0.88rem', background: '#ede9fe', padding: '4px 10px', borderRadius: 99 }}>{v.toString()}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e1b4b', marginBottom: '0.75rem', borderBottom: '1px solid #ede9fe', paddingBottom: 8 }}>Top Recommendations</h3>
                    {recommendations.length === 0 ? <p style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '0.88rem' }}>No products recommended.</p> : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {recommendations.slice(0, 3).map((rec, i) => (
                                <div key={i} style={{ border: '1.5px solid #ede9fe', padding: '1rem', borderRadius: 12, display: 'flex', gap: '1rem', alignItems: 'center', background: i === 0 ? '#fefce8' : '#fff' }}>
                                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: i === 0 ? '#f59e0b' : '#9ca3af' }}>#{i + 1}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '1rem' }}>{rec.productName}</div>
                                        <div style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: 4 }}>Score: {rec.totalScore?.toFixed(1)}/10</div>
                                        <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, fontStyle: 'italic' }}>"{rec.explanation}"</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}

/* ── Rec History Sub-panel ───────────────────────────────────────────────── */
function RecHistorySubPanel() {
    const { data: history = [], isLoading, error } = useQuery({
        queryKey: ['recommendation-history'],
        queryFn: catalogService.getRecommendationHistory,
    });

    const [selectedSession, setSelectedSession] = (window.useState || (typeof useState !== 'undefined' ? useState : () => [null, () => {}]))(null);

    const parseJSON = (str) => { try { return JSON.parse(str); } catch { return null; } };
    const getTopResultName = (s) => { const r = parseJSON(s); return r?.recommendations?.[0]?.productName || 'No results'; };

    return (
        <div>
            <h2 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '1.3rem', color: '#1e1b4b', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <FileText size={22} color="#7c3aed" /> Recommendation History
            </h2>
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner" /></div>
            ) : error ? (
                <div style={{ color: '#dc2626', background: '#fef2f2', padding: '1rem', borderRadius: 8 }}>Failed to load history.</div>
            ) : (
                <div className="admin-card" style={{ overflow: 'hidden' }}>
                    <table className="admin-table">
                        <thead><tr><th>ID</th><th>Started</th><th>User</th><th>Category</th><th>Rules</th><th>Top Rec</th><th>Action</th></tr></thead>
                        <tbody>
                            {history.length === 0 ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>No history found.</td></tr>
                            ) : history.map(log => {
                                const rules = parseJSON(log.appliedRulesJson) || [];
                                return (
                                    <tr key={log.id}>
                                        <td style={{ fontWeight: 600, color: '#475569' }}>#{log.id}</td>
                                        <td>{new Date(log.startedAt).toLocaleString()}</td>
                                        <td style={{ color: log.userEmail ? '#059669' : '#9ca3af', fontWeight: log.userEmail ? 600 : 400 }}>{log.userEmail || 'Anonymous'}</td>
                                        <td style={{ color: '#7c3aed', fontWeight: 600 }}>{log.category}</td>
                                        <td>{rules.length > 0 ? <span className="admin-badge" style={{ background: '#ecfdf5', color: '#059669' }}>{rules.length} Active</span> : <span style={{ color: '#9ca3af', fontSize: '0.82rem' }}>None</span>}</td>
                                        <td>{getTopResultName(log.resultSummaryJson)}</td>
                                        <td><button className="admin-btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={() => setSelectedSession(log)}>View</button></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            {selectedSession && <SessionDetailsModal session={selectedSession} onClose={() => setSelectedSession(null)} />}
        </div>
    );
}

/* ── Main Analytics Panel ────────────────────────────────────────────────── */
export default function AdminAnalyticsPanel({ showToast, analyticsTab = 'overview' }) {
    const isOverview = analyticsTab === 'overview';

    const { data: visits } = useQuery({ queryKey: ['analytics-visits'], queryFn: catalogService.getAnalyticsVisits, enabled: isOverview });
    const { data: users } = useQuery({ queryKey: ['analytics-users'], queryFn: catalogService.getAnalyticsUsers, enabled: isOverview });
    const { data: sessions } = useQuery({ queryKey: ['analytics-sessions'], queryFn: catalogService.getAnalyticsSessions, enabled: isOverview });
    const { data: activeRules } = useQuery({ queryKey: ['analytics-active-rules'], queryFn: catalogService.getAnalyticsActiveRules, enabled: isOverview });
    const { data: ruleUsage } = useQuery({ queryKey: ['analytics-rule-usage'], queryFn: catalogService.getAnalyticsRuleUsage, enabled: isOverview });
    const { data: topProducts } = useQuery({ queryKey: ['analytics-top-products'], queryFn: catalogService.getAnalyticsTopProducts, enabled: isOverview });

    const formatEffect = (rule) => {
        if (rule.effectType === 'ADD_SCORE') return <span style={{ color: '#059669', fontWeight: 700 }}>+{rule.effectValue} Score</span>;
        if (rule.effectType === 'DEDUCT_SCORE') return <span style={{ color: '#dc2626', fontWeight: 700 }}>-{rule.effectValue} Score</span>;
        if (rule.effectType === 'FILTER_OUT') return <span style={{ color: '#6b7280', fontWeight: 700 }}>Filter Out</span>;
        return rule.effectType;
    };

    if (analyticsTab === 'history') return <div className="admin-panel-enter"><RecHistorySubPanel /></div>;

    return (
        <div className="admin-panel-enter">
            <div className="panel-header">
                <p className="panel-label">System Overview</p>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <TrendingUp size={32} color="#7c3aed" /> Analytics Dashboard
                </h1>
                <p className="panel-desc">Monitor system traffic, user behavior, and recommendation trends.</p>
            </div>

            {/* Site Traffic */}
            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '1.25rem', color: '#1e1b4b', marginBottom: 16, borderBottom: '2px solid #ede9fe', paddingBottom: 8 }}>Site Traffic</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                    <StatCard icon={<Calendar size={24} />} title="Today's Visits" value={visits?.lastDay || 0} subtitle="Last 24 hours" accent="#3b82f6" />
                    <StatCard icon={<TrendingUp size={24} />} title="This Week" value={visits?.lastWeek || 0} subtitle="Last 7 days" accent="#7c3aed" />
                    <StatCard icon={<Globe size={24} />} title="This Month" value={visits?.lastMonth || 0} subtitle="Last 30 days" accent="#059669" />
                    <StatCard icon={<Building size={24} />} title="All-Time" value={visits?.total || 0} subtitle="Lifetime" accent="#f59e0b" />
                </div>
            </div>

            {/* Recommendation Engine */}
            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '1.25rem', color: '#1e1b4b', marginBottom: 16, borderBottom: '2px solid #ede9fe', paddingBottom: 8 }}>Recommendation Engine</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                    <StatCard icon={<Brain size={24} />} title="Today's Sessions" value={sessions?.lastDay || 0} subtitle="Last 24 hours" accent="#6366f1" />
                    <StatCard icon={<BarChart2 size={24} />} title="This Week" value={sessions?.lastWeek || 0} subtitle="Last 7 days" accent="#a855f7" />
                    <StatCard icon={<CalendarDays size={24} />} title="This Month" value={sessions?.lastMonth || 0} subtitle="Last 30 days" accent="#d946ef" />
                    <StatCard icon={<FileText size={24} />} title="All Sessions" value={sessions?.total || 0} subtitle="Total logs" accent="#6b7280" />
                </div>
            </div>

            {/* Users + Active Rules side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '1.25rem', color: '#1e1b4b', marginBottom: 16, borderBottom: '2px solid #ede9fe', paddingBottom: 8 }}>User Base</h2>
                    <StatCard icon={<Users size={24} />} title="Total Users" value={users?.total || 0} subtitle="Accounts in system" accent="#ec4899" />
                </div>
                <div>
                    <h2 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '1.25rem', color: '#1e1b4b', marginBottom: 16, borderBottom: '2px solid #ede9fe', paddingBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Active Rules
                        <span style={{ fontSize: '0.82rem', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: 999 }}>{activeRules?.length || 0} Active</span>
                    </h2>
                    <div className="admin-card" style={{ maxHeight: 280, overflowY: 'auto' }}>
                        {!activeRules || activeRules.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>No active rules.</div>
                        ) : (
                            <table className="admin-table">
                                <thead><tr><th>Rule Name</th><th>Priority</th><th>Effect</th></tr></thead>
                                <tbody>{activeRules.map(r => (
                                    <tr key={r.id}><td style={{ fontWeight: 600, color: '#4c1d95' }}>{r.name}</td><td>{r.priority}</td><td>{formatEffect(r)}</td></tr>
                                ))}</tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Most Used Rules */}
            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '1.25rem', color: '#1e1b4b', marginBottom: 16, borderBottom: '2px solid #ede9fe', paddingBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Trophy size={22} color="#f59e0b" /> Most Used Rules
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <RuleUsageTable title="This Week" accentColor="#6366f1" rows={ruleUsage?.thisWeek || []} />
                    <RuleUsageTable title="Last Week" accentColor="#9ca3af" rows={ruleUsage?.lastWeek || []} />
                </div>
            </div>

            {/* Top Products by Category */}
            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '1.25rem', color: '#1e1b4b', marginBottom: 16, borderBottom: '2px solid #ede9fe', paddingBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Package size={22} color="#7c3aed" /> Top Recommended Products
                </h2>
                {(() => {
                    const allCats = new Set([...Object.keys(topProducts?.thisWeek || {}), ...Object.keys(topProducts?.lastWeek || {})]);
                    if (allCats.size === 0) return <div className="admin-card" style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>No recommendation data yet.</div>;
                    return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {[...allCats].map(cat => (
                                <div key={cat} className="admin-card" style={{ overflow: 'hidden' }}>
                                    <div style={{ padding: '0.85rem 1.25rem', background: '#f5f3ff', borderBottom: '1px solid #ede9fe', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <Package size={18} color="#7c3aed" />
                                        <span style={{ fontWeight: 800, color: '#4c1d95', fontSize: '0.95rem' }}>{cat}</span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                                        <div style={{ padding: '1rem', borderRight: '1px solid #ede9fe' }}>
                                            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>● This Week</p>
                                            <ProductRankList products={topProducts?.thisWeek?.[cat] || []} accentColor="#6366f1" />
                                        </div>
                                        <div style={{ padding: '1rem' }}>
                                            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>● Last Week</p>
                                            <ProductRankList products={topProducts?.lastWeek?.[cat] || []} accentColor="#9ca3af" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}
