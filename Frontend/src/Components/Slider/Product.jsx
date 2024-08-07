import React from 'react';
import "../Bestseller/Bestseller.css";

// Hàm định dạng giá tiền
const formatPrice = (price) => {
  return price.toLocaleString('vi-VN') + " VND";
};

const Product = (props) => {
  return (
    <div className="product--card">
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
