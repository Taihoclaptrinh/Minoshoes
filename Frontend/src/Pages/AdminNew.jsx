import "./CSS/AdminNew.css";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";

const AdminNew = ({ inputs, title }) => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState(
    inputs.reduce((acc, input) => ({ ...acc, [input.id]: input.value || "" }), {})
  );

  const handleInputChange = (id, value) => {
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process form submission logic here
    console.log("Form Data:", formData);
    console.log("Uploaded File:", file);
  };

  return (
    <div className="AdminNew">
      <div className="newContainer">
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt="Preview"
              className="imagePreview" // Add a class for styling
            />
          </div>
          <div className="right">
            <form onSubmit={handleSubmit}>
              {/* File input for uploading images or documents */}
              <div className="formInput">
                <label htmlFor="file">
                  File: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {/* Render form inputs based on the passed `inputs` prop */}
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    type={input.type}
                    placeholder={input.placeholder}
                    value={formData[input.id]}
                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                  />
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
