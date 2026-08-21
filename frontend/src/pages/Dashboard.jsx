import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, Calendar, Activity, CheckCircle, Clock, Pill, DollarSign, RefreshCw, AlertTriangle, FileText, Construction, Shield } from 'lucide-react';
import API_BASE_URL from '../config/api';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const [resAppointments, resUsers, resMedicines] = await Promise.all([
        fetch(`${API_BASE_URL}/api/appointments`, { headers }),
        fetch(`${API_BASE_URL}/api/users`, { headers }),
        fetch(`${API_BASE_URL}/api/medicines`, { headers })
      ]);

      if (resAppointments.ok) {
        const appData = await resAppointments.json();
        setAppointments(appData);
      }
      if (resUsers.ok) {
        const userData = await resUsers.json();
        setUsers(userData);
      }
      if (resMedicines.ok) {
        const medData = await resMedicines.json();
        setMedicines(medData);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Thống kê chỉ số thật
  const patientUsers = users.filter(u => u.role === 'patient');
  const doctorUsers = users.filter(u => u.role === 'doctor');
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 w-max"><Clock size={12} /> Chờ duyệt</span>;
      case 'approved':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 w-max"><CheckCircle size={12} /> Đã duyệt</span>;
      case 'completed':
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 w-max"><Activity size={12} /> Đã khám</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 w-max">Đã hủy</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">Khác</span>;
    }
  };

  return (
    <div className="p-8 font-sans">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            Tổng quan hệ thống
            <button onClick={fetchDashboardData} className="text-gray-400 hover:text-[#004e92] transition-colors p-1" title="Làm mới dữ liệu">
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-[#004e92]' : ''}`} />
            </button>
          </h2>
          <p className="text-gray-500 text-sm mt-1">Các chỉ số được tổng hợp trực tiếp từ dữ liệu thực của hệ thống.</p>
        </div>
      </div>

      {/* Stats Cards - Dữ liệu thật */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Bệnh nhân (Thật) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Tài khoản bệnh nhân</h3>
            <p className="text-3xl font-bold text-gray-800">{loading ? '...' : patientUsers.length}</p>
            <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded w-max border border-green-100">
              <Activity size={12} /> Dữ liệu thực từ DB
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl">
            <Users size={28} className="text-blue-600" />
          </div>
        </div>

        {/* Card 2: Bác sĩ (Thật) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Đội ngũ Bác sĩ</h3>
            <p className="text-3xl font-bold text-gray-800">{loading ? '...' : doctorUsers.length}</p>
            <p className="text-xs text-blue-600 mt-2 font-medium flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded w-max border border-blue-100">
              <Users size={12} /> Dữ liệu thực từ DB
            </p>
          </div>
          <div className="bg-teal-50 p-4 rounded-xl">
            <UserPlus size={28} className="text-teal-600" />
          </div>
        </div>

        {/* Card 3: Lịch hẹn (Thật) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Tổng lịch khám</h3>
            <p className="text-3xl font-bold text-gray-800">{loading ? '...' : appointments.length}</p>
            <p className="text-xs text-amber-700 mt-2 font-medium flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded w-max border border-amber-200">
              <Clock size={12} /> {pendingAppointments.length} lịch đang chờ duyệt
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl">
            <Calendar size={28} className="text-orange-600" />
          </div>
        </div>

        {/* Card 4: Kho thuốc (Thật) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Kho dược phẩm</h3>
            <p className="text-3xl font-bold text-gray-800">{loading ? '...' : medicines.length}</p>
            <p className="text-xs text-purple-700 mt-2 font-medium flex items-center gap-1 bg-purple-50 px-2 py-0.5 rounded w-max border border-purple-200">
              <Pill size={12} /> Danh mục thuốc thực
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl">
            <Pill size={28} className="text-purple-600" />
          </div>
        </div>
      </div>


      {/* Recent Appointments Table - Dữ liệu thật */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            Lịch hẹn đăng ký gần đây
            <span className="text-xs bg-blue-50 text-[#004e92] border border-blue-200 px-2.5 py-1 rounded-full font-semibold">
              Dữ liệu trực tiếp từ API
            </span>
          </h3>
          <Link to="/dashboard/appointments" className="text-sm font-medium text-[#004e92] hover:underline">
            Xem tất cả
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-medium">Mã LH</th>
                <th className="p-4 font-medium">Bệnh nhân</th>
                <th className="p-4 font-medium">Bác sĩ phụ trách</th>
                <th className="p-4 font-medium">Chuyên khoa</th>
                <th className="p-4 font-medium">Thời gian</th>
                <th className="p-4 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500 font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 text-[#004e92] animate-spin" />
                      <span>Đang tải dữ liệu lịch hẹn thực...</span>
                    </div>
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    Hệ thống chưa có lịch hẹn nào được đặt.
                  </td>
                </tr>
              ) : (
                appointments.slice(0, 5).map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 font-bold text-[#004e92]">{app.appointmentCode || 'BV-NONE'}</td>
                    <td className="p-4 font-bold text-gray-800">{app.name}</td>
                    <td className="p-4 text-gray-600">{app.doctor ? `BS. ${app.doctor}` : 'Bác sĩ ngẫu nhiên'}</td>
                    <td className="p-4 text-gray-600 font-medium">{app.dept || 'Chung'}</td>
                    <td className="p-4 text-gray-600">
                      {app.time} - {new Date(app.date).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(app.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
