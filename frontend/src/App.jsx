import React, { useState, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import News from "./components/News";
import Footer from "./components/Footer";
import SocialWidget from "./components/SocialWidget";
import WhyChooseUs from "./components/Whychooseus";
import Testimonials from "./components/Testimonials";
import AuthModal from "./components/AuthModal";

import Dashboard from "./pages/Dashboard";
import Booking from "./pages/Booking";
import Doctors from "./pages/Doctors";
import Pricing from "./pages/Pricing";
import Procedures from "./pages/Procedures";
import Training from "./pages/Training";
import DepartmentDetail from "./pages/DepartmentDetail";
import AboutPage from "./pages/AboutPage";
import SchedulePage from "./pages/SchedulePage";
import Contact from "./pages/Contact";
import AdminProcedures from "./pages/AdminProcedures";
import Activities from "./pages/Activities";

const LandingPage = () => (
  <>
    <Hero />
    <Services />
    <WhyChooseUs />
    <News />
    <Testimonials />
  </>
);

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/" />;
};

export default function App() {
  // ⚠️ FIX: thiếu import useState là nguyên nhân chính gây lỗi crash trước đó
  const [authType, setAuthType] = useState(null); // null | "login" | "register"

  return (
    <BrowserRouter>
      <AuthProvider>
        <Header
          onLogin={() => setAuthType("login")}
          onRegister={() => setAuthType("register")}
        />

        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/booking" element={<Booking />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/procedures" element={<Procedures />} />
          <Route path="/training" element={<Training />} />
          <Route path="/departmentdetail/:slug" element={<DepartmentDetail />} />
          <Route path="/aboutpage" element={<AboutPage />} />
          <Route path="/schedulepage" element={<SchedulePage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/adminprocedures" element={<AdminProcedures />} />
          <Route path="/activities" element={<Activities />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Không còn route /login, /register riêng — toàn bộ xử lý qua AuthModal */}
        </Routes>

        {/* Modal đăng nhập / đăng ký — đè lên trang hiện tại, nền tối nhẹ */}
        {authType && (
          <AuthModal
            type={authType}
            onClose={() => setAuthType(null)}
            onSwitch={(nextType) => setAuthType(nextType)}
          />
        )}

        <SocialWidget />
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}