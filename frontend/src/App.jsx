import { useContext } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthContext, AuthProvider } from './contexts/AuthContext';

import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import News from './components/News';
import Services from './components/Services';
import AdminLayout from './layouts/AdminLayout';

import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import Pricing from './pages/Pricing';
import Register from './pages/Register';
import Schedule from './pages/Schedule';
import Procedures from './pages/Procedures';
import SpecialtyDetail from './pages/SpecialtyDetail';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Medicines from './pages/Medicines';
import MyAppointments from './pages/MyAppointments';
import MyRecords from './pages/MyRecords';
import Profile from './pages/Profile';

const LandingPage = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800 relative">
    <Header />
    <main className="flex-grow">
      <Hero />
      <Services />
      <News />
    </main>
    <Footer />
  </div>
);

const PrivateRoute = ({ children }) => {
  const { token, user } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Bảo mật phân quyền: Nếu user là bệnh nhân (patient), tuyệt đối không cho vào Admin Dashboard
  if (user && user.role === 'patient') {
    return <Navigate to="/booking" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="relative">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/my-appointments" element={<MyAppointments />} />
            <Route path="/my-records" element={<MyRecords />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/procedures" element={<Procedures />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/chuyen-khoa/:slug" element={<SpecialtyDetail />} />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="patients" element={<Patients />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="medicines" element={<Medicines />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>

          <Chatbot />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
