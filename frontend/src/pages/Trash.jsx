import { useState, useEffect, useCallback } from 'react';
import { Trash2, Search, RotateCcw, Phone, Calendar, Pill, FileText, Activity } from 'lucide-react';
import API_BASE_URL from '../config/api';

const Trash = () => {
  const [deletedRecords, setDeletedRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState('');

  // Tải danh sách lịch hẹn trong thùng rác
  const fetchTrash = useCallback(async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/appointments/trash`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDeletedRecords(data);
      }
    } catch (error) {
      console.error("Lỗi khi tải thùng rác:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrash();
  }, [fetchTrash]);

  // Khôi phục ca khám
  const handleRestore = async (id, patientName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn KHÔI PHỤC hồ sơ bệnh án / lịch hẹn của bệnh nhân ${patientName}?`)) {
      return;
    }
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/appointments/${id}/restore`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setNotification(`✅ Đã khôi phục thành công hồ sơ của bệnh nhân ${patientName}!`);
        fetchTrash();
        setTimeout(() => setNotification(''), 3000);
      } else {
        const data = await response.json();
        alert(data.message || "Lỗi khi khôi phục hồ sơ.");
      }
    } catch (error) {
      console.error("Lỗi khi khôi phục:", error);
      alert("Lỗi kết nối máy chủ.");
    }
  };

  // Lọc tìm kiếm
  const filteredRecords = deletedRecords.filter(rec => {
    if (!rec) return false;
    const name = rec.name || '';
    const phone = rec.phone || '';
    const code = rec.appointmentCode || '';
    const query = searchQuery.toLowerCase();
    return name.toLowerCase().includes(query) || phone.includes(query) || code.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <Trash2 className="w-8 h-8 text-[#004e92]" /> Thùng rác hệ thống
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Nơi tập hợp các hồ sơ bệnh án, lịch hẹn và đơn thuốc đã bị xóa. Chỉ có nút khôi phục và không hỗ trợ xóa vĩnh viễn nhằm tránh thất lạc dữ liệu.
          </p>
        </div>
      </div>

      {/* NOTIFICATION MESSAGE */}
      {notification && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl text-sm font-semibold flex items-center gap-3 shadow-sm">
          <span className="flex-shrink-0">🔔</span>
          {notification}
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[280px] max-w-md">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm hồ sơ đã xóa (Tên, SĐT, Mã hồ sơ...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors font-medium"
          />
        </div>
        <div className="text-sm text-gray-500 font-semibold">
          Tổng số đã xóa: <strong className="text-gray-900">{filteredRecords.length} hồ sơ</strong>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-5 font-medium text-center w-16">STT</th>
                <th className="p-5 font-medium">Bệnh nhân & Mã hồ sơ</th>
                <th className="p-5 font-medium">Chuyên khoa & Bác sĩ</th>
                <th className="p-5 font-medium">Ngày tiếp nhận</th>
                <th className="p-5 font-medium">Dữ liệu đi kèm</th>
                <th className="p-5 font-medium text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-gray-400">
                    Đang tải dữ liệu thùng rác...
                  </td>
                </tr>
              ) : filteredRecords.length > 0 ? (
                filteredRecords.map((rec, index) => {
                  const hasPrescription = rec.prescription && rec.prescription.length > 0;
                  return (
                    <tr key={rec._id} className="hover:bg-red-50/5 transition-colors">
                      <td className="p-5 font-bold text-gray-700 text-center">{index + 1}</td>
                      <td className="p-5">
                        <div className="font-bold text-gray-900 text-base">{rec.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5 font-medium">
                          <Phone size={12} className="text-gray-400" /> {rec.phone}
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 font-mono tracking-wider bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-md mt-1.5 inline-block">
                          {rec.appointmentCode || 'N/A'}
                        </span>
                      </td>
                      <td className="p-5">
                        <span className="bg-blue-50 text-[#004e92] text-xs font-bold px-2.5 py-1 rounded-full border border-blue-100 inline-block">
                          {rec.dept}
                        </span>
                        <div className="text-xs text-gray-600 mt-1 font-semibold">
                          BS: {rec.doctor || 'Chưa chỉ định'}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="font-semibold text-gray-900">{rec.time}</div>
                        <div className="text-xs text-gray-500">{new Date(rec.date).toLocaleDateString('vi-VN')}</div>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col gap-1">
                          <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-md w-max flex items-center gap-1">
                            <Activity size={12} /> Hóa đơn khám ({rec.initialFee ? rec.initialFee.toLocaleString('vi-VN') : '150.000'}đ)
                          </span>
                          {hasPrescription && (
                            <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-md w-max flex items-center gap-1">
                              <Pill size={12} /> Đơn thuốc ({rec.prescription.length} loại)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <button
                          onClick={() => handleRestore(rec._id, rec.name)}
                          className="bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold py-2 px-4 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 shadow-sm border border-emerald-200 hover:border-transparent mx-auto"
                          title="Khôi phục hồ sơ bệnh án"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Khôi phục
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-gray-400 font-semibold">
                    Thùng rác trống. Không có hồ sơ hoặc hóa đơn nào bị xóa.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Trash;
