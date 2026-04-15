import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ruleService from '../services/ruleService';
import catalogService from '../services/catalogService';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const RULE_TYPES = [
    { value: 'CONDITIONAL_MATCH', label: 'Conditional Match', icon: '🎯', desc: 'Score products via answer-to-attribute mappings' },
    { value: 'SCORE_ADJUST',      label: 'Score Adjust',      icon: '⚡', desc: 'Boost or deduct score for specific products' },
    { value: 'PRODUCT_EXCLUSION', label: 'Product Exclusion', icon: '🚫', desc: 'Exclude specific products from results' },
];

const PRIORITIES = [
    { value: 'HIGH',   label: 'HIGH (Weight: 25)',   color: '#f59e0b' },
    { value: 'MEDIUM', label: 'MEDIUM (Weight: 15)', color: '#3b82f6' },
    { value: 'LOW',    label: 'LOW (Weight: 10)',    color: '#64748b' },
];

const SCORING_MODES = [
    { value: 'LEVELED',     label: '📊 Tier-Based / Numeric Match', desc: 'Compares ranked values (e.g., HIGH durability vs MEDIUM durability)' },
    { value: 'CATEGORICAL', label: '🏷️ Exact Category Match',   desc: 'Matches exact text strings (e.g., WOODEN style)' },
    { value: 'FIXED',       label: '📌 Fixed Baseline Override', desc: 'Assigns a flat score regardless of product attributes' },
];

const TYPE_COLORS = {
    CONDITIONAL_MATCH: { bg: 'rgba(56,189,248,0.12)', fg: '#38bdf8' },
    SCORE_ADJUST:      { bg: 'rgba(168,85,247,0.12)', fg: '#a855f7' },
    PRODUCT_EXCLUSION: { bg: 'rgba(239,68,68,0.12)',  fg: '#f87171' },
};

const MODE_COLORS = {
    LEVELED:     { bg: 'rgba(34,197,94,0.10)', fg: '#4ade80', border: 'rgba(34,197,94,0.25)' },
    CATEGORICAL: { bg: 'rgba(56,189,248,0.10)', fg: '#38bdf8', border: 'rgba(56,189,248,0.25)' },
    FIXED:       { bg: 'rgba(251,191,36,0.10)', fg: '#fbbf24', border: 'rgba(251,191,36,0.25)' },
};

const EFFECT_COLORS = {
    ADD_SCORE:    { bg: 'rgba(34,197,94,0.12)',  fg: '#4ade80', icon: '➕' },
    DEDUCT_SCORE: { bg: 'rgba(251,191,36,0.12)', fg: '#fbbf24', icon: '➖' },
};

const emptyMapping = () => ({
    answerKey: '', answerValue: '', productAttribute: '', scoringMode: 'LEVELED',
    idealLevel: '', exactMatchScore: 10, deviation1Score: 5, deviation2Score: 2,
    matchScore: 10, noMatchScore: 2, fixedScore: 7, noDataScore: 3,
});

