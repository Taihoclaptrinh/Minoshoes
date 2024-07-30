import React from "react"
import "./Contact_info.css"
import logo from "../Assets/Logo2_Image.png"
import map from "../Assets/waiting_update.jpg"

export default function Contact_info(){
  return (
    <div className="Contact-container">
      <div className="address-img">
        <img src={map} alt="" />
      </div>
      <div className="nav-logo" >
        <img src={logo} alt="" style={{ height: "100px" }} />
      </div>

      <div className="text">
        <h1 className="h-top">Address:</h1>
        <h2 className="h-bottom">227 Nguyen Van Cu, Ward 4, District 5, HCMC</h2>
        <h1 className="h-top" style={{paddingTop:"25%"}}>Contact:</h1>
        <h2 className="h-bottom">minoshoestore@gmail.com</h2>
      </div>
    </div> 
  )
}