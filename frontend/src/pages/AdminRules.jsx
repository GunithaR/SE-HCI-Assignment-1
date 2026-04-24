import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { 
    Zap, Settings, Plus, X, Pencil, Trash2, 
    Lightbulb, Scale, CheckCircle, XCircle, 
    AlertTriangle, ArrowLeft, TrendingUp, History
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ruleService from '../services/ruleService';
import catalogService from '../services/catalogService';
import './AdminDashboardUnified.css';

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
    weightAdjustment: 10,
    effectType: 'ADD_SCORE',
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
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    return createPortal(
        <div className="admin-modal-overlay light-theme" style={{ zIndex: 2000 }}>
            <div className="admin-modal-content" style={{ maxWidth: 420, borderColor: '#ef4444', boxShadow: '0 10px 40px rgba(239,68,68,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <div style={{ background: 'rgba(239,68,68,0.1)', padding: '1rem', borderRadius: '50%' }}>
                        <Trash2 size={48} color="#ef4444" />
                    </div>
                </div>
                <h3 style={{ fontWeight: 700, color: '#1e1b4b', marginBottom: 8, textAlign: 'center' }}>
                    Delete Rule?
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                    Are you sure you want to permanently delete <strong style={{ color: '#f87171' }}>{rule.name}</strong>?
                    This cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <button onClick={onCancel}
                        style={{ padding: '9px 20px', borderRadius: 8, background: '#f5f3ff', border: '1.5px solid #ddd6fe', color: '#6b7280', cursor: 'pointer', fontWeight: 600 }}>
                        Cancel
                    </button>
                    <button onClick={onConfirm}
                        style={{ padding: '9px 22px', borderRadius: 8, background: 'linear-gradient(135deg, #dc2626, #ef4444)', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule Form Modal
// ─────────────────────────────────────────────────────────────────────────────
function RuleFormModal({ editingRule, categories, onClose, onSuccess }) {
    const isEdit = Boolean(editingRule);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const buildInitialForm = () => {
        if (isEdit) {
            return {
                ...editingRule,
                effectType: editingRule.effectType || (editingRule.ruleType === 'HARD_CONSTRAINT' ? 'FILTER_OUT' : 'ADD_SCORE'),
                conditions: editingRule.conditions
                    ? editingRule.conditions.map(c => ({ ...c }))
                    : []
            };
        }
        return {
            ...EMPTY_RULE_FORM,
            conditions: [{ operandSource: 'PRODUCT', attributeName: PRODUCT_ATTRIBUTES[0], operator: 'EQUALS', expectedValue: '' }]
        };
    };

    const [form, setForm] = useState(buildInitialForm);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const isHardConstraint = form.ruleType === 'HARD_CONSTRAINT';
    const isFilterOut = form.effectType === 'FILTER_OUT';

    const handleRuleTypeChange = (e) => {
        const newType = e.target.value;
        setForm(f => {
            const updates = { ...f, ruleType: newType };
            if (newType === 'HARD_CONSTRAINT') {
                updates.effectType = 'FILTER_OUT';
                updates.weightAdjustment = 0;
            } else {
                if (f.effectType === 'FILTER_OUT') {
                    updates.effectType = 'ADD_SCORE';
                }
            }
            return updates;
        });
    };

    const set = (field) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm((f) => ({ ...f, [field]: value }));
    };

    const addCondition = () => {
        setForm(f => ({
            ...f,
            conditions: [...f.conditions, { operandSource: 'PRODUCT', attributeName: PRODUCT_ATTRIBUTES[0], operator: 'EQUALS', expectedValue: '' }]
        }));
    };

    const updateCondition = (index, field, value) => {
        setForm(f => {
            const newCond = [...f.conditions];
            newCond[index] = { ...newCond[index], [field]: value };
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

        if (!form.name.trim()) {
            setErrors({ name: 'Rule name is required' }); return;
        }

        setSubmitting(true);
        try {
            const payload = { ...form };
            if (payload.targetScope !== 'CATEGORY') payload.targetCategoryName = null;
            if (payload.ruleType === 'HARD_CONSTRAINT') {
                payload.weightAdjustment = 0;
                payload.effectType = 'FILTER_OUT';
            }
            if (payload.combinationType === 'NONE') payload.conditions = [];
            else payload.dynamicAttribute = null;

            payload.priority = Number(payload.priority);
            payload.weightAdjustment = Number(payload.weightAdjustment);

            let result;
            if (isEdit) {
                result = await ruleService.updateRule(editingRule.id, payload);
            } else {
                result = await ruleService.createRule(payload);
            }

            onSuccess(`Rule "${result.name}" ${isEdit ? 'updated' : 'created'} successfully!`, result, isEdit, editingRule?.id);
            onClose();
        } catch (err) {
            const data = err?.response?.data;
            const msg = data?.message || typeof data === 'string' ? data : `Failed to ${isEdit ? 'update' : 'create'} rule.`;
            setErrors({ _general: msg });
        } finally {
            setSubmitting(false);
        }
    };

    const inp = (field) => ({
        width: '100%', padding: '8px 12px', borderRadius: 8,
        background: '#f5f3ff',
        border: errors[field] ? '2px solid #ef4444' : '1.5px solid #c4b5fd',
        color: '#1e1b4b', fontSize: '0.85rem', outline: 'none', fontWeight: 500, boxSizing: 'border-box'
    });
    const lbl = { display: 'block', color: '#4c1d95', fontSize: '0.8rem', marginBottom: 4, fontWeight: 700 };

    return createPortal(
        <div className="admin-modal-overlay light-theme" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="admin-modal-content" style={{ maxWidth: 820 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #ede9fe', paddingBottom: '1rem' }}>
                    <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#1e1b4b', display: 'flex', alignItems: 'center', gap: 10 }}>
                        {isEdit ? <Pencil size={20} color="#7c3aed" /> : <Plus size={20} color="#7c3aed" />}
                        {isEdit ? `Edit Rule: ${editingRule.name}` : 'Create New Rule'}
                    </h2>
                    <button type="button" onClick={onClose}
                        style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex' }}><X size={24} /></button>
                </div>

                {errors._general && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <AlertTriangle size={16} /> {errors._general}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={lbl}>Rule Name *</label>
                            <input value={form.name} onChange={set('name')} style={inp('name')} placeholder="e.g. Budget Strict Match" />
                        </div>
                        <div>
                            <label style={lbl}>Description</label>
                            <textarea value={form.description || ''} onChange={set('description')} rows={1} style={{ ...inp('description'), resize: 'none' }} placeholder="What does this rule do?" />
                            <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Lightbulb size={12} /> Make it clear for other admins.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={lbl}>Rule Type *</label>
                            <select value={form.ruleType} onChange={handleRuleTypeChange} style={inp('ruleType')}>
                                <option value="HARD_CONSTRAINT">HARD_CONSTRAINT</option>
                                <option value="SOFT_PREFERENCE">SOFT_PREFERENCE</option>
                            </select>
                        </div>
                        <div>
                            <label style={lbl}>Weight Adjustment</label>
                            <input type="number" step="0.1" value={form.weightAdjustment} onChange={set('weightAdjustment')} style={inp('weightAdjustment')} placeholder="e.g. 2.0" />
                            <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Scale size={12} /> Boost or Penalty
                            </p>
                        </div>
                        <div>
                            <label style={lbl}>Priority</label>
                            <input type="number" value={form.priority} onChange={set('priority')} style={inp('priority')} />
                        </div>
                        <div>
                            <label style={lbl}>Status</label>
                            <select value={form.ruleStatus} onChange={set('ruleStatus')} style={inp('ruleStatus')}>
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={lbl}>Target Scope *</label>
                            <select value={form.targetScope} onChange={set('targetScope')} style={inp('targetScope')}>
                                <option value="GLOBAL">GLOBAL (All products)</option>
                                <option value="CATEGORY">CATEGORY (Specific category)</option>
                            </select>
                        </div>
                        <div>
                            <label style={lbl}>Target Category</label>
                            <select
                                disabled={form.targetScope !== 'CATEGORY'}
                                value={form.targetCategoryName || ''}
                                onChange={set('targetCategoryName')}
                                style={{ ...inp('targetCategoryName'), opacity: form.targetScope !== 'CATEGORY' ? 0.5 : 1 }}
                            >
                                <option value="">Select category...</option>
                                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={lbl}>Combination Type *</label>
                            <select value={form.combinationType} onChange={set('combinationType')} style={inp('combinationType')}>
                                <option value="ALL">ALL (All match)</option>
                                <option value="ANY">ANY (Any match)</option>
                                <option value="NONE">NONE (Dynamic)</option>
                            </select>
                        </div>
                    </div>

                    {form.combinationType !== 'NONE' && (
                        <div style={{ marginTop: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ ...lbl, margin: 0 }}>Conditions *</label>
                                <button type="button" onClick={addCondition} style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: 6, background: 'rgba(139,92,246,0.15)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.3)', cursor: 'pointer', fontWeight: 600 }}>+ Add</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {form.conditions.map((cond, index) => (
                                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1.2fr 1.5fr auto', gap: 8, alignItems: 'center', background: '#f5f3ff', padding: 10, borderRadius: 8, position: 'relative', zIndex: 500 - index }}>
                                        <select value={cond.operandSource} onChange={(e) => updateCondition(index, 'operandSource', e.target.value)} style={inp()}>
                                            <option value="PRODUCT">PRODUCT</option>
                                            <option value="USER_INPUT">USER_INPUT</option>
                                        </select>
                                        <select value={cond.attributeName} onChange={(e) => updateCondition(index, 'attributeName', e.target.value)} style={inp()}>
                                            <option value="">Attribute...</option>
                                            {(cond.operandSource === 'USER_INPUT' ? USER_INPUT_ATTRIBUTES : PRODUCT_ATTRIBUTES).map(attr => (
                                                <option key={attr} value={attr}>{attr}</option>
                                            ))}
                                        </select>
                                        <select value={cond.operator} onChange={(e) => updateCondition(index, 'operator', e.target.value)} style={inp()}>
                                            {OPERATORS.map(op => <option key={op} value={op}>{op}</option>)}
                                        </select>
                                        <input value={cond.expectedValue} onChange={(e) => updateCondition(index, 'expectedValue', e.target.value)} style={inp()} placeholder="Value" />
                                        <button type="button" onClick={() => removeCondition(index)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}><X size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 16 }}>
                        <button type="button" onClick={onClose} style={{ padding: '10px 22px', borderRadius: 8, background: '#f5f3ff', border: '1.5px solid #ddd6fe', color: '#6b7280', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                        <button type="submit" disabled={submitting} style={{ padding: '10px 28px', borderRadius: 8, background: 'linear-gradient(135deg, #6c63ff, #a855f7)', border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                            {submitting ? 'Saving...' : (isEdit ? 'Update Rule' : 'Create Rule')}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

function EffectBadge({ effectType }) {
    if (!effectType) return <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>—</span>;
    return (
        <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 600, background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
            {effectType}
        </span>
    );
}

export default function AdminRules({ embedded = false, externalShowToast } = {}) {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    const [rules, setRules] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRule, setEditingRule] = useState(null);
    const [deletingRule, setDeletingRule] = useState(null);
    const [toast, setToast] = useState({ msg: '', isError: false });

    const internalShowToast = useCallback((msg, isError = false) => {
        setToast({ msg, isError });
        setTimeout(() => setToast({ msg: '', isError: false }), 4000);
    }, []);

    const showToast = embedded && externalShowToast ? externalShowToast : internalShowToast;

    const openCreate = () => { setEditingRule(null); setShowModal(true); };
    const openEdit = (rule) => { setEditingRule(rule); setShowModal(true); };
    const closeModal = () => { setShowModal(false); setEditingRule(null); };

    useEffect(() => {
        if (!isAdmin) { navigate('/login'); return; }
        let cancelled = false;
        ruleService.getAllRules().then(data => { if (!cancelled) setRules(Array.isArray(data) ? data : []); }).finally(() => setLoading(false));
        catalogService.getCategories().then(data => { if (!cancelled) setCategories(Array.isArray(data) ? data : []); });
        return () => { cancelled = true; };
    }, [isAdmin, navigate]);

    const handleFormSuccess = useCallback((msg, updatedRule, isEdit, ruleId) => {
        showToast(msg);
        if (isEdit) setRules(prev => prev.map(r => r.id === ruleId ? updatedRule : r));
        else setRules(prev => [...prev, updatedRule]);
    }, [showToast]);

    const handleToggle = async (rule) => {
        const newStatus = rule.ruleStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        try {
            const updated = await ruleService.updateRule(rule.id, { ...rule, ruleStatus: newStatus });
            setRules(prev => prev.map(r => r.id === updated.id ? updated : r));
        } catch { showToast('Failed to toggle status.', true); }
    };

    const handleDelete = async (rule) => {
        setDeletingRule(rule);
    };

    const confirmDelete = async () => {
        const target = deletingRule;
        setDeletingRule(null);
        try {
            await ruleService.deleteRule(target.id);
            setRules(prev => prev.filter(r => r.id !== target.id));
            showToast('Rule deleted successfully.');
        } catch { showToast('Failed to delete.', true); }
    };

    const content = (
        <>
            {!embedded && <Toast toast={toast} />}
            {deletingRule && <ConfirmDialog rule={deletingRule} onConfirm={confirmDelete} onCancel={() => setDeletingRule(null)} />}
            {showModal && <RuleFormModal editingRule={editingRule} categories={categories} onClose={closeModal} onSuccess={handleFormSuccess} />}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
                <div className="panel-header" style={{ marginBottom: 0 }}>
                    <p className="panel-label">Recommendation Logic</p>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Zap size={32} color="#7c3aed" /> Rule Management
                    </h1>
                    <p className="panel-desc">Configure dynamic boosting and filtering logic for the engine.</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    {!embedded && (
                        <button className="admin-btn-secondary" onClick={() => navigate('/admin/history')} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <History size={16} /> Rec. History
                        </button>
                    )}
                    <button className="admin-btn-primary" onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Plus size={18} /> Add New Rule
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginBottom: 32 }}>
                {[
                    { icon: <Zap size={24} />, label: 'Active Rules', value: rules.filter(r => r.ruleStatus === 'ACTIVE').length, color: '#7c3aed' },
                    { icon: <Settings size={24} />, label: 'Total Defined', value: rules.length, color: '#6b7280' },
                    { icon: <AlertTriangle size={24} />, label: 'Critical Filters', value: rules.filter(r => r.ruleType === 'HARD_CONSTRAINT').length, color: '#dc2626' },
                ].map(s => (
                    <div key={s.label} className="admin-card stat-card" style={{ padding: '1.25rem' }}>
                        <div className="stat-accent-bar" style={{ background: s.color }} />
                        <div style={{ color: s.color, marginBottom: 8, opacity: 0.8 }}>{s.icon}</div>
                        <div className="stat-value" style={{ color: s.color, fontSize: '1.8rem' }}>{loading ? '—' : s.value}</div>
                        <div className="stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="admin-card" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #ede9fe', background: '#fcfaff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '1rem' }}>Active Rules</h2>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{rules.length} total</span>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>
                ) : rules.length === 0 ? (
                    <div style={{ padding: '4rem', textAlign: 'center', color: '#9ca3af' }}>
                        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                            <Settings size={48} color="#ddd6fe" />
                        </div>
                        <p style={{ fontWeight: 600, color: '#64748b' }}>No rules created yet.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Rule Name</th>
                                    <th>Type</th>
                                    <th>Effect</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...rules].sort((a, b) => b.priority - a.priority).map((r) => (
                                    <tr key={r.id}>
                                        <td style={{ fontWeight: 600, color: '#1e1b4b' }}>
                                            {r.name}
                                            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 400, marginTop: 4 }}>
                                                {r.description}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="admin-badge" style={{ background: r.ruleType === 'HARD_CONSTRAINT' ? 'rgba(220,38,38,0.1)' : 'rgba(124,58,237,0.1)', color: r.ruleType === 'HARD_CONSTRAINT' ? '#dc2626' : '#7c3aed' }}>
                                                {r.ruleType === 'HARD_CONSTRAINT' ? 'CONSTRAINT' : `PREF (×${r.weightAdjustment})`}
                                            </span>
                                        </td>
                                        <td><EffectBadge effectType={r.effectType} /></td>
                                        <td style={{ fontWeight: 700, color: '#6b7280' }}>{r.priority}</td>
                                        <td>
                                            <button onClick={() => handleToggle(r)} title="Toggle status"
                                                style={{
                                                    padding: '4px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', border: 'none',
                                                    background: r.ruleStatus === 'ACTIVE' ? 'rgba(5,150,105,0.1)' : 'rgba(220,38,38,0.1)',
                                                    color: r.ruleStatus === 'ACTIVE' ? '#059669' : '#dc2626',
                                                    display: 'flex', alignItems: 'center', gap: 4
                                                }}>
                                                {r.ruleStatus === 'ACTIVE' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                                {r.ruleStatus === 'ACTIVE' ? 'Active' : 'Disabled'}
                                            </button>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button onClick={() => openEdit(r)} title="Edit Rule" style={{ padding: '6px', borderRadius: 8, cursor: 'pointer', background: 'rgba(124,58,237,0.1)', border: '1.5px solid rgba(124,58,237,0.2)', color: '#7c3aed', display: 'flex' }}><Pencil size={16} /></button>
                                                <button onClick={() => handleDelete(r)} title="Delete Rule" style={{ padding: '6px', borderRadius: 8, cursor: 'pointer', background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.2)', color: '#ef4444', display: 'flex' }}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );

    if (embedded) return <div className="admin-panel-enter">{content}</div>;

    return (
        <div className="light-theme" style={{ minHeight: '100vh', background: 'var(--bg-color)', padding: '7rem 1.5rem 3rem', position: 'relative' }}>
            <div style={{ maxWidth: 1300, margin: '0 auto' }}>
                {content}
            </div>
        </div>
    );
}
