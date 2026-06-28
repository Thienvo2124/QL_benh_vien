import { useState } from 'react';
import { FileText, Search, Plus, Eye, User, Calendar, Phone, Activity, Pill, Clock, CheckCircle, AlertCircle, Filter, FileSpreadsheet } from 'lucide-react';

const initialRecords = [
  {
    id: 'HS-2026-001',
    patientName: 'Nguyễn Văn A',
    age: 31,
    gender: 'Nam',
    phone: '0901234567',
    bhyt: 'DN4797931234567',
    lastVisit: '10/06/2026',
    dept: 'Nội tổng quát',
    doctor: 'BS. Nguyễn Văn A',
    symptoms: 'Đau đầu, ho khan kéo dài về đêm, người mệt mỏi.',
    diagnosis: 'Viêm họng cấp tính do virus, suy nhược cơ thể nhẹ.',
    treatment: 'Dùng thuốc kháng viêm, viên ngậm giảm ho, bổ sung Vitamin C và nghỉ ngơi nhiều.',
    status: 'Đang điều trị', // Đang điều trị, Đã khỏi, Theo dõi định kỳ
    medicines: [
      { name: 'Paracetamol 500mg', qty: '10 viên', usage: 'Uống 1 viên khi sốt trên 38.5 độ' },
      { name: 'Vitamin C 500mg', qty: '20 viên', usage: 'Uống 1 viên/ngày sau ăn sáng' },
      { name: 'Nước muối sinh lý 0.9%', qty: '1 chai', usage: 'Súc họng sáng và tối' }
    ]
  },
  {
    id: 'HS-2025-102',
    patientName: 'Trần Thị B',
    age: 45,
    gender: 'Nữ',
    phone: '0988777123',
    bhyt: 'HT3797939876543',
    lastVisit: '15/12/2025',
    dept: 'Tim mạch',
    doctor: 'BS. Trần Thị B',
    symptoms: 'Hồi hộp, thỉnh thoảng nhói tim khi làm việc nặng.',
    diagnosis: 'Huyết áp hơi cao do căng thẳng công việc (Stress).',
    treatment: 'Điều chỉnh chế độ ăn giảm mặn, không thức khuya, theo dõi chỉ số huyết áp hàng ngày.',
    status: 'Theo dõi định kỳ',
    medicines: [
      { name: 'Amlodipine 5mg', qty: '10 viên', usage: 'Uống 1 viên vào buổi sáng' }
    ]
  },
  {
    id: 'HS-2026-045',
    patientName: 'Lê Hoàng C',
    age: 28,
    gender: 'Nam',
    phone: '0912345678',
    bhyt: 'GD4797935555666',
    lastVisit: '25/05/2026',
    dept: 'Nha khoa',
    doctor: 'BS. Lê Trọng N',
    symptoms: 'Đau nhức răng hàm dưới bên phải, sưng mộng răng.',
    diagnosis: 'Viêm tủy răng R46, sâu răng mức độ 3.',
    treatment: 'Điều trị tủy, hàn composite phục hồi thân răng.',
    status: 'Đã khỏi',
    medicines: [
      { name: 'Ibuprofen 400mg', qty: '15 viên', usage: 'Uống 1 viên sau ăn khi đau' },
      { name: 'Amoxicillin 500mg', qty: '20 viên', usage: 'Uống 2 viên/ngày sáng tối' }
    ]
  },
  {
    id: 'HS-2026-089',
    patientName: 'Phạm Thị D',
    age: 52,
    gender: 'Nữ',
    phone: '0933444555',
    bhyt: 'DN4797931112223',
    lastVisit: '02/06/2026',
    dept: 'Cơ xương khớp',
    doctor: 'BS. Hoàng Tùng',
    symptoms: 'Đau khớp gối hai bên khi di chuyển lên xuống cầu thang.',
    diagnosis: 'Thoái hóa khớp gối giai đoạn 2.',
    treatment: 'Bổ sung chất sụn khớp, tập vật lý trị liệu nhẹ nhàng.',
    status: 'Đang điều trị',
    medicines: [
      { name: 'Glucosamine 1500mg', qty: '30 viên', usage: 'Uống 1 viên/ngày' }
    ]
  }
];

