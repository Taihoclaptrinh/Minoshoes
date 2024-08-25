import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Delete as CancelIcon } from '@mui/icons-material';
import './UserInfo.css';
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // const handleAddressChange = (city, district, ward, street, index) => {
  //   const newAddresses = updatedUser.addresses.map((address, i) =>
  //     i === index ? { city, district, ward, street } : address
  //   );
  //   setUpdatedUser({ ...updatedUser, addresses: newAddresses });
  // };

  const handleCancel = async (orderId, status) => {
    if (status !== 'Pending') {
      Swal.fire('Error', 'Product can only be cancelled while pending.', 'error');
      return;
    }
    setCancellingOrderId(orderId);

    setIsModalOpen(true); // Open the modal
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

      setIsModalOpen(false); // Close the modal after confirming cancellation

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


  const renderDetails = () => (
    <>
      <div className="details-header">
        <h2>DETAILS</h2>
      </div>
      <div className="details-content">
        <div className="avatar">
          <img
            src="https://minoshoesstorage.blob.core.windows.net/minoshoesbackground/people.jpg"
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
              field: 'cancel',
              headerName: 'Cancel',
              width: 150,
              renderCell: (params) => (
                <CancelIcon
                  onClick={() => handleCancel(params.row.id, params.row.status)}
                  className="cancel-icon"
                  style={{ cursor: 'pointer', color: '#e57373' }}
                />
              ),
            },
          ]}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          autoHeight
        />
        {/* {cancellingOrderId !== null && ( */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="cancel-form">
            <h3>Cancel Order</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleCancelConfirm(); }}>
              <label>
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              <label>
                Reason for Cancellation:
                <input
                  type="text"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  required
                />
              </label>
              <label>
                Payment Method:
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="COD">COD</option>
                  <option value="E-Banking">E-Banking</option>
                </select>
              </label>
              {paymentMethod === 'E-Banking' && (
                <label>
                  Bank Account:
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    required
                  />
                </label>
              )}
              <button 
                type="submit" 
                className="confirm-cancel"
                // onClick={() => setIsModalOpen(false)}
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => [setCancellingOrderId(null), setIsModalOpen(false)]}
                className="cancel-cancel"
              >
                Cancel
              </button>
            </form>
          </div>
        {/* )} */}
        </Modal>  
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

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="cancel_order-modal-overlay" onClick={onClose}>
      <div className="cancel_order-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* <button className="close-button" onClick={onClose}>×</button> */}
        {children}
      </div>
    </div>
  );
};

UserInfo.Section = UserInfo;

export default UserInfo;
