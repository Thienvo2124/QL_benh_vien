import { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Activity, Calendar, Home, LogOut, Settings, Users } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      <aside className="w-64 bg-[#004e92] text-white flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-blue-800">
          <Activity className="w-6 h-6 mr-2" />
          <h1 className="text-xl font-bold uppercase tracking-wider">BV Nhân Dân</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link to="/dashboard" className="flex items-center px-4 py-3 bg-blue-800 rounded-lg transition-colors">
            <Home className="w-5 h-5 mr-3" />
            Tổng quan
          </Link>
          <Link to="/dashboard/patients" className="flex items-center px-4 py-3 hover:bg-blue-800 rounded-lg transition-colors">
            <Users className="w-5 h-5 mr-3" />
            Bệnh nhân
          </Link>
          <Link to="/dashboard/appointments" className="flex items-center px-4 py-3 hover:bg-blue-800 rounded-lg transition-colors">
            <Calendar className="w-5 h-5 mr-3" />
            Lịch hẹn
          </Link>
          <Link to="/dashboard/settings" className="flex items-center px-4 py-3 hover:bg-blue-800 rounded-lg transition-colors">
            <Settings className="w-5 h-5 mr-3" />
            Cài đặt
          </Link>
        </nav>

        <div className="p-4 border-t border-blue-800">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-red-300 hover:text-red-100 hover:bg-red-900/50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold text-gray-800">Bảng điều khiển</h2>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-gray-500">Xin chào,</span>{' '}
              <span className="font-bold text-[#004e92]">{user?.fullName || 'Bác sĩ'}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#004e92] font-bold border border-[#004e92]">
              {user?.fullName?.charAt(0) || 'BS'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
