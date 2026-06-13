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

const Procedures = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(specialties.length / itemsPerPage);

  const currentItems = specialties.slice(
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
        <div className="container mx-auto flex items-center text-sm text-gray-600 max-w-3xl">
          <Link to="/" className="hover:text-[#22549e] transition-colors">Trang chủ</Link>
          <span className="mx-2">|</span>
          <span className="text-[#22549e] font-medium">Chuyên khoa</span>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-16 flex justify-center">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-[#22549e] uppercase tracking-wide">
              CHUYÊN KHOA
            </h2>
            <div className="flex items-center justify-center mt-3">
              <div className="w-12 h-px bg-blue-200"></div>
              <div className="mx-3 text-blue-400 rotate-45 transform">
                <div className="w-3 h-3 bg-[#5c9ce6]"></div>
              </div>
              <div className="w-12 h-px bg-blue-200"></div>
            </div>
          </div>

          <div key={currentPage} className="space-y-4 animate-slider">
            {currentItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link 
                  to={`/chuyen-khoa/${item.slug}`}
                  key={index} 
                  className="bg-white rounded-xl shadow-sm overflow-hidden flex hover:shadow-md transition-shadow cursor-pointer border border-gray-50 block"
                >
                  <div className="w-24 h-24 bg-gradient-to-b from-[#4facfe] to-[#2b7ad4] flex items-center justify-center flex-shrink-0">
                    <Icon size={40} className="text-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col justify-center px-6 py-2">
                    <h3 className="text-[#22549e] font-bold text-lg mb-1">{item.name}</h3>
                    <span className="text-gray-500 text-sm">Xem thêm</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="flex justify-end mt-8 gap-4">
            <button 
              onClick={prevPage}
              className="w-12 h-12 rounded-full border border-[#22549e] flex items-center justify-center text-[#22549e] hover:bg-blue-50 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextPage}
              className="w-12 h-12 rounded-full border border-[#22549e] flex items-center justify-center text-[#22549e] hover:bg-blue-50 transition-colors"
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

export default Procedures;
