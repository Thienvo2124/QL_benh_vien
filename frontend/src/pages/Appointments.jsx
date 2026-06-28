import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import apiFetch, { ApiError } from '../utils/api';

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã huỷ' },
];

const STATUS_BADGE = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const STATUS_TEXT = {
  pending: 'Chờ duyệt',
  confirmed: 'Đã xác nhận',
  completed: 'Hoàn thành',
  cancelled: 'Đã huỷ',
};

const Appointments = () => {
  const { token } = useContext(AuthContext);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    status: '',
    department: '',
    doctor: '',
    date: '',
  });

  // 🟢 LOAD DATA (QUAN TRỌNG)
  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await apiFetch('/api/appointments', {
        token,
        params: filters,
      });

      // an toàn tránh null crash
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        setError('Bạn không có quyền xem danh sách lịch hẹn');
      } else {
        setError(err.message || 'Không thể tải dữ liệu');
      }

      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [token, filters]);

  // 🟢 AUTO LOAD
  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // 🟢 FILTER CHANGE
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 🟢 FORMAT DATE
  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('vi-VN');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Quản Lý Lịch Hẹn
        </h2>

        {/* 🔄 REFRESH BUTTON */}
        <button
          onClick={loadAppointments}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          🔄 Làm mới
        </button>
      </div>

      {/* FILTER */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">

        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="border p-2 rounded"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <input
          placeholder="Chuyên khoa"
          value={filters.department}
          onChange={(e) => handleFilterChange('department', e.target.value)}
          className="border p-2 rounded"
        />

        <input
          placeholder="Bác sĩ"
          value={filters.doctor}
          onChange={(e) => handleFilterChange('doctor', e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={filters.date}
          onChange={(e) => handleFilterChange('date', e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-hidden">

        {/* LOADING */}
        {loading ? (
          <div className="p-6 text-center text-gray-500">
            Đang tải dữ liệu...
          </div>
        ) : !Array.isArray(appointments) || appointments.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            Không có lịch hẹn
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-600">
                <th className="p-3">Bệnh nhân</th>
                <th className="p-3">SĐT</th>
                <th className="p-3">Khoa</th>
                <th className="p-3">Bác sĩ</th>
                <th className="p-3">Ngày</th>
                <th className="p-3">Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((a) => (
                <tr key={a._id} className="border-t hover:bg-gray-50">

                  <td className="p-3 font-medium">
                    {a.patientName}
                  </td>

                  <td className="p-3">
                    {a.phone}
                  </td>

                  <td className="p-3">
                    {a.department}
                  </td>

                  <td className="p-3">
                    {a.doctor || '—'}
                  </td>

                  <td className="p-3">
                    {formatDate(a.appointmentDate)}
                  </td>

                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${STATUS_BADGE[a.status]}`}>
                      {STATUS_TEXT[a.status]}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>
    </div>
  );
};

export default Appointments;