import { useEffect, useState } from 'react';
import { ThumbsDown, Bot, Sparkles, MessageSquare, Check, AlertCircle, RefreshCw } from 'lucide-react';
import API_BASE_URL from '../config/api';

const ChatbotTrain = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [correctionTexts, setCorrectionTexts] = useState({});
  const [trainingStatus, setTrainingStatus] = useState({});
  const [error, setError] = useState('');

  const fetchQueries = async () => {
    setLoading(true);
    setError('');
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const response = await fetch(`${API_BASE_URL}/api/chat/admin/queries`, { headers });
      if (response.ok) {
        const data = await response.json();
        setQueries(data);
      } else {
        setError('Không thể tải danh sách câu hỏi cần huấn luyện.');
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleTextChange = (queryId, text) => {
    setCorrectionTexts((prev) => ({
      ...prev,
      [queryId]: text,
    }));
  };

  const handleTrain = async (queryId) => {
    const correctedText = correctionTexts[queryId];
    if (!correctedText || !correctedText.trim()) {
      alert('Vui lòng nhập câu trả lời chuẩn trước khi gửi huấn luyện!');
      return;
    }

    setTrainingStatus((prev) => ({ ...prev, [queryId]: 'loading' }));

    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/chat/admin/correct`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          messageId: queryId,
          correctedResponse: correctedText,
        }),
      });

      if (response.ok) {
        setTrainingStatus((prev) => ({ ...prev, [queryId]: 'success' }));
        // Sau 2 giây, loại bỏ câu đã học khỏi danh sách hiển thị
        setTimeout(() => {
          setQueries((prev) => prev.filter((q) => q._id !== queryId));
        }, 1500);
      } else {
        setTrainingStatus((prev) => ({ ...prev, [queryId]: 'error' }));
        alert('Gửi huấn luyện thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error(err);
      setTrainingStatus((prev) => ({ ...prev, [queryId]: 'error' }));
      alert('Lỗi kết nối máy chủ.');
    }
  };

  return (
    <div className="p-8 font-sans">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Bot className="w-7 h-7 text-[#004e92]" />
            Huấn luyện Trợ lý AI y tế
            <button onClick={fetchQueries} className="text-gray-400 hover:text-[#004e92] transition-colors p-1" title="Làm mới">
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-[#004e92]' : ''}`} />
            </button>
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Xem lịch sử câu hỏi của bệnh nhân. Dạy AI trả lời các câu hỏi chưa tốt (bị Dislike) để cải thiện độ thông minh.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            Hàng đợi huấn luyện AI
            <span className="text-xs bg-yellow-50 text-yellow-800 border border-yellow-200 px-2.5 py-1 rounded-full font-semibold">
              {queries.length} câu hỏi đang chờ duyệt
            </span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-medium w-[20%]">Câu hỏi của bệnh nhân</th>
                <th className="p-4 font-medium w-[30%]">AI đã trả lời trước đó</th>
                <th className="p-4 font-medium w-[10%] text-center">Đánh giá</th>
                <th className="p-4 font-medium w-[40%]">Dạy AI câu trả lời đúng chuẩn</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500 font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 text-[#004e92] animate-spin" />
                      <span>Đang tải danh sách câu hỏi cần tối ưu...</span>
                    </div>
                  </td>
                </tr>
              ) : queries.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Sparkles className="w-12 h-12 text-yellow-400 animate-pulse" />
                      <p className="font-bold text-gray-700 text-base">Hệ thống AI đang hoạt động rất tốt!</p>
                      <p className="text-sm text-gray-400 max-w-sm">Chưa có câu hỏi nào bị đánh giá Dislike hoặc cần huấn luyện.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                queries.map((q) => (
                  <tr key={q._id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Câu hỏi bệnh nhân */}
                    <td className="p-4 font-medium text-gray-900 vertical-top align-top">
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="italic">"{q.message}"</span>
                      </div>
                    </td>

                    {/* AI trả lời */}
                    <td className="p-4 text-gray-600 vertical-top align-top max-w-[250px]">
                      <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-50 flex gap-2">
                        <Bot className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                        <span className="text-xs">{q.aiResponse}</span>
                      </div>
                    </td>

                    {/* Đánh giá */}
                    <td className="p-4 text-center vertical-top align-top">
                      {q.rating === 'dislike' ? (
                        <span className="bg-red-50 text-red-700 border border-red-100 px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                          <ThumbsDown size={10} /> Dislike
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs font-semibold inline-block">
                          Mới / Chưa đánh giá
                        </span>
                      )}
                    </td>

                    {/* Form huấn luyện */}
                    <td className="p-4 vertical-top align-top">
                      <div className="flex flex-col gap-2">
                        <textarea
                          placeholder="Nhập câu trả lời chuẩn y khoa để huấn luyện AI phản hồi đúng và tự nhiên..."
                          rows={2}
                          value={correctionTexts[q._id] || ''}
                          onChange={(e) => handleTextChange(q._id, e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#004e92] resize-none"
                          disabled={trainingStatus[q._id] === 'success'}
                        />
                        <div className="flex justify-end">
                          {trainingStatus[q._id] === 'success' ? (
                            <span className="bg-green-100 text-green-800 text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 border border-green-200">
                              <Check size={14} /> AI đã tiếp nhận tri thức mới!
                            </span>
                          ) : (
                            <button
                              onClick={() => handleTrain(q._id)}
                              disabled={trainingStatus[q._id] === 'loading'}
                              className="bg-[#004e92] hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                              {trainingStatus[q._id] === 'loading' ? 'Đang dạy...' : 'Dạy AI'}
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChatbotTrain;
