import React from 'react';
import "./Slider.css";
import { useNavigate } from 'react-router-dom'; // Thêm import useNavigate

// Hàm định dạng giá tiền
const formatPrice = (price) => {
  return price.toLocaleString('vi-VN') + " VND";
};


const Product = (props) => {
  const navigate = useNavigate();
  const handleProductClick = (productName) => {
    navigate(`/product?name=${encodeURIComponent(productName)}`);
  };

  return (
    <div className="product--card" onClick={() => handleProductClick(props.name)}>
      <img className="product--image" src={props.url} alt={props.name} />
      <h2 className="product--name">{props.name}</h2>      
      <p className="price">{formatPrice(props.price)}</p>
      <p className="description">{props.description}</p>
      <p>
        <button className="add-to-cart-button">Add to Cart</button>
      </p>
    </div>
  );
};

export default Product;
