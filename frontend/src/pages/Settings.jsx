import { useState, useContext, useEffect } from 'react';
import { User, Building, Shield, FileText, Save, Key, Phone, Mail, MapPin, Clock, CheckCircle, Bell, Activity, DollarSign } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('profile'); // profile, system, security, logs, payment, fees
  
  // Tab 5: Payment account state
  const [paymentBank, setPaymentBank] = useState('MB Bank (Quân Đội)');
  const [paymentAccountNumber, setPaymentAccountNumber] = useState('1900 2115 9999');
  const [paymentAccountName, setPaymentAccountName] = useState('BENH VIEN NHAN DAN');
  const [paymentRecords, setPaymentRecords] = useState([]);

  // Tab 6: Department clinical fees state
  const [deptFees, setDeptFees] = useState({
    goi_kham_co_ban: 1500000,
    goi_kham_nang_cao: 2500000,
    goi_kham_chuyen_sau: 4500000,
    goi_kham_vip_gold: 8000000,
    goi_kham_vip_platinum: 15000000,
    goi_kham_tam_soat_ung_thu_tong_quat: 3000000,
    goi_kham_tam_soat_ung_thu_tieu_hoa: 2200000,
    goi_kham_tam_soat_dot_quy: 2800000,
    chan_doan_hinh_anh: 150000,
    noi_tong_quat: 150000,
    tai_mui_hong: 150000,
    mat: 150000,
    rang_ham_mat: 150000,
    tim_mach: 150000,
    san_phu_khoa: 150000,
    tuyen_vu: 150000,
    ho_hap: 150000,
    di_ung_mien_dich: 150000,
    tu_van_giac_ngu: 150000
  });
  
  // Tab 1: Profile state
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [position, setPosition] = useState('');
  const [dept, setDept] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || (
        user.role === 'admin' ? 'Quản trị viên Hệ thống' :
        user.role === 'doctor' ? 'Bác sĩ Chuyên khoa' :
        user.role === 'nurse' ? 'Dược sĩ' :
        user.role === 'cashier' ? 'Thu ngân' : 'Bệnh nhân'
      ));
      setPhone(user.phone || '');
      
      setPosition(
        user.role === 'admin' ? 'Giám đốc Công nghệ (CTO)' :
        user.role === 'doctor' ? 'Bác sĩ Chuyên khoa' :
        user.role === 'nurse' ? 'Dược sĩ hệ thống' :
        user.role === 'cashier' ? 'Thu ngân bệnh viện' : 'Bệnh nhân'
      );
      
      setDept(
        user.role === 'admin' ? 'Ban Quản trị & Điều hành' :
        user.role === 'doctor' ? (user.department || 'Khoa Nội Tổng hợp') :
        user.role === 'nurse' ? 'Khoa Dược & Cấp phát thuốc' :
        user.role === 'cashier' ? 'Phòng Kế hoạch - Tài chính' : 'Bệnh nhân'
      );
      
      // Khóa tab nếu vai trò không phải Admin
      if (user.role !== 'admin' && !['profile', 'security'].includes(activeTab)) {
        setActiveTab('profile');
      }
    }
  }, [user, activeTab]);
  
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

  // Tab 3: Email states
  const [emailUser, setEmailUser] = useState('');
  const [emailPass, setEmailPass] = useState('');
  const [showEmailPass, setShowEmailPass] = useState(false);
  const [testRecipient, setTestRecipient] = useState('');
  const [testLoading, setTestLoading] = useState(false);
  const [testSuccess, setTestSuccess] = useState('');
  const [testError, setTestError] = useState('');
  const [testType, setTestType] = useState('connectivity');
  
  // Custom templates
  const [emailConfirmSubject, setEmailConfirmSubject] = useState('[Bệnh viện Nhân Dân] Xác nhận đăng ký lịch hẹn khám thành công - Mã: {appointmentCode}');
  const [emailConfirmContent, setEmailConfirmContent] = useState(`Xin chào {name},

Chúc mừng bạn đã đăng ký lịch khám bệnh trực tuyến thành công tại Bệnh viện Nhân Dân.

Dưới đây là thông tin chi tiết về lịch khám của bạn:
- Mã lịch hẹn: {appointmentCode}
- Chuyên khoa: {dept}
- Bác sĩ khám: {doctor}
- Ngày khám: {date}
- Khung giờ: {time}

⚠️ Lưu ý quan trọng:
- Quý khách vui lòng đến trước giờ hẹn khám 15-30 phút để hoàn tất thủ tục tiếp nhận và đo sinh hiệu ban đầu.
- Khi đi mang theo Thẻ BHYT (nếu có) và CCCD để đối chiếu thông tin nhanh chóng.
- Nếu có bất kỳ thay đổi nào hoặc cần hủy lịch hẹn, vui lòng thực hiện trước 24 giờ trên hệ thống của chúng tôi hoặc liên hệ Hotline tổng đài hỗ trợ.

Cảm ơn quý khách và chúc quý khách nhiều sức khỏe!`);
  const [emailReminderSubject, setEmailReminderSubject] = useState('[Nhắc lịch khám] Lịch khám bệnh của bạn tại Bệnh viện Nhân Dân sắp diễn ra');
  const [emailReminderContent, setEmailReminderContent] = useState(`Xin chào {name},

Bệnh viện Nhân Dân xin thông báo nhắc nhở: Lịch khám bệnh của bạn tại chuyên khoa {dept} sẽ diễn ra sau khoảng {hours} giờ nữa.

Thông tin chi tiết lịch hẹn:
- Mã lịch hẹn: {appointmentCode}
- Bác sĩ khám: {doctor}
- Ngày khám: {date}
- Khung giờ: {time}

Vui lòng sắp xếp thời gian để tới khám đúng hẹn.

Cảm ơn quý khách và chúc quý khách nhiều sức khỏe!`);

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
        if (data.email_user) setEmailUser(data.email_user);
        if (data.email_pass) setEmailPass(data.email_pass);
        if (data.email_confirm_subject) setEmailConfirmSubject(data.email_confirm_subject);
        if (data.email_confirm_content) setEmailConfirmContent(data.email_confirm_content);
        if (data.email_reminder_subject) setEmailReminderSubject(data.email_reminder_subject);
        if (data.email_reminder_content) setEmailReminderContent(data.email_reminder_content);
        if (data.payment_bank) setPaymentBank(data.payment_bank);
        if (data.payment_account_number) setPaymentAccountNumber(data.payment_account_number);
        if (data.payment_account_name) setPaymentAccountName(data.payment_account_name);
        
        // Cập nhật phí khám chuyên khoa
        setDeptFees({
          goi_kham_co_ban: Number(data.deptfee_goi_kham_co_ban) || 1500000,
          goi_kham_nang_cao: Number(data.deptfee_goi_kham_nang_cao) || 2500000,
          goi_kham_chuyen_sau: Number(data.deptfee_goi_kham_chuyen_sau) || 4500000,
          goi_kham_vip_gold: Number(data.deptfee_goi_kham_vip_gold) || 8000000,
          goi_kham_vip_platinum: Number(data.deptfee_goi_kham_vip_platinum) || 15000000,
          goi_kham_tam_soat_ung_thu_tong_quat: Number(data.deptfee_goi_kham_tam_soat_ung_thu_tong_quat) || 3000000,
          goi_kham_tam_soat_ung_thu_tieu_hoa: Number(data.deptfee_goi_kham_tam_soat_ung_thu_tieu_hoa) || 2200000,
          goi_kham_tam_soat_dot_quy: Number(data.deptfee_goi_kham_tam_soat_dot_quy) || 2800000,
          chan_doan_hinh_anh: Number(data.deptfee_chan_doan_hinh_anh) || 150000,
          noi_tong_quat: Number(data.deptfee_noi_tong_quat) || 150000,
          tai_mui_hong: Number(data.deptfee_tai_mui_hong) || 150000,
          mat: Number(data.deptfee_mat) || 150000,
          rang_ham_mat: Number(data.deptfee_rang_ham_mat) || 150000,
          tim_mach: Number(data.deptfee_tim_mach) || 150000,
          san_phu_khoa: Number(data.deptfee_san_phu_khoa) || 150000,
          tuyen_vu: Number(data.deptfee_tuyen_vu) || 150000,
          ho_hap: Number(data.deptfee_ho_hap) || 150000,
          di_ung_mien_dich: Number(data.deptfee_di_ung_mien_dich) || 150000,
          tu_van_giac_ngu: Number(data.deptfee_tu_van_giac_ngu) || 150000
        });
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

  const handleSaveEmail = async (e) => {
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
          email_user: emailUser,
          email_pass: emailPass,
          reminder_hours: reminderHours,
          email_confirm_subject: emailConfirmSubject,
          email_confirm_content: emailConfirmContent,
          email_reminder_subject: emailReminderSubject,
          email_reminder_content: emailReminderContent
        })
      });

      if (response.ok) {
        setSuccessMsg('Đã lưu cấu hình Email & Nhắc lịch thành công!');
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

  const handleTestEmail = async (e) => {
    e.preventDefault();
    if (!testRecipient) return;
    setTestLoading(true);
    setTestSuccess('');
    setTestError('');

    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/settings/test-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipientEmail: testRecipient,
          email_user: emailUser,
          email_pass: emailPass,
          templateType: testType,
          email_confirm_subject: emailConfirmSubject,
          email_confirm_content: emailConfirmContent,
          email_reminder_subject: emailReminderSubject,
          email_reminder_content: emailReminderContent
        })
      });

      const data = await response.json();
      if (response.ok) {
        setTestSuccess(data.message || 'Gửi email test thành công!');
      } else {
        setTestError(data.error || data.message || 'Gửi email test thất bại.');
      }
    } catch (err) {
      console.error('Lỗi gửi email test:', err);
      setTestError('Lỗi kết nối máy chủ khi gửi thử.');
    } finally {
      setTestLoading(false);
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

  const fetchPaymentRecords = async () => {
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const records = data.filter(app => app.paymentStatus === 'paid' || app.prescriptionStatus === 'paid');
        setPaymentRecords(records);
      }
    } catch (err) {
      console.error('Lỗi khi tải lịch sử thanh toán:', err);
    }
  };

  const handleSavePayment = async (e) => {
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
          payment_bank: paymentBank,
          payment_account_number: paymentAccountNumber,
          payment_account_name: paymentAccountName
        })
      });

      if (response.ok) {
        setSuccessMsg('Đã lưu thông tin tài khoản thanh toán thành công!');
        setTimeout(() => setSuccessMsg(''), 5000);
      } else {
        const errData = await response.json();
        alert(`Lỗi: ${errData.message || 'Không thể lưu cài đặt'}`);
      }
    } catch (err) {
      console.error('Lỗi lưu cài đặt thanh toán:', err);
      alert('Lỗi kết nối máy chủ.');
    }
  };

  const handleSaveDeptFees = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      
      const payload = {};
      Object.entries(deptFees).forEach(([key, value]) => {
        payload[`deptfee_${key}`] = value;
      });

      const response = await fetch(`${API_BASE_URL}/api/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSuccessMsg('Đã cập nhật lệ phí khám của các chuyên khoa thành công!');
        setTimeout(() => setSuccessMsg(''), 5000);
      } else {
        const errData = await response.json();
        alert(`Lỗi: ${errData.message || 'Không thể lưu cài đặt'}`);
      }
    } catch (err) {
      console.error('Lỗi lưu cài đặt lệ phí khám:', err);
      alert('Lỗi kết nối máy chủ.');
    }
  };

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchLogs();
    } else if (activeTab === 'system' || activeTab === 'email' || activeTab === 'payment' || activeTab === 'fees') {
      fetchSystemSettings();
    }
    if (activeTab === 'payment') {
      fetchPaymentRecords();
    }
  }, [activeTab]);

  return (
    <div className="space-y-8 font-sans">
      {/* Header / Title */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-wide flex items-center gap-3">
            {user?.role === 'admin' ? (
              <>
                <Building className="w-8 h-8 text-[#004e92]" /> Cấu hình & Quản trị Hệ thống
              </>
            ) : (
              <>
                <User className="w-8 h-8 text-[#004e92]" /> Thông tin cá nhân
              </>
            )}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {user?.role === 'admin'
              ? 'Thiết lập hồ sơ cá nhân, tinh chỉnh thông tin bệnh viện, tăng cường bảo mật và giám sát hoạt động.'
              : 'Xem thông tin cá nhân và thay đổi mật khẩu bảo mật tài khoản.'}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-100 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-bold text-[#004e92] uppercase tracking-wider">
            Quyền: {
              user?.role === 'admin' ? 'Quản trị viên Toàn quyền' :
              user?.role === 'doctor' ? 'Bác sĩ chuyên khoa' :
              user?.role === 'nurse' ? 'Dược sĩ hệ thống' :
              user?.role === 'cashier' ? 'Thu ngân bệnh viện' : 'Bệnh nhân'
            }
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-gray-200/60 p-1.5 rounded-2xl flex flex-wrap gap-2 w-full shadow-inner border border-gray-300/40">
        <button
          onClick={() => { setActiveTab('profile'); setSuccessMsg(''); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shrink-0 ${
            activeTab === 'profile'
              ? 'bg-[#004e92] text-white shadow-lg transform -translate-y-0.5'
              : 'text-gray-600 hover:bg-gray-300/50'
          }`}
        >
          <User className="w-4 h-4" /> {user?.role === 'admin' ? 'Hồ sơ Quản trị' : 'Hồ sơ cá nhân'}
        </button>

        {user?.role === 'admin' && (
          <>
            <button
              onClick={() => { setActiveTab('system'); setSuccessMsg(''); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shrink-0 ${
                activeTab === 'system'
                  ? 'bg-[#004e92] text-white shadow-lg transform -translate-y-0.5'
                  : 'text-gray-600 hover:bg-gray-300/50'
              }`}
            >
              <Building className="w-4 h-4" /> Thông tin Bệnh viện
            </button>
            <button
              onClick={() => { setActiveTab('email'); setSuccessMsg(''); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shrink-0 ${
                activeTab === 'email'
                  ? 'bg-[#004e92] text-white shadow-lg transform -translate-y-0.5'
                  : 'text-gray-600 hover:bg-gray-300/50'
              }`}
            >
              <Mail className="w-4 h-4" /> Gửi Mail & Nhắc lịch
            </button>
          </>
        )}

        <button
          onClick={() => { setActiveTab('security'); setSuccessMsg(''); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shrink-0 ${
            activeTab === 'security'
              ? 'bg-[#004e92] text-white shadow-lg transform -translate-y-0.5'
              : 'text-gray-600 hover:bg-gray-300/50'
          }`}
        >
          <Shield className="w-4 h-4" /> Bảo mật & Khóa
        </button>

        {user?.role === 'admin' && (
          <>
            <button
              onClick={() => { setActiveTab('logs'); setSuccessMsg(''); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shrink-0 ${
                activeTab === 'logs'
                  ? 'bg-[#004e92] text-white shadow-lg transform -translate-y-0.5'
                  : 'text-gray-600 hover:bg-gray-300/50'
              }`}
            >
              <FileText className="w-4 h-4" /> Nhật ký Hoạt động
            </button>
            <button
              onClick={() => { setActiveTab('payment'); setSuccessMsg(''); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shrink-0 ${
                activeTab === 'payment'
                  ? 'bg-[#004e92] text-white shadow-lg transform -translate-y-0.5'
                  : 'text-gray-600 hover:bg-gray-300/50'
              }`}
            >
              <DollarSign className="w-4 h-4" /> Tài khoản thanh toán
            </button>
            <button
              onClick={() => { setActiveTab('fees'); setSuccessMsg(''); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shrink-0 ${
                activeTab === 'fees'
                  ? 'bg-[#004e92] text-white shadow-lg transform -translate-y-0.5'
                  : 'text-gray-600 hover:bg-gray-300/50'
              }`}
            >
              <Activity className="w-4 h-4" /> Điều chỉnh lệ phí khám
            </button>
          </>
        )}
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
                  value={user?.email || user?.phone || ''}
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

              {/* Divider & Template Editor */}
              <div className="border-t border-gray-100 pt-6 space-y-6">
                <div>
                  <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#004e92]" /> Biên soạn Mẫu nội dung gửi Mail
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Tự do thay đổi tiêu đề và nội dung văn bản của email gửi đi. Bạn chỉ cần nhập các câu từ bình thường, hệ thống sẽ tự động định dạng và trang trí thư thật đẹp mắt trước khi gửi. Sử dụng các thẻ động sau:
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-[#004e92] font-semibold">
                    <div><code>{`{name}`}</code>: Tên bệnh nhân</div>
                    <div><code>{`{appointmentCode}`}</code>: Mã lịch hẹn</div>
                    <div><code>{`{dept}`}</code>: Khoa khám bệnh</div>
                    <div><code>{`{doctor}`}</code>: Tên bác sĩ</div>
                    <div><code>{`{date}`}</code>: Ngày khám bệnh</div>
                    <div><code>{`{time}`}</code>: Giờ khám bệnh</div>
                    <div><code>{`{hours}`}</code>: Số tiếng nhắc trước</div>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Confirm Email Template */}
                  <div className="bg-gray-50/50 p-5 rounded-3xl border border-gray-200/60 space-y-4">
                    <h5 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" /> 1. Thư Xác nhận đặt lịch thành công
                    </h5>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Tiêu đề email</label>
                        <input
                          type="text"
                          required
                          value={emailConfirmSubject}
                          onChange={(e) => setEmailConfirmSubject(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#004e92] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Nội dung thư (Plain Text)</label>
                        <textarea
                          rows={8}
                          required
                          value={emailConfirmContent}
                          onChange={(e) => setEmailConfirmContent(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-[#004e92] transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reminder Email Template */}
                  <div className="bg-gray-50/50 p-5 rounded-3xl border border-gray-200/60 space-y-4">
                    <h5 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-600" /> 2. Thư Nhắc lịch khám sắp diễn ra
                    </h5>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Tiêu đề email</label>
                        <input
                          type="text"
                          required
                          value={emailReminderSubject}
                          onChange={(e) => setEmailReminderSubject(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#004e92] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Nội dung thư (Plain Text)</label>
                        <textarea
                          rows={8}
                          required
                          value={emailReminderContent}
                          onChange={(e) => setEmailReminderContent(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-[#004e92] transition-colors"
                        />
                      </div>
                    </div>
                  </div>
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
                  <label className="block text-xs font-bold text-gray-700 mb-2">Chọn mẫu gửi thử</label>
                  <select
                    value={testType}
                    onChange={(e) => setTestType(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] transition-colors font-semibold text-gray-900 cursor-pointer"
                  >
                    <option value="connectivity">Kiểm tra kết nối SMTP (Thư tự động)</option>
                    <option value="confirm">Gửi thử Thư xác nhận đặt lịch</option>
                    <option value="reminder">Gửi thử Thư nhắc lịch khám</option>
                  </select>
                </div>

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

        {/* TAB 5: PAYMENT */}
        {activeTab === 'payment' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Form cấu hình tài khoản thanh toán */}
            <form onSubmit={handleSavePayment} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#004e92]" /> Cấu hình Tài khoản nhận thanh toán qua SePay / Chuyển khoản
                </h3>
                <p className="text-xs text-gray-400 mt-1">Thông tin này sẽ được dùng để tạo mã QR Code động hiển thị cho bệnh nhân tại Quầy thu ngân.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Ngân hàng */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Ngân hàng thụ hưởng *</label>
                  <select
                    required
                    value={paymentBank}
                    onChange={(e) => setPaymentBank(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92]"
                  >
                    <option value="Vietcombank">Vietcombank (Ngoại thương Việt Nam)</option>
                    <option value="MB Bank (Quân Đội)">MB Bank (Quân Đội)</option>
                    <option value="Techcombank">Techcombank (Kỹ thương)</option>
                    <option value="ACB">ACB (Á Châu)</option>
                    <option value="BIDV">BIDV (Đầu tư & Phát triển)</option>
                    <option value="VietinBank">VietinBank (Công thương)</option>
                    <option value="Agribank">Agribank (Nông nghiệp)</option>
                    <option value="TPBank">TPBank (Tiên Phong)</option>
                    <option value="VPBank">VPBank (Việt Nam Thịnh Vượng)</option>
                    <option value="Sacombank">Sacombank (Sài Gòn Thương Tín)</option>
                  </select>
                </div>

                {/* Số tài khoản */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Số tài khoản *</label>
                  <input
                    type="text"
                    required
                    value={paymentAccountNumber}
                    onChange={(e) => setPaymentAccountNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92] font-mono font-bold"
                  />
                </div>

                {/* Tên tài khoản */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Tên chủ tài khoản (Không dấu) *</label>
                  <input
                    type="text"
                    required
                    value={paymentAccountName}
                    onChange={(e) => setPaymentAccountName(e.target.value.toUpperCase())}
                    placeholder="Ví dụ: VO THUAN THIEN"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92] font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <button
                  type="submit"
                  className="bg-[#004e92] hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-2xl transition-colors shadow-lg flex items-center gap-2 text-sm"
                >
                  <Save className="w-4 h-4" /> Lưu thông tin thanh toán
                </button>
              </div>
            </form>

            {/* Bảng liệt kê dữ liệu thanh toán */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600" /> Nhật ký Giao dịch Thanh toán thành công (Thực nhận)
                </h3>
                <p className="text-xs text-gray-400 mt-1">Danh sách tất cả các khoản thanh toán phí khám lâm sàng ban đầu và đơn thuốc đã thu ngân thành công.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                      <th className="p-4 font-medium text-center w-16">STT</th>
                      <th className="p-4 font-medium w-48">Thời gian giao dịch</th>
                      <th className="p-4 font-medium">Bệnh nhân & Liên hệ</th>
                      <th className="p-4 font-medium">Nội dung thanh toán</th>
                      <th className="p-4 font-medium text-right w-44">Số tiền thực nhận</th>
                      <th className="p-4 font-medium text-center w-40">Hình thức</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {paymentRecords.length > 0 ? (
                      paymentRecords.map((rec, index) => {
                        const hasExamPaid = rec.paymentStatus === 'paid';
                        const hasPrescriptionPaid = rec.prescriptionStatus === 'paid';
                        
                        // Tính toán tổng tiền thực thu của ca khám này
                        let detailText = [];
                        let totalReceived = 0;
                        if (hasExamPaid) {
                          detailText.push(`Phí khám lâm sàng (${rec.dept})`);
                          totalReceived += rec.initialFee || 150000;
                        }
                        if (hasPrescriptionPaid && rec.prescription && rec.prescription.length > 0) {
                          detailText.push("Đơn thuốc điều trị");
                          // Tính tiền đơn thuốc gốc & giảm giá
                          const originalCost = rec.prescription.reduce((sum, item) => sum + (item.price * item.qty), 0);
                          const discount = rec.bhyt ? Math.floor(originalCost * 0.8) : 0;
                          const finalCost = originalCost - discount;
                          totalReceived += finalCost;
                        }

                        return (
                          <tr key={rec._id} className="hover:bg-green-50/10 transition-colors">
                            <td className="p-4 font-bold text-gray-700 text-center">{index + 1}</td>
                            <td className="p-4 text-xs font-semibold text-gray-500">
                              {new Date(rec.updatedAt || rec.createdAt).toLocaleString('vi-VN')}
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-gray-900">{rec.name}</div>
                              <div className="text-[10px] font-bold text-gray-500 font-mono tracking-wider">{rec.phone}</div>
                            </td>
                            <td className="p-4">
                              <div className="text-gray-700 font-medium text-xs space-y-1">
                                {detailText.map((t, idx) => (
                                  <div key={idx} className="flex items-center gap-1">
                                    <span className="text-emerald-500 font-black">✓</span> {t}
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="p-4 text-right font-mono font-bold text-emerald-600 text-base">
                              +{totalReceived.toLocaleString('vi-VN')} đ
                            </td>
                            <td className="p-4 text-center">
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                {rec.paymentMethod || rec.prescriptionPaymentMethod || 'Chuyển khoản'}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-gray-400 italic">
                          Chưa ghi nhận giao dịch thanh toán thành công nào.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                <span>Tổng số giao dịch: <strong className="text-gray-800">{paymentRecords.length} giao dịch thành công</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: FEES */}
        {activeTab === 'fees' && (
          <div className="space-y-8 animate-fadeIn">
            <form onSubmit={handleSaveDeptFees} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#004e92]" /> Điều chỉnh lệ phí khám của các chuyên khoa & gói dịch vụ
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Nhập số tiền tương ứng cho mỗi gói khám lâm sàng hoặc khoa khám bệnh. Giá tiền này sẽ tự động áp dụng khi lập phiếu tiếp nhận và in hóa đơn tại Quầy thu ngân.
                </p>
              </div>

              {/* Nhóm 1: Gói khám sức khỏe tổng quát */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-800 bg-blue-50 px-4 py-2 rounded-xl flex items-center gap-2">
                  <span>📋</span> Gói khám sức khỏe tổng quát & Tầm soát bệnh lý
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: 'goi_kham_co_ban', label: 'Gói khám sức khỏe tổng quát Cơ Bản' },
                    { key: 'goi_kham_nang_cao', label: 'Gói khám sức khỏe tổng quát Nâng Cao' },
                    { key: 'goi_kham_chuyen_sau', label: 'Gói khám sức khỏe tổng quát Chuyên Sâu' },
                    { key: 'goi_kham_vip_gold', label: 'Gói khám sức khỏe tổng quát VIP Gold' },
                    { key: 'goi_kham_vip_platinum', label: 'Gói khám sức khỏe tổng quát VIP Platinum' },
                    { key: 'goi_kham_tam_soat_ung_thu_tong_quat', label: 'Gói khám tầm soát ung thư tổng quát' },
                    { key: 'goi_kham_tam_soat_ung_thu_tieu_hoa', label: 'Gói khám tầm soát ung thư tiêu hóa' },
                    { key: 'goi_kham_tam_soat_dot_quy', label: 'Gói khám tầm soát đột quỵ' }
                  ].map((field) => (
                    <div key={field.key} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50 pb-3">
                      <span className="text-xs font-bold text-gray-700 md:w-3/5">{field.label}</span>
                      <div className="relative md:w-2/5">
                        <input
                          type="number"
                          required
                          min="0"
                          value={deptFees[field.key] || ''}
                          onChange={(e) => setDeptFees(prev => ({ ...prev, [field.key]: Number(e.target.value) }))}
                          className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92] font-bold text-right font-mono text-[#004e92]"
                        />
                        <span className="absolute right-3 top-3 text-xs text-gray-400 font-bold">đ</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nhóm 2: Khoa chuyên môn khám lâm sàng */}
              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-bold text-gray-800 bg-emerald-50 px-4 py-2 rounded-xl flex items-center gap-2">
                  <span>🩺</span> Các khoa khám bệnh lâm sàng chuyên khoa
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: 'chan_doan_hinh_anh', label: 'Chẩn đoán hình ảnh (Xquang, CT, Mri, Đo loãng xương)' },
                    { key: 'noi_tong_quat', label: 'Nội tổng quát' },
                    { key: 'tai_mui_hong', label: 'Tai mũi họng' },
                    { key: 'mat', label: 'Mắt' },
                    { key: 'rang_ham_mat', label: 'Răng hàm mặt' },
                    { key: 'tim_mach', label: 'Tim mạch' },
                    { key: 'san_phu_khoa', label: 'Sản phụ khoa' },
                    { key: 'tuyen_vu', label: 'Tuyến vú' },
                    { key: 'ho_hap', label: 'Hô hấp' },
                    { key: 'di_ung_mien_dich', label: 'Dị ứng miễn dịch' },
                    { key: 'tu_van_giac_ngu', label: 'Tư vấn giấc ngủ' }
                  ].map((field) => (
                    <div key={field.key} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50 pb-3">
                      <span className="text-xs font-bold text-gray-700 md:w-3/5">{field.label}</span>
                      <div className="relative md:w-2/5">
                        <input
                          type="number"
                          required
                          min="0"
                          value={deptFees[field.key] || ''}
                          onChange={(e) => setDeptFees(prev => ({ ...prev, [field.key]: Number(e.target.value) }))}
                          className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92] font-bold text-right font-mono text-emerald-700"
                        />
                        <span className="absolute right-3 top-3 text-xs text-gray-400 font-bold">đ</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t">
                <button
                  type="submit"
                  className="bg-[#004e92] hover:bg-blue-800 text-white font-bold py-3.5 px-10 rounded-2xl transition-colors shadow-lg flex items-center gap-2 text-sm"
                >
                  <Save className="w-4 h-4" /> Lưu lệ phí khám chuyên khoa
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
