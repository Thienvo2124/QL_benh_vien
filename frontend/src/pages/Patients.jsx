import { useState, useEffect, useCallback, useContext } from 'react';
import { FileText, Search, Plus, Eye, User, Calendar, Phone, Activity, Pill, Clock, CheckCircle, AlertCircle, Filter, FileSpreadsheet, Printer, ShieldPlus, X, Pencil, Trash2 } from 'lucide-react';
import API_BASE_URL from '../config/api';
import departments from '../data/departments';
import { AuthContext } from '../contexts/AuthContext';

const initialRecords = [
  {
    id: 'HS-2026-001',
    queueNumber: 1,
    patientName: 'Nguyễn Văn A',
    age: 31,
    gender: 'Nam',
    weight: '62 kg',
    phone: '0901234567',
    address: 'Số 1 Nơ Trang Long, P. Gia Định, Hà Nội',
    bhyt: 'DN4797931234567',
    lastVisit: '28/06/2026',
    dept: 'Da liễu & Dị ứng',
    doctor: 'BS. CKII Nguyễn Tuấn Lâm',
    symptoms: 'Mẩn ngứa quanh cổ và cánh tay, xuất hiện nhiều về đêm, da khô đỏ.',
    diagnosis: 'Viêm da dị ứng tiếp xúc / Mề đay mãn tính.',
    treatment: 'Dùng thuốc kháng histamin giảm ngứa, bôi kem đặc trị tại chỗ và kiêng xà phòng mạnh.',
    status: 'Đang điều trị',
    patientCode: '0029187302',
    orderCode: '000000432904',
    treatCode: '000000128400',
    medicines: [
      { name: 'Cetirizine 10mg (Cetimed 10mg)', qty: '20', unit: 'Viên', usage: 'Uống tối 1 viên sau ăn' },
      { name: 'Hightamine 5.0mg + 25mg... (Vitamin A+D2+B1+B2+PP+B6+B12+C+E + B5 + acid folic)', qty: '40', unit: 'Viên', usage: 'Uống ngày 2 lần sáng chiều mỗi lần 1 viên' },
      { name: 'Kẽm (dưới dạng kẽm gluconat 10mg) (Conipa pure 10ml)', qty: '20', unit: 'Ống', usage: 'Uống sáng 1 ống' },
      { name: 'Mometason furoat 0.1% (Locgoda 0.1% 15g)', qty: '02', unit: 'Tuýp', usage: 'Bôi chỗ ngứa ngày 2 lần sáng chiều, bôi mỏng trong 7-10 ngày' }
    ],
    advice: 'Đã tư vấn kỹ cho bệnh nhân về đơn thuốc và đơn tư vấn và bệnh nhân đồng ý sử dụng, khám lại sau 3 tuần.'
  },
  {
    id: 'HS-2025-102',
    queueNumber: 2,
    patientName: 'Trần Thị B',
    age: 45,
    gender: 'Nữ',
    weight: '55 kg',
    phone: '0988777123',
    address: 'Chung cư Sunview, Quận Đống Đa, Hà Nội',
    bhyt: 'HT3797939876543',
    lastVisit: '15/12/2025',
    dept: 'Tim mạch',
    doctor: 'BS. Trần Thị B',
    symptoms: 'Hồi hộp, thỉnh thoảng nhói tim khi làm việc nặng.',
    diagnosis: 'Huyết áp hơi cao do căng thẳng công việc (Stress).',
    treatment: 'Điều chỉnh chế độ ăn giảm mặn, không thức khuya, theo dõi chỉ số huyết áp hàng ngày.',
    status: 'Theo dõi định kỳ',
    patientCode: '0029187999',
    orderCode: '000000432888',
    treatCode: '000000128555',
    medicines: [
      { name: 'Amlodipine 5mg (Amlor 5mg)', qty: '30', unit: 'Viên', usage: 'Uống 1 viên vào buổi sáng sau ăn' },
      { name: 'Magnesium B6 (Magnerot 500mg)', qty: '60', unit: 'Viên', usage: 'Uống ngày 2 lần sáng tối, mỗi lần 1 viên' }
    ],
    advice: 'Kiểm tra huyết áp đều đặn mỗi sáng, hạn chế ăn mặn và tập thể dục nhẹ nhàng 30 phút mỗi ngày.'
  },
  {
    id: 'HS-2026-045',
    queueNumber: 3,
    patientName: 'Lê Hoàng C',
    age: 28,
    gender: 'Nam',
    weight: '70 kg',
    phone: '0912345678',
    address: 'Phố Cổ, Quận Hoàn Kiếm, Hà Nội',
    bhyt: 'GD4797935555666',
    lastVisit: '25/05/2026',
    dept: 'Nha khoa',
    doctor: 'BS. Lê Trọng N',
    symptoms: 'Đau nhức răng hàm dưới bên phải, sưng mộng răng.',
    diagnosis: 'Viêm tủy răng R46, sâu răng mức độ 3.',
    treatment: 'Điều trị tủy, hàn composite phục hồi thân răng.',
    status: 'Đã khỏi',
    patientCode: '0029187777',
    orderCode: '000000432777',
    treatCode: '000000128777',
    medicines: [
      { name: 'Ibuprofen 400mg', qty: '15', unit: 'Viên', usage: 'Uống 1 viên sau ăn khi đau nhức nhiều' },
      { name: 'Amoxicillin 500mg (Curam 500mg)', qty: '20', unit: 'Viên', usage: 'Uống 2 viên/ngày chia 2 lần sáng tối' }
    ],
    advice: 'Vệ sinh răng miệng sạch sẽ sau bữa ăn, sử dụng chỉ nha khoa và nước súc miệng sinh lý.'
  }
];

