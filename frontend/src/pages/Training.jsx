import React from "react";

function Training() {
  const courses = [
    { icon: "🩺", title: "Nội soi tiêu hóa chuyên sâu", date: "15/06/2026", slots: "20 chỗ", status: "Đang mở đăng ký" },
    { icon: "🫀", title: "Siêu âm tim nâng cao", date: "01/07/2026", slots: "15 chỗ", status: "Đang mở đăng ký" },
    { icon: "🧠", title: "Điều trị đột quỵ cấp tính", date: "20/07/2026", slots: "25 chỗ", status: "Sắp mở" },
    { icon: "🦷", title: "Cấy ghép Implant nha khoa", date: "10/08/2026", slots: "10 chỗ", status: "Sắp mở" },
  ];

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>

      {/* HERO */}
      <section className="bg-gradient-to-r from-[#004e92] to-[#1565c0] py-6 px-4">
  <div className="container mx-auto">
    <h1 className="text-4xl font-extrabold text-white uppercase tracking-wide mb-3">
      ĐÀO TẠO
    </h1>
    <p className="text-blue-100 text-lg">
      Nâng cao chuyên môn đội ngũ y tế
    </p>
  </div>
</section>

      {/* CONTENT */}
      <div style={{ padding: "40px", background: "#f5f7fb" }}>
        <h2 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>
          Các khóa đào tạo 2026
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20
          }}
        >
          {courses.map((c, i) => (
            <div
              key={i}
              style={{
                background: "white",
                padding: 20,
                borderRadius: 12,
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                display: "flex",
                gap: 15
              }}
            >
              <div style={{ fontSize: 40 }}>{c.icon}</div>

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 16, fontWeight: "bold", marginBottom: 6 }}>
                  {c.title}
                </h3>

                <p style={{ fontSize: 13, color: "#666" }}>
                  📅 Khai giảng: {c.date}
                </p>

                <p style={{ fontSize: 13, color: "#666" }}>
                  👥 Số lượng: {c.slots}
                </p>

                <span
                  style={{
                    display: "inline-block",
                    marginTop: 10,
                    padding: "4px 10px",
                    borderRadius: 20,
                    fontSize: 12,
                    background:
                      c.status === "Đang mở đăng ký" ? "#e8f5e9" : "#fff3e0",
                    color:
                      c.status === "Đang mở đăng ký" ? "#2e7d32" : "#ef6c00"
                  }}
                >
                  {c.status}
                </span>

                {c.status === "Đang mở đăng ký" && (
                  <button
                    style={{
                      marginTop: 12,
                      padding: "6px 12px",
                      background: "#004e92",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer"
                    }}
                  >
                    Đăng ký ngay
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Training;