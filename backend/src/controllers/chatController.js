const { askGemini } = require('../ai/geminiEngine');
const ChatFeedback = require('../models/ChatFeedback');

// Người dùng gửi tin nhắn hỏi AI
const handleChat = async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập nội dung cần hỏi." });
    }

    // Xử lý bằng trí tuệ nhân tạo Gemini
    const aiReply = await askGemini(message);

    // Lưu lại cuộc hội thoại vào Database để phục vụ Feedback Loop
    const feedbackLog = new ChatFeedback({
      message,
      aiResponse: aiReply,
      user: userId || null,
    });

    await feedbackLog.save();

    return res.json({
      success: true,
      reply: aiReply,
      messageId: feedbackLog._id, // Trả về ID để FE có thể chấm điểm (Like/Dislike)
    });
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Xin lỗi, máy chủ AI đang bận xử lý. Vui lòng thử lại sau giây lát!" 
    });
  }
};

// Người dùng đánh giá (Like / Dislike) câu trả lời của AI
const handleRateMessage = async (req, res) => {
  try {
    const { messageId, rating } = req.body; // rating: 'like' hoặc 'dislike'

    if (!messageId || !['like', 'dislike'].includes(rating)) {
      return res.status(400).json({ success: false, message: "Dữ liệu đánh giá không hợp lệ." });
    }

    const updated = await ChatFeedback.findByIdAndUpdate(
      messageId,
      { rating },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Không tìm thấy tin nhắn cần đánh giá." });
    }

    return res.json({ success: true, message: "Cảm ơn bạn đã đóng góp ý kiến!", data: updated });
  } catch (error) {
    console.error("Rate Message Error:", error);
    return res.status(500).json({ success: false, message: "Không thể gửi đánh giá." });
  }
};

// Admin lấy danh sách câu hỏi bị chê (dislike) hoặc chưa được sửa để duyệt
const getQueriesForAdmin = async (req, res) => {
  try {
    // Ưu tiên các câu bị đánh giá 'dislike' trước, sau đó tới các câu chưa được sửa (isCorrected = false)
    const queries = await ChatFeedback.find({
      $or: [
        { rating: 'dislike', isCorrected: false },
        { isCorrected: false }
      ]
    })
    .sort({ rating: 1, createdAt: -1 }) // Sắp xếp dislike lên đầu, mới nhất lên đầu
    .limit(100);

    return res.json(queries);
  } catch (error) {
    console.error("Get Admin Queries Error:", error);
    return res.status(500).json({ success: false, message: "Không thể tải danh sách câu hỏi." });
  }
};

// Admin sửa câu trả lời chuẩn (Huấn luyện AI)
const correctQuery = async (req, res) => {
  try {
    const { messageId, correctedResponse } = req.body;

    if (!messageId || !correctedResponse) {
      return res.status(400).json({ success: false, message: "Dữ liệu sửa đổi không hợp lệ." });
    }

    const updated = await ChatFeedback.findByIdAndUpdate(
      messageId,
      {
        correctedResponse,
        isCorrected: true
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Không tìm thấy câu hỏi cần sửa đổi." });
    }

    return res.json({ success: true, message: "AI đã học được câu trả lời mới thành công!", data: updated });
  } catch (error) {
    console.error("Correct Query Error:", error);
    return res.status(500).json({ success: false, message: "Lỗi lưu thông tin huấn luyện." });
  }
};

module.exports = {
  handleChat,
  handleRateMessage,
  getQueriesForAdmin,
  correctQuery,
};
