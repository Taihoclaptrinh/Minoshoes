import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import './UserInfo.css';
import AddressSelector from '../Address/Address'; // Import the AddressSelector component
import Swal from 'sweetalert2';
import { post } from '../../config/fetchConfig'
// import AddressSelector from '../Address/Address'; // Import the AddressSelector component

const UserInfo = ({ user, type, orders, orderColumns, onUpdateUser, onCancelOrder }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [bankAccount, setBankAccount] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  const handleCancel = async (orderId, status) => {
    if (status !== 'Pending') {
      Swal.fire('Error', 'Product can only be cancelled while pending.', 'error');
      return;
    }
    setCancellingOrderId(orderId);
  };

  const handleCancelConfirm = async () => {
    try {
      const localUser = JSON.parse(localStorage.getItem('user'));
      // Input email in local storage
      const correct_email = localUser.email;

      // Validate password (you'd need to implement this check against your backend)
      const isValidCredentials = await validateCredentials(correct_email, email, password);

      if (!isValidCredentials) {
        Swal.fire('Error', 'Invalid email or password. Try again!', 'error');
        return;
      }

      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, cancel it!'
      });

      if (result.isConfirmed) {
        // Call the onCancelOrder function passed as prop
        await onCancelOrder({
          orderId: cancellingOrderId,
          reason: cancelReason,
          paymentMethod,
          bankAccount: paymentMethod === 'E-Banking' ? bankAccount : undefined
        });

        Swal.fire('Cancelled!', 'Your order has been cancelled.', 'success');
        setCancellingOrderId(null);
        setCancelReason('');
        setPaymentMethod('COD');
        setBankAccount('');
        setPassword('');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      Swal.fire('Error', 'An error occurred while cancelling the order.', 'error');
    }
  };

  const validateCredentials = async (correct_email, email, password) => {
    try {
      const data = await post('/api/v1/auth/validateCredentials', { 
        correct_email, 
        email, 
        password 
      }, {
        credentials: 'include', // Đảm bảo session cookie được gửi kèm
      });
      
      return data.isValid;
    } catch (error) {
      console.error('Error validating credentials:', error);
      return false;
    }
  };
  

  const renderDetails = () => {
    const address = updatedUser.address || {};
    const dob = updatedUser.dob ? updatedUser.dob.split('T')[0] : '';
    return (
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
            <form>
              <label>
                Full Name:
                <input
                  type="text"
                  name="fullName"
                  value={updatedUser.fullName}
                  onChange={handleChange}
                />
              </label>
              <label className="Gender_label">
                Gender:
                <select
                  name="gender"
                  value={updatedUser.gender}
                  onChange={handleChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </label>
              <br /><br />
              <label>
                Date of Birth:
                <input
                  type="date"
                  name="dob"
                  value={dob}  // Use the safely handled dob value
                  onChange={(e) =>
                    setUpdatedUser({ ...updatedUser, dob: e.target.value })
                  }
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
              <div className="address-section">
                <label>Address:</label>
                <AddressSelector
                  onChange={(city, district, ward) =>
                    handleAddressChange(city, district, ward, updatedUser.address.street || '')
                  }
                  initialAddress={address} // Pass initial address data
                />
                <label>
                  Street:
                  <input
                    type="text"
                    value={address.street || ''} // Default to empty string if street is undefined
                    onChange={(e) =>
                      handleAddressChange(
                        address.city,
                        address.district,
                        address.ward,
                        e.target.value
                      )
                    }
                  />
                </label>
              </div>
              <button type="button" onClick={handleSave} className="save">
                Save
              </button>
            </form>
          ) : (
            <>
              <p>
                <strong>Full name:</strong> {user.fullName}
              </p>
              <p>
                <strong>Date of birth:</strong> {dob ? new Date(dob).toLocaleDateString() : 'Not provided'}
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
              <p>
                <strong>Address:</strong> 
                {`${address.street || ''}, ${address.ward || ''}, ${address.district || ''}, ${address.city || ''}`}
              </p>
              <button onClick={handleEdit} className="edit">
                Edit
              </button>
            </>
          )}
        </div>
      </>
    );
  };

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
                  onClick={() => handleCancel(params.row.id)}
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
        {cancellingOrderId !== null && (
          <div className="delete-form">
            <h3>Delete Order</h3>
            <form>
              <label>
                Reason for Deletion:
                <input
                  type="text"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
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
                onClick={handleCancelConfirm}
                className="confirm-delete"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setCancellingOrderId(null)}
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
