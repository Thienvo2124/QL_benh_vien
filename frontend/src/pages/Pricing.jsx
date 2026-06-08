import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Khám bệnh', icon: '🩺', items: [['Khám bệnh thường', '150.000đ'], ['Khám theo yêu cầu', '350.000đ'], ['Khám chuyên gia GS/PGS', '500.000đ'], ['Khám cấp cứu', '200.000đ']] },
  { name: 'Xét nghiệm', icon: '🔬', items: [['Xét nghiệm máu tổng quát', '120.000đ'], ['Sinh hóa máu (glucose, lipid)', '250.000đ'], ['Xét nghiệm nước tiểu', '60.000đ'], ['PCR COVID-19', '300.000đ']] },
  { name: 'Chẩn đoán hình ảnh', icon: '📷', items: [['X-quang ngực thẳng', '100.000đ'], ['Siêu âm bụng tổng quát', '200.000đ'], ['CT-Scan ngực', '1.200.000đ'], ['MRI não', '3.500.000đ']] },
  { name: 'Phẫu thuật', icon: '⚕️', items: [['Phẫu thuật nhỏ', 'từ 500.000đ'], ['Phẫu thuật nội soi', 'từ 5.000.000đ'], ['Phẫu thuật tim hở', 'từ 50.000.000đ'], ['Mổ đẻ', 'từ 8.000.000đ']] },
  { name: 'Nha khoa', icon: '🦷', items: [['Khám răng tổng quát', '100.000đ'], ['Trám răng thẩm mỹ', '300.000đ'], ['Nhổ răng khôn', '800.000đ'], ['Cấy ghép Implant (1 răng)', 'từ 15.000.000đ']] },
  { name: 'Sản phụ khoa', icon: '🤰', items: [['Khám thai định kỳ', '150.000đ'], ['Siêu âm thai 4D', '400.000đ'], ['Xét nghiệm tiền sản giật', '500.000đ'], ['Đỡ đẻ thường', 'từ 5.000.000đ']] },
];

const Pricing = () => (
  <>
    <section className="bg-gradient-to-r from-[#004e92] to-[#1565c0] py-14 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-extrabold text-white uppercase tracking-wide mb-2">Bảng Giá Dịch Vụ</h1>
        <p className="text-blue-100">Minh bạch, hợp lý theo quy định Bộ Y tế</p>
      </div>
    </section>

    <div className="bg-gray-100 px-4 py-3 text-sm text-gray-500 border-b">
      <div className="container mx-auto">
        <Link to="/" className="hover:text-[#004e92]">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-700">Bảng giá dịch vụ</span>
      </div>
    </div>

    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="bg-blue-50 border-l-4 border-[#004e92] rounded-r-xl p-4 mb-8 text-sm text-gray-600 max-w-3xl">
          ⚠️ Bảng giá chỉ mang tính tham khảo. Chi phí thực tế phụ thuộc vào tình trạng bệnh và chỉ định của bác sĩ. <strong>Bảo hiểm y tế được áp dụng theo quy định nhà nước.</strong>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(cat => (
            <div key={cat.name} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-[#004e92] px-6 py-4 flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <h3 className="text-white font-bold text-lg">{cat.name}</h3>
              </div>
              <div className="p-6">
                {cat.items.map(([name, price], i) => (
                  <div key={i} className={`flex justify-between items-center py-3 ${i < cat.items.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <span className="text-sm text-gray-700">{name}</span>
                    <span className="text-sm font-bold text-red-600">{price}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-gray-500 mb-4 text-sm">Cần tư vấn thêm về chi phí điều trị?</p>
          <Link to="/lien-he" className="inline-block bg-[#004e92] hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-full transition-colors">
            Liên hệ tư vấn
          </Link>
        </div>
      </div>
    </section>
  </>
);

export default Pricing;