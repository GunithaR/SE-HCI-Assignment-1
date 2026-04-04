import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import catalogService from '../services/catalogService';

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

  const [selectedProductIds, setSelectedProductIds] = useState(new Set());
  const [comparisonData, setComparisonData] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [compareError, setCompareError] = useState(null);
  const [showComparison, setShowComparison] = useState(false);

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
  const additionalInsights = state?.additionalInsights || [];
  const augmentationFallbackUsed = Boolean(state?.augmentationFallbackUsed);

  const toggleProductSelection = (productId) => {
    const updated = new Set(selectedProductIds);
    if (updated.has(productId)) {
      updated.delete(productId);
    } else {
      updated.add(productId);
    }
    setSelectedProductIds(updated);
  };

  const handleCompare = async () => {
    setCompareError(null);
    if (selectedProductIds.size < 2) {
      setCompareError('Please select at least 2 products to compare');
      return;
    }

    setComparisonLoading(true);
    try {
      // Send full product data along with IDs
      const selectedProducts = products.filter(p => selectedProductIds.has(p.productId));
      const payload = {
        selectedProductIds: Array.from(selectedProductIds),
        recommendations: selectedProducts
      };
      const result = await catalogService.compareRecommendations(payload);
      setComparisonData(result);
      setShowComparison(true);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 
                       error.response?.data?.fieldErrors?.selectedProductIds?.[0] ||
                       'Failed to compare products';
      setCompareError(errorMsg);
    } finally {
      setComparisonLoading(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedProductIds(new Set());
    setComparisonData(null);
    setShowComparison(false);
    setCompareError(null);
  };

  return (
    <div className="results-container">
      <div className="results-content">
        {/* ── Header ──────────────────────────────────── */}
        <div className="results-header">
          <h1>🏆 Your Top Recommendations</h1>
          <p className="results-subtitle">
            {category} — {products.length} products ranked by our rule engine
          </p>
        </div>

        {/* ── Additional Insights (separate from rankings) ─────────────── */}
        {additionalInsights.length > 0 && (
          <div className="additional-insights-box">
            <div className="additional-insights-header">
              <h3>Additional Insights</h3>
              {augmentationFallbackUsed && (
                <span className="fallback-badge">Rule-based fallback</span>
              )}
            </div>
            <div className="additional-insights-list">
              {additionalInsights.map((insight, idx) => (
                <div key={`${insight.productId || 'global'}-${idx}`} className="insight-item">
                  <p className="insight-title">{insight.title || 'Additional insight'}</p>
                  <p className="insight-detail">{insight.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Comparison Info Banner ──────────────────── */}
        {selectedProductIds.size === 0 && !showComparison && (
          <div className="comparison-info-banner">
            <div className="banner-content">
              <span className="banner-icon">⚖️</span>
              <div className="banner-text">
                <h3>Compare Products</h3>
                <p>Select 2 or more products using the checkboxes to compare them side-by-side, including price, durability, maintenance, climate suitability, and more!</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Comparison View ─────────────────────────────── */}
        {showComparison && comparisonData && (
          <ComparisonPanel 
            data={comparisonData}
            onClose={() => setShowComparison(false)}
          />
        )}

        {/* ── Comparison Toolbar ──────────────────────── */}
        {selectedProductIds.size > 0 && !showComparison && (
          <div className="comparison-toolbar">
            <div className="toolbar-info">
              <span className="selected-count">
                ✓ {selectedProductIds.size} product{selectedProductIds.size !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="toolbar-actions">
              {compareError && (
                <span className="toolbar-error">⚠️ {compareError}</span>
              )}
              <button 
                className="toolbar-btn primary"
                onClick={handleCompare}
                disabled={comparisonLoading}
              >
                {comparisonLoading ? '⏳ Comparing...' : '⚖️ Compare Selected'}
              </button>
              <button 
                className="toolbar-btn secondary"
                onClick={handleClearSelection}
                disabled={comparisonLoading}
              >
                ✕ Clear
              </button>
            </div>
          </div>
        )}

        {/* ── Rankings ────────────────────────────────── */}
        <div className="results-grid">
          {products.map((product, idx) => (
            <ProductCard 
              key={product.productId} 
              product={product} 
              rank={idx + 1}
              isSelected={selectedProductIds.has(product.productId)}
              onToggleSelect={() => toggleProductSelection(product.productId)}
            />
          ))}
        </div>

        {/* ── Answer Summary ──────────────────────────── */}
        {answers && Object.keys(answers).length > 0 && !showComparison && (
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
function ProductCard({ product, rank, isSelected, onToggleSelect }) {
  const {
    productName,
    brandName,
    basePrice,
    totalScore,
    strategyScores,
    tradeOffs,
    matchedRuleNames,
    productId,
  } = product;

  const [aiExplanation, setAiExplanation] = useState(null);
  const [loadingExplanation, setLoadingExplanation] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchExplanation = async () => {
      try {
        const payload = {
          productId,
          productName,
          score: totalScore,
          matchedRules: matchedRuleNames || [],
          constraintsSatisfied: tradeOffs || [],
          preferenceContributions: strategyScores || {}
        };
        const response = await catalogService.getExplanation(payload);
        if (isMounted) {
          setAiExplanation(response.explanation);
        }
      } catch (error) {
        if (isMounted) {
          setAiExplanation(product.explanation || "This product is recommended based on your preferences.");
        }
      } finally {
        if (isMounted) setLoadingExplanation(false);
      }
    };
    
    fetchExplanation();
    
    return () => { isMounted = false; };
  }, [product, productId, productName, totalScore, matchedRuleNames, tradeOffs, strategyScores]);

  const maxScore = 10;

  return (
    <div className={`product-card${rank === 1 ? ' top-pick' : ''}`}>
      {rank === 1 && <div className="top-badge">⭐ Top Pick</div>}

      {/* Header with checkbox inline */}
      <div className="card-header">
        <input 
          type="checkbox" 
          className="product-checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          title="Select for comparison"
        />
        <div className="card-rank">#{rank}</div>
        <div className="card-info">
          <h3 className="card-name">{productName}</h3>
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
      <div className="card-explanation-box">
        {loadingExplanation ? (
           <p className="loading-text">
             <span className="spinner-sm" style={{ display: 'inline-block', borderColor: 'rgba(255,255,255,0.2)', borderTopColor: '#6366f1', borderWidth: '2px', marginRight: '6px', verticalAlign: 'middle', width: '12px', height: '12px', borderRadius: '50%', animation: 'spin .6s linear infinite' }} /> 
             Generating narrative...
           </p>
        ) : (
           <p className="card-explanation">✨ {aiExplanation}</p>
        )}
      </div>
    </div>
  );
}

/* ───────────────── Comparison Panel ────────────────────────────────────– */
function ComparisonPanel({ data, onClose }) {
  const { products, comparativeNarrative, fallbackUsed } = data;

  // Collect all unique attributes from all products
  const allAttributes = new Set();
  const requiredAttributes = ['Durability', 'Maintenance Level', 'Climate Suitability'];

  products.forEach(p => {
    if (p.attributes && Array.isArray(p.attributes)) {
      p.attributes.forEach(attr => {
        allAttributes.add(attr.attributeName);
      });
    }
  });

  // Ensure required attributes are included
  requiredAttributes.forEach(attr => allAttributes.add(attr));
  const attributesList = Array.from(allAttributes).sort();

  const getAttributeValue = (product, attributeName) => {
    if (!product.attributes) return 'N/A';
    const attr = product.attributes.find(a => a.attributeName === attributeName);
    return attr ? attr.value : 'N/A';
  };

  // Check if all values for an attribute are N/A
  const shouldShowAttribute = (attributeName) => {
    return products.some(p => getAttributeValue(p, attributeName) !== 'N/A');
  };

  return (
    <div className="comparison-modal-overlay" onClick={onClose}>
      <div className="comparison-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="comparison-header">
          <h2>Product Comparison</h2>
          {fallbackUsed && (
            <span className="fallback-badge">⚠️ Fallback summary used</span>
          )}
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Narrative */}
        {comparativeNarrative && (
          <div className="comparison-narrative">
            <p>{comparativeNarrative}</p>
          </div>
        )}

        {/* Comparison Table */}
        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="attr-col">Attribute</th>
                {products.map((p, idx) => (
                  <th key={idx} className="product-col">
                    <div className="product-col-header">
                      <span className="product-col-name">{p.productName}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Fixed rows first */}
              <tr>
                <td className="attr-col"><strong>Price (LKR)</strong></td>
                {products.map((p, idx) => (
                  <td key={idx} className="product-col">
                    {p.basePrice ? Number(p.basePrice).toLocaleString() : 'N/A'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="attr-col"><strong>Brand</strong></td>
                {products.map((p, idx) => (
                  <td key={idx} className="product-col">{p.brandName || 'N/A'}</td>
                ))}
              </tr>
              <tr>
                <td className="attr-col"><strong>Category</strong></td>
                {products.map((p, idx) => (
                  <td key={idx} className="product-col">{p.categoryName || 'N/A'}</td>
                ))}
              </tr>
              <tr>
                <td className="attr-col"><strong>Total Score</strong></td>
                {products.map((p, idx) => (
                  <td key={idx} className="product-col">{p.totalScore !== undefined && p.totalScore !== null ? p.totalScore.toFixed(1) : 'N/A'}</td>
                ))}
              </tr>

              {/* Dynamic attribute rows */}
              {attributesList.map((attrName) => 
                shouldShowAttribute(attrName) ? (
                  <tr key={attrName}>
                    <td className="attr-col"><strong>{attrName}</strong></td>
                    {products.map((p, idx) => (
                      <td key={idx} className="product-col">
                        {getAttributeValue(p, attrName)}
                      </td>
                    ))}
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        </div>

        {/* Close button */}
        <div className="comparison-footer">
          <button className="results-btn secondary" onClick={onClose}>
            ← Back to Results
          </button>
        </div>
      </div>
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
        margin-bottom: 2rem;
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
      .additional-insights-box {
        background: rgba(16,185,129,.12);
        border: 1px solid rgba(16,185,129,.35);
        border-radius: 14px;
        padding: 1rem 1.1rem;
        margin-bottom: 1.5rem;
      }
      .additional-insights-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: .75rem;
        margin-bottom: .65rem;
      }
      .additional-insights-header h3 {
        margin: 0;
        color: #d1fae5;
        font-size: 1rem;
      }
      .additional-insights-list {
        display: grid;
        gap: .65rem;
      }
      .insight-item {
        background: rgba(0,0,0,.18);
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 10px;
        padding: .65rem .75rem;
      }
      .insight-title {
        margin: 0 0 .3rem;
        color: #ecfdf5;
        font-weight: 700;
      }
      .insight-detail {
        margin: 0;
        color: rgba(255,255,255,.82);
        line-height: 1.4;
      }
      .results-empty {
        text-align: center;
        color: #fff;
        padding: 4rem 2rem;
      }
      .results-empty p { color: rgba(255,255,255,.5); margin: 1rem 0 2rem; }

      /* ── Comparison Info Banner ──────────────────────── */
      .comparison-info-banner {
        background: linear-gradient(135deg, rgba(99,102,241,.15), rgba(99,102,241,.08));
        border: 1px solid rgba(99,102,241,.3);
        border-radius: 14px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        animation: slideDown .4s ease-out;
      }
      .banner-content {
        display: flex;
        gap: 1rem;
        align-items: flex-start;
      }
      .banner-icon {
        font-size: 1.8rem;
        flex-shrink: 0;
      }
      .banner-text {
        flex: 1;
      }
      .banner-text h3 {
        color: #a5b4fc;
        font-size: 1.1rem;
        margin: 0 0 .5rem;
        font-weight: 600;
      }
      .banner-text p {
        color: rgba(255,255,255,.7);
        margin: 0;
        font-size: .95rem;
        line-height: 1.5;
      }

      /* ── Comparison Toolbar ──────────────────────── */
      .comparison-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(99,102,241,.15);
        border: 1px solid rgba(99,102,241,.3);
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
      }
      .toolbar-info {
        display: flex;
        align-items: center;
        gap: .5rem;
      }
      .selected-count {
        color: #a5b4fc;
        font-weight: 600;
        padding: .5rem 1rem;
        background: rgba(99,102,241,.2);
        border-radius: 8px;
      }
      .toolbar-actions {
        display: flex;
        align-items: center;
        gap: .5rem;
        flex-wrap: wrap;
      }
      .toolbar-error {
        color: #fca5a5;
        font-size: .9rem;
        padding-right: .5rem;
      }
      .toolbar-btn {
        padding: .6rem 1.2rem;
        border-radius: 8px;
        border: none;
        font-weight: 600;
        font-size: .9rem;
        cursor: pointer;
        transition: all .2s;
      }
      .toolbar-btn.primary {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: #fff;
      }
      .toolbar-btn.primary:hover:not(:disabled) {
        box-shadow: 0 4px 15px rgba(99,102,241,.4);
        transform: translateY(-1px);
      }
      .toolbar-btn.primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .toolbar-btn.secondary {
        background: rgba(255,255,255,.1);
        color: rgba(255,255,255,.8);
      }
      .toolbar-btn.secondary:hover:not(:disabled) { background: rgba(255,255,255,.15); }
      .toolbar-btn.secondary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      /* ── Comparison Modal ────────────────────────── */
      .comparison-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 2rem;
      }
      .comparison-modal {
        background: #1a1a2e;
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 16px;
        max-width: 95vw;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0,0,0,.5);
      }
      .comparison-header {
        position: relative;
        padding: 2rem;
        border-bottom: 1px solid rgba(255,255,255,.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .comparison-header h2 {
        color: #fff;
        font-size: 1.5rem;
        margin: 0;
      }
      .fallback-badge {
        background: #f59e0b;
        color: #fff;
        padding: .4rem .8rem;
        border-radius: 6px;
        font-size: .85rem;
        font-weight: 600;
      }
      .close-btn {
        background: none;
        border: none;
        color: rgba(255,255,255,.6);
        font-size: 1.5rem;
        cursor: pointer;
      }
      .close-btn:hover { color: #fff; }

      .comparison-narrative {
        padding: 1.5rem 2rem;
        border-bottom: 1px solid rgba(255,255,255,.1);
        background: rgba(99,102,241,.08);
      }
      .comparison-narrative p {
        color: rgba(255,255,255,.8);
        margin: 0;
        line-height: 1.5;
        font-size: .95rem;
      }

      .comparison-table-wrapper {
        overflow-x: auto;
        padding: 2rem;
      }
      .comparison-table {
        width: 100%;
        border-collapse: collapse;
        color: #fff;
      }
      .comparison-table thead {
        background: rgba(99,102,241,.2);
        border-bottom: 2px solid rgba(99,102,241,.4);
      }
      .comparison-table th {
        padding: 1rem;
        text-align: left;
        font-weight: 600;
        color: #a5b4fc;
        font-size: .9rem;
      }
      .comparison-table td {
        padding: 1rem;
        border-bottom: 1px solid rgba(255,255,255,.08);
        color: rgba(255,255,255,.8);
      }
      .comparison-table tbody tr:hover {
        background: rgba(99,102,241,.05);
      }
      .attr-col {
        background: rgba(255,255,255,.02);
        font-weight: 600;
        width: 20%;
        min-width: 150px;
      }
      .product-col {
        text-align: center;
        width: 26.6%;
        min-width: 150px;
      }
      .product-col-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: .5rem;
      }
      .product-col-name {
        font-weight: 600;
      }

      .comparison-footer {
        padding: 1.5rem 2rem;
        border-top: 1px solid rgba(255,255,255,.1);
        display: flex;
        justify-content: center;
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
      }
      .product-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 40px rgba(0,0,0,.35);
      }
      .product-card.top-pick {
        border-color: rgba(99,102,241,.5);
        box-shadow: 0 0 30px rgba(99,102,241,.15);
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
      .card-header { 
        display: flex; 
        align-items: center; 
        gap: 1rem; 
        margin-bottom: .75rem;
      }
      .product-checkbox {
        width: 20px;
        height: 20px;
        cursor: pointer;
        accent-color: #6366f1;
        flex-shrink: 0;
      }
      .card-rank {
        font-size: 1.4rem;
        font-weight: 800;
        color: rgba(255,255,255,.3);
        min-width: 2rem;
      }
      .card-info { flex: 1; }
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

      /* ── Score breakdown ───────────────────────── */
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

      /* ── Trade-offs ────────────────────────────── */
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

      .card-explanation-box {
        margin-top: 1rem;
        padding-top: .75rem;
        border-top: 1px solid rgba(255,255,255,.08);
      }
      .card-explanation {
        color: rgba(255,255,255,.8);
        font-size: .85rem;
        margin: 0;
        font-style: italic;
        line-height: 1.4;
      }
      .loading-text {
        color: rgba(255,255,255,.5);
        font-size: .85rem;
        margin: 0;
      }

      /* ── Answer Summary ────────────────────────── */
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

      /* ── Footer ────────────────────────────────── */
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

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
  );
}
