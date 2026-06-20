import React, { useState } from 'react';
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full font-sans shadow-md bg-white sticky top-0 z-50">
      {/* Top Bar - Contact Info */}
      <div className="bg-[#004e92] text-white py-2 px-4 md:px-10 flex flex-wrap justify-between items-center text-xs md:text-sm">
        <div className="flex gap-4 md:gap-6 items-center">
          <a href="tel:19002115" className="flex items-center gap-2 hover:text-blue-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            <span>Đặt hẹn khám: <strong>1900 2115</strong></span>
          </a>
          <a href="tel:02835510063" className="flex items-center gap-2 hover:text-red-300 text-red-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            <span>Cấp cứu: <strong>(028) 3551 0063</strong></span>
          </a>
        </div>
        <div className="hidden md:flex gap-4 items-center">
          <a href="mailto:info@bvndgiadinh.org.vn" className="hover:text-blue-200">info@bvndgiadinh.org.vn</a>
          <span>Số 1 Nơ Trang Long, P.Gia Định, TP.HCM</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo Area */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-[#004e92] border-2 border-[#004e92]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#004e92] leading-tight uppercase tracking-wide">
              Bệnh viện<br />Nhân dân
            </h1>
          </div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex gap-6 font-medium text-gray-700 uppercase text-sm items-center">
          <a href="/" className="hover:text-[#004e92] transition-colors border-b-2 border-transparent hover:border-[#004e92] pb-1">Trang Chủ</a>
          <Link
            to="/aboutpage"
            className="hover:text-[#004e92] transition-colors pb-1"
          >
          Giới thiệu
          </Link>
          <Link to="/departmentdetail/tim-mach">
            Khám Chữa Bệnh
          </Link>
          <Link to="/training" className="hover:text-[#004e92] transition-colors pb-1">
          Đào Tạo
          </Link>
          <a href="#" className="hover:text-[#004e92] transition-colors pb-1">Hoạt Động</a>
           <Link to="/adminprocedures" className="hover:text-[#004e92] transition-colors pb-1">
          Thủ tục hành chính
          </Link>
          <Link to="/contact" className="hover:text-[#004e92] transition-colors pb-1">
         Liên hệ
          </Link>
          <div className="h-4 w-px bg-gray-300 mx-1"></div>
          <a href="/login" className="hover:text-[#004e92] transition-colors pb-1 text-[#004e92] font-bold">Đăng Nhập</a>
          <a href="/register" className="bg-[#004e92] text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors">Đăng Ký</a>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-[#004e92] focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gray-50 border-t border-gray-200 flex flex-col uppercase text-sm font-semibold text-gray-700">
          <a href="/" className="p-4 border-b border-gray-200 hover:bg-gray-100">Trang Chủ</a>
          <Link
            to="/aboutpage"
            className="p-4 border-b border-gray-200 hover:bg-gray-100"
          >
          Giới thiệu
          </Link>
          <Link to="/departmentdetail/tim-mach">
            Khám Chữa Bệnh
          </Link>
          <Link to="/training" className="p-4 border-b border-gray-200 hover:bg-gray-100">
            Đào Tạo
          </Link>
           <a href="#" className="p-4 border-b border-gray-200 hover:bg-gray-100">Hoạt động</a>
          <Link to="/adminprocedures" className="p-4 border-b border-gray-200 hover:bg-gray-100">
            Thủ tục hành chính
          </Link>
          <a href="/login" className="p-4 border-b border-gray-200 hover:bg-gray-100 text-[#004e92] font-bold">Đăng Nhập</a>
          <a href="/register" className="p-4 border-b border-gray-200 hover:bg-gray-100 text-[#004e92] font-bold">Đăng Ký</a>
        </div>
      )}
    </header>
  );
};

export default Header;
