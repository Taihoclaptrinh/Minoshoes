import React, { useState } from "react";
import "./CSS/AdminNew.css";
import { post } from '../config/api'; // Ensure this path is correct
import { couponInputs } from '../formSource'; // Import the couponInputs configuration
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { string } from "prop-types";

const AdminNewCoupon = ({ title, formType }) => {
  // Initialize formData from couponInputs
  const [formData, setFormData] = useState(() =>
    couponInputs.reduce((acc, input) => ({
      ...acc,
      [input.id]: input.type === "file" ? [] : "",
    }), {})
  );

  const [previewImages, setPreviewImages] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle input changes
  const handleInputChange = (id, value) => {
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e, id) => {
    const files = e.target.files;
    setFormData((prevData) => ({ ...prevData, [id]: files }));

    const fileArray = Array.from(files);
    const imageUrls = fileArray.map((file) => URL.createObjectURL(file));
    setPreviewImages(imageUrls);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare other product data
      const couponData = {
        code: formData.couponCode,
        discountValue: Number(formData.discountValue),
        startDate: formData.startDate,
        endDate: formData.endDate,
        usageCount: formData.usageCount,
        usageLimit: formData.usageLimit,
      };

      // Submit product data
      alert(JSON.stringify(couponData));
      const token = localStorage.getItem('token');
      const response = await post('/api/v1/admin/coupons', couponData, { headers: { Authorization: `Bearer ${token}` } });
      console.log('Coupon created:', response.data);
      navigate('/admin/coupons');
    } catch (error) {
      console.error('Error creating coupon:', error);
    }
  };


  return (
    <div className="AdminNew">
      <div className="newContainer">
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          {/* <div className="left">
            {formType === "product" && previewImages.length > 0 ? (
              <div className="imagePreviewContainer">
                {previewImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Preview ${index}`}
                    className="imagePreview"
                  />
                ))}
              </div>
            ) : (
              <div className="imagePreviewContainer">
                <img
                  src="https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                  alt="No Preview"
                  className="imagePreview"
                />
              </div>
            )}
          </div> */}
          <div className="right">
            <form onSubmit={handleSubmit}>
              {couponInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  {input.type === "file" ? (
                    <input
                      type={input.type}
                      placeholder={input.placeholder}
                      onChange={(e) => handleFileChange(e, input.id)}
                      multiple={input.multiple}
                    />
                  ) : (
                    <input
                      type={input.type}
                      placeholder={input.placeholder}
                      value={formData[input.id]}
                      onChange={(e) => handleInputChange(input.id, e.target.value)}
                      min={input.min} // Add min for number inputs
                    />
                  )}
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNewCoupon;
