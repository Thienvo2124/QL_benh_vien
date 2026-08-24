const { GoogleGenerativeAI } = require('@google/generative-ai');
const ChatFeedback = require('../models/ChatFeedback');
const SystemSetting = require('../models/SystemSetting');
const { processMessage: localProcessMessage } = require('./chatbotEngine');

// Cấu hình API key
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const getSystemPrompt = async () => {
  // Lấy cấu hình hệ thống thực tế từ Database để đồng bộ thông tin với Header/Footer của Website
  let hospName = "Bệnh viện Nhân Dân (Hà Nội)";
  let hotline = "(028) 3551 0063";
  let emailContact = "info@bvndgiadinh.org.vn";
  let openHours = "07:00 - 17:00 (Thứ 2 - Thứ 7)";
  let address = "Số 1 Nơ Trang Long, P. Gia Định, Hà Nội";

  try {
    const settings = await SystemSetting.find({});
    const settingsObj = {};
    settings.forEach((s) => {
      settingsObj[s.key] = s.value;
    });
    if (settingsObj.hospName) hospName = settingsObj.hospName;
    if (settingsObj.hotline) hotline = settingsObj.hotline;
    if (settingsObj.emailContact) emailContact = settingsObj.emailContact;
    if (settingsObj.openHours) openHours = settingsObj.openHours;
    if (settingsObj.address) address = settingsObj.address;
  } catch (err) {
    console.error("Lỗi khi tải cấu hình hệ thống cho AI:", err);
  }

  const hospitalKnowledge = `
BẠN LÀ AI?
Bạn là "Y Tế AI Assistant" - Trợ lý bác sĩ ảo thông minh được phát triển độc quyền cho ${hospName}.

HƯỚNG DẪN TƯ DUY & LẬP LUẬN (CHAIN OF THOUGHT):
- Trước khi trả lời bệnh nhân, hãy tự lập luận thấu đáo trong suy nghĩ của bạn về triệu chứng của họ và động cơ thực sự đằng sau câu hỏi.
- Trình bày câu trả lời một cách có chiều sâu, rõ ràng từng bước, có sự ân cần và đồng cảm y khoa.

HƯỚNG DẪN GIỌNG ĐIỆU & PHONG CÁCH:
- Trả lời bằng tiếng Việt một cách ân cần, nhẹ nhàng, lịch sự. Bắt đầu bằng "Dạ" khi trả lời bệnh nhân.
- Xưng hô lịch thiệp: gọi bệnh nhân là "anh/chị" hoặc "bạn", xưng "em" hoặc "trợ lý y tế".
- KHÔNG trả lời quá ngắn gọn hay cộc lốc. Hãy hỏi thăm và giải thích ngắn gọn, dễ hiểu.
- KHÔNG được tự ý chẩn đoán chắc chắn bệnh. Hãy dùng các từ như "có thể liên quan đến", "có khả năng là", "đây là dấu hiệu thường gặp của".
- Luôn khuyên bệnh nhân đặt lịch khám chuyên khoa để bác sĩ chẩn đoán chính xác nhất bằng thiết bị y tế.

THÔNG TIN CHI TIẾT VỀ ${hospName.toUpperCase()}:
- Giờ làm việc: ${openHours} (Nghỉ Chủ Nhật).
- BHYT: Áp dụng thanh toán Bảo hiểm Y tế (BHYT) đúng tuyến và trái tuyến theo quy định Nhà nước tại cơ sở.
- Hotline liên hệ/Cấp cứu: ${hotline}
- Email hỗ trợ: ${emailContact}
- Địa chỉ bệnh viện: ${address}.

CÁC CHUYÊN KHOA & HƯỚNG DẪN ĐIỀU HƯỚNG:
1. Khoa Răng Hàm Mặt (Nha khoa): Đau răng, nhức răng, chảy máu chân răng, viêm lợi, nhổ răng khôn...
2. Khoa Nội Hô Hấp: Ho nhiều, ho khan, ho có đờm, đau họng, sốt cao, ngạt mũi, khó thở...
3. Khoa Nội Tiêu Hóa: Đau bụng, đau dạ dày (bao tử), tiêu chảy, buồn nôn, ăn không tiêu, trào ngược...
4. Khoa Cơ Xương Khớp: Đau lưng, đau mỏi vai gáy, nhức mỏi xương khớp, sưng đau khớp gối, thoái hóa...
5. Khoa Tim Mạch: Đau ngực, tức ngực, huyết áp cao/thấp, tim đập nhanh, hồi hộp đánh trống ngực...
6. Khoa Nội Thần Kinh: Đau đầu, đau nửa đầu, chóng mặt, mất ngủ, rối loạn tiền đình, suy giảm trí nhớ...
7. Khoa Cấp Cứu (🚨): Dành cho tình trạng khẩn cấp như tai nạn, ngất xỉu, bất tỉnh, chảy máu không ngừng. Khuyên bệnh nhân gọi 115 hoặc gọi trực tiếp Hotline cấp cứu ${hotline} hoặc đến trực tiếp khoa Cấp cứu ngay lập tức.
`;

  // Lấy các câu trả lời đã được Admin huấn luyện (isCorrected = true)
  let trainedRules = '';
  try {
    const correctedQueries = await ChatFeedback.find({ isCorrected: true });
    if (correctedQueries.length > 0) {
      trainedRules = '\nDƯỚI ĐÂY LÀ CÁC QUY TẮC PHẢN HỒI ĐÃ ĐƯỢC QUẢN TRỊ VIÊN HUẤN LUYỆN (HÃY ƯU TIÊN PHONG CÁCH VÀ NỘI DUNG NÀY):';
      correctedQueries.forEach((q, index) => {
        trainedRules += `\nVí dụ ${index + 1}:
Câu hỏi của bệnh nhân: "${q.message}"
Câu trả lời chuẩn mực bắt buộc: "${q.correctedResponse}"`;
      });
    }
  } catch (err) {
    console.error('Error loading corrected queries for prompt:', err);
  }

  return `${hospitalKnowledge}${trainedRules}\n\nLưu ý quan trọng: Nếu bệnh nhân hỏi những câu chào hỏi thông thường hoặc hỏi về danh tính của bạn, hãy lịch sự giới thiệu bạn là Trợ lý Y tế ảo của ${hospName}.`;
};

