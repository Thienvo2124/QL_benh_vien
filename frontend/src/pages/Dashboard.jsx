import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import apiFetch, { ApiError } from '../utils/api';

/**
 * Dashboard
 * FE-04: bỏ mockAppointments, gọi Dashboard Stats API thật (BE-05),
 * có loading / error / empty state đầy đủ.
 */
const Dashboard = () => {
  const { token } = useContext(AuthContext);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/api/dashboard/stats', { token });
      setStats(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError('Bạn cần đăng nhập lại để xem dữ liệu này');
      } else if (err instanceof ApiError && err.status === 403) {
        setError('Bạn không có quyền xem dữ liệu tổng quan');
      } else {
        setError(err.message || 'Không thể tải dữ liệu, vui lòng thử lại');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('vi-VN');
    } catch {
      return dateStr;
    }
  };

  const statusLabel = {
    pending: { text: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-700' },
    confirmed: { text: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700' },
    completed: { text: 'Hoàn thành', color: 'bg-green-100 text-green-700' },
    cancelled: { text: 'Đã huỷ', color: 'bg-red-100 text-red-700' },
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tổng Quan</h2>
        <button
          onClick={loadStats}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Làm mới
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow border-l-4 border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Empty state (API trả về nhưng không có dữ liệu nào) */}
      {!loading && !error && stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
              <h3 className="text-gray-500 text-sm">Tổng Người Dùng</h3>
              <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-teal-500">
              <h3 className="text-gray-500 text-sm">Tổng Bệnh Nhân</h3>
              <p className="text-3xl font-bold mt-2">{stats.totalPatients}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
              <h3 className="text-gray-500 text-sm">Lịch Hẹn Hôm Nay</h3>
              <p className="text-3xl font-bold mt-2">{stats.todayAppointments}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
              <h3 className="text-gray-500 text-sm">Lịch Chờ Duyệt</h3>
              <p className="text-3xl font-bold mt-2">{stats.pendingAppointments}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Lịch Hẹn Gần Đây</h3>

            {stats.recentAppointments?.length === 0 ? (
              <p className="text-gray-400 text-sm py-6 text-center">Chưa có lịch hẹn nào</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="py-2 pr-4">Bệnh nhân</th>
                      <th className="py-2 pr-4">Số điện thoại</th>
                      <th className="py-2 pr-4">Khoa</th>
                      <th className="py-2 pr-4">Ngày khám</th>
                      <th className="py-2 pr-4">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentAppointments?.map((a) => (
                      <tr key={a._id} className="border-b last:border-0">
                        <td className="py-2 pr-4 font-medium text-gray-800">{a.patientName}</td>
                        <td className="py-2 pr-4 text-gray-600">{a.phone}</td>
                        <td className="py-2 pr-4 text-gray-600">{a.department}</td>
                        <td className="py-2 pr-4 text-gray-600">{formatDate(a.appointmentDate)}</td>
                        <td className="py-2 pr-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              statusLabel[a.status]?.color || 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {statusLabel[a.status]?.text || a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;