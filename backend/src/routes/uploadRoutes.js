const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, adminOrDoctorOnly } = require('../middleware/authMiddleware');
const router = express.Router();

// Cau hinh luu file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../public/uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1e6) + ext;
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Chi chap nhan file anh.'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/upload - upload 1 anh
router.post('/', protect, adminOrDoctorOnly, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Khong co file nao duoc tai len.' });
  const protocol = req.protocol;
  const host = req.get('host');
  const url = `${protocol}://${host}/uploads/${req.file.filename}`;
  res.json({ url, filename: req.file.filename });
});

module.exports = router;
