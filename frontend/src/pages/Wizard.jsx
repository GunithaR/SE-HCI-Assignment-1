import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import catalogService from '../services/catalogService';
import { toAbsoluteImageUrl } from '../utils/imageUtils';
import './Wizard.css';

/* ── Background Images ───────────────────────────────────────── */
import bgCategory from '../assets/Recommendation Section - Category.png';
import bgQ1 from '../assets/Recommendation Section - Q1.png';
import bgQ2 from '../assets/Recommendation Section - Q2.png';
import bgQ3 from '../assets/Recommendation Section - Q3.png';
import bgQ4 from '../assets/Recommendation Section - Q4.png';
import bgQ5 from '../assets/Recommendation Section - Q5.png';
import bgResults from '../assets/Recommendation Section - Results.png';

/* ── Category Images ─────────────────────────────────────────── */
import imgRoofing from '../assets/roofing image.png';
import imgFlooring from '../assets/flooring.png';
import imgWall from '../assets/wall.png';
import imgCeiling from '../assets/ceiling.png';
import imgAccessories from '../assets/accessories.png';

/* ── Helper: Remove Emojis ───────────────────────────────────── */
const stripEmojis = (str) => {
  if (typeof str !== 'string') return str;
  // This regex covers most common emoji ranges
  return str.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F3FB}-\u{1F3FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu, '').trim();
};

const BG_IMAGES = [bgQ1, bgQ2, bgQ3, bgQ4, bgQ5];

/* ── Category metadata ───────────────────────────────────────── */
const CATEGORY_META = {
  'Roofing Solution': { img: imgRoofing, desc: 'Tiles, sheets, and protective coatings for your roof' },
  'Flooring Solution': { img: imgFlooring, desc: 'Durable and stylish options for every floor' },
  'Wall Solution': { img: imgWall, desc: 'Panels, cladding, and finishes for walls' },
  'Ceiling Solution': { img: imgCeiling, desc: 'Suspended, false, and decorative ceiling systems' },
  'Accessories': { img: imgAccessories, desc: 'Fasteners, sealants, and essential add-ons' },
};

