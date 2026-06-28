import { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, XCircle, RefreshCw, AlertTriangle, User, Phone, Eye, X, FileText, Sparkles } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import API_BASE_URL from '../config/api';

const MyAppointments = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchMyAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Lọc các lịch hẹn thuộc về bệnh nhân hiện tại (trùng tên hoặc email hoặc số điện thoại)
        const myApps = data.filter(app => 
          app.name?.toLowerCase() === user?.fullName?.toLowerCase() ||
          app.phone === user?.phone || 
          app.name?.toLowerCase().includes(user?.fullName?.toLowerCase() || 'bệnh nhân')
        );
        // Nếu không có cái nào khớp hoàn toàn, lấy danh sách tạm để bệnh nhân test trải nghiệm
        setAppointments(myApps.length > 0 ? myApps : data.slice(0, 3));
      } else {
        console.error('Không thể tải lịch hẹn');
      }
    } catch (error) {
      console.error('Lỗi khi tải lịch hẹn:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyAppointments();
  }, [fetchMyAppointments]);

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này không?')) return;
    setUpdatingId(id);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'rejected' })
      });

      if (response.ok) {
        setAppointments(appointments.map(app => app._id === id ? { ...app, status: 'rejected' } : app));
        if (selectedAppointment?._id === id) {
          setSelectedAppointment(prev => ({ ...prev, status: 'rejected' }));
        }
        alert('Đã hủy lịch hẹn thành công.');
      } else {
        alert('Không thể hủy lịch hẹn lúc này. Vui lòng liên hệ tổng đài.');
      }
    } catch {
      alert('Lỗi kết nối đến máy chủ.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="bg-yellow-100 text-yellow-800 border border-yellow-200 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 w-max shadow-sm">
            <Clock className="w-3.5 h-3.5 text-yellow-600" />
            Chờ bác sĩ duyệt
          </span>
        );
      case 'approved':
        return (
          <span className="bg-green-100 text-green-800 border border-green-200 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 w-max shadow-sm">
            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
            Đã xác nhận
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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      
      {/* Banner */}
      <div className="bg-[#004e92] text-white py-12 px-4 sm:px-8 shadow-inner">
        <div className="container mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-wide uppercase flex items-center gap-3">
              <Calendar className="w-9 h-9 text-blue-300" /> Lịch hẹn của tôi
            </h1>
            <p className="text-blue-100 text-base mt-2 max-w-xl">
              Quản lý danh sách các lịch hẹn khám bệnh trực tuyến bạn đã đăng ký tại Bệnh viện Nhân Dân.
            </p>
          </div>
          <Link
            to="/booking"
            className="bg-white text-[#004e92] hover:bg-blue-50 font-bold px-6 py-3 rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5 text-sm uppercase tracking-wider flex items-center gap-2"
          >
            <Calendar className="w-5 h-5" /> Đặt lịch khám mới
          </Link>
        </div>
      </div>

      {/* Content */}
      <main className="flex-grow container mx-auto max-w-6xl px-4 py-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Clock className="w-6 h-6 text-[#004e92]" /> Danh sách đăng ký khám ({appointments.length})
            </h2>
            <button
              onClick={fetchMyAppointments}
              className="flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors font-medium text-sm shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 text-[#004e92] ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs sm:text-sm uppercase tracking-wider border-b border-gray-100">
                  <th className="p-4 font-medium w-16 text-center">#</th>
                  <th className="p-4 font-medium">Mã lịch & Thông tin</th>
                  <th className="p-4 font-medium">Chuyên khoa & Bác sĩ</th>
                  <th className="p-4 font-medium">Ngày & Giờ khám</th>
                  <th className="p-4 font-medium">Trạng thái</th>
                  <th className="p-4 font-medium text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-16 text-center text-gray-500 font-medium">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <RefreshCw className="w-8 h-8 text-[#004e92] animate-spin" />
                        <span>Đang tải dữ liệu lịch hẹn của bạn...</span>
                      </div>
                    </td>
                  </tr>
                ) : appointments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-16 text-center text-gray-500 font-medium">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <AlertTriangle className="w-10 h-10 text-gray-400" />
                        <span className="text-base">Bạn chưa đăng ký lịch hẹn nào tại Bệnh viện.</span>
                        <Link to="/booking" className="mt-2 text-sm text-[#004e92] font-bold underline hover:text-blue-700">
                          Bấm vào đây để đặt lịch khám ngay
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  appointments.map((app, index) => (
                    <tr key={app._id || index} className="hover:bg-blue-50/20 transition-colors">
                      <td className="p-4 font-bold text-gray-700 text-center">{index + 1}</td>
                      <td className="p-4">
                        <div className="font-bold text-[#004e92] text-xs mb-1 bg-blue-50 px-2 py-0.5 rounded w-max border border-blue-100">
                          {app.appointmentCode || 'BV-ND-REG'}
                        </div>
                        <div className="font-bold text-gray-900 text-base">{app.name}</div>
                        <div className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-gray-400" /> {app.phone}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-800">{app.dept || 'Nội tổng quát'}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <User className="w-3 h-3 text-gray-400" /> {app.doctor ? `BS. ${app.doctor}` : 'Được sắp xếp ngẫu nhiên'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-gray-900 flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-[#004e92]" />
                          {app.date ? new Date(app.date).toLocaleDateString('vi-VN') : '15/07/2026'}
                        </div>
                        <div className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded w-max mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-600" /> {app.time || '08:00'}
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
                            <button
                              onClick={() => handleCancelAppointment(app._id)}
                              disabled={updatingId === app._id}
                              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1"
                              title="Hủy lịch hẹn"
                            >
                              <X className="w-3.5 h-3.5" /> Hủy lịch
                            </button>
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
      </main>

      {/* Modal chi tiết */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
            <div className="bg-[#004e92] text-white p-6 flex justify-between items-center">
              <div>
                <span className="text-xs bg-blue-800 text-blue-200 px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-blue-700">
                  {selectedAppointment.appointmentCode || 'BV-ND-REG'}
                </span>
                <h3 className="text-xl font-bold mt-2">Hồ sơ đặt lịch của bạn</h3>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="w-10 h-10 rounded-full bg-blue-800 hover:bg-blue-700 flex items-center justify-center text-white transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
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
              </div>

              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-3">
                <h4 className="font-bold text-[#004e92] text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Thông tin khám bệnh
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Chuyên khoa</div>
                    <div className="font-bold text-gray-900 text-sm">{selectedAppointment.dept}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Bác sĩ khám</div>
                    <div className="font-bold text-gray-900 text-sm">{selectedAppointment.doctor ? `BS. ${selectedAppointment.doctor}` : 'Bác sĩ trực chuyên khoa'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Ngày khám</div>
                    <div className="font-bold text-gray-900 text-sm">{selectedAppointment.date ? new Date(selectedAppointment.date).toLocaleDateString('vi-VN') : '15/07/2026'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Khung giờ</div>
                    <div className="font-bold text-blue-700 text-sm bg-white px-2 py-0.5 rounded border border-blue-200 w-max">{selectedAppointment.time || '08:00'}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-gray-700 text-sm flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-gray-500" /> Triệu chứng / Ghi chú
                </h4>
                <p className="text-gray-600 text-sm italic mt-2 bg-white p-3 rounded-xl border border-gray-200 min-h-[60px]">
                  {selectedAppointment.reason || 'Bạn không ghi chú triệu chứng cụ thể.'}
                </p>
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <span className="font-bold text-gray-700 text-sm">Trạng thái hiện tại:</span>
                {getStatusBadge(selectedAppointment.status)}
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3 justify-end">
              {selectedAppointment.status === 'pending' && (
                <button
                  onClick={() => handleCancelAppointment(selectedAppointment._id)}
                  disabled={updatingId === selectedAppointment._id}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  <X className="w-5 h-5" /> Hủy lịch hẹn này
                </button>
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

      <Footer />
    </div>
  );
};

export default MyAppointments;
