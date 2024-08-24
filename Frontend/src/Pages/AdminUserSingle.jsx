import React, { useState, useEffect } from "react";
import "./CSS/AdminSingle.css";
import AdminChart from "../Components/AdminChart/AdminChart.jsx";
import { useParams } from "react-router-dom";
import { get, post, put, del } from '../config/api';

const AdminUserSingle = () => {
  const { userId } = useParams();
  const [formData, setFormData] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await get(`/api/v1/admin/get-user/${userId}`);
        const user = response.data.user; // Đảm bảo lấy dữ liệu từ user
        setFormData({
          id: user._id || "N/A",
          name: user.name || "N/A",
          email: user.email || "N/A",
          phone: user.phone || "N/A",
          address: user.address || "N/A",
          totalSpent: user.totalSpent || "N/A",
          role: user.role || "N/A",
          createAt: new Date(user.createdAt).toLocaleString() || "Invalid Date",
          images: ["https://minoshoesstorage.blob.core.windows.net/minoshoesbackground/people.jpg"]
          // images: user.images || [] // Assuming images is an array
        });
        setPreviewImages(["https://minoshoesstorage.blob.core.windows.net/minoshoesbackground/people.jpg"]);
        // setPreviewImages(user.images || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, [userId]);
  

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
            <h1 className="title">User Information</h1>
            <div className="item">
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
              <div className="details">
                <h1 className="itemTitle">{formData.name}</h1>
                <form>
                  {Object.keys(formData).map((key) => (
                    key !== 'images' && (
                      <div key={key} className="detailItem">
                        <label className="itemKey" htmlFor={key}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </label>
                        {isEditing && !['id', 'totalSpent', 'role', 'createAt'].includes(key) ? (
                          <input
                            type="text"
                            id={key}
                            name={key}
                            value={formData[key] || ""}
                            onChange={handleInputChange}
                            className="itemValue"
                          />
                        ) : (
                          <span className="itemValue">
                            {formData[key] || "N/A"}
                          </span>
                        )}
                      </div>
                    )
                  ))}
                </form>
              </div>
            </div>
          </div>
          <div className="right">
            <AdminChart
              aspect={3 / 1}
              title="User Details"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserSingle;
