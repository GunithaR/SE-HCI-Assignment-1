import { useLocation, useNavigate, Link } from 'react-router-dom';

const STRATEGY_META = {
  BUDGET: { label: 'Budget', color: 'var(--color-success)', icon: '💰' },
  ENVIRONMENT: { label: 'Environment', color: 'var(--color-info)', icon: '🌍' },
  PERFORMANCE: { label: 'Performance', color: 'var(--color-warning)', icon: '⚡' },
  STYLE: { label: 'Style', color: '#EC4899', icon: '🎨' },
  MAINTENANCE: { label: 'Maintenance', color: 'var(--color-primary)', icon: '🔧' },
  USAGE: { label: 'Usage', color: 'var(--color-accent)', icon: '🏠' },
};

const scoreColor = (score) => {
  if (score >= 8) return 'var(--color-success)';
  if (score >= 5) return 'var(--color-warning)';
  return 'var(--color-error)';
};

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.products || state.products.length === 0) {
    return (
      <div className="page-with-navbar" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', padding: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>
            No Results Found
          </h2>
          <p style={{ color: 'var(--color-muted)', marginBottom: '24px' }}>
            Try adjusting your preferences for better matches.
          </p>
          <Link to="/wizard" className="btn-primary" style={{ textDecoration: 'none' }}>
            ← Back to Wizard
          </Link>
        </div>
      </div>
    );
  }

  const { products, category, answers } = state;

  return (
    <div className="page-with-navbar" style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div className="page-container fade-in-up" style={{ maxWidth: 900 }}>
        {/* ── Header ──── */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>
            🏆 Your Top Recommendations
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '1rem' }}>
            {category} — {products.length} products ranked by our AI scoring engine
          </p>
        </div>

        {/* ── Rankings ──── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {products.map((product, idx) => (
            <ResultCard key={product.productId} product={product} rank={idx + 1} />
          ))}
        </div>

        {/* ── Answer Summary ──── */}
        {answers && Object.keys(answers).length > 0 && (
          <div className="card" style={{ marginTop: '40px', padding: '24px' }}>
            <h3 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text)', marginBottom: '16px' }}>
              📝 Your Selections
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Object.entries(answers).map(([key, val]) => (
                <div key={key} style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  background: 'var(--color-surface-alt)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                }}>
                  <span style={{ color: 'var(--color-muted)', textTransform: 'capitalize' }}>
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 600, textTransform: 'capitalize' }}>
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Footer ──── */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '40px', paddingBottom: '32px' }}>
          <button className="btn-ghost" onClick={() => navigate('/wizard')}>
            ← Try Different Options
          </button>
          <Link to="/catalog" className="btn-primary" style={{ textDecoration: 'none' }}>
            Browse Full Catalog →
          </Link>
        </div>
      </div>
    </div>
  );
}

function ResultCard({ product, rank }) {
  const { productName, brandName, basePrice, totalScore, strategyScores, tradeOffs, explanation } = product;
  const maxScore = 10;

  return (
    <div className="card" style={{ padding: '24px', border: rank === 1 ? '2px solid var(--color-primary)' : undefined }}>
      {rank === 1 && (
        <span className="badge badge-primary" style={{ marginBottom: '12px', display: 'inline-block' }}>
          ⭐ Top Pick
        </span>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-muted)', minWidth: '2rem' }}>
          #{rank}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
            {productName}
          </h3>
          {brandName && <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>{brandName}</span>}
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: `2px solid ${scoreColor(totalScore)}`,
          borderRadius: 'var(--radius-lg)',
          padding: '6px 14px',
        }}>
          <span style={{ color: 'var(--color-text)', fontSize: '1.4rem', fontWeight: 700, lineHeight: 1 }}>
            {totalScore.toFixed(1)}
          </span>
          <span style={{ color: 'var(--color-muted)', fontSize: '0.7rem' }}>/ {maxScore}</span>
        </div>
      </div>

      {/* Price */}
      {basePrice && (
        <div style={{ color: 'var(--color-success)', fontWeight: 700, fontSize: '1.05rem', marginTop: '12px' }}>
          Rs. {Number(basePrice).toLocaleString()}
        </div>
      )}

      {/* Strategy Scores */}
      {strategyScores && Object.keys(strategyScores).length > 0 && (
        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
          <h4 style={{ color: 'var(--color-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Score Breakdown
          </h4>
          {Object.entries(strategyScores).map(([key, val]) => {
            const meta = STRATEGY_META[key] || { label: key, color: 'var(--color-muted)', icon: '📊' };
            const pct = (val / maxScore) * 100;
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem', width: 110, flexShrink: 0 }}>
                  {meta.icon} {meta.label}
                </span>
                <div style={{ flex: 1, height: 6, background: 'var(--color-surface-alt)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: meta.color, borderRadius: 3, transition: 'width 0.6s ease' }} />
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, width: '2.5rem', textAlign: 'right', color: scoreColor(val) }}>
                  {val.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Trade-offs */}
      {tradeOffs && tradeOffs.length > 0 && (
        <div style={{
          marginTop: '12px',
          background: 'var(--color-warning-bg)',
          border: '1px solid rgba(217,119,6,0.15)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
        }}>
          <h4 style={{ color: 'var(--color-warning)', fontSize: '0.82rem', marginBottom: 6 }}>⚠️ Trade-offs</h4>
          {tradeOffs.map((t, i) => (
            <p key={i} style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem', margin: '2px 0' }}>{t}</p>
          ))}
        </div>
      )}

      {/* Explanation */}
      {explanation && (
        <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginTop: '12px', fontStyle: 'italic' }}>
          {explanation}
        </p>
      )}
    </div>
  );
}
