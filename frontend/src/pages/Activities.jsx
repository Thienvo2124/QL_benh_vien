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
};

const styles = {

  section: { padding: "56px 40px" },
  sectionTitle: { fontSize: 24, fontWeight: 700, color: C.navy, marginBottom: 8 },
  sectionSub: { color: C.textLight, marginBottom: 28, fontSize: 14 },
  filterBtn: {
    padding: "8px 18px",
    borderRadius: 20,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
    fontFamily: "inherit",
  },
  newsCard: {
    background: C.white,
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    cursor: "pointer",
    transition: "transform .2s, box-shadow .2s",
  },
};

const newsData = [
  {
    id: 1,
    icon: "🔬",
    badge: "Tin Mới",
    date: "21/05/2026",
    author: "Phạm Khánh Nhật",
    title:
      "Biện pháp bảo vệ nam giới trước sùi mào gà sinh dục không phải ai cũng biết!",
    cat: "Sức khoẻ",
  },
  {
    id: 2,
    icon: "🏆",
    badge: "Tin Mới",
    date: "21/05/2026",
    author: "Phạm Khánh Nhật",
    title: 'Thông báo kết quả xét chọn danh hiệu "Thầy thuốc ưu tú" lần thứ 15',
    cat: "Thông báo",
  },
  {
    id: 3,
    icon: "❤️",
    badge: "Tin Mới",
    date: "20/05/2026",
    author: "Phạm Khánh Nhật",
    title: "Bệnh viện Nhân dân đồng hành chăm sóc sức khỏe sinh sản cộng đồng",
    cat: "Hoạt động",
  },
  {
    id: 4,
    icon: "💉",
    badge: "Sự kiện",
    date: "18/05/2026",
    author: "Ban Truyền thông",
    title:
      "Chương trình tiêm phòng miễn phí cho trẻ em dưới 5 tuổi tháng 6/2026",
    cat: "Sự kiện",
  },
  {
    id: 5,
    icon: "🧬",
    badge: "Nghiên cứu",
    date: "15/05/2026",
    author: "TS.BS. Lê Văn Hùng",
    title: "Kết quả nghiên cứu ứng dụng AI trong chẩn đoán đột quỵ sớm",
    cat: "Khoa học",
  },
  {
    id: 6,
    icon: "🎓",
    badge: "Đào tạo",
    date: "10/05/2026",
    author: "Phòng Đào tạo",
    title: "Khai mạc khóa đào tạo chuyên sâu nội soi tiêu hóa lần thứ 8",
    cat: "Đào tạo",
  },
];

const CATS = ["Tất cả", "Tin Mới", "Hoạt động", "Sự kiện", "Khoa học", "Đào tạo"];

function Activities() {
  const [cat, setCat] = useState("Tất cả");
  const filtered = newsData.filter(
    (n) => cat === "Tất cả" || n.badge === cat || n.cat === cat
  );

  return (
    <>

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#004e92] to-[#1565c0] py-6 px-4">
  <div className="container mx-auto">
    <h1 className="text-4xl font-extrabold text-white uppercase tracking-wide mb-3">
     Hoạt động
    </h1>
    <p className="text-blue-100 text-lg">
      Cập nhật thông tin mới nhất từ Bệnh viện Nhân Dân
    </p>
  </div>
</section>

      {/* Body */}
      <div style={{ ...styles.section, background: "#f9fafb" }}>
        {/* Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{
                ...styles.filterBtn,
                background: cat === c ? C.navy : C.white,
                color: cat === c ? C.white : C.text,
                boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {filtered.map((n) => (
            <div
              key={n.id}
              style={styles.newsCard}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
            >
              <div
                style={{
                  height: 180,
                  background: "#e3f0fc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 64,
                }}
              >
                {n.icon}
              </div>
              <div style={{ padding: 20 }}>
                <span
                  style={{
                    background: "#d32f2f",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 20,
                    display: "inline-block",
                    marginBottom: 10,
                  }}
                >
                  {n.badge}
                </span>
                <div style={{ fontSize: 12, color: C.textLight, marginBottom: 10 }}>
                  📅 {n.date} &nbsp; 👤 {n.author}
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    color: C.text,
                    fontSize: 15,
                    lineHeight: 1.5,
                    marginBottom: 14,
                  }}
                >
                  {n.title}
                </div>
                <span style={{ color: "#1565c0", fontWeight: 600, fontSize: 13 }}>
                  XEM CHI TIẾT →
                </span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: C.textLight }}>
            Không có tin tức nào trong danh mục này.
          </div>
        )}
      </div>
    </>
  );
}

export default Activities;