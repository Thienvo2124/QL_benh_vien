const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI?.getGenerativeModel({ model: "gemini-2.5-flash" });

const getSystemPrompt = () =>
  "Bạn là trợ lý AI ảo của Bệnh viện Nhân Dân. " +
  "Tư vấn sức khỏe cơ bản và hướng dẫn đặt lịch. " +
  "TUYỆT ĐỐI trả lời ngắn gọn nhất có thể (chỉ 1-2 câu). KHÔNG chào hỏi rườm rà. " +
  "Chỉ thêm lưu ý đi khám bác sĩ nếu người dùng hỏi về bệnh lý cụ thể. Từ chối trả lời nếu ngoài lề y tế.";

const handleChat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập nội dung cần hỏi." });
    }

    if (!apiKey || !model) {
      return res.status(500).json({
        success: false,
        message: "Chưa cấu hình GEMINI_API_KEY trong file .env của backend.",
      });
    }

    const chat = model.startChat({ history: history || [] });
    const prompt = `${getSystemPrompt()}\n\nCâu hỏi của người dùng: ${message}`;
    const result = await chat.sendMessage(prompt);

    return res.json({
      success: true,
      reply: result.response.text(),
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    return res.status(500).json({ success: false, message: "Lỗi khi gọi AI. Vui lòng thử lại sau." });
  }
};

module.exports = { handleChat };
