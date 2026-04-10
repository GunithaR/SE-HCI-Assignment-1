import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ruleService from '../services/ruleService';
import catalogService from '../services/catalogService';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_RULE_FORM = {
    name: '',
    description: '',
    ruleType: 'SOFT_PREFERENCE',
    ruleStatus: 'ACTIVE',
    targetScope: 'GLOBAL',
    targetCategoryName: '',
    combinationType: 'ALL',
    dynamicAttribute: 'budget',
    priority: 10,
    weight: 10,
    effectType: 'ADD_SCORE',
    effectValue: 10,
    conditions: []
};

const OPERATORS = ['EQUALS', 'NOT_EQUALS', 'GREATER_THAN', 'LESS_THAN', 'GREATER_OR_EQUAL', 'LESS_OR_EQUAL', 'IN', 'CONTAINS'];

const USER_INPUT_ATTRIBUTES = [
    'budget', 'climate', 'style', 'durabilityPreference', 'maintenancePreference',
    'location', 'concern', 'maintenance', 'flooring_usage', 'traffic',
    'priority', 'slip_resistance', 'wall_usage', 'environment', 'goal',
    'room_type', 'accessory_type', 'usage_duration', 'usage_environment'
];

const PRODUCT_ATTRIBUTES = [
    'budgetLevel', 'climateSuitability', 'style', 'durabilityRating',
    'maintenanceLevel', 'categoryName', 'material',
    'waterResistance', 'corrosionResistance', 'heatResistance',
    'slipResistance', 'noiseReduction', 'usageArea'
];

const EFFECT_TYPES_SOFT = [
    { value: 'ADD_SCORE', label: 'ADD_SCORE — Adds points to product score' },
    { value: 'DEDUCT_SCORE', label: 'DEDUCT_SCORE — Deducts points from product score' }
];

