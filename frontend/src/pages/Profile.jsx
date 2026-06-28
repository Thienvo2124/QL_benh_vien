import { useState, useContext } from 'react';
import { User, Mail, Phone, Calendar, Shield, Save, Key, UserCheck, CreditCard } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Profile = () => {
  const { user } = useContext(AuthContext);
  
  const [fullName, setFullName] = useState(user?.fullName || 'Tài khoản Bệnh nhân');
  const [phone, setPhone] = useState(user?.phone || '0901234567');
  const [gender, setGender] = useState('Nam');
  const [birthDate, setBirthDate] = useState('1995-08-15');
  const [bhytCode, setBhytCode] = useState('DN4797931234567');
  const [successMsg, setSuccessMsg] = useState('');

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setSuccessMsg('Đã cập nhật thông tin hồ sơ & Bảo hiểm Y tế thành công!');
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      
      {/* Banner */}
      <div className="bg-[#004e92] text-white py-12 px-4 sm:px-8 shadow-inner">
        <div className="container mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-wide uppercase flex items-center gap-3">
              <UserCheck className="w-9 h-9 text-blue-300" /> Quản lý tài khoản & BHYT
            </h1>
            <p className="text-blue-100 text-base mt-2 max-w-xl">
              Cập nhật thông tin định danh cá nhân, thẻ Bảo hiểm y tế (BHYT) và quản lý bảo mật mật khẩu.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-[#004e92] flex items-center justify-center font-bold text-xl shadow-lg">
              {fullName.charAt(0)}
            </div>
            <div>
              <div className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Tài khoản</div>
              <div className="text-lg font-bold text-white">{user?.email || 'user@gmail.com'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-grow container mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cột trái: Thẻ BHYT Mockup */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-blue-400/30">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
              
              <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-yellow-300" />
                  <span className="font-bold text-sm tracking-wider uppercase">Thẻ Bảo Hiểm Y Tế</span>
                </div>
                <span className="text-xs bg-yellow-300 text-blue-900 font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                  Hoạt động
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs text-blue-200 uppercase tracking-wider font-medium">Mã số thẻ BHYT</div>
                  <div className="text-xl font-mono font-bold tracking-wider text-yellow-300 mt-0.5">
                    {bhytCode || 'CHƯA CẬP NHẬT'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <div className="text-xs text-blue-200 uppercase tracking-wider font-medium">Họ và tên</div>
                    <div className="font-bold text-base text-white mt-0.5 truncate">{fullName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-blue-200 uppercase tracking-wider font-medium">Ngày sinh</div>
                    <div className="font-bold text-base text-white mt-0.5">{birthDate.split('-').reverse().join('/')}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-blue-100">
                  <span>Bệnh viện ĐK Hợp lệ</span>
                  <span className="font-bold">BV Nhân Dân (Hà Nội)</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#004e92]" /> Bảo mật tài khoản
              </h3>
              <p className="text-xs text-gray-600">
                Mật khẩu của bạn đã được mã hóa an toàn trên máy chủ. Bạn có thể đổi mật khẩu mới nếu muốn tăng cường bảo mật.
              </p>
              <button 
                onClick={() => alert('Đang chuyển hướng sang trang Đổi Mật Khẩu...')}
                className="w-full py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold rounded-2xl transition-colors text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <Key className="w-4 h-4 text-gray-500" /> Đổi mật khẩu tài khoản
              </button>
            </div>
          </div>

          {/* Cột phải: Form chỉnh sửa */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100 flex items-center gap-2">
                <User className="w-6 h-6 text-[#004e92]" /> Cập nhật thông tin định danh
              </h2>

              {successMsg && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl text-sm font-semibold flex items-center gap-3 animate-fadeIn shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-[#004e92]" /> Họ và tên đầy đủ
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors font-medium text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-[#004e92]" /> Địa chỉ Email (Tên đăng nhập)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || 'user@gmail.com'}
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-2xl text-sm text-gray-500 font-medium cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-[#004e92]" /> Số điện thoại liên hệ
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors font-medium text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-[#004e92]" /> Mã số Bảo hiểm Y tế (BHYT)
                    </label>
                    <input
                      type="text"
                      value={bhytCode}
                      onChange={(e) => setBhytCode(e.target.value)}
                      placeholder="Nhập mã thẻ BHYT của bạn..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors font-mono font-bold text-gray-900 uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#004e92]" /> Ngày sinh
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors font-medium text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-[#004e92]" /> Giới tính
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors font-medium text-gray-900"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>

                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#004e92] hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-2xl transition-colors shadow-lg flex items-center gap-2 text-sm"
                  >
                    <Save className="w-4 h-4" /> Lưu thông tin hồ sơ
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
