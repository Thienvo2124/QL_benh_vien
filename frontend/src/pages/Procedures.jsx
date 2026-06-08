import React from 'react';
import { Link } from 'react-router-dom';

const steps = [
  { title: 'Lấy số thứ tự', desc: 'Đến quầy tiếp đón hoặc lấy số trực tuyến qua hệ thống HMOAS. Khai báo thông tin, nhận phiếu khám bệnh.', icon: '🎫' },
  { title: 'Đo sinh hiệu', desc: 'Y tá đo huyết áp, nhiệt độ, nhịp tim, cân nặng, chiều cao trước khi vào gặp bác sĩ.', icon: '📊' },
  { title: 'Khám bác sĩ', desc: 'Bác sĩ tiến hành khám lâm sàng, hỏi tiền sử bệnh và đưa ra chỉ định xét nghiệm hoặc điều trị.', icon: '👨‍⚕️' },
  { title: 'Xét nghiệm / Chẩn đoán hình ảnh', desc: 'Nếu có chỉ định, bệnh nhân đến phòng xét nghiệm hoặc CĐHA để làm các kiểm tra cần thiết.', icon: '🔬' },
  { title: 'Nhận kết quả & Tái khám bác sĩ', desc: 'Bệnh nhân nhận kết quả xét nghiệm và gặp lại bác sĩ để được chẩn đoán chính xác, kê đơn điều trị.', icon: '📋' },
  { title: 'Thanh toán viện phí', desc: 'Đến quầy thu ngân hoặc thanh toán trực tuyến qua VNPay/MoMo. Xuất trình thẻ BHYT nếu có.', icon: '💳' },
  { title: 'Nhận thuốc & Hướng dẫn', desc: 'Đến quầy phát thuốc, nhận đơn thuốc điện tử và được dược sĩ hướng dẫn cách dùng thuốc, lịch tái khám.', icon: '💊' },
];

const Procedures = () => (
  <>
    <section className="bg-gradient-to-r from-[#004e92] to-[#1565c0] py-14 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-extrabold text-white uppercase tracking-wide mb-2">Quy Trình Khám Bệnh</h1>
        <p className="text-blue-100">7 bước đơn giản, rõ ràng, nhanh chóng</p>
      </div>
    </section>

    <div className="bg-gray-100 px-4 py-3 text-sm text-gray-500 border-b">
      <div className="container mx-auto">
        <Link to="/" className="hover:text-[#004e92]">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-700">Quy trình khám bệnh</span>
      </div>
    </div>

    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="space-y-4">
          {steps.map((s, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 flex gap-5 items-start hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#004e92] text-white font-extrabold text-lg flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </div>
                {i < steps.length - 1 && <div className="w-0.5 h-6 bg-gray-200 mt-2" />}
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{s.icon}</span>
                  <h3 className="font-bold text-gray-800 text-lg">{s.title}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/booking"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-10 py-4 rounded-full text-lg shadow-lg transition-colors">
            Đặt lịch khám ngay
          </Link>
          <p className="mt-3 text-sm text-gray-500">Hoặc gọi <strong className="text-[#004e92]">1900 2115</strong> để được tư vấn</p>
        </div>
      </div>
    </section>
  </>
);

export default Procedures;