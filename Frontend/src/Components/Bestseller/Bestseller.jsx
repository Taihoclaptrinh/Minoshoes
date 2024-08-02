import React from "react"
import "./Bestseller.css";
import "../Gallary/Gallary.css"
// react-multi-carousel 
// import Carousel from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";
// import Product from "./Product";
// import { productData, responsive  } from "./data";
import Slider from "../Slider/Slider.jsx";
const Bestsellers = () => {
  return (
    <div className="layout-BSeller">
      <div className="head-content">
          {/* <h2 className="head-up">Shop</h2> */}
          <h1>BEST SELLERS</h1>
          <h2>Discover our top-selling products that are loved by customers.
              <div className="viewall-button" onClick={() => window.location.href = 'http://localhost:3000/new-arrivals'}>
                  View All
              </div>
          </h2>
      </div>
      <div className="bseller_image">
        <Slider />
      </div>
      {/* <div className="bseller_image">
        <Carousel showDots={true} responsive={responsive}>
          {product}
        </Carousel>
      </div> */}

    </div>
  )
}

export default Bestsellers;