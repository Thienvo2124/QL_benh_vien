import React, { useState } from "react";

/**
 * Register
 * Dùng bên trong AuthModal — không còn navigate('/login'),
 * thay vào đó dùng props onClose / onSwitch để điều khiển modal.
 *
 * Props:
 *  - onClose: () => void     đóng modal
 *  - onSwitch: () => void    chuyển sang form Đăng nhập sau khi đăng ký thành công
 */
const Register = ({ onClose = () => {}, onSwitch = () => {} }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "https://ql-benh-vien.onrender.com"}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // Đăng ký mặc định role là patient
          body: JSON.stringify({ fullName, email, password, role: "patient" }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        onSwitch(); // chuyển sang form đăng nhập trong cùng modal
      } else {
        setError(data.message || "Đăng ký thất bại.");
      }
    } catch (err) {
      setError("Lỗi kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-[440px] max-w-[92vw] p-8">
      <div className="text-center">
        <span className="text-2xl font-extrabold text-[#004e92]">Bệnh viện Nhân Dân</span>
        <h2 className="mt-4 text-xl font-bold text-gray-900">Đăng ký tài khoản</h2>
      </div>

      <form className="space-y-5 mt-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
          <input
            type="text"
            required
            autoFocus
            className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004e92]/30 focus:border-[#004e92] text-sm transition-all"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nguyễn Văn A"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004e92]/30 focus:border-[#004e92] text-sm transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <input
            type="password"
            required
            className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004e92]/30 focus:border-[#004e92] text-sm transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2.5 px-4 rounded-lg shadow-sm text-sm font-semibold text-white bg-[#004e92] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#004e92] disabled:bg-gray-400 transition-colors"
        >
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-400">Hoặc</span>
          </div>
        </div>

        <div className="mt-5 text-center text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="font-semibold text-[#004e92] hover:underline"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;