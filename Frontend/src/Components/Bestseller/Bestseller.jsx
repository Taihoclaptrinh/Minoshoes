import React from "react"
import "./Bestseller.css";
import "../Layout/Gallary.css"
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

const Bestsellers = () => {

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
        <Carousel responsive={responsive}>
          <div className="bs-image">
            <img src="" alt="product image"></img>
            <h2> </h2>
            <p className="price"></p>
            <p> Decription</p>
            <p> 
              <button>Add to Cart</button>
            </p>
          </div>
          <div>Item 2</div>
          <div>Item 3</div>
          <div>Item 4</div>
        </Carousel>;
        </div>

    </div>
  )
}

export default Bestsellers;