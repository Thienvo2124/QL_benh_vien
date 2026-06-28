import { useState, useContext } from 'react';
import { FileText, Calendar, Clock, User, Pill, CheckCircle, Search, Award, Printer, ShieldPlus, X } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const sampleRecords = [
  {
    id: 'HS-2026-001',
    patientName: 'Nguyễn Văn A',
    age: 31,
    gender: 'Nam',
    weight: '62 kg',
    address: 'Số 1 Nơ Trang Long, P. Gia Định, Hà Nội',
    date: '28/06/2026',
    dept: 'Da liễu & Dị ứng',
    doctor: 'BS. CKII Nguyễn Tuấn Lâm',
    symptoms: 'Mẩn ngứa quanh cổ và cánh tay, xuất hiện nhiều về đêm, da khô đỏ.',
    diagnosis: 'Viêm da dị ứng tiếp xúc / Mề đay mãn tính.',
    treatment: 'Dùng thuốc kháng histamin giảm ngứa, bôi kem đặc trị tại chỗ và kiêng xà phòng mạnh.',
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
    patientName: 'Nguyễn Văn A',
    age: 31,
    gender: 'Nam',
    weight: '60 kg',
    address: 'Số 1 Nơ Trang Long, P. Gia Định, Hà Nội',
    date: '15/12/2025',
    dept: 'Tim mạch',
    doctor: 'BS. Trần Thị B',
    symptoms: 'Hồi hộp, thỉnh thoảng nhói tim khi làm việc nặng.',
    diagnosis: 'Huyết áp hơi cao do căng thẳng công việc (Stress).',
    treatment: 'Điều chỉnh chế độ ăn giảm mặn, không thức khuya, theo dõi chỉ số huyết áp hàng ngày.',
    patientCode: '0029187302',
    orderCode: '000000432888',
    treatCode: '000000128555',
    medicines: [
      { name: 'Amlodipine 5mg (Amlor 5mg)', qty: '30', unit: 'Viên', usage: 'Uống 1 viên vào buổi sáng sau ăn' },
      { name: 'Magnesium B6 (Magnerot 500mg)', qty: '60', unit: 'Viên', usage: 'Uống ngày 2 lần sáng tối, mỗi lần 1 viên' }
    ],
    advice: 'Kiểm tra huyết áp đều đặn mỗi sáng, hạn chế ăn mặn và tập thể dục nhẹ nhàng 30 phút mỗi ngày.'
  }
];

