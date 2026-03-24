import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import catalogService from '../services/catalogService';

const CONDITION_OPERATORS = ['EQUALS', 'NOT_EQUALS', 'GREATER_THAN', 'LESS_THAN', 'GREATER_THAN_OR_EQUALS', 'LESS_THAN_OR_EQUALS', 'CONTAINS', 'IN'];
const EFFECT_TYPES = ['ADD_SCORE', 'DEDUCT_SCORE', 'FILTER_OUT'];
const STRATEGY_TYPES = ['BUDGET', 'ENVIRONMENT', 'PERFORMANCE', 'STYLE', 'MAINTENANCE', 'USAGE'];
const OPERAND_SOURCES = ['USER_INPUT', 'PRODUCT'];

function Toast({ toast }) {
    if (!toast.msg) return null;
    return <div className={`toast ${toast.isError ? 'toast-error' : 'toast-success'}`}>{toast.msg}</div>;
}

function RuleFormModal({ rule, onClose, onSuccess, showToast }) {
    const isEdit = Boolean(rule);
    const [form, setForm] = useState(() => {
        if (isEdit) return {
            name: rule.name || '', description: rule.description || '', priority: rule.priority ?? 1,
            conditions: rule.conditions?.map(c => ({
                operandSource: c.operandSource || 'USER_INPUT',
                leftOperand: c.leftOperand || '', operator: c.operator || 'EQUALS', rightOperand: c.rightOperand || ''
            })) || [{ operandSource: 'USER_INPUT', leftOperand: '', operator: 'EQUALS', rightOperand: '' }],
            effect: { effectType: rule.effect?.effectType || 'ADD_SCORE', value: rule.effect?.value ?? 0, strategy: rule.effect?.strategy || 'BUDGET' },
        };
        return {
            name: '', description: '', priority: 1,
            conditions: [{ operandSource: 'USER_INPUT', leftOperand: '', operator: 'EQUALS', rightOperand: '' }],
            effect: { effectType: 'ADD_SCORE', value: 0, strategy: 'BUDGET' },
        };
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const setField = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
    const setEffect = (field) => (e) => setForm(f => ({ ...f, effect: { ...f.effect, [field]: e.target.value } }));
    const setCondition = (idx, field) => (e) => {
        const updated = [...form.conditions];
        updated[idx] = { ...updated[idx], [field]: e.target.value };
        setForm(f => ({ ...f, conditions: updated }));
    };
    const addCondition = () => setForm(f => ({ ...f, conditions: [...f.conditions, { operandSource: 'USER_INPUT', leftOperand: '', operator: 'EQUALS', rightOperand: '' }] }));
    const removeCondition = (idx) => {
        if (form.conditions.length <= 1) return;
        setForm(f => ({ ...f, conditions: f.conditions.filter((_, i) => i !== idx) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.name.trim()) { setError('Rule name is required.'); return; }
        if (form.conditions.some(c => !c.leftOperand || !c.rightOperand)) { setError('All conditions need left & right operands.'); return; }
        setSubmitting(true);
        const payload = { ...form, priority: Number(form.priority), effect: { ...form.effect, value: Number(form.effect.value) } };
        try {
            if (isEdit) { await catalogService.updateRule(rule.id, payload); }
            else { await catalogService.createRule(payload); }
            onSuccess(`Rule "${form.name}" ${isEdit ? 'updated' : 'created'} successfully!`);
            onClose();
        } catch (err) {
            setError(err?.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} rule.`);
        } finally { setSubmitting(false); }
    };

    const showStrategy = form.effect.effectType !== 'FILTER_OUT';

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-card" style={{ maxWidth: 640 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ fontWeight: 700, fontSize: '1.15rem' }}>{isEdit ? `Edit Rule` : 'Create Rule'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', fontSize: '1.4rem' }}>✕</button>
                </div>

                {error && <div style={{ background: 'var(--color-error-bg)', border: '1px solid rgba(220,38,38,0.15)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: 'var(--color-error)', fontSize: '0.85rem', marginBottom: 16 }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                        <div>
                            <label className="input-label">Rule Name *</label>
                            <input value={form.name} onChange={setField('name')} className="input-field" required />
                        </div>
                        <div>
                            <label className="input-label">Priority</label>
                            <input type="number" min="1" value={form.priority} onChange={setField('priority')} className="input-field" />
                        </div>
                    </div>
                    <div>
                        <label className="input-label">Description</label>
                        <textarea value={form.description} onChange={setField('description')} rows={2} className="input-field" style={{ resize: 'vertical' }} />
                    </div>

                    <div className="divider" style={{ margin: '4px 0' }} />

                    {/* Conditions */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <span className="input-label" style={{ margin: 0 }}>Conditions</span>
                            <button type="button" onClick={addCondition} className="btn-ghost" style={{ padding: '4px 12px', fontSize: '0.78rem' }}>+ Add Condition</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {form.conditions.map((c, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'end', background: 'var(--color-surface-alt)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>Source</label>
                                        <select value={c.operandSource} onChange={setCondition(idx, 'operandSource')} className="input-field" style={{ padding: '6px 8px', fontSize: '0.82rem' }}>
                                            {OPERAND_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>Left</label>
                                        <input value={c.leftOperand} onChange={setCondition(idx, 'leftOperand')} className="input-field" style={{ padding: '6px 8px', fontSize: '0.82rem' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>Operator</label>
                                        <select value={c.operator} onChange={setCondition(idx, 'operator')} className="input-field" style={{ padding: '6px 8px', fontSize: '0.82rem' }}>
                                            {CONDITION_OPERATORS.map(op => <option key={op} value={op}>{op}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>Right</label>
                                        <input value={c.rightOperand} onChange={setCondition(idx, 'rightOperand')} className="input-field" style={{ padding: '6px 8px', fontSize: '0.82rem' }} />
                                    </div>
                                    {form.conditions.length > 1 && (
                                        <button type="button" onClick={() => removeCondition(idx)} style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', fontSize: '1.2rem', padding: '4px' }}>✕</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="divider" style={{ margin: '4px 0' }} />

                    {/* Effect */}
                    <div>
                        <span className="input-label">Effect</span>
                        <div style={{ display: 'grid', gridTemplateColumns: showStrategy ? '1fr 1fr 1fr' : '1fr 1fr', gap: 12 }}>
                            <div>
                                <label style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>Type</label>
                                <select value={form.effect.effectType} onChange={setEffect('effectType')} className="input-field" style={{ fontSize: '0.82rem' }}>
                                    {EFFECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>Value</label>
                                <input type="number" value={form.effect.value} onChange={setEffect('value')} className="input-field" style={{ fontSize: '0.82rem' }} />
                            </div>
                            {showStrategy && (
                                <div>
                                    <label style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>Strategy</label>
                                    <select value={form.effect.strategy} onChange={setEffect('strategy')} className="input-field" style={{ fontSize: '0.82rem' }}>
                                        {STRATEGY_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                        <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
                        <button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Saving…' : isEdit ? 'Update Rule' : 'Create Rule'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AdminRules() {
    const navigate = useNavigate();
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ msg: '', isError: false });
    const [showModal, setShowModal] = useState(false);
    const [editingRule, setEditingRule] = useState(null);

    const showToast = (msg, isError = false) => {
        setToast({ msg, isError });
        setTimeout(() => setToast({ msg: '', isError: false }), 3500);
    };

    const loadRules = () => {
        setLoading(true);
        catalogService.getRules()
            .then(setRules)
            .catch(() => showToast('Failed to load rules.', true))
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadRules(); }, []);

    const openCreate = () => { setEditingRule(null); setShowModal(true); };
    const openEdit = (rule) => { setEditingRule(rule); setShowModal(true); };
    const closeModal = () => { setShowModal(false); setEditingRule(null); };
    const handleSuccess = (msg) => { showToast(msg); loadRules(); };

    const handleDelete = async (rule) => {
        if (!window.confirm(`Delete rule "${rule.name}"?`)) return;
        try {
            await catalogService.deleteRule(rule.id);
            showToast(`"${rule.name}" deleted.`);
            setRules(prev => prev.filter(r => r.id !== rule.id));
        } catch { showToast('Failed to delete rule.', true); }
    };

    const EFFECT_BADGE = { ADD_SCORE: 'badge-success', DEDUCT_SCORE: 'badge-warning', FILTER_OUT: 'badge-error' };

    return (
        <div className="page-with-navbar" style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
            <div className="page-container fade-in-up">
                <Toast toast={toast} />
                {showModal && <RuleFormModal rule={editingRule} onClose={closeModal} onSuccess={handleSuccess} showToast={showToast} />}

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <p style={{ color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>Admin Panel</p>
                        <h1 className="section-title" style={{ fontSize: '2rem' }}>Rule Engine</h1>
                        <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>
                            Manage recommendation scoring rules
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={() => navigate('/admin')} className="btn-ghost">← Dashboard</button>
                        <button onClick={openCreate} className="btn-primary">+ Create Rule</button>
                    </div>
                </div>

                <div className="card" style={{ overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontWeight: 600, fontSize: '0.95rem' }}>All Rules</h2>
                        <span style={{ color: 'var(--color-muted)', fontSize: '0.82rem' }}>{rules.length} rules</span>
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}><div className="spinner" /></div>
                    ) : rules.length === 0 ? (
                        <div style={{ padding: '64px 20px', textAlign: 'center', color: 'var(--color-muted)' }}>
                            <p style={{ fontSize: '2.5rem', marginBottom: 12 }}>📋</p>
                            <p>No rules yet. Click <strong style={{ color: 'var(--color-primary)' }}>+ Create Rule</strong>.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Rule</th>
                                        <th>Conditions</th>
                                        <th>Effect</th>
                                        <th>Strategy</th>
                                        <th>Priority</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rules.map(r => (
                                        <tr key={r.id}>
                                            <td>
                                                <div style={{ fontWeight: 500 }}>{r.name}</div>
                                                {r.description && <div style={{ color: 'var(--color-muted)', fontSize: '0.78rem', marginTop: 2 }}>{r.description}</div>}
                                            </td>
                                            <td>
                                                {r.conditions?.map((c, i) => (
                                                    <div key={i} style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginBottom: 2 }}>
                                                        <span className="badge badge-neutral" style={{ marginRight: 4 }}>{c.operandSource}</span>
                                                        {c.leftOperand} <strong>{c.operator}</strong> {c.rightOperand}
                                                    </div>
                                                ))}
                                            </td>
                                            <td>
                                                <span className={`badge ${EFFECT_BADGE[r.effect?.effectType] || 'badge-neutral'}`}>
                                                    {r.effect?.effectType}
                                                </span>
                                                {r.effect?.effectType !== 'FILTER_OUT' && (
                                                    <span style={{ marginLeft: 6, fontWeight: 600, fontSize: '0.85rem' }}>{r.effect?.value}</span>
                                                )}
                                            </td>
                                            <td style={{ color: 'var(--color-primary)', fontWeight: 500 }}>{r.effect?.strategy || '—'}</td>
                                            <td style={{ fontWeight: 600 }}>{r.priority}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <button onClick={() => openEdit(r)} className="btn-ghost" style={{ padding: '5px 14px', fontSize: '0.82rem' }}>Edit</button>
                                                    <button onClick={() => handleDelete(r)} className="btn-ghost" style={{ padding: '5px 14px', fontSize: '0.82rem', color: 'var(--color-error)', borderColor: 'rgba(220,38,38,0.3)' }}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