const Patients = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('Tất cả');
  const [activeTab, setActiveTab] = useState('waiting'); // waiting | history
  
  // Modal state
  const [activeModal, setActiveModal] = useState(null); // 'view', 'new', 'prescription', or null
  const [currentRecord, setCurrentRecord] = useState(null);

  // New record form state
  const [selectedWaitingAppId, setSelectedWaitingAppId] = useState('');
  const [newPatientName, setNewPatientName] = useState('');
  const [newAge, setNewAge] = useState(30);
  const [newGender, setNewGender] = useState('Nam');
  const [newWeight, setNewWeight] = useState('60 kg');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newBhyt, setNewBhyt] = useState('Không có bảo hiểm');
  const [newDept, setNewDept] = useState('Da liễu & Dị ứng');
  const [newDoctor, setNewDoctor] = useState('BS. CKII Nguyễn Tuấn Lâm');
  const [newSymptoms, setNewSymptoms] = useState('');
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newTreatment, setNewTreatment] = useState('');
  const [newAdvice, setNewAdvice] = useState('Đã tư vấn kỹ cho bệnh nhân về đơn thuốc và đơn tư vấn và bệnh nhân đồng ý sử dụng, khám lại sau 3 tuần.');

  // Prescription editor state
  const [prescribedMedicines, setPrescribedMedicines] = useState([]);
  const [selectedMedId, setSelectedMedId] = useState('');
  const [medQty, setMedQty] = useState(1);
  const [medUsage, setMedUsage] = useState('Uống ngày 2 lần sáng tối, mỗi lần 1 viên sau ăn');

  const [successMsg, setSuccessMsg] = useState('');

  const calculateAge = (dobString) => {
    if (!dobString) return 30;
    const year = new Date(dobString).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - year || 30;
  };

  const fetchAppointmentsAndMedicines = useCallback(async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      
      if (!token) {
        console.warn('Patients.jsx: Không có token, bỏ qua fetch dữ liệu từ server.');
        setLoading(false);
        return;
      }

      const [appRes, medRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/appointments`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/api/medicines`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (appRes.status === 401 || appRes.status === 403) {
        console.warn(`Patients.jsx: API /appointments trả về ${appRes.status} - token có thể hết hạn.`);
      } else if (appRes.ok) {
        const appData = await appRes.json();
        if (Array.isArray(appData)) {
          setAppointments(appData);
        } else {
          console.warn('Patients.jsx: /api/appointments không trả về mảng:', appData);
        }
      }

      if (medRes.ok) {
        const medData = await medRes.json();
        if (Array.isArray(medData)) {
          setMedicines(medData);
        }
      }
    } catch (error) {
      console.error("Patients.jsx: Lỗi kết nối khi tải dữ liệu:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointmentsAndMedicines();
  }, [fetchAppointmentsAndMedicines]);

  const waitingList = appointments.filter(app => app.status === 'approved' && app.paymentStatus === 'paid');

  const dbRecords = appointments.filter(app => app.status === 'completed').map(app => ({
    id: app._id,
    queueNumber: app.queueNumber,
    patientName: app.name,
    age: calculateAge(app.dob),
    gender: app.gender || 'Nam',
    weight: app.weight || '60 kg',
    phone: app.phone,
    address: app.address || 'Hà Nội',
    bhyt: app.bhyt || 'Không có BHYT',
    lastVisit: new Date(app.date).toLocaleDateString('vi-VN'),
    dept: app.dept,
    doctor: app.doctor || 'BS. CKII Nguyễn Tuấn Lâm',
    symptoms: app.symptoms || '',
    diagnosis: app.diagnosis || '',
    treatment: app.treatment || '',
    status: 'Đã khám',
    patientCode: app.appointmentCode || '0029187302',
    orderCode: app.appointmentCode ? 'HD-' + app.appointmentCode.slice(-6) : '000000432904',
    treatCode: app.appointmentCode ? 'DT-' + app.appointmentCode.slice(-6) : '000000128400',
    medicines: app.prescription || [],
    advice: app.advice || '',
    updatedBy: app.updatedBy || '',
    updatedByRole: app.updatedByRole || ''
  }));

  const records = [...dbRecords, ...initialRecords];

  const handleAddMedicine = () => {
    if (!selectedMedId) return;
    const targetMed = medicines.find(m => m._id === selectedMedId);
    if (targetMed) {
      if (prescribedMedicines.some(m => m.medicineId === selectedMedId)) {
        alert("Thuốc này đã có trong đơn thuốc!");
        return;
      }
      setPrescribedMedicines([...prescribedMedicines, {
        medicineId: targetMed._id,
        name: targetMed.name,
        qty: Number(medQty),
        unit: targetMed.unit || 'Viên',
        usage: medUsage,
        price: targetMed.price || 0
      }]);
      setSelectedMedId('');
      setMedQty(1);
      setMedUsage('Uống ngày 2 lần sáng tối, mỗi lần 1 viên sau ăn');
    }
  };

  const handleRemoveMedicine = (index) => {
    setPrescribedMedicines(prescribedMedicines.filter((_, i) => i !== index));
  };

  const handleOpenEditModal = (rec) => {
    if (rec.id.startsWith('HS-2026') || rec.id.startsWith('HS-2025')) {
      alert("Không thể chỉnh sửa hồ sơ bệnh án mẫu / lịch sử (dữ liệu mặc định).");
      return;
    }
    setEditingRecordId(rec.id);
    setNewPatientName(rec.patientName);
    setNewAge(rec.age);
    setNewGender(rec.gender || 'Nam');
    setNewWeight(rec.weight || '60 kg');
    setNewPhone(rec.phone || '');
    setNewAddress(rec.address || '');
    setNewBhyt(rec.bhyt === 'Không có BHYT' ? 'Không có bảo hiểm' : rec.bhyt);
    setNewDept(rec.dept);
    setNewDoctor(rec.doctor);
    setNewSymptoms(rec.symptoms || '');
    setNewDiagnosis(rec.diagnosis || '');
    setNewTreatment(rec.treatment || '');
    setNewAdvice(rec.advice || 'Đã tư vấn kỹ cho bệnh nhân về đơn thuốc và đơn tư vấn và bệnh nhân đồng ý sử dụng, khám lại sau 3 tuần.');
    setPrescribedMedicines(rec.medicines || []);
    setActiveModal('edit');
  };

  const handleDeleteRecord = async (appId, patientName) => {
    if (appId.startsWith('HS-2026') || appId.startsWith('HS-2025')) {
      alert("Không thể xóa hồ sơ bệnh án mẫu / lịch sử (dữ liệu mặc định).");
      return;
    }
    if (!window.confirm(`Bạn có chắc chắn muốn XÓA hoàn toàn hồ sơ bệnh án của bệnh nhân ${patientName}? Hành động này không thể hoàn tác.`)) {
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      if (!token) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }
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
        setSuccessMsg(`✅ Đã xóa thành công hồ sơ bệnh án của bệnh nhân ${patientName}!`);
        fetchAppointmentsAndMedicines();
        setTimeout(() => setSuccessMsg(''), 5000);
      } else {
        alert(data.message || "Không thể xóa hồ sơ bệnh án.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa hồ sơ:", error);
      alert("Lỗi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecordSubmit = async (e) => {
    e.preventDefault();
    const appId = activeModal === 'new' ? selectedWaitingAppId : editingRecordId;
    if (!appId) {
      alert(activeModal === 'new' ? "Vui lòng chọn một bệnh nhân từ danh sách chờ khám!" : "Không tìm thấy ID lịch hẹn cần cập nhật.");
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      if (!token) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }

      // Convert age back to DOB
      const dobDate = new Date();
      dobDate.setFullYear(new Date().getFullYear() - parseInt(newAge || 30));
      dobDate.setMonth(0);
      dobDate.setDate(1);

      const response = await fetch(`${API_BASE_URL}/api/appointments/${appId}/medical-record`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newPatientName,
          gender: newGender,
          phone: newPhone,
          weight: newWeight,
          address: newAddress,
          bhyt: newBhyt,
          dept: newDept,
          doctor: newDoctor,
          dob: dobDate.toISOString(),
          symptoms: newSymptoms,
          diagnosis: newDiagnosis,
          treatment: newTreatment,
          advice: newAdvice,
          medicines: prescribedMedicines
        })
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        alert(`Lỗi server (${response.status}): ${text.substring(0, 200)}\n\nVui lòng thử lại sau.`);
        return;
      }

      if (response.ok) {
        setSuccessMsg(activeModal === 'new' 
          ? `Đã lưu thành công Hồ sơ bệnh án mới cho bệnh nhân ${newPatientName}!` 
          : `Đã cập nhật thành công Hồ sơ bệnh án của bệnh nhân ${newPatientName}!`
        );
        setActiveModal(null);
        setEditingRecordId(null);
        fetchAppointmentsAndMedicines();
        setTimeout(() => setSuccessMsg(''), 5000);

        // Reset form
        setSelectedWaitingAppId('');
        setNewPatientName('');
        setNewPhone('');
        setNewAddress('');
        setNewBhyt('Không có bảo hiểm');
        setNewSymptoms('');
        setNewDiagnosis('');
        setNewTreatment('');
        setPrescribedMedicines([]);
      } else {
        alert(`❌ Lỗi ${response.status}: ${data.message || "Không thể lưu bệnh án."}`);
      }
    } catch (error) {
      console.error("Lỗi khi lưu bệnh án:", error);
      alert(`Lỗi kết nối đến máy chủ: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(rec => {
    const matchSearch = 
      rec.patientName.toLowerCase().includes(search.toLowerCase()) || 
      rec.id.toLowerCase().includes(search.toLowerCase()) ||
      rec.phone.includes(search) ||
      rec.diagnosis.toLowerCase().includes(search.toLowerCase());
    
    const matchDept = selectedDept === 'Tất cả' || rec.dept === selectedDept;

    return matchSearch && matchDept;
  });

  const handlePrintPrescription = () => {
    window.print();
  };

  // Filter the waiting list using the search query and selected department
  const filteredWaitingList = waitingList.filter(app => {
    const name = app.name || '';
    const phone = app.phone || '';
    const code = app.appointmentCode || '';
    const matchesSearch = search === '' || 
      name.toLowerCase().includes(search.toLowerCase()) ||
      phone.includes(search) ||
      code.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'Tất cả' || app.dept === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="p-8 space-y-8 font-sans bg-gray-50/50 min-h-screen">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-6 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-wide flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#004e92]" /> Quản lý Hồ sơ Bệnh án & Đơn thuốc
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Tra cứu bệnh án điện tử, khám bệnh lâm sàng và kê đơn thuốc chuẩn Bộ Y Tế.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setSelectedWaitingAppId('');
              setNewPatientName('');
              setNewAge(30);
              setNewGender('Nam');
              setNewPhone('');
              setNewDept('Da liễu & Dị ứng');
              setNewDoctor('BS. CKII Nguyễn Tuấn Lâm');
              setActiveModal('new');
            }}
            className="bg-[#004e92] hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-2xl transition-colors shadow-lg flex items-center gap-2 text-sm transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" /> Tạo Hồ sơ Bệnh án Mới
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl text-sm font-semibold flex items-center gap-3 shadow-sm print:hidden">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          {successMsg}
        </div>
      )}

      {/* KPI STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 print:hidden">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-2">
          <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Bệnh nhân chờ khám</div>
          <div className="text-3xl font-black text-blue-600">{waitingList.length} ca chờ</div>
          <div className="text-xs text-gray-500">Đã đóng phí khám & đang chờ bác sĩ</div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-2">
          <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Đã hoàn tất khám</div>
          <div className="text-3xl font-black text-emerald-600">{dbRecords.length} ca hoàn thành</div>
          <div className="text-xs text-gray-500">Hồ sơ bệnh án lưu trên hệ thống</div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-2">
          <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Tổng hồ sơ quản lý</div>
          <div className="text-3xl font-black text-gray-900">{records.length} hồ sơ</div>
          <div className="text-xs text-gray-500">Bao gồm bệnh án lưu trữ lịch sử</div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-gray-200 gap-6 print:hidden">
        <button
          onClick={() => setActiveTab('waiting')}
          className={`pb-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'waiting'
              ? 'border-[#004e92] text-[#004e92]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Clock className="w-4 h-4" /> 1. Bệnh Nhân Chờ Khám ({waitingList.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'border-[#004e92] text-[#004e92]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <FileText className="w-4 h-4" /> 2. Lịch sử Hồ sơ Bệnh án ({filteredRecords.length})
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="relative flex-1 min-w-[280px] max-w-md">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo Tên, Mã HS, Số ĐT, Chẩn đoán..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-semibold text-gray-700">Chuyên khoa:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#004e92] cursor-pointer"
          >
            <option value="Tất cả">Tất cả chuyên khoa</option>
            {departments.map((dept) => (
              <option key={dept.slug} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TAB 1: BỆNH NHÂN CHỜ KHÁM */}
      {activeTab === 'waiting' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden print:hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="p-5 font-medium w-24 text-center">Số khám</th>
                  <th className="p-5 font-medium">Bệnh nhân & Liên hệ</th>
                  <th className="p-5 font-medium">Chuyên khoa khám</th>
                  <th className="p-5 font-medium">Bác sĩ chỉ định</th>
                  <th className="p-5 font-medium">Giờ đăng ký</th>
                  <th className="p-5 font-medium w-36 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {filteredWaitingList.length > 0 ? (
                  filteredWaitingList.map((app) => (
                    <tr key={app._id} className="hover:bg-blue-50/20 transition-colors">
                      <td className="p-5 text-center">
                        <span className="bg-blue-50 text-[#004e92] text-sm font-black px-3 py-1.5 rounded-xl border border-blue-100 shadow-sm">
                          {String(app.queueNumber || 0).padStart(2, '0')}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="font-bold text-gray-900 text-base flex items-center gap-2">
                          {app.name} 
                          <span className="text-xs font-normal text-gray-500">({app.gender || 'Nam'}, {calculateAge(app.dob)}t)</span>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-3 mt-1">
                          <span>📱 {app.phone}</span>
                          <span>💳 BHYT: <strong className="font-mono text-gray-700">{app.bhyt || 'Không có'}</strong></span>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="bg-blue-50 text-[#004e92] text-xs font-bold px-2.5 py-1 rounded-full border border-blue-100">
                          {app.dept}
                        </span>
                      </td>
                      <td className="p-5 font-semibold text-gray-700">
                        {app.doctor || 'BS. CKII Nguyễn Tuấn Lâm'}
                      </td>
                      <td className="p-5 font-bold text-gray-700">
                        {app.time}
                      </td>
                      <td className="p-5 text-center">
                        <button
                          onClick={() => {
                            setSelectedWaitingAppId(app._id);
                            setNewPatientName(app.name);
                            setNewAge(calculateAge(app.dob));
                            setNewGender(app.gender || 'Nam');
                            setNewPhone(app.phone);
                            setNewDept(app.dept);
                            setNewDoctor(app.doctor || 'BS. CKII Nguyễn Tuấn Lâm');
                            setPrescribedMedicines([]);
                            setActiveModal('new');
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl transition-all text-xs flex items-center gap-1.5 shadow-md mx-auto"
                        >
                          🩺 Tiến hành khám
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-gray-400">
                      Không có bệnh nhân nào đang chờ khám.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: LỊCH SỬ HỒ SƠ BỆNH ÁN */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden print:hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="p-5 font-medium w-24 text-center">Số khám</th>
                  <th className="p-5 font-medium w-36">Mã Bệnh án</th>
                  <th className="p-5 font-medium">Bệnh nhân & Định danh</th>
                  <th className="p-5 font-medium">Chuyên khoa / Bác sĩ</th>
                  <th className="p-5 font-medium">Chẩn đoán sơ bộ</th>
                  <th className="p-5 font-medium w-36 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-blue-50/20 transition-colors">
                      <td className="p-5 text-center">
                        {rec.queueNumber ? (
                          <span className="bg-blue-50 text-[#004e92] text-sm font-black px-3 py-1.5 rounded-xl border border-blue-100 shadow-sm">
                            {String(rec.queueNumber).padStart(2, '0')}
                          </span>
                        ) : (
                          <span className="text-gray-300 font-bold font-mono">-</span>
                        )}
                      </td>
                      <td className="p-5">
                        <span className="font-bold text-[#004e92] font-mono text-sm block">{rec.id}</span>
                        <span className="text-xs text-gray-400 block mt-0.5">Khám: {rec.lastVisit}</span>
                      </td>
                      <td className="p-5">
                        <div className="font-bold text-gray-900 text-base flex items-center gap-2">
                          {rec.patientName} 
                          <span className="text-xs font-normal text-gray-500">({rec.gender}, {rec.age}t)</span>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-3 mt-1">
                          <span>📱 {rec.phone}</span>
                          <span>💳 BHYT: <strong className="font-mono text-gray-700">{rec.bhyt}</strong></span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="font-bold text-gray-800 text-sm">{rec.dept}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{rec.doctor}</div>
                      </td>
                      <td className="p-5">
                        <div className="text-sm font-medium text-gray-800 line-clamp-2 max-w-md">
                          {rec.diagnosis}
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => { setCurrentRecord(rec); setActiveModal('view'); }}
                            className="p-2.5 bg-blue-50 hover:bg-[#004e92] text-[#004e92] hover:text-white rounded-xl transition-all shadow-sm group"
                            title="Xem chi tiết Bệnh án"
                          >
                            <Eye className="w-4 h-4 transform group-hover:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(rec)}
                            className="p-2.5 bg-amber-50 hover:bg-amber-500 text-amber-600 hover:text-white rounded-xl transition-all shadow-sm group"
                            title="Chỉnh sửa Hồ sơ Bệnh án"
                          >
                            <Pencil className="w-4 h-4 transform group-hover:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={() => handleDeleteRecord(rec.id, rec.patientName)}
                            className="p-2.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-xl transition-all shadow-sm group"
                            title="Xóa Hồ sơ Bệnh án"
                          >
                            <Trash2 className="w-4 h-4 transform group-hover:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={() => { setCurrentRecord(rec); setActiveModal('prescription'); }}
                            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 text-xs border border-emerald-200 hover:border-transparent"
                            title="Xem & In Đơn Thuốc Mẫu Bộ Y Tế"
                          >
                            <Printer className="w-3.5 h-3.5" /> Đơn thuốc
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-gray-400">
                      Không tìm thấy hồ sơ bệnh án nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: XEM CHI TIẾT BỆNH ÁN (TIÊU CHUẨN) */}
      {activeModal === 'view' && currentRecord && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto animate-fadeIn print:hidden">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full my-8 flex flex-col overflow-hidden border border-gray-100">
            
            <div className="bg-[#004e92] p-6 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold bg-blue-800 text-blue-200 px-3 py-1 rounded-full border border-blue-700">
                  MÃ BỆNH ÁN: {currentRecord.id}
                </span>
                <h3 className="text-xl font-bold mt-2">Hồ sơ bệnh nhân: {currentRecord.patientName}</h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-white hover:text-blue-200 font-bold text-2xl p-2 focus:outline-none"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 flex-grow">
              {/* Thông tin hành chính */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-xs text-gray-500 block">Tuổi & Giới tính</span>
                  <strong className="text-gray-900">{currentRecord.age} tuổi ({currentRecord.gender})</strong>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Số điện thoại</span>
                  <strong className="text-gray-900">{currentRecord.phone}</strong>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Mã thẻ BHYT</span>
                  <strong className="text-gray-900 font-mono">{currentRecord.bhyt}</strong>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Ngày khám gần nhất</span>
                  <strong className="text-gray-900">{currentRecord.lastVisit}</strong>
                </div>
              </div>

              {/* Thông tin y khoa */}
              <div className="space-y-4">
                <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 space-y-2">
                  <div className="text-xs font-bold text-[#004e92] uppercase tracking-wider flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" /> Triệu chứng lâm sàng
                  </div>
                  <p className="text-gray-800 font-medium pl-6 border-l-2 border-[#004e92]">
                    {currentRecord.symptoms}
                  </p>
                </div>

                <div className="bg-green-50/50 p-5 rounded-2xl border border-green-100 space-y-2">
                  <div className="text-xs font-bold text-green-700 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" /> Chẩn đoán bệnh lý
                  </div>
                  <p className="text-gray-900 text-lg font-bold pl-6 border-l-2 border-green-500">
                    {currentRecord.diagnosis}
                  </p>
                </div>

                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-2">
                  <div className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" /> Phác đồ & Hướng dẫn điều trị
                  </div>
                  <p className="text-gray-700 italic pl-6 border-l-2 border-blue-500">
                    {currentRecord.treatment}
                  </p>
                </div>
              </div>

              {/* Thuốc */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 flex items-center gap-2 text-base border-b border-gray-100 pb-2">
                  <Pill className="w-5 h-5 text-[#004e92]" /> Đơn thuốc chỉ định ({currentRecord.medicines.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentRecord.medicines.map((med, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-lg">💊</div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{med.name}</div>
                        <div className="text-xs text-[#004e92] font-semibold bg-blue-50 px-2 py-0.5 rounded my-1 w-max border border-blue-100">
                          SL: {med.qty} {med.unit}
                        </div>
                        <div className="text-xs text-gray-500">{med.usage}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nhật ký cập nhật của Bác sĩ - Chỉ Admin xem được */}
              {user?.role === 'admin' && (currentRecord.updatedBy || currentRecord.updatedByRole) && (
                <div className="bg-red-50/50 p-5 rounded-2xl border border-red-100 space-y-2">
                  <div className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-2">
                    <ShieldPlus className="w-4 h-4 text-red-600" /> Nhật ký sửa đổi (Chỉ Admin xem được)
                  </div>
                  <div className="text-xs text-gray-700 pl-6 border-l-2 border-red-500 space-y-1">
                    <div>
                      Người cập nhật cuối cùng: <strong className="text-gray-900">{currentRecord.updatedBy || 'N/A'}</strong>
                    </div>
                    <div>
                      Vai trò tài khoản: <strong className="text-gray-900 capitalize">{currentRecord.updatedByRole || 'N/A'}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
              <button
                onClick={() => setActiveModal('prescription')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl transition-colors shadow-lg flex items-center gap-2 text-sm"
              >
                <Printer className="w-4 h-4" /> Mở Đơn Thuốc (Form Bộ Y Tế)
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-8 py-3 rounded-2xl transition-colors text-sm"
              >
                Đóng chi tiết
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: TẠO HOẶC CHỈNH SỬA BỆNH ÁN */}
      {(activeModal === 'new' || activeModal === 'edit') && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto animate-fadeIn print:hidden">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full my-8 flex flex-col overflow-hidden border border-gray-100">
            
            <div className="bg-[#004e92] p-6 text-white flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                {activeModal === 'new' ? (
                  <>
                    <Plus className="w-6 h-6 text-blue-300" /> Khởi tạo Hồ sơ Bệnh án Mới
                  </>
                ) : (
                  <>
                    <Pencil className="w-6 h-6 text-blue-300" /> Chỉnh sửa Hồ sơ Bệnh án
                  </>
                )}
              </h3>
              <button 
                onClick={() => { setActiveModal(null); setEditingRecordId(null); }}
                className="text-white hover:text-blue-200 font-bold text-2xl p-2 focus:outline-none"
              >
                ✕
              </button>
            </div>

             <form onSubmit={handleSaveRecordSubmit} className="p-6 space-y-6 flex-grow">
              
              {/* Chọn bệnh nhân từ hàng chờ - Ẩn khi đang chỉnh sửa */}
              {activeModal === 'new' ? (
                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 space-y-2">
                  <label className="block text-sm font-bold text-[#004e92] flex items-center gap-1.5">
                    <User className="w-4 h-4" /> Chọn bệnh nhân từ danh sách chờ khám *
                  </label>
                  {waitingList.length > 0 ? (
                    <select
                      required
                      value={selectedWaitingAppId}
                      onChange={(e) => {
                        const appId = e.target.value;
                        setSelectedWaitingAppId(appId);
                        const selectedApp = waitingList.find(app => app._id === appId);
                        if (selectedApp) {
                          setNewPatientName(selectedApp.name);
                          setNewAge(calculateAge(selectedApp.dob));
                          setNewGender(selectedApp.gender || 'Nam');
                          setNewPhone(selectedApp.phone);
                          setNewDept(selectedApp.dept);
                          setNewDoctor(selectedApp.doctor || 'BS. CKII Nguyễn Tuấn Lâm');
                          const hasBhyt = selectedApp.bhyt && selectedApp.bhyt.trim() !== '' && selectedApp.bhyt !== 'Không có';
                          setNewBhyt(hasBhyt ? 'Có bảo hiểm' : 'Không có bảo hiểm');
                        } else {
                          setNewPatientName('');
                          setNewAge(30);
                          setNewGender('Nam');
                          setNewPhone('');
                          setNewDept('Da liễu & Dị ứng');
                          setNewDoctor('BS. CKII Nguyễn Tuấn Lâm');
                          setNewBhyt('Không có bảo hiểm');
                        }
                      }}
                      className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92] font-bold text-[#004e92] cursor-pointer"
                    >
                      <option value="">-- Chọn bệnh nhân chờ khám --</option>
                      {waitingList.map(app => (
                        <option key={app._id} value={app._id}>
                          {app.name} ({app.phone}) - Khoa: {app.dept} (STT: {app.queueNumber})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-sm font-semibold text-gray-500 italic py-1">
                      Hàng chờ trống. Không có bệnh nhân nào đã đóng lệ phí khám và đang đợi bác sĩ.
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-800 block">CHẾ ĐỘ CHỈNH SỬA HỒ SƠ</span>
                    <strong className="text-sm text-gray-900">ID Bệnh án: {editingRecordId}</strong>
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 shadow-sm">
                    Đang chỉnh sửa
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên Bệnh nhân *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập họ và tên..."
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tuổi *</label>
                  <input
                    type="number"
                    required
                    placeholder="Nhập tuổi..."
                    value={newAge}
                    onChange={(e) => setNewAge(parseInt(e.target.value) || '')}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Giới tính</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] cursor-pointer"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cân nặng</label>
                  <input
                    type="text"
                    placeholder="58 kg"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Nhập số điện thoại..."
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ liên hệ</label>
                  <input
                    type="text"
                    placeholder="Nhập địa chỉ..."
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bảo hiểm y tế</label>
                  <select
                    value={newBhyt}
                    onChange={(e) => setNewBhyt(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] cursor-pointer"
                  >
                    <option value="Có bảo hiểm">Có bảo hiểm</option>
                    <option value="Không có bảo hiểm">Không có bảo hiểm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Chuyên khoa khám</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] cursor-pointer"
                  >
                    {departments.map((dept) => (
                      <option key={dept.slug} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bác sĩ phụ trách</label>
                  <input
                    type="text"
                    required
                    placeholder="Tên bác sĩ phụ trách..."
                    value={newDoctor}
                    onChange={(e) => setNewDoctor(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92]"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Triệu chứng lâm sàng *</label>
                  <textarea
                    required
                    rows="2"
                    placeholder="Bệnh nhân than phiền mẩn ngứa, đau đầu..."
                    value={newSymptoms}
                    onChange={(e) => setNewSymptoms(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92]"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Chẩn đoán bệnh lý *</label>
                  <input
                    type="text"
                    required
                    placeholder="Viêm da dị ứng tiếp xúc / Tăng huyết áp..."
                    value={newDiagnosis}
                    onChange={(e) => setNewDiagnosis(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] font-bold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phác đồ & Hướng dẫn điều trị</label>
                  <textarea
                    rows="2"
                    placeholder="Uống thuốc theo đơn, bôi kem đặc trị..."
                    value={newTreatment}
                    onChange={(e) => setNewTreatment(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92]"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Lời dặn của Bác sĩ (In lên Đơn thuốc)</label>
                  <textarea
                    rows="2"
                    value={newAdvice}
                    onChange={(e) => setNewAdvice(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92]"
                  ></textarea>
                </div>

                {/* Phần kê đơn thuốc từ kho dược phẩm thật */}
                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Pill className="w-5 h-5 text-purple-600" /> Kê đơn thuốc từ Kho dược phẩm
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 items-end">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-600 mb-1">Chọn thuốc trong kho</label>
                      <select
                        value={selectedMedId}
                        onChange={(e) => setSelectedMedId(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92] cursor-pointer"
                      >
                        <option value="">-- Chọn thuốc --</option>
                        {medicines.map(med => (
                          <option key={med._id} value={med._id} disabled={med.stock <= 0}>
                            {med.name} - {(med.price || 0).toLocaleString('vi-VN')} đ (Tồn: {med.stock} {med.unit || 'Viên'})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Số lượng</label>
                      <input
                        type="number"
                        min="1"
                        value={medQty}
                        onChange={(e) => setMedQty(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92]"
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={handleAddMedicine}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-xl transition-all text-sm shadow-sm"
                      >
                        + Thêm vào đơn
                      </button>
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block text-xs font-bold text-gray-600 mb-1">Hướng dẫn sử dụng / Liều lượng</label>
                      <input
                        type="text"
                        value={medUsage}
                        onChange={(e) => setMedUsage(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92]"
                        placeholder="Ví dụ: Uống ngày 2 lần sáng tối, mỗi lần 1 viên sau ăn"
                      />
                    </div>
                  </div>

                  {prescribedMedicines.length > 0 ? (
                    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white max-h-60 overflow-y-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700 font-bold text-xs uppercase sticky top-0">
                          <tr>
                            <th className="p-3">Tên thuốc</th>
                            <th className="p-3 text-center">SL</th>
                            <th className="p-3">Đơn vị</th>
                            <th className="p-3 text-right">Đơn giá</th>
                            <th className="p-3 text-right">Thành tiền</th>
                            <th className="p-3 text-center">Xóa</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {prescribedMedicines.map((med, index) => (
                            <tr key={index} className="hover:bg-gray-50/50">
                              <td className="p-3 font-semibold text-gray-900">{med.name}</td>
                              <td className="p-3 text-center font-bold">{med.qty}</td>
                              <td className="p-3">{med.unit}</td>
                              <td className="p-3 text-right font-mono">{(med.price || 0).toLocaleString('vi-VN')} đ</td>
                              <td className="p-3 text-right font-mono text-emerald-600 font-bold">{((med.price || 0) * med.qty).toLocaleString('vi-VN')} đ</td>
                              <td className="p-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMedicine(index)}
                                  className="text-red-500 hover:text-red-700 font-bold p-1"
                                >
                                  ✕
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center p-6 text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-sm">
                      Chưa có thuốc nào được kê trong đơn thuốc này.
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-4 -mx-6 -mb-6">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="bg-white hover:bg-gray-100 text-gray-700 font-bold px-6 py-3 rounded-2xl border border-gray-200 transition-colors shadow-sm text-sm"
                >
                  Hủy thao tác
                </button>
                <button
                  type="submit"
                  className="bg-[#004e92] hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-2xl transition-colors shadow-lg text-sm"
                >
                  {activeModal === 'new' ? 'Tạo Hồ sơ Bệnh án' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL 3: ĐƠN THUỐC CHUẨN FORM BỘ Y TẾ (ĐÃ SỬA FONT VÀ THIẾT KẾ UX CUỘN/THOÁT CHUẨN MỰC) */}
      {activeModal === 'prescription' && currentRecord && (
        <div 
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 z-[70] overflow-y-auto animate-fadeIn print:absolute print:inset-0 print:bg-white print:p-0"
        >
          {/* Nút tắt X to đùng nổi bần bật ngoài góc phải màn hình */}
          <button 
            onClick={() => setActiveModal(null)}
            className="fixed top-4 right-4 z-[80] bg-white text-gray-900 hover:bg-red-600 hover:text-white p-3 rounded-full shadow-2xl border border-gray-200 transition-all print:hidden flex items-center justify-center group"
            title="Đóng cửa sổ"
          >
            <X className="w-6 h-6 transform group-hover:rotate-90 transition-transform" />
          </button>

          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white text-gray-900 max-w-4xl w-full rounded-3xl shadow-2xl p-8 sm:p-12 border border-gray-200 my-8 sm:my-12 relative print:shadow-none print:border-none print:m-0 print:p-6 print:w-full font-sans"
          >
            {/* Thanh Control bar sticky nổi ngay trên đỉnh biểu mẫu */}
            <div className="sticky top-0 z-50 bg-gray-100/95 backdrop-blur-md p-4 rounded-2xl mb-8 print:hidden border border-gray-200 shadow-md flex flex-wrap items-center justify-between gap-4">
              <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Printer className="w-5 h-5 text-[#004e92]" /> Mẫu in Đơn Thuốc Chuẩn Cơ sở Y tế (A4)
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrintPrescription}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors shadow-md flex items-center gap-2 text-sm"
                >
                  <Printer className="w-4 h-4" /> In Đơn Thuốc
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" /> Đóng
                </button>
              </div>
            </div>

            {/* BẢNG BIỂU ĐƠN THUỐC CHÍNH (SỬ DỤNG FONT-SANS ĐẢM BẢO KHÔNG BAO GIỜ BỊ LỖI DẤU TIẾNG VIỆT) */}
            <div className="space-y-6 font-sans">
              
              {/* HEADER BIỂU MẪU */}
              <div className="flex justify-between items-start border-b-2 border-gray-800 pb-6">
                <div className="space-y-1">
                  <div className="font-bold text-base uppercase tracking-wider text-gray-800">BỘ Y TẾ</div>
                  <div className="font-bold text-lg uppercase tracking-wide text-[#004e92]">BỆNH VIỆN NHÂN DÂN</div>
                  <div className="text-xs font-semibold text-gray-700 italic">PK Yêu cầu {currentRecord.dept}</div>
                  <div className="text-xs text-gray-600">Điện thoại: 1900 6951</div>
                  
                  {/* Barcode Mockup */}
                  <div className="pt-2">
                    <div className="font-mono text-xl tracking-[0.25em] font-black select-none text-gray-800 scale-y-150 origin-left">
                      ||| | |||| | || | |||| ||
                    </div>
                    <div className="text-[10px] font-mono font-bold text-gray-700 mt-1">
                      {currentRecord.treatCode || '000000128400'}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 pt-1">Mã điều trị:</div>
                </div>

                <div className="text-right space-y-1 flex flex-col items-end">
                  <div className="w-14 h-14 rounded-full border-2 border-[#004e92] flex items-center justify-center text-[#004e92] font-bold mb-2 shadow-sm">
                    <ShieldPlus className="w-8 h-8" />
                  </div>
                  <div className="text-xs font-bold text-gray-800">
                    Mã BN: <span className="font-mono">{currentRecord.patientCode || '0029187302'}</span>
                  </div>
                  <div className="text-xs font-bold text-gray-800">
                    Mã y lệnh: <span className="font-mono">{currentRecord.orderCode || '000000432904'}</span>
                  </div>
                </div>
              </div>

              {/* TIÊU ĐỀ CHÍNH */}
              <div className="text-center py-4">
                <h1 className="text-3xl font-extrabold tracking-wider uppercase text-gray-900 font-sans">ĐƠN THUỐC</h1>
              </div>

              {/* THÔNG TIN HÀNH CHÍNH BỆNH NHÂN */}
              <div className="space-y-2 text-sm text-gray-900 border-b border-gray-300 pb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex-1 min-w-[240px]">
                    <span className="font-semibold">Họ và tên:</span> <strong className="font-bold uppercase text-base">{currentRecord.patientName}</strong>
                  </div>
                  <div className="flex items-center gap-6">
                    <div><span className="font-semibold">Tuổi:</span> <strong>{currentRecord.age}</strong></div>
                    <div><span className="font-semibold">Cân nặng:</span> <strong>{currentRecord.weight || '58 kg'}</strong></div>
                    <div><span className="font-semibold">Giới tính:</span> <strong>{currentRecord.gender}</strong></div>
                  </div>
                </div>
                <div>
                  <span className="font-semibold">Địa chỉ liên hệ:</span> <span className="italic">{currentRecord.address || 'Số 1 Nơ Trang Long, P. Gia Định, Hà Nội'}</span>
                </div>
                <div>
                  <span className="font-semibold">Chẩn đoán chính:</span> <strong className="text-base text-gray-900">{currentRecord.diagnosis}</strong>
                </div>
              </div>

              {/* DANH SÁCH THUỐC */}
              <div className="space-y-4 pt-2">
                <div className="font-bold text-base text-gray-900 underline underline-offset-4 mb-4">
                  Thuốc điều trị:
                </div>

                <div className="space-y-6">
                  {currentRecord.medicines.map((med, index) => (
                    <div key={index} className="flex items-start justify-between gap-6 text-sm">
                      <div className="space-y-1 flex-1">
                        <div className="font-bold text-gray-900 text-base font-sans">
                          {index + 1}. {med.name}
                        </div>
                        <div className="text-xs text-gray-700 italic pl-4 font-sans">
                          {med.usage}
                        </div>
                      </div>
                      <div className="font-bold text-base text-gray-900 flex items-center gap-6 flex-shrink-0 pt-1 font-sans">
                        <span className="w-16 text-right">X {med.qty}</span>
                        <span className="w-12 text-left">{med.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* LỜI DẶN BÁC SĨ */}
              <div className="pt-8 space-y-2 border-t border-gray-300">
                <div className="font-bold text-sm text-gray-900 underline underline-offset-2 font-sans">
                  Lời dặn bác sĩ:
                </div>
                <div className="text-sm text-gray-800 italic pl-6 leading-relaxed font-sans">
                  {currentRecord.advice || 'Đã tư vấn kỹ cho bệnh nhân về đơn thuốc và đơn tư vấn và bệnh nhân đồng ý sử dụng, khám lại sau 3 tuần.'}
                </div>
              </div>

              {/* PHẦN CHỮ KÝ PHÍA DƯỚI */}
              <div className="pt-12 flex justify-end items-start text-right pr-4">
                <div className="space-y-1 text-center w-64">
                  <div className="text-sm font-semibold text-gray-800 italic">
                    Hà Nội, Ngày 28 Tháng 06 Năm 2026
                  </div>
                  <div className="font-bold text-base text-gray-900 pt-1 font-sans">
                    Bác sĩ khám bệnh
                  </div>
                  {/* Mô phỏng chữ ký */}
                  <div className="py-6 font-mono text-2xl text-blue-800 font-bold select-none opacity-80 italic transform -rotate-12">
                    Tuấn Lâm
                  </div>
                  <div className="font-bold text-base text-gray-900 border-t border-gray-300 pt-2 font-sans">
                    {currentRecord.doctor}
                  </div>
                </div>
              </div>

            </div>

            {/* Thêm nút Đóng ở tận cùng phía dưới biểu mẫu để thao tác thuận tiện nhất */}
            <div className="mt-12 pt-6 border-t border-gray-200 flex justify-center print:hidden">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-8 py-3 rounded-xl transition-colors text-sm flex items-center gap-2 shadow-sm"
              >
                <X className="w-4 h-4" /> Đóng biểu mẫu Đơn thuốc
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Patients;
