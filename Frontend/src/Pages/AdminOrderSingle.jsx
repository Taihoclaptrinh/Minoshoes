import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import "./CSS/AdminOrderSingle.css";

const AdminOrderSingle = () => {
  const { orderId } = useParams(); // Get the orderId from the URL parameters
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(`/api/v1/admin/orders/${orderId}`);
        const order = response.data.order;
        setOrderData({
          id: order._id || "N/A",
          userId: order.user._id || "N/A",
          userEmail: order.user.email || "N/A",
          orderItems: order.orderItems || [],
          shippingAddress: order.shippingAddress || {},
          paymentMethod: order.paymentMethod || "N/A",
          totalPrice: order.totalPrice || "N/A",
          status: order.status || "N/A",
          createdAt: new Date(order.createdAt).toLocaleString() || "Invalid Date",
          updatedAt: new Date(order.updatedAt).toLocaleString() || "Invalid Date",
        });
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchOrderData();
  }, [orderId]);

  if (!orderData) return <div>Data not found</div>;

  return (
    <div className="admin-order-single">
      <div className="single-container">
        <div className="top">
          <div className="left">
            <h1 className="title">Order Information</h1>
            <div className="item">
              <div className="details">
                <h1 className="item-title">Order ID: {orderData.id}</h1>
                <form>
                  <div className="detail-item">
                    <label className="item-key">User ID:</label>
                    <span className="item-value">{orderData.userId}</span>
                  </div>
                  <div className="detail-item">
                    <label className="item-key">User Email:</label>
                    <span className="item-value">{orderData.userEmail}</span>
                  </div>
                  <div className="detail-item">
                    <label className="item-key">Payment Method:</label>
                    <span className="item-value">{orderData.paymentMethod}</span>
                  </div>
                  <div className="detail-item">
                    <label className="item-key">Total Price:</label>
                    <span className="item-value">{orderData.totalPrice}</span>
                  </div>
                  <div className="detail-item">
                    <label className="item-key">Status:</label>
                    <span className="item-value">{orderData.status}</span>
                  </div>
                  <div className="detail-item">
                    <label className="item-key">Created At:</label>
                    <span className="item-value">{orderData.createdAt}</span>
                  </div>
                  <div className="detail-item">
                    <label className="item-key">Updated At:</label>
                    <span className="item-value">{orderData.updatedAt}</span>
                  </div>
                  <div className="detail-item">
                    <label className="item-key">Shipping Address:</label>
                    <div className="item-value">
                      <p>{orderData.shippingAddress.fullName}</p>
                      <p>{orderData.shippingAddress.address}</p>
                      <p>{orderData.shippingAddress.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <label className="item-key">Order Items:</label>
                    <ul className="item-value">
                      {orderData.orderItems.map((item, index) => (
                        <li key={index}>
                          <p>Product: {item.name}</p>
                          <p>Quantity: {item.quantity}</p>
                          <p>Price: {item.price}</p>
                          <p>Size: {item.size}</p>
                          <p>Color: {item.color}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderSingle;
