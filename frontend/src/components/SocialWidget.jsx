import React, { useState, useRef, useEffect } from 'react';
import './SocialWidget.css';
import zaloIcon from '../assets/Zalo.svg';

/* ══════════════════════════════════════════════════════
   ICON INLINE — không cần file ảnh, không bao giờ lỗi
   Màu chính xác theo brand: Messenger gradient, Zalo #0068FF
══════════════════════════════════════════════════════ */

const IconPhone = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493
      a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516
      l1.13-2.257a1 1 0 011.21-.502l4.493 1.498
      a1 1 0 01.684.949V19a2 2 0 01-2 2h-1
      C9.716 21 3 14.284 3 6V5z"/>
  </svg>
);

const IconMessenger = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sw_mg" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stopColor="#0082FB"/>
        <stop offset="100%" stopColor="#A334FA"/>
      </linearGradient>
    </defs>
    <circle cx="26" cy="26" r="26" fill="url(#sw_mg)"/>
    <path
      d="M26 10.4C17.2 10.4 10 17.1 10 25.4c0 4.7 2.3 8.9 5.9 11.7
         v5.5l5.4-3c1.5.4 3 .6 4.7.6 8.8 0 16-6.7 16-15
         S34.8 10.4 26 10.4zm1.7 20.2l-4-4.3-7.8 4.3 8.6-9.2
         4.1 4.3 7.7-4.3-8.6 9.2z"
      fill="white"/>
  </svg>
);

const IconZalo = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
    <rect width="52" height="52" rx="13" fill="#0068FF"/>
    {/* Chữ ZALO */}
    <text x="26" y="31" textAnchor="middle" fill="white"
      fontFamily="'Arial Black', Arial, sans-serif"
      fontWeight="900" fontSize="16.5" letterSpacing="0.5">
      ZALO
    </text>
  </svg>
);

const IconChat = () => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 10h.01M12 10h.01M16 10h.01
      M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14
      a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
  </svg>
);

const IconClose = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth="2.5" strokeLinecap="round">
    <path d="M6 18L18 6M6 6l12 12"/>
  </svg>
);

const IconBotSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
  </svg>
);

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export default function SocialWidget() {
  const [chatOpen, setChatOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [messages, setMessages] = useState([{
    role: 'model',
    text: 'Xin chào! Tôi là trợ lý AI của Bệnh viện Nhân Dân Gia Định 🏥\n\nTôi có thể giúp bạn:\n• Đặt lịch khám trực tuyến\n• Tìm bác sĩ phù hợp\n• Giải đáp về dịch vụ & bảng giá\n\nBạn cần hỗ trợ gì?',
  }]);

  const bottomRef    = useRef(null);
  const quickReplies = ['Đặt lịch khám', 'Giờ làm việc', 'Bảng giá', 'Tìm bác sĩ'];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (preset) => {
    const msg = (preset ?? input).trim();
    if (!msg) return;
    setInput('');
    const next = [...messages, { role: 'user', text: msg }];
    setMessages(next);
    setLoading(true);
    try {
      const history = messages.slice(1).map(m => ({
        role: m.role, parts: [{ text: m.text }],
      }));
      const res  = await fetch(
        `${import.meta?.env?.VITE_API_URL ?? 'http://localhost:5000'}/api/chat`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: msg, history }) }
      );
      const data = await res.json();
      setMessages([...next, {
        role: 'model',
        text: data.success ? data.reply : 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại!',
      }]);
    } catch {
      setMessages([...next, {
        role: 'model',
        text: 'Xin lỗi, tôi đang gặp trục trặc kỹ thuật.\nVui lòng gọi 1800 6767 để được hỗ trợ!',
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sw-root">

      {/* ══════════ CHATBOT WINDOW ══════════ */}
      {chatOpen && (
        <div className="sw-chat">

          {/* Header */}
          <div className="sw-chat-header">
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{
                width:40, height:40, borderRadius:'50%',
                background:'rgba(255,255,255,0.18)',
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                </svg>
              </div>
              <div>
                <p style={{ color:'#fff', fontWeight:700, fontSize:14, margin:0 }}>
                  Trợ Lý Y Tế AI
                </p>
                <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:3 }}>
                  <span style={{
                    width:6, height:6, borderRadius:'50%',
                    background:'#4ade80', display:'inline-block',
                  }}/>
                  <span style={{ color:'#bfdbfe', fontSize:11 }}>Luôn sẵn sàng hỗ trợ</span>
                </div>
              </div>
            </div>
            <div style={{ display:'flex', gap:4 }}>
              <button
                onClick={() => setExpanded(v => !v)}
                style={{ background:'none', border:'none', color:'rgba(255,255,255,0.8)',
                  cursor:'pointer', padding:'4px 6px', borderRadius:6 }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d={expanded ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'}/>
                </svg>
              </button>
              <button
                onClick={() => setChatOpen(false)}
                style={{ background:'none', border:'none', color:'rgba(255,255,255,0.8)',
                  cursor:'pointer', padding:'4px 6px', borderRadius:6 }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          {expanded && <>
            {/* Messages */}
            <div className="sw-chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={m.role === 'user' ? 'sw-msg-user' : 'sw-msg-bot'}>
                  {m.role === 'model' && (
                    <div className="sw-avatar"><IconBotSmall/></div>
                  )}
                  <div className={`sw-bubble ${m.role === 'user' ? 'sw-bubble-user' : 'sw-bubble-bot'}`}>
                    {m.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="sw-msg-bot">
                  <div className="sw-avatar"><IconBotSmall/></div>
                  <div className="sw-bubble sw-bubble-bot"
                    style={{ display:'flex', gap:4, alignItems:'center', padding:'12px 14px' }}>
                    {[0, 0.18, 0.36].map((d, i) => (
                      <div key={i} className="sw-dot" style={{ animationDelay:`${d}s` }}/>
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef}/>
            </div>

            {/* Quick replies */}
            <div className="sw-quick-bar">
              {quickReplies.map((q, i) => (
                <button key={i} className="sw-quick-chip" onClick={() => send(q)}>{q}</button>
              ))}
            </div>

            {/* Input */}
            <div className="sw-chat-input-row">
              <form
                onSubmit={e => { e.preventDefault(); send(); }}
                style={{ display:'flex', gap:8, width:'100%' }}
              >
                <input
                  className="sw-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Nhập câu hỏi của bạn..."
                />
                <button
                  className="sw-send-btn"
                  type="submit"
                  disabled={loading || !input.trim()}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="white" strokeWidth="2.5" strokeLinecap="round"
                    style={{ transform:'rotate(90deg)' }}>
                    <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                  </svg>
                </button>
              </form>
            </div>
          </>}
        </div>
      )}

      {/* ══════════════════════════════════════
          4 NÚT FLOATING
          - sw-shake chỉ áp cho 3 nút đầu
          - Nút AI KHÔNG có class sw-shake
      ══════════════════════════════════════ */}

      {/* 1. GỌI ĐIỆN */}
      <a href="tel:18006767"
        className="sw-btn sw-btn-phone sw-shake"
        title="Gọi 1800 6767"
      >
        <div className="sw-pulse-wrap"/>
        <span className="sw-tooltip">Gọi 1800 6767</span>
        <IconPhone/>
      </a>

      {/* 2. MESSENGER */}
      <a
        href="https://m.me/benhviennhandangiadian"
        target="_blank" rel="noopener noreferrer"
        className="sw-btn sw-btn-messenger sw-shake"
        title="Nhắn tin Facebook"
        style={{ padding:0, overflow:'hidden' }}
      >
        <div className="sw-pulse-wrap"/>
        <span className="sw-tooltip">Nhắn tin Facebook</span>
        <IconMessenger/>
      </a>

      {/* 3. ZALO */}
      <a
        href="https://zalo.me/0123456789"
        target="_blank" rel="noopener noreferrer"
        className="sw-btn sw-btn-zalo sw-shake"
        title="Chat Zalo"
        style={{ padding:0, overflow:'hidden' }}
      >
        <div className="sw-pulse-wrap"/>
        <span className="sw-tooltip">Chat Zalo</span>
       <img
  src={zaloIcon}
  alt="Zalo"
  className="w-full h-full object-cover"
/>
      </a>

      {/* 4. AI CHATBOT — ĐỨNG YÊN */}
      <button
        onClick={() => setChatOpen(v => !v)}
        className={`sw-btn ${chatOpen ? 'sw-btn-chat-open' : 'sw-btn-chat-closed'}`}
        title={chatOpen ? 'Đóng chatbot' : 'Chat với AI'}
      >
        {!chatOpen && <span className="sw-badge">AI</span>}
        {chatOpen ? <IconClose/> : <IconChat/>}
      </button>

    </div>
  );
}