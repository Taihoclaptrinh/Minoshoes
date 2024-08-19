import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check localStorage when component mounts
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser && parsedUser._id) { // Sử dụng _id thay vì id
                setUser(parsedUser);
                console.log('User data loaded from localStorage:', parsedUser); // Log thông tin user khi tải từ localStorage
            }
        }
    }, []);

    const login = (userData) => {
        if (userData && userData._id) { // Kiểm tra _id thay vì id
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            console.log('User logged in:', userData); // Log thông tin user khi đăng nhập
            // Store token in localStorage if available
            if (userData.token) {
                localStorage.setItem('token', userData.token);
            }
        } else {
            console.error('User data does not contain _id');
        }
    };
    

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    // Function to update user information
    const updateUser = async (newUserData) => {
        try {
            const response = await axios.put('/api/v1/user', newUserData); // Replace with your API endpoint
            const updatedUser = response.data;
            if (updatedUser && updatedUser._id) { // Kiểm tra _id thay vì id
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                console.log('User updated:', updatedUser); // Log thông tin user khi cập nhật
            } else {
                console.error('Updated user data does not contain _id');
            }
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    return (
        <UserContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};
