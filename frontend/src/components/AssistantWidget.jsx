import { useState, useRef, useEffect } from 'react';

const SUGGESTIONS = [
    { q: 'What is budget level?', a: 'Budget levels (LOW / MEDIUM / HIGH) reflect the overall cost range of a product. LOW is economy-friendly, HIGH is premium.' },
    { q: 'What climates are supported?', a: 'We support TROPICAL, ARID, TEMPERATE, COLD, and ALL (universal). Choose the climate closest to your build location.' },
    { q: 'How does the recommendation engine work?', a: 'Our rule-based engine filters active products that match your chosen budget and climate, then ranks them by durability rating (highest first).' },
    { q: 'Can I compare products?', a: 'Yes! On any results page, check the boxes on product cards to add them to the comparison tray.' },
    { q: 'How do I contact support?', a: 'Please email support@buildwise.com or use the live chat during business hours.' },
];

export default function AssistantWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'Hi! I\'m your L+ SIVILIMA Assistant 👷 Ask me anything about construction materials or how this platform works.' },
    ]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, open]);

    const findAnswer = (query) => {
        const lower = query.toLowerCase();
        const match = SUGGESTIONS.find(
            (s) => s.q.toLowerCase().split(' ').some((word) => lower.includes(word)) ||
                lower.includes(s.q.toLowerCase().slice(0, 12))
        );
        return match ? match.a : "I'm not sure about that yet! Try asking about budget levels, climates, or how recommendations work.";
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

    return (
        <>
            {open && (
                <div id="assistant-panel" style={{
                    position: 'fixed', bottom: 96, right: 24, zIndex: 50,
                    width: 340, maxHeight: 440,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    animation: 'fadeInUp 0.25s ease',
                }}>
                    {/* Header */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 16px', borderBottom: '1px solid var(--color-border)',
                        background: 'var(--color-primary)', color: '#fff',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: '1.1rem' }}>🤖</span>
                            <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>L+ SIVILIMA Assistant</span>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                        </div>
                        <button id="assistant-close-btn" onClick={() => setOpen(false)} style={{
                            background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '1.3rem', cursor: 'pointer', lineHeight: 1,
                        }}>×</button>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 280 }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                                <div style={{
                                    maxWidth: '85%', padding: '8px 14px',
                                    borderRadius: msg.from === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                                    fontSize: '0.85rem', lineHeight: 1.5,
                                    background: msg.from === 'user' ? 'var(--color-primary)' : 'var(--color-surface-alt)',
                                    color: msg.from === 'user' ? '#fff' : 'var(--color-text)',
                                    border: msg.from === 'user' ? 'none' : '1px solid var(--color-border)',
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {typing && (
                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <div style={{ padding: '8px 14px', borderRadius: 14, fontSize: '0.85rem', background: 'var(--color-surface-alt)', color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}>
                                    ● ● ●
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Quick suggestions */}
                    <div style={{ padding: '0 16px 8px', display: 'flex', gap: 6, overflowX: 'auto' }}>
                        {['Budget levels', 'Climates', 'How it works'].map((hint) => (
                            <button key={hint} onClick={() => setInput(hint)} style={{
                                whiteSpace: 'nowrap', padding: '4px 10px', borderRadius: 'var(--radius-full)',
                                border: '1px solid var(--color-border)', background: 'transparent',
                                color: 'var(--color-muted)', fontSize: '0.72rem', cursor: 'pointer',
                                transition: 'all var(--transition-fast)',
                            }}
                                onMouseEnter={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.color = 'var(--color-primary)'; }}
                                onMouseLeave={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.color = 'var(--color-muted)'; }}
                            >{hint}</button>
                        ))}
                    </div>

                    {/* Input */}
                    <div style={{ padding: '10px 16px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: 8 }}>
                        <input
                            id="assistant-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && send()}
                            placeholder="Ask a question…"
                            className="input-field"
                            style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                        />
                        <button id="assistant-send-btn" onClick={send} className="btn-primary" style={{ padding: '8px 14px', flexShrink: 0 }}>
                            ➤
                        </button>
                    </div>
                </div>
            )}

            {/* FAB */}
            <button
                id="assistant-fab"
                onClick={() => setOpen((o) => !o)}
                aria-label="Toggle Assistant"
                style={{
                    position: 'fixed', bottom: 24, right: 24, zIndex: 50,
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'var(--color-primary)', color: '#fff',
                    border: 'none', cursor: 'pointer', fontSize: '1.5rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(107,29,42,0.3)',
                    transition: 'all var(--transition-base)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
                {open ? '✕' : '💬'}
            </button>
        </>
    );
}
