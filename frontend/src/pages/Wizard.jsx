import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import catalogService from '../services/catalogService';
import ReviewScreen from '../components/ReviewScreen';

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
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [startedAt, setStartedAt] = useState(null);

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
    setStartedAt(Date.now()); // Capture the exact timestamp when questionnaire begins
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

  /* Select an option for the current question */
  const selectOption = (questionId, value) => {
    setAnswers((prev) => {
      if (prev[questionId] === value) return prev;
      
      const next = { ...prev, [questionId]: value };
      
      // If we change an answer, clear all subsequent answers
      const qIndex = questions.findIndex((q) => q.id === questionId);
      if (qIndex !== -1) {
        for (let i = qIndex + 1; i < questions.length; i++) {
          delete next[questions[i].id];
        }
      }
      return next;
    });
  };

  /* Dynamic Navigation Flow */
  const visibleQuestions = useMemo(() => {
    return questions.filter((q) => {
      const qText = q.question?.toLowerCase() || '';

      // Dynamic Rule 1: Prioritize moisture-related flow if location is Coastal
      if (qText.includes('moisture') || q.id === 'moisture') {
        const hasCoastal = Object.values(answers).some(
          (val) => typeof val === 'string' && val.toLowerCase() === 'coastal'
        );
        if (!hasCoastal) return false;
      }

      // Dynamic Rule 2: Prioritize budget-related flow if concern is Low Cost
      if (qText.includes('budget') || q.id === 'budget') {
        const hasLowCost = Object.values(answers).some(
          (val) => typeof val === 'string' && val.toLowerCase() === 'low cost'
        );
        if (!hasLowCost) return false;
      }

      // Default: skip irrelevant questions based on backend logic if provided
      if (typeof q.condition === 'function') {
        return q.condition(answers);
      }

      return true;
    });
  }, [questions, answers]);

  /* ── Derived ─────────────────────────────────────────────────── */
  const isCategoryStep = !selectedCategory;

  const currentQ = useMemo(() => {
    if (isCategoryStep || visibleQuestions.length === 0) return null;
    const q = visibleQuestions.find((q) => q.id === currentQuestionId);
    return q || visibleQuestions[0];
  }, [isCategoryStep, visibleQuestions, currentQuestionId]);

  const currentIndex = currentQ ? visibleQuestions.findIndex((q) => q.id === currentQ.id) : -1;
  const totalSteps = visibleQuestions.length;
  const isLastStep = currentIndex === totalSteps - 1;
  const currentAnswer = currentQ ? answers[currentQ.id] : null;
  const progress = totalSteps > 0 ? ((currentIndex + 1) / totalSteps) * 100 : 0;
  const isReviewStep = totalSteps > 0 && visibleQuestions.every((q) => answers[q.id] !== undefined) && currentQuestionId === null;

  /* Navigation */
  const goNext = () => {
    if (currentIndex === -1) return;
    // If all visible questions are answered, go to review
    const allAnswered = visibleQuestions.every((q) => answers[q.id] !== undefined);
    if (allAnswered) {
      setCurrentQuestionId(null); // null signals review screen
    } else if (currentIndex < totalSteps - 1) {
      setCurrentQuestionId(visibleQuestions[currentIndex + 1].id);
    }
  };

  const goBack = () => {
    if (isReviewStep) {
      // Go back from review to the last visible question
      setCurrentQuestionId(visibleQuestions[visibleQuestions.length - 1].id);
    } else if (currentIndex > 0) {
      setCurrentQuestionId(visibleQuestions[currentIndex - 1].id);
    } else {
      // Back to category selection
      setSelectedCategory(null);
      setCurrentQuestionId(null);
      setQuestions([]);
      setAnswers({});
    }
  };

  /* Submit */
  const handleSubmit = async () => {
    // Only send answers for visible questions to keep the profile clean from dynamically skipped questions
    const cleanAnswers = {};
    visibleQuestions.forEach((q) => {
      if (answers[q.id] !== undefined) cleanAnswers[q.id] = answers[q.id];
    });

    setSubmitting(true);
    setError(null);
    try {
      const payload = { category: selectedCategory, answers: cleanAnswers, startedAt: startedAt };
      const hybrid = await catalogService.getHybridRecommendations(payload);
      navigate('/results', {
        state: {
          products: hybrid.recommendations || [],
          additionalInsights: hybrid.additionalInsights || [],
          augmentationFallbackUsed: !!hybrid.fallbackUsed,
          answers: cleanAnswers,
          category: selectedCategory,
        },
      });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to get recommendations.');
      setSubmitting(false);
    }
  };



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
    <div className="light-theme wizard-container">
      <div className="wizard-card">
        {/* ── Header ──────────────────────────────────────  */}
        <div className="wizard-header">
          <h1>🏗️ Recommendation Wizard</h1>
          <p className="wizard-subtitle">
            {isCategoryStep
              ? 'Choose a product category to get started'
              : `Step ${currentIndex + 1} of ${totalSteps} — ${selectedCategory}`}
          </p>
          {!isCategoryStep && (
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
        {isCategoryStep && (
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
        {currentQ && !isReviewStep && (
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

        {/* ── Review Step ─────────────────────────────── */}
        {isReviewStep && (
          <ReviewScreen 
            questions={questions} 
            answers={answers} 
            onEdit={(questionId) => setCurrentQuestionId(questionId)} 
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        )}

        {/* ── Footer ──────────────────────────────────── */}
        {!isCategoryStep && (
          <div className="wizard-footer">
            <button className="wizard-btn secondary" onClick={goBack} disabled={submitting}>
              ← Back
            </button>

            {isReviewStep ? (
              <button
                className="wizard-btn primary"
                onClick={handleSubmit}
                disabled={submitting}
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
                {visibleQuestions.every((q) => answers[q.id] !== undefined) ? 'Review Answers →' : 'Next →'}
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
          background: linear-gradient(135deg, #090914, #1b1136, #111124);
          padding: 2rem;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .wizard-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 28px;
          max-width: 760px;
          width: 100%;
          padding: 3.5rem;
          box-shadow: 0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .wizard-header { text-align: center; margin-bottom: 2.5rem; }
        .wizard-header h1 { 
          font-size: 2.2rem; 
          margin: 0 0 .75rem; 
          background: linear-gradient(90deg, #c084fc, #ec4899);
          -webkit-background-clip: text;
          color: transparent;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .wizard-subtitle { color: rgba(255,255,255,.7); font-size: 1.05rem; margin: 0 0 1.2rem; font-weight: 500; }
        .wizard-progress {
          height: 8px;
          background: rgba(255,255,255,.08);
          border-radius: 4px;
          overflow: hidden;
          margin-top: 1rem;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);
        }
        .wizard-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6, #ec4899);
          border-radius: 4px;
          transition: width .5s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 12px rgba(236,72,153,.5);
        }
        .wizard-error {
          background: rgba(239,68,68,.15);
          border: 1px solid rgba(239,68,68,.4);
          color: #fca5a5;
          padding: 1rem 1.25rem;
          border-radius: 14px;
          margin-bottom: 2rem;
          font-size: 1rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: .75rem;
        }
        .wizard-step { animation: fadeSlide .4s cubic-bezier(0.4, 0, 0.2, 1); }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .wizard-question {
          color: #fff;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 .75rem;
          letter-spacing: -0.3px;
        }
        .wizard-subtext {
          color: rgba(255,255,255,.6);
          font-size: 1rem;
          margin: 0 0 2rem;
          line-height: 1.5;
        }
        .wizard-options {
          display: grid;
          gap: 1rem;
        }
        .category-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
        .wizard-option {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: .4rem;
          background: rgba(255,255,255,.04);
          border: 2px solid rgba(255,255,255,.08);
          border-radius: 18px;
          padding: 1.25rem 1.5rem;
          cursor: pointer;
          transition: all .25s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: left;
          color: #fff;
          position: relative;
          overflow: hidden;
        }
        .wizard-option::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,.1), transparent);
          opacity: 0; transition: opacity .25s; pointer-events: none;
        }
        .wizard-option:hover {
          background: rgba(255,255,255,.08);
          border-color: rgba(236,72,153,.4);
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2), 0 0 20px rgba(236,72,153,.15);
        }
        .wizard-option:hover::before { opacity: 1; }
        .wizard-option.selected {
          background: rgba(236,72,153,.15);
          border-color: #ec4899;
          box-shadow: 0 0 24px rgba(236,72,153,.3);
          transform: translateY(-2px);
        }
        .category-option {
          align-items: center;
          text-align: center;
          padding: 2rem 1.5rem;
        }
        .option-icon { font-size: 2.8rem; margin-bottom: .75rem; display: block; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3)); }
        .option-label { font-weight: 600; font-size: 1.15rem; }
        .option-desc { font-size: .9rem; color: rgba(255,255,255,.6); line-height: 1.4; }
        .wizard-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 3rem;
          gap: 1.5rem;
        }
        .wizard-btn {
          padding: 1rem 2rem;
          border-radius: 14px;
          border: none;
          font-weight: 700;
          font-size: 1.05rem;
          cursor: pointer;
          transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: .75rem;
          letter-spacing: 0.3px;
        }
        .wizard-btn.primary {
          background: linear-gradient(135deg, #c084fc, #ec4899);
          color: #fff;
          box-shadow: 0 4px 15px rgba(236,72,153,.3);
        }
        .wizard-btn.primary:hover:not(:disabled) {
          box-shadow: 0 8px 25px rgba(236,72,153,.5);
          transform: translateY(-2px);
          background: linear-gradient(135deg, #a855f7, #db2777);
        }
        .wizard-btn.secondary {
          background: rgba(255,255,255,.1);
          color: #fff;
          backdrop-filter: blur(10px);
        }
        .wizard-btn.secondary:hover { background: rgba(255,255,255,.18); transform: translateY(-2px); }
        .wizard-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; box-shadow: none; filter: grayscale(50%); }
        .spinner { width: 48px; height: 48px; border: 4px solid rgba(255,255,255,.15); border-top-color: #ec4899; border-radius: 50%; animation: spin .8s linear infinite; margin: 0 auto 1.5rem; }
        .spinner-sm { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .6s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .wizard-loading { text-align: center; color: rgba(255,255,255,.8); font-size: 1.1rem; font-weight: 500;}
      `}</style>
    </div>
  );
}