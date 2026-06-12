import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#1a252f] text-gray-300 pt-16 pb-8 font-sans border-t-4 border-red-600">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <h3 className="text-white text-xl font-bold mb-6 uppercase tracking-wider relative inline-block after:content-[''] after:block after:w-1/2 after:h-1 after:bg-red-500 after:mt-2">
              Bệnh viện<br />Nhân Dân
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold mt-0.5">ĐC</span>
                <span>Số 1 Nơ Trang Long, Phường Gia Định, TP.HCM</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-500 font-bold">EM</span>
                <a href="mailto:info@bvndgiadinh.org.vn" className="hover:text-white transition-colors">info@bvndgiadinh.org.vn</a>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold mt-0.5">ĐT</span>
                <div>
                  <div className="font-semibold text-white">Tổng đài CSKH: <a href="tel:19008116" className="text-blue-400 hover:text-blue-300">1900 8116</a></div>
                  <div className="font-semibold text-white mt-1">Đặt lịch khám: <a href="tel:19002115" className="text-blue-400 hover:text-blue-300">1900 2115</a></div>
                  <div className="font-semibold text-red-400 mt-1">Cấp cứu: <a href="tel:02835510063" className="hover:text-red-300">(028) 3551 0063</a></div>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-6 uppercase">Giới thiệu</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Tổng quan</Link></li>
              <li><Link to="/doctors" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Đội ngũ bác sĩ</Link></li>
              <li><Link to="/pricing" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Bảng giá dịch vụ</Link></li>
              <li><Link to="/booking" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Đặt lịch khám</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-6 uppercase">Khám chữa bệnh</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/booking" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Quy trình khám bệnh</Link></li>
              <li><Link to="/doctors" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Lịch bác sĩ</Link></li>
              <li><Link to="/booking" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Đăng ký khám bệnh</Link></li>
              <li><Link to="/pricing" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Chi phí dịch vụ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-6 uppercase">Kết nối</h3>
            <p className="text-sm mb-4">Đăng ký để nhận thông tin y tế hữu ích từ chúng tôi.</p>
            <form className="flex mb-6">
              <input type="email" placeholder="Email của bạn..." className="px-4 py-2 w-full bg-gray-800 text-white rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-700" />
              <button type="button" className="bg-[#004e92] hover:bg-blue-600 px-4 py-2 rounded-r transition-colors" aria-label="Đăng ký nhận tin">
                →
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>Copyright © 2026 - Bản quyền thuộc về Bệnh viện Nhân Dân</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <Link to="/" className="hover:text-white transition-colors">Điều khoản sử dụng</Link>
            <Link to="/" className="hover:text-white transition-colors">Chính sách bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
