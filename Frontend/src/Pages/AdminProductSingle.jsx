import React, { useState, useEffect } from "react";
import "./CSS/AdminProductSingle.css";
// import AdminChart from "../Components/AdminChart/AdminChart.jsx";
import { useParams } from "react-router-dom";
import { get, post, put, del } from '../config/api';

const AdminProductSingle = () => {
  const { productId } = useParams(); // Get the productId from the URL parameters
  const [formData, setFormData] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await get(`/api/v1/admin/products/${productId}`);
        const product = response.data.product;
        setFormData({
          id: product._id || "N/A",
          name: product.name || "N/A",
          description: product.description || "N/A",
          price: product.price || "N/A",
          brand: product.brand || "N/A",
          category: product.category || "N/A",
          sizes: product.sizes.join(", ") || "N/A",
          color: product.color.join(", ") || "N/A",
          stocks: product.stocks.join(", ") || "N/A",
          created_at: new Date(product.created_at).toLocaleString() || "Invalid Date",
          updated_at: new Date(product.updated_at).toLocaleString() || "Invalid Date",
        });
        setPreviewImages(product.images || []);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
  
    fetchProductData();
  }, [productId]);

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
      images: imageUrls,
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

  return (
    <div className="admin-product-single">
      <div className="single-container">
        <div className="top">
          <div className="left">
            <div className="button-container">
              <button className="edit-button" onClick={toggleEditMode}>
                {isEditing ? "Cancel" : "Edit"}
              </button>
              {isEditing && (
                <button className="save-button" onClick={saveChanges}>
                  Save
                </button>
              )}
            </div>
            <h1 className="Product_single_title">Product Information</h1>
            <div className="Product_single_item">
              <div className="Product_single_image-preview-container">
                {previewImages.length > 0 ? (
                  previewImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Preview ${index}`}
                      className="item-img"
                    />
                  ))
                ) : (
                  <img
                    src="https://via.placeholder.com/150"
                    alt="No Preview"
                    className="item-img"
                  />
                )}
              </div>
              <div className="Product_single_details">
                <h1 className="Product_single_item-title">{formData.name}</h1>
                <form>
                  {Object.keys(formData).map((key) => (
                    key !== 'images' && (
                      <div key={key} className="Product_single_detail-item">
                        <label htmlFor={key}>
                          <span className="Product_single_item-key">{key.charAt(0).toUpperCase() + key.slice(1)}: </span>
                          {isEditing ? (
                              <input
                                type="text"
                                id={key}
                                name={key}
                                value={formData[key] || ""}
                                onChange={handleInputChange}
                                className="item-value"
                              />
                          ) : (
                            <span className="Product_single_item-value">
                              {formData[key] || "N/A"}
                            </span>
                          )}
                        </label>
                      </div>
                      
                    )
                  ))}
                </form>
              </div>
            </div>
          </div>
          {/* <div className="right">
            <AdminChart
              aspect={3 / 1}
              title="Product Details"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AdminProductSingle;
