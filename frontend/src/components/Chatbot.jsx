import { useEffect, useRef, useState } from 'react';
import { Send, X, Bot, User, MessageCircle, HeartPulse, HelpCircle, Pill, CalendarClock, Paperclip, Stethoscope } from 'lucide-react';
import API_BASE_URL from '../config/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  
  // Dữ liệu bong bóng chat ban đầu (Bao gồm thẻ Card và Quick Replies)
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: 'Dạ, Bệnh viện Nhân Dân xin kính chào quý khách! 🏥\nEm là trợ lý AI (Trực tuyến 24/7). Anh/chị đang cần hỗ trợ vấn đề gì ạ?',
      isIntro: true
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Ẩn tooltip tự động sau 10 giây nếu user không click
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setShowTooltip(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickReplies = [
    { icon: <Stethoscope size={16} />, text: 'Triệu chứng bệnh lý' },
    { icon: <CalendarClock size={16} />, text: 'Hướng dẫn đặt lịch' },
    { icon: <Pill size={16} />, text: 'Hỏi về tác dụng Thuốc' },
    { icon: <HeartPulse size={16} />, text: 'Giờ làm việc, BHYT' }
  ];

  const handleSendQuickReply = (text) => {
    setInputMessage(text);
    handleSendMessage(null, text);
  };

  const handleSendMessage = async (e, forcedText = null) => {
    if (e) e.preventDefault();
    const textToSend = forcedText || inputMessage;
    if (!textToSend.trim()) return;

    const newMessages = [...messages, { role: 'user', text: textToSend }];
    setInputMessage('');
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const history = messages
        .filter(msg => !msg.isIntro) // Bỏ qua thẻ chào mừng đặc biệt khi gửi history cho AI
        .map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.text }],
        }));

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, history })
      });

      const data = await response.json();

      if (data.success) {
        setMessages([...newMessages, { role: 'model', text: data.reply }]);
      } else {
        setMessages([...newMessages, { role: 'model', text: `Dạ hệ thống báo lỗi: ${data.message || 'không xác định'}. Anh/chị thử lại sau nhé.` }]);
      }
    } catch {
      setMessages([
        ...newMessages,
        { role: 'model', text: 'Dạ xin lỗi anh/chị, đường truyền của em đang gặp sự cố. Anh/chị vui lòng kết nối lại sau ít phút nhé!' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* ----------------- CHAT WINDOW ----------------- */}
      {isOpen && (
        <div className="bg-gray-50 w-[350px] sm:w-[400px] rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 h-[600px] mb-4 origin-bottom-right animate-fadeIn">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#004e92] to-[#000428] p-4 flex justify-between items-center shadow-md relative">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#004e92] p-1 shadow-inner">
                  <Bot size={24} />
                </div>
                {/* Dấu chấm xanh Online */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#000428] rounded-full"></div>
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-white text-base leading-tight">Y Tế AI Assistant</h3>
                <p className="text-xs text-blue-200 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  Trực tuyến hỗ trợ
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-white/95">
            {messages.map((msg, index) => (
              <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                
                {/* Bong bóng tin nhắn */}
                <div className="flex items-end gap-2 max-w-[85%]">
                  {msg.role === 'model' && (
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-700 mb-1 shadow-sm">
                      <Bot size={14} />
                    </div>
                  )}
                  
                  <div
                    className={`px-4 py-2.5 shadow-sm text-[15px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#004e92] text-white rounded-[20px] rounded-br-sm' // Nhọn ở góc dưới phải (iMessage style)
                        : 'bg-white text-gray-800 rounded-[20px] rounded-bl-sm border border-gray-100' // Nhọn ở góc dưới trái
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words break-all">{msg.text}</p>
                  </div>
                </div>

                {/* Nếu là tin nhắn giới thiệu ban đầu -> Hiển thị Chip gợi ý */}
                {msg.isIntro && (
                  <div className="mt-3 ml-8 space-y-2 w-full max-w-[85%]">
                    <p className="text-xs text-gray-400 font-medium ml-1">Gợi ý câu hỏi nhanh:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickReplies.map((reply, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendQuickReply(reply.text)}
                          className="bg-white border border-blue-200 hover:border-[#004e92] hover:bg-blue-50 text-[#004e92] text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors shadow-sm font-medium"
                        >
                          <span className="text-blue-500">{reply.icon}</span>
                          {reply.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Hiệu ứng Đang gõ (Typing Indicator) */}
            {isLoading && (
              <div className="flex justify-start items-end gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-700 mb-1 shadow-sm">
                  <Bot size={14} />
                </div>
                <div className="bg-white border border-gray-100 rounded-[20px] rounded-bl-sm px-4 py-3 shadow-sm flex space-x-1.5 items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Footer / Input Area */}
          <div className="p-3 bg-white border-t border-gray-100 rounded-b-3xl">
            <form onSubmit={(e) => handleSendMessage(e)} className="flex items-end space-x-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-200 focus-within:border-[#004e92] focus-within:ring-1 focus-within:ring-[#004e92] transition-all">
              <button
                type="button"
                className="p-2.5 text-gray-400 hover:text-[#004e92] transition-colors rounded-full hover:bg-gray-200"
                title="Đính kèm (Phát triển sau)"
              >
                <Paperclip size={20} />
              </button>
              
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="Nhập nội dung cần tư vấn..."
                className="flex-1 bg-transparent border-none px-2 py-2.5 max-h-24 outline-none resize-none text-sm text-gray-800"
                rows="1"
              />
              
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                  inputMessage.trim() 
                    ? 'bg-[#004e92] text-white shadow-md hover:bg-blue-800' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send size={18} className="ml-1" />
              </button>
            </form>
            <div className="text-center mt-2">
              <p className="text-[10px] text-gray-400 font-medium">Được hỗ trợ bởi AI Engine Bệnh viện Nhân Dân</p>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- FLOATING BUTTON CÓ TOOLTIP (Kiểu DMX) ----------------- */}
      {!isOpen && (
        <div className="relative flex flex-col items-end">
          {showTooltip && (
            <div className="mb-4 bg-white px-4 py-3 rounded-2xl shadow-xl border border-gray-100 flex items-start gap-3 w-64 animate-bounce relative cursor-pointer" onClick={() => setIsOpen(true)}>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <MessageCircle size={18} className="text-[#004e92]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Xin chào! 👋</p>
                <p className="text-xs text-gray-600 mt-0.5">Anh/chị cần tư vấn bệnh lý hay hỏi đặt lịch khám ạ?</p>
              </div>
              {/* Tam giác chĩa xuống bong bóng */}
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-gray-100 transform rotate-45"></div>
              {/* Nút tắt tooltip */}
              <button 
                onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}
                className="absolute top-1 right-1 text-gray-400 hover:text-red-500"
              >
                <X size={14} />
              </button>
            </div>
          )}
          
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-[#004e92] to-[#000428] text-white rounded-full p-4 shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 focus:outline-none flex items-center justify-center group relative"
          >
            <Bot size={28} className="group-hover:animate-pulse" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      )}

    </div>
  );
};

export default Chatbot;
