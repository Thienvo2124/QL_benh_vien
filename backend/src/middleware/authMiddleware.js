const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Lấy token từ header (Format: Bearer <token>)
            token = req.headers.authorization.split(' ')[1];

            // Giải mã token
            const decoded = jwt.verify(token, JWT_SECRET);

            // Gắn thông tin user vào request
            req.user = decoded;

            next();
        } catch (error) {
            res.status(401).json({ message: 'Không có quyền truy cập, token không hợp lệ' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Không có quyền truy cập, vui lòng đăng nhập' });
    }
};

const adminOrDoctorOnly = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'doctor')) {
        next();
    } else {
        res.status(403).json({ message: 'Bạn không có quyền thực hiện chức năng này' });
    }
};

module.exports = { protect, adminOrDoctorOnly };
