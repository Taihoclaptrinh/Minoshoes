import React from "react"
import "./Bestseller.css";
import "../Gallary/Gallary.css"
// react-multi-carousel 
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Product from "./Product";
import { productData, responsive } from "./data";
const Bestsellers = () => {

  const product = productData.map((item) => (
    <Product
      name={item.name}
      url={item.imageurl}
      price={item.price}
      description={item.description}
    />
  ));

  return (
    <div className="layout-BSeller">
      <div className="head-content">
          <div className="head-up">Shop</div>
          <div className="head-down">BEST SELLERS</div>
          <div className="head-up">Discover our top-selling products that are loved by customers.
              <div className="viewall-button" onClick={() => window.location.href = 'http://localhost:3000/login'}>
                  View All
              </div>
          </div>
      </div>
      <div className="bseller-image">
        <Carousel showDots={true} responsive={responsive}>
          {product}
        </Carousel>
      </div>

    </div>
  )
}

export default Bestsellers;