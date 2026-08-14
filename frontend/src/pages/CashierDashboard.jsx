import { useState, useEffect, useCallback } from 'react';
import { 
  DollarSign, Search, User, Calendar, Phone, Activity, Pill, 
  Printer, CheckCircle, AlertCircle, RefreshCw, CreditCard, 
  ArrowRight, Users, PlusCircle, Check, X, Tag
} from 'lucide-react';
import departments from '../data/departments';

const API_BASE_URL = 'http://localhost:5000';

// Mock danh sách hóa đơn thuốc dựa trên dữ liệu bệnh án
const initialPrescriptionBills = [
  {
    id: 'HDT-00432904',
    patientName: 'Nguyễn Văn A',
    patientCode: '0029187302',
    phone: '0901234567',
    bhyt: 'DN4797931234567',
    status: 'unpaid', // unpaid | paid
    items: [
      { name: 'Cetirizine 10mg (Cetimed 10mg)', qty: 20, unit: 'Viên', price: 4500 },
      { name: 'Hightamine 5.0mg (Vitamin)', qty: 40, unit: 'Viên', price: 2000 },
      { name: 'Kẽm gluconat 10ml (Conipa)', qty: 20, unit: 'Ống', price: 8000 },
      { name: 'Locgoda 0.1% 15g (Mometason)', qty: 2, unit: 'Tuýp', price: 45000 }
    ]
  },
  {
    id: 'HDT-00432888',
    patientName: 'Trần Thị B',
    patientCode: '0029187999',
    phone: '0988777123',
    bhyt: 'HT3797939876543',
    status: 'unpaid',
    items: [
      { name: 'Amlodipine 5mg (Amlor 5mg)', qty: 30, unit: 'Viên', price: 12000 },
      { name: 'Magnesium B6 (Magnerot 500mg)', qty: 60, unit: 'Viên', price: 3000 }
    ]
  },
  {
    id: 'HDT-00432777',
    patientName: 'Lê Hoàng C',
    patientCode: '0029187777',
    phone: '0912345678',
    bhyt: '',
    status: 'paid',
    paymentMethod: 'Chuyển khoản',
    items: [
      { name: 'Ibuprofen 400mg', qty: 15, unit: 'Viên', price: 3500 },
      { name: 'Amoxicillin 500mg (Curam 500mg)', qty: 20, unit: 'Viên', price: 12000 }
    ]
  }
];

