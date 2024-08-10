import React, { useState } from 'react';
import UserInfo from '../Components/UserInfo/UserInfo';
import { orderColumns, orderRows } from '../datatablesource';
import './CSS/UserInfoPage.css';

const UserInfoPage = () => {
  const [activeSection, setActiveSection] = useState('details');
  // const { user, logout } = useContext(UserContext);

  const [user, setUser] = useState({
    fullName: 'HUYNH KHANH',
    dob: '30 - 08 - 2004',
    gender: 'Male',
    email: 'kk291219@gmail.com',
    phone: '0771133378',
    addresses: [
      'Ho Chi Minh, Viet Nam',
      'Ba Ria, Vung Tau',
      'Ho Chi Minh, Viet Nam',
      'Ba Ria, Vung Tau',
      'Ho Chi Minh, Viet Nam',
    ],
  });

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleLogout = () => {
    if (logout) {
        logout();
        navigate('/login'); // Chuyển hướng người dùng đến trang đăng nhập sau khi đăng xuất
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'details':
        return <UserInfo.Section type="details" user={user} onUpdateUser={handleUpdateUser} />;
      case 'address':
        return <UserInfo.Section type="address" user={user} onUpdateUser={handleUpdateUser} />;
      case 'orders':
        return <UserInfo.Section type="orders" orders={orderRows} orderColumns={orderColumns} />;
      default:
        return <UserInfo.Section type="details" user={user} onUpdateUser={handleUpdateUser} />;
    }
  };


  return (
    <div className="user-info-page">
      <h1>HI,</h1>
      <h2>ACCOUNT OVERVIEW</h2>
      <div className="content">
        <div className="sidebar">
          <ul>
            <li onClick={() => setActiveSection('details')}>Details</li>
            <li onClick={() => setActiveSection('address')}>Address</li>
            <li onClick={() => setActiveSection('orders')}>Your Orders</li>
            <li onClick={handleLogout}>Log Out</li>
          </ul>
        </div>
        <div className="UserInfo-main-content">{renderSection()}</div>
      </div>
    </div>
  );
};

export default UserInfoPage;
