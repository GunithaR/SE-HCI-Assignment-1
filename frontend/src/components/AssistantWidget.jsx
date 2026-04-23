import { useState, useRef, useEffect } from 'react';
import { sendChatMessages } from '../services/chatService';
import ReactMarkdown from 'react-markdown';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const fmtTime = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// ─────────────────────────────────────────────────────────────────────────────
// Chat Header — WhatsApp-style purple gradient
// ─────────────────────────────────────────────────────────────────────────────
const ChatHeader = ({ onClose }) => (
    <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px',
        background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Avatar */}
            <div style={{
                position: 'relative', width: 38, height: 38,
                borderRadius: '50%', background: 'rgba(255,255,255,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(4px)', flexShrink: 0,
            }}>
                <span style={{ fontSize: 18, lineHeight: 1, fontWeight: 800, color: '#fff' }}>AI</span>
                <span style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 10, height: 10, borderRadius: '50%',
                    background: '#22c55e', border: '2px solid #6366f1',
                }} />
            </div>
            {/* Title */}
            <div>
                <h3 style={{
                    fontFamily: 'Manrope, sans-serif', fontWeight: 700,
                    fontSize: '0.9rem', color: '#fff', margin: 0, letterSpacing: '-0.2px',
                }}>L+ Sivilima Assistant</h3>
                <p style={{
                    fontSize: '0.68rem', color: 'rgba(255,255,255,0.75)',
                    margin: 0, fontWeight: 500,
                }}>Online · Typically replies instantly</p>
            </div>
        </div>
        {/* Close */}
        <button
            onClick={onClose}
            style={{
                background: 'rgba(255,255,255,0.15)', border: 'none',
                color: '#fff', cursor: 'pointer',
                width: 30, height: 30, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'scale(1)'; }}
            aria-label="Close Chat"
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Message List — WhatsApp chat area with wallpaper + tailed bubbles
// ─────────────────────────────────────────────────────────────────────────────
const ChatMessageList = ({ messages, typing, bottomRef }) => (
    <div
        className="flex-1 chat-scroll chat-wallpaper"
        style={{
            overflowY: 'auto', padding: '16px 12px 8px', minHeight: 0,
            display: 'flex', flexDirection: 'column', gap: 6,
        }}
    >
        {messages.map((msg, idx) => {
            const isUser = msg.from === 'user';
            const showAvatar = !isUser && (idx === 0 || messages[idx - 1]?.from === 'user');

            return (
                <div
                    key={idx}
                    className="msg-anim"
                    style={{
                        display: 'flex', flexDirection: 'column',
                        alignItems: isUser ? 'flex-end' : 'flex-start',
                        marginBottom: 2,
                    }}
                >
                    {/* Bot avatar row */}
                    {showAvatar && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            marginBottom: 4, marginLeft: 4,
                        }}>
                            <div style={{
                                width: 20, height: 20, borderRadius: '50%',
                                background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <span style={{ fontSize: 9, color: '#fff', fontWeight: 800 }}>AI</span>
                            </div>
                            <span style={{ fontSize: '0.65rem', color: '#7c3aed', fontWeight: 600 }}>Assistant</span>
                        </div>
                    )}

                    {/* Bubble */}
                    <div
                        className={isUser ? 'chat-bubble-user' : 'chat-bubble-bot'}
                        style={{
                            maxWidth: '82%',
                            padding: '9px 12px 6px',
                            color: isUser ? '#fff' : '#1e1b4b',
                            fontSize: '0.84rem',
                            lineHeight: 1.55,
                            overflowWrap: 'anywhere',
                            wordBreak: 'break-word',
                        }}
                    >
                        {isUser ? (
                            <div>{msg.text}</div>
                        ) : (
                            <div className="prose prose-sm max-w-none" style={{ color: '#1e1b4b' }}>
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                        )}
                        {/* Timestamp */}
                        <div
                            className="chat-timestamp"
                            style={{
                                textAlign: 'right',
                                color: isUser ? 'rgba(255,255,255,0.65)' : '#9ca3af',
                            }}
                        >
                            {fmtTime(msg.time || new Date())}
                        </div>
                    </div>
                </div>
            );
        })}

        {/* Typing indicator */}
        {typing && (
            <div className="msg-anim" style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
                <div
                    className="chat-bubble-bot"
                    style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 3 }}
                >
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                </div>
            </div>
        )}
        <div ref={bottomRef} />
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Input Area — WhatsApp-style pill input with send button
// ─────────────────────────────────────────────────────────────────────────────
const ChatInputArea = ({ input, setInput, onSend }) => {
    const handleKey = (e) => { if (e.key === 'Enter') onSend(); };

    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 12px',
            background: '#fff',
            borderTop: '1px solid #ede9fe',
        }}>
            {/* Input pill */}
            <div style={{
                flex: 1, display: 'flex', alignItems: 'center',
                background: '#f5f3ff', borderRadius: 24,
                padding: '0 16px', border: '1px solid #ede9fe',
                transition: 'border-color 0.2s, box-shadow 0.2s',
            }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Type a message..."
                    style={{
                        flex: 1, border: 'none', outline: 'none',
                        background: 'transparent', color: '#1e1b4b',
                        fontSize: '0.85rem', padding: '10px 0',
                        fontFamily: 'Inter, sans-serif', fontWeight: 500,
                    }}
                />
            </div>

            {/* Send button */}
            <button
                onClick={onSend}
                disabled={!input.trim()}
                style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: input.trim()
                        ? 'linear-gradient(135deg, #7c3aed, #6366f1)'
                        : '#e5e7eb',
                    border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'all 0.2s',
                    boxShadow: input.trim() ? '0 4px 12px rgba(124,58,237,0.3)' : 'none',
                }}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 2 }}>
                    <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
            </button>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Floating Assistant Widget
