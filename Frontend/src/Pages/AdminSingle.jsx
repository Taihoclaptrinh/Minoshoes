import React, { useState, useEffect } from "react";
import "./CSS/AdminSingle.css";
import AdminChart from "../Components/AdminChart/AdminChart.jsx";
import { useParams } from "react-router-dom";
import { userRows, productRows, orderRows } from "../datatablesource.js";
import { userInputs, productInputs, orderInputs } from "../formSource.js";

const AdminSingle = () => {
  const { userId, productId, orderId } = useParams();

  const isUser = userId !== undefined;
  const isProduct = productId !== undefined;
  const isOrder = orderId !== undefined;

  const id = isUser ? userId : isProduct ? productId : orderId;
  const initialData = isUser
    ? userRows.find((user) => user.id.toString() === id.toString())
    : isProduct
    ? productRows.find((product) => product.id.toString() === id.toString())
    : isOrder
    ? orderRows.find((order) => order.id.toString() === id.toString())
    : null;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setPreviewImages(initialData.img ? [initialData.img] : []);
    }
  }, [initialData]);

  useEffect(() => {
    return () => {
      // Cleanup URLs to prevent memory leaks
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      handleImageChange(files);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (files) => {
    const fileArray = Array.from(files);
    const imageUrls = fileArray.map((file) => URL.createObjectURL(file));

    setPreviewImages(imageUrls);
    setFormData((prevData) => ({
      ...prevData,
      img: imageUrls,
    }));
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const saveChanges = () => {
    toggleEditMode();
    console.log("Updated data:", formData);
    // Update the backend here
  };

  if (!formData) return <div>Data not found</div>;

  const inputFields = isUser
    ? userInputs.filter((input) => input.id !== "userPassword") // Exclude password
    : isProduct
    ? productInputs
    : orderInputs;

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
              {(isProduct || isUser) && (
                <div className="imagePreviewContainer">
                  {previewImages.length > 0 ? (
                    previewImages.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Preview ${index}`}
                        className="itemImg"
                      />
                    ))
                  ) : (
                    <img
                      src="https://via.placeholder.com/150"
                      alt="No Preview"
                      className="itemImg"
                    />
                  )}
                </div>
              )}
              <div className="details">
                <h1 className="itemTitle">
                  {formData.name || formData.title || "Order Details"}
                </h1>
                <form>
                  {inputFields.map((input) => (
                    <div key={input.id} className="detailItem">
                      <label className="itemKey" htmlFor={input.id}>
                        {input.label}:
                      </label>
                      {isEditing ? (
                        <input
                          type={input.type}
                          id={input.id}
                          name={input.id}
                          value={formData[input.id] || ""}
                          onChange={handleInputChange}
                          className="itemValue"
                          placeholder={input.placeholder}
                          {...(input.multiple ? { multiple: input.multiple } : {})}
                          {...(input.min ? { min: input.min } : {})}
                          {...(input.maxLength ? { maxLength: input.maxLength } : {})}
                        />
                      ) : (
                        <span className="itemValue">
                          {formData[input.id] || "N/A"}
                        </span>
                      )}
                    </div>
                  ))}
                </form>
              </div>
            </div>
          </div>
          <div className="right">
            <AdminChart
              aspect={3 / 1}
              title={`${isUser ? "User" : isProduct ? "Product" : "Order"} Details`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSingle;
