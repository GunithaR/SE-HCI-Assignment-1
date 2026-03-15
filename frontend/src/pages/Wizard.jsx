/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import catalogService from '../services/catalogService';

export const STEPS = [
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
    {
        id: 'style',
        question: 'What architectural style do you prefer?',
        subtext: 'Match the materials to your aesthetic vision.',
        options: [
            { value: 'MODERN', label: '🏢 Modern', desc: 'Sleek, minimalist, and contemporary' },
            { value: 'TRADITIONAL', label: '🏡 Traditional', desc: 'Classic, timeless, and warm' },
            { value: 'INDUSTRIAL', label: '🏭 Industrial', desc: 'Raw, edgy, and functional' },
            { value: 'RUSTIC', label: '🪵 Rustic', desc: 'Natural, rough, and earthy' },
        ],
    },
    {
        id: 'durabilityPreference',
        question: 'How important is long-term durability?',
        subtext: 'Trade-off between upfront cost and replacement frequency.',
        options: [
            { value: 'STANDARD', label: '📘 Standard', desc: 'Typical lifespan, standard warranty' },
            { value: 'HIGH', label: '🛡️ High', desc: 'Built to last, extended warranty' },
            { value: 'EXTREME', label: '🏔️ Extreme', desc: 'Maximum lifespan, indestructible' },
        ],
    },
    {
        id: 'maintenancePreference',
        question: 'What level of maintenance are you willing to do?',
        subtext: 'Some materials need regular upkeep to maintain their look.',
        options: [
            { value: 'LOW', label: '✨ Low', desc: 'Install and forget, minimal upkeep' },
            { value: 'MEDIUM', label: '🧹 Medium', desc: 'Occasional cleaning and sealing' },
            { value: 'HIGH', label: '🚿 High', desc: 'Regular treatment and refinishing' },
        ],
    },
];

function StepIndicator({ total, current }) {
    return (
        <div className="flex items-center justify-center gap-2 mb-6">
            {Array.from({ length: total }).map((_, idx) => {
                const isActive = idx === current;
                const isCompleted = idx < current;

                return (
                    <div
                        key={idx}
                        className="transition-all duration-300 rounded-full"
                        style={{
                            width: isActive ? 28 : 10,
                            height: 10,
                            background: isCompleted
                                ? 'linear-gradient(90deg, #6c63ff, #8b5cf6)'
                                : isActive
                                    ? 'linear-gradient(90deg, #6c63ff, #f59e0b)'
                                    : 'rgba(148,163,184,0.25)',
                            boxShadow: isActive
                                ? '0 0 0 4px rgba(108,99,255,0.12)'
                                : 'none',
                        }}
                    />
                );
            })}
        </div>
    );
}

