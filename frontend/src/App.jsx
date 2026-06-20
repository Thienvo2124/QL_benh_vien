import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';

import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import News from './components/News';
import Footer from './components/Footer';
import SocialWidget from './components/SocialWidget';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import Doctors from './pages/Doctors';
import Pricing from './pages/Pricing';
import Procedures from './pages/Procedures';
import Training from './pages/Training';
import DepartmentDetail from './pages/DepartmentDetail';
import AboutPage from './pages/AboutPage';
import SchedulePage from './pages/SchedulePage';
import Contact from './pages/Contact';
import AdminProcedures from './pages/AdminProcedures';


const LandingPage = () => (
  <>
    <Hero />
    <Services />
    <News />
  </>
);

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>

          <Route path="/" element={<LandingPage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/booking" element={<Booking />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/procedures" element={<Procedures />} />
          <Route path="/training" element={<Training />} />
          <Route path="/departmentdetail/:slug" element={<DepartmentDetail />}/>
          <Route path="/aboutpage" element={<AboutPage />} />
          <Route path="/schedulepage" element={<SchedulePage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/adminprocedures" element={<AdminProcedures />} />


          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

        </Routes>
        <SocialWidget/>
         <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}
