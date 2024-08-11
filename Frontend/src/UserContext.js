import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Kiểm tra localStorage khi component được mount
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        // Lưu token vào localStorage nếu có
        if (userData.token) {
            localStorage.setItem('token', userData.token);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    // Hàm để cập nhật thông tin người dùng
    const updateUser = (newUserData) => {
        const updatedUser = { ...user, ...newUserData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    return (
        <UserContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};