import { useState, useEffect, useCallback } from 'react';
import { 
  Pill, Search, User, Calendar, Phone, Activity, 
  CheckCircle, AlertCircle, RefreshCw, Clipboard, FileText, Check
} from 'lucide-react';
import API_BASE_URL from '../config/api';

const PharmacyDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending'); // pending, completed
  const [notification, setNotification] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fetchPrescriptions = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        // Filter appointments that have prescriptions
        // pending: paid (đã thanh toán thuốc nhưng chưa cấp)
        // completed: dispensed (đã cấp thuốc)
        const apps = Array.isArray(data) ? data : [];
        setAppointments(apps.filter(app => app.prescription && app.prescription.length > 0));
      } else {
        setErrorMsg(data.message || 'Không thể lấy danh sách đơn thuốc.');
      }
    } catch (error) {
      console.error('Lỗi fetch đơn thuốc:', error);
      setErrorMsg('Lỗi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

  // Xác nhận cấp phát thuốc
  const handleDispenseConfirm = async (appId) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/appointments/${appId}/dispense`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setNotification(`✅ Đã xác nhận cấp phát thuốc thành công cho bệnh nhân: ${data.appointment.name}!`);
        setSelectedApp(null);
        fetchPrescriptions();
        setTimeout(() => setNotification(''), 6000);
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          setErrorMsg(data.errors.join(' | '));
        } else {
          setErrorMsg(data.message || 'Lỗi khi cấp phát thuốc.');
        }
      }
    } catch (error) {
      console.error('Lỗi cấp thuốc:', error);
      setErrorMsg('Lỗi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  const handleUndispenseConfirm = async (appId) => {
    if (!window.confirm('Bạn có chắc muốn HOÀN TRẢ đơn này về trạng thái chờ cấp phát?\nSố lượng thuốc trong kho sẽ được cộng lại.')) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/appointments/${appId}/undispense`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setNotification(`↩️ Đã hoàn trả đơn thuốc về chờ cấp phát cho bệnh nhân: ${data.appointment.name}!`);
        setSelectedApp(null);
        fetchPrescriptions();
        setTimeout(() => setNotification(''), 6000);
      } else {
        setErrorMsg(data.message || 'Lỗi khi hoàn trả đơn thuốc.');
      }
    } catch (error) {
      console.error('Lỗi hoàn trả đơn:', error);
      setErrorMsg('Lỗi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  const formatDateSafe = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return 'N/A';
      return d.toLocaleDateString('vi-VN');
    } catch {
      return 'N/A';
    }
  };

  // Lọc theo tab và tìm kiếm
  const filteredApps = appointments.filter(app => {
    const isTabMatch = activeTab === 'pending' 
      ? app.prescriptionStatus === 'paid'
      : app.prescriptionStatus === 'dispensed';

    const text = searchQuery.toLowerCase();
    const isSearchMatch = 
      app.name.toLowerCase().includes(text) ||
      app.phone.includes(text) ||
      (app.appointmentCode && app.appointmentCode.toLowerCase().includes(text));

    return isTabMatch && isSearchMatch;
  });

  const paginatedApps = filteredApps.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE);

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100 flex-wrap gap-4 print:hidden select-none">
        <span className="text-xs text-gray-500 font-bold">
          Trang {currentPage} / {totalPages}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2)
            .map((page, index, array) => {
              const showEllipsis = index > 0 && page - array[index - 1] > 1;
              return (
                <div key={page} className="flex gap-1">
                  {showEllipsis && <span className="px-2 py-1 text-xs text-gray-400 font-bold">...</span>}
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      currentPage === page
                        ? 'bg-[#004e92] text-white shadow-md'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                </div>
              );
            })}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-[#004e92] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Sau
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-wide flex items-center gap-3">
            <Pill className="w-8 h-8 text-[#004e92]" /> Quầy Cấp Phát Thuốc Dược sĩ
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Duyệt các đơn thuốc đã đóng phí, kiểm tra tồn kho và xác nhận cấp phát cho bệnh nhân.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchPrescriptions}
            className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-2xl transition-colors border border-gray-200"
            title="Tải lại danh sách"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 shadow-sm">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          {notification}
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="flex-1">{errorMsg}</div>
          <button onClick={() => setErrorMsg('')} className="text-red-500 hover:text-red-700 font-bold">✕</button>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: List of prescriptions */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex gap-2">
            <button
              onClick={() => { setActiveTab('pending'); setSelectedApp(null); }}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'pending'
                  ? 'bg-[#004e92] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Clipboard className="w-4 h-4" /> Đơn Chờ Cấp Phát ({appointments.filter(app => app.prescriptionStatus === 'paid').length})
            </button>
            <button
              onClick={() => { setActiveTab('completed'); setSelectedApp(null); }}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'completed'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <CheckCircle className="w-4 h-4" /> Đơn Đã Cấp ({appointments.filter(app => app.prescriptionStatus === 'dispensed').length})
            </button>
          </div>

          {/* Search bar */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo Tên bệnh nhân, Số điện thoại hoặc Mã đơn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92] font-semibold"
              />
            </div>
          </div>

          {/* Prescriptions List */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
              Danh sách đơn thuốc ({filteredApps.length} kết quả)
            </div>
            {loading && appointments.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#004e92] mb-3" />
                Đang tải danh sách đơn thuốc...
              </div>
            ) : paginatedApps.length > 0 ? (
              <>
                <div className="divide-y divide-gray-100">
                  {paginatedApps.map((app) => (
                    <div 
                      key={app._id} 
                      onClick={() => setSelectedApp(app)}
                      className={`p-5 hover:bg-blue-50/20 transition-all cursor-pointer flex flex-wrap items-center justify-between gap-4 ${
                        selectedApp?._id === app._id ? 'bg-blue-50/30 border-l-4 border-[#004e92]' : ''
                      }`}
                    >
                      <div className="space-y-1.5 flex-1 min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-[#004e92] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                            {app.appointmentCode}
                          </span>
                          <span className="text-xs text-gray-400 font-medium">
                            Khám ngày {formatDateSafe(app.date)}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-base">{app.name}</h4>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-gray-400" /> {app.phone}
                          {app.bhyt && (
                            <span className="ml-2 bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded text-[10px] border border-purple-100">
                              BHYT: {app.bhyt}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-xs font-bold text-gray-400 block uppercase">Tổng số thuốc</span>
                          <span className="text-base font-extrabold text-gray-800">{app.prescription?.length || 0} loại</span>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApp(app);
                          }}
                          className="px-4 py-2 bg-gray-100 hover:bg-[#004e92] text-gray-700 hover:text-white rounded-xl transition-all text-xs font-bold shadow-sm"
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {renderPagination()}
              </>
            ) : (
              <div className="p-16 text-center text-gray-400 italic">
                <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                Không có đơn thuốc nào trong mục này.
              </div>
            )}
          </div>
        </div>

        {/* Right column: Selected Prescription Details */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Clipboard className="w-5 h-5 text-[#004e92]" /> Chi Tiết Đơn Thuốc
            </h3>

            {selectedApp ? (
              <div className="space-y-6">
                {/* Patient summary */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2">
                  <div className="text-xs font-bold text-gray-400 uppercase">Bệnh nhân nhận thuốc</div>
                  <div className="font-extrabold text-gray-900 text-base">{selectedApp.name}</div>
                  <div className="text-xs font-semibold text-gray-600">SĐT: {selectedApp.phone}</div>
                  <div className="text-xs text-gray-500">Khoa điều phối: {selectedApp.dept}</div>
                  <div className="text-xs text-gray-500">Bác sĩ kê đơn: {selectedApp.doctor}</div>
                  {selectedApp.bhyt && (
                    <div className="text-xs text-purple-700 font-bold bg-purple-50 px-2 py-1 rounded w-max border border-purple-100">
                      Mã BHYT: {selectedApp.bhyt}
                    </div>
                  )}
                </div>

                {/* Medicines List */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Danh mục thuốc cấp phát</div>
                  <div className="space-y-2">
                    {selectedApp.prescription.map((item, idx) => (
                      <div key={item.medicineId || idx} className="p-3 bg-blue-50/20 rounded-xl border border-blue-50 flex items-start gap-3">
                        <div className="bg-[#004e92]/10 text-[#004e92] p-2 rounded-lg font-bold text-xs">
                          {idx + 1}
                        </div>
                        <div className="flex-1 space-y-0.5">
                          <div className="font-bold text-gray-900 text-sm">{item.name}</div>
                          <div className="text-xs text-gray-500 italic">Cách dùng: {item.usage}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-extrabold text-[#004e92]">x{item.qty}</span>
                          <span className="text-[10px] text-gray-400 block font-bold uppercase">{item.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confirm Action Button */}
                {selectedApp.prescriptionStatus === 'paid' && (
                  <button
                    onClick={() => handleDispenseConfirm(selectedApp._id)}
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Xác nhận Cấp thuốc & Trừ kho
                  </button>
                )}

                {selectedApp.prescriptionStatus === 'dispensed' && (
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center text-green-800 font-bold text-sm flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Đã cấp phát hoàn tất
                    </div>
                    <button
                      onClick={() => handleUndispenseConfirm(selectedApp._id)}
                      disabled={loading}
                      className="w-full bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold py-3 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      ↩️ Hoàn trả đơn về chờ cấp phát
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400 italic text-sm">
                Vui lòng chọn một đơn thuốc trong danh sách để xem chi tiết và duyệt cấp phát.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboard;
