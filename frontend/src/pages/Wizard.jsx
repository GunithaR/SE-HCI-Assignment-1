import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import catalogService from '../services/catalogService';

const STEPS = [
    {
        id: 'budget',
        question: 'What is your construction budget range?',
        subtext: 'This helps us filter materials within your financial comfort zone.',
        options: [
            { value: 'LOW', label: '💰 Economy', desc: 'Cost-effective, practical materials' },
            { value: 'MEDIUM', label: '💎 Mid-Range', desc: 'Balance of quality and affordability' },
            { value: 'HIGH', label: '👑 Premium', desc: 'Top-tier materials, no compromises' },
        ],
    },
    {
        id: 'climate',
        question: 'What is the climate at your build location?',
        subtext: 'Material durability varies greatly by climate conditions.',
        options: [
            { value: 'TROPICAL', label: '🌴 Tropical', desc: 'Hot, humid, heavy rainfall' },
            { value: 'ARID', label: '☀️ Arid', desc: 'Hot and dry, low humidity' },
            { value: 'TEMPERATE', label: '🌿 Temperate', desc: 'Mild temperatures, moderate rain' },
            { value: 'COLD', label: '❄️ Cold', desc: 'Sub-zero winters, frost risk' },
        ],
    },
];



export default function Wizard() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const currentStep = STEPS[step];
    const progress = ((step) / STEPS.length) * 100;

    const select = (value) => {
        const updated = { ...answers, [currentStep.id]: value };
        setAnswers(updated);

        if (step < STEPS.length - 1) {
            setStep(step + 1);
        } else {
            // Final step — fetch recommendations
            setLoading(true);
            setError('');
            catalogService
                .getRecommendations(updated.budget, updated.climate)
                .then((data) => {
                    navigate('/results', { state: { products: data, answers: updated } });
                })
                .catch(() =>
                    setError('Could not fetch recommendations. Please ensure the backend is running.')
                )
                .finally(() => setLoading(false));
        }
    };

    return (
        <div className="light-theme min-h-screen flex items-center justify-center px-4 pt-28 pb-16 hero-bg relative">

            <div className="w-full max-w-2xl fade-in-up">
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-200/50 rounded-full mb-10 overflow-hidden shadow-inner">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${progress}%`,
                            background: 'linear-gradient(90deg, #6c63ff, #f59e0b)',
                        }}
                    />
                </div>

                <div className="glass p-8 md:p-12" style={{ border: '2px solid #a78bfa', boxShadow: '0 4px 12px rgba(139,92,246,0.1)' }}>
                    <p className="text-xs text-violet-600 font-bold uppercase tracking-widest mb-3">
                        Step {step + 1} of {STEPS.length}
                    </p>
                    <h2
                        className="text-2xl md:text-3xl font-bold text-slate-800 mb-2"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                        {currentStep.question}
                    </h2>
                    <p className="text-slate-500 text-sm mb-8">{currentStep.subtext}</p>

                    {error && (
                        <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex flex-col items-center py-8 gap-4">
                            <div className="spinner" />
                            <p className="text-slate-400 text-sm">Finding best matches…</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-4">
                            {currentStep.options.map((opt) => (
                                <button
                                    key={opt.value}
                                    id={`wizard-${currentStep.id}-${opt.value.toLowerCase()}`}
                                    onClick={() => select(opt.value)}
                                    className="text-left p-5 rounded-xl bg-white shadow-sm hover:bg-violet-50 transition-all duration-200 group"
                                    style={{ border: '2px solid #c4b5fd' }}
                                >
                                    <div className="text-2xl mb-2">{opt.label.split(' ')[0]}</div>
                                    <div className="font-semibold text-indigo-950 text-sm group-hover:text-violet-700 transition-colors">
                                        {opt.label.slice(opt.label.indexOf(' ') + 1)}
                                    </div>
                                    <div className="text-slate-500 text-xs mt-1">{opt.desc}</div>
                                </button>
                            ))}
                        </div>
                    )}

                    {step > 0 && !loading && (
                        <button
                            id="wizard-back-btn"
                            onClick={() => setStep(step - 1)}
                            className="mt-6 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                        >
                            ← Back
                        </button>
                    )}
                </div>

                {/* Answers summary */}
                {Object.keys(answers).length > 0 && (
                    <div className="mt-4 flex gap-2 justify-center flex-wrap">
                        {Object.entries(answers).map(([key, val]) => (
                            <span key={key} className="badge shadow-sm border border-violet-200" style={{ background: 'rgba(108,99,255,0.1)', color: '#6c63ff' }}>
                                {key}: {val}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
