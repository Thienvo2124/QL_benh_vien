const express = require('express');
const router = express.Router();
const { handleChat, handleRateMessage, getQueriesForAdmin, correctQuery } = require('../controllers/chatController');

// Xử lý chat y tế
router.post('/', handleChat);

// Bệnh nhân chấm điểm (Like / Dislike) câu trả lời của AI
router.post('/rate', handleRateMessage);

// Admin lấy danh sách câu hỏi cần duyệt
router.get('/admin/queries', getQueriesForAdmin);

// Admin sửa câu trả lời chuẩn (huấn luyện AI)
router.put('/admin/correct', correctQuery);

module.exports = router;
