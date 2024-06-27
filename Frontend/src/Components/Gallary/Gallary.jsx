import React from "react"
import "./Gallary.css";
import Bestsellers from "../Bestseller/Bestseller.jsx"
import Reviews from "../Reviews/Reviews.jsx"
import { Link } from "react-router-dom"
import context1 from "../Assets/context1.png"
import hotshoe1 from "../Assets/Image1.png"
import hotshoe2 from "../Assets/Image2.png"
import hotshoe3 from "../Assets/Image3.png"
import hotshoe4 from "../Assets/Image4.png"

const Gallary = () => {

  return (  
    <div className="layout">
      <div className="layout-trending">
        <div className="trending-qoute">
          <Link to="/">
            <img src={context1} alt="" style={{height : "105px"}} />
          </Link>
        </div>
        
        <div className="trending-img">
          <img src={hotshoe1} alt="" className="img-format1"/>
          <img src={hotshoe2} alt="" className="img-format2"/>
          <img src={hotshoe3} alt="" className="img-format3"/>
          <img src={hotshoe4} alt="" className="img-format4"/>
        </div>
        
        <div className="trending-button">
          <div className="left-section" onClick={() => window.location.href = 'http://localhost:3000/login'} >
            Shop
          </div>
          <div className="right-section" onClick={() => window.location.href = 'http://localhost:3001/new-arrivals'}>
            Explore
          </div> 
        </div>
      </div>
      <Bestsellers />
      <Reviews />
    </div>
  );
};
export default Gallary