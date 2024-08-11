import React, { useEffect, useState, useContext, useRef } from "react";
import "./Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from '../../UserContext.js'; // Đảm bảo đường dẫn chính xác
import axios from 'axios'; // Import axios for API calls

const Navbar = () => {
    const [menu, setMenu] = useState("shop");
    const [searchQuery, setSearchQuery] = useState(""); // Trạng thái tìm kiếm
    const [searchVisible, setSearchVisible] = useState(false);
    const [cartCount, setCartCount] = useState(0); // State to hold cart item count
    const { user, logout } = useContext(UserContext);
    const logo = "https://minoshoesstorage.blob.core.windows.net/minoshoesbackground/logo.jpg";
    const shopping_cart = "https://minoshoesstorage.blob.core.windows.net/minoshoesbackground/icon-cart.jpg";
    const search_icon = "https://minoshoesstorage.blob.core.windows.net/minoshoesbackground/search_icon.png";
    const user_icon = "https://minoshoesstorage.blob.core.windows.net/minoshoesbackground/icon-ng.jpg";

    const navigate = useNavigate();
    const searchBarRef = useRef(null);
    const location = useLocation(); // Access current location

    const handleLogout = () => {
        if (logout) {
            logout();
            navigate('/login'); // Chuyển hướng người dùng đến trang đăng nhập sau khi đăng xuất
        }
    };

    const handleSearchIconClick = () => {
        if (searchVisible && searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
            setSearchVisible(false);
            setSearchQuery('');
        } else {
            setSearchVisible(!searchVisible);
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
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
            setSearchVisible(false);
            setSearchQuery('');
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchCartCount = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await axios.get('/api/v1/auth/cart/count', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.data && typeof response.data.totalQuantity === 'number') {
                        setCartCount(response.data.totalQuantity);
                    } else {
                        console.error("Invalid response format:", response.data);
                    }
                } else {
                    setCartCount(0);
                }
            } catch (error) {
                console.error('Error fetching cart count:', error);
                setCartCount(0);
            }
        };

        if (user) {
            fetchCartCount();
        
            // Thêm event listener để cập nhật cartCount
            const handleCartCountUpdate = (event) => {
              setCartCount(event.detail);
            };
            window.addEventListener('cartCountUpdated', handleCartCountUpdate);
        
            return () => {
              window.removeEventListener('cartCountUpdated', handleCartCountUpdate);
            };
          } else {
            setCartCount(0);
          }
        }, [user, location.pathname]);

    useEffect(() => {
        console.log("Current cart count:", cartCount);
    }, [cartCount]);

    const toggleDropdown = (menuName) => {
        setMenu(menu === menuName ? "" : menuName);
    };

    const updateCartCount = async (action) => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error("No token found");
            return;
        }

        // Cập nhật cục bộ dựa trên hành động của người dùng
        if (action === 'increase') {
            setCartCount(prevCount => prevCount + 1);
        } else if (action === 'decrease' && cartCount > 0) {
            setCartCount(prevCount => prevCount - 1);
        }

        try {
            const response = await axios.post('/api/v1/auth/cart/update', {
                action: action
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data && typeof response.data.totalQuantity === 'number') {
                setCartCount(response.data.totalQuantity); // Cập nhật lại từ API
            } else {
                console.error("Invalid response format:", response.data);
            }
        } catch (error) {
            console.error('Error updating cart count:', error);
            // Nếu có lỗi, bạn có thể khôi phục trạng thái trước đó nếu cần
        }
    };

    return (
        <div className="navbar">
            <div className="nav-content">
                <div className="nav-logo" onClick={() => { setMenu("shop") }}>
                    <Link to='/'><img src={logo} alt="" style={{ height: "80px" }} /></Link>
                </div>
                <ul className="nav-menu" style={{ opacity: searchVisible ? 0 : 1 }}>
                    {/* thêm api vào onClick, tương tự với các mục click khác */}
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
                    <div className="nav-cart-count">{cartCount !== undefined ? cartCount : 0}</div>                    {user ? (
                    <div className="nav-item user-greeting">
                        <Link to='login'><img src={user_icon} alt="" style={{ width: "30px", height: "30px" }} /></Link>
                        <span>hi, {user.name}</span>
                        <div style={{marginTop:"-3rem"}} className="dropdown-container">
                            <div class="dropdown">
                                {/* User info hiện cho người dùng bình thường
                                    Admin dashboard chỉ hiện cho role Admin */}
                                <a href="/userinfo">User Info</a>
                                <a href="/admin/*">Admin dashboard</a>
                                <a onClick={handleLogout}>Log out</a>
                            </div>
                        </div>   
                    </div>
                    ) : (
                        <Link to='login'><img src={user_icon} alt="" style={{ width: "30px", height: "30px" }} /></Link>
                    )}
                    
                </div>
            </div>
            {searchVisible && (
            <div className="search-phare" ref={searchBarRef}>
                <form onSubmit={handleSearchSubmit} className={`search-bar ${searchVisible ? "" : "hidden"}`}>
                    <input
                        type="text"
                        placeholder="Search by name or code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>
                <div type="submit" className="search-icon-after-layout">
                    <img src={search_icon} 
                        alt="Search Icon" 
                        onClick={handleSearchIconClick}
                    />
                </div>
            </div>
        )}
                <div className="nav-cart-count">0</div>
                
            </div>
    );
};

export default Navbar;