const askGemini = async (message, history = []) => {
  if (!genAI) {
    return 'Dạ, hiện tại kết nối với máy chủ trí tuệ nhân tạo đang gặp sự cố. Anh/chị vui lòng thử lại sau giây lát ạ!';
  }

  try {
    const systemPrompt = await getSystemPrompt();
    // Sử dụng gemini-3.5-flash-lite thế hệ mới nhất có hỗ trợ lập luận tốt hơn và rất ổn định
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3.5-flash-lite',
      systemInstruction: systemPrompt
    });

    // Tạo mảng contents hội thoại tuần tự xen kẽ (user - model) đúng chuẩn Gemini API
    const contents = [];
    let lastRole = null;

    if (Array.isArray(history)) {
      for (const msg of history) {
        const role = msg.role === 'model' ? 'model' : 'user';
        if (role !== lastRole) {
          contents.push({
            role: role,
            parts: msg.parts || [{ text: msg.text || '' }]
          });
          lastRole = role;
        }
      }
    }

    // Nếu tin nhắn cuối cùng trong lịch sử trùng role với tin nhắn sắp gửi (user), hãy bỏ tin nhắn trùng đó để tránh lỗi API
    if (lastRole === 'user') {
      if (contents.length > 0) {
        contents.pop();
      }
    }

    // Đưa tin nhắn hiện tại của bệnh nhân vào cuối cuộc hội thoại
    contents.push({ role: 'user', parts: [{ text: message }] });

    const result = await model.generateContent({
      contents: contents,
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.4,
      },
    });

    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.warn('Gemini API Error (falling back to Local NLP):', error.message);
    try {
      // Fallback: Sử dụng AI Nội bộ Node-NLP
      const localReply = await localProcessMessage(message);
      return localReply;
    } catch (fallbackError) {
      console.error('Fallback NLP Error:', fallbackError);
      return 'Dạ, hiện tại kết nối với hệ thống y tế đang gặp sự cố. Anh/chị vui lòng thử lại sau hoặc gọi tổng đài 1900 2115 để được hỗ trợ trực tiếp ạ!';
    }
  }
};

module.exports = {
  askGemini,
};