const Patients = () => {
  const [records, setRecords] = useState(initialRecords);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('Tất cả');
  
  // Modal state
  const [activeModal, setActiveModal] = useState(null); // 'view' or 'new' or null
  const [currentRecord, setCurrentRecord] = useState(null);

  // New record form state
  const [newPatientName, setNewPatientName] = useState('');
  const [newAge, setNewAge] = useState(30);
  const [newGender, setNewGender] = useState('Nam');
  const [newPhone, setNewPhone] = useState('');
  const [newBhyt, setNewBhyt] = useState('');
  const [newDept, setNewDept] = useState('Nội tổng quát');
  const [newDoctor, setNewDoctor] = useState('BS. Nguyễn Văn A');
  const [newSymptoms, setNewSymptoms] = useState('');
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newTreatment, setNewTreatment] = useState('');

  const [successMsg, setSuccessMsg] = useState('');

  const handleCreateRecord = (e) => {
    e.preventDefault();
    const newRecord = {
      id: `HS-2026-${Math.floor(100 + Math.random() * 899)}`,
      patientName: newPatientName,
      age: newAge,
      gender: newGender,
      phone: newPhone,
      bhyt: newBhyt || 'CHƯA CẬP NHẬT',
      lastVisit: '28/06/2026',
      dept: newDept,
      doctor: newDoctor,
      symptoms: newSymptoms,
      diagnosis: newDiagnosis,
      treatment: newTreatment,
      status: 'Đang điều trị',
      medicines: [
        { name: 'Thuốc điều trị theo phác đồ', qty: 'Theo đơn', usage: 'Tuân thủ chỉ định của bác sĩ' }
      ]
    };

    setRecords([newRecord, ...records]);
    setActiveModal(null);
    setSuccessMsg(`Đã khởi tạo thành công Hồ sơ bệnh án mới (${newRecord.id}) cho bệnh nhân ${newPatientName}!`);
    setTimeout(() => setSuccessMsg(''), 5000);

    // Reset form
    setNewPatientName('');
    setNewPhone('');
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

  return (
    <div className="p-8 space-y-8 font-sans bg-gray-50/50 min-h-screen">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-wide flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#004e92]" /> Quản lý Hồ sơ Bệnh án & Bệnh nhân
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Tra cứu, cập nhật bệnh sử, theo dõi phác đồ điều trị và quản lý hồ sơ sức khỏe điện tử của bệnh nhân.
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
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl text-sm font-semibold flex items-center gap-3 shadow-sm">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
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
            <option value="Nội tổng quát">Nội tổng quát</option>
            <option value="Tim mạch">Tim mạch</option>
            <option value="Nha khoa">Nha khoa</option>
            <option value="Cơ xương khớp">Cơ xương khớp</option>
          </select>
        </div>
      </div>

      {/* Table of Records */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-5 font-medium w-32">Mã Bệnh án</th>
                <th className="p-5 font-medium">Bệnh nhân & Định danh</th>
                <th className="p-5 font-medium">Chuyên khoa / Bác sĩ</th>
                <th className="p-5 font-medium">Chẩn đoán sơ bộ</th>
                <th className="p-5 font-medium w-36 text-center">Trạng thái</th>
                <th className="p-5 font-medium w-28 text-center">Thao tác</th>
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
                      <button
                        onClick={() => { setCurrentRecord(rec); setActiveModal('view'); }}
                        className="p-2.5 bg-blue-50 hover:bg-[#004e92] text-[#004e92] hover:text-white rounded-xl transition-all shadow-sm group"
                        title="Xem chi tiết Bệnh án"
                      >
                        <Eye className="w-4 h-4 transform group-hover:scale-110 transition-transform" />
                      </button>
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
          <span className="text-[#004e92] font-semibold">Cập nhật lúc: 19:20 - 28/06/2026</span>
        </div>
      </div>

      {/* MODAL 1: XEM CHI TIẾT BỆNH ÁN */}
      {activeModal === 'view' && currentRecord && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
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
                          SL: {med.qty}
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
                onClick={() => alert('Đang xuất Bệnh án ra file PDF...')}
                className="bg-white hover:bg-gray-100 text-gray-700 font-bold px-6 py-3 rounded-2xl border border-gray-200 transition-colors shadow-sm text-sm"
              >
                In Bệnh án (PDF)
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="bg-[#004e92] hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-2xl transition-colors shadow-lg text-sm"
              >
                Đóng chi tiết
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: TẠO BỆNH ÁN MỚI */}
      {activeModal === 'new' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
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
                    <option value="Nội tổng quát">Nội tổng quát</option>
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
                    placeholder="Bệnh nhân than phiền đau đầu, chóng mặt..."
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
                    placeholder="Viêm họng cấp / Tăng huyết áp..."
                    value={newDiagnosis}
                    onChange={(e) => setNewDiagnosis(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] font-bold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phác đồ & Hướng dẫn điều trị</label>
                  <textarea
                    rows="2"
                    placeholder="Uống thuốc theo đơn, nghỉ ngơi, kiêng đồ ăn mặn..."
                    value={newTreatment}
                    onChange={(e) => setNewTreatment(e.target.value)}
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

    </div>
  );
};

export default Patients;
