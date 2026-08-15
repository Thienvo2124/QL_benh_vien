import { useState, useEffect, useCallback } from 'react';
import { 
  DollarSign, Search, User, Calendar, Phone, Activity, Pill, 
  Printer, CheckCircle, AlertCircle, RefreshCw, CreditCard, 
  ArrowRight, Users, PlusCircle, Check, X, Tag, FileText
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

const getDeptPrice = (deptName) => {
  if (!deptName) return 150000;
  if (deptName.includes('Cơ Bản')) return 1500000;
  if (deptName.includes('Nâng Cao')) return 2500000;
  if (deptName.includes('Chuyên Sâu')) return 4500000;
  if (deptName.includes('VIP Gold')) return 8000000;
  if (deptName.includes('VIP Platinum')) return 15000000;
  if (deptName.includes('tầm soát ung thư tổng quát') || deptName.includes('Tầm soát ung thư tổng quát')) return 3000000;
  if (deptName.includes('tầm soát ung thư tiêu hóa') || deptName.includes('Tầm soát ung thư tiêu hóa')) return 2200000;
  if (deptName.includes('tầm soát đột quỵ') || deptName.includes('Tầm soát đột quỵ')) return 2800000;
  return 150000;
};

const formatDateSafe = (dateVal) => {
  if (!dateVal) return 'N/A';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('vi-VN');
  } catch (e) {
    return 'N/A';
  }
};

const getYearSafe = (dateVal) => {
  if (!dateVal) return '';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return '';
    return d.getFullYear();
  } catch (e) {
    return '';
  }
};