export default function Wizard() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const currentStep = STEPS[step];
    const progress = ((step + 1) / STEPS.length) * 100;
    const selectedValue = answers[currentStep.id];

    const select = (value) => {
        const updated = { ...answers, [currentStep.id]: value };
        setAnswers(updated);
        setError('');

        if (step < STEPS.length - 1) {
            setStep(step + 1);
        } else {
            setLoading(true);

            catalogService
                .getRecommendations(updated)
                .then((data) => {
                    navigate('/results', { state: { products: data, answers: updated } });
                })
                .catch(() =>
                    setError('Could not fetch recommendations. Please ensure the backend is running.')
                )
                .finally(() => setLoading(false));
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
            setError('');
        }
    };

    return (
        <div
            className="light-theme min-h-screen flex items-center justify-center page-with-navbar px-4 pb-16 hero-bg relative"
            style={{ background: 'var(--bg-color)' }}
        >
            <div className="w-full max-w-4xl mx-auto pt-8 fade-in-up">
                {/* Top heading */}
                <div className="text-center mb-8">
                    <p className="text-xs text-violet-600 font-bold uppercase tracking-[0.22em] mb-3">
                        Recommendation Assistant
                    </p>
                    <h1
                        className="text-3xl md:text-4xl font-bold text-slate-800 mb-3"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                        Let&apos;s find the best materials for your project
                    </h1>
                    <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
                        Answer a few guided questions and we’ll rank the most suitable products for your needs.
                    </p>
                </div>

                {/* Progress section */}
                <div className="mb-8">
                    <StepIndicator total={STEPS.length} current={step} />

                    <div className="w-full h-2 bg-slate-200/60 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${progress}%`,
                                background: 'linear-gradient(90deg, #6c63ff, #f59e0b)',
                            }}
                        />
                    </div>

                    <div className="flex justify-between items-center mt-3 text-xs">
                        <span className="text-slate-500">
                            Step {step + 1} of {STEPS.length}
                        </span>
                        
                    </div>
                </div>

                {/* Main card */}
                <div
                    className="glass p-8 md:p-14 lg:p-16"
                    style={{
                        border: '1.5px solid rgba(167,139,250,0.35)',
                        boxShadow: '0 10px 35px rgba(139,92,246,0.08)',
                        borderRadius: 24,
                    }}
                >
                    <div className="mb-8">
                        <p className="text-xs text-violet-600 font-bold uppercase tracking-widest mb-3">
                            {currentStep.id.replace(/([A-Z])/g, ' $1')}
                        </p>

                        <h2
                            className="text-2xl md:text-3xl font-bold text-slate-800 mb-3"
                            style={{ fontFamily: 'Outfit, sans-serif', lineHeight: 1.2 }}
                        >
                            {currentStep.question}
                        </h2>

                        <p className="text-slate-500 text-sm md:text-base">
                            {currentStep.subtext}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <div className="spinner" />
                            <p className="text-slate-500 text-sm font-medium">
                                Finding your best matches...
                            </p>
                            <p className="text-slate-400 text-xs">
                                Evaluating product rules, scores, and rankings
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
                                {currentStep.options.map((opt) => {
                                    const emoji = opt.label.split(' ')[0];
                                    const text = opt.label.slice(opt.label.indexOf(' ') + 1);
                                    const isSelected = selectedValue === opt.value;

                                    return (
                                        <button
                                            key={opt.value}
                                            id={`wizard-${currentStep.id}-${opt.value.toLowerCase()}`}
                                            onClick={() => select(opt.value)}
                                            className="text-left rounded-2xl group transition-all duration-200"
                                            style={{
                                                padding: '1.15rem 1.1rem',
                                                background: isSelected
                                                    ? 'linear-gradient(135deg, rgba(108,99,255,0.12), rgba(245,158,11,0.08))'
                                                    : 'rgba(255,255,255,0.9)',
                                                border: isSelected
                                                    ? '2px solid #8b5cf6'
                                                    : '1.5px solid rgba(196,181,253,0.8)',
                                                boxShadow: isSelected
                                                    ? '0 10px 24px rgba(139,92,246,0.16)'
                                                    : '0 4px 12px rgba(15,23,42,0.05)',
                                                transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
                                            }}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <div className="text-2xl mb-2">{emoji}</div>
                                                    <div className="font-semibold text-indigo-950 text-sm md:text-base group-hover:text-violet-700 transition-colors">
                                                        {text}
                                                    </div>
                                                    <div className="text-slate-500 text-xs md:text-sm mt-1.5 leading-relaxed">
                                                        {opt.desc}
                                                    </div>
                                                </div>

                                                {isSelected && (
                                                    <div
                                                        className="shrink-0 rounded-full flex items-center justify-center"
                                                        style={{
                                                            width: 24,
                                                            height: 24,
                                                            background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)',
                                                            color: '#fff',
                                                            fontSize: '0.8rem',
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        ✓
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex items-center justify-between mt-8">
                                <button
                                    id="wizard-back-btn"
                                    onClick={handleBack}
                                    disabled={step === 0}
                                    className="text-sm font-medium transition-colors px-4 py-2 rounded-lg"
                                    style={{
                                        color: step === 0 ? '#94a3b8' : '#64748b',
                                        cursor: step === 0 ? 'not-allowed' : 'pointer',
                                        background: step === 0 ? 'transparent' : 'rgba(148,163,184,0.08)',
                                    }}
                                >
                                    ← Back
                                </button>

                                <div className="text-xs text-slate-400">
                                    Choose one option to continue
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Answers summary */}
                {Object.keys(answers).length > 0 && (
                    <div className="mt-6">
                        <div className="text-center text-xs uppercase tracking-widest text-slate-400 mb-3">
                            Current selections
                        </div>
                        <div className="flex gap-2 justify-center flex-wrap">
                            {Object.entries(answers).map(([key, val]) => (
                                <span
                                    key={key}
                                    className="badge shadow-sm border border-violet-200"
                                    style={{
                                        background: 'rgba(108,99,255,0.08)',
                                        color: '#6c63ff',
                                        textTransform: 'none',
                                        fontSize: '0.76rem',
                                        padding: '0.35rem 0.7rem',
                                    }}
                                >
                                    <span className="font-semibold mr-1">
                                        {key.replace(/([A-Z])/g, ' $1')}:
                                    </span>
                                    {val}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}