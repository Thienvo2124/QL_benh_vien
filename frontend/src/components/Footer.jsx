import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#1a252f] text-gray-300 pt-16 pb-8 font-sans border-t-4 border-red-600">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: About & Contact */}
          <div>
            <h3 className="text-white text-xl font-bold mb-6 uppercase tracking-wider relative inline-block after:content-[''] after:block after:w-1/2 after:h-1 after:bg-red-500 after:mt-2">
              Bệnh Viện<br/>Nhân Dân
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>Số 1 Nơ Trang Long, Phường Gia Định, TP.HCM</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <a href="mailto:info@bvndgiadinh.org.vn" className="hover:text-white transition-colors">info@bvndgiadinh.org.vn</a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <div>
                    <div className="font-semibold text-white">Tổng đài CSKH: <a href="tel:19008116" className="text-blue-400 hover:text-blue-300">1900 8116</a></div>
                    <div className="font-semibold text-white mt-1">Đặt lịch khám: <a href="tel:19002115" className="text-blue-400 hover:text-blue-300">1900 2115</a></div>
                    <div className="font-semibold text-red-400 mt-1">Cấp cứu: <a href="tel:02835510063" className="hover:text-red-300">(028) 3551 0063</a></div>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6 uppercase">Giới Thiệu</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Tổng quan</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Phòng Chức Năng</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Khoa Lâm Sàng</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Khoa Cận Lâm Sàng</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Chính sách bảo mật</a></li>
            </ul>
          </div>

          {/* Column 3: Medical Services */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6 uppercase">Khám Chữa Bệnh</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Quy trình khám bệnh</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Lịch Bác Sĩ</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Đăng ký khám bệnh</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Thông tin Dược</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Bảng giá dịch vụ</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter / Connect */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6 uppercase">Kết Nối</h3>
            <p className="text-sm mb-4">Đăng ký để nhận thông tin y tế hữu ích từ chúng tôi.</p>
            <form className="flex mb-6">
              <input type="email" placeholder="Email của bạn..." className="px-4 py-2 w-full bg-gray-800 text-white rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-700" />
              <button className="bg-[#004e92] hover:bg-blue-600 px-4 py-2 rounded-r transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </form>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-800 transition-colors">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>Copyright © 2026 - Bản quyền thuộc về Bệnh viện Nhân Dân</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a>
            <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