// ─────────────────────────────────────────────────────────────────────────────
// Toast
// ─────────────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
    if (!toast.msg) return null;
    return (
        <div style={{
            position: 'fixed', top: 80, right: 24, zIndex: 9999,
            padding: '12px 20px', borderRadius: 12, fontSize: '0.85rem', fontWeight: 500,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            background: toast.isError ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
            color: toast.isError ? '#f87171' : '#4ade80',
            border: `1px solid ${toast.isError ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
        }}>
            {toast.msg}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Confirm Dialog
// ─────────────────────────────────────────────────────────────────────────────
function ConfirmDialog({ rule, onConfirm, onCancel }) {
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: 'var(--color-surface)', border: '2px solid #ef4444', borderRadius: 14, padding: '2rem', maxWidth: 420, width: '100%', boxShadow: '0 10px 40px rgba(239,68,68,0.2)' }}>
                <p style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '0.5rem' }}>🗑️</p>
                <h3 style={{ fontWeight: 700, color: 'var(--color-text)', marginBottom: 8, textAlign: 'center' }}>Delete Rule?</h3>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                    Delete <strong style={{ color: '#f87171' }}>{rule.name}</strong>? This cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <button onClick={onCancel} style={{ padding: '9px 20px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                    <button onClick={onConfirm} style={{ padding: '9px 22px', borderRadius: 8, background: 'linear-gradient(135deg, #dc2626, #ef4444)', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Yes, Delete</button>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Product Selector
// ─────────────────────────────────────────────────────────────────────────────
function ProductSelector({ products, selected, onToggle }) {
    const [search, setSearch] = useState('');
    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.categoryName || '').toLowerCase().includes(search.toLowerCase())
    );
    return (
        <div>
            <input value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, background: 'var(--color-surface-alt)', border: '2px solid #c4b5fd', color: '#3b0764', fontSize: '0.85rem', marginBottom: 8, boxSizing: 'border-box' }}
                placeholder="Search products..." />
            <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 6 }}>
                {filtered.length === 0 && <p style={{ color: '#64748b', fontSize: '0.8rem', textAlign: 'center', padding: 12 }}>No products found</p>}
                {filtered.map(p => (
                    <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 6, cursor: 'pointer', fontSize: '0.82rem', color: '#3b0764', fontWeight: selected.includes(p.id) ? 600 : 400, background: selected.includes(p.id) ? 'rgba(56,189,248,0.08)' : 'transparent' }}>
                        <input type="checkbox" checked={selected.includes(p.id)} onChange={() => onToggle(p.id)} />
                        <span>{p.name}</span>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginLeft: 'auto' }}>{p.categoryName}</span>
                    </label>
                ))}
            </div>
            <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4 }}>{selected.length} selected</p>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mapping Row (flat answer → attribute mapping)
// ─────────────────────────────────────────────────────────────────────────────
function FlatMappingRow({ mapping, index, onChange, onRemove, onDuplicate, questionKeys, attrMeta, inp }) {
    const modeColor = MODE_COLORS[mapping.scoringMode] || MODE_COLORS.LEVELED;
    const selectedQKey = questionKeys?.find(q => q.key === mapping.answerKey);
    const answerOptions = selectedQKey?.options || [];
    const attrValues = attrMeta?.attributes?.find(a => a.name === mapping.productAttribute)?.values || [];

    return (
        <div style={{ border: `2px solid ${modeColor.border}`, borderRadius: 10, background: modeColor.bg, padding: '10px 12px', position: 'relative' }}>
            {/* Header: mode badge + index + actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, fontSize: '0.72rem', padding: '2px 8px', borderRadius: 5, background: modeColor.bg, color: modeColor.fg, border: `1px solid ${modeColor.border}` }}>
                    #{index + 1}
                </span>
                <select value={mapping.scoringMode} onChange={e => onChange('scoringMode', e.target.value)}
                    style={{ ...inp, width: 160, fontWeight: 600, fontSize: '0.78rem' }}>
                    {SCORING_MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
                <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                    {SCORING_MODES.find(m => m.value === mapping.scoringMode)?.desc}
                </span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                    <button type="button" onClick={onDuplicate} title="Duplicate" style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', color: '#38bdf8', borderRadius: 5, padding: '2px 8px', cursor: 'pointer', fontSize: '0.7rem' }}>⧉</button>
                    <button type="button" onClick={onRemove} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: 5, padding: '2px 8px', cursor: 'pointer', fontSize: '0.7rem' }}>✕</button>
                </div>
            </div>

            {/* Trigger: answer key + answer value */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 12, marginBottom: 12, alignItems: 'center' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, marginBottom: 4 }}>
                        If user question is...
                    </label>
                    <select value={mapping.answerKey} onChange={e => onChange('answerKey', e.target.value)} style={inp}>
                        <option value="">Select question key...</option>
                        {(questionKeys || []).map(q => <option key={q.key} value={q.key}>{q.key} — {q.label?.substring(0, 40)}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, marginBottom: 4 }}>
                        And their answer is...
                    </label>
                    {answerOptions.length > 0 ? (
                        <select value={mapping.answerValue} onChange={e => onChange('answerValue', e.target.value)} style={inp}>
                            <option value="">Select answer value...</option>
                            {answerOptions.map(o => <option key={o.value} value={o.value}>{o.label || o.value}</option>)}
                        </select>
                    ) : (
                        <input value={mapping.answerValue} onChange={e => onChange('answerValue', e.target.value)} style={inp} placeholder="e.g. coastal, LOW" />
                    )}
                </div>
            </div>

            {/* Mode-specific fields */}
            {mapping.scoringMode === 'FIXED' ? (
                <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, marginBottom: 4 }}>
                            Then assign this Fixed Score:
                        </label>
                        <input type="number" min="0" max="10" step="0.5" value={mapping.fixedScore} onChange={e => onChange('fixedScore', Number(e.target.value))} style={{ ...inp, textAlign: 'center' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, marginBottom: 4 }}>
                            If data is missing, assign NO-DATA Score:
                        </label>
                        <input type="number" min="0" max="10" step="0.5" value={mapping.noDataScore} onChange={e => onChange('noDataScore', Number(e.target.value))} style={{ ...inp, textAlign: 'center' }} />
                    </div>
                </div>
            ) : (
                <>
                    {/* Product attribute + ideal level */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 12, marginBottom: 16 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, marginBottom: 4 }}>
                                Then evaluate this Product Field...
                            </label>
                            <select value={mapping.productAttribute} onChange={e => onChange('productAttribute', e.target.value)} style={inp}>
                                <option value="">Select attribute...</option>
                                {(attrMeta?.attributes || []).map(a => <option key={a.name} value={a.name}>{a.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, marginBottom: 4 }}>
                                Targeting a required value of...
                            </label>
                            {attrValues.length > 0 && mapping.scoringMode !== 'CATEGORICAL' ? (
                                <select value={mapping.idealLevel} onChange={e => onChange('idealLevel', e.target.value)} style={inp}>
                                    <option value="">Select required target...</option>
                                    {attrValues.map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            ) : (
                                <input value={mapping.idealLevel} onChange={e => onChange('idealLevel', e.target.value)} style={inp} placeholder={mapping.scoringMode === 'CATEGORICAL' ? "e.g. MODERN,MINIMAL" : "e.g. HIGH"} />
                            )}
                        </div>
                    </div>

                    {/* Scoring parameters */}
                    <div style={{ background: 'rgba(255,255,255,0.4)', borderRadius: 8, padding: '10px 12px' }}>
                        <label style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>
                            Scoring Resolution
                        </label>
                    {mapping.scoringMode === 'LEVELED' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
                            {[
                                { key: 'exactMatchScore', label: 'Perfect Match', desc: 'Value meets/exceeds target', color: '#22c55e' },
                                { key: 'deviation1Score', label: 'Minor Deviation', desc: '1 level off target', color: '#d97706' },
                                { key: 'deviation2Score', label: 'Major Deviation', desc: '2+ levels off target', color: '#dc2626' },
                                { key: 'noDataScore', label: 'Missing Data', desc: 'Fallback score (default 3.0)', color: '#475569' },
                            ].map(s => (
                                <div key={s.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <label style={{ display: 'block', fontSize: '0.68rem', color: s.color, fontWeight: 700, marginBottom: 2 }}>{s.label}</label>
                                    <span style={{ fontSize: '0.55rem', color: '#64748b', marginBottom: 4, textAlign: 'center', minHeight: 14 }}>{s.desc}</span>
                                    <input type="number" min="0" max="10" step="0.5" value={mapping[s.key]} onChange={e => onChange(s.key, Number(e.target.value))} style={{ ...inp, textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, padding: '5px' }} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                            {[
                                { key: 'matchScore', label: 'Perfect Match', desc: 'Text matches target', color: '#22c55e' },
                                { key: 'noMatchScore', label: 'Failed Match', desc: 'Text differs', color: '#dc2626' },
                                { key: 'noDataScore', label: 'Missing Data', desc: 'Fallback score (default 3.0)', color: '#475569' },
                            ].map(s => (
                                <div key={s.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <label style={{ display: 'block', fontSize: '0.68rem', color: s.color, fontWeight: 700, marginBottom: 2 }}>{s.label}</label>
                                    <span style={{ fontSize: '0.55rem', color: '#64748b', marginBottom: 4, textAlign: 'center', minHeight: 14 }}>{s.desc}</span>
                                    <input type="number" min="0" max="10" step="0.5" value={mapping[s.key]} onChange={e => onChange(s.key, Number(e.target.value))} style={{ ...inp, textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, padding: '5px' }} />
                                </div>
                            ))}
                        </div>
                    )}
                    </div>
                </>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule Form Modal
// ─────────────────────────────────────────────────────────────────────────────
function RuleFormModal({ editingRule, categories, products, attrMeta, questionKeys, onClose, onSuccess }) {
    const isEdit = Boolean(editingRule);

    const [form, setForm] = useState(() => {
        if (isEdit) {
            return {
                name: editingRule.name || '',
                description: editingRule.description || '',
                ruleType: editingRule.ruleType || 'CONDITIONAL_MATCH',
                rulePriority: editingRule.rulePriority || 'HIGH',
                targetCategoryName: editingRule.targetCategoryName || '',
                defaultScore: editingRule.defaultScore ?? 5,
                mappings: editingRule.mappings?.length ? editingRule.mappings.map(m => ({ ...m })) : [emptyMapping()],
                effectType: editingRule.effectType || 'ADD_SCORE',
                effectValue: editingRule.effectValue || 1,
                targetProductIds: editingRule.productTargets?.map(t => t.productId) || [],
            };
        }
        return {
            name: '', description: '', ruleType: 'CONDITIONAL_MATCH', rulePriority: 'HIGH',
            targetCategoryName: '', defaultScore: 5,
            mappings: [emptyMapping()],
            effectType: 'ADD_SCORE', effectValue: 1, targetProductIds: [],
        };
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

    // ── Mappings ──
    const addMapping = () => setForm(f => ({ ...f, mappings: [...f.mappings, emptyMapping()] }));
    const duplicateMapping = i => setForm(f => ({ ...f, mappings: [...f.mappings, { ...f.mappings[i], id: undefined }] }));
    const updateMappingField = (i, field, val) => setForm(f => ({
        ...f, mappings: f.mappings.map((m, j) => j === i ? { ...m, [field]: val } : m),
    }));
    const removeMapping = i => setForm(f => ({ ...f, mappings: f.mappings.filter((_, j) => j !== i) }));

    // ── Product Targets ──
    const toggleProduct = id => setForm(f => ({
        ...f,
        targetProductIds: f.targetProductIds.includes(id)
            ? f.targetProductIds.filter(x => x !== id)
            : [...f.targetProductIds, id],
    }));

    const handleSubmit = async e => {
        e.preventDefault();
        setErrors({});
        if (!form.name.trim()) { setErrors({ name: 'Name required' }); return; }
        if (form.ruleType === 'CONDITIONAL_MATCH' && form.mappings.length === 0) {
            setErrors({ _general: 'Add at least one mapping.' }); return;
        }
        if ((form.ruleType === 'SCORE_ADJUST' || form.ruleType === 'PRODUCT_EXCLUSION') && form.targetProductIds.length === 0) {
            setErrors({ _general: 'Select at least one target product.' }); return;
        }

        setSubmitting(true);
        try {
            const payload = {
                name: form.name.trim(),
                description: form.description.trim(),
                ruleType: form.ruleType,
                rulePriority: form.ruleType === 'CONDITIONAL_MATCH' ? form.rulePriority : null,
                targetCategoryName: form.targetCategoryName || null,
            };

            if (form.ruleType === 'CONDITIONAL_MATCH') {
                payload.defaultScore = Number(form.defaultScore);
                payload.mappings = form.mappings.map(m => ({
                    answerKey: m.answerKey?.trim(),
                    answerValue: m.answerValue?.trim(),
                    productAttribute: m.productAttribute?.trim() || null,
                    scoringMode: m.scoringMode,
                    idealLevel: m.idealLevel?.trim() || null,
                    exactMatchScore: m.scoringMode === 'LEVELED' ? Number(m.exactMatchScore) : null,
                    deviation1Score: m.scoringMode === 'LEVELED' ? Number(m.deviation1Score) : null,
                    deviation2Score: m.scoringMode === 'LEVELED' ? Number(m.deviation2Score) : null,
                    matchScore: m.scoringMode === 'CATEGORICAL' ? Number(m.matchScore) : null,
                    noMatchScore: m.scoringMode === 'CATEGORICAL' ? Number(m.noMatchScore) : null,
                    fixedScore: m.scoringMode === 'FIXED' ? Number(m.fixedScore) : null,
                    noDataScore: Number(m.noDataScore),
                }));
            } else if (form.ruleType === 'SCORE_ADJUST') {
                payload.effectType = form.effectType;
                payload.effectValue = Number(form.effectValue);
                payload.targetProductIds = form.targetProductIds;
            } else if (form.ruleType === 'PRODUCT_EXCLUSION') {
                payload.targetProductIds = form.targetProductIds;
            }

            let result;
            if (isEdit) {
                result = await ruleService.updateRule(editingRule.id, payload);
            } else {
                result = await ruleService.createRule(payload);
            }
            onSuccess(`Rule "${result.name}" ${isEdit ? 'updated' : 'created'} ✅`, result, isEdit, editingRule?.id);
            onClose();
        } catch (err) {
            const msg = err?.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} rule.`;
            setErrors({ _general: msg });
        } finally {
            setSubmitting(false);
        }
    };

    const inp = {
        padding: '7px 10px', borderRadius: 7,
        background: 'var(--color-surface-alt)',
        border: '1.5px solid #c4b5fd',
        color: '#3b0764', fontSize: '0.82rem', outline: 'none', fontWeight: 500, boxSizing: 'border-box', width: '100%',
    };
    const lbl = { display: 'block', color: '#4c1d95', fontSize: '0.78rem', marginBottom: 4, fontWeight: 700 };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div className="glass" style={{ background: 'var(--color-surface)', border: '2px solid #a78bfa', borderRadius: 16, padding: '1.75rem', width: '100%', maxWidth: 920, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 10px 40px rgba(139,92,246,0.18)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text)' }}>
                        {isEdit ? `✏️ Edit: ${editingRule.name}` : '➕ Create New Rule'}
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.4rem' }}>✕</button>
                </div>

                {errors._general && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: '0.82rem', marginBottom: '1rem' }}>
                        ⚠ {errors._general}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Basic Info */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={lbl}>Rule Name *</label>
                            <input value={form.name} onChange={set('name')} style={inp} placeholder="e.g. Environment Match" />
                        </div>
                        <div>
                            <label style={lbl}>Description</label>
                            <input value={form.description} onChange={set('description')} style={inp} placeholder="What this rule does" />
                        </div>
                    </div>

                    {/* Type + Priority + Category */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={lbl}>Rule Type *</label>
                            <select value={form.ruleType} onChange={set('ruleType')} style={inp}>
                                {RULE_TYPES.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
                            </select>
                        </div>
                        {form.ruleType === 'CONDITIONAL_MATCH' && (
                            <div>
                                <label style={lbl}>Priority *</label>
                                <select value={form.rulePriority} onChange={set('rulePriority')} style={inp}>
                                    {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                                </select>
                            </div>
                        )}
                        <div>
                            <label style={lbl}>Target Category</label>
                            <select value={form.targetCategoryName} onChange={set('targetCategoryName')} style={inp}>
                                <option value="">All Categories</option>
                                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Type description */}
                    <div style={{ background: TYPE_COLORS[form.ruleType]?.bg, padding: '8px 14px', borderRadius: 8, fontSize: '0.78rem', color: TYPE_COLORS[form.ruleType]?.fg, fontWeight: 500 }}>
                        {RULE_TYPES.find(t => t.value === form.ruleType)?.icon} {RULE_TYPES.find(t => t.value === form.ruleType)?.desc}
                    </div>

                    {/* ── CONDITIONAL_MATCH: Flat Mappings Editor ── */}
                    {form.ruleType === 'CONDITIONAL_MATCH' && (
                        <div>
                            {/* Guidelines Box */}
                            <div style={{ background: 'rgba(56,189,248,0.06)', borderLeft: '4px solid #38bdf8', padding: '12px 16px', borderRadius: '0 8px 8px 0', marginBottom: 20 }}>
                                <h4 style={{ margin: '0 0 6px 0', color: '#0369a1', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>📘 Mapping Guidelines & Examples</h4>
                                <ul style={{ margin: 0, paddingLeft: 20, color: '#334155', fontSize: '0.78rem', lineHeight: 1.5 }}>
                                    <li style={{ marginBottom: 4 }}><strong>Tier-Based Example:</strong> If user question is <code>budget</code> and their answer is <code>economy</code>, evaluate the product's <code>budgetLevel</code> targeting <code>LOW</code>. Perfect matches get 10.0.</li>
                                    <li style={{ marginBottom: 4 }}><strong>Categorical Example:</strong> If user question is <code>style</code> and their answer is <code>wooden look</code>, evaluate the product's <code>style</code> targeting <code>WOODEN</code>. Perfect matches get 10.0.</li>
                                    <li><strong>Missing Answers:</strong> If the user does not answer the mapped question in the UI, the rule automatically skips and applies the <strong>Default Score</strong> safely.</li>
                                </ul>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <div>
                                    <label style={{ ...lbl, margin: 0, fontSize: '0.9rem' }}>🔗 Build Your Rules Engine logic</label>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <label style={{ ...lbl, margin: 0, fontSize: '0.7rem' }}>Default Score:</label>
                                        <input type="number" min="0" max="10" value={form.defaultScore}
                                            onChange={e => setForm(f => ({ ...f, defaultScore: e.target.value }))}
                                            style={{ ...inp, width: 60, textAlign: 'center' }} />
                                    </div>
                                    <button type="button" onClick={addMapping} style={{ padding: '5px 14px', fontSize: '0.78rem', borderRadius: 8, background: 'rgba(56,189,248,0.15)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.3)', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                        + Add Mapping
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {form.mappings.map((m, i) => (
                                    <FlatMappingRow
                                        key={i}
                                        mapping={m}
                                        index={i}
                                        onChange={(field, val) => updateMappingField(i, field, val)}
                                        onRemove={() => removeMapping(i)}
                                        onDuplicate={() => duplicateMapping(i)}
                                        questionKeys={questionKeys}
                                        attrMeta={attrMeta}
                                        inp={inp}
                                    />
                                ))}
                                {form.mappings.length === 0 && (
                                    <p style={{ color: '#64748b', fontSize: '0.82rem', textAlign: 'center', padding: '1rem', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 10 }}>
                                        No mappings yet. Click "+ Add Mapping" to add one.
                                    </p>
                                )}
                            </div>

                            <p style={{ color: '#64748b', fontSize: '0.7rem', marginTop: 8 }}>
                                💡 If no mapping matches the user's answers, the <strong>Default Score</strong> ({form.defaultScore}) is used.
                                Multiple mappings with the same answer key are averaged.
                            </p>
                        </div>
                    )}

                    {/* ── SCORE_ADJUST ── */}
                    {form.ruleType === 'SCORE_ADJUST' && (
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={lbl}>Effect Type *</label>
                                    <select value={form.effectType} onChange={set('effectType')} style={inp}>
                                        <option value="ADD_SCORE">➕ ADD_SCORE</option>
                                        <option value="DEDUCT_SCORE">➖ DEDUCT_SCORE</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={lbl}>Effect Value *</label>
                                    <input type="number" min="0.1" step="0.1" value={form.effectValue} onChange={set('effectValue')} style={inp} />
                                </div>
                            </div>
                            <label style={lbl}>Target Products *</label>
                            <ProductSelector products={products} selected={form.targetProductIds} onToggle={toggleProduct} />
                        </div>
                    )}

                    {/* ── PRODUCT_EXCLUSION ── */}
                    {form.ruleType === 'PRODUCT_EXCLUSION' && (
                        <div>
                            <label style={lbl}>Products to Exclude *</label>
                            <ProductSelector products={products} selected={form.targetProductIds} onToggle={toggleProduct} />
                        </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                        <button type="button" onClick={onClose} style={{ padding: '10px 22px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" disabled={submitting} style={{ padding: '10px 28px', borderRadius: 8, background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)', border: 'none', color: '#fff', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                            {submitting ? 'Saving...' : isEdit ? 'Update Rule' : 'Create Rule'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminRules() {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    const [rules, setRules] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [attrMeta, setAttrMeta] = useState(null);
    const [questionKeys, setQuestionKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRule, setEditingRule] = useState(null);
    const [deletingRule, setDeletingRule] = useState(null);
    const [toast, setToast] = useState({ msg: '', isError: false });
    const [filter, setFilter] = useState('ALL');
    const [expandedRow, setExpandedRow] = useState(null);

    const showToast = useCallback((msg, isError = false) => {
        setToast({ msg, isError });
        setTimeout(() => setToast({ msg: '', isError: false }), 4000);
    }, []);

    useEffect(() => {
        if (!isAdmin) { navigate('/login'); return; }
        let cancelled = false;
        setLoading(true);
        Promise.all([
            ruleService.getAllRules(),
            catalogService.getCategories(),
            catalogService.getAdminAllProducts().catch(() => ({ content: [] })),
            ruleService.getAttributeMeta().catch(() => ({ attributes: [] })),
            ruleService.getQuestionKeys().catch(() => []),
        ]).then(([rulesData, catsData, prodsData, metaData, qKeys]) => {
            if (cancelled) return;
            setRules(Array.isArray(rulesData) ? rulesData : []);
            setCategories(Array.isArray(catsData) ? catsData : []);
            setProducts(prodsData?.content || []);
            setAttrMeta(metaData);
            setQuestionKeys(Array.isArray(qKeys) ? qKeys : []);
        }).catch(() => showToast('Failed to load data.', true))
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [isAdmin, navigate, showToast]);

    const openCreate = () => { setEditingRule(null); setShowModal(true); };
    const openEdit = rule => { setEditingRule(rule); setShowModal(true); };
    const closeModal = () => { setShowModal(false); setEditingRule(null); };

    const handleFormSuccess = useCallback((msg, updatedRule, isEdit, ruleId) => {
        showToast(msg);
        if (isEdit) setRules(prev => prev.map(r => r.id === ruleId ? updatedRule : r));
        else setRules(prev => [...prev, updatedRule]);
    }, [showToast]);

    const handleToggleStatus = async rule => {
        try {
            const updated = await ruleService.toggleRuleStatus(rule.id);
            showToast(`"${updated.name}" is now ${updated.ruleStatus}`);
            setRules(prev => prev.map(r => r.id === updated.id ? updated : r));
        } catch { showToast('Failed to toggle status.', true); }
    };

    const confirmDelete = rule => setDeletingRule(rule);
    const cancelDelete = () => setDeletingRule(null);
    const handleDelete = async () => {
        if (!deletingRule) return;
        const target = deletingRule;
        setDeletingRule(null);
        setRules(prev => prev.filter(r => r.id !== target.id));
        try {
            await ruleService.deleteRule(target.id);
            showToast(`"${target.name}" deleted.`);
        } catch {
            setRules(prev => [...prev, target]);
            showToast(`Failed to delete "${target.name}".`, true);
        }
    };

    const filteredRules = filter === 'ALL' ? rules : rules.filter(r => r.ruleType === filter);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner" />
                <p style={{ color: '#64748b', marginLeft: 16 }}>Loading rules...</p>
            </div>
        );
    }

    return (
        <div className="light-theme" style={{ minHeight: '100vh', background: 'var(--bg-color)', padding: '7rem 1.5rem 3rem', position: 'relative' }}>
            <div style={{ maxWidth: 1300, margin: '0 auto' }}>
                <Toast toast={toast} />
                {deletingRule && <ConfirmDialog rule={deletingRule} onConfirm={handleDelete} onCancel={cancelDelete} />}
                {showModal && (
                    <RuleFormModal
                        editingRule={editingRule}
                        categories={categories}
                        products={products}
                        attrMeta={attrMeta}
                        questionKeys={questionKeys}
                        onClose={closeModal}
                        onSuccess={handleFormSuccess}
                    />
                )}

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <p style={{ color: '#38bdf8', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>
                            Dynamic Rule Engine
                        </p>
                        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: 'var(--color-text)', marginBottom: 4 }}>
                            Manage Rules
                        </h1>
                        <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>
                            Configure answer-to-attribute mappings, score adjustments, and product exclusions.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button onClick={() => navigate('/admin')} style={{ padding: '10px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', cursor: 'pointer', fontSize: '0.9rem' }}>
                            ← Back
                        </button>
                        <button onClick={openCreate} style={{ padding: '10px 22px', borderRadius: 10, background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)', border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                            + Create Rule
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    {[
                        { icon: '📋', label: 'Total Rules',        value: rules.length,                                                   color: '#38bdf8' },
                        { icon: '🎯', label: 'Conditional Match',   value: rules.filter(r => r.ruleType === 'CONDITIONAL_MATCH').length,    color: '#38bdf8' },
                        { icon: '⚡', label: 'Score Adjust',        value: rules.filter(r => r.ruleType === 'SCORE_ADJUST').length,         color: '#a855f7' },
                        { icon: '🚫', label: 'Exclusions',          value: rules.filter(r => r.ruleType === 'PRODUCT_EXCLUSION').length,    color: '#f87171' },
                        { icon: '✅', label: 'Active',              value: rules.filter(r => r.ruleStatus === 'ACTIVE').length,            color: '#4ade80' },
                    ].map(s => (
                        <div key={s.label} className="card" style={{ padding: '1.25rem', background: 'var(--color-surface)', border: '2px solid #a78bfa', boxShadow: '0 4px 12px rgba(139,92,246,0.1)' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{s.icon}</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                            <div style={{ color: 'var(--color-muted)', fontSize: '0.78rem' }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    {['ALL', ...RULE_TYPES.map(t => t.value)].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{
                            padding: '6px 14px', borderRadius: 9999, cursor: 'pointer', fontSize: '0.8rem',
                            fontWeight: filter === f ? 700 : 400,
                            border: filter === f ? '1px solid rgba(56,189,248,0.6)' : '1px solid rgba(255,255,255,0.08)',
                            background: filter === f ? 'rgba(56,189,248,0.18)' : 'rgba(255,255,255,0.03)',
                            color: filter === f ? '#38bdf8' : '#64748b',
                        }}>
                            {f === 'ALL' ? '⭐ All' : (RULE_TYPES.find(t => t.value === f)?.icon + ' ' + RULE_TYPES.find(t => t.value === f)?.label)}
                        </button>
                    ))}
                </div>

                {/* Rules Table */}
                <div className="glass" style={{ overflow: 'hidden', borderRadius: 14, border: '2px solid #38bdf8', boxShadow: '0 4px 12px rgba(56,189,248,0.1)' }}>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '2px solid #38bdf8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-surface)' }}>
                        <h2 style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.95rem' }}>Engine Rules</h2>
                        <span style={{ color: 'var(--color-muted)', fontSize: '0.78rem' }}>{filteredRules.length} shown</span>
                    </div>

                    {filteredRules.length === 0 ? (
                        <div style={{ padding: '4rem', textAlign: 'center', color: '#475569' }}>
                            <p style={{ fontSize: '2.5rem', marginBottom: 12 }}>📭</p>
                            <p>No rules found. Click <strong style={{ color: '#38bdf8' }}>+ Create Rule</strong> to add one.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', background: 'var(--color-surface)' }}>
                                <thead>
                                    <tr style={{ color: 'var(--color-muted)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.08em', borderBottom: '1px solid var(--color-border)' }}>
                                        {['Rule Name', 'Type', 'Priority', 'Mappings / Details', 'Status', 'Actions'].map(h => (
                                            <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600 }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRules.map(rule => (
                                        <>
                                            <tr key={`row-${rule.id}`} style={{ borderBottom: expandedRow === rule.id ? 'none' : '1px solid var(--color-border)', transition: 'background 0.15s', cursor: 'pointer' }}
                                                onMouseEnter={e => { if (expandedRow !== rule.id) e.currentTarget.style.background = 'var(--color-surface-alt)'; }}
                                                onMouseLeave={e => { if (expandedRow !== rule.id) e.currentTarget.style.background = 'transparent'; }}>
                                                <td style={{ padding: '12px 16px', color: 'var(--color-text)', fontWeight: 600 }}>
                                                    <div>{rule.name}</div>
                                                    {rule.description && <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>{rule.description}</div>}
                                                </td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <span style={{ padding: '3px 10px', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 600, background: TYPE_COLORS[rule.ruleType]?.bg, color: TYPE_COLORS[rule.ruleType]?.fg }}>
                                                        {RULE_TYPES.find(t => t.value === rule.ruleType)?.icon} {rule.ruleType?.replace(/_/g, ' ')}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    {rule.ruleType === 'CONDITIONAL_MATCH' ? (
                                                        <span style={{ color: rule.rulePriority === 'HIGH' ? '#f59e0b' : rule.rulePriority === 'MEDIUM' ? '#3b82f6' : '#64748b', fontWeight: 600, fontSize: '0.8rem' }}>
                                                            {rule.rulePriority} (w={rule.weight})
                                                        </span>
                                                    ) : (
                                                        <span style={{ color: 'var(--color-muted)', fontSize: '0.8rem' }}>N/A</span>
                                                    )}
                                                </td>
                                                <td style={{ padding: '12px 16px', fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                                                    {rule.ruleType === 'CONDITIONAL_MATCH' && (
                                                        <button onClick={() => setExpandedRow(expandedRow === rule.id ? null : rule.id)}
                                                            style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, padding: 0 }}>
                                                            🔗 {rule.mappings?.length || 0} mapping{rule.mappings?.length !== 1 ? 's' : ''}
                                                            {rule.defaultScore != null && <span style={{ color: '#64748b', marginLeft: 6 }}>(default: {rule.defaultScore})</span>}
                                                            <span style={{ marginLeft: 6 }}>{expandedRow === rule.id ? '▲' : '▼'}</span>
                                                        </button>
                                                    )}
                                                    {rule.ruleType === 'SCORE_ADJUST' && (
                                                        <span style={{ ...EFFECT_COLORS[rule.effectType] && { color: EFFECT_COLORS[rule.effectType].fg } }}>
                                                            {EFFECT_COLORS[rule.effectType]?.icon} {rule.effectType} ({rule.effectValue}) → {rule.productTargets?.length || 0} products
                                                        </span>
                                                    )}
                                                    {rule.ruleType === 'PRODUCT_EXCLUSION' && (
                                                        <span>🚫 {rule.productTargets?.length || 0} products excluded</span>
                                                    )}
                                                </td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <button onClick={() => handleToggleStatus(rule)} style={{
                                                        padding: '3px 12px', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', border: 'none',
                                                        background: rule.ruleStatus === 'ACTIVE' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                                                        color: rule.ruleStatus === 'ACTIVE' ? '#4ade80' : '#f87171',
                                                    }}>
                                                        {rule.ruleStatus === 'ACTIVE' ? '✅ Active' : '⛔ Inactive'}
                                                    </button>
                                                </td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <div style={{ display: 'flex', gap: 8 }}>
                                                        <button onClick={() => openEdit(rule)} style={{ padding: '5px 14px', borderRadius: 8, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}>
                                                            ✏️ Edit
                                                        </button>
                                                        <button onClick={() => confirmDelete(rule)} style={{ padding: '5px 14px', borderRadius: 8, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                                                            🗑 Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Expanded mapping details */}
                                            {expandedRow === rule.id && rule.mappings?.length > 0 && (
                                                <tr key={`${rule.id}-expanded`} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                    <td colSpan={6} style={{ padding: '0 16px 14px 16px', background: 'var(--color-surface-alt)' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 10 }}>
                                                            {rule.mappings.map((m, i) => {
                                                                const mc = MODE_COLORS[m.scoringMode] || MODE_COLORS.LEVELED;
                                                                return (
                                                                    <div key={i} style={{ border: `1px solid ${mc.border}`, borderRadius: 8, padding: '6px 10px', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                                                                        <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: mc.bg, color: mc.fg, border: `1px solid ${mc.border}` }}>
                                                                            {m.scoringMode}
                                                                        </span>
                                                                        <code style={{ fontSize: '0.72rem', color: '#4ade80' }}>
                                                                            {m.answerKey}="{m.answerValue}"
                                                                        </code>
                                                                        {m.scoringMode !== 'FIXED' && (
                                                                            <>
                                                                                <span style={{ color: '#64748b', fontSize: '0.7rem' }}>→</span>
                                                                                <span style={{ fontSize: '0.72rem', color: '#38bdf8' }}>
                                                                                    {m.productAttribute} ideal={m.idealLevel}
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                        <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginLeft: 'auto' }}>
                                                                            {m.scoringMode === 'LEVELED' && `[${m.exactMatchScore}/${m.deviation1Score}/${m.deviation2Score}]`}
                                                                            {m.scoringMode === 'CATEGORICAL' && `match=${m.matchScore} no=${m.noMatchScore}`}
                                                                            {m.scoringMode === 'FIXED' && `score=${m.fixedScore}`}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
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
