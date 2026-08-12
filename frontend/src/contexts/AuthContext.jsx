/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const getSavedUser = () => {
  const savedUser = sessionStorage.getItem('user');
  return savedUser ? JSON.parse(savedUser) : null;
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getSavedUser);
  const [token, setToken] = useState(sessionStorage.getItem('token') || null);
  const navigate = useNavigate();

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('token', userToken);
    
    // Phân luồng điều hướng: Quản trị/Bác sĩ vào Dashboard, Bệnh nhân quay về Trang Chủ
    if (['admin', 'doctor', 'nurse', 'cashier'].includes(userData?.role)) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
