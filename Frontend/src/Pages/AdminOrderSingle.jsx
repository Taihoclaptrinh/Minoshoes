import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { get, post, put, del } from '../config/api';
import "./CSS/AdminSingle.css";

const AdminOrderSingle = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + " VND";
  };

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(`/api/v1/admin/orders/${orderId}`);
        const order = response.data.order;
        const data = {
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
        };
        setOrderData(data);
        setFormData(data);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchOrderData();
  }, [orderId]);

  useEffect(() => {
    if (orderData) {
      setFormData(orderData);
    }
  }, [orderData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'status') {
      const selectElement = document.getElementById(name);
      selectElement.style.backgroundColor = getColorForStatus(value);
    }
  };

  const getColorForStatus = (status) => {
    switch (status) {
      case 'Pending':
        return 'rgb(165, 237, 255)';
      case 'Shipped':
        return '#ffd599';
      case 'Cancelled':
        return '#ff9393';
      case 'Delivered':
        return '#a8f6a8';
      default:
        return '#fff';
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const saveChanges = () => {
    toggleEditMode();
    console.log("Updated data:", formData);
    // Update the backend here
  };

  const orderInputs = [
    { id: 'id', label: "Order ID", type: "text", placeholder: "Enter Order ID", maxLength: 20, disabled: true },
    { id: 'userId', label: "User ID", type: "text", placeholder: "Enter User ID", maxLength: 20, disabled: true },
    { id: 'userEmail', label: "User Email", type: "text", placeholder: "Enter User Email", maxLength: 20, disabled: true },
    { id: 'totalPrice', label: "Total Amount", type: "number", placeholder: "400", disabled: true },
    { id: 'shippingAddress', label: "Shipping Address", type: "text", placeholder: "123 Main St, Anytown, USA", disabled: true },
    { id: 'paymentMethod', label: "Payment Method", type: "text", placeholder: "Credit Card", disabled: true },
    { id: 'status', label: "Order Status", type: "select", options: ["Pending", "Shipped", "Cancelled", "Delivered"] },
    { id: 'createdAt', label: "Created At", type: "text", disabled: true },
    { id: 'updatedAt', label: "Updated At", type: "text", disabled: true },
  ];

  if (!formData) return <div>Data not found</div>;

  return (
    <div className="AdminSingle">
      <div className="singleContainer">
        <div className="top">
          <div className="left">
            <div className="buttonContainer">
              <button className="editButton" onClick={toggleEditMode}>
                {isEditing ? "Cancel" : "Edit"}
              </button>
              {isEditing && (
                <button className="saveButton" onClick={saveChanges}>
                  Save
                </button>
              )}
            </div>
            <h1 className="title">Order Information</h1>
            <div className="item">
              <div className="details">
                <h1 className="itemTitle">{formData.id || "Order Details"}</h1>
                <form>
                  {orderInputs.map((input) => (
                    <div key={input.id} className="detailItem">
                      <label className="itemKey">{input.label}:</label>
                      {input.type === "select" ? (
                        isEditing ? (
                          <select
                            id={input.id}
                            name={input.id}
                            value={formData[input.id] || ""}
                            onChange={handleInputChange}
                            style={{ backgroundColor: getColorForStatus(formData[input.id]) }}
                          >
                            {input.options.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="itemValue">
                            {formData[input.id] || "N/A"}
                          </span>
                        )
                      ) : input.id === 'totalPrice' ? (
                        <span className="itemValue">
                          {formatPrice(formData[input.id])}
                        </span>
                      ) : input.id === 'shippingAddress' && typeof formData[input.id] === 'object' ? (
                        <div id="shippingAddressContainer" className="itemValue">
                          <div className="shippingAddressInfo"><strong>Full Name:</strong> {formData.shippingAddress.fullName}</div>
                          <div className="shippingAddressInfo"><strong>Address:</strong> {formData.shippingAddress.address}</div>
                          <div className="shippingAddressInfo"><strong>Phone Number:</strong> {formData.shippingAddress.phoneNumber}</div>
                        </div>
                      ) : (
                        <span className="itemValue">
                          {formData[input.id] || "N/A"}
                        </span>
                      )}
                    </div>
                  ))}
                </form>
                <div className="detailItem">
                  <div className="itemKey">Order Items:</div>
                  <div className="tableContainer">
                    <table>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Name</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Size</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.orderItems.map((item, index) => (
                          <tr key={index}>
                            <td>{item.product}</td>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{formatPrice(item.price)}</td>
                            <td>{item.size}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderSingle;