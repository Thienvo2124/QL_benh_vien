import { useState, useContext } from 'react';
import { FileText, Calendar, Clock, User, Pill, CheckCircle, Search, Award } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const sampleRecords = [
  {
    id: 'HS-2026-001',
    date: '10/06/2026',
    dept: 'Nội tổng quát',
    doctor: 'BS. Nguyễn Văn A',
    symptoms: 'Đau đầu, ho khan kéo dài về đêm, người mệt mỏi.',
    diagnosis: 'Viêm họng cấp tính do virus, suy nhược cơ thể nhẹ.',
    treatment: 'Dùng thuốc kháng viêm, viên ngậm giảm ho, bổ sung Vitamin C và nghỉ ngơi nhiều.',
    medicines: [
      { name: 'Paracetamol 500mg', qty: '10 viên', usage: 'Uống 1 viên khi sốt trên 38.5 độ' },
      { name: 'Vitamin C 500mg', qty: '20 viên', usage: 'Uống 1 viên/ngày sau ăn sáng' },
      { name: 'Nước muối sinh lý 0.9%', qty: '1 chai', usage: 'Súc họng sáng và tối' }
    ]
  },
  {
    id: 'HS-2025-102',
    date: '15/12/2025',
    dept: 'Tim mạch',
    doctor: 'BS. Trần Thị B',
    symptoms: 'Hồi hộp, thỉnh thoảng nhói tim khi làm việc nặng.',
    diagnosis: 'Huyết áp hơi cao do căng thẳng công việc (Stress).',
    treatment: 'Điều chỉnh chế độ ăn giảm mặn, không thức khuya, theo dõi chỉ số huyết áp hàng ngày.',
    medicines: [
      { name: 'Amlodipine 5mg', qty: '10 viên', usage: 'Uống 1 viên vào buổi sáng' }
    ]
  }
];

const MyRecords = () => {
  const { user } = useContext(AuthContext);
  const [selectedRecord, setSelectedRecord] = useState(sampleRecords[0]);
  const [search, setSearch] = useState('');

  const filteredRecords = sampleRecords.filter(rec => 
    rec.dept.toLowerCase().includes(search.toLowerCase()) || 
    rec.doctor.toLowerCase().includes(search.toLowerCase()) ||
    rec.diagnosis.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      
      {/* Banner */}
      <div className="bg-[#004e92] text-white py-12 px-4 sm:px-8 shadow-inner">
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
      <main className="flex-grow container mx-auto max-w-6xl px-4 py-10">
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
                              Số lượng: {med.qty}
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
                    onClick={() => alert('Đang tạo file PDF Đơn thuốc...')}
                    className="bg-[#004e92] hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-2xl transition-colors shadow-lg flex items-center gap-2 text-sm"
                  >
                    <FileText className="w-4 h-4" /> Xuất Đơn thuốc (PDF)
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl text-center text-gray-50- border border-gray-100 shadow-sm">
                Chọn một hồ sơ bệnh án bên trái để xem chi tiết.
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyRecords;
