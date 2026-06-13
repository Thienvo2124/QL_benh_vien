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
        <div className="relative">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/pricing" element={<Pricing />} />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
            </Route>
          </Routes>

          <Chatbot />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
