import "./CSS/AdminNew.css";
import { useState } from "react";
import axios from "axios"; // Import axios for API calls

const AdminNew = ({ inputs, title, formType }) => {
  const [formData, setFormData] = useState(
    inputs.reduce((acc, input) => ({
      ...acc,
      [input.id]: input.value || (input.type === "file" ? [] : ""),
    }), {})
  );

  const [previewImages, setPreviewImages] = useState([]);

  const handleInputChange = (id, value) => {
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleFileChange = (e, id) => {
    const files = e.target.files;
    setFormData((prevData) => ({ ...prevData, [id]: files }));

    const fileArray = Array.from(files);
    const imageUrls = fileArray.map((file) => URL.createObjectURL(file));
    setPreviewImages(imageUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate numeric fields
    if (formData.productPrice < 0) {
      alert("Price must be a non-negative value.");
      return;
    }

    try {
      // Create FormData for file upload
      const fileData = new FormData();
      if (formData.productImages.length > 0) {
        Array.from(formData.productImages).forEach((file) => {
          fileData.append('images', file); // Ensure the key matches the backend expectation
        });
        
        // Upload images and get image URLs
        const uploadResponse = await axios.post('/api/v1/auth/upload', fileData);
        const { imageUrls } = uploadResponse.data;

        // Prepare product data
        const productData = {
          code: formData.productCode,
          name: formData.productName,
          description: formData.productDescription,
          price: Number(formData.productPrice),
          brand: formData.productBrand,
          category: formData.productCategory,
          sizes: formData.productSizes.split(',').map(size => size.trim()),
          color: formData.productColor.split(',').map(color => color.trim()),
          stocks: formData.productStocks.split(',').map(stock => Number(stock.trim())),
          images: imageUrls,
          createdAt: formData.productCreateAt,
          updatedAt: formData.productUpdateAt,
        };
        console.log(productData)
        alert(`Product Data: ${JSON.stringify(productData, null, 2)}`);

        // Send product data to the API to create a new product
        const response = await axios.post('/api/v1/auth/products', productData);
        console.log('Product created successfully:', response.data);
      } else {
        alert("Please upload at least one image.");
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div className="AdminNew">
      <div className="newContainer">
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            {(formType === "product" || formType === "user") && previewImages.length > 0 ? (
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
          </div>
          <div className="right">
            <form onSubmit={handleSubmit}>
              {inputs.map((input) => (
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
                    />
                  )}
                </div>
              ))}
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNew;
