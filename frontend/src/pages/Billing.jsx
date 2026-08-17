import { useState, useEffect, useCallback } from 'react';
import { 
  DollarSign, Search, User, Calendar, Phone, Activity, Pill, 
  Printer, CheckCircle, AlertCircle, RefreshCw, CreditCard, 
  ArrowRight, ShieldCheck, TrendingUp, Users, Check
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

// Mock danh sách hóa đơn thuốc dựa trên dữ liệu bệnh án trong Patients.jsx
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

const Billing = () => {
  const [activeTab, setActiveTab] = useState('reception'); // reception | prescription | stats
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Tiền mặt');
  const [prescriptionBills, setPrescriptionBills] = useState(initialPrescriptionBills);
  const [rxSearchQuery, setRxSearchQuery] = useState('');
  const [selectedRxBill, setSelectedRxBill] = useState(null);
  const [rxPaymentMethod, setRxPaymentMethod] = useState('Tiền mặt');
  const [notification, setNotification] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // Fetch appointments for reception view
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Lọc các lịch hẹn chờ khám hoặc đã phê duyệt hôm nay / tương lai
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
  const handlePayExamFee = async (appId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/appointments/${appId}/pay-exam`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentMethod })
      });

      const data = await response.json();
      if (response.ok) {
        setNotification(`✅ Thu phí thành công lịch khám bệnh nhân: ${data.appointment.name}!`);
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
        setSelectedApp(null);
        setShowReceiptModal(true);
        setTimeout(() => setNotification(''), 5000);
      } else {
        alert(data.message || "Lỗi khi đóng phí khám.");
      }
    } catch (error) {
      console.error("Lỗi khi thu phí khám:", error);
    }
  };

  // Đóng phí đơn thuốc
  const handlePayPrescription = (billId) => {
    const updatedBills = prescriptionBills.map(bill => {
      if (bill.id === billId) {
        setNotification(`✅ Thu phí thành công đơn thuốc bệnh nhân: ${bill.patientName}!`);
        
        // Tính tổng tiền
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
          paymentMethod: rxPaymentMethod
        });

        setTimeout(() => setNotification(''), 5000);
        return {
          ...bill,
          status: 'paid',
          paymentMethod: rxPaymentMethod
        };
      }
      return bill;
    });

    setPrescriptionBills(updatedBills);
    setSelectedRxBill(null);
    setShowReceiptModal(true);
  };

  const handlePrint = () => {
    window.print();
  };

  // Lọc lịch hẹn
  const filteredAppointments = appointments.filter(app => {
    const searchLower = searchQuery.toLowerCase();
    return (
      app.name.toLowerCase().includes(searchLower) ||
      app.phone.includes(searchLower) ||
      app.appointmentCode.toLowerCase().includes(searchLower)
    );
  });

  // Lọc hóa đơn đơn thuốc
  const filteredRxBills = prescriptionBills.filter(bill => {
    const searchLower = rxSearchQuery.toLowerCase();
    return (
      bill.patientName.toLowerCase().includes(searchLower) ||
      bill.phone.includes(searchLower) ||
      bill.id.toLowerCase().includes(searchLower)
    );
  });

  // Số liệu thống kê thu ngân
  const paidExamsCount = appointments.filter(a => a.paymentStatus === 'paid').length;
  const examRevenue = appointments
    .filter(a => a.paymentStatus === 'paid')
    .reduce((sum, a) => sum + (a.initialFee || 150000), 0);

  const paidRxCount = prescriptionBills.filter(b => b.status === 'paid').length;
  const rxRevenue = prescriptionBills
    .filter(b => b.status === 'paid')
    .reduce((sum, bill) => {
      const billTotal = bill.items.reduce((s, item) => s + (item.price * item.qty), 0);
      const discount = bill.bhyt ? billTotal * 0.8 : 0;
      return sum + (billTotal - discount);
    }, 0);

  const cashRevenue = 
    appointments.filter(a => a.paymentStatus === 'paid' && a.paymentMethod === 'Tiền mặt').length * 150000 +
    prescriptionBills.filter(b => b.status === 'paid' && b.paymentMethod === 'Tiền mặt')
      .reduce((sum, bill) => {
        const billTotal = bill.items.reduce((s, item) => s + (item.price * item.qty), 0);
        const discount = bill.bhyt ? billTotal * 0.8 : 0;
        return sum + (billTotal - discount);
      }, 0);

  const transferRevenue = (examRevenue + rxRevenue) - cashRevenue;

  return (
    <div className="p-8 space-y-8 font-sans bg-gray-50/50 min-h-screen print:p-0 print:bg-white">
      
      {/* HEADER BAR (Ẩn khi in phiếu thu) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-6 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-wide flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-[#004e92]" /> Quầy Thu ngân & Tiếp nhận Bệnh nhân
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Quản lý thu phí khám ban đầu, thanh toán hóa đơn đơn thuốc và cấp số khám bệnh điện tử.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchAppointments}
            className="p-3 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors border border-gray-200"
            title="Làm mới dữ liệu"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* NOTIFICATION MESSAGE */}
      {notification && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl text-sm font-semibold flex items-center gap-3 shadow-sm animate-fadeIn print:hidden">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          {notification}
        </div>
      )}

      {/* TABS LỰA CHỌN (Ẩn khi in) */}
      <div className="flex border-b border-gray-200/80 print:hidden">
        <button
          onClick={() => setActiveTab('reception')}
          className={`pb-4 px-6 font-bold text-sm transition-all border-b-2 ${
            activeTab === 'reception'
              ? 'border-[#004e92] text-[#004e92]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          🎟️ Tiếp nhận & Phí khám
        </button>
        <button
          onClick={() => setActiveTab('prescription')}
          className={`pb-4 px-6 font-bold text-sm transition-all border-b-2 ${
            activeTab === 'prescription'
              ? 'border-[#004e92] text-[#004e92]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          💊 Thu phí đơn thuốc
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`pb-4 px-6 font-bold text-sm transition-all border-b-2 ${
            activeTab === 'stats'
              ? 'border-[#004e92] text-[#004e92]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          📊 Báo cáo doanh số ngày
        </button>
      </div>

      {/* TAB 1: TIẾP NHẬN & THU PHÍ KHÁM */}
      {activeTab === 'reception' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden">
          {/* Cột trái: Tìm kiếm & danh sách bệnh nhân đặt lịch */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm theo Mã đặt lịch (BVxxxxxx), Tên hoặc SĐT bệnh nhân..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#004e92] focus:bg-white text-sm transition-all font-medium"
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-bold border-b border-gray-100">
                      <th className="p-5">Mã số</th>
                      <th className="p-5">Họ tên bệnh nhân</th>
                      <th className="p-5">Chuyên khoa & Bác sĩ</th>
                      <th className="p-5 text-center">Thời gian</th>
                      <th className="p-5 text-center">Viện phí</th>
                      <th className="p-5 text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="p-10 text-center text-gray-500">Đang tải lịch hẹn...</td>
                      </tr>
                    ) : filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-10 text-center text-gray-400 font-medium">Không tìm thấy bệnh nhân nào chờ tiếp nhận.</td>
                      </tr>
                    ) : (
                      filteredAppointments.map((app) => (
                        <tr 
                          key={app._id} 
                          onClick={() => setSelectedApp(app)}
                          className={`hover:bg-blue-50/15 transition-colors cursor-pointer ${selectedApp?._id === app._id ? 'bg-blue-50/20 border-l-4 border-l-[#004e92]' : ''}`}
                        >
                          <td className="p-5 font-bold text-gray-900">{app.appointmentCode}</td>
                          <td className="p-5">
                            <div className="font-bold text-gray-900">{app.name}</div>
                            <div className="text-xs text-gray-500">{app.phone}</div>
                          </td>
                          <td className="p-5">
                            <div className="font-semibold text-gray-800">{app.dept}</div>
                            <div className="text-xs text-gray-500 italic">{app.doctor || 'Tự động phân công'}</div>
                          </td>
                          <td className="p-5 text-center">
                            <div className="font-medium text-gray-800">{new Date(app.date).toLocaleDateString('vi-VN')}</div>
                            <div className="text-xs text-gray-500">{app.time}</div>
                          </td>
                          <td className="p-5 text-center font-bold text-[#004e92]">
                            {(app.initialFee || 150000).toLocaleString('vi-VN')} đ
                          </td>
                          <td className="p-5 text-center">
                            {app.paymentStatus === 'paid' ? (
                              <span className="bg-green-50 text-green-700 border border-green-200 text-xs px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1">
                                <ShieldCheck size={12} /> Đã đóng (STT: {app.queueNumber})
                              </span>
                            ) : (
                              <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1">
                                <CreditCard size={12} /> Chưa đóng
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Cột phải: Form thu tiền trực quan */}
          <div className="space-y-6">
            {selectedApp ? (
              <div className="bg-white rounded-3xl shadow-lg border border-blue-100 overflow-hidden animate-fadeIn">
                <div className="bg-[#004e92] p-5 text-white">
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <User size={18} /> Hồ sơ tiếp nhận khám
                  </h3>
                  <p className="text-xs text-blue-100 mt-1">Hóa đơn: {selectedApp.appointmentCode}</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-3.5 text-sm">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-400">Bệnh nhân:</span>
                      <span className="font-bold text-gray-800">{selectedApp.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-400">Số điện thoại:</span>
                      <span className="font-semibold text-gray-800">{selectedApp.phone}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-400">Chuyên khoa:</span>
                      <span className="font-semibold text-gray-800">{selectedApp.dept}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-400">Bác sĩ:</span>
                      <span className="font-semibold text-gray-800">{selectedApp.doctor || 'Chờ phân công'}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-400">Lịch hẹn:</span>
                      <span className="font-semibold text-gray-800">{selectedApp.time} - {new Date(selectedApp.date).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-600 text-xs">MỨC PHÍ ĐĂNG KÝ:</span>
                      <span className="text-xl font-black text-[#004e92]">150,000 đ</span>
                    </div>
                    
                    {selectedApp.paymentStatus === 'paid' ? (
                      <div className="text-center pt-2">
                        <div className="bg-green-50 text-green-800 border border-green-200 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
                          <CheckCircle size={14} className="text-green-600" />
                          ĐÃ NỘP PHÍ KHÁM (STT: {selectedApp.queueNumber})
                        </div>
                        <button
                          onClick={() => {
                            setReceiptData({
                              type: 'exam',
                              patientName: selectedApp.name,
                              phone: selectedApp.phone,
                              dob: selectedApp.dob,
                              gender: selectedApp.gender,
                              dept: selectedApp.dept,
                              doctor: selectedApp.doctor || 'Hệ thống tự phân công',
                              date: selectedApp.date,
                              time: selectedApp.time,
                              fee: selectedApp.initialFee || 150000,
                              paymentMethod: selectedApp.paymentMethod || 'Tiền mặt',
                              queueNumber: selectedApp.queueNumber,
                              code: selectedApp.appointmentCode
                            });
                            setShowReceiptModal(true);
                          }}
                          className="mt-3 w-full py-2.5 border border-[#004e92] text-[#004e92] hover:bg-blue-50 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                        >
                          <Printer size={14} /> Xem & In lại Phiếu thu
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 pt-2">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Hình thức thanh toán:</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setPaymentMethod('Tiền mặt')}
                              className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                                paymentMethod === 'Tiền mặt'
                                  ? 'border-[#004e92] bg-blue-50 text-[#004e92]'
                                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              💵 Tiền mặt
                            </button>
                            <button
                              type="button"
                              onClick={() => setPaymentMethod('Chuyển khoản')}
                              className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                                paymentMethod === 'Chuyển khoản'
                                  ? 'border-[#004e92] bg-blue-50 text-[#004e92]'
                                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              🏦 Chuyển khoản
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => handlePayExamFee(selectedApp._id)}
                          className="w-full bg-[#004e92] hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm transform hover:-translate-y-0.5"
                        >
                          Thu tiền & Cấp số khám <ArrowRight size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-dashed border-gray-200 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-blue-50 text-[#004e92] flex items-center justify-center mx-auto shadow-inner">
                  <User size={24} />
                </div>
                <h4 className="font-bold text-gray-800 text-sm">Chi tiết thông tin thu tiền</h4>
                <p className="text-xs text-gray-400 max-w-[200px] mx-auto">Chọn một bệnh nhân trong danh sách để xử lý thanh toán và tiếp nhận.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: THANH TOÁN ĐƠN THUỐC */}
      {activeTab === 'prescription' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden">
          {/* Cột trái: Danh sách hóa đơn thuốc */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm theo Tên bệnh nhân, SĐT hoặc Mã hóa đơn..."
                  value={rxSearchQuery}
                  onChange={(e) => setRxSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#004e92] focus:bg-white text-sm transition-all font-medium"
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-bold border-b border-gray-100">
                      <th className="p-5">Mã đơn thuốc</th>
                      <th className="p-5">Họ tên bệnh nhân</th>
                      <th className="p-5">Số điện thoại</th>
                      <th className="p-5 text-center">BHYT</th>
                      <th className="p-5 text-right">Tổng tiền gốc</th>
                      <th className="p-5 text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {filteredRxBills.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-10 text-center text-gray-400 font-medium">Không tìm thấy đơn thuốc nào phù hợp.</td>
                      </tr>
                    ) : (
                      filteredRxBills.map((bill) => {
                        const totalCost = bill.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
                        return (
                          <tr 
                            key={bill.id} 
                            onClick={() => setSelectedRxBill(bill)}
                            className={`hover:bg-blue-50/15 transition-colors cursor-pointer ${selectedRxBill?.id === bill.id ? 'bg-blue-50/20 border-l-4 border-l-[#004e92]' : ''}`}
                          >
                            <td className="p-5 font-bold text-gray-900">{bill.id}</td>
                            <td className="p-5 font-bold text-gray-900">{bill.patientName}</td>
                            <td className="p-5 text-gray-600">{bill.phone}</td>
                            <td className="p-5 text-center">
                              {bill.bhyt ? (
                                <span className="bg-green-50 text-green-700 text-[10px] px-2 py-0.5 rounded-md font-bold border border-green-200">
                                  {bill.bhyt} (BHYT)
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs">-</span>
                              )}
                            </td>
                            <td className="p-5 text-right font-bold text-gray-950">
                              {totalCost.toLocaleString('vi-VN')} đ
                            </td>
                            <td className="p-5 text-center">
                              {bill.status === 'paid' ? (
                                <span className="bg-green-50 text-green-700 border border-green-200 text-xs px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1">
                                  <ShieldCheck size={12} /> Đã thu
                                </span>
                              ) : (
                                <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1">
                                  <CreditCard size={12} /> Chưa thanh toán
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Cột phải: Form thu tiền đơn thuốc */}
          <div className="space-y-6">
            {selectedRxBill ? (
              <div className="bg-white rounded-3xl shadow-lg border border-blue-100 overflow-hidden animate-fadeIn">
                <div className="bg-emerald-700 p-5 text-white">
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Pill size={18} /> Thanh toán Đơn thuốc
                  </h3>
                  <p className="text-xs text-emerald-100 mt-1">Mã hóa đơn: {selectedRxBill.id}</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Bảng chi tiết thuốc */}
                  <div className="space-y-3">
                    <h5 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Danh mục thuốc & biệt dược:</h5>
                    <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
                      {selectedRxBill.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start text-xs border-b border-gray-50 pb-2">
                          <div>
                            <p className="font-bold text-gray-800">{item.name}</p>
                            <p className="text-gray-400">SL: {item.qty} {item.unit} x {item.price.toLocaleString('vi-VN')}đ</p>
                          </div>
                          <span className="font-bold text-gray-900">{(item.price * item.qty).toLocaleString('vi-VN')}đ</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tính toán giảm trừ BHYT */}
                  <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100 space-y-2.5 text-sm">
                    {(() => {
                      const totalCost = selectedRxBill.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
                      const hasBHYT = !!selectedRxBill.bhyt;
                      const discount = hasBHYT ? totalCost * 0.8 : 0;
                      const finalCost = totalCost - discount;

                      return (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Tổng tiền thuốc gốc:</span>
                            <span className="font-bold text-gray-800">{totalCost.toLocaleString('vi-VN')} đ</span>
                          </div>
                          {hasBHYT && (
                            <div className="flex justify-between text-green-700">
                              <span>Khấu trừ BHYT (80%):</span>
                              <span className="font-bold">-{discount.toLocaleString('vi-VN')} đ</span>
                            </div>
                          )}
                          <div className="flex justify-between border-t border-gray-200/60 pt-2.5">
                            <span className="font-bold text-gray-800">Thực thu bệnh nhân:</span>
                            <span className="text-lg font-black text-[#004e92]">{finalCost.toLocaleString('vi-VN')} đ</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {selectedRxBill.status === 'paid' ? (
                    <div className="text-center space-y-2.5">
                      <div className="bg-green-50 text-green-800 border border-green-200 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
                        <CheckCircle size={14} className="text-green-600" />
                        ĐÃ NỘP TIỀN THUỐC
                      </div>
                      <button
                        onClick={() => {
                          const totalCost = selectedRxBill.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
                          const hasBHYT = !!selectedRxBill.bhyt;
                          const discount = hasBHYT ? totalCost * 0.8 : 0;
                          const finalCost = totalCost - discount;

                          setReceiptData({
                            type: 'prescription',
                            id: selectedRxBill.id,
                            patientName: selectedRxBill.patientName,
                            patientCode: selectedRxBill.patientCode,
                            phone: selectedRxBill.phone,
                            bhyt: selectedRxBill.bhyt,
                            items: selectedRxBill.items,
                            totalCost,
                            discount,
                            finalCost,
                            paymentMethod: selectedRxBill.paymentMethod || 'Tiền mặt'
                          });
                          setShowReceiptModal(true);
                        }}
                        className="w-full py-2.5 border border-[#004e92] text-[#004e92] hover:bg-blue-50 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                      >
                        <Printer size={14} /> Xem & In lại Hóa đơn thuốc
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Hình thức thanh toán:</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setRxPaymentMethod('Tiền mặt')}
                            className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                              rxPaymentMethod === 'Tiền mặt'
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            💵 Tiền mặt
                          </button>
                          <button
                            type="button"
                            onClick={() => setRxPaymentMethod('Chuyển khoản')}
                            className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                              rxPaymentMethod === 'Chuyển khoản'
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            🏦 Chuyển khoản
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePayPrescription(selectedRxBill.id)}
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm transform hover:-translate-y-0.5"
                      >
                        Xác nhận đóng tiền thuốc <Check size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-dashed border-gray-200 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                  <Pill size={24} />
                </div>
                <h4 className="font-bold text-gray-800 text-sm">Chi tiết hóa đơn đơn thuốc</h4>
                <p className="text-xs text-gray-400 max-w-[200px] mx-auto">Chọn một đơn thuốc trong danh sách để xem chi tiết tiền thuốc, mức giảm trừ BHYT và thu phí.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: BÁO CÁO DOANH THU */}
      {activeTab === 'stats' && (
        <div className="space-y-6 print:hidden animate-fadeIn">
          {/* Hàng 4 Card báo cáo nhanh */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#004e92] flex items-center justify-center flex-shrink-0">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tổng doanh thu hôm nay</p>
                <h3 className="text-xl font-black text-gray-900 mt-0.5">{(examRevenue + rxRevenue).toLocaleString('vi-VN')} đ</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Users size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lịch hẹn đã tiếp nhận</p>
                <h3 className="text-xl font-black text-gray-900 mt-0.5">{paidExamsCount} bệnh nhân</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Doanh thu thu phí khám</p>
                <h3 className="text-xl font-black text-gray-900 mt-0.5">{examRevenue.toLocaleString('vi-VN')} đ</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                <Pill size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Doanh thu đơn thuốc</p>
                <h3 className="text-xl font-black text-gray-900 mt-0.5">{rxRevenue.toLocaleString('vi-VN')} đ</h3>
              </div>
            </div>
          </div>

          {/* Biểu đồ phân tích hình thức thanh toán */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-gray-800 text-sm mb-4">Cơ cấu hình thức thanh toán của Quầy</h4>
            
            <div className="space-y-4 max-w-lg">
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-600 mb-1.5">
                  <span>💵 Tiền mặt</span>
                  <span>{cashRevenue.toLocaleString('vi-VN')}đ ({((cashRevenue / (examRevenue + rxRevenue || 1)) * 100).toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#004e92] h-full rounded-full transition-all" style={{ width: `${(cashRevenue / (examRevenue + rxRevenue || 1)) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-gray-600 mb-1.5">
                  <span>🏦 Chuyển khoản ngân hàng</span>
                  <span>{transferRevenue.toLocaleString('vi-VN')}đ ({((transferRevenue / (examRevenue + rxRevenue || 1)) * 100).toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: `${(transferRevenue / (examRevenue + rxRevenue || 1)) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL IN PHIẾU THU THỰC TẾ (HỖ TRỢ IN KHÁCH HÀNG) */}
      {showReceiptModal && receiptData && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999] print:absolute print:inset-0 print:bg-white print:p-0 print-modal-parent">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh] print:max-h-full print:shadow-none print:w-full print:rounded-none print-modal-content">
            
            {/* Header Modal (Ẩn khi in) */}
            <div className="bg-gray-100 p-4 border-b border-gray-200 flex justify-between items-center print:hidden">
              <span className="font-bold text-gray-800 text-sm">Xem Phiếu thu</span>
              <button 
                onClick={() => setShowReceiptModal(false)}
                className="text-gray-500 hover:text-gray-800 text-sm font-bold bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm"
              >
                Đóng
              </button>
            </div>

            {/* Chi tiết phiếu thu (Vùng In) */}
            <div className="p-8 flex-grow overflow-y-auto space-y-6 print:p-0 print:overflow-visible">
              <div className="text-center space-y-1">
                <h2 className="text-base font-extrabold uppercase text-gray-900 tracking-wider">SỞ Y TẾ TP. HỒ CHÍ MINH</h2>
                <h1 className="text-lg font-black text-gray-950 uppercase tracking-widest">BỆNH VIỆN NHÂN DÂN</h1>
                <p className="text-xs text-gray-500 italic">Địa chỉ: 123 Nguyễn Chí Thanh, Quận 10, TP.HCM</p>
                <div className="border-b-2 border-dashed border-gray-300 pt-3"></div>
              </div>

              {receiptData.type === 'exam' ? (
                <>
                  <div className="text-center space-y-1">
                    <h3 className="text-sm font-black text-gray-900 uppercase">PHIẾU TIẾP NHẬN & THU PHÍ KHÁM</h3>
                    <p className="text-xs text-gray-500">Mã phiếu đặt: {receiptData.code}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-2xl text-center space-y-1 border border-gray-100 print:bg-white">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">SỐ THỨ TỰ KHÁM:</span>
                    <div className="text-5xl font-black text-[#004e92] print:text-black">{receiptData.queueNumber}</div>
                    <p className="text-xs font-bold text-gray-700 mt-1">Phòng khám chuyên khoa: {receiptData.dept}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Bác sĩ: {receiptData.doctor}</p>
                  </div>

                  <div className="space-y-2 text-xs text-gray-800">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Bệnh nhân:</span>
                      <span className="font-bold text-gray-900 uppercase">{receiptData.patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Số điện thoại:</span>
                      <span className="font-medium text-gray-800">{receiptData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Thời gian hẹn:</span>
                      <span className="font-medium text-gray-800">{receiptData.time} - {new Date(receiptData.date).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-100 pt-2">
                      <span className="text-gray-400">Mức phí khám:</span>
                      <span className="font-bold text-gray-900">150,000 đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Hình thức thanh toán:</span>
                      <span className="font-bold text-gray-800">{receiptData.paymentMethod}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center space-y-1">
                    <h3 className="text-sm font-black text-gray-900 uppercase font-mono">HÓA ĐƠN BÁN LẺ DƯỢC PHẨM</h3>
                    <p className="text-xs text-gray-500">Hóa đơn số: {receiptData.id}</p>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-800">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Bệnh nhân:</span>
                      <span className="font-bold text-gray-900 uppercase">{receiptData.patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mã HS bệnh án:</span>
                      <span className="font-semibold text-gray-900">{receiptData.patientCode}</span>
                    </div>
                    {receiptData.bhyt && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">BHYT:</span>
                        <span className="font-semibold text-green-700">{receiptData.bhyt}</span>
                      </div>
                    )}
                  </div>

                  {/* Bảng kê thuốc chi tiết */}
                  <div className="border-t border-b border-dashed border-gray-300 py-3 text-xs space-y-2">
                    <div className="grid grid-cols-4 font-bold text-gray-800">
                      <span className="col-span-2">Tên thuốc</span>
                      <span className="text-center">SL</span>
                      <span className="text-right">Thành tiền</span>
                    </div>
                    {receiptData.items.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-4 text-gray-700">
                        <span className="col-span-2 font-medium">{item.name}</span>
                        <span className="text-center">{item.qty}</span>
                        <span className="text-right">{(item.price * item.qty).toLocaleString('vi-VN')}đ</span>
                      </div>
                    ))}
                  </div>

                  {/* Tóm tắt tiền thuốc */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tổng tiền thuốc gốc:</span>
                      <span className="font-semibold text-gray-800">{receiptData.totalCost.toLocaleString('vi-VN')} đ</span>
                    </div>
                    {receiptData.discount > 0 && (
                      <div className="flex justify-between text-green-700">
                        <span>Khấu trừ BHYT (80%):</span>
                        <span className="font-semibold">-{receiptData.discount.toLocaleString('vi-VN')} đ</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="font-extrabold text-gray-900">THỰC THU KHÁCH HÀNG:</span>
                      <span className="text-base font-black text-gray-950">{receiptData.finalCost.toLocaleString('vi-VN')} đ</span>
                    </div>
                  </div>
                </>
              )}

              <div className="text-center pt-4 space-y-3.5">
                <p className="text-[10px] text-gray-400 italic">Vui lòng mang phiếu thu này đến phòng khám hoặc nhà thuốc để hoàn tất quy trình khám bệnh.</p>
                <div className="flex justify-around text-xs font-bold text-gray-800">
                  <div className="text-center space-y-12">
                    <p>Người đóng tiền</p>
                    <p className="font-medium text-gray-400 italic">(Ký, ghi rõ họ tên)</p>
                  </div>
                  <div className="text-center space-y-12">
                    <p>Thu ngân</p>
                    <p className="font-black text-gray-900">BV Nhân Dân</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Modal Action (Ẩn khi in) */}
            <div className="bg-gray-50 p-4 border-t border-gray-200 flex gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="flex-1 bg-[#004e92] hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md"
              >
                <Printer size={16} /> In Phiếu thu (Print)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Billing;
