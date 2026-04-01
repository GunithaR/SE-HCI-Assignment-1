import { useLocation, useNavigate, Link } from 'react-router-dom';

/* ───────────────── Strategy display names & colors ─────────────────────── */
const STRATEGY_META = {
  BUDGET: { label: 'Budget', color: '#22c55e', icon: '💰' },
  ENVIRONMENT: { label: 'Environment', color: '#3b82f6', icon: '🌍' },
  PERFORMANCE: { label: 'Performance', color: '#f59e0b', icon: '⚡' },
  STYLE: { label: 'Style', color: '#ec4899', icon: '🎨' },
  MAINTENANCE: { label: 'Maintenance', color: '#8b5cf6', icon: '🔧' },
  USAGE: { label: 'Usage', color: '#14b8a6', icon: '🏠' },
};

const scoreColor = (score) => {
  if (score >= 8) return '#22c55e';
  if (score >= 5) return '#f59e0b';
  return '#ef4444';
};

/* ───────────────── Results page ────────────────────────────────────────── */
export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [compareError, setCompareError] = useState(null);

  if (!state?.products || state.products.length === 0) {
    return (
      <div className="results-container">
        <div className="results-empty">
          <h2>No Results Found</h2>
          <p>Try adjusting your preferences for better matches.</p>
          <Link to="/wizard" className="results-btn primary">
            ← Back to Wizard
          </Link>
        </div>
        <ResultsStyles />
      </div>
    );
  }

  const { products, category, answers } = state;

  const toggleSelection = (productId) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
    setComparisonData(null);
    setCompareError(null);
  };

  const buildComparisonInput = (selectedIds) => {
    const selectedProducts = products.filter((p) => selectedIds.includes(p.productId));
    return {
      selectedProductIds: selectedIds,
      recommendations: selectedProducts.map((p) => ({
        productId: p.productId,
        productName: p.productName,
        brandName: p.brandName,
        categoryName: p.categoryName,
        basePrice: p.basePrice,
        imageUrl: p.imageUrl,
        totalScore: p.totalScore,
        strategyScores: p.strategyScores || {},
        matchedRuleNames: p.matchedRuleNames || [],
        tradeOffs: p.tradeOffs || [],
      })),
    };
  };

  const extractApiErrorMessage = (error) => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.fieldErrors) {
      const errors = Object.entries(error.response.data.fieldErrors)
        .map(([field, msg]) => `${field}: ${msg}`)
        .join(' | ');
      return errors;
    }
    if (typeof error.response?.data === 'object') {
      const errors = Object.entries(error.response.data)
        .map(([k, v]) => `${k}: ${v}`)
        .join(' | ');
      return errors;
    }
    return error.response?.data || error.message || 'Unknown error';
  };

  const runComparison = async () => {
    setComparisonLoading(true);
    setCompareError(null);
    setComparisonData(null);
    try {
      const payload = buildComparisonInput(selectedProductIds);
      const result = await catalogService.compareRecommendations(payload);
      setComparisonData(result);
    } catch (error) {
      const errorMsg = extractApiErrorMessage(error);
      setCompareError(errorMsg);
    } finally {
      setComparisonLoading(false);
    }
  };

  const clearComparison = () => {
    setSelectedProductIds([]);
    setComparisonData(null);
    setCompareError(null);
  };

  return (
    <div className="results-container">
      <div className="results-content">
        {/* ── Header ──────────────────────────────────── */}
        <div className="results-header">
          <h1>🏆 Your Top Recommendations</h1>
          <p className="results-subtitle">
            {category} — {products.length} products ranked by our AI scoring engine
          </p>
        </div>

        {/* ── Comparison Toolbar ──────────────────────── */}
        {selectedProductIds.length > 0 && (
          <div className="comparison-toolbar">
            <span className="comparison-info">
              {selectedProductIds.length} product{selectedProductIds.length !== 1 ? 's' : ''} selected
              {selectedProductIds.length < 2 && <span className="hint-text"> (select at least 2 to compare)</span>}
            </span>
            <div className="comparison-buttons">
              <button
                className="compare-btn primary"
                onClick={runComparison}
                disabled={selectedProductIds.length < 2 || comparisonLoading}
              >
                {comparisonLoading ? '⏳ Comparing...' : '⚖️ Compare Selected'}
              </button>
              <button
                className="compare-btn secondary"
                onClick={clearComparison}
              >
                ✕ Clear
              </button>
            </div>
          </div>
        )}

        {/* ── Comparison Error ───────────────────────── */}
        {compareError && (
          <div className="comparison-error">
            <span>❌ Error: {compareError}</span>
          </div>
        )}

        {/* ── Comparison Results ─────────────────────── */}
        {comparisonData && (
          <ComparisonPanel data={comparisonData} selectedIds={selectedProductIds} />
        )}

        {/* ── Rankings ────────────────────────────────── */}
        <div className="results-grid">
          {products.map((product, idx) => (
            <ProductCard
              key={product.productId}
              product={product}
              rank={idx + 1}
              isSelected={selectedProductIds.includes(product.productId)}
              onToggleSelection={() => toggleSelection(product.productId)}
            />
          ))}
        </div>

        {/* ── Answer Summary ──────────────────────────── */}
        {answers && Object.keys(answers).length > 0 && (
          <div className="answers-summary">
            <h3>📝 Your Selections</h3>
            <div className="answers-grid">
              {Object.entries(answers).map(([key, val]) => (
                <div key={key} className="answer-chip">
                  <span className="answer-key">{key.replace(/_/g, ' ')}</span>
                  <span className="answer-val">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Footer ─────────────────────────────────── */}
        <div className="results-footer">
          <button className="results-btn secondary" onClick={() => navigate('/wizard')}>
            ← Try Different Options
          </button>
          <Link to="/catalog" className="results-btn primary">
            Browse Full Catalog →
          </Link>
        </div>
      </div>

      <ResultsStyles />
    </div>
  );
}

/* ───────────────── Product Card ────────────────────────────────────────── */
function ProductCard({ product, rank, isSelected, onToggleSelection }) {
  const {
    productName,
    brandName,
    basePrice,
    totalScore,
    strategyScores,
    tradeOffs,
    explanation,
  } = product;

  const maxScore = 10;

  return (
    <div className={`product-card${rank === 1 ? ' top-pick' : ''}${isSelected ? ' selected' : ''}`}>
      {rank === 1 && <div className="top-badge">⭐ Top Pick</div>}

      {/* Header */}
      <div className="card-header">
        <div className="card-rank">#{rank}</div>
        <div className="card-info">
          <div className="card-title-row">
            <h3 className="card-name">{productName}</h3>
            <div className="card-selection-inline">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={onToggleSelection}
                id={`check-${productId}`}
              />
              <label htmlFor={`check-${productId}`} className="checkbox-label">
                Compare
              </label>
            </div>
          </div>
          {brandName && <span className="card-brand">{brandName}</span>}
        </div>
        <div className="card-score" style={{ borderColor: scoreColor(totalScore) }}>
          <span className="score-val">{totalScore.toFixed(1)}</span>
          <span className="score-label">/ {maxScore}</span>
        </div>
      </div>

      {/* Price */}
      {basePrice && (
        <div className="card-price">
          Rs. {Number(basePrice).toLocaleString()}
        </div>
      )}

      {/* Strategy scores */}
      {strategyScores && Object.keys(strategyScores).length > 0 && (
        <div className="score-breakdown">
          <h4>Score Breakdown</h4>
          {Object.entries(strategyScores).map(([key, val]) => {
            const meta = STRATEGY_META[key] || { label: key, color: '#999', icon: '📊' };
            const pct = (val / maxScore) * 100;
            return (
              <div key={key} className="score-row">
                <span className="score-label-left">
                  {meta.icon} {meta.label}
                </span>
                <div className="score-bar-track">
                  <div
                    className="score-bar-fill"
                    style={{ width: `${pct}%`, background: meta.color }}
                  />
                </div>
                <span className="score-value" style={{ color: scoreColor(val) }}>
                  {val.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Trade-offs */}
      {tradeOffs && tradeOffs.length > 0 && (
        <div className="trade-offs">
          <h4>⚠️ Trade-offs</h4>
          {tradeOffs.map((t, i) => (
            <p key={i} className="trade-off-item">{t}</p>
          ))}
        </div>
      )}

      {/* Explanation */}
      {explanation && <p className="card-explanation">{explanation}</p>}
    </div>
  );
}

/* ───────────────── Comparison Panel ────────────────────────────────────── */
function ComparisonPanel({ data, selectedIds }) {
  if (!data?.products || data.products.length === 0) {
    return null;
  }

  const products = data.products;
  // Normalize attributes so we can read both array and object payload shapes.
  const normalizedAttributesByProduct = new Map();
  products.forEach((p) => {
    const normalized = new Map();
    if (Array.isArray(p.attributes)) {
      p.attributes.forEach((a) => {
        const key = a?.attributeName;
        const value = a?.value;
        if (!key) return;
        normalized.set(key, value);
      });
    } else if (p.attributes && typeof p.attributes === 'object') {
      Object.entries(p.attributes).forEach(([key, value]) => {
        if (!key) return;
        normalized.set(key, value);
      });
    }
    normalizedAttributesByProduct.set(p.productId, normalized);
  });

  // Collect all unique attributes from all compared products (preserves first-seen order).
  const attributeOrder = [];
  const attributeSet = new Set();
  normalizedAttributesByProduct.forEach((attrMap) => {
    attrMap.forEach((_, name) => {
      if (attributeSet.has(name)) return;
      attributeSet.add(name);
      attributeOrder.push(name);
    });
  });

  const requiredAttributeAliases = {
    Durability: ['Durability'],
    'Maintenance Level': ['Maintenance Level', 'Maintenance'],
    'Climate Suitability': ['Climate Suitability', 'Climate'],
  };

  const shownAliasNames = new Set(
    Object.values(requiredAttributeAliases).flat()
  );

  const extraAttributes = attributeOrder.filter((name) => !shownAliasNames.has(name));

  const getAttributeValue = (product, candidateNames) => {
    const attrMap = normalizedAttributesByProduct.get(product?.productId);
    if (!attrMap) return 'N/A';
    for (const candidate of candidateNames) {
      const foundValue = attrMap.get(candidate);
      if (foundValue != null && String(foundValue).trim() !== '') {
        return foundValue;
      }
    }
    return 'N/A';
  };

  const hasAnyValueForAliases = (candidateNames) =>
    products.some((p) => getAttributeValue(p, candidateNames) !== 'N/A');

  return (
    <div className="comparison-panel">
      <div className="comparison-header">
        <h2>⚖️ Side-by-Side Comparison</h2>
        {data.fallbackUsed && <span className="fallback-badge">⚠️ Fallback Comparison</span>}
      </div>
      <p className="comparison-subtitle">
        Compare each product by all available attributes.
      </p>

      {/* Comparison Table */}
      <div className="comparison-table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Attribute</th>
              {products.map((p) => (
                <th key={p.productId} className="product-column">
                  <div className="product-header">
                    <strong>{p.productName}</strong>
                    <p className="product-brand">{p.brandName}</p>
                    <p className="product-price">Rs. {Number(p.basePrice).toLocaleString()}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="attribute-name">Price (LKR)</td>
              {products.map((p) => (
                <td key={`${p.productId}-price`} className="attribute-value">
                  {p.basePrice != null ? Number(p.basePrice).toLocaleString() : 'N/A'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="attribute-name">Brand</td>
              {products.map((p) => (
                <td key={`${p.productId}-brand`} className="attribute-value">
                  {p.brandName || 'N/A'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="attribute-name">Category</td>
              {products.map((p) => (
                <td key={`${p.productId}-category`} className="attribute-value">
                  {p.categoryName || 'N/A'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="attribute-name">Total Score</td>
              {products.map((p) => (
                <td key={`${p.productId}-score`} className="attribute-value">
                  {typeof p.totalScore === 'number' ? p.totalScore.toFixed(2) : 'N/A'}
                </td>
              ))}
            </tr>

            {Object.entries(requiredAttributeAliases)
              .filter(([, aliases]) => hasAnyValueForAliases(aliases))
              .map(([rowLabel, aliases]) => (
                <tr key={`required-${rowLabel}`}>
                  <td className="attribute-name">{rowLabel}</td>
                  {products.map((p) => (
                    <td key={`${p.productId}-${rowLabel}`} className="attribute-value">
                      {getAttributeValue(p, aliases)}
                    </td>
                  ))}
                </tr>
              ))}

            {/* Attributes Rows */}
            {extraAttributes.length > 0 ? (
              extraAttributes.map((attributeName, idx) => (
                <tr key={`attr-${attributeName}-${idx}`}>
                  <td className="attribute-name">{attributeName}</td>
                  {products.map((p) => {
                    const attrMap = normalizedAttributesByProduct.get(p.productId);
                    const rawValue = attrMap ? attrMap.get(attributeName) : null;
                    return (
                      <td key={`${p.productId}-${idx}`} className="attribute-value">
                        {rawValue != null && String(rawValue).trim() !== '' ? rawValue : 'N/A'}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={products.length + 1} className="attribute-name">
                  No attributes available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Narrative */}
      {data.comparativeNarrative && (
        <div className="comparison-narrative">
          <h3>📝 Comparative Analysis</h3>
          <p>{data.comparativeNarrative}</p>
        </div>
      )}
    </div>
  );
}

/* ───────────────── Styles ──────────────────────────────────────────────── */
function ResultsStyles() {
  return (
    <style>{`
      .results-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
        padding: 2rem;
      }
      .results-content {
        max-width: 1000px;
        margin: 0 auto;
      }
      .results-header {
        text-align: center;
        margin-bottom: 2.5rem;
        padding-top: 1rem;
      }
      .results-header h1 {
        color: #fff;
        font-size: 2rem;
        margin: 0 0 .5rem;
      }
      .results-subtitle {
        color: rgba(255,255,255,.5);
        font-size: 1rem;
      }
      .results-empty {
        text-align: center;
        color: #fff;
        padding: 4rem 2rem;
      }
      .results-empty p { color: rgba(255,255,255,.5); margin: 1rem 0 2rem; }

      /* ── Comparison Toolbar ───────────────────── */
      .comparison-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(99,102,241,.1);
        border: 1px solid rgba(99,102,241,.3);
        border-radius: 12px;
        padding: 1rem 1.5rem;
        margin-bottom: 1.5rem;
      }
      .comparison-info {
        color: #a5b4fc;
        font-weight: 600;
        font-size: .95rem;
      }
      .hint-text { color: rgba(255,255,255,.5); font-weight: 400; font-size: .85rem; }
      .comparison-buttons {
        display: flex;
        gap: .75rem;
      }
      .compare-btn {
        padding: .5rem 1.2rem;
        border: none;
        border-radius: 8px;
        font-size: .85rem;
        font-weight: 600;
        cursor: pointer;
        transition: all .2s;
      }
      .compare-btn.primary {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: #fff;
      }
      .compare-btn.primary:hover:not(:disabled) {
        box-shadow: 0 4px 15px rgba(99,102,241,.4);
        transform: translateY(-1px);
      }
      .compare-btn.primary:disabled {
        opacity: .5;
        cursor: not-allowed;
      }
      .compare-btn.secondary {
        background: rgba(255,255,255,.08);
        color: rgba(255,255,255,.6);
      }
      .compare-btn.secondary:hover {
        background: rgba(255,255,255,.12);
      }

      /* ── Comparison Error ──────────────────────– */
      .comparison-error {
        background: rgba(239,68,68,.1);
        border: 1px solid rgba(239,68,68,.3);
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 1.5rem;
        color: #fca5a5;
        font-size: .95rem;
      }

      /* ── Comparison Panel ──────────────────────– */
      .comparison-panel {
        background: rgba(255,255,255,.06);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 16px;
        padding: 1.5rem;
        margin-bottom: 2rem;
      }
      .comparison-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }
      .comparison-header h2 {
        color: #fff;
        font-size: 1.3rem;
        margin: 0;
      }
      .comparison-subtitle {
        color: rgba(255,255,255,.72);
        margin: 0 0 1rem;
        font-size: .9rem;
      }
      .fallback-badge {
        background: rgba(251,146,60,.2);
        border: 1px solid rgba(251,146,60,.4);
        color: #fed7aa;
        padding: .3rem .8rem;
        border-radius: 8px;
        font-size: .8rem;
        font-weight: 600;
      }

      /* ── Comparison Table ──────────────────────– */
      .comparison-table-wrapper {
        overflow-x: auto;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,.1);
        margin-bottom: 1.5rem;
      }
      .comparison-table {
        width: 100%;
        border-collapse: collapse;
        background: rgba(255,255,255,.02);
      }
      .comparison-table th {
        background: rgba(255,255,255,.08);
        border-bottom: 2px solid rgba(99,102,241,.3);
        padding: 1rem;
        text-align: left;
        color: #fff;
        font-weight: 600;
        font-size: .9rem;
        white-space: nowrap;
      }
      .comparison-table td {
        padding: 1rem;
        border-bottom: 1px solid rgba(255,255,255,.05);
        color: rgba(255,255,255,.82);
        font-size: .9rem;
      }
      .comparison-table tbody tr:nth-child(even) {
        background: rgba(255,255,255,.02);
      }
      .comparison-table tbody tr:hover {
        background: rgba(165,180,252,.08);
      }
      .attribute-name {
        font-weight: 600;
        color: #dbe3ff;
        background: rgba(255,255,255,.04);
        width: 150px;
        position: sticky;
        left: 0;
        z-index: 1;
      }
      .attribute-value {
        color: #c7d2fe;
      }
      .product-column {
        background: rgba(99,102,241,.1) !important;
      }
      .product-header {
        text-align: center;
      }
      .product-header strong {
        display: block;
        color: #fff;
        margin-bottom: .3rem;
      }
      .product-brand {
        color: rgba(255,255,255,.5);
        font-size: .8rem;
        margin: .2rem 0;
      }
      .product-price {
        color: #22c55e;
        font-weight: 600;
        margin: .2rem 0 0;
      }
      .strategy-section-header {
        background: rgba(139,92,246,.1);
      }
      .strategy-section-header td {
        font-weight: 600;
        color: #c4b5fd;
        padding: .8rem 1rem;
        border-top: 2px solid rgba(139,92,246,.3);
      }
      .score-cell {
        text-align: center;
        font-weight: 600;
      }

      @media (max-width: 768px) {
        .comparison-panel {
          padding: 1rem;
        }
        .comparison-table th,
        .comparison-table td {
          padding: .7rem;
          font-size: .82rem;
        }
        .comparison-header {
          align-items: flex-start;
          gap: .5rem;
          flex-direction: column;
        }
      }

      /* ── Comparison Narrative ──────────────────– */
      .comparison-narrative {
        background: rgba(59,130,246,.08);
        border: 1px solid rgba(59,130,246,.2);
        border-radius: 12px;
        padding: 1.2rem;
      }
      .comparison-narrative h3 {
        color: #fff;
        font-size: .95rem;
        margin: 0 0 .8rem;
      }
      .comparison-narrative p {
        color: rgba(255,255,255,.8);
        font-size: .9rem;
        line-height: 1.6;
        margin: 0;
      }

      /* ── Grid ─────────────────────────────────── */
      .results-grid { display: flex; flex-direction: column; gap: 1.5rem; }

      /* ── Card ─────────────────────────────────── */
      .product-card {
        background: rgba(255,255,255,.06);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 20px;
        padding: 1.5rem;
        transition: transform .2s, box-shadow .2s, border-color .2s;
        position: relative;
      }
      .product-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 40px rgba(0,0,0,.35);
      }
      .product-card.top-pick {
        border-color: rgba(99,102,241,.5);
        box-shadow: 0 0 30px rgba(99,102,241,.15);
      }
      .product-card.selected {
        border-color: rgba(34,197,94,.5);
        box-shadow: 0 0 30px rgba(34,197,94,.15);
      }

      /* ── Selection Checkbox ────────────────────– */
      .card-selection-inline {
        display: flex;
        align-items: center;
        gap: .5rem;
        flex-shrink: 0;
      }
      .card-selection-inline input[type="checkbox"] {
        width: 18px;
        height: 18px;
        cursor: pointer;
        accent-color: #22c55e;
      }
      .checkbox-label {
        font-size: .75rem;
        color: rgba(255,255,255,.5);
        cursor: pointer;
      }

      .top-badge {
        display: inline-block;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: #fff;
        font-size: .75rem;
        font-weight: 700;
        padding: .3rem .8rem;
        border-radius: 8px;
        margin-bottom: .75rem;
      }
      .card-header { display: flex; align-items: center; gap: 1rem; }
      .card-rank {
        font-size: 1.4rem;
        font-weight: 800;
        color: rgba(255,255,255,.3);
        min-width: 2rem;
      }
      .card-info { flex: 1; }
      .card-title-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: .75rem;
      }
      .card-name { color: #fff; font-size: 1.2rem; margin: 0; }
      .card-brand { color: rgba(255,255,255,.4); font-size: .85rem; }
      .card-score {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 2px solid;
        border-radius: 14px;
        padding: .4rem .9rem;
      }
      .score-val { color: #fff; font-size: 1.4rem; font-weight: 700; line-height: 1; }
      .score-label { color: rgba(255,255,255,.4); font-size: .7rem; }

      .card-price {
        color: #22c55e;
        font-weight: 700;
        font-size: 1.05rem;
        margin: .75rem 0 0;
      }

      /* ── Score breakdown ───────────────────────– */
      .score-breakdown {
        margin-top: 1rem;
        padding-top: .75rem;
        border-top: 1px solid rgba(255,255,255,.08);
      }
      .score-breakdown h4 {
        color: rgba(255,255,255,.6);
        font-size: .8rem;
        text-transform: uppercase;
        letter-spacing: .05em;
        margin: 0 0 .5rem;
      }
      .score-row {
        display: flex;
        align-items: center;
        gap: .5rem;
        margin-bottom: .35rem;
      }
      .score-label-left {
        color: rgba(255,255,255,.7);
        font-size: .8rem;
        width: 110px;
        flex-shrink: 0;
      }
      .score-bar-track {
        flex: 1;
        height: 6px;
        background: rgba(255,255,255,.08);
        border-radius: 3px;
        overflow: hidden;
      }
      .score-bar-fill {
        height: 100%;
        border-radius: 3px;
        transition: width .6s ease;
      }
      .score-value { font-size: .8rem; font-weight: 600; width: 2.5rem; text-align: right; }

      /* ── Trade-offs ────────────────────────────– */
      .trade-offs {
        margin-top: .75rem;
        background: rgba(239,68,68,.08);
        border: 1px solid rgba(239,68,68,.2);
        border-radius: 12px;
        padding: .75rem 1rem;
      }
      .trade-offs h4 {
        color: #fca5a5;
        font-size: .8rem;
        margin: 0 0 .4rem;
      }
      .trade-off-item {
        color: rgba(255,255,255,.6);
        font-size: .8rem;
        margin: .2rem 0;
      }

      .card-explanation {
        color: rgba(255,255,255,.5);
        font-size: .85rem;
        margin: .75rem 0 0;
        font-style: italic;
      }

      /* ── Answer Summary ────────────────────────– */
      .answers-summary {
        margin-top: 2.5rem;
        background: rgba(255,255,255,.04);
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 16px;
        padding: 1.5rem;
      }
      .answers-summary h3 { color: #fff; font-size: 1rem; margin: 0 0 1rem; }
      .answers-grid {
        display: flex;
        flex-wrap: wrap;
        gap: .5rem;
      }
      .answer-chip {
        display: flex;
        gap: .5rem;
        align-items: center;
        background: rgba(255,255,255,.06);
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 10px;
        padding: .4rem .8rem;
        font-size: .8rem;
      }
      .answer-key {
        color: rgba(255,255,255,.4);
        text-transform: capitalize;
      }
      .answer-val {
        color: #a5b4fc;
        font-weight: 600;
        text-transform: capitalize;
      }

      /* ── Footer ────────────────────────────────– */
      .results-footer {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 2.5rem;
        padding-bottom: 2rem;
      }
      .results-btn {
        padding: .75rem 1.5rem;
        border-radius: 12px;
        border: none;
        font-weight: 600;
        font-size: .95rem;
        cursor: pointer;
        transition: all .2s;
        text-decoration: none;
      }
      .results-btn.primary {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: #fff;
      }
      .results-btn.primary:hover {
        box-shadow: 0 4px 20px rgba(99,102,241,.4);
        transform: translateY(-1px);
      }
      .results-btn.secondary {
        background: rgba(255,255,255,.08);
        color: rgba(255,255,255,.7);
      }
      .results-btn.secondary:hover { background: rgba(255,255,255,.14); }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  );
}
