import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid'; // Import MUI DataGrid
import './UserInfo.css';

const UserInfo = ({ user, type, orders, orderColumns, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdateUser(updatedUser);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handleAddressChange = (e, index) => {
    const { value } = e.target;
    const newAddresses = updatedUser.addresses.map((address, i) =>
      i === index ? value : address
    );
    setUpdatedUser({ ...updatedUser, addresses: newAddresses });
  };

  const renderDetails = () => (
    <>
      <div className="details-header">
        <h2>DETAILS</h2>
      </div>
      <div className="details-content">
        <div className="avatar">
          <img
            src="https://th.bing.com/th/id/OIP.XjtD-t15oASjdfRvYim11wHaEX?rs=1&pid=ImgDetMain"
            alt="Avatar"
          />
        </div>
        {isEditing ? (
          <>
            <input
              type="text"
              name="fullName"
              value={updatedUser.fullName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="dob"
              value={updatedUser.dob}
              onChange={handleChange}
            />
            <input
              type="text"
              name="gender"
              value={updatedUser.gender}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              value={updatedUser.email}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone"
              value={updatedUser.phone}
              onChange={handleChange}
            />
            <button onClick={handleSave} className="save">
              Save
            </button>
          </>
        ) : (
          <>
            <p>
              <strong>Full name:</strong> {user.fullName}
            </p>
            <p>
              <strong>Date of birth:</strong> {user.dob}
            </p>
            <p>
              <strong>Gender:</strong> {user.gender}
            </p>
            <p>
              <strong>Email address:</strong> {user.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {user.phone}
            </p>
            <button onClick={handleEdit} className="edit">
              Edit
            </button>
          </>
        )}
      </div>
    </>
  );

  const renderAddress = () => (
    <>
      <div className="details-header">
        <h2>ADDRESS</h2>
      </div>
      <div className="details-content">
        {isEditing ? (
          <>
            {updatedUser.addresses.map((address, index) => (
              <input
                key={index}
                type="text"
                value={address}
                onChange={(e) => handleAddressChange(e, index)}
              />
            ))}
            <button onClick={handleSave} className="save">
              Save
            </button>
          </>
        ) : (
          <>
            {user.addresses.map((address, index) => (
              <p key={index}>
                <strong>Address {index + 1}:</strong> {address}
              </p>
            ))}
            <button onClick={handleEdit} className="edit">
              Edit
            </button>
          </>
        )}
      </div>
    </>
  );

  const renderOrders = () => (
    <>
      <div className="details-header">
        <h2>YOUR ORDERS</h2>
      </div>
      <div className="orders-content">
        <DataGrid 
          className="order-table"
          rows={orders}
          columns={orderColumns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          autoHeight
        />
      </div>
    </>
  );

  const renderSection = () => {
    switch (type) {
      case 'details':
        return renderDetails();
      case 'address':
        return renderAddress();
      case 'orders':
        return renderOrders();
      default:
        return renderDetails();
    }
  };

  return <div className="user-info">{renderSection()}</div>;
};

UserInfo.Section = UserInfo;

export default UserInfo;
