const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI?.getGenerativeModel({ model: "gemini-2.5-flash" });

const getSystemPrompt = () =>
  "Bạn là trợ lý AI ảo của Bệnh viện Nhân Dân. " +
  "Nhiệm vụ của bạn là tư vấn sức khỏe cơ bản, hướng dẫn đặt lịch khám, " +
  "và giải thích các thuật ngữ y khoa đơn giản dựa trên tài liệu. " +
  "Nếu câu hỏi nằm ngoài phạm vi y tế, hãy từ chối trả lời lịch sự. " +
  "Luôn nhắc nhở người dùng rằng lời khuyên chỉ mang tính tham khảo và người bệnh nên gặp bác sĩ để được chẩn đoán chính xác.";

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
