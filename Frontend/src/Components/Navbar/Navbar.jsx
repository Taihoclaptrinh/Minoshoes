import React, { useEffect, useState, useContext, useRef  } from "react"
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
    const [searchVisible, setSearchVisible] = useState(false);
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();
    const searchBarRef = useRef(null);

    const handleLogout = () => {
        if (logout) {
            logout();
            navigate('/login'); // Chuyển hướng người dùng đến trang đăng nhập sau khi đăng xuất
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleClickOutside = (event) => {
        if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
            setSearchVisible(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery) {
            navigate(`/search?query=${searchQuery}`); // Chuyển hướng đến trang tìm kiếm với query
        }
    };
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = (menuName) => {
        setMenu(menu === menuName ? "" : menuName);
    };
    
    return (
        <div className="navbar">
            <div className="nav-content">
                <div className="nav-logo" onClick={() => { setMenu("shop") }}>
                    <Link to='/'><img src={logo} alt="" style={{ height: "80px" }} /></Link>
                </div>
                <ul className="nav-menu" style={{ opacity: searchVisible ? 0 : 1 }}>
                    <li class="nav-item" onClick={() => { setMenu("men") }}><Link style={{ textDecoration: 'none', color: 'black' }} to='men'>MEN</Link>{menu === "men"}
                        <div className="dropdown-container">
                            <div class="dropdown">
                                <a className="title" href="#">Shoes</a>
                                <a href="#">Running</a>
                                <a href="#">Casual</a>
                                <a href="#">Lifestyle</a>
                                <a className="title" href="#">Shop by Size</a>
                                <div className="size-options1">
                                    <a href="#">9.5</a>
                                    <a href="#">10</a>
                                    <a href="#">10.5</a>
                                    <a href="#">11</a>
                                    <a href="#">7.5</a>
                                    <a href="#">8</a>
                                    <a href="#">8.5</a>
                                    <a href="#">9</a>
                                    <a href="#">5.5</a>
                                    <a href="#">6</a>
                                    <a href="#">6.5</a>
                                    <a href="#">7</a>
                                </div>
                            </div>  
                        </div>
                    </li>
                    <li class="nav-item" onClick={() => { setMenu("women") }}><Link style={{ textDecoration: 'none', color: 'black' }} to='women'>WOMEN</Link>{menu === "women"}
                        <div className="dropdown-container">
                            <div class="dropdown">
                                <a className="title" href="#">Shoes</a>
                                <a href="#">Running</a>
                                <a href="#">Casual</a>
                                <a href="#">Lifestyle</a>
                                <a className="title size" href="#">Shop by Size</a>
                                <div className="size-options2">
                                    <a href="#">4.5</a>
                                    <a href="#">5</a>
                                    <a href="#">3.5</a>
                                    <a href="#">4</a>
                                    
                                </div>          
                            </div>
                        </div>    
                            
                    </li>
                    <li class="nav-item" onClick={() => { setMenu("brands") }}><Link style={{ textDecoration: 'none', color: 'black' }} to='brands'>BRANDS</Link>{menu === "brands"}
                        <div className="dropdown-container">
                            <div class="dropdown">
                                <a className="title" href="#">Shop By Brand</a>
                                <a href="#">Adidas</a>
                                <a href="#">Nike</a>
                                <a href="#">Asics</a>
                                <a href="#">Vans</a>
                                <a href="#">Puma</a>
                            </div>
                        </div>   

                    </li>
                    <li onClick={() => { setMenu("new-arrivals") }}><Link style={{ textDecoration: 'none', color: 'black' }} to='new-arrivals'>NEW ARRIVALS</Link>{menu === "new-arrivals"}</li>
                    <li onClick={() => { setMenu("sale") }}><Link style={{ textDecoration: 'none', color: 'black' }} to='sale'>SALE</Link>{menu === "sale"}</li>
                </ul>
                <div className="nav-search-login-cart">
                    <div className="search-container">
                        <img
                            src={search_icon}
                            alt="Search Icon"
                            className="search-icon"
                            onClick={() => setSearchVisible(!searchVisible)}
                        />
                    </div>
                    <Link to='cart'><img src={shopping_cart} alt="" style={{ width: "30px", height: "30px" }} /></Link>
                    <div className="nav-cart-count">0</div>
                    <Link to='login'><img src={user_icon} alt="" style={{ width: "30px", height: "30px" }} /></Link>
                </div>
            </div>
            {searchVisible && (
                <div className="search-phare" ref={searchBarRef}>
                    <form onSubmit={handleSearchSubmit} className={`search-bar ${searchVisible ? "" : "hidden"}`}>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            // style={{ padding: "5px", marginRight: "5px" }}
                        />
                    </form>
                    <div className="search-icon-after-layout">
                        <img
                            src={search_icon}
                            alt="Search Icon"
                            onClick={handleSearchChange}
                        />
                    </div>
                </div>
            )}
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
    );
};

export default Navbar;
