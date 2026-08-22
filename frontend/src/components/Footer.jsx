import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';
import API_BASE_URL from '../config/api';

const Footer = () => {
  const [settings, setSettings] = useState({
    hospName: "Bệnh viện Nhân Dân",
    address: "Số 1 Nơ Trang Long, Phường Gia Định, TP.HCM",
    emailContact: "info@bvndgiadinh.org.vn",
    hotline: "(028) 3551 0063"
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        setSettings({
          hospName: data.hospName || "Bệnh viện Nhân Dân",
          address: data.address || "Số 1 Nơ Trang Long, Phường Gia Định, TP.HCM",
          emailContact: data.emailContact || "info@bvndgiadinh.org.vn",
          hotline: data.hotline || "(028) 3551 0063"
        });
      })
      .catch(err => console.error("Lỗi tải cấu hình footer:", err));
  }, []);

  return (
    <footer className="bg-[#1a252f] text-gray-300 pt-16 pb-8 font-sans border-t-4 border-red-600">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          <div>
            <h3 className="text-white text-xl font-bold mb-6 uppercase tracking-wider relative inline-block after:content-[''] after:block after:w-1/2 after:h-1 after:bg-red-500 after:mt-2">
              {settings.hospName}
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="text-red-500 w-5 h-5 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-red-500 w-5 h-5 shrink-0" />
                <a href={`mailto:${settings.emailContact}`} className="hover:text-white transition-colors">{settings.emailContact}</a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="text-red-500 w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">
                    Hotline hỗ trợ: <a href={`tel:${settings.hotline.replace(/\D/g, '')}`} className="text-blue-400 hover:text-blue-300">{settings.hotline}</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-6 uppercase">Dịch vụ y tế</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/procedures" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Chuyên khoa điều trị</Link></li>
              <li><Link to="/booking" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Đặt lịch khám nhanh</Link></li>
              <li><Link to="/pricing" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Bảng giá dịch vụ công khai</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>Copyright © 2026 - Bản quyền thuộc về Bệnh viện</p>
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
