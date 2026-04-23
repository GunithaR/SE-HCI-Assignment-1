import React from 'react';

export default function ReviewScreen({ questions, answers, onEdit, onSubmit, submitting }) {
  // Safely display all answered questions
  const answeredQuestions = questions.filter((q) => answers[q.id] !== undefined);

  return (
    <div className="wizard-fade-in">
      <h1 className="wizard-q-heading">Review Your Answers</h1>
      <p className="wizard-q-subtext">Please review your selections before getting recommendations.</p>
      
      <div className="wizard-review-list">
        {answeredQuestions.map((q) => {
          const selectedOption = q.options.find(opt => opt.value === answers[q.id]);
          const answerLabel = selectedOption ? selectedOption.label : answers[q.id];

          return (
            <div key={q.id} className="wizard-review-item">
              <div>
                <div className="wizard-review-q">{q.question}</div>
                <div className="wizard-review-a">{answerLabel}</div>
              </div>
              <button 
                className="wizard-review-edit" 
                onClick={() => onEdit(q.id)}
                disabled={submitting}
              >
                Edit
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
