import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import "./CSS/AdminOrderSingle.css";

const AdminOrderSingle = () => {
  const { orderId } = useParams(); // Get the orderId from the URL parameters
  const [orderData, setOrderData] = useState(null);
  
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + " VND";
  };

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
                <form>
                  <div className="detail-item">
                    <label >
                      <span className="item-key">Order ID:</span>
                      <span className="item-value">{orderData.id}</span>
                    </label>
                  </div>
                  <div className="detail-item">
                    <label >
                      <span className="item-key">User ID: </span>
                      <span className="item-value">{orderData.userId}</span>
                    </label>
                  </div>
                  <div className="detail-item">
                    <label >
                      <span className="item-key">User Email:</span>
                      <span className="item-value">{orderData.userEmail}</span>
                    </label>
                  </div>
                  <div className="detail-item">
                    <label >
                      <span className="item-key">Payment Method:</span>
                      <span className="item-value">{orderData.paymentMethod}</span>
                    </label>
                  </div>
                  <div className="detail-item">
                    <label>
                      <span className="item-key">Total Price:</span>
                      <span className="item-value">{formatPrice(orderData.totalPrice)}</span>
                    </label>
                  </div>
                  <div className="detail-item">
                    <label>
                      <span className="item-key">Status</span>
                      <span className="item-value">{orderData.status}</span>
                    </label>  
                  </div>
                  <div className="detail-item">
                    <label >
                      <span className="item-key">Created At:</span>
                      <span className="item-value">{orderData.createdAt}</span>
                    </label>
                  </div>
                  <div className="detail-item">
                    <label >
                      <span className="item-key">Updated At:</span>
                      <span className="item-value">{orderData.updatedAt}</span>
                    </label>
                  </div>
                  <div className="detail-item">
                    <label >
                      <span className="item-key">Shipping Address:</span>
                      <span className="item-value ">
                        <ul>{orderData.shippingAddress.fullName}</ul>
                        <ul>{orderData.shippingAddress.address}</ul>
                        <ul>{orderData.shippingAddress.phoneNumber}</ul>
                      </span>
                    </label>
                  </div>
                  <div className="detail-item">
                    <div className="item-key">Order Items:</div>
                    <div className="table-container" style={{justifyContent:"center", display:"flex"}}>
                      <table className="item-value">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Size</th>
                            {/* <th>Color</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {orderData.orderItems.map((item, index) => (
                            <tr key={index}>
                              <td>{item.name}</td>
                              <td>{item.quantity}</td>
                              <td>{formatPrice(item.price)}</td>
                              <td>{item.size}</td>
                              {/* <td>{item.color}</td> */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
