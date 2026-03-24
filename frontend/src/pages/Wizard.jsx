import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import catalogService from '../services/catalogService';

const CATEGORY_ICONS = {
  'Roofing Solution': '🏠',
  'Flooring Solution': '🧱',
  'Wall Solution': '🏗️',
  'Ceiling Solution': '🔲',
  'Accessories': '🔩',
};

export default function Wizard() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    catalogService
      .getQuestionCategories()
      .then((cats) => { setCategories(cats); setLoading(false); })
      .catch(() => { setError('Failed to load categories. Is the backend running?'); setLoading(false); });
  }, []);

  const selectCategory = useCallback(async (cat) => {
    setSelectedCategory(cat);
    setLoading(true);
    setError(null);
    try {
      const data = await catalogService.getQuestions(cat);
      setQuestions(data.questions || []);
      setCurrentStep(1);
      setAnswers({});
    } catch {
      setError('Failed to load questions for this category.');
    } finally {
      setLoading(false);
    }
  }, []);

  const selectOption = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const goNext = () => { if (currentStep < questions.length) setCurrentStep((s) => s + 1); };
  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    } else {
      setSelectedCategory(null);
      setCurrentStep(0);
      setQuestions([]);
      setAnswers({});
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = { category: selectedCategory, answers };
      const results = await catalogService.getRecommendations(payload);
      navigate('/results', { state: { products: results, answers, category: selectedCategory } });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to get recommendations.');
      setSubmitting(false);
    }
  };

  const totalSteps = questions.length;
  const currentQ = currentStep >= 1 && currentStep <= totalSteps ? questions[currentStep - 1] : null;
  const isLastStep = currentStep === totalSteps;
  const currentAnswer = currentQ ? answers[currentQ.id] : null;
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  if (loading && categories.length === 0) {
    return (
      <div className="page-with-navbar" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--color-muted)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-with-navbar" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', padding: '24px' }}>
      <div className="card fade-in-up" style={{ maxWidth: 700, width: '100%', padding: '40px' }}>
        {/* ── Header ──── */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>
            🏗️ Recommendation Wizard
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem' }}>
            {currentStep === 0
              ? 'Choose a product category to get started'
              : `Step ${currentStep} of ${totalSteps} — ${selectedCategory}`}
          </p>
          {currentStep > 0 && (
            <div style={{ height: 6, background: 'var(--color-surface-alt)', borderRadius: 3, marginTop: '16px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'var(--color-primary)', borderRadius: 3, transition: 'width 0.4s ease' }} />
            </div>
          )}
        </div>

        {/* ── Error ──── */}
        {error && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-error-bg)',
            color: 'var(--color-error)',
            fontSize: '0.9rem',
            marginBottom: '24px',
            border: '1px solid rgba(220,38,38,0.15)',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── Category Selection ──── */}
        {currentStep === 0 && (
          <div className="fade-in-up">
            <h2 style={{ fontWeight: 600, fontSize: '1.15rem', color: 'var(--color-text)', marginBottom: '16px' }}>
              What type of product are you looking for?
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => selectCategory(cat)}
                  className="card"
                  style={{
                    padding: '24px 16px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)',
                  }}
                >
                  <span style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}>
                    {CATEGORY_ICONS[cat] || '📦'}
                  </span>
                  <span style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--color-text)' }}>
                    {cat}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Question Steps ──── */}
        {currentQ && (
          <div className="fade-in-up" key={currentQ.id}>
            <h2 style={{ fontWeight: 600, fontSize: '1.15rem', color: 'var(--color-text)', marginBottom: 6 }}>
              {currentQ.question}
            </h2>
            {currentQ.subtext && (
              <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
                {currentQ.subtext}
              </p>
            )}
            <div style={{ display: 'grid', gap: '10px' }}>
              {currentQ.options.map((opt) => {
                const isSelected = currentAnswer === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => selectOption(currentQ.id, opt.value)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: 4,
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-lg)',
                      border: isSelected ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                      background: isSelected ? 'var(--color-primary-muted)' : 'var(--color-surface)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ fontWeight: 500, fontSize: '0.95rem', color: isSelected ? 'var(--color-primary)' : 'var(--color-text)' }}>
                      {opt.label}
                    </span>
                    {opt.desc && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                        {opt.desc}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Footer ──── */}
        {currentStep > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', gap: '16px' }}>
            <button className="btn-ghost" onClick={goBack} disabled={submitting}>
              ← Back
            </button>
            {isLastStep ? (
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={submitting || !currentAnswer}
                style={{ opacity: submitting || !currentAnswer ? 0.5 : 1 }}
              >
                {submitting ? (
                  <><span className="spinner-sm" /> Getting Results...</>
                ) : (
                  'Get Recommendations →'
                )}
              </button>
            ) : (
              <button
                className="btn-primary"
                onClick={goNext}
                disabled={!currentAnswer}
                style={{ opacity: !currentAnswer ? 0.5 : 1 }}
              >
                Next →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}