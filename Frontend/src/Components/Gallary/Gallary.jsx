import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Gallary.css";
import { Link } from "react-router-dom";
import Pop_up from "../Popup_PayOS/Popup";
import ProductSlider from "./ProductSlider";

const Gallary = () => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const hotshoe4 = "https://minoshoesstorage.blob.core.windows.net/minoshoesbackground/jordan-ng.jpeg";

  const handleExploreClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    navigate("/"); // Redirect to the landing page
  };

  return (
    <div className="layout">
      <div className="layout-trending">
        <h1 className="trending-qoute">SEASONAL FOCUS</h1>
        <div className="trending-img">
          <img src={hotshoe4} alt="" className="img-format4" />
          <ProductSlider />
        </div>
        <div className="trending-button">
          <Link to="/new-arrivals" className="Gal_left-section">
            Shop
          </Link>
          <div className="Gal_right-section" onClick={handleExploreClick}>
            Explore
          </div>
        </div>
      </div>
      {showPopup && <Pop_up review="Thanh toán thành công!" onClose={closePopup} />}
    </div>
  );
};

export default Gallary;