const EFFECT_TYPES_HARD = [
    { value: 'FILTER_OUT', label: 'FILTER_OUT — Exclude product from results' }
];

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
// Delete Confirm Dialog
// ─────────────────────────────────────────────────────────────────────────────
function ConfirmDialog({ rule, onConfirm, onCancel }) {
    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
            <div style={{
                background: 'var(--color-surface)', border: '2px solid #ef4444',
                borderRadius: 14, padding: '2rem', maxWidth: 420, width: '100%',
                boxShadow: '0 10px 40px rgba(239,68,68,0.2)'
            }}>
                <p style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '0.5rem' }}>🗑️</p>
                <h3 style={{ fontWeight: 700, color: 'var(--color-text)', marginBottom: 8, textAlign: 'center' }}>
                    Delete Rule?
                </h3>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                    Are you sure you want to permanently delete <strong style={{ color: '#f87171' }}>{rule.name}</strong>?
                    This cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <button onClick={onCancel}
                        style={{ padding: '9px 20px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', cursor: 'pointer', fontWeight: 600 }}>
                        Cancel
                    </button>
                    <button onClick={onConfirm}
                        style={{ padding: '9px 22px', borderRadius: 8, background: 'linear-gradient(135deg, #dc2626, #ef4444)', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule Form Modal
// ─────────────────────────────────────────────────────────────────────────────
function RuleFormModal({ editingRule, categories, onClose, onSuccess }) {
    const isEdit = Boolean(editingRule);

    const buildInitialForm = () => {
        if (isEdit) {
            return {
                ...editingRule,
                // Ensure effectType & effectValue are correctly set
                effectType: editingRule.effectType || (editingRule.ruleType === 'HARD_CONSTRAINT' ? 'FILTER_OUT' : 'ADD_SCORE'),
                effectValue: editingRule.effectValue ?? 10,
                // Deep-copy conditions so edits don't mutate the original rule object
                conditions: editingRule.conditions
                    ? editingRule.conditions.map(c => ({ ...c }))
                    : []
            };
        }
        return {
            ...EMPTY_RULE_FORM,
            conditions: [{ operandSource: 'PRODUCT', attributeName: '', operator: 'EQUALS', expectedValue: '' }]
        };
    };

    const [form, setForm] = useState(buildInitialForm);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const isHardConstraint = form.ruleType === 'HARD_CONSTRAINT';
    const isFilterOut = form.effectType === 'FILTER_OUT';

    // ── When ruleType changes, auto-adjust effect fields ───────────────────
    const handleRuleTypeChange = (e) => {
        const newType = e.target.value;
        setForm(f => {
            const updates = { ...f, ruleType: newType };
            if (newType === 'HARD_CONSTRAINT') {
                updates.effectType = 'FILTER_OUT';
                updates.effectValue = null;
                updates.weight = 0;
            } else {
                if (f.effectType === 'FILTER_OUT') {
                    updates.effectType = 'ADD_SCORE';
                }
                if (!f.weight || f.weight === 0) {
                    updates.weight = 10;
                }
                if (!f.effectValue) {
                    updates.effectValue = 10;
                }
            }
            return updates;
        });
    };

    const handleEffectTypeChange = (e) => {
        const val = e.target.value;
        setForm(f => ({
            ...f,
            effectType: val,
            effectValue: val === 'FILTER_OUT' ? null : (f.effectValue || 10)
        }));
    };

    const set = (field) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm((f) => ({ ...f, [field]: value }));
    };

    const addCondition = () => {
        setForm(f => ({
            ...f,
            conditions: [...f.conditions, { operandSource: 'PRODUCT', attributeName: '', operator: 'EQUALS', expectedValue: '' }]
        }));
    };

    const updateCondition = (index, field, value) => {
        setForm(f => {
            const newCond = [...f.conditions];
            newCond[index] = { ...newCond[index], [field]: value };
            // Reset attributeName when source changes so stale values don't bleed through
            if (field === 'operandSource') {
                newCond[index].attributeName = '';
            }
            return { ...f, conditions: newCond };
        });
    };

    const removeCondition = (index) => {
        setForm(f => ({ ...f, conditions: f.conditions.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // ── Client-side validation ─────────────────────────────────────────
        if (!form.name.trim()) {
            setErrors({ name: 'Rule name is required' }); return;
        }
        if (form.targetScope === 'CATEGORY' && !form.targetCategoryName) {
            setErrors({ targetCategoryName: 'Target category is required when scope is CATEGORY.' }); return;
        }
        if (form.combinationType !== 'NONE' && form.conditions.length === 0) {
            setErrors({ _general: 'At least one condition is required.' }); return;
        }
        if (!isHardConstraint && !isFilterOut && (!form.effectValue || Number(form.effectValue) <= 0)) {
            setErrors({ effectValue: 'Effect value must be a positive number.' }); return;
        }

        setSubmitting(true);
        try {
            const payload = { ...form };

            // Clear category name for non-category scopes
            if (payload.targetScope !== 'CATEGORY') {
                payload.targetCategoryName = null;
            }

            // Hard constraint always uses FILTER_OUT with no value
            if (payload.ruleType === 'HARD_CONSTRAINT') {
                payload.weight = 0;
                payload.effectType = 'FILTER_OUT';
                payload.effectValue = null;
            }

            // FILTER_OUT never needs an effect value
            if (payload.effectType === 'FILTER_OUT') {
                payload.effectValue = null;
            }

            // NONE combination type uses dynamic attribute — no explicit conditions
            if (payload.combinationType === 'NONE') {
                payload.conditions = [];
            } else {
                payload.dynamicAttribute = null;
            }

            // Coerce effectValue to number for ADD_SCORE / DEDUCT_SCORE
            if (payload.effectValue !== null && payload.effectValue !== undefined) {
                payload.effectValue = Number(payload.effectValue);
            }

            // Coerce priority and weight to numbers (they come from text inputs as strings)
            payload.priority = Number(payload.priority);
            if (payload.weight !== null && payload.weight !== undefined) {
                payload.weight = Number(payload.weight);
            }

            let result;
            if (isEdit) {
                result = await ruleService.updateRule(editingRule.id, payload);
            } else {
                result = await ruleService.createRule(payload);
            }

            onSuccess(`Rule "${result.name}" ${isEdit ? 'updated' : 'created'} successfully! ✅`, result, isEdit, editingRule?.id);
            onClose();
        } catch (err) {
            const msg = err?.response?.data?.message
                || (typeof err?.response?.data === 'string' ? err.response.data : null)
                || `Failed to ${isEdit ? 'update' : 'create'} rule.`;
            setErrors({ _general: msg });
        } finally {
            setSubmitting(false);
        }
    };

    const inp = (field) => ({
        width: '100%', padding: '8px 12px', borderRadius: 8,
        background: 'var(--color-surface-alt)',
        border: errors[field] ? '2px solid #ef4444' : '2px solid #c4b5fd',
        color: '#3b0764', fontSize: '0.85rem', outline: 'none', fontWeight: 500, boxSizing: 'border-box'
    });
    const lbl = { display: 'block', color: '#4c1d95', fontSize: '0.8rem', marginBottom: 4, fontWeight: 700 };

    const availableEffects = isHardConstraint ? EFFECT_TYPES_HARD : EFFECT_TYPES_SOFT;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: 20
        }}>
            <div className="glass" style={{
                background: 'var(--color-surface)', border: '2px solid #a78bfa', borderRadius: 16,
                padding: '2rem', width: '100%', maxWidth: 820,
                maxHeight: '90vh', overflowY: 'auto',
                boxShadow: '0 10px 40px rgba(139,92,246,0.15)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-text)' }}>
                        {isEdit ? `✏️ Edit Rule: ${editingRule.name}` : '➕ Create New Rule'}
                    </h2>
                    <button type="button" onClick={onClose}
                        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.4rem' }}>✕</button>
                </div>

                {errors._general && (
                    <div style={{
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: 8, padding: '10px 14px', color: '#f87171',
                        fontSize: '0.85rem', marginBottom: '1rem'
                    }}>
                        ⚠ {errors._general}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* ─── Basic Info ──────────────────────────────────────────── */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem' }}>
                        <div>
                            <label style={lbl}>Rule Name *</label>
                            <input value={form.name} onChange={set('name')} style={inp('name')} placeholder="e.g. Budget Strict Match" />
                            {errors.name && <p style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: 4 }}>{errors.name}</p>}
                        </div>
                        <div>
                            <label style={lbl}>Description</label>
                            <input value={form.description || ''} onChange={set('description')} style={inp('description')} placeholder="Explains what this rule does" />
                        </div>
                    </div>

                    {/* ─── Rule Type / Status / Priority / Weight ─────────────── */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={lbl}>Rule Type *</label>
                            <select value={form.ruleType} onChange={handleRuleTypeChange} style={inp('ruleType')}>
                                <option value="HARD_CONSTRAINT">HARD_CONSTRAINT</option>
                                <option value="SOFT_PREFERENCE">SOFT_PREFERENCE</option>
                            </select>
                        </div>
                        <div>
                            <label style={lbl}>Status</label>
                            <select value={form.ruleStatus} onChange={set('ruleStatus')} style={inp('ruleStatus')}>
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                            </select>
                        </div>
                        <div>
                            <label style={lbl}>Priority (higher = runs first) *</label>
                            <input type="number" value={form.priority} onChange={set('priority')} style={inp('priority')} />
                        </div>
                        <div>
                            <label style={lbl}>Weight (soft prefs only)</label>
                            <input
                                type="number" step="0.1" min="0"
                                disabled={isHardConstraint}
                                value={isHardConstraint ? 0 : (form.weight ?? 10)}
                                onChange={set('weight')}
                                style={{ ...inp('weight'), opacity: isHardConstraint ? 0.4 : 1, cursor: isHardConstraint ? 'not-allowed' : 'text' }}
                            />
                            {isHardConstraint && (
                                <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 4, fontStyle: 'italic' }}>Disabled for hard constraints</p>
                            )}
                        </div>
                    </div>

                    {/* ─── Scope / Category / Combination ─────────────────────── */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={lbl}>Target Scope *</label>
                            <select value={form.targetScope} onChange={set('targetScope')} style={inp('targetScope')}>
                                <option value="GLOBAL">GLOBAL (All products)</option>
                                <option value="CATEGORY">CATEGORY (Specific category)</option>
                            </select>
                        </div>
                        <div>
                            <label style={lbl}>Target Category {form.targetScope === 'CATEGORY' ? '*' : ''}</label>
                            <select
                                disabled={form.targetScope !== 'CATEGORY'}
                                value={form.targetCategoryName || ''}
                                onChange={set('targetCategoryName')}
                                style={{
                                    ...inp('targetCategoryName'),
                                    opacity: form.targetScope !== 'CATEGORY' ? 0.4 : 1,
                                    borderColor: errors.targetCategoryName ? '#ef4444' : '#c4b5fd'
                                }}
                            >
                                <option value="">Select category...</option>
                                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                            {errors.targetCategoryName && (
                                <p style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: 4 }}>{errors.targetCategoryName}</p>
                            )}
                        </div>
                        <div>
                            <label style={lbl}>Combination Type *</label>
                            <select value={form.combinationType} onChange={set('combinationType')} style={inp('combinationType')}>
                                <option value="ALL">ALL (All conditions match)</option>
                                <option value="ANY">ANY (Any one condition matches)</option>
                                <option value="NONE">NONE (Dynamic Attribute)</option>
                            </select>
                        </div>
                    </div>

                    {/* ─── Dynamic Target Attribute (Visible only if NONE) ───── */}
                    {form.combinationType === 'NONE' && (
                        <div style={{
                            background: 'rgba(56,189,248,0.1)', padding: 16, borderRadius: 12,
                            border: '1px solid rgba(56,189,248,0.3)', marginTop: 4
                        }}>
                            <label style={lbl}>Dynamic Target Attribute *</label>
                            <p style={{ fontSize: '0.75rem', color: '#6290A0', marginBottom: 10 }}>
                                This rule dynamically matches user input against the product's corresponding attribute.
                            </p>
                            <select
                                value={form.dynamicAttribute || 'budget'}
                                onChange={set('dynamicAttribute')}
                                style={inp('dynamicAttribute')}
                            >
                                {USER_INPUT_ATTRIBUTES.map(attr => <option key={attr} value={attr}>{attr}</option>)}
                            </select>
                        </div>
                    )}

                    {/* ─── Conditions Builder (Hidden if NONE) ────────────────── */}
                    {form.combinationType !== 'NONE' && (
                        <div style={{ marginTop: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ ...lbl, margin: 0 }}>Conditions *</label>
                                <button type="button" onClick={addCondition} style={{
                                    padding: '4px 10px', fontSize: '0.75rem', borderRadius: 6,
                                    background: 'rgba(139,92,246,0.15)', color: '#8b5cf6',
                                    border: '1px solid rgba(139,92,246,0.3)', cursor: 'pointer', fontWeight: 600
                                }}>
                                    + Add Condition
                                </button>
                            </div>

                            {form.conditions.length === 0 && (
                                <div style={{ fontSize: '0.8rem', color: '#ef4444', padding: '10px', background: 'rgba(239,68,68,0.1)', borderRadius: 8 }}>
                                    At least one condition is required.
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {form.conditions.map((cond, index) => (
                                    <div key={index} style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1.2fr 1.5fr 1.2fr 1.5fr auto',
                                        gap: 8, alignItems: 'center',
                                        background: 'var(--color-surface-alt)',
                                        padding: 10, borderRadius: 8,
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        /* Use a high fixed z-index so dropdowns never get clipped */
                                        position: 'relative',
                                        zIndex: 500 - index
                                    }}>
                                        {/* Source */}
                                        <div style={{ position: 'relative', zIndex: 10 }}>
                                            <select
                                                value={cond.operandSource}
                                                onChange={(e) => updateCondition(index, 'operandSource', e.target.value)}
                                                style={inp(`cond_${index}_source`)}
                                            >
                                                <option value="PRODUCT">PRODUCT</option>
                                                <option value="USER_INPUT">USER_INPUT</option>
                                            </select>
                                        </div>

                                        {/* Attribute — list changes dynamically based on source */}
                                        <div style={{ position: 'relative', zIndex: 10 }}>
                                            <select
                                                value={cond.attributeName}
                                                onChange={(e) => updateCondition(index, 'attributeName', e.target.value)}
                                                style={{
                                                    ...inp(`cond_${index}_attr`),
                                                    borderColor: cond.attributeName ? '#c4b5fd' : '#ef4444'
                                                }}
                                            >
                                                <option value="">Select Attribute...</option>
                                                {(cond.operandSource === 'USER_INPUT' ? USER_INPUT_ATTRIBUTES : PRODUCT_ATTRIBUTES).map(attr => (
                                                    <option key={attr} value={attr}>{attr}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Operator */}
                                        <div style={{ position: 'relative', zIndex: 10 }}>
                                            <select
                                                value={cond.operator}
                                                onChange={(e) => updateCondition(index, 'operator', e.target.value)}
                                                style={inp(`cond_${index}_op`)}
                                            >
                                                {OPERATORS.map(op => <option key={op} value={op}>{op}</option>)}
                                            </select>
                                        </div>

                                        {/* Expected Value */}
                                        <input
                                            value={cond.expectedValue}
                                            onChange={(e) => updateCondition(index, 'expectedValue', e.target.value)}
                                            style={inp(`cond_${index}_val`)}
                                            placeholder="Expected Value"
                                        />

                                        {/* Remove */}
                                        <button
                                            type="button"
                                            onClick={() => removeCondition(index)}
                                            style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '1.2rem', padding: '0 4px' }}
                                            title="Remove condition"
                                        >✕</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ─── Rule Effect Section ────────────────────────────────── */}
                    <div style={{
                        background: isHardConstraint ? 'rgba(239,68,68,0.06)' : 'rgba(139,92,246,0.08)',
                        padding: 16, borderRadius: 12, marginTop: '0.5rem',
                        border: `1px solid ${isHardConstraint ? 'rgba(239,68,68,0.2)' : 'rgba(139,92,246,0.25)'}`
                    }}>
                        <label style={{ ...lbl, fontSize: '0.9rem', marginBottom: 2 }}>⚡ Rule Effect</label>
                        <p style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: 12, fontStyle: 'italic' }}>
                            Defines how this rule affects product scoring when conditions match.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: isFilterOut || isHardConstraint ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={lbl}>Effect Type *</label>
                                <select
                                    value={form.effectType}
                                    onChange={handleEffectTypeChange}
                                    style={inp('effectType')}
                                    disabled={isHardConstraint}
                                >
                                    {availableEffects.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                {isHardConstraint && (
                                    <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 4, fontStyle: 'italic' }}>
                                        Hard constraints always use FILTER_OUT
                                    </p>
                                )}
                            </div>

                            {!isFilterOut && !isHardConstraint && (
                                <div>
                                    <label style={lbl}>Effect Value *</label>
                                    <input
                                        type="number" min="1"
                                        value={form.effectValue || ''}
                                        onChange={set('effectValue')}
                                        style={inp('effectValue')}
                                        placeholder="e.g. 10"
                                    />
                                    {errors.effectValue && (
                                        <p style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: 4 }}>
                                            {errors.effectValue}
                                        </p>
                                    )}
                                    <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 4 }}>
                                        Score impact = Value × Weight = {Number(form.effectValue || 0) * Number(form.weight || 0)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ─── Actions ─────────────────────────────────────────────── */}
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 16 }}>
                        <button type="button" onClick={onClose}
                            style={{ padding: '10px 22px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', cursor: 'pointer' }}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || (form.combinationType !== 'NONE' && form.conditions.length === 0)}
                            style={{
                                padding: '10px 28px', borderRadius: 8,
                                background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
                                border: 'none', color: '#fff', fontWeight: 600,
                                cursor: (submitting || (form.combinationType !== 'NONE' && form.conditions.length === 0)) ? 'not-allowed' : 'pointer',
                                opacity: (submitting || (form.combinationType !== 'NONE' && form.conditions.length === 0)) ? 0.7 : 1
                            }}
                        >
                            {submitting ? 'Saving...' : (isEdit ? 'Update Rule' : 'Create Rule')}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Effect Badge (for the table)