// ─────────────────────────────────────────────────────────────────────────────
export default function AssistantWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            from: 'bot',
            text: "Hi! I'm your **L+ SIVILIMA Assistant**.\n\nAsk me anything about construction materials or how this platform works.",
            time: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const bottomRef = useRef(null);

    // Auto-scroll to latest message
    useEffect(() => {
        if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, open]);

    const send = async () => {
        const trimmed = input.trim();
        if (!trimmed) return;

        const newMsg = { from: 'user', text: trimmed, time: new Date() };
        setMessages((prev) => [...prev, newMsg]);
        setInput('');
        setTyping(true);

        try {
            const updatedHistory = [...messages, newMsg];
            const botReply = await sendChatMessages(updatedHistory);
            setMessages((prev) => [...prev, { from: 'bot', text: botReply, time: new Date() }]);
        } catch (error) {
            setMessages((prev) => [...prev, {
                from: 'bot',
                text: "I'm having trouble connecting right now. Please try again later.",
                time: new Date(),
            }]);
        } finally {
            setTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat panel */}
            {open && (
                <div
                    className="mb-4 fade-in-up"
                    style={{
                        width: 380,
                        maxWidth: 'calc(100vw - 48px)',
                        maxHeight: 520,
                        borderRadius: 18,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        background: '#fff',
                        border: '1px solid #ede9fe',
                        boxShadow: '0 12px 48px rgba(124, 58, 237, 0.18), 0 4px 12px rgba(0,0,0,0.08)',
                    }}
                >
                    <ChatHeader onClose={() => setOpen(false)} />
                    <ChatMessageList messages={messages} typing={typing} bottomRef={bottomRef} />
                    <ChatInputArea input={input} setInput={setInput} onSend={send} />
                </div>
            )}

            {/* Premium FAB toggle button */}
            <button
                onClick={() => setOpen((o) => !o)}
                aria-label="Toggle Assistant"
                style={{
                    position: 'relative',
                    width: 56, height: 56,
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: 60,
                    border: 'none',
                    color: '#fff',
                    background: open 
                        ? '#1e293b' 
                        : 'linear-gradient(135deg, #7c3aed, #6366f1, #d946ef)',
                    boxShadow: open
                        ? '0 10px 25px rgba(0,0,0,0.2)'
                        : '0 10px 30px rgba(124,58,237,0.4)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) rotate(0deg)'; }}
            >
                <div style={{
                    transition: 'transform 0.4s ease',
                    transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    {open ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                    )}
                </div>
            </button>
        </div>
    );
}
