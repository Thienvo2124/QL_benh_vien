import { Users, UserPlus, Calendar, Activity, CheckCircle, Clock } from 'lucide-react';

const mockAppointments = [
  { id: '1', patient: 'Nguyễn Văn A', doctor: 'GS.TS. Nguyễn Minh Tuấn', dept: 'Tim mạch', time: '08:00 - 15/06', status: 'Đã hoàn thành' },
  { id: '2', patient: 'Trần Thị B', doctor: 'PGS.TS. Trần Hoàng Hải', dept: 'Tim mạch', time: '09:30 - 15/06', status: 'Đang khám' },
  { id: '3', patient: 'Lê Văn C', doctor: 'TS.BS. Lê Văn Hùng', dept: 'Thần kinh', time: '14:00 - 15/06', status: 'Chờ khám' },
  { id: '4', patient: 'Phạm Thị D', doctor: 'GS.TS. Nguyễn Minh Tuấn', dept: 'Tim mạch', time: '15:30 - 15/06', status: 'Chờ khám' },
];

const Dashboard = () => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống</h2>
          <p className="text-gray-500 text-sm mt-1">Cập nhật tình hình hoạt động của bệnh viện hôm nay.</p>
        </div>
        <button className="bg-[#004e92] hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          Tải báo cáo
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Tổng bệnh nhân</h3>
            <p className="text-3xl font-bold text-gray-800">1,245</p>
            <p className="text-sm text-green-500 mt-2 font-medium flex items-center gap-1">
              <Activity size={14} /> +12% tháng này
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl">
            <Users size={28} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Bác sĩ trực</h3>
            <p className="text-3xl font-bold text-gray-800">42</p>
            <p className="text-sm text-gray-400 mt-2 font-medium">Trên tổng số 120 bác sĩ</p>
          </div>
          <div className="bg-teal-50 p-4 rounded-xl">
            <UserPlus size={28} className="text-teal-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Lịch hẹn hôm nay</h3>
            <p className="text-3xl font-bold text-gray-800">86</p>
            <p className="text-sm text-orange-500 mt-2 font-medium flex items-center gap-1">
              <Clock size={14} /> 12 lịch sắp tới
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl">
            <Calendar size={28} className="text-orange-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#004e92] to-blue-800 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-center">
          <h3 className="text-blue-100 text-sm font-medium mb-1">Doanh thu dự kiến</h3>
          <p className="text-3xl font-bold">124M</p>
          <p className="text-sm text-blue-200 mt-2 font-medium">VND / Ngày hôm nay</p>
        </div>
      </div>

      {/* Recent Appointments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Lịch hẹn gần đây</h3>
          <a href="#" className="text-sm font-medium text-[#004e92] hover:underline">Xem tất cả</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Mã LH</th>
                <th className="p-4 font-medium">Bệnh nhân</th>
                <th className="p-4 font-medium">Bác sĩ phụ trách</th>
                <th className="p-4 font-medium">Chuyên khoa</th>
                <th className="p-4 font-medium">Thời gian</th>
                <th className="p-4 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {mockAppointments.map((app) => (
                <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">#{app.id}</td>
                  <td className="p-4 font-medium text-gray-800">{app.patient}</td>
                  <td className="p-4 text-gray-600">{app.doctor}</td>
                  <td className="p-4 text-gray-600">{app.dept}</td>
                  <td className="p-4 text-gray-600">{app.time}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center w-max gap-1
                      ${app.status === 'Đã hoàn thành' ? 'bg-green-100 text-green-700' : ''}
                      ${app.status === 'Đang khám' ? 'bg-blue-100 text-blue-700' : ''}
                      ${app.status === 'Chờ khám' ? 'bg-orange-100 text-orange-700' : ''}
                    `}>
                      {app.status === 'Đã hoàn thành' && <CheckCircle size={12} />}
                      {app.status === 'Đang khám' && <Activity size={12} />}
                      {app.status === 'Chờ khám' && <Clock size={12} />}
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
