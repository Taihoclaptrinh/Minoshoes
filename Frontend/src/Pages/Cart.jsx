import React, { useState, useEffect } from "react";
import "./CSS/Cart.css"
import Contact_info from "../Components/Contact_info/Contact_info.jsx"
import Footer from "../Components/Footer/Footer.jsx"
import { products as initialProductData } from "./cart_data.js";

const Cart = () => {
    const [products, setProducts] = useState(initialProductData);
    const [totalCost, setTotalCost] = useState(0);
    useEffect(() => {
        calculateTotalCost();
    }, [products]);

    const calculateTotalCost = () => {
        const total = products.reduce((acc, product) => acc + product.price * product.quantity, 0);
        setTotalCost(total);
    };

    const handleQuantityChange = (productId, delta) => {
        const updatedProducts = products.map(product => {
            if (product.id === productId) {
                const newQuantity = product.quantity + delta;
                if (newQuantity <= 0) return null;
                return { ...product, quantity: newQuantity };
            }
            return product;
        }).filter(product => product !== null);
        setProducts(updatedProducts);
    };
    // Number of products to display at a time
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(0);

    // Calculate total number of pages
    const totalPages = Math.ceil(products.length / itemsPerPage);

    // Get the products to display for the current page
    const displayedProducts = products.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    // Handle page change
    const handlePageChange = (delta) => {
        setCurrentPage(prevPage => Math.max(0, Math.min(totalPages - 1, prevPage + delta)));
    };

    return (
        <div className="cart-page">
            <div className="cart-page-layout">
                <div className="cart-main-container">
                    <div className="cart-frame">
                        <div class="cart-wrapper">
                            <div class="cart">
                                <h2>YOUR CART</h2>
                                <div className="products-container">
                                    <table id="product-table">
                                        {products.map(product => (
                                            <tr key={product.id}>
                                                <td>{product.name}</td>
                                                <td className="quantity-container">
                                                    <button className="quantity-button" onClick={() => handleQuantityChange(product.id, -1)}>-</button>
                                                    <span className="quantity">{product.quantity}</span>
                                                    <button className="quantity-button" onClick={() => handleQuantityChange(product.id, 1)}>+</button>
                                                </td>
                                                <td style={{}}>${product.price * product.quantity}</td>
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
                                    {/* Total: ${totalCost}
                                     */}
                                    <span className="label">Total:</span>
                                    <span className="value">${totalCost}</span>
                                    <button>Buy</button>
                                </div>
                            </div>
                        </div>  
                    </div>
                </div>
            
            <Contact_info />

            <Footer />
            </div>
        </div>

    )
}

export default Cart