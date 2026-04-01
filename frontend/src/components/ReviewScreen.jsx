import React from 'react';

export default function ReviewScreen({ questions, answers, onEdit, onSubmit, submitting }) {
  // Safely display all answered questions
  const answeredQuestions = questions.filter((q) => answers[q.id] !== undefined);

  return (
    <div className="wizard-step animate-in">
      <h2 className="wizard-question">Review Your Answers</h2>
      <p className="wizard-subtext">Please review your selections before getting recommendations.</p>
      
      <div className="review-list">
        {answeredQuestions.map((q, idx) => {
          // Find the label for the selected option
          const selectedOption = q.options.find(opt => opt.value === answers[q.id]);
          const answerLabel = selectedOption ? selectedOption.label : answers[q.id];

          return (
            <div key={q.id} className="review-item">
              <div className="review-item-content">
                <div className="review-question">{q.question}</div>
                <div className="review-answer">{answerLabel}</div>
              </div>
              <button 
                className="review-edit-btn" 
                onClick={() => onEdit(idx + 1)}
                disabled={submitting}
              >
                Edit
              </button>
            </div>
          );
        })}
      </div>


      <style>{`
        .review-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
          max-height: 50vh;
          overflow-y: auto;
          padding-right: 0.5rem;
        }
        /* Custom Scrollbar for review list */
        .review-list::-webkit-scrollbar {
          width: 6px;
        }
        .review-list::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .review-list::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        
        .review-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1rem 1.2rem;
        }
        .review-item-content {
          flex: 1;
          padding-right: 1rem;
        }
        .review-question {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          margin-bottom: 0.3rem;
        }
        .review-answer {
          color: #fff;
          font-weight: 500;
          font-size: 1.05rem;
        }
        .review-edit-btn {
          background: rgba(99, 102, 241, 0.15);
          color: #8b5cf6;
          border: 1px solid rgba(99, 102, 241, 0.3);
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .review-edit-btn:hover:not(:disabled) {
          background: rgba(99, 102, 241, 0.25);
          border-color: rgba(99, 102, 241, 0.5);
          color: #a78bfa;
        }
        .review-edit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .review-footer {
          justify-content: flex-end;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
}
