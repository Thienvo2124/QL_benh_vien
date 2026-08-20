import { useState, useEffect, useCallback } from 'react';
import { FolderOpen, Search, User, FileText, DollarSign, Pill, Eye, ChevronRight, X, UserCheck, Clock, CheckCircle, Clipboard } from 'lucide-react';
import API_BASE_URL from '../config/api';

const SummaryRecords = () => {
  const [activeTab, setActiveTab] = useState('staff'); // staff | patient | billing | medicine
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [staffRoleFilter, setStaffRoleFilter] = useState('all'); // all | admin | doctor | nurse | cashier
  
  // Data States
  const [staffList, setStaffList] = useState([]);
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [medicinesList, setMedicinesList] = useState([]);
  
  // Detail Modal States
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalType, setModalType] = useState(null); // 'patient_detail' | 'billing_detail'

  // Fetch all data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      if (!token) return;

      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [usersRes, appsRes, medsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/users`, { headers }),
        fetch(`${API_BASE_URL}/api/appointments`, { headers }),
        fetch(`${API_BASE_URL}/api/medicines`, { headers })
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setStaffList(usersData);
      }
      
      if (appsRes.ok) {
        const appsData = await appsRes.json();
        setAppointmentsList(appsData);
      }

      if (medsRes.ok) {
        const medsData = await medsRes.json();
        setMedicinesList(medsData);
      }
    } catch (err) {
      console.error("Lỗi khi tải hồ sơ tổng hợp:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Clean data lists
  const staffArr = (Array.isArray(staffList) ? staffList : []).filter(u => u.role !== 'patient');
  const appointmentsArr = Array.isArray(appointmentsList) ? appointmentsList : [];
  const medicinesArr = Array.isArray(medicinesList) ? medicinesList : [];

  // Filtered lists based on search
  const filteredStaff = staffArr.filter(u => {
    const matchesRole = staffRoleFilter === 'all' || u.role === staffRoleFilter;
    const term = searchQuery.toLowerCase();
    const matchesSearch = u.fullName?.toLowerCase().includes(term) ||
           u.email?.toLowerCase().includes(term) ||
           u.phone?.includes(term) ||
           u.position?.toLowerCase().includes(term);
    return matchesRole && matchesSearch;
  });

  const filteredAppointments = appointmentsArr.filter(app => {
    const term = searchQuery.toLowerCase();
    return app.name?.toLowerCase().includes(term) ||
           app.phone?.includes(term) ||
           app.appointmentCode?.toLowerCase().includes(term) ||
           app.dept?.toLowerCase().includes(term) ||
           app.doctor?.toLowerCase().includes(term) ||
           app.diagnosis?.toLowerCase().includes(term);
  });

  const filteredMedicines = medicinesArr.filter(m => {
    const term = searchQuery.toLowerCase();
    return m.name?.toLowerCase().includes(term) ||
           m.code?.toLowerCase().includes(term) ||
           m.category?.toLowerCase().includes(term);
  });

  const prescriptionsArr = appointmentsArr.filter(app => app.prescriptionStatus && app.prescriptionStatus !== 'none');
  
  const filteredPrescriptions = prescriptionsArr.filter(app => {
    const term = searchQuery.toLowerCase();
    return app.name?.toLowerCase().includes(term) ||
           app.phone?.includes(term) ||
           app.appointmentCode?.toLowerCase().includes(term) ||
           app.doctor?.toLowerCase().includes(term) ||
           (app.prescription && app.prescription.some(item => item.name?.toLowerCase().includes(term)));
  });

  // Unique patients derived from appointments
  const getUniquePatients = () => {
    const patientsMap = {};
    appointmentsArr.forEach(app => {
      if (!app.phone) return;
      if (!patientsMap[app.phone] || new Date(app.createdAt) > new Date(patientsMap[app.phone].lastVisit)) {
        patientsMap[app.phone] = {
          name: app.name,
          phone: app.phone,
          dob: app.dob,
          gender: app.gender,
          address: app.address,
          bhyt: app.bhyt,
          cccd: app.cccd,
          lastVisit: app.date || app.createdAt,
          visitsCount: (patientsMap[app.phone]?.visitsCount || 0) + 1,
          latestDept: app.dept,
          latestDoctor: app.doctor
        };
      } else {
        patientsMap[app.phone].visitsCount += 1;
      }
    });
    return Object.values(patientsMap);
  };

  const uniquePatients = getUniquePatients();
  const filteredPatients = uniquePatients.filter(p => {
    const term = searchQuery.toLowerCase();
    return p.name?.toLowerCase().includes(term) ||
           p.phone?.includes(term) ||
           p.address?.toLowerCase().includes(term) ||
           p.bhyt?.toLowerCase().includes(term) ||
           p.cccd?.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-wide flex items-center gap-3">
            <FolderOpen className="w-8 h-8 text-[#004e92]" /> Tổng hợp Hồ sơ Hệ thống
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Tra cứu và quản lý tập trung toàn bộ dữ liệu nhân sự, bệnh án vãng lai, lịch sử giao dịch và kho dược phẩm.
          </p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="bg-gray-200/60 p-1.5 rounded-2xl flex flex-wrap gap-2 w-full shadow-inner border border-gray-300/40">
        {[
          { id: 'staff', label: 'Quản lý người dùng', icon: User, count: staffArr.length },
          { id: 'patient', label: 'Hồ sơ Bệnh nhân', icon: FileText, count: uniquePatients.length },
          { id: 'prescription', label: 'Danh sách Đơn thuốc', icon: Clipboard, count: prescriptionsArr.length },
          { id: 'billing', label: 'Lịch sử Giao dịch', icon: DollarSign, count: appointmentsArr.length },
          { id: 'medicine', label: 'Danh mục Thuốc', icon: Pill, count: medicinesArr.length }
        ].map(t => {
          const Icon = t.icon;
          const isSelected = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shrink-0 ${
                isSelected
                  ? 'bg-[#004e92] text-white shadow-lg transform -translate-y-0.5'
                  : 'text-gray-600 hover:bg-gray-300/50'
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label} ({t.count})
            </button>
          );
        })}
      </div>

      {/* Search Input & Sub-tabs */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">
        <div className="relative max-w-md">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'staff' ? "Tìm kiếm tài khoản theo tên, email, sđt, vị trí..." :
              activeTab === 'patient' ? "Tìm kiếm bệnh nhân theo tên, sđt, địa chỉ..." :
              activeTab === 'prescription' ? "Tìm kiếm đơn thuốc theo tên bệnh nhân, mã HSBN, thuốc..." :
              activeTab === 'billing' ? "Tìm kiếm giao dịch theo tên bệnh nhân, mã số, phòng khám..." :
              "Tìm kiếm thuốc theo tên, mã số, phân loại..."
            }
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] focus:bg-white transition-all font-medium"
          />
        </div>

        {/* Sub-tabs for Staff Role Filter */}
        {activeTab === 'staff' && (
          <div className="flex flex-wrap gap-2 border-t pt-4 border-gray-100">
            {[
              { id: 'all', label: 'Tất cả', count: staffArr.length },
              { id: 'admin', label: 'Quản trị viên', count: staffArr.filter(u => u.role === 'admin').length },
              { id: 'doctor', label: 'Bác sĩ', count: staffArr.filter(u => u.role === 'doctor').length },
              { id: 'nurse', label: 'Dược sĩ / Y tá', count: staffArr.filter(u => u.role === 'nurse').length },
              { id: 'cashier', label: 'Thu ngân', count: staffArr.filter(u => u.role === 'cashier').length }
            ].map(sub => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setStaffRoleFilter(sub.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  staffRoleFilter === sub.id
                    ? 'bg-blue-50 text-[#004e92] border-blue-200 shadow-sm'
                    : 'bg-white hover:bg-gray-50 text-gray-500 border-gray-200'
                }`}
              >
                {sub.label} ({sub.count})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB CONTENT */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 italic">Đang tải dữ liệu hồ sơ...</div>
        ) : (
          <div className="overflow-x-auto">
            {/* 1. STAFF TAB */}
            {activeTab === 'staff' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <th className="p-5 text-center">STT</th>
                    <th className="p-5">Họ và tên / Email</th>
                    <th className="p-5">Số điện thoại</th>
                    <th className="p-5">Vai trò hệ thống</th>
                    <th className="p-5">Chức danh / Phòng ban</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100 font-semibold text-gray-700">
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((u, i) => (
                      <tr key={u._id} className="hover:bg-blue-50/10 transition-colors">
                        <td className="p-5 text-center text-gray-400 font-bold">{i + 1}</td>
                        <td className="p-5">
                          <div className="font-bold text-gray-900">{u.fullName || 'Chưa cập nhật'}</div>
                          <div className="text-xs text-gray-400 font-mono mt-0.5">{u.email}</div>
                        </td>
                        <td className="p-5 text-gray-600 font-mono">{u.phone || 'N/A'}</td>
                        <td className="p-5">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                            u.role === 'admin' ? 'bg-red-50 text-red-700 border-red-100' :
                            u.role === 'doctor' ? 'bg-blue-50 text-[#004e92] border-blue-100' :
                            u.role === 'nurse' ? 'bg-teal-50 text-teal-700 border-teal-100' :
                            u.role === 'cashier' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            'bg-gray-50 text-gray-600 border-gray-100'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-5">
                          <div className="text-gray-900">{u.position || 'Nhân sự bệnh viện'}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5 font-bold uppercase">{u.dept || 'Phòng ban chung'}</div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-400 italic">Không tìm thấy tài khoản nhân sự nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {/* 2. PATIENTS TAB */}
            {activeTab === 'patient' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <th className="p-5 text-center">STT</th>
                    <th className="p-5">Bệnh nhân / Địa chỉ</th>
                    <th className="p-5">Năm sinh / Giới tính</th>
                    <th className="p-5">Mã thẻ BHYT</th>
                    <th className="p-5 text-center">Lượt khám</th>
                    <th className="p-5 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100 font-semibold text-gray-700">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((p, i) => (
                      <tr key={p.phone} className="hover:bg-blue-50/10 transition-colors">
                        <td className="p-5 text-center text-gray-400 font-bold">{i + 1}</td>
                        <td className="p-5">
                          <div className="font-bold text-gray-900">{p.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">SĐT: {p.phone} | Đ/c: {p.address || 'Chưa cập nhật'}</div>
                          {p.cccd && (
                            <div className="text-xs text-gray-500 mt-0.5">🪪 CCCD: <span className="font-bold text-gray-700">{p.cccd}</span></div>
                          )}
                        </td>
                        <td className="p-5">
                          <div>{p.dob ? new Date(p.dob).toLocaleDateString('vi-VN') : 'N/A'}</div>
                          <div className="text-xs text-gray-400 mt-0.5">Giới tính: {p.gender || 'Nam'}</div>
                        </td>
                        <td className="p-5 font-mono text-xs text-gray-600 font-bold">{p.bhyt || 'Không có BHYT'}</td>
                        <td className="p-5 text-center">
                          <span className="bg-blue-50 text-[#004e92] px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                            {p.visitsCount} lượt
                          </span>
                        </td>
                        <td className="p-5 text-center">
                          <button
                            onClick={() => { setSelectedRecord(p); setModalType('patient_detail'); }}
                            className="bg-blue-50 hover:bg-[#004e92] text-[#004e92] hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold border border-blue-100 transition-all inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" /> Lịch sử khám
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-400 italic">Không tìm thấy bệnh nhân nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {/* 3. BILLING TAB */}
            {activeTab === 'billing' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <th className="p-5 text-center">STT</th>
                    <th className="p-5">Thời gian / Mã hóa đơn</th>
                    <th className="p-5">Bệnh nhân / SĐT</th>
                    <th className="p-5">Dịch vụ / Phòng khoa</th>
                    <th className="p-5 text-right">Tổng thanh toán</th>
                    <th className="p-5 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100 font-semibold text-gray-700">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((app, i) => {
                      const hasExamPaid = app.paymentStatus === 'paid';
                      const hasPrescriptionPaid = app.prescriptionStatus === 'paid';
                      
                      let total = 0;
                      if (hasExamPaid) total += app.initialFee || 150000;
                      if (app.prescription && app.prescription.length > 0) {
                        const cost = app.prescription.reduce((sum, item) => sum + (item.price * item.qty), 0);
                        const disc = app.bhyt ? Math.floor(cost * 0.8) : 0;
                        total += (cost - disc);
                      }

                      return (
                        <tr key={app._id} className="hover:bg-blue-50/10 transition-colors">
                          <td className="p-5 text-center text-gray-400 font-bold">{i + 1}</td>
                          <td className="p-5">
                            <div className="font-bold text-gray-900">{new Date(app.createdAt || app.date).toLocaleString('vi-VN')}</div>
                            <div className="text-xs font-mono text-gray-400 font-bold tracking-wider mt-0.5">{app.appointmentCode || 'HĐ-CHƯA_CÓ'}</div>
                          </td>
                          <td className="p-5">
                            <div className="font-bold text-gray-800">{app.name}</div>
                            <div className="text-xs text-gray-400 font-mono mt-0.5">{app.phone}</div>
                          </td>
                          <td className="p-5">
                            <div className="text-gray-900 text-xs font-bold bg-blue-50 border border-blue-100 text-[#004e92] px-2.5 py-1 rounded-full w-max">
                              {app.dept}
                            </div>
                            <div className="text-[10px] text-gray-400 mt-1 font-bold">BS: {app.doctor || 'Tự phân công'}</div>
                          </td>
                          <td className="p-5 text-right font-mono font-bold text-base text-gray-900">
                            {total.toLocaleString('vi-VN')} đ
                          </td>
                          <td className="p-5 text-center">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                              hasExamPaid && (app.prescriptionStatus === 'none' || hasPrescriptionPaid)
                                ? 'bg-green-50 text-green-700 border-green-100'
                                : 'bg-red-50 text-red-700 border-red-100'
                            }`}>
                              {hasExamPaid && (app.prescriptionStatus === 'none' || hasPrescriptionPaid) ? 'Đã thu đủ' : 'Chưa đóng đủ'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-400 italic">Không tìm thấy lịch sử giao dịch nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {/* 5. PRESCRIPTION TAB */}
            {activeTab === 'prescription' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <th className="p-5 text-center">STT</th>
                    <th className="p-5">Mã HSBN</th>
                    <th className="p-5">Bệnh nhân</th>
                    <th className="p-5">Bác sĩ kê đơn / Chuyên khoa</th>
                    <th className="p-5">Đơn thuốc</th>
                    <th className="p-5 text-right">Tổng tiền thuốc</th>
                    <th className="p-5 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100 font-semibold text-gray-700">
                  {filteredPrescriptions.length > 0 ? (
                    filteredPrescriptions.map((app, i) => {
                      const cost = app.prescription ? app.prescription.reduce((s, item) => s + (item.price * item.qty), 0) : 0;
                      const disc = app.bhyt ? cost * 0.8 : 0;
                      const finalCost = cost - disc;

                      return (
                        <tr key={app._id} className="hover:bg-blue-50/10 transition-colors">
                          <td className="p-5 text-center text-gray-400 font-bold">{i + 1}</td>
                          <td className="p-5 font-mono text-gray-900 font-bold">{app.appointmentCode}</td>
                          <td className="p-5">
                            <div className="font-bold text-gray-900">{app.name}</div>
                            <div className="text-xs text-gray-400 mt-0.5">SĐT: {app.phone}</div>
                          </td>
                          <td className="p-5">
                            <div className="font-bold text-gray-900">{app.doctor || 'Hệ thống'}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{app.dept}</div>
                          </td>
                          <td className="p-5 max-w-[280px]">
                            <div className="text-xs text-gray-600 space-y-1 block max-h-[100px] overflow-y-auto">
                              {app.prescription.map((item, idx) => (
                                <div key={idx} className="truncate">
                                  💊 {item.name} (x{item.qty} {item.unit || 'Viên'})
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-5 text-right font-mono font-bold text-[#004e92]">
                            {finalCost.toLocaleString('vi-VN')} đ
                            {app.bhyt && <span className="text-[10px] text-emerald-600 block font-sans">Đã giảm BHYT 80%</span>}
                          </td>
                          <td className="p-5 text-center text-xs">
                            <span className={`px-2.5 py-1 rounded-lg font-bold border ${
                              app.prescriptionStatus === 'dispensed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : app.prescriptionStatus === 'paid'
                                ? 'bg-blue-50 text-blue-700 border-blue-100'
                                : 'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                              {app.prescriptionStatus === 'dispensed' ? 'Đã cấp phát' : 
                               app.prescriptionStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-gray-400 italic">Không tìm thấy đơn thuốc nào phù hợp.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {/* 4. MEDICINE TAB */}
            {activeTab === 'medicine' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <th className="p-5 text-center">STT</th>
                    <th className="p-5">Tên thuốc / Mã vạch</th>
                    <th className="p-5">Nhóm công dụng</th>
                    <th className="p-5">Đơn giá bán</th>
                    <th className="p-5 text-center">Tồn kho</th>
                    <th className="p-5">Hạn sử dụng</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100 font-semibold text-gray-700">
                  {filteredMedicines.length > 0 ? (
                    filteredMedicines.map((m, i) => (
                      <tr key={m._id} className="hover:bg-blue-50/10 transition-colors">
                        <td className="p-5 text-center text-gray-400 font-bold">{i + 1}</td>
                        <td className="p-5">
                          <div className="font-bold text-gray-900">{m.name}</div>
                          <div className="text-xs font-mono text-gray-400 mt-0.5">Mã: {m.code || 'N/A'}</div>
                        </td>
                        <td className="p-5 text-gray-600">{m.category || 'Thuốc điều trị chung'}</td>
                        <td className="p-5 font-mono font-bold text-[#004e92]">{(m.price || 0).toLocaleString('vi-VN')} đ / {m.unit || 'Viên'}</td>
                        <td className="p-5 text-center">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                            m.stock <= 50 ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-gray-50 text-gray-700 border border-gray-100'
                          }`}>
                            {m.stock} {m.unit || 'Viên'}
                          </span>
                        </td>
                        <td className="p-5 font-mono text-xs text-gray-500">{m.expiryDate ? new Date(m.expiryDate).toLocaleDateString('vi-VN') : 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-400 italic">Không tìm thấy dược phẩm nào trong kho.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {modalType === 'patient_detail' && selectedRecord && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl p-6 relative border border-gray-100 space-y-6">
            <button 
              onClick={() => { setSelectedRecord(null); setModalType(null); }}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#004e92]" /> Chi tiết Lịch sử khám bệnh vãng lai
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs font-semibold text-gray-600">
                <div>Họ tên: <strong className="text-gray-900 text-sm block mt-0.5">{selectedRecord.name}</strong></div>
                <div>Số điện thoại: <strong className="text-gray-900 font-mono text-sm block mt-0.5">{selectedRecord.phone}</strong></div>
                <div>Năm sinh: <strong className="text-gray-900 block mt-0.5">{selectedRecord.dob ? new Date(selectedRecord.dob).toLocaleDateString('vi-VN') : 'N/A'}</strong></div>
                <div>Địa chỉ: <strong className="text-gray-900 block mt-0.5">{selectedRecord.address || 'Chưa cập nhật'}</strong></div>
              </div>
            </div>

            {/* List of Visits */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Danh sách các ca khám lâm sàng</h4>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {appointmentsArr.filter(app => app.phone === selectedRecord.phone).map((app, idx) => (
                  <div key={app._id} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-5 space-y-3">
                    <div className="flex flex-wrap justify-between items-center border-b pb-2 border-dashed border-gray-200">
                      <span className="text-xs font-mono font-bold text-[#004e92]">{app.appointmentCode || 'HĐ-N/A'}</span>
                      <span className="text-xs text-gray-400 font-semibold">{new Date(app.createdAt || app.date).toLocaleString('vi-VN')}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-400 font-semibold block">Khoa điều phối & Bác sĩ</span>
                        <strong className="text-gray-800 font-bold block mt-0.5">{app.dept} (BS: {app.doctor || 'Tự phân công'})</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 font-semibold block">Triệu chứng & Bệnh sử</span>
                        <p className="text-gray-700 mt-0.5">{app.symptoms || 'Chưa ghi nhận'}</p>
                      </div>
                      <div className="md:col-span-2 border-t pt-2 border-gray-100">
                        <span className="text-gray-400 font-semibold block">Chẩn đoán từ bác sĩ chuyên khoa</span>
                        <p className="text-gray-900 font-bold mt-0.5">{app.diagnosis || 'Đang chờ bác sĩ chẩn đoán'}</p>
                      </div>
                      {app.treatment && (
                        <div className="md:col-span-2 border-t pt-2 border-gray-100">
                          <span className="text-gray-400 font-semibold block">Phương pháp điều trị / Chỉ định</span>
                          <p className="text-gray-800 mt-0.5">{app.treatment}</p>
                        </div>
                      )}
                      {app.prescription && app.prescription.length > 0 && (
                        <div className="md:col-span-2 border-t pt-2 border-gray-100">
                          <span className="text-gray-400 font-semibold block mb-1">Toa thuốc điều trị</span>
                          <div className="bg-white border border-gray-100 rounded-xl p-3 space-y-2">
                            {app.prescription.map((item, i) => (
                              <div key={i} className="flex justify-between text-[11px] text-gray-600 font-semibold">
                                <span>{item.name} (x{item.qty} {item.unit})</span>
                                <span className="text-gray-400 italic">{item.usage}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={() => { setSelectedRecord(null); setModalType(null); }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-6 rounded-2xl transition-colors text-sm"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryRecords;
