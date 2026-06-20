import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  HeartPulse, 
  Brain, 
  Smile, 
  Eye, 
  Users, 
  Baby, 
  Stethoscope, 
  Bone, 
  Microscope, 
  Sparkles, 
  Ear, 
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import departments from '../data/departments';

const iconMap = {
  'tim-mach': HeartPulse,
  'than-kinh': Brain,
  'nha-khoa': Smile,
  'nhan-khoa': Eye,
  'san-phu-khoa': Users,
  'nhi-khoa': Baby,
  'noi-tong-quat': Stethoscope,
  'chan-thuong-chinh-hinh': Bone,
  'ung-buou': Microscope,
  'da-lieu': Sparkles,
  'tai-mui-hong': Ear,
  'chan-doan-hinh-anh': ImageIcon
};

const specialties = departments.map(d => ({
  name: d.name.toUpperCase(),
  slug: d.slug,
  icon: iconMap[d.slug] || Stethoscope
}));

const SpecialtyDetail = () => {
  const { slug } = useParams();
  const currentDept = departments.find(d => d.slug === slug) || departments[0];
  
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const otherSpecialties = specialties.filter(s => s.slug !== currentDept.slug);
  const totalPages = Math.ceil(otherSpecialties.length / itemsPerPage);

  const currentItems = otherSpecialties.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Header />
      
      {/* Breadcrumbs */}
      <div className="bg-blue-50/50 py-3 px-4 border-b border-gray-100">
        <div className="container mx-auto flex items-center text-sm text-gray-600 max-w-5xl">
          <Link to="/" className="hover:text-[#22549e] transition-colors">Trang chủ</Link>
          <span className="mx-2">|</span>
          <Link to="/procedures" className="hover:text-[#22549e] transition-colors">Chuyên khoa</Link>
          <span className="mx-2">|</span>
          <span className="text-[#22549e] font-medium">{currentDept.name}</span>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="w-full max-w-5xl bg-white p-10 rounded-2xl shadow-sm border border-gray-100 mb-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-[#22549e] uppercase tracking-wide">
              {currentDept.name.toUpperCase()}
            </h1>
            <div className="flex items-center justify-center mt-4">
              <div className="w-16 h-px bg-blue-200"></div>
              <div className="mx-4 text-blue-400 rotate-45 transform">
                <div className="w-4 h-4 bg-[#5c9ce6]"></div>
              </div>
              <div className="w-16 h-px bg-blue-200"></div>
            </div>
          </div>

          <div className="space-y-10 text-gray-700 leading-relaxed text-lg">
            <section>
              <h2 className="text-2xl font-bold text-[#22549e] mb-6 flex items-center">
                I. Giới thiệu
              </h2>
              {slug === 'tim-mach' ? (
                <div className="space-y-6 text-gray-600">
                  <p>
                    Trực tiếp thăm khám và điều trị tại khoa Nội Tim mạch là đội ngũ các Bác sĩ, chuyên gia đầu ngành của Bệnh viện Đại học Y Dược TP. HCM. Ngoài chuyên môn cao, các bác sĩ luôn mang đến cho bệnh nhân cảm giác yên tâm và được tư vấn đầy đủ theo từng bệnh lý.
                  </p>
                  <p>
                    Phòng khám Bệnh viện Đại học Y Dược 1 được trang bị cơ sở vật chất và các thiết bị hiện đại chuyên về tim mạch giúp phát hiện chính xác và điều trị bệnh nhanh chóng, bao gồm:
                  </p>
                  <ul className="space-y-4 pl-4">
                    <li>- 02 Phòng đo điện tâm đồ (ECG);</li>
                    <li>- Phòng chụp cắt lớp vi tính (128 lát cắt);</li>
                    <li>- Phòng chụp cộng hưởng từ (MRI) tim;</li>
                    <li>- Phòng siêu âm tim, siêu âm Doppler màu động mạch, tĩnh mạch.</li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-6 text-gray-600">
                  <p>{currentDept.fullDesc}</p>
                </div>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#22549e] mb-6 flex items-center">
                II. Dịch vụ chuyên khoa
              </h2>
              {slug === 'tim-mach' ? (
                <div className="space-y-6 text-gray-600">
                  <p>
                    - Khám, chẩn đoán và điều trị các bệnh lý tim mạch: Tăng huyết áp, rối loạn lipid máu, xơ vữa động mạch, các bệnh lý mạch vành, bệnh tim thiếu máu cục bộ, bệnh cơ tim, các bệnh lý van tim, suy tim, nhiễm trùng tim, các bệnh lý mạch máu ngoại biên mạn tính,...
                  </p>
                  <p>
                    - Khám và chẩn đoán các triệu chứng do rối loạn nhịp tim gây nên như: ngất, thoáng ngất, cơn chóng mặt không tìm thấy nguyên nhân, cơn hồi hộp trống ngực, cơn khó thở, đau ngực, mệt không rõ nguyên nhân, tai biến mạch não nghi ngờ do con rung nhĩ, hay cuồng nhĩ...
                  </p>
                  <p>
                    - Phát hiện các rối loạn tim mạch không triệu chứng ở người bệnh nhồi máu cơ tim, suy tim, bệnh tim phì đại...
                  </p>
                  <p>
                    - Kiểm tra nhịp tim, kiểm tra lưu lượng máu đến cơ tim, chẩn đoán cơn đau tim, kiểm tra những vấn đề bất thường của tim (ví dụ cơ tim dày hơn bình thường).
                  </p>
                  <p>
                    - Theo dõi Holter điện tâm đồ 24h để chẩn đoán bệnh lý nhịp tim.
                  </p>
                </div>
              ) : (
                <div className="space-y-6 text-gray-600">
                  <ul className="space-y-4">
                    {currentDept.services?.map((service, idx) => (
                      <li key={idx}>- {service}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Other Specialties Slider */}
        <div className="w-full max-w-5xl mt-6 mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#22549e] uppercase tracking-wide">
              CHUYÊN KHOA KHÁC
            </h2>
            <div className="flex items-center justify-center mt-3">
              <div className="w-12 h-px bg-blue-200"></div>
              <div className="mx-3 text-blue-400 rotate-45 transform">
                <div className="w-3 h-3 bg-[#5c9ce6]"></div>
              </div>
              <div className="w-12 h-px bg-blue-200"></div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <button 
              onClick={prevPage}
              className="w-12 h-12 rounded-full border border-[#22549e] flex items-center justify-center text-[#22549e] hover:bg-blue-50 transition-colors flex-shrink-0"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div key={currentPage} className="flex justify-center gap-6 overflow-hidden w-full px-4 animate-slider">
              {currentItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link to={`/chuyen-khoa/${item.slug}`} key={index} className="flex flex-col items-center cursor-pointer group w-32">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#3b82f6] to-[#1e40af] rounded-2xl flex items-center justify-center mb-4 shadow-md group-hover:-translate-y-1 transition-transform">
                      <Icon size={40} className="text-white" strokeWidth={1.5} />
                    </div>
                    <span className="text-[#22549e] font-bold text-sm text-center leading-tight">
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>

            <button 
              onClick={nextPage}
              className="w-12 h-12 rounded-full border border-[#22549e] flex items-center justify-center text-[#22549e] hover:bg-blue-50 transition-colors flex-shrink-0"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SpecialtyDetail;