/* ── SVG Icons ───────────────────────────────────────────────── */
const OPTION_ICONS = [
  // Home
  (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  // Layers
  (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
  // Grid
  (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>,
  // Settings
  (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
  // Star
  (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  // Shield
  (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
];

const CheckSvg = () => (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const ArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a4455" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
);

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
);

const ResultIcon = ({ color = '#4a4455' }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
);

const CategoryIcon = ({ color = '#630ed4' }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
);

const QuestionMarkIcon = ({ color = '#44474e' }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
);

/* ── Helper: extract label from question ID or text ──────────── */
function extractLabel(text, questionId) {
  // 1. Try question ID first (most reliable)
  if (questionId) {
    const idMap = {
      'flooring_usage': 'USAGE', 'usage': 'USAGE', 'roofing_usage': 'USAGE', 'wall_usage': 'USAGE', 'ceiling_usage': 'USAGE',
      'traffic': 'TRAFFIC', 'foot_traffic': 'TRAFFIC',
      'climate': 'CLIMATE', 'climate_zone': 'CLIMATE',
      'budget': 'BUDGET', 'budget_range': 'BUDGET',
      'style': 'STYLE', 'design_style': 'STYLE',
      'priority': 'PRIORITY', 'main_priority': 'PRIORITY',
      'moisture': 'MOISTURE', 'moisture_level': 'MOISTURE',
      'slip_resistance': 'SAFETY', 'safety': 'SAFETY',
      'location': 'LOCATION', 'area': 'AREA',
      'finish': 'FINISH', 'material': 'MATERIAL',
      'color': 'COLOR', 'size': 'SIZE',
      'durability': 'DURABILITY', 'purpose': 'PURPOSE',
      'concern': 'CONCERN', 'aesthetic': 'AESTHETIC',
      'environment': 'ENVIRONMENT', 'space': 'SPACE',
    };
    const idLower = questionId.toLowerCase();
    if (idMap[idLower]) return idMap[idLower];
    // Try partial match on ID
    for (const [key, label] of Object.entries(idMap)) {
      if (idLower.includes(key)) return label;
    }
  }
  // 2. Fallback to keyword matching on question text
  if (!text) return 'Q';
  const lower = text.toLowerCase();
  const kwMap = [
    ['climate', 'CLIMATE'], ['traffic', 'TRAFFIC'], ['budget', 'BUDGET'],
    ['style', 'STYLE'], ['usage', 'USAGE'], ['moisture', 'MOISTURE'],
    ['location', 'LOCATION'], ['purpose', 'PURPOSE'], ['finish', 'FINISH'],
    ['material', 'MATERIAL'], ['color', 'COLOR'], ['type', 'TYPE'],
    ['size', 'SIZE'], ['durability', 'DURABILITY'], ['environment', 'ENVIRONMENT'],
    ['area', 'AREA'], ['space', 'SPACE'], ['aesthetic', 'AESTHETIC'],
    ['concern', 'CONCERN'], ['priority', 'PRIORITY'], ['slip', 'SAFETY'],
    ['resistance', 'SAFETY'],
  ];
  for (const [kw, label] of kwMap) {
    if (lower.includes(kw)) return label;
  }
  // 3. Fallback: use a meaningful word from the question
  const words = text.replace(/[?.,!]/g, '').split(' ').filter(w => w.length > 3 && !['will', 'what', 'which', 'where', 'does', 'have', 'your', 'the', 'this', 'that', 'been', 'being'].includes(w.toLowerCase()));
  return words.length > 0 ? words[words.length - 1].toUpperCase().slice(0, 8) : 'Q';
}

/* ══════════════════════════════════════════════════════════════
   STRATEGY DISPLAY NAMES
   ══════════════════════════════════════════════════════════════ */
const STRATEGY_META = {
  BUDGET: { label: 'Budget', icon: null },
  ENVIRONMENT: { label: 'Environment', icon: null },
  PERFORMANCE: { label: 'Performance', icon: null },
  STYLE: { label: 'Style', icon: null },
  MAINTENANCE: { label: 'Maintenance', icon: null },
  USAGE: { label: 'Usage', icon: null },
};

const scoreColor = (s) => s >= 8 ? '#16a34a' : s >= 5 ? '#d97706' : '#dc2626';

/* ══════════════════════════════════════════════════════════════
   SCORE RING (SVG radial)
   ══════════════════════════════════════════════════════════════ */
function ScoreRing({ score, max = 10 }) {
  const r = 27, c = 2 * Math.PI * r;
  const pct = Math.min(score / max, 1);
  const dash = c * pct;
  const color = scoreColor(score);
  return (
    <div className="score-ring-wrap">
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle className="score-ring-bg" cx="32" cy="32" r={r} />
        <circle className="score-ring-fg" cx="32" cy="32" r={r}
          stroke={color} strokeDasharray={`${dash} ${c - dash}`} />
      </svg>
      <div className="score-ring-text">
        <span className="ring-val" style={{ color }}>{score.toFixed(1)}</span>
        <span className="ring-max">/{max}</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   WHY-CHECK SVG (purple check icon from Figma)
   ══════════════════════════════════════════════════════════════ */
const WhyCheckIcon = () => (
  <svg className="why-check" width="18" height="15" viewBox="0 0 18 15" fill="none">
    <rect width="18" height="15" rx="7.5" />
    <path d="M5 7.5l2.5 2.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   RESULT CARD (Figma horizontal layout)
   ══════════════════════════════════════════════════════════════ */
function ResultCard({ product, rank, isSelected, onToggleSelect }) {
  const {
    productName, brandName, basePrice, totalScore, strategyScores,
    tradeOffs, excluded, ruleAdjustment, appliedRuleNames, excludedByRules, imageUrl,
  } = product;



  const resolvedImageUrl = toAbsoluteImageUrl(imageUrl);

  // Split explanation into bullets
  const rawExplanation = product.explanation || 'This product is recommended based on your preferences.';
  const explanation = stripEmojis(rawExplanation);
  const bullets = explanation.split(/(?<=\.)\s+/).filter(s => s.trim().length > 3).slice(0, 4);

  const isTop = rank === 1 && !excluded;

  return (
    <div className={`result-card${isTop ? ' top-pick' : ''}${excluded ? ' excluded' : ''}`}>
      {/* Image section */}
      <div className="result-card-image">
        {resolvedImageUrl ? (
          <img
            src={resolvedImageUrl}
            alt={productName}
            onError={(e) => {
              // If the upload route isn't publicly served, this will error and we fall back to placeholder.
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="image-placeholder">No image</div>
        )}
        <div className={`result-rank-badge${isTop ? ' top' : ''}`}>
          {isTop ? '#1 Top Pick' : `#${rank}`}
        </div>
      </div>

      {/* Compare checkbox */}
      {!excluded ? (
        <div className="result-compare-check">
          <input type="checkbox" checked={isSelected} onChange={onToggleSelect}
            title="Select for comparison" />
        </div>
      ) : (
  <div className="result-excluded-badge">Excluded</div>
      )}

      {/* Content section */}
      <div className="result-card-content">
        {/* Name + Price */}
        <div className="result-card-top">
          <div>
            <h3 className="result-card-name">{stripEmojis(productName)}</h3>
            {brandName && <div className="result-card-brand">{stripEmojis(brandName)}</div>}
          </div>
          {basePrice && (
            <div className="result-card-price">
              <span className="price-val">Rs. {Number(basePrice).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Scores */}
        {totalScore !== undefined && (
          <div className="result-scores">
            <ScoreRing score={totalScore} />
            <div className="score-pills">
              {strategyScores && Object.entries(strategyScores).map(([key, val]) => {
        const meta = STRATEGY_META[key] || { label: key, icon: null };
                return (
                  <div key={key} className="score-pill">
          {meta.icon ? <span className="pill-icon">{meta.icon}</span> : null}
                    <span className="pill-label">{meta.label}</span>
                    <span className="pill-val" style={{ color: scoreColor(val) }}>{val.toFixed(1)}/10</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Why Recommended */}
        <div className="result-why-header">Why this is recommended</div>
        <div className="result-why-list">
          {bullets.map((b, i) => (
            <div key={i} className="result-why-item">
              <WhyCheckIcon />
              <span>{b}</span>
            </div>
          ))}
        </div>

        {/* Trade-offs */}
        {tradeOffs && tradeOffs.length > 0 && (
          <div className="result-tradeoffs">
            <h4>Trade-offs</h4>
            {tradeOffs.map((t, i) => <p key={i}>{t}</p>)}
          </div>
        )}

        {/* Rule adjustments */}
        {!excluded && appliedRuleNames && appliedRuleNames.length > 0 && (
          <div className="result-rules">
            <h4>Rule Adjustments</h4>
            <div className="rule-adj" style={{ color: ruleAdjustment > 0 ? '#16a34a' : ruleAdjustment < 0 ? '#dc2626' : '#7c7589' }}>
              {ruleAdjustment > 0 ? '+' : ''}{ruleAdjustment?.toFixed(1)} pts
            </div>
            {appliedRuleNames.map((n, i) => <p key={i}>{n}</p>)}
          </div>
        )}

        {/* Excluded reasons */}
        {excluded && excludedByRules && excludedByRules.length > 0 && (
          <div className="result-tradeoffs">
            <h4>Excluded Reasons</h4>
            {excludedByRules.map((r, i) => <p key={i}>{r}</p>)}
          </div>
        )}

        {/* View Details */}
        <Link to={`/product/${product.productId}`} className="result-view-btn" style={{ alignSelf: 'flex-start', marginTop: '12px' }}>
          View Details
        </Link>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   COMPARISON PANEL (Purple-themed modal)
   ══════════════════════════════════════════════════════════════ */
function ComparisonPanel({ data, onClose }) {
  const { products, comparativeNarrative, fallbackUsed } = data;
  const allAttributes = new Set();
  const required = ['Durability', 'Maintenance Level', 'Climate Suitability'];
  products.forEach(p => {
    if (p.attributes && Array.isArray(p.attributes)) p.attributes.forEach(a => allAttributes.add(a.attributeName));
  });
  required.forEach(a => allAttributes.add(a));
  const attrs = Array.from(allAttributes).sort();
  const getVal = (p, name) => { const a = p.attributes?.find(x => x.attributeName === name); return a ? a.value : 'N/A'; };
  const show = (name) => products.some(p => getVal(p, name) !== 'N/A');

  return (
    <div className="comparison-overlay" onClick={onClose}>
      <div className="comparison-modal" onClick={e => e.stopPropagation()}>
        <div className="comparison-modal-header">
          <h2>Product Comparison</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {fallbackUsed && <span className="fallback-pill" style={{ background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '9999px', fontSize: '.75rem', fontWeight: 700 }}>Fallback</span>}
            <button className="modal-close" onClick={onClose} aria-label="Close">Close</button>
          </div>
        </div>
        {comparativeNarrative && (
          <div className="comparison-narrative"><p>{stripEmojis(comparativeNarrative)}</p></div>
        )}
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="attr-col">Attribute</th>
                {products.map((p, i) => <th key={i} className="product-col">{stripEmojis(p.productName)}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr><td className="attr-col"><strong>Price (LKR)</strong></td>
                {products.map((p, i) => <td key={i} className="product-col">{p.basePrice ? Number(p.basePrice).toLocaleString() : 'N/A'}</td>)}
              </tr>
              <tr><td className="attr-col"><strong>Brand</strong></td>
                {products.map((p, i) => <td key={i} className="product-col">{p.brandName || 'N/A'}</td>)}
              </tr>
              <tr><td className="attr-col"><strong>Total Score</strong></td>
                {products.map((p, i) => <td key={i} className="product-col">{p.totalScore != null ? p.totalScore.toFixed(1) : 'N/A'}</td>)}
              </tr>
              {attrs.map(name => show(name) ? (
                <tr key={name}><td className="attr-col"><strong>{name}</strong></td>
                  {products.map((p, i) => <td key={i} className="product-col">{getVal(p, name)}</td>)}
                </tr>
              ) : null)}
            </tbody>
          </table>
        </div>
        <div className="comparison-modal-footer">
          <button className="res-btn outline" onClick={onClose} style={{ padding: '10px 28px', borderRadius: '9999px', border: '2px solid #630ed4', background: 'transparent', color: '#630ed4', fontWeight: 700, cursor: 'pointer' }}>
            ← Back to Results
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ANSWER CHIPS BAR (horizontal pill strip)
   ══════════════════════════════════════════════════════════════ */
function AnswerChips({ answers, visibleQuestions, selectedCategory }) {
  return (
    <div className="results-answer-chips">
      <div className="answer-chip-pill">
        <span className="chip-key">Category</span>
        <span className="chip-val">{selectedCategory}</span>
      </div>
      {visibleQuestions.map(q => {
        if (answers[q.id] === undefined) return null;
        const label = extractLabel(q.question, q.id);
        const opt = q.options.find(o => o.value === answers[q.id]);
        const val = opt ? opt.label : answers[q.id];
        return (
          <div key={q.id} className="answer-chip-pill">
            <span className="chip-key">{label}</span>
            <span className="chip-val">{stripEmojis(val)}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   RESULTS VIEW (inline within wizard)
   ══════════════════════════════════════════════════════════════ */
function ResultsView({ resultsData, answers, visibleQuestions, selectedCategory, onTryAgain }) {
  const navigate = useNavigate();
  const { products = [], additionalInsights = [], augmentationFallbackUsed = false } = resultsData;

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [comparisonData, setComparisonData] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [compareError, setCompareError] = useState(null);
  const [showComparison, setShowComparison] = useState(false);

  const toggleSelect = (id) => {
    const s = new Set(selectedIds);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelectedIds(s);
  };

  const handleCompare = async () => {
    setCompareError(null);
    if (selectedIds.size < 2) { setCompareError('Select at least 2 products'); return; }
    setComparisonLoading(true);
    try {
      const sel = products.filter(p => selectedIds.has(p.productId));
      const result = await catalogService.compareRecommendations({ selectedProductIds: Array.from(selectedIds), recommendations: sel });
      setComparisonData(result);
      setShowComparison(true);
    } catch (e) {
      setCompareError(e.response?.data?.message || 'Failed to compare');
    } finally {
      setComparisonLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setComparisonData(null);
    setShowComparison(false);
    setCompareError(null);
  };

  if (products.length === 0) {
    return (
      <div className="results-inner">
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h2 style={{ color: '#1a1b23', marginBottom: '1rem' }}>No Results Found</h2>
          <p style={{ color: '#4a4455' }}>Try adjusting your preferences for better matches.</p>
          <button
            onClick={onTryAgain}
            style={{
              marginTop: '1.5rem',
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              color: '#fff',
              border: '1.5px solid #fff',
              borderRadius: 48,
              padding: '15px 36px',
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'transform 0.2s, background 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
          >
            ← Try Different Options
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="results-inner">
      {/* Answer Chips */}
      <AnswerChips answers={answers} visibleQuestions={visibleQuestions} selectedCategory={selectedCategory} />

      {/* Compare banner */}
      {selectedIds.size === 0 && !showComparison && (
        <div className="compare-banner">
          <span className="compare-banner-icon">Compare</span>
          <div className="compare-banner-text">
            <h3>Compare Products</h3>
            <p>Select 2 or more products using the checkboxes to compare them side-by-side, including price, durability, maintenance, and more!</p>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showComparison && comparisonData && (
        <ComparisonPanel data={comparisonData} onClose={() => setShowComparison(false)} />
      )}

      {/* Header */}
      <div className="results-page-header">
        <h1>Best Match for You</h1>
        <p className="results-subtitle">{selectedCategory} — {products.length} products ranked by our AI scoring engine</p>
      </div>

      {/* Result Cards */}
      <div className="results-grid">
        {products.map((p, i) => (
          <ResultCard key={p.productId} product={p} rank={i + 1}
            isSelected={selectedIds.has(p.productId)}
            onToggleSelect={() => toggleSelect(p.productId)} />
        ))}
      </div>

      {/* Compare toolbar */}
      {selectedIds.size > 0 && !showComparison && (
        <div className="compare-toolbar">
          <div className="toolbar-info">
            <span className="selected-count">{selectedIds.size} product{selectedIds.size !== 1 ? 's' : ''} selected</span>
          </div>
          <div className="toolbar-actions">
            {compareError && <span className="toolbar-error">{compareError}</span>}
            <button className="toolbar-btn primary" onClick={handleCompare} disabled={comparisonLoading}>
              {comparisonLoading ? 'Comparing...' : 'Compare Selected'}
            </button>
            <button className="toolbar-btn secondary" onClick={clearSelection} disabled={comparisonLoading}>Clear</button>
          </div>
        </div>
      )}

      {/* Additional Insights */}
      {additionalInsights.length > 0 && !showComparison && (
        <div className="results-insights">
          <div className="insights-head">
            <h3>Additional Insights</h3>
            {augmentationFallbackUsed && <span className="fallback-pill">Rule-based fallback</span>}
          </div>
          {additionalInsights.map((ins, i) => (
            <div key={i} className="insight-row">
              <p className="insight-title">{stripEmojis(ins.title)}</p>
              <p className="insight-detail">{stripEmojis(ins.detail)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="results-footer">
        <button
          onClick={onTryAgain}
          style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            color: '#fff',
            border: '1.5px solid #fff',
            borderRadius: 48,
            padding: '15px 36px',
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'transform 0.2s, background 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
        >
          ← Try Different Options
        </button>
        <Link to="/catalog" className="res-btn filled">Browse Full Catalog →</Link>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   STEP INDICATOR
   ══════════════════════════════════════════════════════════════ */
function StepIndicator({ visibleQuestions, currentIndex, answers, isReviewStep, isResultsStep = false }) {
  const steps = [
    { label: 'CATEGORY', state: 'done' },
    ...visibleQuestions.map((q, i) => ({
      label: extractLabel(q.question, q.id),
      state: answers[q.id] !== undefined
        ? (i < currentIndex || isReviewStep || isResultsStep ? 'done' : (i === currentIndex ? 'active' : 'done'))
        : (i === currentIndex ? 'active' : 'pending'),
      code: `Q${i + 1}`,
    })),
    { label: 'RESULTS', state: isResultsStep ? 'active' : (isReviewStep ? 'active' : 'pending'), isResult: true },
  ];

  return (
    <div className="wizard-steps">
      {steps.map((step, i) => (
        <div key={i} className="wizard-step-item">
          {step.state === 'done' ? (
            <div className="wizard-step-circle done"><CheckSvg /></div>
          ) : step.state === 'active' ? (
            <div className="wizard-step-circle active">
              {step.isResult ? <ResultIcon color="#ede0ff" /> : step.code || '●'}
            </div>
          ) : (
            <div className={`wizard-step-circle ${step.isResult ? 'result' : 'pending'}`}>
              {step.isResult ? <ResultIcon /> : step.code}
            </div>
          )}
          <span className={`wizard-step-label ${step.state}`}>{step.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   OPTION CARD
   ══════════════════════════════════════════════════════════════ */
function OptionCard({ option, selected, onClick, index }) {
  const IconFn = OPTION_ICONS[index % OPTION_ICONS.length];
  const iconColor = selected ? '#ede0ff' : '#4a4455';

  return (
    <button className={`wizard-opt-card${selected ? ' selected' : ''}`} onClick={onClick}>
      {selected && <div className="opt-check"><CheckSvg /></div>}
      <div className="opt-icon-bg">{IconFn(iconColor)}</div>
      <div className="opt-title">{stripEmojis(option.label)}</div>
      {option.desc && <div className="opt-desc">{stripEmojis(option.desc)}</div>}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════
   ANSWERS SIDEBAR
   ══════════════════════════════════════════════════════════════ */
function AnswersSidebar({ visibleQuestions, answers, onEdit, selectedCategory }) {
  return (
    <div className="wizard-sidebar">
      <div className="wizard-sidebar-header">
        <div className="wizard-sidebar-title">Material Guide</div>
        <div className="wizard-sidebar-sub">Project Selection</div>
      </div>
      <div className="wizard-sidebar-items">
        {/* Category — always answered */}
        <div className="sidebar-item-answered">
          <div className="si-left">
            <CategoryIcon color="#630ed4" />
            <span className="si-label">Category: {selectedCategory}</span>
          </div>
        </div>

        {visibleQuestions.map((q, i) => {
          const answered = answers[q.id] !== undefined;
          const label = extractLabel(q.question, q.id);
          const selectedOpt = answered ? q.options.find(o => o.value === answers[q.id]) : null;
          const ansText = selectedOpt ? selectedOpt.label : answers[q.id];

          if (answered) {
            return (
              <div key={q.id} className="sidebar-item-answered">
                <div className="si-left">
                  <CategoryIcon color="#630ed4" />
                  <span className="si-label">{label}: {stripEmojis(ansText)}</span>
                </div>
                <button className="si-edit" onClick={() => onEdit(q.id)}>Edit</button>
              </div>
            );
          }
          return (
            <div key={q.id} className="sidebar-item-pending">
              <QuestionMarkIcon color="#44474e" />
              <span className="si-label">{label}: Not set</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   WIZARD MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function Wizard() {
  const navigate = useNavigate();

  /* State */
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [resultsData, setResultsData] = useState(null);
  const [startedAt, setStartedAt] = useState(null);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  /* Load categories on mount */
  useEffect(() => {
    catalogService
      .getQuestionCategories()
      .then((cats) => { setCategories(cats); setLoading(false); })
      .catch(() => { setError('Failed to load categories. Is the backend running?'); setLoading(false); });
  }, []);

  /* Load questions when category selected */
  const selectCategory = useCallback(async (cat) => {
    setSelectedCategory(cat);
    setStartedAt(Date.now());
    setLoading(true);
    setError(null);
    try {
      const data = await catalogService.getQuestions(cat);
      setQuestions(data.questions || []);
      setCurrentQuestionId((data.questions && data.questions.length > 0) ? data.questions[0].id : null);
      setAnswers({});
    } catch {
      setError('Failed to load questions for this category.');
    } finally {
      setLoading(false);
    }
  }, []);

  /* Select an option */
  const selectOption = (questionId, value) => {
    setAnswers((prev) => {
      if (prev[questionId] === value) return prev;
      const next = { ...prev, [questionId]: value };
      const qIndex = questions.findIndex((q) => q.id === questionId);
      if (qIndex !== -1) {
        for (let i = qIndex + 1; i < questions.length; i++) delete next[questions[i].id];
      }
      return next;
    });
  };

  /* Dynamic Navigation Flow */
  const visibleQuestions = useMemo(() => {
    return questions.filter((q) => {
      const qText = q.question?.toLowerCase() || '';
      if (qText.includes('moisture') || q.id === 'moisture') {
        const hasCoastal = Object.values(answers).some(
          (val) => typeof val === 'string' && val.toLowerCase() === 'coastal'
        );
        if (!hasCoastal) return false;
      }
      if (qText.includes('budget') || q.id === 'budget') {
        const hasLowCost = Object.values(answers).some(
          (val) => typeof val === 'string' && val.toLowerCase() === 'low cost'
        );
        if (!hasLowCost) return false;
      }
      if (typeof q.condition === 'function') return q.condition(answers);
      return true;
    });
  }, [questions, answers]);

  /* Derived */
  const isCategoryStep = !selectedCategory;
  const currentQ = useMemo(() => {
    if (isCategoryStep || visibleQuestions.length === 0) return null;
    const q = visibleQuestions.find((q) => q.id === currentQuestionId);
    return q || visibleQuestions[0];
  }, [isCategoryStep, visibleQuestions, currentQuestionId]);

  const currentIndex = currentQ ? visibleQuestions.findIndex((q) => q.id === currentQ.id) : -1;
  const totalSteps = visibleQuestions.length;
  const currentAnswer = currentQ ? answers[currentQ.id] : null;
  const isReviewStep = totalSteps > 0 && visibleQuestions.every((q) => answers[q.id] !== undefined) && currentQuestionId === null && !resultsData;
  const isResultsStep = !!resultsData;

  /* Navigation */
  const goNext = () => {
    if (currentIndex === -1) return;
    const allAnswered = visibleQuestions.every((q) => answers[q.id] !== undefined);
    if (allAnswered) {
      setCurrentQuestionId(null);
    } else if (currentIndex < totalSteps - 1) {
      setCurrentQuestionId(visibleQuestions[currentIndex + 1].id);
    }
  };

  const goBack = () => {
    if (isReviewStep) {
      setCurrentQuestionId(visibleQuestions[visibleQuestions.length - 1].id);
    } else if (currentIndex > 0) {
      setCurrentQuestionId(visibleQuestions[currentIndex - 1].id);
    } else {
      setSelectedCategory(null);
      setCurrentQuestionId(null);
      setQuestions([]);
      setAnswers({});
    }
  };

  const handleEdit = (questionId) => {
    setCurrentQuestionId(questionId);
    setMobileSheetOpen(false);
  };

  /* Submit */
  const handleSubmit = async () => {
    const cleanAnswers = {};
    visibleQuestions.forEach((q) => {
      if (answers[q.id] !== undefined) cleanAnswers[q.id] = answers[q.id];
    });
    setSubmitting(true);
    setError(null);
    try {
      const payload = { category: selectedCategory, answers: cleanAnswers, startedAt };
      const hybrid = await catalogService.getHybridRecommendations(payload);
      setResultsData({
        products: hybrid.recommendations || [],
        additionalInsights: hybrid.additionalInsights || [],
        augmentationFallbackUsed: !!hybrid.fallbackUsed,
      });
      setSubmitting(false);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to get recommendations.');
      setSubmitting(false);
    }
  };

  /* Try different options — reset to category */
  const handleTryAgain = () => {
    setResultsData(null);
    setSelectedCategory(null);
    setCurrentQuestionId(null);
    setQuestions([]);
    setAnswers({});
  };

  /* Background image */
  const bgImage = isResultsStep
    ? bgResults
    : isCategoryStep
      ? bgCategory
      : BG_IMAGES[Math.min(currentIndex >= 0 ? currentIndex : 0, BG_IMAGES.length - 1)];

  /* ── Loading ───────────────────────────────────────────────── */
  if (loading && categories.length === 0) {
    return (
      <div className="wizard-page" style={{ backgroundImage: `url(${bgCategory})` }}>
        <div className="wizard-page-inner">
          <div className="wizard-loading-wrap">
            <div className="wizard-spinner" />
            <p style={{ color: '#4a4455', fontWeight: 500 }}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Sidebar content (reused in mobile sheet) ──────────────── */
  const sidebarContent = !isCategoryStep && visibleQuestions.length > 0 && (
    <AnswersSidebar
      visibleQuestions={visibleQuestions}
      answers={answers}
      onEdit={handleEdit}
      selectedCategory={selectedCategory}
    />
  );

  return (
    <div className="wizard-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="wizard-page-inner">

        {/* Error */}
        {error && (
          <div className="wizard-error-box">
            {error}
          </div>
        )}

        {/* ═══ CATEGORY SELECTION (full width, no sidebar) ═══ */}
        {isCategoryStep && (
          <div className="wizard-fade-in">
            <div className="wizard-question-panel full-width">
              <h1 className="wizard-q-heading">What type of product are you looking for?</h1>
              <p className="wizard-q-subtext">Choose a product category to get personalized recommendations</p>
              <div className="wizard-options-grid category-grid">
                {categories.map((cat) => {
                  const meta = CATEGORY_META[cat] || {};
                  return (
                    <button
                      key={cat}
                      className="wizard-opt-card category-card"
                      onClick={() => selectCategory(cat)}
                    >
                      {meta.img && <img className="cat-img" src={meta.img} alt={cat} />}
                      <div className="opt-title">{stripEmojis(cat)}</div>
                      {meta.desc && <div className="opt-desc">{stripEmojis(meta.desc)}</div>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══ RESULTS STEP (inline results view) ═══ */}
        {isResultsStep && (
          <>
            <StepIndicator
              visibleQuestions={visibleQuestions}
              currentIndex={-1}
              answers={answers}
              isReviewStep={false}
              isResultsStep={true}
            />
            <ResultsView
              resultsData={resultsData}
              answers={answers}
              visibleQuestions={visibleQuestions}
              selectedCategory={selectedCategory}
              onTryAgain={handleTryAgain}
            />
          </>
        )}

        {/* ═══ QUESTION STEPS (step indicator + two panels) ═══ */}
        {!isCategoryStep && !loading && !isResultsStep && (
          <>
            {/* Step Indicator */}
            <StepIndicator
              visibleQuestions={visibleQuestions}
              currentIndex={currentIndex}
              answers={answers}
              isReviewStep={isReviewStep}
            />

            <div className="wizard-layout">
              {/* Left: Question Panel */}
              <div className="wizard-question-panel">

                {/* ── Active Question ──────────────────── */}
                {currentQ && !isReviewStep && (
                  <div className="wizard-fade-in" key={currentQ.id}>
                    <h1 className="wizard-q-heading">{stripEmojis(currentQ.question)}</h1>
                    {currentQ.subtext && <p className="wizard-q-subtext">{stripEmojis(currentQ.subtext)}</p>}
                    <div className="wizard-options-grid">
                      {currentQ.options.map((opt, idx) => (
                        <OptionCard
                          key={opt.value}
                          option={opt}
                          selected={currentAnswer === opt.value}
                          onClick={() => selectOption(currentQ.id, opt.value)}
                          index={idx}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Review Step ──────────────────────── */}
                {isReviewStep && (
                  <div className="wizard-fade-in">
                    <h1 className="wizard-q-heading">Review Your Answers</h1>
                    <p className="wizard-q-subtext">Please review your selections before getting recommendations.</p>
                    <div className="wizard-review-list">
                      {visibleQuestions.filter(q => answers[q.id] !== undefined).map((q) => {
                        const selOpt = q.options.find(o => o.value === answers[q.id]);
                        const ansLabel = selOpt ? selOpt.label : answers[q.id];
                        return (
                          <div key={q.id} className="wizard-review-item">
                            <div>
                              <div className="wizard-review-q">{stripEmojis(q.question)}</div>
                              <div className="wizard-review-a">{stripEmojis(ansLabel)}</div>
                            </div>
                            <button
                              className="wizard-review-edit"
                              onClick={() => handleEdit(q.id)}
                              disabled={submitting}
                            >
                              Edit
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── Navigation Buttons ───────────────── */}
                <div className="wizard-nav-footer">
                  <button className="wizard-nav-btn back-btn" onClick={goBack} disabled={submitting}>
                    <ArrowLeft /> Back
                  </button>
                  {isReviewStep ? (
                    <button className="wizard-nav-btn next-btn" onClick={handleSubmit} disabled={submitting}>
                      {submitting ? (
                        <><span className="wizard-spinner-sm" /> Getting Results...</>
                      ) : (
                        <>Get Recommendations <ArrowRight /></>
                      )}
                    </button>
                  ) : (
                    <button className="wizard-nav-btn next-btn" onClick={goNext} disabled={!currentAnswer}>
                      {visibleQuestions.every((q) => answers[q.id] !== undefined) ? 'Review Answers' : 'Next Step'}
                      <ArrowRight />
                    </button>
                  )}
                </div>
              </div>

              {/* Right: Sidebar (desktop only) */}
              {sidebarContent}
            </div>

            {/* Mobile: floating toggle + bottom sheet */}
            {!isCategoryStep && (
              <>
                <button
                  className="mobile-sidebar-toggle"
                  onClick={() => setMobileSheetOpen(true)}
                >
                  View Answers
                </button>

                <div
                  className={`mobile-sheet-overlay${mobileSheetOpen ? ' open' : ''}`}
                  onClick={() => setMobileSheetOpen(false)}
                >
                  <div className="mobile-sheet" onClick={e => e.stopPropagation()}>
                    <div className="mobile-sheet-handle" />
                    {sidebarContent}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Loading within question flow */}
        {!isCategoryStep && loading && (
          <div className="wizard-loading-wrap">
            <div className="wizard-spinner" />
            <p style={{ color: '#4a4455', fontWeight: 500 }}>Loading questions...</p>
          </div>
        )}
      </div>
    </div>
  );
}