import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { responsive1 } from "./NPdata"; // Import responsive settings
import "./Gallary.css";
import "../Bestseller/Bestseller.css";

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/v1/auth/products'); 
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const productChunks = [];
  const data = [...products]; // Clone the array if necessary
  for (let i = 0; i < data.length; i += 4) {
    productChunks.push(data.slice(i, i + 4));
  }

  return (
    <div className="nproduct_slider">
      <Carousel responsive={responsive1}>
        {productChunks.map((chunk, index) => (
          <div key={index} className="product-group">
            <div className="product-row">
              {chunk.slice(0, 2).map(product => (
                <div key={product._id} className="nproduct-card">
                  <div className="nproduct_image">
                    <img src={product.images[0]} alt={product.name} className="nproduct_image" />
                  </div>
                  <h3>{product.name}</h3>
                  {/* <p className="new_product-price">{product.price}</p> */}
                  <button>Buy Now</button>
                </div>
              ))}
            </div>
            <div className="product-row">
              {chunk.slice(2, 4).map(product => (
                <div key={product._id} className="nproduct-card">
                  <div className="nproduct_image">
                    <img src={product.images[0]} alt={product.name} className="nproduct_image" />
                  </div>
                  <h3>{product.name}</h3>
                  <button>Buy Now</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ProductSlider;