const CashierDashboard = () => {
  const [activeTab, setActiveTab] = useState('register'); // register | reception | prescription
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Tiền mặt');
  const [prescriptionBills, setPrescriptionBills] = useState(initialPrescriptionBills);
  const [rxSearchQuery, setRxSearchQuery] = useState('');
  const [infoSearchQuery, setInfoSearchQuery] = useState('');
  const [notification, setNotification] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  
  // Filter States for Issued Tab
  const [issuedDeptFilter, setIssuedDeptFilter] = useState('Tất cả');
  const [issuedStatusFilter, setIssuedStatusFilter] = useState('Tất cả');
  
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
    autoPay: false
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

  // Khởi tạo quy trình thu phí khám (mở modal chờ xác nhận)
  const handleInitiatePayExamFee = (app, chosenMethod) => {
    setReceiptData({
      type: 'exam',
      isPending: true,
      appId: app._id,
      patientName: app.name,
      phone: app.phone,
      dob: app.dob,
      gender: app.gender,
      dept: app.dept,
      doctor: app.doctor || 'Hệ thống tự phân công',
      date: app.date,
      time: app.time,
      fee: app.initialFee || 150000,
      paymentMethod: chosenMethod,
      queueNumber: null,
      code: app.appointmentCode
    });
    setShowReceiptModal(true);
  };

  // Xác nhận đóng phí khám thực tế (gọi API)
  const handlePayExamFeeConfirm = async (appId, chosenMethod) => {
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
          isPending: false,
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

  // Xóa số khám / Hủy tiếp nhận lịch hẹn
  const handleDeleteAppointment = async (appId, patientName, queueNum) => {
    const formattedNum = String(queueNum || 0).padStart(2, '0');
    if (!window.confirm(`Bạn có chắc chắn muốn XÓA số khám ${formattedNum} của bệnh nhân ${patientName}? Lịch hẹn này sẽ bị xóa khỏi hệ thống.`)) {
      return;
    }
    
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/appointments/${appId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      let data = {};
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (response.ok) {
        setNotification(`✅ Đã xóa thành công số khám ${formattedNum} của bệnh nhân ${patientName}!`);
        fetchAppointments();
        setTimeout(() => setNotification(''), 5000);
      } else {
        alert(data.message || "Không thể xóa số khám.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa số khám:", error);
      alert("Lỗi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  // Xem và in lại biên lại đóng phí khám
  const handleRePrintReceipt = (app) => {
    setReceiptData({
      type: 'exam',
      isPending: false,
      patientName: app.name,
      phone: app.phone,
      dob: app.dob,
      gender: app.gender,
      dept: app.dept,
      doctor: app.doctor || 'Hệ thống tự phân công',
      date: app.date,
      time: app.time,
      fee: app.initialFee || 150000,
      paymentMethod: app.paymentMethod || 'Tiền mặt',
      queueNumber: app.queueNumber,
      code: app.appointmentCode
    });
    setShowReceiptModal(true);
  };

  // Khởi tạo quy trình thu phí đơn thuốc (mở modal chờ xác nhận)
  const handleInitiatePayPrescription = (bill, method) => {
    const totalCost = bill.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const hasBHYT = !!bill.bhyt;
    const discount = hasBHYT ? totalCost * 0.8 : 0;
    const finalCost = totalCost - discount;

    setReceiptData({
      type: 'prescription',
      isPending: true,
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
  };

  // Xác nhận đóng phí đơn thuốc thực tế (gọi API)
  const handlePayPrescriptionConfirm = async (billId, method) => {
    if (typeof billId === 'string' && billId.startsWith('HDT-')) {
      // Cập nhật mock state
      const updatedBills = prescriptionBills.map(bill => {
        if (bill.id === billId) {
          setNotification(`✅ Thu phí đơn thuốc thành công cho: ${bill.patientName}!`);
          const totalCost = bill.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
          const hasBHYT = !!bill.bhyt;
          const discount = hasBHYT ? totalCost * 0.8 : 0;
          const finalCost = totalCost - discount;

          setReceiptData({
            type: 'prescription',
            isPending: false,
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
          return { ...bill, status: 'paid', paymentMethod: method };
        }
        return bill;
      });
      setPrescriptionBills(updatedBills);
      return;
    }

    // Database record
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/appointments/${billId}/pay-prescription`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentMethod: method })
      });

      const data = await response.json();
      if (response.ok) {
        setNotification(`✅ Thu phí đơn thuốc thành công cho: ${data.appointment.name}!`);
        fetchAppointments(); // Tải lại danh sách
        
        const bill = data.appointment;
        const totalCost = bill.prescription.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const hasBHYT = !!bill.bhyt && bill.bhyt !== 'Không có BHYT';
        const discount = hasBHYT ? totalCost * 0.8 : 0;
        const finalCost = totalCost - discount;

        setReceiptData({
          type: 'prescription',
          isPending: false,
          id: bill._id,
          patientName: bill.name,
          patientCode: bill.appointmentCode,
          phone: bill.phone,
          bhyt: bill.bhyt,
          items: bill.prescription.map(p => ({
            name: p.name,
            qty: p.qty,
            unit: p.unit,
            price: p.price
          })),
          totalCost,
          discount,
          finalCost,
          paymentMethod: bill.prescriptionPaymentMethod || method
        });
        setShowReceiptModal(true);
        setTimeout(() => setNotification(''), 5000);
      } else {
        alert(data.message || "Không thể thực hiện thanh toán đơn thuốc.");
      }
    } catch (error) {
      console.error("Lỗi khi thu phí đơn thuốc:", error);
      alert("Lỗi kết nối máy chủ.");
    }
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
          reason: registerForm.reason,
          initialFee: getDeptPrice(registerForm.dept)
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
          autoPay: false
        });
        setDobDay('');
        setDobMonth('');
        setDobYear('');

        setNotification(`✅ Đã tiếp nhận bệnh nhân vãng lai: ${newApp.name}. Hãy thực hiện thu tiền khám.`);
        fetchAppointments();
        setTimeout(() => setNotification(''), 5000);
        
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

  const appointmentsArr = Array.isArray(appointments) ? appointments : [];

  // Mở rộng mapping đơn thuốc từ database
  const dbPrescriptionBills = appointmentsArr.filter(app => app.prescriptionStatus && app.prescriptionStatus !== 'none').map(app => ({
    id: app._id,
    patientName: app.name,
    patientCode: app.appointmentCode || '0029187302',
    phone: app.phone,
    bhyt: app.bhyt || 'Không có BHYT',
    status: app.prescriptionStatus,
    paymentMethod: app.prescriptionPaymentMethod || '',
    items: app.prescription || []
  }));

  // Gộp đơn thuốc database và mock data, tránh trùng tên
  const rxBillsArr = [
    ...dbPrescriptionBills,
    ...((Array.isArray(prescriptionBills) ? prescriptionBills : []).filter(mock => !dbPrescriptionBills.some(db => db.patientName === mock.patientName)))
  ];

  // Lọc danh sách lịch hẹn cần thu tiền khám
  const unpaidAppointments = appointmentsArr.filter(app => {
    if (!app) return false;
    const name = app.name || '';
    const phone = app.phone || '';
    const code = app.appointmentCode || '';
    
    const isUnpaid = app.paymentStatus === 'unpaid' && app.status !== 'rejected';
    const matchesSearch = searchQuery === '' || 
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery) ||
      (code && code.toLowerCase().includes(searchQuery.toLowerCase()));
    return isUnpaid && matchesSearch;
  });

  // Lọc danh sách lịch hẹn đã đóng phí khám và cấp số khám
  const issuedAppointments = appointmentsArr.filter(app => {
    if (!app) return false;
    const name = app.name || '';
    const phone = app.phone || '';
    const code = app.appointmentCode || '';
    const dept = app.dept || '';
    const status = app.status || '';
    
    const isPaid = app.paymentStatus === 'paid';
    const matchesSearch = searchQuery === '' || 
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery) ||
      (code && code.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesDept = issuedDeptFilter === 'Tất cả' || dept === issuedDeptFilter;
    const matchesStatus = issuedStatusFilter === 'Tất cả' || 
      (issuedStatusFilter === 'completed' && status === 'completed') ||
      (issuedStatusFilter === 'waiting' && status !== 'completed');
      
    return isPaid && matchesSearch && matchesDept && matchesStatus;
  });

  // Lọc danh sách đơn thuốc cần thu tiền
  const unpaidPrescriptions = rxBillsArr.filter(bill => {
    if (!bill) return false;
    const patientName = bill.patientName || '';
    const phone = bill.phone || '';
    const id = bill.id || '';
    
    const isUnpaid = bill.status === 'unpaid';
    const matchesSearch = rxSearchQuery === '' || 
      patientName.toLowerCase().includes(rxSearchQuery.toLowerCase()) ||
      phone.includes(rxSearchQuery) ||
      id.toLowerCase().includes(rxSearchQuery.toLowerCase());
    return isUnpaid && matchesSearch;
  });

  const allAppointmentsFiltered = appointmentsArr.filter(app => {
    if (!app) return false;
    const name = app.name || '';
    const phone = app.phone || '';
    const code = app.appointmentCode || '';
    const dept = app.dept || '';
    
    const matchesSearch = infoSearchQuery === '' || 
      name.toLowerCase().includes(infoSearchQuery.toLowerCase()) ||
      phone.includes(infoSearchQuery) ||
      (code && code.toLowerCase().includes(infoSearchQuery.toLowerCase())) ||
      (dept && dept.toLowerCase().includes(infoSearchQuery.toLowerCase()));
    return matchesSearch;
  });

  // Thống kê doanh thu nhanh (chỉ tính các hóa đơn đã thu trong session hiện tại)
  const paidExams = appointmentsArr.filter(app => app && app.paymentStatus === 'paid');
  const paidPrescriptions = rxBillsArr.filter(bill => bill && bill.status === 'paid');

  const totalExamRevenue = paidExams.reduce((sum, app) => sum + (app.initialFee || 150000), 0);
  const totalPrescriptionRevenue = paidPrescriptions.reduce((sum, bill) => {
    if (!bill || !bill.items) return sum;
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
          <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Duyệt Phí & Cấp Số</div>
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
          <Users className="w-4 h-4" /> 2. Duyệt Phí & Cấp Số ({unpaidAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab('issued')}
          className={`pb-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'issued'
              ? 'border-[#004e92] text-[#004e92]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <CheckCircle className="w-4 h-4" /> 3. Số Đã Cấp ({issuedAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab('prescription')}
          className={`pb-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'prescription'
              ? 'border-[#004e92] text-[#004e92]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Pill className="w-4 h-4" /> 4. Thu Tiền Đơn Thuốc ({unpaidPrescriptions.length})
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`pb-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'info'
              ? 'border-[#004e92] text-[#004e92]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <FileText className="w-4 h-4" /> 5. Thông Tin Khám Bệnh ({appointmentsArr.length})
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
                          <span className="text-xs text-gray-500 block mt-0.5">SĐT: {app.phone} {app.dob ? `| Năm sinh: ${getYearSafe(app.dob)}` : ''}</span>
                        </td>
                        <td className="p-5">
                          <span className="bg-blue-50 text-[#004e92] text-xs font-bold px-2.5 py-1 rounded-full border border-blue-100">
                            {app.dept}
                          </span>
                          <span className="text-xs text-gray-400 block mt-1">BS: {app.doctor || 'Hệ thống tự phân công'}</span>
                        </td>
                        <td className="p-5">
                          <span className="font-bold text-gray-700">{app.time}</span>
                          <span className="text-xs text-gray-400 block mt-0.5">{formatDateSafe(app.date)}</span>
                        </td>
                        <td className="p-5 text-right font-black text-[#004e92]">
                          {(app.initialFee || 150000).toLocaleString('vi-VN')} đ
                        </td>
                        <td className="p-5 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleInitiatePayExamFee(app, 'Tiền mặt')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3.5 rounded-xl transition-all text-xs flex items-center gap-1 shadow-sm"
                            >
                              💵 Tiền mặt
                            </button>
                            <button
                              onClick={() => handleInitiatePayExamFee(app, 'Chuyển khoản')}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3.5 rounded-xl transition-all text-xs flex items-center gap-1 shadow-sm"
                            >
                              💳 Chuyển khoản
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-12 text-center text-gray-400">
                        Không có bệnh nhân nào trong danh sách duyệt phí & cấp số.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SỐ ĐÃ CẤP */}
      {activeTab === 'issued' && (
        <div className="space-y-4 print:hidden">
          {/* SEARCH BAR & FILTERS */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[280px] max-w-md">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm số đã cấp (Tên, SĐT, Mã LH...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Chuyên khoa:</span>
                <select
                  value={issuedDeptFilter}
                  onChange={(e) => setIssuedDeptFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#004e92] cursor-pointer"
                >
                  <option value="Tất cả">Tất cả</option>
                  {departments.map((dept) => (
                    <option key={dept.slug} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái:</span>
                <select
                  value={issuedStatusFilter}
                  onChange={(e) => setIssuedStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#004e92] cursor-pointer"
                >
                  <option value="Tất cả">Tất cả</option>
                  <option value="waiting">Chờ vào khám</option>
                  <option value="completed">Đã khám xong</option>
                </select>
              </div>
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
                    <th className="p-5 font-medium">Bác sĩ phụ trách</th>
                    <th className="p-5 font-medium">Giờ cấp số</th>
                    <th className="p-5 font-medium text-center">Trạng thái</th>
                    <th className="p-5 font-medium text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                  {issuedAppointments.length > 0 ? (
                    issuedAppointments.map((app) => (
                      <tr key={app._id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="p-5 text-center">
                          <span className="bg-blue-50 text-[#004e92] text-sm font-black px-3 py-1.5 rounded-xl border border-blue-100 shadow-sm">
                            {String(app.queueNumber || 0).padStart(2, '0')}
                          </span>
                        </td>
                        <td className="p-5 font-semibold text-gray-900">
                          <div className="font-bold text-gray-950 flex items-center gap-1.5 text-base">
                            {app.name}
                            <span className="text-xs font-normal text-gray-500">
                              ({app.gender || 'Nam'}, {app.dob ? new Date().getFullYear() - getYearSafe(app.dob) : 30}t)
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 font-medium flex items-center gap-3 mt-1.5">
                            <span>📱 {app.phone}</span>
                            <span>💳 BHYT: <strong className="font-mono text-gray-700">{app.bhyt || 'Không có'}</strong></span>
                          </div>
                        </td>
                        <td className="p-5">
                          <span className="bg-blue-50 text-[#004e92] text-xs font-bold px-2.5 py-1 rounded-full border border-blue-100">
                            {app.dept}
                          </span>
                        </td>
                        <td className="p-5 text-gray-700 font-semibold">
                          {app.doctor || 'Hệ thống tự phân công'}
                        </td>
                        <td className="p-5 font-bold text-gray-700">
                          {app.time}
                        </td>
                        <td className="p-5 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border inline-block shadow-sm ${
                            app.status === 'completed'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {app.status === 'completed' ? 'Đã khám xong' : 'Chờ vào khám'}
                          </span>
                        </td>
                        <td className="p-5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleRePrintReceipt(app)}
                              className="bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold py-2 px-3 rounded-xl transition-all text-xs flex items-center gap-1.5 shadow-sm border border-emerald-200 hover:border-transparent"
                              title="In lại biên lai đóng phí"
                            >
                              <Printer className="w-3.5 h-3.5" /> Biên lai
                            </button>
                            <button
                              onClick={() => handleDeleteAppointment(app._id, app.name, app.queueNumber)}
                              className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-bold p-2.5 rounded-xl transition-all shadow-sm border border-red-200 hover:border-transparent flex items-center justify-center"
                              title="Xóa số khám / Hủy lịch hẹn"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-12 text-center text-gray-400">
                        Chưa có số thứ tự nào được cấp trong hôm nay.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
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
                  {departments.map((dept) => {
                    const price = getDeptPrice(dept.name);
                    return (
                      <option key={dept.slug} value={dept.name}>
                        {dept.icon} {dept.name} ({price.toLocaleString('vi-VN')} đ)
                      </option>
                    );
                  })}
                </select>
                {registerForm.dept && (
                  <div className="mt-2 text-sm text-[#004e92] font-bold flex items-center gap-1.5 bg-blue-50 px-4 py-2.5 rounded-xl border border-blue-100 w-max">
                    💰 Giá dịch vụ: {getDeptPrice(registerForm.dept).toLocaleString('vi-VN')} đ
                  </div>
                )}
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
                                onClick={() => handleInitiatePayPrescription(bill, 'Tiền mặt')}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl transition-all text-xs flex items-center justify-center gap-1"
                              >
                                💵 Tiền mặt
                              </button>
                              <button
                                onClick={() => handleInitiatePayPrescription(bill, 'Chuyển khoản')}
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

      {/* TAB 4: THÔNG TIN KHÁM BỆNH */}
      {activeTab === 'info' && (
        <div className="space-y-4 print:hidden">
          {/* SEARCH BAR */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[280px] max-w-md">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm bệnh nhân (Tên, SĐT, Chuyên khoa, Mã LH...)"
                value={infoSearchQuery}
                onChange={(e) => setInfoSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors font-medium"
              />
            </div>
            
            <div className="text-sm text-gray-500 font-semibold">
              Tổng số tiếp nhận hôm nay: <strong className="text-gray-900">{appointmentsArr.length} bệnh nhân</strong>
            </div>
          </div>

          {/* APPOINTMENTS HISTORY TABLE */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="p-5 font-medium text-center w-16">STT</th>
                    <th className="p-5 font-medium">Bệnh nhân & Liên hệ</th>
                    <th className="p-5 font-medium">Loại hình</th>
                    <th className="p-5 font-medium">Khoa điều phối</th>
                    <th className="p-5 font-medium">Thời gian</th>
                    <th className="p-5 font-medium">Lệ phí</th>
                    <th className="p-5 font-medium text-center">Thanh toán</th>
                    <th className="p-5 font-medium text-center w-40">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                  {allAppointmentsFiltered.length > 0 ? (
                    allAppointmentsFiltered.map((app, index) => {
                      const isPaid = app.paymentStatus === 'paid';
                      const isWalkIn = app.reason === 'Đến khám trực tiếp tại quầy' || !app.reason;
                      
                      return (
                        <tr key={app._id} className="hover:bg-blue-50/10 transition-colors">
                          <td className="p-5 font-bold text-gray-700 text-center">{index + 1}</td>
                          <td className="p-5">
                            <div className="font-bold text-gray-900">{app.name}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <Phone size={12} className="text-gray-400" /> {app.phone}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              NS: {formatDateSafe(app.dob)} | GT: {app.gender || 'Nam'}
                            </div>
                          </td>
                          <td className="p-5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                              isWalkIn 
                                ? 'bg-blue-50 text-blue-700' 
                                : 'bg-purple-50 text-purple-700'
                            }`}>
                              {isWalkIn ? '🚶 Vãng lai' : '🌐 Đặt trước (Onl)'}
                            </span>
                          </td>
                          <td className="p-5 font-semibold text-gray-800">{app.dept}</td>
                          <td className="p-5">
                            <div className="font-semibold text-gray-900">{app.time}</div>
                            <div className="text-xs text-gray-500">{formatDateSafe(app.date)}</div>
                          </td>
                          <td className="p-5 font-mono font-bold text-gray-900">
                            {(app.initialFee || 150000).toLocaleString('vi-VN')} đ
                          </td>
                          <td className="p-5 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                              isPaid 
                                ? 'bg-emerald-50 text-emerald-700' 
                                : 'bg-amber-50 text-amber-700'
                            }`}>
                              {isPaid ? '✓ Đã thu tiền' : '⏰ Chờ thu tiền'}
                            </span>
                          </td>
                          <td className="p-5 text-center">
                            <button
                              onClick={() => {
                                setReceiptData({
                                  type: 'exam',
                                  code: app.appointmentCode,
                                  patientName: app.name,
                                  phone: app.phone,
                                  dob: app.dob,
                                  paymentMethod: app.paymentMethod === 'Chưa thanh toán' ? 'Tiền mặt' : app.paymentMethod,
                                  queueNumber: app.queueNumber || 1,
                                  dept: app.dept,
                                  doctor: app.doctor,
                                  time: app.time,
                                  date: app.date,
                                  fee: app.initialFee || 150000,
                                });
                                setShowReceiptModal(true);
                              }}
                              className="px-3 py-1.5 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-700 rounded-xl transition-all text-xs border border-gray-200 hover:border-blue-200 font-bold flex items-center justify-center gap-1 mx-auto"
                            >
                              <Printer className="w-3.5 h-3.5" /> In lại phiếu
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="p-12 text-center text-gray-400">
                        Không tìm thấy bệnh nhân nào phù hợp.
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
                    <span className="text-gray-900">{getYearSafe(receiptData.dob)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Hình thức thanh toán:</span>
                  <span className="text-gray-900">{receiptData.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Trạng thái:</span>
                  {receiptData.isPending ? (
                    <span className="text-amber-600 font-extrabold flex items-center gap-1">⏰ CHỜ THANH TOÁN (NHẤN XÁC NHẬN)</span>
                  ) : (
                    <span className="text-emerald-600 font-extrabold flex items-center gap-1">ĐÃ THANH TOÁN (ĐỦ ĐIỀU KIỆN KHÁM)</span>
                  )}
                </div>
              </div>

              {/* Receipt Specific Body */}
              {receiptData.type === 'exam' ? (
                // Lịch khám
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-4">
                  <div className="text-center space-y-1">
                    <span className="text-xs text-[#004e92] font-bold uppercase tracking-wider block">Số Thứ Tự Khám</span>
                    <span className="text-5xl font-black text-[#004e92] block font-mono">
                      {receiptData.isPending ? (
                        <span className="text-lg font-bold text-amber-500">Chờ cấp số...</span>
                      ) : (
                        <>
                          {receiptData.queueNumber && receiptData.queueNumber < 10 ? '0' : ''}{receiptData.queueNumber || '01'}
                        </>
                      )}
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
                      <strong className="text-gray-900">{receiptData.time} - {formatDateSafe(receiptData.date)}</strong>
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
              {receiptData.isPending ? (
                <>
                  <button
                    onClick={() => setShowReceiptModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-2xl transition-colors text-sm"
                  >
                    Đóng / Hủy bỏ
                  </button>
                  <button
                    onClick={async () => {
                      if (receiptData.type === 'exam') {
                        const updatedApp = await handlePayExamFeeConfirm(receiptData.appId, receiptData.paymentMethod);
                        if (updatedApp) {
                          // Tự động in sau khi thanh toán thành công
                          setTimeout(() => window.print(), 500);
                        }
                      } else {
                        handlePayPrescriptionConfirm(receiptData.id, receiptData.paymentMethod);
                        // Tự động in sau khi thanh toán thành công
                        setTimeout(() => window.print(), 500);
                      }
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl transition-colors shadow-lg text-sm flex items-center justify-center gap-1.5"
                  >
                    ✓ Xác nhận thanh toán
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierDashboard;
