import "./CSS/AdminNew.css";
import { useState } from "react";

const AdminNew = ({ inputs, title, formType }) => {
  const [formData, setFormData] = useState(
    inputs.reduce((acc, input) => ({
      ...acc,
      [input.id]: input.value || (input.type === "file" ? [] : ""), // Initialize file inputs as empty arrays
    }), {})
  );

  const [previewImages, setPreviewImages] = useState([]);

  // Pre-fill specific fields for user form
  if (formType === "user") {
    formData.role = "admin";
    formData.createAt = new Date().toISOString().split("T")[0]; // Auto-fill with current date
    formData.updateAt = new Date().toISOString().split("T")[0];
    formData.totalSpent = 0;
  }

  const handleInputChange = (id, value) => {
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleFileChange = (e, id) => {
    const files = e.target.files;
    setFormData((prevData) => ({ ...prevData, [id]: files }));

    // Update preview images
    const fileArray = Array.from(files);
    const imageUrls = fileArray.map((file) => URL.createObjectURL(file));
    setPreviewImages(imageUrls);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure numeric values are non-negative
    for (const key in formData) {
      if (["price", "totalAmount"].includes(key) && Number(formData[key]) < 0) {
        alert(`${key} must be a non-negative value.`);
        return;
      }
    }

    // Process form submission logic here
    console.log("Form Data:", formData);
    // For file uploads, you may need to handle FormData and submit it via API
  };

  return (
    <div className="AdminNew">
      <div className="newContainer">
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            {/* Show preview images if needed */}
            {(formType === "product" || formType === "user") &&
            previewImages.length > 0 ? (
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
              {/* Render form inputs based on the passed `inputs` prop */}
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  {input.type === "file" ? (
                    <input
                      type={input.type}
                      placeholder={input.placeholder}
                      onChange={(e) => handleFileChange(e, input.id)}
                      multiple={input.multiple} // Handle multiple file uploads if needed
                    />
                  ) : (
                    <input
                      type={input.type}
                      placeholder={input.placeholder}
                      value={formData[input.id]}
                      onChange={(e) =>
                        handleInputChange(input.id, e.target.value)
                      }
                      disabled={
                        (formType === "user" &&
                          (input.id === "userRole" ||
                            input.id === "userTotalSpent")) ||
                        false
                      }
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
