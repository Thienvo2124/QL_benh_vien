import { useCallback, useEffect, useState } from 'react';
import { Activity, Shield, User, Clock, ChevronDown, DollarSign, Eye, Edit, Trash } from 'lucide-react';
import API_BASE_URL from '../config/api';
import departments from '../data/departments';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, admin, doctor, nurse, patient
  const [updatingId, setUpdatingId] = useState(null);

  // Modal & form states
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null); // 'view' | 'edit' | null
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    birthDate: '',
    gender: '',
    bhytCode: '',
    idCard: '',
    address: ''
  });

  const fetchUsers = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  const handleChangeRole = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (response.ok) {
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole, department: newRole === 'doctor' ? '' : undefined } : u));
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

  const handleChangeDepartment = async (userId, newDept) => {
    setUpdatingId(userId);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          role: 'doctor', 
          department: newDept 
        }),
      });
      if (response.ok) {
        setUsers(users.map(u => u._id === userId ? { ...u, department: newDept } : u));
        alert('Cập nhật chuyên khoa thành công!');
      } else {
        alert('Có lỗi xảy ra khi cập nhật chuyên khoa.');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật chuyên khoa:', error);
      alert('Lỗi kết nối.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewDetails = (u) => {
    setSelectedUser(u);
    setModalType('view');
  };

  const handleEditUser = (u) => {
    setSelectedUser(u);
    setEditForm({
      fullName: u.fullName || '',
      email: u.email || '',
      phone: u.phone || '',
      role: u.role || 'patient',
      department: u.department || '',
      birthDate: u.birthDate || '',
      gender: u.gender || '',
      bhytCode: u.bhytCode || '',
      idCard: u.idCard || '',
      address: u.address || ''
    });
    setModalType('edit');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setUpdatingId(selectedUser._id);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`
        },
        body: JSON.stringify(editForm),
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(users.map(u => u._id === selectedUser._id ? data.user : u));
        alert('Cập nhật người dùng thành công!');
        setModalType(null);
      } else {
        alert(data.message || 'Có lỗi xảy ra.');
      }
    } catch (error) {
      console.error(error);
      alert('Lỗi kết nối.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (u) => {
    if (confirm(`Bạn có chắc chắn muốn xóa tài khoản của bệnh nhân/nhân viên: ${u.fullName || u.phone}?`)) {
      setUpdatingId(u._id);
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${u._id}`, {
          method: 'DELETE',
          headers: { 
            'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setUsers(users.filter(usr => usr._id !== u._id));
          alert('Xóa tài khoản thành công!');
        } else {
          alert(data.message || 'Có lỗi xảy ra.');
        }
      } catch (error) {
        console.error(error);
        alert('Lỗi kết nối.');
      } finally {
        setUpdatingId(null);
      }
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
        {['all', 'admin', 'doctor', 'nurse', 'cashier', 'patient'].map((tab) => {
          const labels = { all: 'Tất cả', admin: 'Quản trị viên', doctor: 'Bác sĩ', nurse: 'Dược sĩ', cashier: 'Thu ngân', patient: 'Bệnh nhân' };
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
                <th className="p-4 font-medium">Chuyên khoa</th>
                <th className="p-4 font-medium">Ngày tham gia</th>
                <th className="p-4 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-500">
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
                        ${user.role === 'cashier' ? 'bg-amber-100 text-amber-700' : ''}
                        ${user.role === 'patient' ? 'bg-gray-100 text-gray-700' : ''}
                      `}>
                        {user.role === 'admin' && <Shield size={12} />}
                        {user.role === 'doctor' && <Activity size={12} />}
                        {user.role === 'nurse' && <Activity size={12} />}
                        {user.role === 'cashier' && <DollarSign size={12} />}
                        {user.role === 'patient' && <User size={12} />}
                        {user.role === 'admin' ? 'Quản trị viên' : user.role === 'doctor' ? 'Bác sĩ' : user.role === 'nurse' ? 'Dược sĩ' : user.role === 'cashier' ? 'Thu ngân' : 'Bệnh nhân'}
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
                          <option value="nurse">Dược sĩ</option>
                          <option value="cashier">Thu ngân</option>
                          <option value="doctor">Bác sĩ</option>
                          <option value="admin">Quản trị viên</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <ChevronDown size={14} />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {user.role === 'doctor' ? (
                        <div className="relative inline-block max-w-[200px]">
                          <select 
                            className="appearance-none bg-white border border-gray-300 text-gray-700 py-1.5 pl-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            value={user.department || ""}
                            onChange={(e) => handleChangeDepartment(user._id, e.target.value)}
                            disabled={updatingId === user._id}
                          >
                            <option value="">Chưa phân khoa</option>
                            {departments.map((dept) => (
                              <option key={dept.slug} value={dept.name}>
                                {dept.name}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <ChevronDown size={14} />
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-gray-400" />
                        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleViewDetails(user)} 
                          className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleEditUser(user)} 
                          className="p-1.5 hover:bg-amber-50 rounded-lg text-amber-600 transition-colors"
                          title="Sửa thông tin"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user)} 
                          className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                          title="Xóa người dùng"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {modalType === 'view' && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Chi tiết tài khoản</h3>
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500 font-medium">Họ và tên:</span>
                <span className="text-gray-900 font-semibold">{selectedUser.fullName || '-'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500 font-medium">Số điện thoại:</span>
                <span className="text-gray-900 font-semibold">{selectedUser.phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500 font-medium">Email:</span>
                <span className="text-gray-900 font-semibold">{selectedUser.email || '-'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500 font-medium">Vai trò:</span>
                <span className="text-gray-900 font-semibold uppercase">{selectedUser.role}</span>
              </div>
              {selectedUser.role === 'doctor' && (
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Chuyên khoa:</span>
                  <span className="text-blue-700 font-bold">{selectedUser.department || 'Chưa phân khoa'}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500 font-medium">Ngày sinh:</span>
                <span className="text-gray-900 font-semibold">{selectedUser.birthDate || '-'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500 font-medium">Giới tính:</span>
                <span className="text-gray-900 font-semibold">{selectedUser.gender || '-'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500 font-medium">Số BHYT:</span>
                <span className="text-gray-900 font-semibold">{selectedUser.bhytCode || '-'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500 font-medium">Số CCCD:</span>
                <span className="text-gray-900 font-semibold">{selectedUser.idCard || '-'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500 font-medium">Địa chỉ:</span>
                <span className="text-gray-900 font-semibold text-right max-w-[250px] break-words">{selectedUser.address || '-'}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setModalType(null)} 
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-6 rounded-xl transition-colors text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {modalType === 'edit' && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 my-8 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Chỉnh sửa tài khoản</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Họ và tên</label>
                  <input 
                    type="text" 
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Số điện thoại</label>
                  <input 
                    type="text" 
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                  <input 
                    type="email" 
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Vai trò</label>
                  <select 
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value, department: e.target.value === 'doctor' ? editForm.department : '' })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium text-gray-900"
                  >
                    <option value="patient">Bệnh nhân</option>
                    <option value="nurse">Dược sĩ</option>
                    <option value="cashier">Thu ngân</option>
                    <option value="doctor">Bác sĩ</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>
                {editForm.role === 'doctor' && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Chuyên khoa</label>
                    <select 
                      value={editForm.department}
                      onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium text-gray-900"
                    >
                      <option value="">Chưa phân khoa</option>
                      {departments.map((dept) => (
                        <option key={dept.slug} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Ngày sinh (YYYY-MM-DD)</label>
                  <input 
                    type="text" 
                    placeholder="YYYY-MM-DD"
                    value={editForm.birthDate}
                    onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Giới tính</label>
                  <select 
                    value={editForm.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium text-gray-900"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Mã số BHYT</label>
                  <input 
                    type="text" 
                    value={editForm.bhytCode}
                    onChange={(e) => setEditForm({ ...editForm, bhytCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Số CCCD</label>
                  <input 
                    type="text" 
                    value={editForm.idCard}
                    onChange={(e) => setEditForm({ ...editForm, idCard: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium text-gray-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Địa chỉ thường trú</label>
                  <input 
                    type="text" 
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium text-gray-900"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setModalType(null)} 
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-6 rounded-xl transition-colors text-sm"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  disabled={updatingId !== null}
                  className="bg-[#004e92] hover:bg-blue-800 text-white font-bold py-2.5 px-6 rounded-xl transition-colors text-sm disabled:opacity-50"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
