const express = require('express');
const News = require('../models/News');
const { protect, adminOrDoctorOnly } = require('../middleware/authMiddleware');
const router = express.Router();

// GET public - tin dang hien cho trang chu
router.get('/', async (req, res) => {
  try {
    const news = await News.find({ isVisible: true }).sort({ isPinned: -1, createdAt: -1 }).limit(Number(req.query.limit) || 100);
    res.json(news);
  } catch (err) { res.status(500).json({ message: 'Loi may chu', error: err.message }); }
});

// GET admin - tat ca tin
router.get('/all', protect, adminOrDoctorOnly, async (req, res) => {
  try {
    const news = await News.find().sort({ isPinned: -1, createdAt: -1 });
    res.json(news);
  } catch (err) { res.status(500).json({ message: 'Loi may chu', error: err.message }); }
});

// POST - them bai moi
router.post('/', protect, adminOrDoctorOnly, async (req, res) => {
  try {
    const { title, summary, content, imageUrl, category, author, isPinned, isVisible } = req.body;
    if (!title) return res.status(400).json({ message: 'Tieu de khong duoc de trong.' });
    const item = new News({ title, summary, content, imageUrl, category, author, isPinned, isVisible });
    await item.save();
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ message: 'Loi may chu', error: err.message }); }
});

// PUT - sua bai
router.put('/:id', protect, adminOrDoctorOnly, async (req, res) => {
  try {
    const updated = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Khong tim thay bai tin.' });
    res.json(updated);
  } catch (err) { res.status(500).json({ message: 'Loi may chu', error: err.message }); }
});

// PATCH - toggle an/hien
router.patch('/:id/toggle', protect, adminOrDoctorOnly, async (req, res) => {
  try {
    const item = await News.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Khong tim thay bai tin.' });
    item.isVisible = !item.isVisible;
    await item.save();
    res.json({ isVisible: item.isVisible });
  } catch (err) { res.status(500).json({ message: 'Loi may chu', error: err.message }); }
});

// DELETE - xoa bai
router.delete('/:id', protect, adminOrDoctorOnly, async (req, res) => {
  try {
    const deleted = await News.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Khong tim thay bai tin.' });
    res.json({ message: 'Da xoa bai tin.' });
  } catch (err) { res.status(500).json({ message: 'Loi may chu', error: err.message }); }
});

module.exports = router;
