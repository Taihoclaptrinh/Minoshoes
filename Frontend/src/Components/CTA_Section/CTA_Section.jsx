import React from "react";
import "./CTA_Section.css";
import CTA_Background from "../Assets/CTA_Background.png";

export default function CTA_Section() {
  return (
    <div className="CTA-background">
      <img src={CTA_Background} alt=""/>
      <div class="container">
        <h1>
            <span class="gradient-text top">Stay Updated with Our </span>
            <span class="gradient-text bottom">Newsletter</span>
        </h1>
        <p className="format-text">Register to receive the latest news, events, products, and exclusive sale offers.</p>
      </div>
      <div className="CTA-button">
        <div className="left-section" onClick={() => window.location.href = 'http://localhost:3000/login'} >
          Sign Up
        </div>
        <div className="right-section" onClick={() => window.location.href = 'http://localhost:3001/new-arrivals'}>
          Learn More
        </div> 
      </div>
    </div>
  )
}
