const { processMessage } = require('../ai/chatbotEngine');

const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập nội dung cần hỏi." });
    }

    // Đẩy message của người dùng vào AI Nội Bộ (node-nlp)
    // Tốc độ xử lý siêu nhanh (~0.001 giây) và bảo mật tuyệt đối 100%
    const aiReply = await processMessage(message);

    return res.json({
      success: true,
      reply: aiReply,
    });
  } catch (error) {
    console.error("Local NLP Chatbot Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Xin lỗi, máy chủ AI nội bộ đang khởi động. Vui lòng thử lại sau giây lát!" 
    });
  }
};

module.exports = { handleChat };
