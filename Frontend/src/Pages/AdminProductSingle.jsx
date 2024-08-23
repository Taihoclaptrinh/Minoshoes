import React, { useState, useEffect } from "react";
import "./CSS/AdminSingle.css";
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

  const productInputs = [
    { id: 'name', label: "Product Name", type: "text", placeholder: "Enter product name" },
    { id: 'description', label: "Description", type: "text", placeholder: "Enter description" },
    { id: 'price', label: "Price", type: "number", placeholder: "Enter price" },
    { id: 'brand', label: "Brand", type: "select", options: ["adidas", "puma", "asics", "nike", "vans"] },
    { id: 'category', label: "Category", type: "select", options: ["lifestyle", "casual", "running shoes"] },
    { id: 'stocks', label: "Stock", type: "text", placeholder: "Enter stock quantity" },
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
            <h1 className="title">Product Information</h1>
            <div className="item">
              <div className="imagePreviewContainer">
                {previewImages.length > 0 ? (
                  previewImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Preview ${index}`}
                    />
                  ))
                ) : (
                  <img
                    src="https://via.placeholder.com/150"
                    alt="No Preview"
                  />
                )}
              </div>
              <div className="details">
                <h1 className="itemTitle">{formData.name || "Product Details"}</h1>
                <form>
                  {productInputs.map((input) => (
                    <div key={input.id} className="detailItem">
                      <label className="itemKey">{input.label}:</label>
                      {isEditing ? (
                        input.type === "select" ? (
                          <select
                            id={input.id}
                            name={input.id}
                            value={formData[input.id] || ""}
                            onChange={handleInputChange}
                          >
                            {input.options.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={input.type}
                            name={input.id}
                            value={formData[input.id] || ""}
                            placeholder={input.placeholder}
                            onChange={handleInputChange}
                          />
                        )
                      ) : (
                        <span className="itemValue">{formData[input.id] || "N/A"}</span>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <div className="detailItem">
                      <label className="itemKey">Image:</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleInputChange}
                        multiple={true}
                      />
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
          {/* You can uncomment this section if you want to include the AdminChart */}
          {/* <div className="right">
            <AdminChart aspect={3 / 1} title="Product Details" />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AdminProductSingle;
