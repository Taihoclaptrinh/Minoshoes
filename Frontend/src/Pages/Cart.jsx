import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CSS/Cart.css";
import Contact_info from "../Components/Contact_info/Contact_info.jsx";
import Footer from "../Components/Footer/Footer.jsx";

const Cart = () => {
    const [products, setProducts] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const itemsPerPage = 4;
    const [currentPage, setCurrentPage] = useState(0);

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN') + " VND";
    };

    const calculateTotalCost = () => {
        const total = products.reduce((acc, product) => acc + product.product.price * product.quantity, 0);
        setTotalCost(total);
    };

    const handleQuantityChange = async (productId, delta) => {
        try {
            const token = localStorage.getItem('token');
            const product = products.find(item => item.product._id === productId);
            const newQuantity = product.quantity + delta;
    
            if (newQuantity <= 0) {
                // Xóa sản phẩm khỏi giỏ hàng
                await axios.delete(`/api/v1/auth/cart/remove-from-cart/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // Cập nhật số lượng sản phẩm
                await axios.put('/api/v1/auth/cart/update-cart', {
                    productId,
                    quantity: newQuantity,
                    price: product.product.price
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
    
            // Lấy dữ liệu giỏ hàng đã cập nhật
            const response = await axios.get('/api/v1/auth/cart/get-cart', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(response.data.cartItems);
        } catch (error) {
            console.error('Error updating cart:', error.response ? error.response.data : error);
        }
    };
    

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const displayedProducts = products.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const handlePageChange = (delta) => {
        setCurrentPage(prevPage => Math.max(0, Math.min(totalPages - 1, prevPage + delta)));
    };

    useEffect(() => {
        calculateTotalCost();
    }, [products]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/v1/auth/cart/get-cart', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProducts(response.data.cartItems);
            } catch (error) {
                console.error('Error fetching cart data:', error);
            }
        };

        fetchCart();
    }, []);

    return (
        <div className="cart-page">
            <div className="cart-page-layout">
                <div className="cart-main-container">
                    <div className="cart-frame">
                        <div className="cart-wrapper">
                            <div className="cart">
                                <h2>YOUR CART</h2>
                                <div className="cart_products-container">
                                    <table id="cart_product-table">
                                        {displayedProducts.map(product => (
                                            <tr key={product.product._id}>
                                                <td>{product.product.name}</td>
                                                <td className="cart_quantity-container">
                                                    <button className="cart_quantity-button" onClick={() => handleQuantityChange(product.product._id, -1)}>-</button>
                                                    <span className="cart_quantity">{product.quantity}</span>
                                                    <button className="cart_quantity-button" onClick={() => handleQuantityChange(product.product._id, 1)}>+</button>
                                                </td>
                                                <td>{formatPrice(product.product.price * product.quantity)}</td>
                                            </tr>
                                        ))}
                                    </table>
                                </div>

                                <p>Address: Ho Chi Minh, Viet Nam</p>
                                <div className="payment-discount-container">
                                    <div className="payment-discount-row">
                                        <label htmlFor="payment-method">Payment Method</label>
                                        <select id="payment-method">
                                            <option value="credit-card">Credit Card</option>
                                            <option value="paypal">PayPal</option>
                                            <option value="bank-transfer">Bank Transfer</option>
                                        </select>
                                    </div>
                                    <div className="payment-discount-row">
                                        <label htmlFor="discount-code">Discount Code</label>
                                        <input type="text" id="discount-code" placeholder="G-" />
                                    </div>
                                </div>
                                <div className="cart-total">
                                    <span className="label">Total:</span>
                                    <span className="value">{formatPrice(totalCost)}</span>
                                    <button>Buy</button>
                                </div>
                            </div>
                        </div>  
                    </div>
                </div>
            
                {/* <Contact_info /> */}

                {/* <Footer /> */}
            </div>
        </div>
    );
}

export default Cart;
