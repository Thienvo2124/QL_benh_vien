import { useState, useEffect, useCallback } from 'react';
import { Trash2, Search, RotateCcw, Phone, Calendar, Pill, FileText, Activity, DollarSign, Clipboard, ShieldAlert } from 'lucide-react';
import API_BASE_URL from '../config/api';

const Trash = () => {
  const [deletedAppointments, setDeletedAppointments] = useState([]);
  const [deletedMedicines, setDeletedMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState('');
  const [activeTab, setActiveTab] = useState('appointments'); // appointments | cashier | medical_records | pharmacy | medicines

  // Tải danh sách lịch hẹn trong thùng rác
  const fetchAppointmentsTrash = useCallback(async () => {
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
        setDeletedAppointments(data);
      }
    } catch (error) {
      console.error("Lỗi khi tải lịch hẹn trong thùng rác:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Tải danh sách thuốc trong thùng rác
  const fetchMedicinesTrash = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/medicines/trash`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDeletedMedicines(data);
      }
    } catch (error) {
      console.error("Lỗi khi tải thuốc trong thùng rác:", error);
    }
  }, []);

  const refreshAllData = useCallback(() => {
    fetchAppointmentsTrash();
    fetchMedicinesTrash();
  }, [fetchAppointmentsTrash, fetchMedicinesTrash]);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Khôi phục ca khám / lịch hẹn
  const handleRestoreAppointment = async (id, patientName) => {
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
        refreshAllData();
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

  // Khôi phục thuốc vào kho
  const handleRestoreMedicine = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn KHÔI PHỤC thuốc ${name} vào kho hàng?`)) {
      return;
    }
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/medicines/${id}/restore`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setNotification(`✅ Đã khôi phục thành công thuốc ${name} vào kho!`);
        refreshAllData();
        setTimeout(() => setNotification(''), 3000);
      } else {
        const data = await response.json();
        alert(data.message || "Lỗi khi khôi phục thuốc.");
      }
    } catch (error) {
      console.error("Lỗi khi khôi phục thuốc:", error);
      alert("Lỗi kết nối máy chủ.");
    }
  };

  // PHÂN CHIA PHÂN VÙNG DỮ LIỆU ĐÃ XÓA
  // 1. Lịch hẹn (Đăng ký chưa khám & Chưa đóng tiền)
  const trashAppointments = deletedAppointments.filter(app => app.status !== 'completed' && app.paymentStatus === 'unpaid');

  // 2. Quầy thu ngân (Chưa thanh toán phí khám hoặc phí đơn thuốc)
  const trashBilling = deletedAppointments.filter(app => app.paymentStatus === 'unpaid' || app.prescriptionStatus === 'unpaid');

  // 3. Hồ sơ bệnh án (Bác sĩ đã hoàn thành khám bệnh)
  const trashMedicalRecords = deletedAppointments.filter(app => app.status === 'completed');

  // 4. Quầy cấp thuốc (Đã hoàn thành đóng tiền thuốc, chờ cấp thuốc)
  const trashPharmacy = deletedAppointments.filter(app => app.prescriptionStatus === 'paid' || app.prescriptionStatus === 'dispensed');

  // 5. Kho thuốc (Lấy từ deletedMedicines)
  const trashMedicines = deletedMedicines;

  // Lấy danh sách hiển thị và tìm kiếm cho tab active
  const getActiveTabRecords = () => {
    switch (activeTab) {
      case 'appointments': return trashAppointments;
      case 'cashier': return trashBilling;
      case 'medical_records': return trashMedicalRecords;
      case 'pharmacy': return trashPharmacy;
      case 'medicines': return trashMedicines;
      default: return [];
    }
  };

  const activeRecords = getActiveTabRecords();

  const filteredRecords = activeRecords.filter(rec => {
    if (!rec) return false;
    const query = searchQuery.toLowerCase();
    
    // Nếu là thuốc
    if (activeTab === 'medicines') {
      const name = rec.name || '';
      const category = rec.category || '';
      return name.toLowerCase().includes(query) || category.toLowerCase().includes(query);
    }
    
    // Nếu là lịch hẹn/ca khám
    const name = rec.name || '';
    const phone = rec.phone || '';
    const code = rec.appointmentCode || '';
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
            Nơi tập hợp các dữ liệu đã bị xóa từ các phân hệ. Chỉ có nút khôi phục, hoàn toàn không có nút xóa vĩnh viễn để phòng ngừa rủi ro mất mát dữ liệu.
          </p>
        </div>
      </div>

      {/* NOTIFICATION MESSAGE */}
      {notification && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl text-sm font-semibold flex items-center gap-3 shadow-sm animate-fadeIn">
          <span className="text-lg">🔔</span>
          {notification}
        </div>
      )}

      {/* TABS CHUYỂN PHÂN VÙNG DỮ LIỆU ĐÃ XÓA */}
      <div className="flex flex-wrap border-b border-gray-200 gap-2">
        <button
          onClick={() => { setActiveTab('appointments'); setSearchQuery(''); }}
          className={`pb-4 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'appointments'
              ? 'border-[#004e92] text-[#004e92]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Calendar className="w-4 h-4" /> Lịch hẹn ({trashAppointments.length})
        </button>

        <button
          onClick={() => { setActiveTab('cashier'); setSearchQuery(''); }}
          className={`pb-4 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'cashier'
              ? 'border-[#004e92] text-[#004e92]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <DollarSign className="w-4 h-4" /> Quầy thu ngân ({trashBilling.length})
        </button>

        <button
          onClick={() => { setActiveTab('medical_records'); setSearchQuery(''); }}
          className={`pb-4 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'medical_records'
              ? 'border-[#004e92] text-[#004e92]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <FileText className="w-4 h-4" /> Hồ sơ bệnh án ({trashMedicalRecords.length})
        </button>

        <button
          onClick={() => { setActiveTab('pharmacy'); setSearchQuery(''); }}
          className={`pb-4 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'pharmacy'
              ? 'border-[#004e92] text-[#004e92]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Clipboard className="w-4 h-4" /> Quầy cấp thuốc ({trashPharmacy.length})
        </button>

        <button
          onClick={() => { setActiveTab('medicines'); setSearchQuery(''); }}
          className={`pb-4 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'medicines'
              ? 'border-[#004e92] text-[#004e92]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Pill className="w-4 h-4" /> Kho thuốc ({trashMedicines.length})
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[280px] max-w-md">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={
              activeTab === 'medicines' 
                ? "Tìm kiếm thuốc đã xóa (Tên thuốc, nhóm thuốc...)" 
                : "Tìm kiếm hồ sơ đã xóa (Tên, SĐT, Mã hồ sơ...)"
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-colors font-medium"
          />
        </div>
        <div className="text-sm text-gray-500 font-semibold">
          Kết quả tìm thấy: <strong className="text-gray-900">{filteredRecords.length} dòng dữ liệu</strong>
        </div>
      </div>

      {/* RENDER DỮ LIỆU THEO TỪNG PHÂN VÙNG */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
        <div className="overflow-x-auto">
          {activeTab !== 'medicines' ? (
            // BẢNG HIỂN THỊ CÁC CA KHÁM / LỊCH HẸN / HÓA ĐƠN
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="p-5 font-medium text-center w-16">STT</th>
                  <th className="p-5 font-medium">Bệnh nhân & Mã hồ sơ</th>
                  <th className="p-5 font-medium">Chuyên khoa & Bác sĩ</th>
                  <th className="p-5 font-medium">Thời gian khám</th>
                  <th className="p-5 font-medium">Trạng thái trước xóa</th>
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
                          <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5 font-semibold">
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
                          <div className="flex flex-col gap-1.5">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded border w-max block ${
                              rec.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                            }`}>
                              {rec.paymentStatus === 'paid' ? '✓ Đã đóng phí khám' : '⏰ Chưa đóng phí khám'}
                            </span>
                            {hasPrescription && (
                              <span className={`text-xs font-bold px-2 py-0.5 rounded border w-max block ${
                                rec.prescriptionStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                              }`}>
                                💊 Đơn thuốc ({rec.prescriptionStatus === 'paid' ? 'Đã đóng tiền' : 'Chờ đóng tiền'})
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-5 text-center">
                          <button
                            onClick={() => handleRestoreAppointment(rec._id, rec.name)}
                            className="bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold py-2 px-4 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 shadow-sm border border-emerald-200 hover:border-transparent mx-auto"
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
                      Phân vùng dữ liệu đã chọn đang trống.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            // BẢNG HIỂN THỊ KHO THUỐC ĐÃ XÓA
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="p-5 font-medium text-center w-16">STT</th>
                  <th className="p-5 font-medium">Tên thuốc & Nhóm thuốc</th>
                  <th className="p-5 font-medium">Đơn vị & Cách dùng</th>
                  <th className="p-5 font-medium text-right">Đơn giá bán</th>
                  <th className="p-5 font-medium text-center">Số lượng tồn kho</th>
                  <th className="p-5 font-medium text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((med, index) => (
                    <tr key={med._id} className="hover:bg-red-50/5 transition-colors">
                      <td className="p-5 font-bold text-gray-700 text-center">{index + 1}</td>
                      <td className="p-5">
                        <div className="font-bold text-gray-900 text-base">{med.name}</div>
                        <span className="text-[10px] font-bold text-[#004e92] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full mt-1.5 inline-block">
                          {med.category}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="font-semibold text-gray-800">Đơn vị: {med.unit}</div>
                        <div className="text-xs text-gray-500 mt-0.5 font-medium">Cách dùng: {med.usage || 'Chưa cập nhật'}</div>
                      </td>
                      <td className="p-5 text-right font-mono font-bold text-[#004e92]">
                        {med.price ? med.price.toLocaleString('vi-VN') : '0'} đ
                      </td>
                      <td className="p-5 text-center font-bold text-gray-800">
                        {med.quantity}
                      </td>
                      <td className="p-5 text-center">
                        <button
                          onClick={() => handleRestoreMedicine(med._id, med.name)}
                          className="bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold py-2 px-4 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 shadow-sm border border-emerald-200 hover:border-transparent mx-auto"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Khôi phục
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-gray-400 font-semibold">
                      Thùng rác Kho thuốc hiện đang trống.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trash;
