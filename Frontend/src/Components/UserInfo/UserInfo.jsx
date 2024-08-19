import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import './UserInfo.css';
// import AddressSelector from '../Address/Address'; // Import the AddressSelector component

const UserInfo = ({ user, type, orders, orderColumns, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    if (validateUser()) {
      onUpdateUser(updatedUser);
      setIsEditing(false);
    }
  };

  const validateUser = () => {
    const { email, phone } = updatedUser;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return false;
    }

    if (!phoneRegex.test(phone)) {
      alert('Please enter a valid phone number (10 digits).');
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handleAddressChange = (city, district, ward, street, index) => {
    const newAddresses = updatedUser.addresses.map((address, i) =>
      i === index ? { city, district, ward, street } : address
    );
    setUpdatedUser({ ...updatedUser, addresses: newAddresses });
  };

  const handleDelete = (id) => setDeletingOrderId(id);
  const handleDeleteConfirm = () => {
    // Handle delete confirmation logic here
    setDeletingOrderId(null);
    setDeleteReason('');
    setPaymentMethod('');
  };

  const renderDetails = () => (
    <>
      <div className="details-header">
        <h2>DETAILS</h2>
      </div>
      <div className="details-content">
        <div className="avatar">
          <img
            src="https://toigingiuvedep.vn/wp-content/uploads/2022/01/anh-meo-cute.jpg"
            alt="Avatar"
          />
        </div>
        {isEditing ? (
          <form>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={updatedUser.name}
                onChange={handleChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={updatedUser.email}
                onChange={handleChange}
              />
            </label>
            <label>
              Phone Number:
              <input
                type="text"
                name="phone"
                value={updatedUser.phone}
                onChange={handleChange}
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={updatedUser.address}
                onChange={handleChange}
              />
            </label>
            <button type="button" onClick={handleSave} className="save">
              Save
            </button>
          </form>
        ) : (
          <>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {user.phone}
            </p>
            <p>
              <strong>Address:</strong> {user.address}
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
          <form>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={updatedUser.address}
                onChange={handleChange}
              />
            </label>
            <button type="button" onClick={handleSave} className="save">
              Save
            </button>
          </form>
        ) : (
          <>
            <p>
              <strong>Address:</strong> {user.address}
            </p>
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
          columns={[
            ...orderColumns,
            {
              field: 'delete',
              headerName: 'Delete',
              width: 150,
              renderCell: (params) => (
                <DeleteIcon
                  onClick={() => handleDelete(params.row._id)}
                  className="delete-icon"
                  style={{ cursor: 'pointer', color: '#e57373' }}
                />
              ),
            },
          ]}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          autoHeight
        />
        {deletingOrderId !== null && (
          <div className="delete-form">
            <h3>Delete Order</h3>
            <form>
              <label>
                Reason for Deletion:
                <input
                  type="text"
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                />
              </label>
              <label>
                Payment Method:
                <input
                  type="text"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
              </label>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="confirm-delete"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setDeletingOrderId(null)}
                className="cancel-delete"
              >
                Cancel
              </button>
            </form>
          </div>
        )}
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
