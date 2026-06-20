import React, { useEffect } from "react";
import Login from "../pages/Login";
import Register from "../pages/Register";

/**
 * AuthModal
 * Hiện đè lên trang hiện tại với nền tối mờ (backdrop).
 * Click ra ngoài modal hoặc nhấn ESC sẽ đóng.
 *
 * Props:
 *  - type: "login" | "register"
 *  - onClose: () => void
 *  - onSwitch: (type) => void   ← chuyển đổi giữa Login/Register trong cùng modal
 */
const AuthModal = ({ type, onClose, onSwitch }) => {
  // Đóng modal khi nhấn ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    // Khóa scroll trang nền khi modal mở
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Click vào backdrop (ngoài modal) thì đóng
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(15, 23, 42, 0.45)" /* nền tối nhẹ */,
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        animation: "authFadeIn 0.2s ease",
        padding: 16,
      }}
    >
      <div
        style={{
          position: "relative",
          animation: "authScaleIn 0.25s cubic-bezier(0.34, 1.2, 0.64, 1)",
          maxHeight: "92vh",
          overflowY: "auto",
          borderRadius: 16,
        }}
        onClick={(e) => e.stopPropagation() /* chặn click trong modal lan ra backdrop */}
      >
        {/* Nút đóng (X) */}
        <button
          onClick={onClose}
          aria-label="Đóng"
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.06)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.12)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.06)")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.4" strokeLinecap="round">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Nội dung: Login hoặc Register */}
        {type === "login" ? (
          <Login onClose={onClose} onSwitch={() => onSwitch("register")} />
        ) : (
          <Register onClose={onClose} onSwitch={() => onSwitch("login")} />
        )}
      </div>

      {/* Keyframes inline (không cần file css riêng) */}
      <style>{`
        @keyframes authFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes authScaleIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AuthModal;