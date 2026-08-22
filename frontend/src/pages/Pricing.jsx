import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Stethoscope, 
  FlaskConical, 
  Activity, 
  ShieldCheck,
  ChevronRight,
  PhoneCall
} from 'lucide-react';
import API_BASE_URL from '../config/api';
import departments from '../data/departments';
import Header from '../components/Header';
import Footer from '../components/Footer';

const groups = [
  {
    title: 'Gói khám sức khỏe tổng quát',
    desc: 'Thiết kế toàn diện đánh giá thể trạng và tầm soát sức khỏe định kỳ.',
    icon: Stethoscope,
    color: 'from-[#004e92] to-[#002d54]',
    slugs: [
      'goi-kham-co-ban',
      'goi-kham-nang-cao',
      'goi-kham-chuyen-sau',
      'goi-kham-vip-gold',
      'goi-kham-vip-platinum'
    ]
  },
  {
    title: 'Gói tầm soát chuyên sâu',
    desc: 'Tập trung chẩn đoán chuyên sâu các bệnh lý nguy cơ cao như ung thư, đột quỵ.',
    icon: FlaskConical,
    color: 'from-emerald-600 to-teal-800',
    slugs: [
      'goi-kham-tam-soat-ung-thu-tong-quat',
      'goi-kham-tam-soat-ung-thu-tieu-hoa',
      'goi-kham-tam-soat-dot-quy'
    ]
  },
  {
    title: 'Khám chuyên khoa thường quy',
    desc: 'Lệ phí khám lâm sàng ban đầu trực tiếp cùng bác sĩ chuyên khoa.',
    icon: Activity,
    color: 'from-violet-600 to-indigo-800',
    slugs: [
      'noi-tong-quat',
      'tai-mui-hong',
      'mat',
      'rang-ham-mat',
      'tim-mach',
      'san-phu-khoa',
      'tuyen-vu',
      'ho-hap',
      'di-ung-mien-dich',
      'tu-van-giac-ngu'
    ]
  }
];

const Pricing = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi tải phí dịch vụ:', err);
        setLoading(false);
      });
  }, []);

  const getFee = (slug) => {
    const key = `deptfee_${slug.replace(/-/g, '_')}`;
    const feeValue = settings[key];
    if (feeValue !== undefined) {
      return `${Number(feeValue).toLocaleString('vi-VN')}đ`;
    }
    return 'Chưa cập nhật';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      <Header />
      <main className="flex-grow">
        {/* Header / Hero Section */}
        <section className="bg-gradient-to-r from-[#004e92] via-[#0060b0] to-[#1565c0] py-16 px-4 relative overflow-hidden shadow-inner">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent)] pointer-events-none"></div>
        <div className="container mx-auto relative z-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-wider mb-3 drop-shadow-sm">
            Bảng giá dịch vụ công khai
          </h1>
          <p className="text-blue-100 text-base md:text-lg font-medium max-w-xl">
            Minh bạch, hợp lý và cam kết đồng bộ thời gian thực theo cấu hình của bệnh viện.
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
                Bảng giá dưới đây được cập nhật **tự động thời gian thực** từ hệ thống quản trị bệnh viện. Chi phí điều trị thực tế sẽ phụ thuộc vào tình trạng sức khỏe cụ thể của người bệnh và phác đồ chỉ định từ bác sĩ. 
                <strong className="text-[#004e92]"> Bảo hiểm y tế (BHYT) được áp dụng chi trả theo đúng quy định hiện hành của Nhà nước.</strong>
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500 font-medium">
              Đang kết nối đồng bộ bảng giá thực tế...
            </div>
          ) : (
            /* Pricing Cards Grid */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {groups.map((group) => {
                const IconComponent = group.icon;
                const groupDepts = group.slugs.map(slug => departments.find(d => d.slug === slug)).filter(Boolean);

                return (
                  <div 
                    key={group.title} 
                    className="bg-white rounded-3xl shadow-sm border border-gray-100/80 overflow-hidden hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col"
                  >
                    {/* Card Header */}
                    <div className={`bg-gradient-to-r ${group.color} px-6 py-5 flex flex-col gap-1.5`}>
                      <div className="flex items-center gap-3">
                        <div className="bg-white/10 p-2 rounded-2xl backdrop-blur-md">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-white font-bold text-lg tracking-wide">{group.title}</h3>
                      </div>
                      <p className="text-blue-100/80 text-xs mt-1 leading-relaxed">{group.desc}</p>
                    </div>

                    {/* Card Items */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        {groupDepts.map((dept, index) => (
                          <div 
                            key={dept.slug} 
                            className={`flex justify-between items-center gap-4 pb-3.5 ${
                              index < groupDepts.length - 1 ? 'border-b border-gray-100' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-base select-none">{dept.icon}</span>
                              <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                            </div>
                            <span className="text-base font-bold text-[#004e92] tracking-tight whitespace-nowrap">
                              {getFee(dept.slug)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

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
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
