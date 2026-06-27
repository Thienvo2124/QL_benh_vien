require("dotenv").config();

const apiKey = process.env.GEMINI_API_KEY;

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    console.log("Danh sách các models khả dụng:");
    data.models.forEach(m => console.log(`- ${m.name} (Supported methods: ${m.supportedGenerationMethods.join(", ")})`));
  } catch (error) {
    console.error("Lỗi khi lấy danh sách models:", error);
  }
}

listModels();
