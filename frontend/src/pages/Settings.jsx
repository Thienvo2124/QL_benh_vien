import { useState, useContext, useEffect } from 'react';
import { User, Building, Shield, FileText, Save, Key, Phone, Mail, MapPin, Clock, CheckCircle, Bell, Activity } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import API_BASE_URL from '../config/api';

const sampleLogs = [
  { id: 'LOG-001', time: '18:55 - 28/06/2026', user: 'Bệnh nhân (bacsi@gmail.com)', action: 'Đăng nhập vào cổng dịch vụ trực tuyến', ip: '192.168.1.45', status: 'Thành công' },
  { id: 'LOG-002', time: '18:52 - 28/06/2026', user: 'Admin (admin123@gmail.com)', action: 'Cập nhật cấu hình phân quyền hệ thống', ip: '192.168.1.10', status: 'Thành công' },
  { id: 'LOG-003', time: '17:30 - 28/06/2026', user: 'Bác sĩ (doctor1@gmail.com)', action: 'Xem danh sách lịch hẹn khám bệnh', ip: '192.168.1.18', status: 'Thành công' },
  { id: 'LOG-004', time: '16:15 - 28/06/2026', user: 'Hệ thống tự động', action: 'Đồng bộ cơ sở dữ liệu MongoDB Atlas', ip: '127.0.0.1', status: 'Thành công' },
  { id: 'LOG-005', time: '15:20 - 28/06/2026', user: 'Bệnh nhân (qưertyui)', action: 'Đăng ký mới 1 lịch khám chuyên khoa Tim mạch', ip: '192.168.1.88', status: 'Thành công' },
  { id: 'LOG-006', time: '14:05 - 28/06/2026', user: 'Admin (admin123@gmail.com)', action: 'Cập nhật danh mục 5 loại thuốc mới vào kho', ip: '192.168.1.10', status: 'Thành công' }
];

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile'); // profile, system, security, logs
  
  // Tab 1: Profile state
  const [fullName, setFullName] = useState(user?.fullName || (user?.role === 'admin' ? 'Quản trị viên Hệ thống' : 'Bác sĩ Chuyên khoa'));
  const [phone, setPhone] = useState(user?.phone || '0988777666');
  const [position, setPosition] = useState(user?.role === 'admin' ? 'Giám đốc Công nghệ (CTO)' : 'Bác sĩ Trưởng Khoa');
  const [dept, setDept] = useState(user?.role === 'admin' ? 'Ban Quản trị & Điều hành' : 'Khoa Nội Tổng hợp');
  
  // Tab 2: System state
  const [hospName, setHospName] = useState('Bệnh viện Nhân Dân (Hà Nội)');
  const [hotline, setHotline] = useState('(028) 3551 0063');
  const [emailContact, setEmailContact] = useState('info@bvndgiadinh.org.vn');
  const [address, setAddress] = useState('Số 1 Nơ Trang Long, P. Gia Định, Hà Nội');
  const [openHours, setOpenHours] = useState('07:00 - 17:00 (Thứ 2 - Thứ 7)');
  const [reminderHours, setReminderHours] = useState(3);

  // Tab 3: Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [enableAlerts, setEnableAlerts] = useState(true);
  const [enable2FA, setEnable2FA] = useState(true);

  const [successMsg, setSuccessMsg] = useState('');

  const fetchSystemSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/settings`);
      if (response.ok) {
        const data = await response.json();
        if (data.hospName) setHospName(data.hospName);
        if (data.hotline) setHotline(data.hotline);
        if (data.emailContact) setEmailContact(data.emailContact);
        if (data.address) setAddress(data.address);
        if (data.openHours) setOpenHours(data.openHours);
        if (data.reminder_hours !== undefined) setReminderHours(Number(data.reminder_hours));
      }
    } catch (err) {
      console.error('Lỗi khi tải cấu hình hệ thống:', err);
    }
  };

  const handleSaveSystem = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          hospName,
          hotline,
          emailContact,
          address,
          openHours,
          reminder_hours: reminderHours
        })
      });

      if (response.ok) {
        setSuccessMsg('Đã lưu cấu hình Bệnh viện thành công!');
        setTimeout(() => setSuccessMsg(''), 5000);
      } else {
        const errData = await response.json();
        alert(`Lỗi: ${errData.message || 'Không thể lưu cài đặt'}`);
      }
    } catch (err) {
      console.error('Lỗi lưu cài đặt:', err);
      alert('Lỗi kết nối máy chủ.');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSuccessMsg('Đã lưu toàn bộ thông tin cấu hình thành công!');
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/users/logs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (err) {
      console.error('Lỗi khi lấy log:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchLogs();
    } else if (activeTab === 'system' || activeTab === 'email') {
      fetchSystemSettings();
    }
  }, [activeTab]);

  return (
    <div className="space-y-8 font-sans">
      {/* Header / Title */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-wide flex items-center gap-3">
            <Building className="w-8 h-8 text-[#004e92]" /> Cấu hình & Quản trị Hệ thống
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Thiết lập hồ sơ cá nhân, tinh chỉnh thông tin bệnh viện, tăng cường bảo mật và giám sát hoạt động.
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-100 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-bold text-[#004e92] uppercase tracking-wider">
            Quyền: {user?.role === 'admin' ? 'Quản trị viên Toàn quyền' : 'Bác sĩ kiểm duyệt'}
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-gray-200/60 p-1.5 rounded-2xl flex flex-wrap gap-2 w-max max-w-full shadow-inner border border-gray-300/40">
        <button
          onClick={() => { setActiveTab('profile'); setSuccessMsg(''); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'profile'
              ? 'bg-[#004e92] text-white shadow-lg transform -translate-y-0.5'
              : 'text-gray-600 hover:bg-gray-300/50'
          }`}
        >
          <User className="w-4 h-4" /> Hồ sơ Quản trị
        </button>
        <button
          onClick={() => { setActiveTab('system'); setSuccessMsg(''); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'system'
              ? 'bg-[#004e92] text-white shadow-lg transform -translate-y-0.5'
              : 'text-gray-600 hover:bg-gray-300/50'
          }`}
        >
          <Building className="w-4 h-4" /> Thông tin Bệnh viện
        </button>
        <button
          onClick={() => { setActiveTab('email'); setSuccessMsg(''); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'email'
              ? 'bg-[#004e92] text-white shadow-lg transform -translate-y-0.5'
              : 'text-gray-600 hover:bg-gray-300/50'
          }`}
        >
          <Mail className="w-4 h-4" /> Gửi Mail & Nhắc lịch
        </button>
        <button
          onClick={() => { setActiveTab('security'); setSuccessMsg(''); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'security'
              ? 'bg-[#004e92] text-white shadow-lg transform -translate-y-0.5'
              : 'text-gray-600 hover:bg-gray-300/50'
          }`}
        >
          <Shield className="w-4 h-4" /> Bảo mật & Khóa
        </button>
        <button
          onClick={() => { setActiveTab('logs'); setSuccessMsg(''); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'logs'
              ? 'bg-[#004e92] text-white shadow-lg transform -translate-y-0.5'
              : 'text-gray-600 hover:bg-gray-300/50'
          }`}
        >
          <FileText className="w-4 h-4" /> Nhật ký Hoạt động
        </button>
      </div>

      {/* Message */}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl text-sm font-semibold flex items-center gap-3 animate-fadeIn shadow-sm">
          <CheckCircle className="w-5 h-5 text-green-600" />
          {successMsg}
        </div>
      )}

      {/* Tab Content */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
        
        {/* TAB 1: PROFILE */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-[#004e92]" /> Cập nhật Hồ sơ Người điều hành
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên hiển thị</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors font-medium text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ Email (Tên đăng nhập)</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || 'admin@gmail.com'}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-2xl text-sm text-gray-500 font-medium cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại liên hệ</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors font-medium text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Chức danh / Vị trí</label>
                <input
                  type="text"
                  required
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors font-medium text-gray-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phòng ban / Chuyên khoa trực thuộc</label>
                <input
                  type="text"
                  required
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors font-medium text-gray-900"
                />
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
        )}

        {/* TAB 2: SYSTEM */}
        {activeTab === 'system' && (
          <form onSubmit={handleSaveSystem} className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Building className="w-5 h-5 text-[#004e92]" /> Thiết lập Thông tin Bệnh viện / Phòng khám
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-[#004e92]" /> Tên Bệnh viện / Tổ chức y tế
                </label>
                <input
                  type="text"
                  required
                  value={hospName}
                  onChange={(e) => setHospName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors font-medium text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-[#004e92]" /> Hotline cấp cứu & Tổng đài
                </label>
                <input
                  type="text"
                  required
                  value={hotline}
                  onChange={(e) => setHotline(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors font-medium text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-[#004e92]" /> Email đối ngoại & Liên hệ
                </label>
                <input
                  type="email"
                  required
                  value={emailContact}
                  onChange={(e) => setEmailContact(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors font-medium text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#004e92]" /> Khung giờ mở cửa hoạt động
                </label>
                <input
                  type="text"
                  required
                  value={openHours}
                  onChange={(e) => setOpenHours(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors font-medium text-gray-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#004e92]" /> Địa chỉ Trụ sở chính
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors font-medium text-gray-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-[#004e92]" /> Thời gian gửi email nhắc lịch trước giờ khám
                </label>
                <select
                  value={reminderHours}
                  onChange={(e) => setReminderHours(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors font-semibold text-gray-900 cursor-pointer"
                >
                  <option value={0}>Tắt nhắc nhở</option>
                  <option value={1}>1 giờ trước khám</option>
                  <option value={2}>2 giờ trước khám</option>
                  <option value={3}>3 giờ trước khám</option>
                  <option value={6}>6 giờ trước khám</option>
                  <option value={12}>12 giờ trước khám</option>
                  <option value={24}>24 giờ trước khám</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="bg-[#004e92] hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-2xl transition-colors shadow-lg flex items-center gap-2 text-sm"
              >
                <Save className="w-4 h-4" /> Cập nhật cấu hình Bệnh viện
              </button>
            </div>
          </form>
        )}

        {/* TAB: EMAIL CONFIG */}
        {activeTab === 'email' && (
          <div className="space-y-10">
            <form onSubmit={handleSaveEmail} className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#004e92]" /> Cấu hình Gửi Mail & Nhắc lịch khám
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gmail gửi thư tự động (SMTP)</label>
                  <input
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    value={emailUser}
                    onChange={(e) => setEmailUser(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors font-medium text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
                    <span>Mật khẩu ứng dụng Google (16 ký tự)</span>
                    <button
                      type="button"
                      onClick={() => setShowEmailPass(!showEmailPass)}
                      className="text-xs text-[#004e92] hover:underline font-bold"
                    >
                      {showEmailPass ? 'Ẩn' : 'Hiện'}
                    </button>
                  </label>
                  <input
                    type={showEmailPass ? 'text' : 'password'}
                    required
                    placeholder="Mật khẩu ứng dụng 16 ký tự"
                    value={emailPass}
                    onChange={(e) => setEmailPass(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors font-medium text-gray-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Thời gian gửi email nhắc lịch tự động trước khi khám
                  </label>
                  <select
                    value={reminderHours}
                    onChange={(e) => setReminderHours(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors font-semibold text-gray-900 cursor-pointer"
                  >
                    <option value={0}>Tắt nhắc nhở</option>
                    <option value={1}>1 giờ trước khám</option>
                    <option value={2}>2 giờ trước khám</option>
                    <option value={3}>3 giờ trước khám</option>
                    <option value={6}>6 giờ trước khám</option>
                    <option value={12}>12 giờ trước khám</option>
                    <option value={24}>24 giờ trước khám</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#004e92] hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-2xl transition-colors shadow-lg flex items-center gap-2 text-sm"
                >
                  <Save className="w-4 h-4" /> Lưu cấu hình Email
                </button>
              </div>
            </form>

            <form onSubmit={handleTestEmail} className="bg-gray-50 p-6 rounded-3xl border border-gray-200/60 space-y-6">
              <div>
                <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" /> Thử nghiệm gửi Email & Kết nối SMTP
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Nhập địa chỉ nhận test để hệ thống gửi thử một email mẫu nhằm kiểm tra xem tài khoản Gmail gửi và mật khẩu ứng dụng bạn cấu hình bên trên đã chuẩn xác chưa.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-bold text-gray-700 mb-2">Địa chỉ Gmail nhận thư test</label>
                  <input
                    type="email"
                    required
                    placeholder="email-nhan-test@gmail.com"
                    value={testRecipient}
                    onChange={(e) => setTestRecipient(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={testLoading || !testRecipient}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-2xl transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {testLoading ? 'Đang gửi...' : 'Gửi thử ngay'}
                </button>
              </div>

              {testSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-semibold">
                  🎉 {testSuccess}
                </div>
              )}

              {testError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs font-semibold whitespace-pre-wrap">
                  ❌ Gửi test thất bại! Chi tiết lỗi: {testError}
                </div>
              )}
            </form>
          </div>
        )}

        {/* TAB 3: SECURITY */}
        {activeTab === 'security' && (
          <form onSubmit={handleSave} className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2 mb-6">
                <Key className="w-5 h-5 text-[#004e92]" /> Đổi mật khẩu Quản trị viên
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu mới</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-[#004e92]" /> Cơ chế bảo mật nâng cao
              </h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-[#004e92]" />
                    <div>
                      <div className="font-bold text-gray-900 text-sm">Gửi cảnh báo đăng nhập bất thường</div>
                      <div className="text-xs text-gray-500">Hệ thống sẽ gửi email thông báo khi có địa chỉ IP lạ đăng nhập.</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableAlerts}
                    onChange={(e) => setEnableAlerts(e.target.checked)}
                    className="w-5 h-5 accent-[#004e92] rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#004e92]" />
                    <div>
                      <div className="font-bold text-gray-900 text-sm">Bật xác thực hai yếu tố (2FA Security)</div>
                      <div className="text-xs text-gray-500">Bảo vệ tài khoản qua mã xác nhận gửi về ứng dụng Authenticator hoặc SMS.</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enable2FA}
                    onChange={(e) => setEnable2FA(e.target.checked)}
                    className="w-5 h-5 accent-[#004e92] rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="bg-[#004e92] hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-2xl transition-colors shadow-lg flex items-center gap-2 text-sm"
              >
                <Save className="w-4 h-4" /> Lưu cấu hình bảo mật
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: LOGS */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#004e92]" /> Nhật ký Truy cập & Thao tác Hệ thống
              </h3>
              <span className="text-xs bg-blue-50 text-[#004e92] font-bold px-3 py-1 rounded-full border border-blue-200">
                Lưu trữ tự động 30 ngày
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="p-4 font-medium w-24">Mã Log</th>
                    <th className="p-4 font-medium w-48">Thời gian</th>
                    <th className="p-4 font-medium">Tài khoản / Đối tượng</th>
                    <th className="p-4 font-medium">Hành động thực thi</th>
                    <th className="p-4 font-medium w-32">Địa chỉ IP</th>
                    <th className="p-4 font-medium w-28 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                  {logsLoading ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-500 font-semibold animate-pulse">
                        Đang tải nhật ký hoạt động...
                      </td>
                    </tr>
                  ) : logs.length > 0 ? (
                    logs.map((log) => (
                      <tr key={log._id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="p-4 font-bold text-[#004e92] text-xs font-mono">
                          LOG-{log._id ? log._id.substring(18).toUpperCase() : 'N/A'}
                        </td>
                        <td className="p-4 text-xs font-semibold text-gray-600">
                          {new Date(log.createdAt).toLocaleString('vi-VN')}
                        </td>
                        <td className="p-4 font-bold text-gray-800 text-xs">{log.user}</td>
                        <td className="p-4 text-gray-700 text-sm font-medium">{log.action}</td>
                        <td className="p-4 text-xs font-mono text-gray-500">{log.ip}</td>
                        <td className="p-4 text-center">
                          <span className={`border px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
                            log.status === 'Thành công'
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : 'bg-red-100 text-red-800 border-red-200'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-400 italic">
                        Chưa có hoạt động nào được ghi nhận.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
              <span>Đang hiển thị {logs.length} sự kiện thao tác mới nhất trong hệ thống.</span>
              <button 
                onClick={() => alert('Đang xuất toàn bộ Log hệ thống ra file Excel...')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-xl transition-colors shadow-sm"
              >
                Xuất File Báo Cáo (Excel)
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Settings;
