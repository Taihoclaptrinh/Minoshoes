import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { productData, responsive1 } from "./NPdata";
import "./Gallary.css"
import New_product from "./NewArrival.jsx";
const ProductSlider = () => {
    // Chia products thành nhóm 4 sản phẩm
  const Nproduct = productData.map((item) => (
    <New_product
      id={item.id}
      name={item.name}
      url={item.imageurl}
      price={item.price}
      description={item.description}
    />
  ));

  const productChunks = [];
  for (let i = 0; i < productData.length; i += 4) {
    productChunks.push(productData.slice(i, i + 4));
  }

  return (
      <Carousel responsive={responsive1}>
        {productChunks.map((chunk, index) => (
          <div key={index} className="product-group">
            <div className="product-row">
              {chunk.slice(0, 2).map(product => (
                <div key={product.id} className="new_product-card">
                  <div className="nproduct-image">
                    <img src={product.imageurl} alt={product.name} className="nproduct-image" />
                  </div>
                  <h3>{product.name}</h3>
                  {/* <p className="new_product-price">{product.price}</p> */}
                  <button>Buy Now</button>
                </div>
              ))}
            </div>
            <div className="product-row">
              {chunk.slice(2, 4).map(product => (
                <div key={product.id} className="new_product-card">
                  <div className="nproduct-image">
                    <img src={product.imageurl} alt={product.name} className="nproduct-image" />
                  </div>
                  <h3>{product.name}</h3>
                  {/* <p className="new_product-price">{product.price}</p> */}
                  <button>Buy Now</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Carousel>
  
  );
};

export default ProductSlider;
