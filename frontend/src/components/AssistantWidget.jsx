import { useState, useRef, useEffect } from 'react';

const SUGGESTIONS = [
    { q: 'What is budget level?', a: 'Budget levels (LOW / MEDIUM / HIGH) reflect the overall cost range of a product. LOW is economy-friendly, HIGH is premium.' },
    { q: 'What climates are supported?', a: 'We support TROPICAL, ARID, TEMPERATE, COLD, and ALL (universal). Choose the climate closest to your build location.' },
    { q: 'How does the recommendation engine work?', a: 'Our rule-based engine filters active products that match your chosen budget and climate, then ranks them by durability rating (highest first).' },
    { q: 'Can I compare products?', a: 'Yes! On any results page, check the boxes on product cards to add them to the comparison tray.' },
    { q: 'How do I contact support?', a: 'Please email support@buildwise.com or use the live chat during business hours.' },
];

/**
 * Floating Assistant Widget.
 * A minimalist chatbot bubble that answers common questions using a
 * keyword-match approach — no backend required for Sprint 1.
 */
export default function AssistantWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'Hi! I\'m your L+ SIVILIMA Assistant 👷 Ask me anything about construction materials or how this platform works.' },
    ]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const bottomRef = useRef(null);

    // Auto-scroll to latest message
    useEffect(() => {
        if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, open]);

    const findAnswer = (query) => {
        const lower = query.toLowerCase();
        const match = SUGGESTIONS.find(
            (s) =>
                s.q.toLowerCase().split(' ').some((word) => lower.includes(word)) ||
                lower.includes(s.q.toLowerCase().slice(0, 12))
        );
        return match
            ? match.a
            : "I'm not sure about that yet! Try asking about budget levels, climates, or how recommendations work.";
    };

    const send = () => {
        const trimmed = input.trim();
        if (!trimmed) return;

        setMessages((prev) => [...prev, { from: 'user', text: trimmed }]);
        setInput('');
        setTyping(true);

        setTimeout(() => {
            setMessages((prev) => [...prev, { from: 'bot', text: findAnswer(trimmed) }]);
            setTyping(false);
        }, 700);
    };

    const handleKey = (e) => {
        if (e.key === 'Enter') send();
    };

    return (
        <>
            {/* Chat panel */}
            {open && (
                <div
                    id="assistant-panel"
                    className="fixed bottom-24 right-6 z-50 w-80 glass shadow-2xl flex flex-col overflow-hidden fade-in-up"
                    style={{ maxHeight: '420px' }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🤖</span>
                            <span className="font-semibold text-sm text-white">L+ SIVILIMA Assistant</span>
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        </div>
                        <button
                            id="assistant-close-btn"
                            onClick={() => setOpen(false)}
                            className="text-slate-400 hover:text-white transition-colors text-lg leading-none"
                        >
                            ×
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ maxHeight: '280px' }}>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${msg.from === 'user'
                                        ? 'bg-violet-600 text-white rounded-br-sm'
                                        : 'bg-white/5 text-slate-200 rounded-bl-sm'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {typing && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 px-4 py-2 rounded-2xl text-slate-400 text-sm">
                                    <span className="animate-pulse">● ● ●</span>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Quick suggestions */}
                    <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
                        {['Budget levels', 'Climates', 'How it works'].map((hint) => (
                            <button
                                key={hint}
                                onClick={() => { setInput(hint); }}
                                className="text-xs whitespace-nowrap px-2 py-1 rounded-full border border-white/10 text-slate-400 hover:border-violet-500 hover:text-violet-400 transition-colors"
                            >
                                {hint}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="px-4 py-3 border-t border-white/5 flex gap-2">
                        <input
                            id="assistant-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            placeholder="Ask a question…"
                            className="input-field text-sm py-2"
                        />
                        <button
                            id="assistant-send-btn"
                            onClick={send}
                            className="btn-primary py-2 px-4 text-sm shrink-0"
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}

            {/* FAB toggle button */}
            <button
                id="assistant-fab"
                onClick={() => setOpen((o) => !o)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full btn-primary flex items-center justify-center text-2xl shadow-2xl"
                aria-label="Toggle Assistant"
            >
                {open ? '✕' : '💬'}
            </button>
        </>
    );
}
