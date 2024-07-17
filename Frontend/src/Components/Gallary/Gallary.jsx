import React from "react"
import "./Gallary.css";
import { Link } from "react-router-dom"
import hotshoe4 from "../Assets/Image4.png"
import ProductSlider from "./ProductSlider"

// import Carousel from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";
// import Product from "../Bestseller/Product";
// import { productData, responsive } from "../Bestseller/data";
const Gallary = () => {
  // const product = productData.map((item) => (
  //   <Product
  //     name={item.name}
  //     url={item.imageurl}
  //     price={item.price}
  //     description={item.description}
  //   />
  // ));
  return (  
    <div className="layout">
      <div className="layout-trending">
        <div className="trending-qoute">
          SEASONAL FOCUS
        </div>

        {/* <div className="nproduct_slider">
          <Carousel showDots={true} responsive={responsive}>
            {product}
          </Carousel>
        </div> */}

        <div className="trending-img">
          <img src={hotshoe4} alt="" className="img-format4"/>
          <ProductSlider />
        </div>
        
        <div className="trending-button">
          <div className="Gal_left-section" onClick={() => window.location.href = 'http://localhost:3000/login'} >
            Shop
          </div>
          <div className="Gal_right-section" onClick={() => window.location.href = 'http://localhost:3001/new-arrivals'}>
            Explore
          </div> 
        </div>
      </div>
      
    </div>
  );
};
export default Gallary