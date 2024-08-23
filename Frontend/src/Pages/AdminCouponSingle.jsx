import React, { useState, useEffect } from "react";
import "./CSS/AdminSingle.css";
import { useParams } from "react-router-dom";
import { couponRows } from "../datatablesource.js";

const AdminCouponSingle = () => {
  const { couponId } = useParams();

  const initialData = couponRows.find((coupon) => coupon.id.toString() === couponId.toString());

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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

  const couponInputs = [
    { id: 'coupon', label: "Coupon", type: "text", placeholder: "Coupon Code" },
    {
      id: 'type',
      label: "Type",
      type: "select",
      options: ["Freeship", "Discount price"],
    },
    { id: 'discount_value', label: "Discount Value", type: "number", placeholder: "0", min: 0 },
    { id: 'minimum_purchase_amount', label: "Minimum Purchase Amount", type: "number", placeholder: "0", min: 0 },
    { id: 'description', label: "Description", type: "text", placeholder: "Coupon Description" },
    { id: 'createAt', label: "Created At", type: "date", disabled: true },
    { id: 'expiredAt', label: "Expired Date", type: "date" },
  ];

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
            <h1 className="title">Coupon Information</h1>
            <div className="item">
              <div className="details">
                <h1 className="itemTitle">{formData.coupon || "Details"}</h1>
                <form>
                  {couponInputs.map((input) => (
                    <div key={input.id} className="detailItem">
                      <label className="itemKey">{input.label}:</label>
                      {isEditing ? (
                        input.type === "select" ? (
                          <select
                            id={input.id}
                            name={input.id}
                            value={formData[input.id] || ""}
                            onChange={handleInputChange}
                            disabled={input.disabled}
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
                            id={input.id}
                            name={input.id}
                            value={formData[input.id] || ""}
                            placeholder={input.placeholder || ""}
                            onChange={handleInputChange}
                            disabled={input.disabled}
                          />
                        )
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
        </div>
      </div>
    </div>
  );
};

export default AdminCouponSingle;
