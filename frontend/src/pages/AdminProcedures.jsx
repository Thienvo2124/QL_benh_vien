import React from "react";
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
};

const styles = {
  
  section: { padding: "56px 40px" },
  sectionTitle: { fontSize: 22, fontWeight: 700, color: C.navy, marginBottom: 16 },
  card: {
    background: C.white,
    borderRadius: 12,
    border: "1px solid #e0e0e0",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  stepBox: {
    display: "flex",
    gap: 20,
    alignItems: "flex-start",
    background: C.white,
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    marginBottom: 16,
  },
  stepNum: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: C.navy,
    color: C.white,
    fontWeight: 800,
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
};

const steps = [
  {
    title: "Lấy số thứ tự",
    desc: "Bệnh nhân đến quầy tiếp đón hoặc lấy số trực tuyến qua hệ thống HMOAS. Khai báo thông tin và nhận phiếu khám.",
  },
  {
    title: "Đo sinh hiệu",
    desc: "Y tá đo các chỉ số sinh tồn: huyết áp, nhiệt độ, nhịp tim, cân nặng, chiều cao trước khi vào gặp bác sĩ.",
  },
  {
    title: "Khám bác sĩ",
    desc: "Bác sĩ tiến hành khám lâm sàng, hỏi tiền sử bệnh và đưa ra chỉ định xét nghiệm hoặc điều trị.",
  },
  {
    title: "Thực hiện xét nghiệm / CĐHA",
    desc: "Nếu có chỉ định, bệnh nhân đến phòng xét nghiệm hoặc chẩn đoán hình ảnh để làm các kiểm tra cần thiết.",
  },
  {
    title: "Nhận kết quả & tái khám bác sĩ",
    desc: "Bệnh nhân nhận kết quả xét nghiệm và quay lại gặp bác sĩ để được chẩn đoán chính xác và kê đơn điều trị.",
  },
  {
    title: "Thanh toán viện phí",
    desc: "Bệnh nhân đến quầy thu ngân để thanh toán viện phí hoặc thanh toán trực tuyến qua VNPay/MoMo.",
  },
  {
    title: "Nhận thuốc & hướng dẫn",
    desc: "Bệnh nhân đến quầy phát thuốc, nhận đơn thuốc điện tử và được hướng dẫn cách dùng thuốc, lịch tái khám.",
  },
];

const documents = [
  {
    icon: "🆔",
    title: "Hồ sơ nhập viện",
    items: [
      "CMND/CCCD hoặc Hộ chiếu (bản chính + bản sao)",
      "Thẻ bảo hiểm y tế (nếu có)",
      "Giấy giới thiệu chuyển viện (nếu có)",
      "Sổ khám bệnh / kết quả khám trước đó (nếu có)",
    ],
  },
  {
    icon: "💳",
    title: "Thủ tục thanh toán BHYT",
    items: [
      "Thẻ BHYT còn hiệu lực",
      "CMND/CCCD trùng khớp thông tin trên thẻ",
      "Giấy chuyển viện đúng tuyến (nếu khám vượt tuyến cần giấy chuyển)",
      "Thanh toán phần không được BHYT chi trả tại quầy thu ngân",
    ],
  },
  {
    icon: "📝",
    title: "Thủ tục xuất viện",
    items: [
      "Hoàn tất thanh toán viện phí tại quầy thu ngân",
      "Nhận giấy ra viện và đơn thuốc (nếu có) tại khoa điều trị",
      "Nhận lại hồ sơ, giấy tờ tùy thân đã lưu (nếu có)",
      "Đặt lịch tái khám theo hướng dẫn của bác sĩ",
    ],
  },
  {
    icon: "📄",
    title: "Xin cấp giấy chứng nhận",
    items: [
      "Giấy chứng nhận nghỉ việc hưởng BHXH: liên hệ phòng Kế hoạch tổng hợp",
      "Giấy chứng nhận sức khỏe: đăng ký khám tại khoa Khám bệnh",
      "Bản sao hồ sơ bệnh án: nộp đơn tại phòng Kế hoạch tổng hợp, thời gian xử lý 3-5 ngày làm việc",
    ],
  },
];

function AdminProcedures() {
  return (
    <>

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#004e92] to-[#1565c0] py-6 px-4">
  <div className="container mx-auto">
    <h1 className="text-4xl font-extrabold text-white uppercase tracking-wide mb-3">
      Thủ tục hành chính
    </h1>
    <p className="text-blue-100 text-lg">
      Hướng dẫn quy trình và hồ sơ cần thiết khi khám, điều trị
    </p>
  </div>
</section>

      {/* Quy trình khám bệnh */}
      <div style={{ ...styles.section, background: C.white, maxWidth: 780, margin: "0 auto" }}>
        <h2 style={styles.sectionTitle}>Quy trình khám bệnh ngoại trú</h2>
        {steps.map((s, i) => (
          <div key={i} style={styles.stepBox}>
            <div style={styles.stepNum}>{i + 1}</div>
            <div>
              <div style={{ fontWeight: 700, color: C.navy, fontSize: 16, marginBottom: 6 }}>
                {s.title}
              </div>
              <div style={{ color: C.textLight, fontSize: 14, lineHeight: 1.7 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Giấy tờ cần thiết */}
      <div style={{ ...styles.section, background: "#f9fafb" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ ...styles.sectionTitle, textAlign: "center" }}>
            Hồ Sơ & Giấy Tờ Cần Thiết
          </h2>
          <p style={{ textAlign: "center", color: C.textLight, marginBottom: 32 }}>
            Chuẩn bị đầy đủ giấy tờ giúp quá trình khám/điều trị nhanh chóng hơn
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 24,
            }}
          >
            {documents.map((d, i) => (
              <div key={i} style={{ ...styles.card, padding: 28 }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{d.icon}</div>
                <div style={{ fontWeight: 700, color: C.navy, fontSize: 17, marginBottom: 14 }}>
                  {d.title}
                </div>
                <ul style={{ paddingLeft: 18, margin: 0 }}>
                  {d.items.map((item, j) => (
                    <li
                      key={j}
                      style={{
                        color: C.textLight,
                        fontSize: 14,
                        lineHeight: 1.8,
                        marginBottom: 6,
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Liên hệ hỗ trợ */}
      <div style={{ ...styles.section, background: C.white }}>
        <div
          style={{
            maxWidth: 780,
            margin: "0 auto",
            background: "#e3f0fc",
            borderLeft: `4px solid ${C.navy}`,
            borderRadius: "0 12px 12px 0",
            padding: "24px 28px",
          }}
        >
          <div style={{ fontWeight: 700, color: C.navy, fontSize: 16, marginBottom: 8 }}>
            📞 Cần hỗ trợ thêm về thủ tục?
          </div>
          <p style={{ color: C.textLight, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            Liên hệ Phòng Kế hoạch tổng hợp – Bệnh viện Nhân dân Gia Định
            <br />
            Hotline: <strong>1900 2115</strong> &nbsp;|&nbsp; Email:{" "}
            <strong>info@bvndgiadinh.org.vn</strong>
            <br />
            Giờ làm việc: 7h00 – 17h00 (Thứ 2 – Thứ 6)
          </p>
        </div>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link
            to="/dat-lich"
            style={{
              display: "inline-block",
              background: C.red,
              color: "#fff",
              fontWeight: 700,
              padding: "14px 36px",
              borderRadius: 30,
              textDecoration: "none",
              fontSize: 15,
              boxShadow: "0 4px 16px rgba(211,47,47,0.35)",
            }}
          >
            Đặt lịch khám ngay
          </Link>
        </div>
      </div>

    </>
  );
}

export default AdminProcedures;