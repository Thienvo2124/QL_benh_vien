import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

/* ── Design tokens ── */
const C = {
  navy: "#004e92",
  white: "#ffffff",
  textLight: "#546e7a",
  text: "#1a1a2e",
  red: "#d32f2f",
  green: "#2e7d32",
};

const styles = {
  
  section: { padding: "56px 40px" },
  sectionTitle: { fontSize: 22, fontWeight: 700, color: C.navy, marginBottom: 8 },
  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: "1.5px solid #e0e0e0",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  label: { fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6, display: "block" },
  formCard: {
    background: C.white,
    borderRadius: 16,
    padding: 32,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  },
};

function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "Đặt lịch khám", message: "" });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#004e92] to-[#1565c0] py-6 px-4">
  <div className="container mx-auto">
    <h1 className="text-4xl font-extrabold text-white uppercase tracking-wide mb-3">
      Liên Hệ
    </h1>
    <p className="text-blue-100 text-lg">
      Chúng tôi luôn sẵn sàng hỗ trợ bạn
    </p>
  </div>
</section>

      {/* Body */}
      <div style={{ ...styles.section, background: C.white }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          {/* Contact info */}
          <div>
            <h2 style={styles.sectionTitle}>Thông tin liên hệ</h2>
            {[
              ["📍", "Địa chỉ", "Số 1 Nơ Trang Long, Phường Gia Định, Quận Bình Thạnh, TP. Hồ Chí Minh"],
              ["📞", "Đường dây nóng", "1900 2115 (7h00 – 17h00, Thứ 2 – Thứ 6)"],
              ["🚨", "Cấp cứu 24/7", "(028) 3551 0063"],
              ["✉️", "Email", "info@bvndgiadinh.org.vn"],
              ["🕐", "Giờ làm việc", "Thứ 2 – Thứ 6: 7:00 – 17:00 | Thứ 7: 7:00 – 12:00"],
            ].map(([icon, label, value]) => (
              <div
                key={label}
                style={{ display: "flex", gap: 16, marginBottom: 24, alignItems: "flex-start" }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "#e3f0fc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: C.navy, fontSize: 14, marginBottom: 4 }}>
                    {label}
                  </div>
                  <div style={{ color: C.textLight, fontSize: 14, lineHeight: 1.6 }}>{value}</div>
                </div>
              </div>
            ))}

            {/* Map placeholder */}
            <div
              style={{
                marginTop: 24,
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid #e0e0e0",
                height: 220,
              }}
            >
              <iframe
                title="Bản đồ Bệnh viện Nhân dân Gia Định"
                src="https://www.google.com/maps?q=B%E1%BB%87nh%20vi%E1%BB%87n%20Nh%C3%A2n%20D%C3%A2n%20Gia%20%C4%90%E1%BB%8Bnh&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Contact form */}
          <div style={styles.formCard}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
                <h3 style={{ color: C.green, fontWeight: 700, marginBottom: 10 }}>
                  Gửi thành công!
                </h3>
                <p style={{ color: C.textLight }}>Chúng tôi sẽ phản hồi trong vòng 24 giờ.</p>
                <button
                  style={{
                    marginTop: 20,
                    background: C.navy,
                    color: "#fff",
                    padding: "10px 22px",
                    borderRadius: 8,
                    border: "none",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  onClick={() => setSent(false)}
                >
                  Gửi tin nhắn khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ color: C.navy, fontWeight: 700, fontSize: 20, marginBottom: 24 }}>
                  Gửi tin nhắn cho chúng tôi
                </h3>

                <div style={{ marginBottom: 16 }}>
                  <label style={styles.label}>Họ và tên *</label>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    required
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={styles.label}>Email *</label>
                  <input
                    style={styles.input}
                    type="email"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    required
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={styles.label}>Số điện thoại</label>
                  <input
                    style={styles.input}
                    type="tel"
                    placeholder="09xxxxxxxx"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={styles.label}>Chủ đề</label>
                  <select
                    style={styles.input}
                    value={form.subject}
                    onChange={(e) => set("subject", e.target.value)}
                  >
                    <option>Đặt lịch khám</option>
                    <option>Tư vấn dịch vụ</option>
                    <option>Khiếu nại</option>
                    <option>Khác</option>
                  </select>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={styles.label}>Nội dung *</label>
                  <textarea
                    style={{ ...styles.input, height: 110, resize: "vertical" }}
                    placeholder="Nội dung cần liên hệ..."
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    background: C.navy,
                    color: "#fff",
                    padding: 14,
                    fontSize: 15,
                    borderRadius: 8,
                    border: "none",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  📨 Gửi tin nhắn
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

    </>
  );
}

export default Contact;