const getCurrentTimeStr = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const CashierDashboard = () => {
  const [activeTab, setActiveTab] = useState('register'); // register | reception | prescription
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Tiền mặt');
  const [prescriptionBills, setPrescriptionBills] = useState(initialPrescriptionBills);
  const [rxSearchQuery, setRxSearchQuery] = useState('');
  const [notification, setNotification] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  
  // DOB Select States
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');

  // Walk-in Register Form State
  const [registerForm, setRegisterForm] = useState({
    name: '',
    phone: '',
    dob: '',
    gender: 'Nam',
    dept: '',
    doctor: 'Hệ thống tự phân công',
    date: new Date().toLocaleDateString('sv-SE'),
    time: getCurrentTimeStr(),
    reason: 'Đến khám trực tiếp tại quầy',
    autoPay: true
  });

  // Fetch appointments for reception view
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error("Lỗi khi tải lịch hẹn:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Đóng phí khám ban đầu
  const handlePayExamFee = async (appId, explicitPaymentMethod = null) => {
    const chosenMethod = explicitPaymentMethod || paymentMethod;
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/appointments/${appId}/pay-exam`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentMethod: chosenMethod })
      });

      const data = await response.json();
      if (response.ok) {
        setNotification(`✅ Thu phí khám thành công cho bệnh nhân: ${data.appointment.name}!`);
        fetchAppointments();
        setReceiptData({
          type: 'exam',
          patientName: data.appointment.name,
          phone: data.appointment.phone,
          dob: data.appointment.dob,
          gender: data.appointment.gender,
          dept: data.appointment.dept,
          doctor: data.appointment.doctor || 'Hệ thống tự phân công',
          date: data.appointment.date,
          time: data.appointment.time,
          fee: data.appointment.initialFee,
          paymentMethod: data.appointment.paymentMethod,
          queueNumber: data.appointment.queueNumber,
          code: data.appointment.appointmentCode
        });
        setShowReceiptModal(true);
        setTimeout(() => setNotification(''), 5000);
        return data.appointment;
      } else {
        alert(data.message || "Lỗi khi đóng phí khám.");
      }
    } catch (error) {
      console.error("Lỗi khi thu phí khám:", error);
    }
  };

  // Đóng phí đơn thuốc
  const handlePayPrescription = (billId, method) => {
    const updatedBills = prescriptionBills.map(bill => {
      if (bill.id === billId) {
        setNotification(`✅ Thu phí đơn thuốc thành công cho: ${bill.patientName}!`);
        
        const totalCost = bill.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const hasBHYT = !!bill.bhyt;
        const discount = hasBHYT ? totalCost * 0.8 : 0;
        const finalCost = totalCost - discount;

        setReceiptData({
          type: 'prescription',
          id: bill.id,
          patientName: bill.patientName,
          patientCode: bill.patientCode,
          phone: bill.phone,
          bhyt: bill.bhyt,
          items: bill.items,
          totalCost,
          discount,
          finalCost,
          paymentMethod: method
        });
        setShowReceiptModal(true);
        setTimeout(() => setNotification(''), 5000);
        return {
          ...bill,
          status: 'paid',
          paymentMethod: method
        };
      }
      return bill;
    });

    setPrescriptionBills(updatedBills);
  };

  // Thêm bệnh nhân vãng lai (Walk-in)
  const handleWalkInRegister = async (e) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.phone || !registerForm.dept) {
      alert("Vui lòng điền đầy đủ Họ tên, Số điện thoại và chọn Chuyên khoa.");
      return;
    }

    let dobValue = undefined;
    if (dobDay && dobMonth && dobYear) {
      const formattedMonth = dobMonth.padStart(2, '0');
      const formattedDay = dobDay.padStart(2, '0');
      dobValue = `${dobYear}-${formattedMonth}-${formattedDay}`;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: registerForm.name,
          phone: registerForm.phone,
          dob: dobValue,
          gender: registerForm.gender,
          dept: registerForm.dept,
          doctor: registerForm.doctor,
          date: registerForm.date,
          time: registerForm.time,
          reason: registerForm.reason
        })
      });

      const data = await response.json();
      if (response.ok) {
        const newApp = data.appointment;
        
        // Reset form
        setRegisterForm({
          name: '',
          phone: '',
          dob: '',
          gender: 'Nam',
          dept: '',
          doctor: 'Hệ thống tự phân công',
          date: new Date().toLocaleDateString('sv-SE'),
          time: getCurrentTimeStr(),
          reason: 'Đến khám trực tiếp tại quầy',
          autoPay: true
        });
        setDobDay('');
        setDobMonth('');
        setDobYear('');

        // Nếu có tích chọn thanh toán luôn
        if (registerForm.autoPay) {
          await handlePayExamFee(newApp._id, paymentMethod);
        } else {
          setNotification(`✅ Đã tiếp nhận bệnh nhân vãng lai: ${newApp.name}. Vui lòng thu tiền khám ở danh sách hàng chờ.`);
          fetchAppointments();
          setTimeout(() => setNotification(''), 5000);
        }
        
        // Chuyển về tab Lịch tiếp nhận
        setActiveTab('reception');
      } else {
        alert(data.message || "Không thể tiếp nhận bệnh nhân.");
      }
    } catch (error) {
      console.error("Lỗi đăng ký vãng lai:", error);
      alert("Lỗi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Lọc danh sách lịch hẹn cần thu tiền khám
  const unpaidAppointments = appointments.filter(app => {
    const isUnpaid = app.paymentStatus === 'unpaid' && app.status !== 'rejected';
    const matchesSearch = searchQuery === '' || 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.phone.includes(searchQuery) ||
      (app.appointmentCode && app.appointmentCode.toLowerCase().includes(searchQuery.toLowerCase()));
    return isUnpaid && matchesSearch;
  });

  // Lọc danh sách đơn thuốc cần thu tiền
  const unpaidPrescriptions = prescriptionBills.filter(bill => {
    const isUnpaid = bill.status === 'unpaid';
    const matchesSearch = rxSearchQuery === '' || 
      bill.patientName.toLowerCase().includes(rxSearchQuery.toLowerCase()) ||
      bill.phone.includes(rxSearchQuery) ||
      bill.id.toLowerCase().includes(rxSearchQuery.toLowerCase());
    return isUnpaid && matchesSearch;
  });

  // Thống kê doanh thu nhanh (chỉ tính các hóa đơn đã thu trong session hiện tại)
  const paidExams = appointments.filter(app => app.paymentStatus === 'paid');
  const paidPrescriptions = prescriptionBills.filter(bill => bill.status === 'paid');

  const totalExamRevenue = paidExams.reduce((sum, app) => sum + (app.initialFee || 150000), 0);
  const totalPrescriptionRevenue = paidPrescriptions.reduce((sum, bill) => {
    const cost = bill.items.reduce((s, item) => s + (item.price * item.qty), 0);
    const disc = bill.bhyt ? cost * 0.8 : 0;
    return sum + (cost - disc);
  }, 0);

  const totalRevenue = totalExamRevenue + totalPrescriptionRevenue;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5 print:hidden">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-[#004e92]" /> Quầy Thu ngân & Tiếp nhận
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Đăng ký bệnh nhân vãng lai trực tiếp, thu phí khám ban đầu, cấp số thứ tự khám và xử lý hóa đơn thuốc.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { fetchAppointments(); setNotification('🔄 Đã đồng bộ dữ liệu mới nhất.'); setTimeout(() => setNotification(''), 3000); }}
            className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl transition-colors shadow-sm"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* NOTIFICATION MESSAGE */}
      {notification && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl text-sm font-semibold flex items-center gap-3 shadow-sm print:hidden">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          {notification}
        </div>
      )}

      {/* QUICK STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 print:hidden">
        <div className="bg-gradient-to-br from-blue-500 to-[#004e92] text-white p-6 rounded-3xl shadow-md space-y-2">
          <div className="text-xs text-blue-100 font-bold uppercase tracking-wider">Tổng Doanh Thu Ca Trực</div>
          <div className="text-3xl font-black">{totalRevenue.toLocaleString('vi-VN')} đ</div>
          <div className="text-xs text-blue-100/80">Khám: {totalExamRevenue.toLocaleString('vi-VN')} đ | Thuốc: {totalPrescriptionRevenue.toLocaleString('vi-VN')} đ</div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-2">
          <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Đã Thu Phí Khám</div>
          <div className="text-3xl font-black text-gray-800">{paidExams.length} lượt</div>
          <div className="text-xs text-green-600 font-semibold">Tất cả bệnh nhân đã được cấp số</div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-2">
          <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Chờ Đóng Phí Khám</div>
          <div className="text-3xl font-black text-amber-600">{unpaidAppointments.length} ca chờ</div>
          <div className="text-xs text-gray-500">Đăng ký mới trực tiếp hoặc đặt online</div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-2">
          <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Đơn Thuốc Chờ Đóng Tiền</div>
          <div className="text-3xl font-black text-purple-600">{unpaidPrescriptions.length} đơn</div>
          <div className="text-xs text-gray-500">Hóa đơn thuốc do bác sĩ chỉ định</div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-gray-200 gap-6 print:hidden">
        <button
          onClick={() => setActiveTab('register')}
          className={`pb-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'register'
              ? 'border-[#004e92] text-[#004e92]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <PlusCircle className="w-4 h-4" /> 1. Tiếp Nhận Vãng Lai
        </button>
        <button
          onClick={() => setActiveTab('reception')}
          className={`pb-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'reception'
              ? 'border-[#004e92] text-[#004e92]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Users className="w-4 h-4" /> 2. Chờ Đóng Phí Khám ({unpaidAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab('prescription')}
          className={`pb-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'prescription'
              ? 'border-[#004e92] text-[#004e92]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Pill className="w-4 h-4" /> 3. Thu Tiền Đơn Thuốc ({unpaidPrescriptions.length})
        </button>
      </div>

      {/* TAB 1: CHỜ ĐÓNG PHÍ KHÁM */}
      {activeTab === 'reception' && (
        <div className="space-y-4 print:hidden">
          {/* SEARCH BAR */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[280px] max-w-md">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm bệnh nhân chờ đóng phí (Tên, SĐT, Mã LH...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors font-medium"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 font-bold">Hình thức thanh toán:</span>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white cursor-pointer font-bold focus:outline-none focus:border-[#004e92]"
              >
                <option value="Tiền mặt">💵 Tiền mặt</option>
                <option value="Chuyển khoản">💳 Chuyển khoản (QR)</option>
              </select>
            </div>
          </div>

          {/* QUEUE TABLE */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="p-5 font-medium w-16 text-center">STT</th>
                    <th className="p-5 font-medium">Bệnh nhân & Liên hệ</th>
                    <th className="p-5 font-medium">Khoa điều phối</th>
                    <th className="p-5 font-medium">Giờ đăng ký</th>
                    <th className="p-5 font-medium text-right">Phí khám ban đầu</th>
                    <th className="p-5 font-medium text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100 font-medium">
                  {unpaidAppointments.length > 0 ? (
                    unpaidAppointments.map((app, index) => (
                      <tr key={app._id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="p-5 text-center text-gray-400 font-bold">{index + 1}</td>
                        <td className="p-5">
                          <span className="font-bold text-gray-900 text-base block">{app.name}</span>
                          <span className="text-xs text-gray-500 block mt-0.5">SĐT: {app.phone} {app.dob ? `| Năm sinh: ${new Date(app.dob).getFullYear()}` : ''}</span>
                        </td>
                        <td className="p-5">
                          <span className="bg-blue-50 text-[#004e92] text-xs font-bold px-2.5 py-1 rounded-full border border-blue-100">
                            {app.dept}
                          </span>
                          <span className="text-xs text-gray-400 block mt-1">BS: {app.doctor || 'Hệ thống tự phân công'}</span>
                        </td>
                        <td className="p-5">
                          <span className="font-bold text-gray-700">{app.time}</span>
                          <span className="text-xs text-gray-400 block mt-0.5">{new Date(app.date).toLocaleDateString('vi-VN')}</span>
                        </td>
                        <td className="p-5 text-right font-black text-[#004e92]">
                          {(app.initialFee || 150000).toLocaleString('vi-VN')} đ
                        </td>
                        <td className="p-5 text-center">
                          <button
                            onClick={() => handlePayExamFee(app._id)}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-md text-xs inline-flex items-center gap-1.5 transform hover:scale-105"
                          >
                            <Check className="w-4 h-4" /> Thu tiền & Cấp số
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-12 text-center text-gray-400">
                        Không có bệnh nhân nào trong hàng chờ đóng phí khám.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TIẾP NHẬN BỆNH NHÂN VÃNG LAI */}
      {activeTab === 'register' && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-4xl mx-auto print:hidden">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#004e92]" /> Form Tiếp nhận & Thu tiền Bệnh nhân Vãng lai
          </h3>
          
          <form onSubmit={handleWalkInRegister} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Họ và tên bệnh nhân *</label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92] font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Số điện thoại liên lạc *</label>
                <input
                  type="tel"
                  required
                  placeholder="09XXXXXXXX"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92] font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Ngày sinh</label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-[#004e92] font-semibold bg-white cursor-pointer"
                    value={dobDay}
                    onChange={(e) => setDobDay(e.target.value)}
                  >
                    <option value="">Ngày</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={String(d)}>Ngày {d}</option>
                    ))}
                  </select>
                  <select
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-[#004e92] font-semibold bg-white cursor-pointer"
                    value={dobMonth}
                    onChange={(e) => setDobMonth(e.target.value)}
                  >
                    <option value="">Tháng</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={String(m)}>Tháng {m}</option>
                    ))}
                  </select>
                  <select
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-[#004e92] font-semibold bg-white cursor-pointer"
                    value={dobYear}
                    onChange={(e) => setDobYear(e.target.value)}
                  >
                    <option value="">Năm</option>
                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                      <option key={y} value={String(y)}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Giới tính</label>
                <select
                  value={registerForm.gender}
                  onChange={(e) => setRegisterForm({ ...registerForm, gender: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92] cursor-pointer"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Chuyên khoa / Dịch vụ đăng ký khám *</label>
                <select
                  required
                  value={registerForm.dept}
                  onChange={(e) => setRegisterForm({ ...registerForm, dept: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92] cursor-pointer font-bold"
                >
                  <option value="">-- Chọn chuyên khoa --</option>
                  {departments.map((dept) => (
                    <option key={dept.slug} value={dept.name}>
                      {dept.icon} {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Giờ tiếp nhận khám</label>
                <input
                  type="time"
                  required
                  value={registerForm.time}
                  onChange={(e) => setRegisterForm({ ...registerForm, time: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92] font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Hình thức thanh toán viện phí</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92] cursor-pointer font-semibold"
                >
                  <option value="Tiền mặt">💵 Tiền mặt</option>
                  <option value="Chuyển khoản">💳 Chuyển khoản (Momo/VNPAY/Ngân hàng)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Ghi chú triệu chứng / Lý do khám</label>
                <textarea
                  rows="2"
                  value={registerForm.reason}
                  onChange={(e) => setRegisterForm({ ...registerForm, reason: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92]"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <input
                type="checkbox"
                id="autoPay"
                checked={registerForm.autoPay}
                onChange={(e) => setRegisterForm({ ...registerForm, autoPay: e.target.checked })}
                className="w-4 h-4 text-[#004e92] focus:ring-[#004e92] border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="autoPay" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
                Thanh toán phí khám và in hóa đơn/phiếu số khám ngay lập tức
              </label>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
              <button
                type="button"
                onClick={() => setActiveTab('reception')}
                className="bg-white hover:bg-gray-50 text-gray-700 font-bold px-6 py-3 rounded-xl border border-gray-200 transition-colors text-sm"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#004e92] hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-lg text-sm flex items-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                Đăng ký & Khởi tạo hóa đơn
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: THU TIỀN ĐƠN THUỐC */}
      {activeTab === 'prescription' && (
        <div className="space-y-4 print:hidden">
          {/* SEARCH BAR */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[280px] max-w-md">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm đơn thuốc chờ thu tiền (Tên, SĐT, Mã đơn...)"
                value={rxSearchQuery}
                onChange={(e) => setRxSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors font-medium"
              />
            </div>
          </div>

          {/* PRESCRIPTION TABLE */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="p-5 font-medium">Mã Đơn & Bệnh nhân</th>
                    <th className="p-5 font-medium">Đối tượng</th>
                    <th className="p-5 font-medium">Chi tiết thuốc kê đơn</th>
                    <th className="p-5 font-medium text-right">Tổng chi phí</th>
                    <th className="p-5 font-medium text-center">Thao tác thu tiền</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100 font-medium">
                  {unpaidPrescriptions.length > 0 ? (
                    unpaidPrescriptions.map((bill) => {
                      const totalCost = bill.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
                      const hasBHYT = !!bill.bhyt;
                      const discount = hasBHYT ? totalCost * 0.8 : 0;
                      const finalCost = totalCost - discount;

                      return (
                        <tr key={bill.id} className="hover:bg-blue-50/20 transition-colors">
                          <td className="p-5">
                            <span className="font-bold text-[#004e92] text-xs mb-1 bg-purple-50 px-2 py-0.5 rounded w-max border border-purple-100 block">
                              {bill.id}
                            </span>
                            <span className="font-bold text-gray-900 text-base block">{bill.patientName}</span>
                            <span className="text-xs text-gray-500 block mt-0.5">SĐT: {bill.phone}</span>
                          </td>
                          <td className="p-5">
                            {hasBHYT ? (
                              <div>
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full border border-green-200">
                                  BHYT chi trả 80%
                                </span>
                                <span className="text-xs text-gray-400 block mt-1.5 font-mono">{bill.bhyt}</span>
                              </div>
                            ) : (
                              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                                Khám dịch vụ
                              </span>
                            )}
                          </td>
                          <td className="p-5 max-w-sm">
                            <div className="text-xs text-gray-600 space-y-1">
                              {bill.items.map((item, i) => (
                                <div key={i} className="flex justify-between">
                                  <span>{item.name} (x{item.qty})</span>
                                  <span className="font-mono text-gray-400">{(item.price * item.qty).toLocaleString('vi-VN')}đ</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-5 text-right font-black text-gray-900">
                            {hasBHYT && (
                              <div className="text-xs text-red-500 font-normal line-through mb-1">
                                {totalCost.toLocaleString('vi-VN')} đ
                              </div>
                            )}
                            <div className="text-base text-emerald-600">
                              {finalCost.toLocaleString('vi-VN')} đ
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="flex flex-col gap-2 justify-center items-center">
                              <button
                                onClick={() => handlePayPrescription(bill.id, 'Tiền mặt')}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl transition-all text-xs flex items-center justify-center gap-1"
                              >
                                💵 Tiền mặt
                              </button>
                              <button
                                onClick={() => handlePayPrescription(bill.id, 'Chuyển khoản')}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl transition-all text-xs flex items-center justify-center gap-1"
                              >
                                💳 Chuyển khoản
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-12 text-center text-gray-400">
                        Không tìm thấy đơn thuốc nào chờ thu tiền phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: IN BIÊN LAI / HÓA ĐƠN KÈM PHIẾU XẾP HÀNG */}
      {showReceiptModal && receiptData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn print:absolute print:inset-0 print:bg-white print:p-0">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 relative border border-gray-100 print:shadow-none print:border-none print:p-0">
            <button 
              onClick={() => setShowReceiptModal(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 p-2 rounded-full transition-colors print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Content for Printing */}
            <div id="receipt-print-area" className="space-y-6">
              {/* Receipt Header */}
              <div className="text-center pb-4 border-b border-dashed border-gray-200">
                <h2 className="font-extrabold text-xl text-gray-900 uppercase tracking-wide">Bệnh Viện Nhân Dân</h2>
                <p className="text-xs text-gray-500 mt-1">Đ/c: Số 1 Nơ Trang Long, P. Gia Định, TP.HCM</p>
                <p className="text-xs text-gray-500">Hotline: 1900 2115</p>
                <div className="mt-3 inline-block bg-gray-100 text-gray-800 text-[10px] font-bold px-2 py-1 rounded font-mono">
                  MÃ HĐ: {receiptData.code || receiptData.id || 'HD-' + Math.floor(Math.random()*900000 + 100000)}
                </div>
              </div>

              {/* Receipt Info */}
              <div className="space-y-1.5 text-sm text-gray-600 font-semibold">
                {receiptData.code && (
                  <div className="flex justify-between">
                    <span>Mã Bệnh nhân (ID):</span>
                    <span className="text-gray-900 font-mono font-bold text-base bg-gray-50 px-2 py-0.5 rounded border border-gray-200">{receiptData.code}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Bệnh nhân:</span>
                  <span className="text-gray-900 font-bold">{receiptData.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Số điện thoại:</span>
                  <span className="text-gray-900">{receiptData.phone}</span>
                </div>
                {receiptData.dob && (
                  <div className="flex justify-between">
                    <span>Năm sinh:</span>
                    <span className="text-gray-900">{new Date(receiptData.dob).getFullYear()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Hình thức thanh toán:</span>
                  <span className="text-gray-900">{receiptData.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Trạng thái:</span>
                  <span className="text-emerald-600 font-extrabold flex items-center gap-1">ĐÃ THANH TOÁN (ĐỦ ĐIỀU KIỆN KHÁM)</span>
                </div>
              </div>

              {/* Receipt Specific Body */}
              {receiptData.type === 'exam' ? (
                // Lịch khám
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-4">
                  <div className="text-center space-y-1">
                    <span className="text-xs text-[#004e92] font-bold uppercase tracking-wider block">Số Thứ Tự Khám</span>
                    <span className="text-5xl font-black text-[#004e92] block font-mono">
                      {receiptData.queueNumber && receiptData.queueNumber < 10 ? '0' : ''}{receiptData.queueNumber || '01'}
                    </span>
                  </div>
                  <div className="text-xs space-y-1 text-gray-600 border-t border-blue-100 pt-3">
                    <div className="flex justify-between">
                      <span>Phòng khám:</span>
                      <strong className="text-gray-900">{receiptData.dept}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Bác sĩ khám:</span>
                      <strong className="text-gray-900">{receiptData.doctor}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Thời gian:</span>
                      <strong className="text-gray-900">{receiptData.time} - {new Date(receiptData.date).toLocaleDateString('vi-VN')}</strong>
                    </div>
                  </div>
                </div>
              ) : (
                // Đơn thuốc
                <div className="space-y-3">
                  <div className="text-xs font-bold text-gray-700 uppercase pb-1 border-b border-gray-100">Chi tiết thuốc mua</div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {receiptData.items && receiptData.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-xs text-gray-600">
                        <span>{item.name} (x{item.qty} {item.unit})</span>
                        <span className="font-mono text-gray-900 font-semibold">{(item.price * item.qty).toLocaleString('vi-VN')} đ</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Financial Calculation */}
              <div className="border-t border-dashed border-gray-200 pt-4 space-y-2 font-bold text-sm">
                {receiptData.type === 'prescription' ? (
                  <>
                    <div className="flex justify-between text-gray-500 text-xs">
                      <span>Tiền thuốc gốc:</span>
                      <span className="font-mono">{receiptData.totalCost.toLocaleString('vi-VN')} đ</span>
                    </div>
                    {receiptData.discount > 0 && (
                      <div className="flex justify-between text-green-600 text-xs">
                        <span>BHYT giảm giá (80%):</span>
                        <span className="font-mono">-{receiptData.discount.toLocaleString('vi-VN')} đ</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-900 text-base font-black border-t border-gray-100 pt-2">
                      <span>Tổng tiền thực thu:</span>
                      <span className="text-emerald-600 font-mono">{(receiptData.finalCost).toLocaleString('vi-VN')} đ</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-gray-900 text-base font-black">
                    <span>Lệ phí khám lâm sàng:</span>
                    <span className="text-[#004e92] font-mono">{(receiptData.fee || 150000).toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="text-center pt-3 border-t border-gray-100 text-xs text-gray-400 italic">
                Cảm ơn bạn đã lựa chọn Bệnh Viện Nhân Dân!<br />
                Chúc bạn luôn mạnh khỏe và an lành!
              </div>
            </div>

            {/* Print and Close Actions */}
            <div className="mt-6 flex gap-3 print:hidden">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-2xl transition-colors text-sm"
              >
                Đóng cửa sổ
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 bg-[#004e92] hover:bg-blue-800 text-white font-bold py-3 rounded-2xl transition-colors shadow-lg text-sm flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> In hóa đơn & Số thứ tự
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierDashboard;
