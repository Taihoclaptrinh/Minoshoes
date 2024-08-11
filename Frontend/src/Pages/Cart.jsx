import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./CSS/Cart.css";
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext.js';
import Pop_up from '../Components/Popup_PayOS/Popup.jsx';

const Cart = () => {
    const [products, setProducts] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [shippingFee, setShippingFee] = useState(0);
    const [sizes, setSizes] = useState([]);
    const [stocks, setStocks] = useState([]);

    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [paymentMethod, setPaymentMethod] = useState('--');
    const itemsPerPage = 4;

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN') + " VND";
    };

    const updateTotalItems = () => {
        const total = products.reduce((acc, product) => acc + product.quantity, 0);
        setTotalItems(total);
    };

    const updateTotalCartCount = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('/api/v1/auth/cart/count', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data && typeof response.data.totalQuantity === 'number') {
                const event = new CustomEvent('cartCountUpdated', { detail: response.data.totalQuantity });
                window.dispatchEvent(event);
            }
        } catch (error) {
            console.error('Error updating total cart count:', error);
        }
    };
    const calculateShippingFee = (address) => {
        if (address && address.toLowerCase().includes('Hồ Chí Minh')) {
            return 14000;
        }
        return 30000;
    };
    useEffect(() => {
        if (user && user.address) {
            const fee = calculateShippingFee(user.address);
            setShippingFee(fee);
        }
    }, [user]);
    const checkPaymentStatus = async (orderIdOrPaymentId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/v1/payos/check-payment-status/${orderIdOrPaymentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.status === 'success';
        } catch (error) {
            console.error('Error checking payment status:', error);
            return false;
        }
    };

    const calculateTotalCost = () => {
        const subtotal = products.reduce((acc, product) => acc + product.product.price * product.quantity, 0);
        setTotalCost(subtotal + shippingFee);
    };

    const clearCart = async () => {
        const token = localStorage.getItem('token');
        try {
            for (const product of products) {
                await axios.delete(`/api/v1/auth/cart/remove-from-cart/${product.product._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setProducts([]);
            setTotalCost(0);
            setTotalItems(0);
            updateTotalCartCount();
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    const handleBuy = async () => {
        setIsLoading(true);
        setError(null);
    
        try {
            if (paymentMethod === 'COD') {
                setShowPopup(true);
                await clearCart();   // Thực hiện các tác vụ khác, như xóa giỏ hàng

            } else if (paymentMethod === 'E-Banking') {
                // Thanh toán E-Banking qua PayOS
                const token = localStorage.getItem('token');
                const response = await axios.post('/api/v1/payos/create-payment-link', {
                    amount: totalCost,
                    description: `Payment for ${totalItems} items`,
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
    
                if (response.data && response.data.checkoutUrl) {
                    // Điều hướng người dùng đến trang thanh toán
                    window.location.href = response.data.checkoutUrl;
    
                    // Sau khi người dùng quay lại từ trang thanh toán, kiểm tra trạng thái thanh toán
                    const paymentSuccess = await checkPaymentStatus(response.data.orderIdOrPaymentId);
                    if (paymentSuccess) {
                        await clearCart(); // Xóa giỏ hàng khi thanh toán thành công
                    } else {
                        setError('Payment was not successful. Please try again.');
                    }
                } else {
                    throw new Error('Invalid response from payment link creation');
                }
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            setError('Unable to process payment. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuantityChange = async (productId, delta) => {
        const token = localStorage.getItem('token');
        const updatedProducts = [...products];
        const product = updatedProducts.find(item => item.product._id === productId);
        const newQuantity = product.quantity + delta;
    
        if (newQuantity <= 0) {
            updatedProducts.splice(updatedProducts.indexOf(product), 1);
        } else {
            product.quantity = newQuantity;
        }
    
        setProducts(updatedProducts);
    
        try {
            if (newQuantity <= 0) {
                await axios.delete(`/api/v1/auth/cart/remove-from-cart/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.put('/api/v1/auth/cart/update-cart', {
                    productId,
                    quantity: newQuantity,
                    price: product.product.price
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            await updateTotalCartCount();
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
        updateTotalItems();
    }, [products]);

    useEffect(() => {
        const fetchCart = async () => {
            if (user) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get('/api/v1/auth/cart/get-cart', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setProducts(response.data.cartItems);
                } catch (error) {
                    console.error('Error fetching cart data:', error);
                }
            }
        };

        fetchCart();
    }, [user]);

    return (
        <div className="cart-page">
            <div className="cart-page-layout">
                <div className="cart-main-container">
                    {user ? (
                        <div className="cart-frame">
                            <div className="cart-wrapper">
                                <div className="cart">
                                    <h2>YOUR CART</h2>
                                    {products.length > 0 ? (
                                        <>
                                            <div className="cart_products-container">
                                                <table id="cart_product-table">
                                                    {displayedProducts.map(product => (
                                                        <tr key={product.product._id}>
                                                            <td>{product.product.name}</td>
                                                            <td>Size: {product.size}</td>  {/* Thêm dòng này */}
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
                                            <p>Total Items: {totalItems}</p>
                                            <p>Address: {user.address || "Address not provided"}</p>
                                            <p>Shipping Fee: {formatPrice(shippingFee)}</p>
                                            <div className="payment-discount-container">
                                            <div className="payment-discount-row">
                                                <label htmlFor="payment-method">Payment Method</label>
                                                <select 
                                                    id="payment-method" 
                                                    value={paymentMethod} 
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                >
                                                    <option value="--">--</option>
                                                    <option value="COD">COD</option>
                                                    <option value="E-Banking">E-Banking</option>
                                                </select>
                                            </div>
                                                <div className="payment-discount-row">
                                                    <label htmlFor="discount-code">Discount Code</label>
                                                    <input type="text" id="discount-code" placeholder="G-" />
                                                </div>
                                            </div>
                                            {error && <div className="error-message">{error}</div>}
                                            <div className="cart-total">
                                                <span className="label">Subtotal:</span>
                                                <span className="value">{formatPrice(totalCost - shippingFee)}</span>
                                                <span className="label">Shipping Fee:</span>
                                                <span className="value">{formatPrice(shippingFee)}</span>
                                                <span className="label">Total:</span>
                                                <span className="value">{formatPrice(totalCost)}</span>
                                                <button 
                                                    onClick={handleBuy} 
                                                    disabled={isLoading || products.length === 0 || totalCost === 0 || !paymentMethod}
                                                >
                                                    {isLoading ? 'Processing...' : 'Buy'}
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <p>Your cart is empty. Start shopping now!</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Pop_up 
                            isSuccess={false} 
                            review="Please log in to view your cart" 
                            message="You need to be logged in to access your shopping cart" 
                            confirm="Move to LoginPage"
                            href="/login"
                        />
                    )}
                </div>
            </div>
            {showPopup && 
                <Pop_up 
                    isSuccess={true} 
                    review="Payment Successful!" 
                    message="Your order will be delivered as soon as possible." 
                    confirm="Back to HomePage"
                    href="/"
                />
            }
        </div>
    );
};

export default Cart;