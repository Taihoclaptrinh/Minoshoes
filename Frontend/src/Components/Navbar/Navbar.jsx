import React, { useState } from "react"
import "./Navbar.css"
import { Link } from "react-router-dom"
import logo from "../Assets/logo.png"
import shopping_cart from "../Assets/shopping-cart.png"
import search_icon from "../Assets/search_icon.png"
import user_icon from "../Assets/user_icon.png"

const Navbar = () => {

    const [menu, setMenu] = useState("shop");

    return (
        <div className="navbar">
            <div className="nav-logo" onClick={() => { setMenu("shop") }}>
                <Link to='/'><img src={logo} alt="" style={{ height: "80px" }} /></Link>
            </div>
            <ul className="nav-menu">
                <li onClick={() => { setMenu("men") }}><Link style={{ textDecoration: 'none', color: 'black' }} to='men'>MEN</Link>{menu === "men"}</li>
                <li onClick={() => { setMenu("women") }}><Link style={{ textDecoration: 'none', color: 'black' }} to='women'>WOMEN</Link>{menu === "women"}</li>
                <li onClick={() => { setMenu("brands") }}><Link style={{ textDecoration: 'none', color: 'black' }} to='brands'>BRANDS</Link>{menu === "brands"}</li>
                <li onClick={() => { setMenu("new-arrivals") }}><Link style={{ textDecoration: 'none', color: 'black' }} to='new-arrivals'>NEW ARRIVALS</Link>{menu === "new-arrivals"}</li>
                <li onClick={() => { setMenu("sale") }}><Link style={{ textDecoration: 'none', color: 'black' }} to='sale'>SALE</Link>{menu === "sale"}</li>
            </ul>
            <div className="nav-search-login-cart">
                <img src={search_icon} alt="" style={{ width: "20px", height: "20px" }} />
                <Link to='cart'><img src={shopping_cart} alt="" style={{ width: "30px", height: "30px" }} /></Link>
                <div className="nav-cart-count">0</div>
                <Link to='login'><img src={user_icon} alt="" style={{ width: "30px", height: "30px" }} /></Link>
            </div>
        </div>
    )
}

export default Navbar