import React, { useState } from "react";
import "./CSS/AdminSingle.css";
import AdminChart from "../Components/AdminChart/AdminChart.jsx";
import { useParams } from "react-router-dom";
import { userRows, productRows, orderRows } from "../datatablesource.js";

const AdminSingle = () => {
  const { userId, productId, orderId } = useParams();

  // Determine entity type
  const isUser = userId !== undefined;
  const isProduct = productId !== undefined;
  const isOrder = orderId !== undefined;

  // Get the ID for the current entity
  const id = isUser ? userId : isProduct ? productId : orderId;

  // Find the data based on type
  const initialData = isUser
    ? userRows.find((user) => user.id.toString() === id.toString())
    : isProduct
    ? productRows.find((product) => product.id.toString() === id.toString())
    : isOrder
    ? orderRows.find((order) => order.id.toString() === id.toString())
    : null;

  // Log the data found for debugging
  console.log("Initial Data:", initialData);

  // State for editing mode, form data, and image
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [image, setImage] = useState(formData?.images ? formData.images[0] : null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setFormData({ ...formData, img: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Save changes (you might want to persist them)
  const saveChanges = () => {
    toggleEditMode();
    // Here, you can update the data source or send an update to a server
    console.log("Updated data:", formData);
  };

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
            <h1 className="title">Information</h1>
            <div className="item">
              {!isOrder && (
                <>
                  <img
                    src={image || "https://via.placeholder.com/150"}
                    alt="Item"
                    className="itemImg"
                  />
                  {isEditing && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="imageInput"
                    />
                  )}
                </>
              )}
              <div className="details">
                <h1 className="itemTitle">
                  {formData.name || formData.title || "Order Details"}
                </h1>
                {isUser && (
                  <form>
                    <div className="detailItem">
                      <label className="itemKey" htmlFor="email">
                        Email:
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="itemValue"
                        />
                      ) : (
                        <span className="itemValue">{formData.email || "N/A"}</span>
                      )}
                    </div>
                    <div className="detailItem">
                      <label className="itemKey" htmlFor="phone">
                        Phone:
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="itemValue"
                        />
                      ) : (
                        <span className="itemValue">{formData.phone || "N/A"}</span>
                      )}
                    </div>
                    <div className="detailItem">
                      <label className="itemKey" htmlFor="address">
                        Address:
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="itemValue"
                        />
                      ) : (
                        <span className="itemValue">{formData.address || "N/A"}</span>
                      )}
                    </div>
                    <div className="detailItem">
                      <label className="itemKey" htmlFor="country">
                        Country:
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="itemValue"
                        />
                      ) : (
                        <span className="itemValue">{formData.country || "N/A"}</span>
                      )}
                    </div>
                    <div className="detailItem">
                      <label className="itemKey" htmlFor="role">
                        Role:
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          id="role"
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className="itemValue"
                        />
                      ) : (
                        <span className="itemValue">{formData.role || "N/A"}</span>
                      )}
                    </div>
                    <div className="detailItem">
                      <label className="itemKey" htmlFor="totalSpent">
                        Total Spent:
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          id="totalSpent"
                          name="totalSpent"
                          value={formData.totalSpent}
                          onChange={handleInputChange}
                          className="itemValue"
                        />
                      ) : (
                        <span className="itemValue">{formData.totalSpent || "N/A"}</span>
                      )}
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Created At:</span>
                      <span className="itemValue">{formData.createAt || "N/A"}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Updated At:</span>
                      <span className="itemValue">{formData.updateAt || "N/A"}</span>
                    </div>
                  </form>
                )}
                {isProduct && (
                  <form>
                    <div className="detailItem">
                      <label className="itemKey" htmlFor="description">
                        Description:
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          className="itemValue"
                        />
                      ) : (
                        <span className="itemValue">{formData.description || "N/A"}</span>
                      )}
                    </div>
                    <div className="detailItem">
                      <label className="itemKey" htmlFor="price">
                        Price:
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="itemValue"
                        />
                      ) : (
                        <span className="itemValue">{formData.price || "N/A"}</span>
                      )}
                    </div>
                    <div className="detailItem">
                      <label className="itemKey" htmlFor="brand">
                        Brand:
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          id="brand"
                          name="brand"
                          value={formData.brand}
                          onChange={handleInputChange}
                          className="itemValue"
                        />
                      ) : (
                        <span className="itemValue">{formData.brand || "N/A"}</span>
                      )}
                    </div>
                    <div className="detailItem">
                      <label className="itemKey" htmlFor="category">
                        Category:
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="itemValue"
                        />
                      ) : (
                        <span className="itemValue">{formData.category || "N/A"}</span>
                      )}
                    </div>
                    <div className="detailItem">
                      <label className="itemKey" htmlFor="rating">
                        Rating:
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          id="rating"
                          name="rating"
                          value={formData.rating}
                          onChange={handleInputChange}
                          className="itemValue"
                        />
                      ) : (
                        <span className="itemValue">{formData.rating || "N/A"}</span>
                      )}
                    </div>
                    <div className="detailItem">
                      <label className="itemKey" htmlFor="stock">
                        Stock:
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          id="stock"
                          name="stock"
                          value={formData.stock}
                          onChange={handleInputChange}
                          className="itemValue"
                        />
                      ) : (
                        <span className="itemValue">{formData.stock || "N/A"}</span>
                      )}
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Created At:</span>
                      <span className="itemValue">{formData.createAt || "N/A"}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Updated At:</span>
                      <span className="itemValue">{formData.updateAt || "N/A"}</span>
                    </div>
                  </form>
                )}
                {isOrder && (
                  <form>
                    <div className="detailItem">
                      <label className="itemKey" htmlFor="status">
                        Status:
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="itemValue"
                        />
                      ) : (
                        <span className="itemValue">{formData.status || "N/A"}</span>
                      )}
                    </div>
                    <div className="detailItem">
                      <label className="itemKey" htmlFor="total">
                        Total:
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          id="total"
                          name="total"
                          value={formData.total}
                          onChange={handleInputChange}
                          className="itemValue"
                        />
                      ) : (
                        <span className="itemValue">{formData.total || "N/A"}</span>
                      )}
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">User:</span>
                      <span className="itemValue">{formData.user || "N/A"}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Product:</span>
                      <span className="itemValue">{formData.product || "N/A"}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Created At:</span>
                      <span className="itemValue">{formData.createAt || "N/A"}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Updated At:</span>
                      <span className="itemValue">{formData.updateAt || "N/A"}</span>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
          <div className="right">
            <AdminChart
              aspect={3 / 1}
              title={`${
                isUser ? "User" : isProduct ? "Product" : "Order"
              } Details`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSingle;
