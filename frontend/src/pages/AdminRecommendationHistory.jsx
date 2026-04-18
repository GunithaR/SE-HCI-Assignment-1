import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import catalogService from '../services/catalogService';

export default function AdminRecommendationHistory() {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);

    useEffect(() => {
        catalogService.getRecommendationHistory()
            .then(data => {
                setHistory(data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load recommendation history.');
                setLoading(false);
            });
    }, []);

    const parseJSON = (str) => {
        try {
            return JSON.parse(str);
        } catch {
            return null;
        }
    };

    const getTopResultName = (resultStr) => {
        const res = parseJSON(resultStr);
        if (res && res.recommendations && res.recommendations.length > 0) {
            return res.recommendations[0].productName;
        }
        return 'No results';
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)', padding: '7rem 1.5rem 3rem' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: 4 }}>
                            📜 Recommendation History
                        </h1>
                        <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
                            View logs of all user sessions in the recommendation engine.
                        </p>
                    </div>
                    <button onClick={() => navigate('/admin/dashboard')}
                        style={{ padding: '10px 18px', borderRadius: 10, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', color: '#8b5cf6', cursor: 'pointer', fontWeight: 600 }}>
                        ← Back to Dashboard
                    </button>
                </div>

                {/* Main Content */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                        <div className="spinner" />
                    </div>
                ) : error ? (
                    <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '1rem', borderRadius: 8 }}>
                        {error}
                    </div>
                ) : (
                    <div className="card" style={{ background: 'var(--color-surface)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'var(--color-surface-alt)', borderBottom: '2px solid rgba(139,92,246,0.1)' }}>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>ID</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Started At</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>User</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Category</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Rules Triggered</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Top Recommendation</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                                            No recommendation history logs found.
                                        </td>
                                    </tr>
                                ) : (
                                    history.map(log => {
                                        const appliedRules = parseJSON(log.appliedRulesJson) || [];
                                        return (
                                            <tr key={log.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', transition: 'background 0.2s' }}>
                                                <td style={{ padding: '1rem', fontWeight: 600, color: '#475569' }}>#{log.id}</td>
                                                <td style={{ padding: '1rem', color: 'var(--color-text)' }}>
                                                    {new Date(log.startedAt).toLocaleString()}
                                                </td>
                                                <td style={{ padding: '1rem', color: log.userEmail ? '#10b981' : '#94a3b8', fontWeight: log.userEmail ? 600 : 400 }}>
                                                    {log.userEmail || 'Anonymous'}
                                                </td>
                                                <td style={{ padding: '1rem', color: '#8b5cf6', fontWeight: 600 }}>{log.category}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    {appliedRules.length > 0 ? (
                                                        <span style={{ background: '#ecfdf5', color: '#10b981', padding: '2px 8px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 700 }}>
                                                            {appliedRules.length} Active
                                                        </span>
                                                    ) : (
                                                        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>None</span>
                                                    )}
                                                </td>
                                                <td style={{ padding: '1rem', color: 'var(--color-text)' }}>
                                                    {getTopResultName(log.resultSummaryJson)}
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <button onClick={() => setSelectedSession(log)}
                                                        style={{ padding: '6px 14px', borderRadius: 6, background: 'var(--color-primary)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {/* Details Modal */}
                {selectedSession && (
                    <SessionDetailsModal 
                        session={selectedSession} 
                        onClose={() => setSelectedSession(null)} 
                    />
                )}
            </div>
        </div>
    );
}

function SessionDetailsModal({ session, onClose }) {
    const answers = JSON.parse(session.answersJson || '{}');
    const resultSummary = JSON.parse(session.resultSummaryJson || '{}');
    const recommendations = resultSummary.recommendations || [];
    const appliedRules = JSON.parse(session.appliedRulesJson || '[]');

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="card" style={{ width: '100%', maxWidth: 700, maxHeight: '85vh', overflowY: 'auto', padding: '2rem', borderRadius: 16, background: 'var(--color-surface)', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid rgba(139,92,246,0.1)', paddingBottom: '1rem' }}>
                    <h2 style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-text)' }}>
                        Session #{session.id} Details
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: 2 }}>User</p>
                        <p style={{ fontWeight: 600, color: session.userEmail ? '#10b981' : '#94a3b8' }}>{session.userEmail || 'Anonymous'}</p>
                    </div>
                    <div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: 2 }}>Category Filter</p>
                        <p style={{ fontWeight: 600, color: '#8b5cf6' }}>{session.category}</p>
                    </div>
                    <div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: 2 }}>Started At</p>
                        <p style={{ fontWeight: 500 }}>{new Date(session.startedAt).toLocaleString()}</p>
                    </div>
                    <div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: 2 }}>Completed At</p>
                        <p style={{ fontWeight: 500 }}>{new Date(session.completedAt).toLocaleString()}</p>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: 8 }}>
                        Rules Applied During Evaluation
                    </h3>
                    {appliedRules.length === 0 ? (
                        <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Recommendations were purely mathematical. No rules intervened.</p>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {appliedRules.map((rule, idx) => {
                                const isPositive = rule.includes('[+');
                                const isNegative = rule.includes('[-');
                                const isFilterOut = rule.includes('[FILTER_OUT]');
                                
                                let bg = 'rgba(100,116,139,0.1)';
                                let col = '#64748b';
                                if (isPositive) { bg = 'rgba(16,185,129,0.1)'; col = '#10b981'; }
                                if (isNegative) { bg = 'rgba(239,68,68,0.1)'; col = '#ef4444'; }
                                if (isFilterOut) { bg = 'rgba(202,138,4,0.1)'; col = '#ca8a04'; }

                                return (
                                    <span key={idx} style={{ background: bg, color: col, padding: '4px 10px', borderRadius: 6, fontSize: '0.85rem', fontWeight: 600 }}>
                                        {rule}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: 8 }}>
                        User's Answers
                    </h3>
                    {Object.keys(answers).length === 0 ? (
                        <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No answers recorded.</p>
                    ) : (
                        <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {Object.entries(answers).map(([qKey, aVal]) => (
                                <li key={qKey} style={{ background: 'var(--color-surface-alt)', padding: '10px 14px', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>{qKey}:</span>
                                    <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.9rem', background: 'rgba(139,92,246,0.1)', padding: '4px 10px', borderRadius: 99 }}>
                                        {aVal.toString()}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: 8 }}>
                        Top Recommendations Provided
                    </h3>
                    {recommendations.length === 0 ? (
                        <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No products were recommended.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {recommendations.slice(0, 3).map((rec, i) => (
                                <div key={i} style={{ border: '1px solid rgba(0,0,0,0.1)', padding: '1rem', borderRadius: 12, display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: i === 0 ? '#f59e0b' : '#94a3b8' }}>
                                        #{i+1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '1.1rem' }}>{rec.productName}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: 4 }}>Score: {rec.totalScore?.toFixed(1)}/10</div>
                                        <p style={{ fontSize: '0.9rem', color: '#475569', margin: 0, fontStyle: 'italic' }}>"{rec.explanation}"</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
