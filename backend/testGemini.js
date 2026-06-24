require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ LỖI: Không tìm thấy GEMINI_API_KEY trong file .env");
  process.exit(1);
}

console.log(`🔑 Đang kiểm tra API Key: ${apiKey.slice(0, 10)}...`);

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

async function test() {
  try {
    console.log("🌐 Đang kết nối tới máy chủ Google Gemini API bằng startChat...");
    const chat = model.startChat({ history: [] });
    const prompt = "Bạn là trợ lý AI ảo của Bệnh viện Nhân Dân.\n\nCâu hỏi của người dùng: chào bạn, lịch làm việc khoa mắt là mấy giờ";
    const result = await chat.sendMessage(prompt);
    console.log("✅ KẾT QUẢ THÀNH CÔNG! Phản hồi từ AI:", result.response.text());
  } catch (error) {
    console.error("❌ KẾT QUẢ THẤT BẠI! Lỗi chi tiết:");
    console.error(error);
  }
}

test();
