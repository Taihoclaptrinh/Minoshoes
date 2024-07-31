import React from 'react';
import "./Brand_Section.css"
import Image1 from "../Assets/adidas_logo.png"
import Image2 from "../Assets/nike_logo.png"
import Image3 from "../Assets/nb_logo.png"
import Image4 from "../Assets/vans_logo.png"
import Image5 from "../Assets/converse_logo.png"

export default function Brand_Section() {
  const images = [Image1, Image2, Image3, Image4, Image5];
  return (
    <div className='Logo-container'>
      <h3>Discover top shoe brands trusted by millions worldwide </h3>
      
      <div className='Logo-images'>
        <img src={Image1} alt="" />
        <img src={Image2} alt="" />
        <img src={Image3} alt="" />
        <img src={Image4} alt="" />
        <img src={Image5} alt="" />
      </div>
    </div>
  );
};