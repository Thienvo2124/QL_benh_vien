import { useState } from 'react';
import { FileText, Search, Plus, Eye, User, Calendar, Phone, Activity, Pill, Clock, CheckCircle, AlertCircle, Filter, FileSpreadsheet, Printer, ShieldPlus } from 'lucide-react';

const initialRecords = [
  {
    id: 'HS-2026-001',
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
      { name: 'Cetirizine 10mg (Cetimed 10mg)', qty: '20', unit: 'Viên', usage: 'uống tối 1 viên sau ăn' },
      { name: 'Hightamine 5.0mg + 25mg... (Vitamin A+D2+B1+B2+PP+B6+B12+C+E + B5 + acid folic)', qty: '40', unit: 'Viên', usage: 'uống ngày 2 lần sáng chiều mỗi lần 1 viên' },
      { name: 'Kẽm (dưới dạng kẽm gluconat 10mg) (Conipa pure 10ml)', qty: '20', unit: 'Ống', usage: 'uống sáng 1 ống' },
      { name: 'Mometason furoat 0.1% (Locgoda 0.1% 15g)', qty: '02', unit: 'Tuýp', usage: 'bôi chỗ ngứa ngày 2 lần sáng chiều, bôi mỏng trong 7-10 ngày' }
    ],
    advice: 'đã tư vấn kỹ cho bệnh nhân về đơn thuốc và đơn tư vấn và bệnh nhân đồng ý sử dụng, khám lại sau 3 tuần.'
  },
  {
    id: 'HS-2025-102',
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
      { name: 'Amlodipine 5mg (Amlor 5mg)', qty: '30', unit: 'Viên', usage: 'uống 1 viên vào buổi sáng sau ăn' },
      { name: 'Magnesium B6 (Magnerot 500mg)', qty: '60', unit: 'Viên', usage: 'uống ngày 2 lần sáng tối, mỗi lần 1 viên' }
    ],
    advice: 'Kiểm tra huyết áp đều đặn mỗi sáng, hạn chế ăn mặn và tập thể dục nhẹ nhàng 30 phút mỗi ngày.'
  },
  {
    id: 'HS-2026-045',
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
      { name: 'Ibuprofen 400mg', qty: '15', unit: 'Viên', usage: 'uống 1 viên sau ăn khi đau nhức nhiều' },
      { name: 'Amoxicillin 500mg (Curam 500mg)', qty: '20', unit: 'Viên', usage: 'uống 2 viên/ngày chia 2 lần sáng tối' }
    ],
    advice: 'Vệ sinh răng miệng sạch sẽ sau bữa ăn, sử dụng chỉ nha khoa và nước súc miệng sinh lý.'
  }
];

