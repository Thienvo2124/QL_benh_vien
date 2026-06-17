import { useState, useEffect } from 'react';
import { Activity, Shield, User, Clock, ChevronDown } from 'lucide-react';
import API_BASE_URL from '../config/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, admin, doctor, nurse, patient
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách người dùng:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (response.ok) {
        // Cập nhật lại state cục bộ thay vì fetch lại toàn bộ để mượt hơn
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        alert('Cập nhật quyền thành công!');
      } else {
        alert('Có lỗi xảy ra khi cập nhật quyền.');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật quyền:', error);
      alert('Lỗi kết nối.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = filter === 'all' ? users : users.filter(u => u.role === filter);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h2>
          <p className="text-gray-500 text-sm mt-1">Quản lý tài khoản hệ thống ({users.length} tài khoản)</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
        {['all', 'admin', 'doctor', 'nurse', 'patient'].map((tab) => {
          const labels = { all: 'Tất cả', admin: 'Quản trị viên', doctor: 'Bác sĩ', nurse: 'Y tá', patient: 'Bệnh nhân' };
          const isActive = filter === tab;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${
                isActive ? 'border-[#004e92] text-[#004e92]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium w-16">#</th>
                <th className="p-4 font-medium">Họ và tên</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Vai trò</th>
                <th className="p-4 font-medium">Cấp quyền</th>
                <th className="p-4 font-medium">Ngày tham gia</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    Không có dữ liệu người dùng nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{index + 1}</td>
                    <td className="p-4 font-medium text-gray-800 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        {user.fullName?.charAt(0) || 'U'}
                      </div>
                      {user.fullName}
                    </td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center w-max gap-1
                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : ''}
                        ${user.role === 'doctor' ? 'bg-blue-100 text-blue-700' : ''}
                        ${user.role === 'nurse' ? 'bg-pink-100 text-pink-700' : ''}
                        ${user.role === 'patient' ? 'bg-gray-100 text-gray-700' : ''}
                      `}>
                        {user.role === 'admin' && <Shield size={12} />}
                        {user.role === 'doctor' && <Activity size={12} />}
                        {user.role === 'nurse' && <Activity size={12} />}
                        {user.role === 'patient' && <User size={12} />}
                        {user.role === 'admin' ? 'Quản trị viên' : user.role === 'doctor' ? 'Bác sĩ' : user.role === 'nurse' ? 'Y tá' : 'Bệnh nhân'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="relative inline-block">
                        <select 
                          className="appearance-none bg-white border border-gray-300 text-gray-700 py-1.5 pl-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          value={user.role}
                          onChange={(e) => handleChangeRole(user._id, e.target.value)}
                          disabled={updatingId === user._id}
                        >
                          <option value="patient">Bệnh nhân</option>
                          <option value="nurse">Y tá</option>
                          <option value="doctor">Bác sĩ</option>
                          <option value="admin">Quản trị viên</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <ChevronDown size={14} />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 flex items-center gap-1">
                      <Clock size={14} className="text-gray-400" />
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
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

export default Users;