const MyRecords = () => {
  const { user } = useContext(AuthContext);
  const [selectedRecord, setSelectedRecord] = useState(sampleRecords[0]);
  const [search, setSearch] = useState('');
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

  const filteredRecords = sampleRecords.filter(rec => 
    rec.dept.toLowerCase().includes(search.toLowerCase()) || 
    rec.doctor.toLowerCase().includes(search.toLowerCase()) ||
    rec.diagnosis.toLowerCase().includes(search.toLowerCase())
  );

  const handlePrintPrescription = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      
      {/* Banner */}
      <div className="bg-[#004e92] text-white py-12 px-4 sm:px-8 shadow-inner print:hidden">
        <div className="container mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-wide uppercase flex items-center gap-3">
              <FileText className="w-9 h-9 text-green-300" /> Hồ sơ bệnh án & Đơn thuốc
            </h1>
            <p className="text-blue-100 text-base mt-2 max-w-xl">
              Lưu trữ an toàn lịch sử khám chữa bệnh, chẩn đoán của bác sĩ và các đơn thuốc điện tử của bạn.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-400 text-white flex items-center justify-center font-bold text-xl shadow-lg">
              {user?.fullName?.charAt(0) || 'BN'}
            </div>
            <div>
              <div className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Chủ hồ sơ</div>
              <div className="text-lg font-bold text-white">{user?.fullName || 'Tài khoản Bệnh nhân'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto max-w-6xl px-4 py-10 print:hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cột trái: Danh sách bệnh án */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm chuyên khoa, bác sĩ..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredRecords.map(rec => {
                const isSelected = selectedRecord?.id === rec.id;
                return (
                  <div
                    key={rec.id}
                    onClick={() => setSelectedRecord(rec)}
                    className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                      isSelected 
                        ? 'bg-blue-50/80 border-[#004e92] shadow-md transform -translate-y-0.5' 
                        : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#004e92] bg-white border border-blue-200 px-2 py-0.5 rounded shadow-sm">
                        {rec.id}
                      </span>
                      <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" /> {rec.date}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base">{rec.dept}</h3>
                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                      <User className="w-3.5 h-3.5 text-gray-400" /> {rec.doctor}
                    </p>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span>Thuốc: <strong>{rec.medicines.length} loại</strong></span>
                      <span className="text-green-600 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Đã hoàn thành
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cột phải: Chi tiết bệnh án & Đơn thuốc */}
          <div className="lg:col-span-2">
            {selectedRecord ? (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-[#004e92] p-6 sm:p-8 text-white flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase font-bold text-blue-200 bg-blue-800 px-3 py-1 rounded-full border border-blue-700">
                      Mã bệnh án: {selectedRecord.id}
                    </span>
                    <h2 className="text-2xl font-bold mt-2">Chi tiết Bệnh án - {selectedRecord.dept}</h2>
                    <p className="text-sm text-blue-100 mt-1 flex items-center gap-4">
                      <span>Ngày khám: <strong>{selectedRecord.date}</strong></span>
                      <span>Bác sĩ: <strong>{selectedRecord.doctor}</strong></span>
                    </p>
                  </div>
                  <Award className="w-12 h-12 text-blue-300 opacity-80 hidden sm:block" />
                </div>

                <div className="p-6 sm:p-8 space-y-8">
                  {/* Triệu chứng */}
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#004e92]" /> Triệu chứng bệnh nhân than phiền
                    </div>
                    <p className="text-gray-800 text-base font-medium pl-6 border-l-2 border-[#004e92]">
                      {selectedRecord.symptoms}
                    </p>
                  </div>

                  {/* Chuẩn đoán */}
                  <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-100 space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#004e92] flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" /> Kết luận chẩn đoán của bác sĩ
                    </div>
                    <p className="text-gray-900 text-lg font-bold pl-6 border-l-2 border-green-500">
                      {selectedRecord.diagnosis}
                    </p>
                  </div>

                  {/* Hướng điều trị */}
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-600" /> Hướng dẫn điều trị & Lời khuyên
                    </div>
                    <p className="text-gray-700 text-base italic pl-6 border-l-2 border-yellow-500">
                      {selectedRecord.treatment}
                    </p>
                  </div>

                  {/* Danh sách đơn thuốc */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                      <Pill className="w-6 h-6 text-[#004e92]" /> Danh sách Thuốc được kê ({selectedRecord.medicines.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedRecord.medicines.map((med, i) => (
                        <div key={i} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow transition-shadow flex gap-4 items-center">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#004e92] flex items-center justify-center font-bold text-xl border border-blue-100 flex-shrink-0">
                            💊
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-base">{med.name}</h4>
                            <div className="text-xs text-[#004e92] font-bold bg-blue-50 px-2 py-0.5 rounded w-max my-1 border border-blue-100">
                              Số lượng: {med.qty} {med.unit}
                            </div>
                            <p className="text-xs text-gray-500 font-medium">{med.usage}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
                  <button 
                    onClick={() => setIsPrescriptionModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-2xl transition-colors shadow-lg flex items-center gap-2 text-sm"
                  >
                    <Printer className="w-4 h-4" /> Xuất Đơn thuốc (PDF Bộ Y Tế)
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl text-center text-gray-500 border border-gray-100 shadow-sm">
                Chọn một hồ sơ bệnh án bên trái để xem chi tiết.
              </div>
            )}
          </div>

        </div>
      </main>

      {/* MODAL ĐƠN THUỐC CHUẨN FORM BỘ Y TẾ (ĐÃ SỬA FONT VÀ THIẾT KẾ UX CUỘN/THOÁT CHUẨN MỰC) */}
      {isPrescriptionModalOpen && selectedRecord && (
        <div 
          onClick={() => setIsPrescriptionModalOpen(false)}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 z-[70] overflow-y-auto animate-fadeIn print:absolute print:inset-0 print:bg-white print:p-0"
        >
          {/* Nút tắt X to đùng nổi bần bật ngoài góc phải màn hình */}
          <button 
            onClick={() => setIsPrescriptionModalOpen(false)}
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
                  onClick={() => setIsPrescriptionModalOpen(false)}
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
                  <div className="text-xs font-semibold text-gray-700 italic">PK Yêu cầu {selectedRecord.dept}</div>
                  <div className="text-xs text-gray-600">Điện thoại: 1900 6951</div>
                  
                  {/* Barcode Mockup */}
                  <div className="pt-2">
                    <div className="font-mono text-xl tracking-[0.25em] font-black select-none text-gray-800 scale-y-150 origin-left">
                      ||| | |||| | || | |||| ||
                    </div>
                    <div className="text-[10px] font-mono font-bold text-gray-700 mt-1">
                      {selectedRecord.treatCode || '000000128400'}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 pt-1">Mã điều trị:</div>
                </div>

                <div className="text-right space-y-1 flex flex-col items-end">
                  <div className="w-14 h-14 rounded-full border-2 border-[#004e92] flex items-center justify-center text-[#004e92] font-bold mb-2 shadow-sm">
                    <ShieldPlus className="w-8 h-8" />
                  </div>
                  <div className="text-xs font-bold text-gray-800">
                    Mã BN: <span className="font-mono">{selectedRecord.patientCode || '0029187302'}</span>
                  </div>
                  <div className="text-xs font-bold text-gray-800">
                    Mã y lệnh: <span className="font-mono">{selectedRecord.orderCode || '000000432904'}</span>
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
                    <span className="font-semibold">Họ và tên:</span> <strong className="font-bold uppercase text-base">{selectedRecord.patientName}</strong>
                  </div>
                  <div className="flex items-center gap-6">
                    <div><span className="font-semibold">Tuổi:</span> <strong>{selectedRecord.age}</strong></div>
                    <div><span className="font-semibold">Cân nặng:</span> <strong>{selectedRecord.weight || '58 kg'}</strong></div>
                    <div><span className="font-semibold">Giới tính:</span> <strong>{selectedRecord.gender}</strong></div>
                  </div>
                </div>
                <div>
                  <span className="font-semibold">Địa chỉ liên hệ:</span> <span className="italic">{selectedRecord.address || 'Số 1 Nơ Trang Long, P. Gia Định, Hà Nội'}</span>
                </div>
                <div>
                  <span className="font-semibold">Chẩn đoán chính:</span> <strong className="text-base text-gray-900">{selectedRecord.diagnosis}</strong>
                </div>
              </div>

              {/* DANH SÁCH THUỐC */}
              <div className="space-y-4 pt-2">
                <div className="font-bold text-base text-gray-900 underline underline-offset-4 mb-4">
                  Thuốc điều trị:
                </div>

                <div className="space-y-6">
                  {selectedRecord.medicines.map((med, index) => (
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
                  {selectedRecord.advice || 'Đã tư vấn kỹ cho bệnh nhân về đơn thuốc và đơn tư vấn và bệnh nhân đồng ý sử dụng, khám lại sau 3 tuần.'}
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
                    {selectedRecord.doctor}
                  </div>
                </div>
              </div>

            </div>

            {/* Thêm nút Đóng ở tận cùng phía dưới biểu mẫu để thao tác thuận tiện nhất */}
            <div className="mt-12 pt-6 border-t border-gray-200 flex justify-center print:hidden">
              <button
                onClick={() => setIsPrescriptionModalOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-8 py-3 rounded-xl transition-colors text-sm flex items-center gap-2 shadow-sm"
              >
                <X className="w-4 h-4" /> Đóng biểu mẫu Đơn thuốc
              </button>
            </div>

          </div>
        </div>
      )}

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
};

export default MyRecords;
