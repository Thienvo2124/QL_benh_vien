import { useContext, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Activity, Calendar, Home, LogOut, Settings, Users, Pill, Globe, User, Shield, ChevronDown } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      <aside className="w-64 bg-[#004e92] text-white flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-blue-800">
          <Activity className="w-6 h-6 mr-2" />
          <h1 className="text-xl font-bold uppercase tracking-wider">BV Nhân Dân</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link to="/dashboard" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === '/dashboard' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}>
            <Home className="w-5 h-5 mr-3" />
            Tổng quan
          </Link>
          <Link to="/dashboard/users" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === '/dashboard/users' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}>
            <Users className="w-5 h-5 mr-3" />
            Người dùng
          </Link>
          <Link to="/dashboard/appointments" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === '/dashboard/appointments' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}>
            <Calendar className="w-5 h-5 mr-3" />
            Lịch hẹn
          </Link>
          <Link to="/dashboard/medicines" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === '/dashboard/medicines' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}>
            <Pill className="w-5 h-5 mr-3" />
            Kho thuốc
          </Link>
          <Link to="/dashboard/settings" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === '/dashboard/settings' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}>
            <Settings className="w-5 h-5 mr-3" />
            Cài đặt
          </Link>
        </nav>

        <div className="p-4 border-t border-blue-800 space-y-2">
          <Link
            to="/"
            className="flex items-center w-full px-4 py-2 text-blue-200 hover:text-white hover:bg-blue-800 rounded-lg transition-colors font-medium"
          >
            <Globe className="w-5 h-5 mr-3 text-blue-300" />
            Về trang chủ
          </Link>
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
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 relative">
          <h2 className="text-xl font-semibold text-gray-800">Bảng điều khiển</h2>
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-xl transition-colors border border-transparent hover:border-gray-200 focus:outline-none"
            >
              <div className="text-sm text-right hidden sm:block">
                <span className="text-gray-500">Xin chào,</span>{' '}
                <span className="font-bold text-[#004e92]">{user?.fullName || 'Bác sĩ'}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#004e92] font-bold border border-[#004e92] shadow-sm">
                {user?.fullName?.charAt(0) || 'BS'}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 top-14 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-fadeIn">
                <div className="px-5 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-[#004e92] font-bold border-2 border-[#004e92] text-lg shadow-inner">
                      {user?.fullName?.charAt(0) || 'BS'}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-base">{user?.fullName || 'Tài khoản Bác sĩ'}</div>
                      <div className="text-xs text-gray-500">{user?.email || 'admin@gmail.com'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-blue-50 text-[#004e92] text-xs font-semibold px-2.5 py-1 rounded-full w-max mt-1 border border-blue-100 shadow-sm">
                    <Shield className="w-3.5 h-3.5" />
                    <span>{user?.role === 'admin' ? 'Quản trị viên hệ thống' : 'Bác sĩ chuyên khoa'}</span>
                  </div>
                </div>

                <div className="py-2 px-3 space-y-1">
                  <Link
                    to="/dashboard/settings"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors font-medium gap-3"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    Hồ sơ cá nhân
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors font-medium gap-3"
                  >
                    <Settings className="w-4 h-4 text-gray-500" />
                    Cài đặt tài khoản
                  </Link>
                </div>

                <div className="p-3 border-t border-gray-100">
                  <button
                    onClick={() => { setIsProfileMenuOpen(false); logout(); }}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold gap-3"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
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
