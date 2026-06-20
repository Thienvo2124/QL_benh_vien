import React, { useState } from "react";

/* ── Design tokens ── */
const C = {
  navy: "#004e92",
  white: "#ffffff",
  textLight: "#546e7a",
  text: "#1a1a2e",
  gold: "#f5a623",
};

const reviews = [
  {
    name: "Nguyễn Thị Lan",
    role: "Bệnh nhân Khoa Sản",
    avatar: "👩",
    rating: 5,
    text:
      "Tôi sinh con tại đây và được các bác sĩ, điều dưỡng chăm sóc rất tận tâm. Quy trình đặt lịch online tiện lợi, không phải chờ đợi lâu như trước.",
  },
  {
    name: "Trần Văn Minh",
    role: "Bệnh nhân Khoa Tim mạch",
    avatar: "👨",
    rating: 5,
    text:
      "Tôi được can thiệp tim mạch kịp thời nhờ đội ngũ bác sĩ giàu kinh nghiệm và trang thiết bị hiện đại. Cảm ơn bệnh viện đã cho tôi cơ hội sống khỏe mạnh.",
  },
  {
    name: "Lê Thị Hương",
    role: "Bệnh nhân Khoa Nhi",
    avatar: "👩",
    rating: 5,
    text:
      "Con tôi được khám và điều trị rất nhanh chóng. Các y bác sĩ nhẹ nhàng, vui vẻ với trẻ nhỏ nên bé không sợ đi khám bệnh nữa.",
  },
  {
    name: "Phạm Quốc Đạt",
    role: "Bệnh nhân Khoa Ngoại",
    avatar: "👨",
    rating: 4,
    text:
      "Dịch vụ chuyên nghiệp, giá cả hợp lý. Tôi đặc biệt thích tính năng chatbot AI tư vấn trước khi đặt lịch, giúp tôi chọn đúng chuyên khoa cần khám.",
  },
];

function Stars({ count }) {
  return (
    <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < count ? C.gold : "#e0e0e0", fontSize: 16 }}>
          ★
        </span>
      ))}
    </div>
  );
}

function Testimonials() {
  const [active, setActive] = useState(0);

  const next = () => setActive((a) => (a + 1) % reviews.length);
  const prev = () => setActive((a) => (a - 1 + reviews.length) % reviews.length);

  return (
    <section
      style={{
        padding: "64px 40px",
        background: `linear-gradient(135deg, ${C.navy} 0%, #1565c0 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.06,
          backgroundImage:
            "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)",
          backgroundSize: "20px 20px",
        }}
      />

      <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <span
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              padding: "6px 18px",
              borderRadius: 20,
              marginBottom: 14,
            }}
          >
            BỆNH NHÂN NÓI VỀ CHÚNG TÔI
          </span>
          <h2
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: "#fff",
              fontFamily: "Georgia, serif",
              margin: 0,
            }}
          >
            Cảm Nhận Từ Người Bệnh
          </h2>
        </div>

        {/* Slider card */}
        <div
          style={{
            background: C.white,
            borderRadius: 20,
            padding: "44px 48px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
            position: "relative",
          }}
        >
          {/* Quote icon */}
          <div
            style={{
              fontSize: 60,
              color: "#e3f0fc",
              position: "absolute",
              top: 16,
              left: 24,
              fontFamily: "Georgia, serif",
              lineHeight: 1,
            }}
          >
            "
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <Stars count={reviews[active].rating} />
            <p
              style={{
                fontSize: 17,
                color: C.text,
                lineHeight: 1.8,
                marginBottom: 28,
                fontStyle: "italic",
                minHeight: 90,
              }}
            >
              {reviews[active].text}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "#e3f0fc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  flexShrink: 0,
                }}
              >
                {reviews[active].avatar}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: C.navy, fontSize: 15 }}>
                  {reviews[active].name}
                </div>
                <div style={{ color: C.textLight, fontSize: 13 }}>{reviews[active].role}</div>
              </div>
            </div>
          </div>

          {/* Nav arrows */}
          <div
            style={{
              position: "absolute",
              bottom: 32,
              right: 40,
              display: "flex",
              gap: 10,
            }}
          >
            <button
              onClick={prev}
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                border: `1.5px solid ${C.navy}`,
                background: "#fff",
                color: C.navy,
                cursor: "pointer",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ←
            </button>
            <button
              onClick={next}
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                border: "none",
                background: C.navy,
                color: "#fff",
                cursor: "pointer",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              →
            </button>
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? 24 : 8,
                height: 8,
                borderRadius: 4,
                border: "none",
                background: i === active ? "#fff" : "rgba(255,255,255,0.4)",
                cursor: "pointer",
                transition: "width .2s",
              }}
            />
          ))}
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 80,
            marginTop: 60,
            flexWrap: "wrap",
          }}
        >
          {[
            ["4.9/5", "Điểm hài lòng"],
            ["12,000+", "Lượt đánh giá"],
            ["98%", "Sẽ giới thiệu bạn bè"],
          ].map(([num, label], i) => (
            <div
              key={i}
              style={{
              textAlign: "center",
              minWidth: 180,
              }}
            >
            <div
              style={{
                fontSize: 42,
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1,
              }}
            >
            {num}
          </div>

          <div
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.85)",
              marginTop: 10,
              fontWeight: 500,
            }}
          >
          {label}
          </div>
        </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;