// ─────────────────────────────────────────────────────────────────────────────
function EffectBadge({ effectType, effectValue }) {
    if (!effectType) return <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>—</span>;
    const colors = {
        ADD_SCORE: { bg: 'rgba(34,197,94,0.12)', text: '#4ade80', icon: '➕' },
        DEDUCT_SCORE: { bg: 'rgba(251,191,36,0.12)', text: '#fbbf24', icon: '➖' },
        FILTER_OUT: { bg: 'rgba(239,68,68,0.12)', text: '#f87171', icon: '🚫' }
    };
    const c = colors[effectType] || colors.FILTER_OUT;
    return (
        <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 600, background: c.bg, color: c.text, whiteSpace: 'nowrap' }}>
            {c.icon} {effectType}{effectValue ? ` (${effectValue})` : ''}
        </span>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin Rules Page
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminRules() {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    const [rules, setRules] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRule, setEditingRule] = useState(null);
    const [deletingRule, setDeletingRule] = useState(null);
    const [toast, setToast] = useState({ msg: '', isError: false });

    const showToast = useCallback((msg, isError = false) => {
        setToast({ msg, isError });
        setTimeout(() => setToast({ msg: '', isError: false }), 4000);
    }, []);

    // ── Separate fetches so a categories failure never hides existing rules ──
    useEffect(() => {
        if (!isAdmin) {
            navigate('/login');
            return;
        }

        let cancelled = false;
        setLoading(true);

        // Fetch rules — primary data, must succeed
        ruleService.getAllRules()
            .then(data => { if (!cancelled) setRules(Array.isArray(data) ? data : []); })
            .catch(err => {
                console.error('Could not load rules:', err);
                if (!cancelled) showToast('Failed to load rules from server.', true);
            })
            .finally(() => { if (!cancelled) setLoading(false); });

        // Fetch categories — secondary data, failure is non-fatal
        catalogService.getCategories()
            .then(data => { if (!cancelled) setCategories(Array.isArray(data) ? data : []); })
            .catch(err => console.warn('Could not load categories (non-fatal):', err));

        return () => { cancelled = true; };
    }, [isAdmin, navigate, showToast]);

    const openCreate = () => { setEditingRule(null); setShowModal(true); };
    const openEdit = (rule) => { setEditingRule(rule); setShowModal(true); };
    const closeModal = () => { setShowModal(false); setEditingRule(null); };

    // isEdit and ruleId are passed from the modal so the closure is stable
    const handleFormSuccess = useCallback((msg, updatedRule, isEdit, ruleId) => {
        showToast(msg);
        if (isEdit) {
            setRules(prev => prev.map(r => r.id === ruleId ? updatedRule : r));
        } else {
            setRules(prev => [...prev, updatedRule]);
        }
    }, [showToast]);

    const handleToggleStatus = async (rule) => {
        const newStatus = rule.ruleStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        try {
            const updated = await ruleService.toggleRuleStatus(rule.id, newStatus);
            showToast(`Rule "${updated.name}" is now ${newStatus}`);
            setRules(prev => prev.map(r => r.id === updated.id ? updated : r));
        } catch {
            showToast('Failed to toggle rule status.', true);
        }
    };

    const confirmDelete = (rule) => setDeletingRule(rule);
    const cancelDelete = () => setDeletingRule(null);

    const handleDelete = async () => {
        if (!deletingRule) return;
        const target = deletingRule;
        setDeletingRule(null);
        // Optimistic removal
        setRules(prev => prev.filter(r => r.id !== target.id));
        try {
            await ruleService.deleteRule(target.id);
            showToast(`Rule "${target.name}" deleted successfully.`);
        } catch (err) {
            // Roll back on failure
            setRules(prev => [...prev, target].sort((a, b) => b.priority - a.priority));
            showToast(`Failed to delete rule "${target.name}".`, true);
        }
    };

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

                {/* Confirm delete dialog */}
                {deletingRule && (
                    <ConfirmDialog rule={deletingRule} onConfirm={handleDelete} onCancel={cancelDelete} />
                )}

                {/* Create / Edit modal */}
                {showModal && (
                    <RuleFormModal
                        editingRule={editingRule}
                        categories={categories}
                        onClose={closeModal}
                        onSuccess={handleFormSuccess}
                    />
                )}

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <p style={{ color: '#38bdf8', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>
                            Recommendation Engine
                        </p>
                        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: 'var(--color-text)', marginBottom: 4 }}>
                            Manage Rules
                        </h1>
                        <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>
                            Define constraints and preferences affecting recommendation scoring.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button onClick={() => navigate('/admin')}
                            style={{ padding: '10px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', cursor: 'pointer', fontSize: '0.9rem' }}>
                            ← Back to Dashboard
                        </button>
                        <button onClick={openCreate}
                            style={{ padding: '10px 22px', borderRadius: 10, background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)', border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                            + Create Rule
                        </button>
                    </div>
                </div>

                {/* Rules Table */}
                <div className="glass" style={{ overflow: 'hidden', borderRadius: 14, border: '2px solid #38bdf8', boxShadow: '0 4px 12px rgba(56,189,248,0.1)' }}>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '2px solid #38bdf8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-surface)' }}>
                        <h2 style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.95rem' }}>Engine Rules</h2>
                        <span style={{ color: 'var(--color-muted)', fontSize: '0.78rem' }}>{rules.length} total</span>
                    </div>

                    {rules.length === 0 ? (
                        <div style={{ padding: '4rem', textAlign: 'center', color: '#475569' }}>
                            <p style={{ fontSize: '2.5rem', marginBottom: 12 }}>🧩</p>
                            <p style={{ color: '#64748b' }}>No rules created yet.</p>
                            <p style={{ fontSize: '0.78rem', marginTop: 8 }}>
                                Click <strong style={{ color: '#38bdf8' }}>+ Create Rule</strong> to begin configuring the matching logic.
                            </p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', background: 'var(--color-surface)' }}>
                                <thead>
                                    <tr style={{ color: 'var(--color-muted)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.08em', borderBottom: '1px solid var(--color-border)' }}>
                                        <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600 }}>Rule Name</th>
                                        <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600 }}>Type</th>
                                        <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600 }}>Effect</th>
                                        <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600 }}>Scope</th>
                                        <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600 }}>Conditions</th>
                                        <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600 }}>Priority</th>
                                        <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600 }}>Status</th>
                                        <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600 }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...rules].sort((a, b) => b.priority - a.priority).map((r) => (
                                        <tr key={r.id}
                                            style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s' }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-alt)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            {/* Name + description */}
                                            <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: 500 }}>
                                                {r.name}
                                                <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: 4, fontWeight: 400 }}>
                                                    {r.description && <span>{r.description}</span>}
                                                    {r.combinationType === 'NONE' && r.dynamicAttribute && (
                                                        <span style={{ display: 'block', color: '#0ea5e9', marginTop: 2 }}>🔗 Dynamic: {r.dynamicAttribute}</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Type badge */}
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{
                                                    padding: '3px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700,
                                                    background: r.ruleType === 'HARD_CONSTRAINT' ? 'rgba(239,68,68,0.1)' : 'rgba(168,85,247,0.1)',
                                                    color: r.ruleType === 'HARD_CONSTRAINT' ? '#ef4444' : '#a855f7'
                                                }}>
                                                    {r.ruleType === 'HARD_CONSTRAINT' ? 'CONSTRAINT' : `PREFERENCE (×${r.weight ?? 0})`}
                                                </span>
                                            </td>

                                            {/* Effect */}
                                            <td style={{ padding: '14px 16px' }}>
                                                <EffectBadge effectType={r.effectType} effectValue={r.effectValue} />
                                            </td>

                                            {/* Scope */}
                                            <td style={{ padding: '14px 16px', color: 'var(--color-muted)', fontSize: '0.8rem' }}>
                                                {r.targetScope === 'GLOBAL'
                                                    ? '🌍 GLOBAL'
                                                    : `🏷️ ${r.targetCategoryName || 'CATEGORY'}`
                                                }
                                            </td>

                                            {/* Condition count */}
                                            <td style={{ padding: '14px 16px', color: 'var(--color-muted)', fontSize: '0.8rem' }}>
                                                {r.combinationType === 'NONE'
                                                    ? <span style={{ color: '#0ea5e9' }}>Dynamic</span>
                                                    : <span>{r.conditions?.length ?? 0} cond. ({r.combinationType})</span>
                                                }
                                            </td>

                                            {/* Priority */}
                                            <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: 600 }}>
                                                {r.priority}
                                            </td>

                                            {/* Status toggle */}
                                            <td style={{ padding: '14px 16px' }}>
                                                <button
                                                    onClick={() => handleToggleStatus(r)}
                                                    title="Click to toggle status"
                                                    style={{
                                                        padding: '4px 12px', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 600,
                                                        cursor: 'pointer', border: 'none',
                                                        background: r.ruleStatus === 'ACTIVE' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                                                        color: r.ruleStatus === 'ACTIVE' ? '#4ade80' : '#f87171',
                                                        transition: 'all 0.2s',
                                                    }}
                                                >
                                                    {r.ruleStatus === 'ACTIVE' ? '🟢 Active' : '⚪ Inactive'}
                                                </button>
                                            </td>

                                            {/* Actions */}
                                            <td style={{ padding: '14px 16px' }}>
                                                <div style={{ display: 'flex', gap: 6 }}>
                                                    <button
                                                        onClick={() => openEdit(r)}
                                                        style={{
                                                            padding: '5px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '0.78rem',
                                                            fontWeight: 500, background: 'rgba(56,189,248,0.12)',
                                                            border: '1px solid rgba(56,189,248,0.3)', color: '#38bdf8', transition: 'all 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.background = 'rgba(56,189,248,0.25)'}
                                                        onMouseLeave={(e) => e.target.style.background = 'rgba(56,189,248,0.12)'}
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDelete(r)}
                                                        style={{
                                                            padding: '5px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '0.78rem',
                                                            fontWeight: 500, background: 'rgba(239,68,68,0.1)',
                                                            border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', transition: 'all 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.background = 'rgba(239,68,68,0.25)'}
                                                        onMouseLeave={(e) => e.target.style.background = 'rgba(239,68,68,0.1)'}
                                                    >
                                                        🗑️ Delete
                                                    </button>
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
