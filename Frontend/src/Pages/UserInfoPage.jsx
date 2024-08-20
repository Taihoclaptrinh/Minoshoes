import React, { useState, useEffect, useContext } from 'react';
import UserInfo from '../Components/UserInfo/UserInfo';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../UserContext';
import './CSS/UserInfoPage.css';
import axios from 'axios';

const UserInfoPage = () => {
  const [activeSection, setActiveSection] = useState('details');
  const { user, updateUser, logout } = useContext(UserContext);
  const [localUser, setLocalUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [reloadOrders, setReloadOrders] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/v1/auth/users/${user._id}`);
        setLocalUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error.response?.data || error.message);
        setError('Failed to fetch user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserOrders = async () => {
      try {
        const response = await axios.get(`/api/v1/orders/user-orders/${user._id}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching user orders:', error.response?.data || error.message);
        setError('Failed to fetch user orders. Please try again.');
      }
    };

    if (user?._id) {
      fetchUserData();
      fetchUserOrders();
    } else {
      setLoading(false);
    }
  }, [user]);


  const handleUpdateUser = async (updatedUser) => {
    if (!updatedUser._id) {
      console.error('No user ID found');
      setError('No user ID found. Cannot update user.');
      return;
    }
    try {
      await axios.put(`/api/v1/auth/users/${updatedUser._id}`, updatedUser);
      updateUser(updatedUser);
      setLocalUser(updatedUser);

      if (updatedUser.address) {
        await axios.put(`/api/v1/orders/update-address/${updatedUser._id}`, {
          newAddress: updatedUser.address
        });
        setReloadOrders(true);
      }
    } catch (error) {
      console.error('Error updating user data:', error.response?.data || error.message);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  const transformOrderData = (orders) => {
    return orders.map((order) => ({
      id: order._id,
      productName: order.orderItems.map(item => item.name).join(', '),
      quantity: order.orderItems.map(item => item.quantity).join(', '), 
      price: order.orderItems.map(item => item.price).join(', '),       
      shippingAddress: order.shippingAddress.address,
      name: order.shippingAddress.fullName,
      phone: order.shippingAddress.phoneNumber,
      paymentMethod: order.paymentMethod,
      shippingPrice: order.shippingPrice,
      totalPrice: order.totalPrice,
      status: order.status,
      createAt: new Date(order.createdAt).toLocaleString(),
      updateAt: new Date(order.updatedAt).toLocaleString(),
    }));
  };

  const orderColumns = [
    { field: "productName", headerName: "Product Name", width: 200 },
    { field: "quantity", headerName: "Quantity", width: 100 },
    { field: "price", headerName: "Price", width: 100 },
    { field: "shippingAddress", headerName: "Shipping Address", width: 300 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "paymentMethod", headerName: "Payment Method", width: 150 },
    { field: "shippingPrice", headerName: "Shipping Price", width: 150 },
    { field: "totalPrice", headerName: "Total Price", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "createAt", headerName: "Created At", width: 200 },
    { field: "updateAt", headerName: "Updated At", width: 200 },
  ];
  
  const renderSection = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    if (!localUser) {
      return <div>No user data available</div>;
    }

    switch (activeSection) {
      case 'details':
        return <UserInfo.Section type="details" user={localUser} onUpdateUser={handleUpdateUser} />;
      case 'address':
        return <UserInfo.Section type="address" user={localUser} onUpdateUser={handleUpdateUser} />;
      case 'orders':
        return (
          <UserInfo.Section
            type="orders"
            orders={transformOrderData(orders)}
            orderColumns={orderColumns}
          />
        );
      default:
        return <UserInfo.Section type="details" user={localUser} onUpdateUser={handleUpdateUser} />;
    }
  };

  return (
    <div className="user-info-page">
      <h1>HI, {localUser?.name}</h1>
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
