import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import catalogService from '../services/catalogService';

/* ───────────────── Category icons ──────────────────────────────────────── */
const CATEGORY_ICONS = {
  'Roofing Solution': '🏠',
  'Flooring Solution': '🧱',
  'Wall Solution': '🏗️',
  'Ceiling Solution': '🔲',
  'Accessories': '🔩',
};

/* ───────────────── Wizard ──────────────────────────────────────────────── */
export default function Wizard() {
  const navigate = useNavigate();

  /* State */
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0); // 0 = category select
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  /* Load categories on mount */
  useEffect(() => {
    catalogService
      .getQuestionCategories()
      .then((cats) => {
        setCategories(cats);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load categories. Is the backend running?');
        setLoading(false);
      });
  }, []);

  /* Load questions when category selected */
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

  /* Select an option for the current question */
  const selectOption = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  /* Navigation */
  const goNext = () => {
    if (currentStep < questions.length) setCurrentStep((s) => s + 1);
  };
  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    } else {
      // Back to category selection
      setSelectedCategory(null);
      setCurrentStep(0);
      setQuestions([]);
      setAnswers({});
    }
  };

  /* Submit */
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

  /* ── Derived ─────────────────────────────────────────────────── */
  const totalSteps = questions.length;
  const currentQ = currentStep >= 1 && currentStep <= totalSteps ? questions[currentStep - 1] : null;
  const isLastStep = currentStep === totalSteps;
  const currentAnswer = currentQ ? answers[currentQ.id] : null;
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  /* ── Loading / Error ─────────────────────────────────────────── */
  if (loading && categories.length === 0) {
    return (
      <div className="wizard-container">
        <div className="wizard-loading">
          <div className="spinner" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wizard-container">
      <div className="wizard-card">
        {/* ── Header ──────────────────────────────────────  */}
        <div className="wizard-header">
          <h1>🏗️ Recommendation Wizard</h1>
          <p className="wizard-subtitle">
            {currentStep === 0
              ? 'Choose a product category to get started'
              : `Step ${currentStep} of ${totalSteps} — ${selectedCategory}`}
          </p>
          {currentStep > 0 && (
            <div className="wizard-progress">
              <div className="wizard-progress-bar" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>

        {/* ── Error ──────────────────────────────────────── */}
        {error && (
          <div className="wizard-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* ── Category Selection (step 0) ─────────────── */}
        {currentStep === 0 && (
          <div className="wizard-step animate-in">
            <h2 className="wizard-question">What type of product are you looking for?</h2>
            <div className="wizard-options category-grid">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className="wizard-option category-option"
                  onClick={() => selectCategory(cat)}
                >
                  <span className="option-icon">{CATEGORY_ICONS[cat] || '📦'}</span>
                  <span className="option-label">{cat}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Question Steps ──────────────────────────── */}
        {currentQ && (
          <div className="wizard-step animate-in" key={currentQ.id}>
            <h2 className="wizard-question">{currentQ.question}</h2>
            {currentQ.subtext && <p className="wizard-subtext">{currentQ.subtext}</p>}
            <div className="wizard-options">
              {currentQ.options.map((opt) => (
                <button
                  key={opt.value}
                  className={`wizard-option${currentAnswer === opt.value ? ' selected' : ''}`}
                  onClick={() => selectOption(currentQ.id, opt.value)}
                >
                  <span className="option-label">{opt.label}</span>
                  {opt.desc && <span className="option-desc">{opt.desc}</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Footer ──────────────────────────────────── */}
        {currentStep > 0 && (
          <div className="wizard-footer">
            <button className="wizard-btn secondary" onClick={goBack} disabled={submitting}>
              ← Back
            </button>

            {isLastStep ? (
              <button
                className="wizard-btn primary"
                onClick={handleSubmit}
                disabled={submitting || !currentAnswer}
              >
                {submitting ? (
                  <>
                    <span className="spinner-sm" /> Getting Results...
                  </>
                ) : (
                  'Get Recommendations →'
                )}
              </button>
            ) : (
              <button className="wizard-btn primary" onClick={goNext} disabled={!currentAnswer}>
                Next →
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Styles ──────────────────────────────────────── */}
      <style>{`
        .wizard-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
          padding: 2rem;
        }
        .wizard-card {
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 24px;
          max-width: 700px;
          width: 100%;
          padding: 2.5rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        .wizard-header { text-align: center; margin-bottom: 2rem; }
        .wizard-header h1 { color: #fff; font-size: 1.8rem; margin: 0 0 .5rem; }
        .wizard-subtitle { color: rgba(255,255,255,.6); font-size: .95rem; margin: 0 0 1rem; }
        .wizard-progress {
          height: 6px;
          background: rgba(255,255,255,.1);
          border-radius: 3px;
          overflow: hidden;
          margin-top: .5rem;
        }
        .wizard-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          border-radius: 3px;
          transition: width .4s ease;
        }
        .wizard-error {
          background: rgba(239,68,68,.15);
          border: 1px solid rgba(239,68,68,.3);
          color: #fca5a5;
          padding: .75rem 1rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          font-size: .9rem;
        }
        .wizard-step { animation: fadeSlide .3s ease; }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .wizard-question {
          color: #fff;
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0 0 .5rem;
        }
        .wizard-subtext {
          color: rgba(255,255,255,.5);
          font-size: .85rem;
          margin: 0 0 1.5rem;
        }
        .wizard-options {
          display: grid;
          gap: .75rem;
        }
        .category-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
        .wizard-option {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: .25rem;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 14px;
          padding: 1rem 1.2rem;
          cursor: pointer;
          transition: all .2s;
          text-align: left;
          color: #fff;
        }
        .wizard-option:hover {
          background: rgba(255,255,255,.12);
          border-color: rgba(99,102,241,.5);
          transform: translateY(-2px);
        }
        .wizard-option.selected {
          background: rgba(99,102,241,.2);
          border-color: #6366f1;
          box-shadow: 0 0 16px rgba(99,102,241,.25);
        }
        .category-option {
          align-items: center;
          text-align: center;
          padding: 1.5rem 1rem;
        }
        .option-icon { font-size: 2rem; margin-bottom: .25rem; }
        .option-label { font-weight: 500; font-size: 1rem; }
        .option-desc { font-size: .8rem; color: rgba(255,255,255,.5); }
        .wizard-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
          gap: 1rem;
        }
        .wizard-btn {
          padding: .75rem 1.5rem;
          border-radius: 12px;
          border: none;
          font-weight: 600;
          font-size: .95rem;
          cursor: pointer;
          transition: all .2s;
          display: flex;
          align-items: center;
          gap: .5rem;
        }
        .wizard-btn.primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
        }
        .wizard-btn.primary:hover:not(:disabled) {
          box-shadow: 0 4px 20px rgba(99,102,241,.4);
          transform: translateY(-1px);
        }
        .wizard-btn.secondary {
          background: rgba(255,255,255,.08);
          color: rgba(255,255,255,.7);
        }
        .wizard-btn.secondary:hover { background: rgba(255,255,255,.14); }
        .wizard-btn:disabled { opacity: .4; cursor: not-allowed; }
        .spinner { width: 40px; height: 40px; border: 3px solid rgba(255,255,255,.15); border-top-color: #6366f1; border-radius: 50%; animation: spin .8s linear infinite; margin: 0 auto 1rem; }
        .spinner-sm { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .6s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .wizard-loading { text-align: center; color: rgba(255,255,255,.6); }
      `}</style>
    </div>
  );
}