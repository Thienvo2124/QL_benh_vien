import { Link } from 'react-router-dom';
import { 
  Stethoscope, 
  FlaskConical, 
  Image, 
  Activity, 
  Sparkles, 
  HeartPulse, 
  ShieldCheck,
  ChevronRight,
  PhoneCall
} from 'lucide-react';

const categories = [
  {
    name: 'Khám bệnh',
    icon: Stethoscope,
    color: 'from-[#004e92] to-[#002d54]',
    bgLight: 'bg-blue-50/40',
    textColor: 'text-[#004e92]',
    items: [
      ['Khám bệnh thường', '150.000đ'],
      ['Khám theo yêu cầu', '350.000đ'],
      ['Khám chuyên gia GS/PGS', '500.000đ'],
      ['Khám cấp cứu', '200.000đ'],
    ],
  },
  {
    name: 'Xét nghiệm',
    icon: FlaskConical,
    color: 'from-emerald-600 to-teal-800',
    bgLight: 'bg-emerald-50/40',
    textColor: 'text-emerald-700',
    items: [
      ['Xét nghiệm máu tổng quát', '120.000đ'],
      ['Sinh hóa máu', '250.000đ'],
      ['Xét nghiệm nước tiểu', '60.000đ'],
      ['PCR COVID-19', '300.000đ'],
    ],
  },
  {
    name: 'Chẩn đoán hình ảnh',
    icon: Image,
    color: 'from-violet-600 to-indigo-800',
    bgLight: 'bg-violet-50/40',
    textColor: 'text-violet-700',
    items: [
      ['X-quang ngực thẳng', '100.000đ'],
      ['Siêu âm bụng tổng quát', '200.000đ'],
      ['CT-Scan ngực', '1.200.000đ'],
      ['MRI não', '3.500.000đ'],
    ],
  },
  {
    name: 'Phẫu thuật',
    icon: Activity,
    color: 'from-rose-600 to-pink-800',
    bgLight: 'bg-rose-50/40',
    textColor: 'text-rose-700',
    items: [
      ['Phẫu thuật nhỏ', 'từ 500.000đ'],
      ['Phẫu thuật nội soi', 'từ 5.000.000đ'],
      ['Phẫu thuật tim hở', 'từ 50.000.000đ'],
      ['Mổ đẻ', 'từ 8.000.000đ'],
    ],
  },
  {
    name: 'Nha khoa',
    icon: Sparkles,
    color: 'from-cyan-600 to-blue-800',
    bgLight: 'bg-cyan-50/40',
    textColor: 'text-cyan-700',
    items: [
      ['Khám răng tổng quát', '100.000đ'],
      ['Trám răng thẩm mỹ', '300.000đ'],
      ['Nhổ răng khôn', '800.000đ'],
      ['Cấy ghép Implant', 'từ 15.000.000đ'],
    ],
  },
  {
    name: 'Sản phụ khoa',
    icon: HeartPulse,
    color: 'from-pink-600 to-rose-800',
    bgLight: 'bg-pink-50/40',
    textColor: 'text-pink-700',
    items: [
      ['Khám thai định kỳ', '150.000đ'],
      ['Siêu âm thai 4D', '400.000đ'],
      ['Xét nghiệm tiền sản giật', '500.000đ'],
      ['Đỡ đẻ thường', 'từ 5.000.000đ'],
    ],
  },
];

const Pricing = () => (
  <>
    {/* Header / Hero Section */}
    <section className="bg-gradient-to-r from-[#004e92] via-[#0060b0] to-[#1565c0] py-16 px-4 relative overflow-hidden shadow-inner">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent)] pointer-events-none"></div>
      <div className="container mx-auto relative z-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-wider mb-3 drop-shadow-sm">
          Bảng giá dịch vụ công khai
        </h1>
        <p className="text-blue-100 text-base md:text-lg font-medium max-w-xl">
          Minh bạch, hợp lý và cam kết thực hiện đúng quy định biểu phí của Bộ Y tế.
        </p>
      </div>
    </section>

    {/* Breadcrumbs */}
    <div className="bg-white px-4 py-3.5 text-xs md:text-sm text-gray-500 border-b border-gray-100 shadow-sm">
      <div className="container mx-auto flex items-center gap-2">
        <Link to="/" className="hover:text-[#004e92] transition-colors">Trang chủ</Link>
        <ChevronRight size={14} className="text-gray-300" />
        <span className="font-semibold text-gray-800">Bảng giá dịch vụ</span>
      </div>
    </div>

    {/* Main Content */}
    <section className="py-16 bg-gray-50/60">
      <div className="container mx-auto px-4">
        {/* Notice Info Box */}
        <div className="bg-blue-50/80 border-l-4 border-[#004e92] rounded-r-2xl p-5 mb-10 text-sm md:text-base text-gray-600 max-w-4xl flex items-start gap-3.5 shadow-sm">
          <ShieldCheck className="w-6 h-6 text-[#004e92] shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-gray-800 mb-1">Thông tin lưu ý dành cho người bệnh:</p>
            <p className="text-gray-600 leading-relaxed text-sm">
              Bảng giá dưới đây mang tính chất công khai tham khảo. Chi phí điều trị thực tế sẽ phụ thuộc vào tình trạng sức khỏe cụ thể của người bệnh và phác đồ chỉ định từ bác sĩ. 
              <strong className="text-[#004e92]"> Bảo hiểm y tế (BHYT) được áp dụng chi trả theo đúng quy định hiện hành của Nhà nước.</strong>
            </p>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div 
                key={category.name} 
                className="bg-white rounded-3xl shadow-sm border border-gray-100/80 overflow-hidden hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col"
              >
                {/* Card Header */}
                <div className={`bg-gradient-to-r ${category.color} px-6 py-5 flex items-center gap-4`}>
                  <div className="bg-white/10 p-2 rounded-2xl backdrop-blur-md">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-lg tracking-wide">{category.name}</h3>
                </div>

                {/* Card Items */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    {category.items.map(([name, price], index) => (
                      <div 
                        key={name} 
                        className={`flex justify-between items-center gap-4 pb-3.5 ${
                          index < category.items.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                      >
                        <span className="text-sm font-medium text-gray-700">{name}</span>
                        {/* Thay đổi màu sắc giá cả thành màu xanh thương hiệu sang trọng thay vì màu đỏ nợ nần */}
                        <span className="text-base font-bold text-[#004e92] tracking-tight whitespace-nowrap">
                          {price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10 text-center max-w-2xl mx-auto mt-16 flex flex-col items-center">
          <div className="bg-blue-50 p-3.5 rounded-full mb-4 text-[#004e92]">
            <PhoneCall className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Bạn cần tư vấn thêm về chi phí điều trị?</h3>
          <p className="text-gray-500 mb-6 text-sm leading-relaxed max-w-md">
            Đội ngũ tư vấn viên của bệnh viện luôn sẵn sàng hỗ trợ giải đáp mọi thắc mắc về viện phí và quyền lợi bảo hiểm của bạn.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              to="/booking" 
              className="inline-block bg-[#004e92] hover:bg-blue-800 text-white font-bold px-8 py-3.5 rounded-2xl transition-all shadow-md shadow-blue-900/10 hover:shadow-lg text-sm"
            >
              Đặt lịch khám ngay
            </Link>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default Pricing;
