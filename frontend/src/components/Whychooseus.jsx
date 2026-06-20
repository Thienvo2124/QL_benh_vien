import React from "react";

/* ── Design tokens ── */
const C = {
  navy: "#004e92",
  white: "#ffffff",
  textLight: "#64748b",
  text: "#1a1a2e",
  bgSoft: "#f4f7fb",
  border: "#eef1f5",
};

/* ════════════════════════════════════════════════════════════
   THAY ẢNH Ở ĐÂY — mỗi card 1 ảnh to (giống layout card tin tức)
   image: "/images/why/jci-standard.jpg"
   hoặc import: import jciImg from "../assets/why/jci.jpg"; rồi image: jciImg
════════════════════════════════════════════════════════════ */
const reasons = [
  {
    image: "/images/why/jci-standard.jpg",     // ← thay ảnh thật
    title: "Tiêu chuẩn JCI quốc tế",
    desc: "Chứng nhận an toàn người bệnh theo chuẩn Hoa Kỳ, được công nhận toàn cầu.",
  },
  {
    image: "/images/why/doctor-team.jpg",      // ← thay ảnh thật
    title: "Đội ngũ chuyên gia hàng đầu",
    desc: "200+ bác sĩ GS, TS, ThS giàu kinh nghiệm trong và ngoài nước.",
  },
  {
    image: "/images/why/ct-scan-room.jpg",     // ← thay ảnh thật
    title: "Công nghệ y khoa hiện đại",
    desc: "Hệ thống CT, MRI, can thiệp tim mạch thế hệ mới nhất.",
  },
  {
    image: "/images/why/ai-diagnosis.jpg",     // ← thay ảnh thật
    title: "Ứng dụng AI chẩn đoán",
    desc: "Trí tuệ nhân tạo hỗ trợ phát hiện sớm đột quỵ, ung thư.",
  },
  {
    image: "/images/why/insurance.jpg",        // ← thay ảnh thật
    title: "Bảo hiểm & thanh toán linh hoạt",
    desc: "Liên kết 30+ công ty bảo hiểm, hỗ trợ thanh toán không tiền mặt.",
  },
  {
    image: "/images/why/emergency-247.jpg",    // ← thay ảnh thật
    title: "Phục vụ 24/7",
    desc: "Khoa cấp cứu và đường dây nóng luôn sẵn sàng hỗ trợ bạn.",
  },
];

const certBadges = [
  { label: "JCI Accredited",   icon: "/images/badges/jci-logo.png" },
  { label: "ISO 15189:2022",   icon: "/images/badges/iso-15189-logo.png" },
  { label: "Bệnh viện hạng I", icon: "/images/badges/hang1-logo.png" },
  { label: "ISO 9001:2015",    icon: "/images/badges/iso-9001-logo.png" },
];

function WhyChooseUs() {
  return (
    <section style={{ padding: "64px 40px", background: C.bgSoft }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <span
            style={{
              display: "inline-block",
              background: "#e8f0fc",
              color: "#0c447c",
              fontSize: 12,
              fontWeight: 600,
              padding: "6px 16px",
              borderRadius: 20,
              marginBottom: 16,
              letterSpacing: 0.3,
            }}
          >
            VÌ SAO CHỌN CHÚNG TÔI
          </span>
          <h2
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: C.text,
              marginBottom: 12,
              fontFamily: "Georgia, serif",
            }}
          >
            Chất lượng đạt chuẩn quốc tế
          </h2>
          <p style={{ color: C.textLight, fontSize: 15, maxWidth: 580, margin: "0 auto" }}>
            Cam kết mang đến dịch vụ y tế an toàn, hiện đại và tận tâm cho mọi bệnh nhân
          </p>
        </div>

        {/* Grid — card kiểu tin tức: ảnh to + badge + nội dung */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {reasons.map((r, i) => (
            <div
              key={i}
              style={{
                background: C.white,
                borderRadius: 16,
                border: `1px solid ${C.border}`,
                overflow: "hidden",
                transition: "transform .25s ease, box-shadow .25s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 16px 32px rgba(15,35,65,0.10)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Ảnh to chiếm hết phần trên */}
              <div style={{ position: "relative", height: 200, background: "#e3f0fc" }}>
                <img
                  src={r.image}
                  alt={r.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                {/* Badge nổi góc trái trên, giống mẫu "Tin Mới" */}
                <span
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    background: C.red,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "5px 14px",
                    borderRadius: 20,
                  }}
                >
                  {r.badge}
                </span>
              </div>

              {/* Nội dung */}
              <div style={{ padding: 24 }}>
                <h3
                  style={{
                    fontSize: 16.5,
                    fontWeight: 700,
                    color: C.text,
                    marginBottom: 10,
                    lineHeight: 1.4,
                  }}
                >
                  {r.title}
                </h3>
                <p
                  style={{
                    fontSize: 13.5,
                    color: C.textLight,
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {r.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Certification badges row — ẢNH THẬT (logo) */}
        <div
          style={{
            marginTop: 44,
            background: C.white,
            borderRadius: 16,
            border: `1px solid ${C.border}`,
            padding: "24px 32px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 48,
            flexWrap: "wrap",
          }}
        >
          {certBadges.map((b, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: C.text,
                fontSize: 13.5,
                fontWeight: 600,
              }}
            >
              <img
                src={b.icon}
                alt={b.label}
                style={{ height: 32, width: "auto", objectFit: "contain" }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              {b.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;