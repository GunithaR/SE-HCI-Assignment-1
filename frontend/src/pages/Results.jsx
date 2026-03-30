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

        {/* ── Rankings ────────────────────────────────── */}
        <div className="results-grid">
          {products.map((product, idx) => (
            <ProductCard key={product.productId} product={product} rank={idx + 1} />
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
function ProductCard({ product, rank }) {
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

      {/* Header */}
      <div className="card-header">
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
        max-width: 900px;
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

      /* ── Grid ─────────────────────────────────── */
      .results-grid { display: flex; flex-direction: column; gap: 1.5rem; }

      /* ── Card ─────────────────────────────────── */
      .product-card {
        background: rgba(255,255,255,.06);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 20px;
        padding: 1.5rem;
        transition: transform .2s, box-shadow .2s;
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
      .card-header { display: flex; align-items: center; gap: 1rem; }
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
    `}</style>
  );
}
