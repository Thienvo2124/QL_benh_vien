import React from "react";

function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-r from-[#004e92] to-[#1565c0] py-6 px-4">
  <div className="container mx-auto">
    <h1 className="text-4xl font-extrabold text-white uppercase tracking-wide mb-3">
      Giới Thiệu Bệnh Viện
    </h1>
    <p className="text-blue-100 text-lg">
      Thông tin tổng quan về bệnh viện
    </p>
  </div>
</section>
      <div className="bg-white py-16 px-5">
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div className="bg-slate-50 p-5 rounded-xl mb-8 leading-8">
            <strong>Bệnh viện Nhân dân Gia Định</strong> là bệnh viện đa khoa hạng I trực thuộc Sở Y tế TP.HCM, với lịch sử hơn 50 năm hình thành và phát triển, là một trong những cơ sở y tế uy tín hàng đầu tại TP. Hồ Chí Minh.
          </div>
          <h2 className="text-2xl font-bold text-[#004e92] mb-4">Lịch sử hình thành</h2>
          <p className="text-slate-600 leading-8 mb-6">
            Được thành lập từ những năm 1970, Bệnh viện Nhân dân Gia Định đã không ngừng phát triển và mở rộng quy mô, nâng cao chất lượng khám chữa bệnh phục vụ nhân dân thành phố và khu vực lân cận.
          </p>
          <h2 className="text-2xl font-bold text-[#004e92] mb-4">Tầm nhìn & Sứ mệnh</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { title: "🎯 Tầm nhìn", desc: "Trở thành bệnh viện hàng đầu khu vực Đông Nam Á về chất lượng khám chữa bệnh và nghiên cứu y học." },
              { title: "💡 Sứ mệnh", desc: "Cung cấp dịch vụ y tế toàn diện, an toàn, hiệu quả với chi phí hợp lý, lấy người bệnh làm trung tâm." },
              { title: "🌟 Giá trị cốt lõi", desc: "Tận tâm – Chuyên nghiệp – Đổi mới – Trách nhiệm – Nhân văn." },
              { title: "🏆 Thành tích", desc: "Nhiều năm liền đạt danh hiệu Bệnh viện xuất sắc, Tập thể lao động xuất sắc cấp thành phố." },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6">
                <div className="font-bold text-lg text-[#004e92] mb-2">{item.title}</div>
                <div className="text-slate-600 leading-7">{item.desc}</div>
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-bold text-[#004e92] mt-10 mb-4">Ban lãnh đạo</h2>
         <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: "TS.BS. Nguyễn Văn An", role: "Giám đốc Bệnh viện", icon: "👨‍⚕️" },
              { name: "PGS.TS. Trần Thị Bình", role: "Phó Giám đốc", icon: "👩‍⚕️" },
              { name: "TS.BS. Lê Minh Cường", role: "Phó Giám đốc", icon: "👨‍⚕️" },
            ].map((p, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md p-7 text-center"
                >
                <div style={{ fontSize: 52, marginBottom: 12 }}>{p.icon}</div>
                <div className="font-bold text-[#004e92] text-lg">{p.name}</div>
                <div className="text-slate-500 text-sm mt-2">{p.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
export default AboutPage;