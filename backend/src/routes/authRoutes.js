const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

// Đăng ký (Register)
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được sử dụng.' });
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo user mới
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            role: role || 'patient'
        });

        await newUser.save();

        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Đăng nhập (Login)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Tìm user theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        // Tạo JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' } // Hết hạn trong 1 ngày
        );

        res.json({
            message: 'Đăng nhập thành công!',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

module.exports = router;
