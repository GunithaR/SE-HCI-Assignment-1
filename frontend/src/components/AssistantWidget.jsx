import { useState, useRef, useEffect } from 'react';
import { sendChatMessages } from '../services/chatService';
import ReactMarkdown from 'react-markdown';

const SUGGESTIONS = [
    { q: 'What is budget level?', a: 'Budget levels (LOW / MEDIUM / HIGH) reflect the overall cost range of a product. LOW is economy-friendly, HIGH is premium.' },
    { q: 'What climates are supported?', a: 'We support TROPICAL, ARID, TEMPERATE, COLD, and ALL (universal). Choose the climate closest to your build location.' },
    { q: 'How does the recommendation engine work?', a: 'Our rule-based engine filters active products that match your chosen budget and climate, then ranks them by durability rating (highest first).' },
    { q: 'Can I compare products?', a: 'Yes! On any results page, check the boxes on product cards to add them to the comparison tray.' },
    { q: 'How do I contact support?', a: 'Please email support@buildwise.com or use the live chat during business hours.' },
];

/**
 * Sub-Component: Chat Header
 */
const ChatHeader = ({ onClose }) => (
    <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-violet-600 to-indigo-600">
        <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 bg-white/20 rounded-full backdrop-blur-sm">
                <span className="text-lg leading-none mt-1">✨</span>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-indigo-600 rounded-full"></span>
            </div>
            <div>
                <h3 className="font-bold text-sm text-white tracking-wide">L+ Sivilima Assistant</h3>
                <p className="text-xs text-indigo-100 opacity-90">Online</p>
            </div>
        </div>
        <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors text-xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
        >
            ×
        </button>
    </div>
);

/**
 * Sub-Component: Message List
 */
const ChatMessageList = ({ messages, typing, bottomRef }) => (
    <div className="flex-1 overflow-y-auto px-4 pt-6 pb-4 space-y-4 chat-scroll min-h-0" style={{ background: 'var(--color-surface)' }}>
        {messages.map((msg, idx) => (
            <div key={idx} className={`flex msg-anim ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.from === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 mr-2 mt-auto shadow-md">
                        <span className="text-[10px] text-white">AI</span>
                    </div>
                )}
                <div
                    className={`max-w-[80%] px-10 py-4 rounded-lg text-sm leading-relaxed shadow-sm break-words overflow-y-auto ${
                        msg.from === 'user'
                            ? 'min-w-[40px] bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-sm shadow-[0_4px_15px_rgba(124,58,237,0.25)]'
                            : 'bg-white text-slate-800 rounded-bl-sm border border-slate-100'
                    }`}
                >
                    {msg.from === 'bot' ? (
                        <div className="prose prose-sm prose-slate max-w-none">
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                    ) : (
                        <div className="text-left w-full">{msg.text}</div>
                    )}
                </div>
            </div>
        ))}
        {typing && (
            <div className="flex justify-start msg-anim items-end">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 mr-2 shadow-md">
                    <span className="text-[10px] text-white">AI</span>
                </div>
                <div className="pl-8 pr-5 py-3 rounded-lg rounded-bl-lg bg-white border border-slate-100 shadow-sm flex items-center gap-1">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                </div>
            </div>
        )}
        <div ref={bottomRef} />
    </div>
);

/**
 * Sub-Component: Input Area with Suggestions
 */
const ChatInputArea = ({ input, setInput, onSend }) => {
    const handleKey = (e) => {
        if (e.key === 'Enter') onSend();
    };

    return (
        <div className="flex flex-col bg-[var(--color-surface)] border-t border-[var(--color-border)]">
            {/* Suggestions */}
            {/* <div className="px-4 py-2 flex gap-2 overflow-x-auto chat-scroll border-b border-[var(--color-border)]">
                {['Budget levels', 'Climates', 'How it works'].map((hint) => (
                    <button
                        key={hint}
                        onClick={() => { setInput(hint); }}
                        className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full border transition-all text-violet-600 bg-violet-50 border-violet-100 hover:bg-violet-600 hover:text-white"
                    >
                        {hint}
                    </button>
                ))}
            </div> */}

            {/* Input Field */}
            <div className="px-8 py-3 flex gap-2 items-center">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="   Type a message..."
                    className="flex-1 bg-[var(--color-surface-alt)] text-[var(--color-text)] py-2.5 text-sm outline-none border border-transparent focus:border-violet-500 transition-colors"
                />
                <button
                    onClick={onSend}
                    disabled={!input.trim()}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-md group"
                >
                    <svg className="w-4 h-4 ml-0.5 mt-0.5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
};

/**
 * Main Floating Assistant Widget
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

    const send = async () => {
        const trimmed = input.trim();
        if (!trimmed) return;

        const newMsg = { from: 'user', text: trimmed };
        setMessages((prev) => [...prev, newMsg]);
        setInput('');
        setTyping(true);

        try {
            const updatedHistory = [...messages, newMsg];
            const botReply = await sendChatMessages(updatedHistory);
            setMessages((prev) => [...prev, { from: 'bot', text: botReply }]);
        } catch (error) {
            setMessages((prev) => [...prev, { from: 'bot', text: "I'm having trouble connecting to my knowledge base right now. Please try again later." }]);
        } finally {
            setTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat panel */}
            {open && (
                <div
                    className="mb-4 w-80 sm:w-[400px] rounded-2xl overflow-hidden glass shadow-2xl flex flex-col fade-in-up"
                    style={{ 
                        maxHeight: '520px', 
                        background: 'var(--color-surface)', 
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)' 
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
                className={`relative w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-transform hover:scale-110 active:scale-95 z-50 ${
                    open ? 'bg-slate-800 text-white shadow-xl rotate-90' : 'bg-gradient-to-br from-violet-600 via-indigo-600 to-fuchsia-500 text-white shadow-[0_10px_30px_rgba(124,58,237,0.4)] fab-pulse'
                }`}
                aria-label="Toggle Assistant"
                style={{ transitionDuration: '0.4s' }}
            >
                {open ? (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                ) : (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                )}
            </button>
        </div>
    );
}
