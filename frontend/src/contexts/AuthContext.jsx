import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const navigate = useNavigate();

    useEffect(() => {
        // Có thể gọi API /me ở đây để lấy lại info dựa vào token nếu cần
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userToken);
        navigate('/dashboard');
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
