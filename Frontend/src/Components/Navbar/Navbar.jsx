import React, { useState, useContext } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../Assets/logo.png";
import shopping_cart from "../Assets/shopping-cart.png";
import search_icon from "../Assets/search_icon.png";
import user_icon from "../Assets/user_icon.png";
import { UserContext } from '../../UserContext.js'; // Đảm bảo đường dẫn chính xác

const Navbar = () => {
    const [menu, setMenu] = useState("shop");
    const [searchQuery, setSearchQuery] = useState(""); // Trạng thái tìm kiếm
    const [showSearch, setShowSearch] = useState(false); // Hiện/Ẩn thanh tìm kiếm
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        if (logout) {
            logout();
            navigate('/login'); // Chuyển hướng người dùng đến trang đăng nhập sau khi đăng xuất
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery) {
            navigate(`/search?query=${searchQuery}`); // Chuyển hướng đến trang tìm kiếm với query
        }
    };

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
                <img
                    src={search_icon}
                    alt=""
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                    onClick={() => setShowSearch(!showSearch)}
                />
                {showSearch && (
                    <form onSubmit={handleSearchSubmit} className="search-form">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            style={{ padding: "5px", marginRight: "5px" }}
                        />
                        <button type="submit">Search</button>
                    </form>
                )}
                <Link to='cart'><img src={shopping_cart} alt="" style={{ width: "30px", height: "30px" }} /></Link>
                <div className="nav-cart-count">0</div>
                {user ? (
                    <div className="user-greeting">
                        <span>hi {user.name}</span>
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </div>
                ) : (
                    <Link to='login'><img src={user_icon} alt="" style={{ width: "30px", height: "30px" }} /></Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
