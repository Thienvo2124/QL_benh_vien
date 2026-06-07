const { GoogleGenerativeAI } = require('@google/generative-ai');

// Cấu hình Gemini API (Lấy key từ .env)
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Khởi tạo model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Lịch sử chat mẫu (để AI hiểu ngữ cảnh là y tế)
const getSystemPrompt = () => {
    return "Bạn là trợ lý AI ảo của Bệnh viện Nhân Dân. " +
           "Nhiệm vụ của bạn là tư vấn sức khỏe cơ bản, hướng dẫn đặt lịch khám, " +
           "và giải thích các thuật ngữ y khoa đơn giản dựa trên tài liệu. " +
           "Nếu câu hỏi nằm ngoài phạm vi y tế, hãy từ chối trả lời lịch sự. " +
           "Luôn nhắc nhở người dùng rằng lời khuyên của bạn chỉ mang tính tham khảo và họ nên đến gặp bác sĩ để được chẩn đoán chính xác.";
};

const handleChat = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        // Nếu chưa có cấu hình API Key, trả về lỗi giả lập
        if (!apiKey) {
             return res.status(500).json({ 
                 success: false, 
                 message: 'Chưa cấu hình GEMINI_API_KEY trong file .env của backend.' 
             });
        }

        const chat = model.startChat({
            history: history || [],
        });

        const prompt = `${getSystemPrompt()}\n\nCâu hỏi của người dùng: ${message}`;
        const result = await chat.sendMessage(prompt);
        const responseText = result.response.text();

        res.json({
            success: true,
            reply: responseText
        });
    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi gọi AI. Vui lòng thử lại sau.' });
    }
};

module.exports = {
    handleChat
};
