import { useState, useEffect, useCallback } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, Check, X, Eye, Search, RefreshCw, User, Phone, FileText, AlertCircle, Sparkles, AlertTriangle } from 'lucide-react';
import API_BASE_URL from '../config/api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, approved, completed, rejected
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const queryParams = new URLSearchParams();
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (dateFilter) queryParams.append('date', dateFilter);

      const response = await fetch(`${API_BASE_URL}/api/appointments?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        console.error('Không thể tải danh sách lịch hẹn');
      }
    } catch (error) {
      console.error('Lỗi khi tải lịch hẹn:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, dateFilter]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setAppointments(appointments.map(app => app._id === id ? { ...app, status: newStatus } : app));
        if (selectedAppointment?._id === id) {
          setSelectedAppointment(prev => ({ ...prev, status: newStatus }));
        }
        alert(`Đã cập nhật trạng thái lịch hẹn thành công!`);
      } else {
        const errorData = await response.json();
        alert(`Lỗi: ${errorData.message || 'Không thể cập nhật trạng thái'}`);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      alert('Lỗi kết nối đến server.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredAppointments = appointments.filter(app => {
    if (!search.trim()) return true;
    const matchName = app.name?.toLowerCase().includes(search.toLowerCase());
    const matchPhone = app.phone?.includes(search.trim());
    const matchCode = app.appointmentCode?.toLowerCase().includes(search.toLowerCase());
    return matchName || matchPhone || matchCode;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="bg-yellow-100 text-yellow-800 border border-yellow-200 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 w-max shadow-sm">
            <Clock className="w-3.5 h-3.5 text-yellow-600" />
            Chờ duyệt
          </span>
        );
      case 'approved':
        return (
          <span className="bg-green-100 text-green-800 border border-green-200 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 w-max shadow-sm">
            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
            Đã duyệt
          </span>
        );
      case 'completed':
        return (
          <span className="bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 w-max shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Đã khám xong
          </span>
        );
      case 'rejected':
        return (
          <span className="bg-red-100 text-red-800 border border-red-200 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 w-max shadow-sm">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            Đã hủy
          </span>
        );
      default:
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">Khác</span>;
    }
  };

  return (
    <div className="p-8 font-sans">
      {/* Header & Stats */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <Calendar className="text-[#004e92] w-8 h-8" />
              Quản lý Lịch hẹn & Duyệt khám
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Theo dõi, sắp xếp và phê duyệt lịch hẹn khám bệnh của bệnh nhân đặt trực tuyến
            </p>
          </div>
          <button
            onClick={fetchAppointments}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-medium text-sm"
          >
            <RefreshCw className={`w-4 h-4 text-[#004e92] ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2 overflow-x-auto">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'pending', label: 'Chờ duyệt' },
            { id: 'approved', label: 'Đã duyệt' },
            { id: 'completed', label: 'Đã khám' },
            { id: 'rejected', label: 'Đã hủy' },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
                  isActive ? 'border-[#004e92] text-[#004e92] font-bold' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Filter / Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between mb-6">
          <div className="flex flex-wrap items-center gap-4 flex-1">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tên, SĐT hoặc mã lịch hẹn..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Ngày khám:</span>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors cursor-pointer"
              />
              {dateFilter && (
                <button
                  onClick={() => setDateFilter('')}
                  className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors text-xs font-bold"
                  title="Xóa bộ lọc ngày"
                >
                  Xóa lọc
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider border-b border-gray-100">
                  <th className="p-4 font-medium w-16 text-center">#</th>
                  <th className="p-4 font-medium">Mã lịch & Bệnh nhân</th>
                  <th className="p-4 font-medium">Khoa & Bác sĩ</th>
                  <th className="p-4 font-medium">Ngày & Giờ khám</th>
                  <th className="p-4 font-medium">Trạng thái</th>
                  <th className="p-4 font-medium text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-gray-500 font-medium">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <RefreshCw className="w-8 h-8 text-[#004e92] animate-spin" />
                        <span>Đang tải danh sách lịch hẹn...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-gray-500 font-medium">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <AlertTriangle className="w-8 h-8 text-gray-400" />
                        <span>Không tìm thấy lịch hẹn nào phù hợp với bộ lọc.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((app, index) => (
                    <tr key={app._id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="p-4 font-bold text-gray-700 text-center">{index + 1}</td>
                      <td className="p-4">
                        <div className="font-bold text-[#004e92] text-xs mb-1 bg-blue-50 px-2 py-0.5 rounded w-max border border-blue-100">
                          {app.appointmentCode || 'BV-NONE'}
                        </div>
                        <div className="font-bold text-gray-900 text-base">{app.name}</div>
                        <div className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-gray-400" />
                          {app.phone}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-800">{app.dept || 'Chung'}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <User className="w-3 h-3 text-gray-400" />
                          {app.doctor ? `BS. ${app.doctor}` : 'Bác sĩ ngẫu nhiên'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-gray-900 flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-[#004e92]" />
                          {new Date(app.date).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded w-max mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-600" />
                          {app.time}
                        </div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedAppointment(app)}
                            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors shadow-sm"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {app.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(app._id, 'approved')}
                                disabled={updatingId === app._id}
                                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Duyệt
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(app._id, 'rejected')}
                                disabled={updatingId === app._id}
                                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
                              >
                                <X className="w-3.5 h-3.5" />
                                Hủy
                              </button>
                            </>
                          )}

                          {app.status === 'approved' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(app._id, 'completed')}
                                disabled={updatingId === app._id}
                                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                Đã khám
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(app._id, 'rejected')}
                                disabled={updatingId === app._id}
                                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
                              >
                                <X className="w-3.5 h-3.5" />
                                Hủy
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
            <div className="bg-[#004e92] text-white p-6 flex justify-between items-center">
              <div>
                <span className="text-xs bg-blue-800 text-blue-200 px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-blue-700">
                  {selectedAppointment.appointmentCode || 'BV-NONE'}
                </span>
                <h3 className="text-xl font-bold mt-2">Hồ sơ đăng ký khám</h3>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="w-10 h-10 rounded-full bg-blue-800 hover:bg-blue-700 flex items-center justify-center text-white transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Bệnh nhân */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-[#004e92] flex items-center justify-center font-bold text-lg border border-blue-200">
                    {selectedAppointment.name?.charAt(0) || 'BN'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{selectedAppointment.name}</h4>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Phone className="w-4 h-4 text-gray-400" /> {selectedAppointment.phone}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Giới tính</div>
                    <div className="font-bold text-gray-800 text-sm">{selectedAppointment.gender || 'Không ghi rõ'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Ngày sinh</div>
                    <div className="font-bold text-gray-800 text-sm">
                      {selectedAppointment.dob ? new Date(selectedAppointment.dob).toLocaleDateString('vi-VN') : 'Không ghi rõ'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin khám */}
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-3">
                <h4 className="font-bold text-[#004e92] text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Chi tiết đặt hẹn
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Chuyên khoa</div>
                    <div className="font-bold text-gray-900 text-sm">{selectedAppointment.dept}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Bác sĩ khám</div>
                    <div className="font-bold text-gray-900 text-sm">{selectedAppointment.doctor ? `BS. ${selectedAppointment.doctor}` : 'Sắp xếp ngẫu nhiên'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Ngày khám</div>
                    <div className="font-bold text-gray-900 text-sm">{new Date(selectedAppointment.date).toLocaleDateString('vi-VN')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Khung giờ</div>
                    <div className="font-bold text-blue-700 text-sm bg-white px-2 py-0.5 rounded border border-blue-200 w-max">{selectedAppointment.time}</div>
                  </div>
                </div>
              </div>

              {/* Lý do */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-gray-700 text-sm flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-gray-500" /> Triệu chứng / Lý do khám
                </h4>
                <p className="text-gray-600 text-sm italic mt-2 bg-white p-3 rounded-xl border border-gray-200 min-h-[60px]">
                  {selectedAppointment.reason || 'Bệnh nhân không ghi chú triệu chứng.'}
                </p>
              </div>

              {/* Tình trạng */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <span className="font-bold text-gray-700 text-sm">Trạng thái hiện tại:</span>
                {getStatusBadge(selectedAppointment.status)}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3 justify-end">
              {selectedAppointment.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(selectedAppointment._id, 'approved')}
                    disabled={updatingId === selectedAppointment._id}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                  >
                    <Check className="w-5 h-5" /> Duyệt lịch hẹn
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedAppointment._id, 'rejected')}
                    disabled={updatingId === selectedAppointment._id}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                  >
                    <X className="w-5 h-5" /> Hủy lịch
                  </button>
                </>
              )}
              {selectedAppointment.status === 'approved' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(selectedAppointment._id, 'completed')}
                    disabled={updatingId === selectedAppointment._id}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                  >
                    <Sparkles className="w-5 h-5" /> Đã khám xong
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedAppointment._id, 'rejected')}
                    disabled={updatingId === selectedAppointment._id}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                  >
                    <X className="w-5 h-5" /> Hủy lịch
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedAppointment(null)}
                className="bg-white hover:bg-gray-100 text-gray-700 font-bold py-3 px-6 rounded-2xl transition-colors border border-gray-200 shadow-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
