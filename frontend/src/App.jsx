import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';

// Components & Layouts
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import News from './components/News';
import Footer from './components/Footer';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import Doctors from './pages/Doctors';
import Pricing from './pages/Pricing';


const LandingPage = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
    <Header />
    <main className="flex-grow">
      <Hero />
      <Services />
      <News />
    </main>
    <Footer />
  </div>
);

// PrivateRoute to protect /dashboard
const PrivateRoute = ({ children }) => {
    const { token } = useContext(AuthContext);
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/pricing" element={<Pricing />} />

          {/* Protected Admin/Doctor Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} />
            {/* Thêm các route khác như /dashboard/patients ở đây sau này */}
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