const Patients = () => {
  const [records, setRecords] = useState(initialRecords);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('Tất cả');
  
  // Modal state
  const [activeModal, setActiveModal] = useState(null); // 'view', 'new', 'prescription', or null
  const [currentRecord, setCurrentRecord] = useState(null);

  // New record form state
  const [newPatientName, setNewPatientName] = useState('');
  const [newAge, setNewAge] = useState(30);
  const [newGender, setNewGender] = useState('Nam');
  const [newWeight, setNewWeight] = useState('60 kg');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newBhyt, setNewBhyt] = useState('');
  const [newDept, setNewDept] = useState('Da liễu & Dị ứng');
  const [newDoctor, setNewDoctor] = useState('BS. CKII Nguyễn Tuấn Lâm');
  const [newSymptoms, setNewSymptoms] = useState('');
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newTreatment, setNewTreatment] = useState('');
  const [newAdvice, setNewAdvice] = useState('đã tư vấn kỹ cho bệnh nhân về đơn thuốc và đơn tư vấn và bệnh nhân đồng ý sử dụng, khám lại sau 3 tuần.');

  const [successMsg, setSuccessMsg] = useState('');

  const handleCreateRecord = (e) => {
    e.preventDefault();
    const randId = Math.floor(100 + Math.random() * 899);
    const newRecord = {
      id: `HS-2026-${randId}`,
      patientName: newPatientName,
      age: newAge,
      gender: newGender,
      weight: newWeight,
      phone: newPhone,
      address: newAddress || 'Hà Nội',
      bhyt: newBhyt || 'DN4797931234567',
      lastVisit: '28/06/2026',
      dept: newDept,
      doctor: newDoctor,
      symptoms: newSymptoms,
      diagnosis: newDiagnosis,
      treatment: newTreatment,
      status: 'Đang điều trị',
      patientCode: `002918${randId}1`,
      orderCode: `00000043${randId}`,
      treatCode: `00000012${randId}`,
      medicines: [
        { name: 'Cetirizine 10mg (Cetimed 10mg)', qty: '20', unit: 'Viên', usage: 'uống tối 1 viên sau ăn' },
        { name: 'Hightamine 5.0mg + 25mg... (Vitamin A+D2+B1+B2+PP+B6+B12+C+E + B5 + acid folic)', qty: '40', unit: 'Viên', usage: 'uống ngày 2 lần sáng chiều mỗi lần 1 viên' },
        { name: 'Kẽm (dưới dạng kẽm gluconat 10mg) (Conipa pure 10ml)', qty: '20', unit: 'Ống', usage: 'uống sáng 1 ống' },
        { name: 'Mometason furoat 0.1% (Locgoda 0.1% 15g)', qty: '02', unit: 'Tuýp', usage: 'bôi chỗ ngứa ngày 2 lần sáng chiều, bôi mỏng trong 7-10 ngày' }
      ],
      advice: newAdvice
    };

    setRecords([newRecord, ...records]);
    setActiveModal(null);
    setSuccessMsg(`Đã khởi tạo thành công Hồ sơ bệnh án mới (${newRecord.id}) cho bệnh nhân ${newPatientName}!`);
    setTimeout(() => setSuccessMsg(''), 5000);

    // Reset form
    setNewPatientName('');
    setNewPhone('');
    setNewAddress('');
    setNewBhyt('');
    setNewSymptoms('');
    setNewDiagnosis('');
    setNewTreatment('');
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

  return (
    <div className="p-8 space-y-8 font-sans bg-gray-50/50 min-h-screen">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-6 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-wide flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#004e92]" /> Quản lý Hồ sơ Bệnh án & Đơn thuốc
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Tra cứu bệnh án điện tử và hỗ trợ in Đơn thuốc theo đúng chuẩn mẫu biểu Bộ Y Tế quy định.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => alert('Đang xuất toàn bộ CSDL Bệnh án ra file Excel...')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-5 py-3 rounded-2xl transition-colors shadow-sm flex items-center gap-2 text-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-green-600" /> Xuất dữ liệu (Excel)
          </button>
          <button
            onClick={() => setActiveModal('new')}
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
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#004e92]"
          >
            <option value="Tất cả">Tất cả chuyên khoa</option>
            <option value="Da liễu & Dị ứng">Da liễu & Dị ứng</option>
            <option value="Tim mạch">Tim mạch</option>
            <option value="Nha khoa">Nha khoa</option>
            <option value="Cơ xương khớp">Cơ xương khớp</option>
          </select>
        </div>
      </div>

      {/* Table of Records */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden print:hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-5 font-medium w-32">Mã Bệnh án</th>
                <th className="p-5 font-medium">Bệnh nhân & Định danh</th>
                <th className="p-5 font-medium">Chuyên khoa / Bác sĩ</th>
                <th className="p-5 font-medium">Chẩn đoán sơ bộ</th>
                <th className="p-5 font-medium w-36 text-center">Trạng thái</th>
                <th className="p-5 font-medium w-36 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-blue-50/20 transition-colors">
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
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border inline-block shadow-sm ${
                        rec.status === 'Đang điều trị'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : rec.status === 'Đã khỏi'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {rec.status}
                      </span>
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
        
        <div className="p-5 bg-gray-50/80 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
          <span>Tổng số: <strong>{filteredRecords.length} hồ sơ bệnh án</strong> trong hệ thống.</span>
          <span className="text-[#004e92] font-semibold">Cập nhật lúc: 19:35 - 28/06/2026</span>
        </div>
      </div>

      {/* MODAL 1: XEM CHI TIẾT BỆNH ÁN (TIÊU CHUẨN) */}
      {activeModal === 'view' && currentRecord && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn print:hidden">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
            
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

            <div className="p-6 overflow-y-auto space-y-6 flex-grow">
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

      {/* MODAL 2: TẠO BỆNH ÁN MỚI */}
      {activeModal === 'new' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn print:hidden">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
            
            <div className="bg-[#004e92] p-6 text-white flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Plus className="w-6 h-6 text-blue-300" /> Khởi tạo Hồ sơ Bệnh án Mới
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-white hover:text-blue-200 font-bold text-2xl p-2 focus:outline-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="p-6 overflow-y-auto space-y-6 flex-grow">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên Bệnh nhân *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập họ và tên đầy đủ..."
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
                    min="1"
                    max="120"
                    value={newAge}
                    onChange={(e) => setNewAge(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Giới tính</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92]"
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
                    placeholder="0901234567"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ liên hệ</label>
                  <input
                    type="text"
                    placeholder="Số 1 Nơ Trang Long, P. Gia Định, Hà Nội..."
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mã thẻ BHYT</label>
                  <input
                    type="text"
                    placeholder="DN47979..."
                    value={newBhyt}
                    onChange={(e) => setNewBhyt(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Chuyên khoa khám</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92]"
                  >
                    <option value="Da liễu & Dị ứng">Da liễu & Dị ứng</option>
                    <option value="Tim mạch">Tim mạch</option>
                    <option value="Nha khoa">Nha khoa</option>
                    <option value="Cơ xương khớp">Cơ xương khớp</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bác sĩ phụ trách</label>
                  <input
                    type="text"
                    required
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
                  Tạo Hồ sơ Bệnh án
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL 3: ĐƠN THUỐC CHUẨN FORM BỘ Y TẾ (SIÊU ĐỈNH - ĐƯỢC THIẾT KẾ ĐỂ IN A4) */}
      {activeModal === 'prescription' && currentRecord && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn print:absolute print:inset-0 print:bg-white print:p-0">
          
          <div className="bg-white text-gray-900 max-w-4xl w-full rounded-2xl shadow-2xl p-8 sm:p-12 border border-gray-200 my-8 relative print:shadow-none print:border-none print:m-0 print:p-6 print:w-full">
            
            {/* Control bar (bị ẩn khi in) */}
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-xl mb-8 print:hidden border border-gray-200">
              <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
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
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold px-4 py-2.5 rounded-xl transition-colors text-sm"
                >
                  Đóng
                </button>
              </div>
            </div>

            {/* BẢNG BIỂU ĐƠN THUỐC CHÍNH */}
            <div className="space-y-6 font-serif">
              
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
                <h1 className="text-3xl font-bold tracking-wider uppercase text-gray-900">ĐƠN THUỐC</h1>
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
                        <div className="font-bold text-gray-900 text-base">
                          {index + 1}. {med.name}
                        </div>
                        <div className="text-xs text-gray-700 italic pl-4">
                          {med.usage}
                        </div>
                      </div>
                      <div className="font-bold text-base text-gray-900 flex items-center gap-6 flex-shrink-0 pt-1">
                        <span className="w-16 text-right">X {med.qty}</span>
                        <span className="w-12 text-left">{med.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* LỜI DẶN BÁC SĨ */}
              <div className="pt-8 space-y-2 border-t border-gray-300">
                <div className="font-bold text-sm text-gray-900 underline underline-offset-2">
                  Lời dặn bác sĩ:
                </div>
                <div className="text-sm text-gray-800 italic pl-6 leading-relaxed">
                  {currentRecord.advice || 'đã tư vấn kỹ cho bệnh nhân về đơn thuốc và đơn tư vấn và bệnh nhân đồng ý sử dụng, khám lại sau 3 tuần.'}
                </div>
              </div>

              {/* PHẦN CHỮ KÝ PHÍA DƯỚI */}
              <div className="pt-12 flex justify-end items-start text-right pr-4">
                <div className="space-y-1 text-center w-64">
                  <div className="text-sm font-semibold text-gray-800 italic">
                    Hà Nội, Ngày 28 Tháng 06 Năm 2026
                  </div>
                  <div className="font-bold text-base text-gray-900 pt-1">
                    Bác sĩ khám bệnh
                  </div>
                  {/* Mô phỏng chữ ký */}
                  <div className="py-6 font-mono text-2xl text-blue-800 font-bold select-none opacity-80 italic transform -rotate-12">
                    Tuấn Lâm
                  </div>
                  <div className="font-bold text-base text-gray-900 border-t border-gray-300 pt-2">
                    {currentRecord.doctor}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Patients;
