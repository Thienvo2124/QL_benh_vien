const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key_123";

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      req.user = jwt.verify(token, JWT_SECRET);
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Token không hợp lệ." });
    }
  }

  return res.status(401).json({ message: "Vui lòng đăng nhập để tiếp tục." });
};

const adminOrDoctorOnly = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "doctor")) {
    return next();
  }

  return res.status(403).json({ message: "Bạn không có quyền thực hiện chức năng này." });
};

module.exports = { protect, adminOrDoctorOnly };
