import React, { useState, useEffect, useContext } from "react";
import { get, post, put, del } from '../config/api';
import "./CSS/Cart.css";
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext.js';
import Pop_up from '../Components/Popup/Popup.jsx';

const Cart = () => {
    const [products, setProducts] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [shippingFee, setShippingFee] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('--');

    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const itemsPerPage = 4;

    const formatPrice = (price) => price.toLocaleString('vi-VN') + " VND";

    const updateTotalItems = () => {
        const total = products.reduce((acc, product) => acc + product.quantity, 0);
        setTotalItems(total);
    };

    const updateTotalCartCount = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await get('/api/v1/auth/cart/count', {
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
        if (address && address.toLowerCase().includes('hồ chí minh')) {
            return 0;
        }
        return 0;
    };

    useEffect(() => {
        if (user && user.address) {
            const fee = calculateShippingFee(user.address);
            setShippingFee(fee);
        }
    }, [user]);

    const calculateTotalCost = () => {
        const subtotal = products.reduce((acc, product) => acc + product.product.price * product.quantity, 0);
        setTotalCost(subtotal + shippingFee);
    };

    const clearCart = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await del('/api/v1/auth/cart/clear', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Clear cart response:', response.data);
            await fetchCart(); // Fetch updated cart
            setTotalCost(0);
            setTotalItems(0);
            await updateTotalCartCount();
            return true;
        } catch (error) {
            console.error('Error clearing cart:', error);
            return false;
        }
    };

    const handleQuantityChange = async (productId, delta, size) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
            const updatedProducts = [...products];
            const product = updatedProducts.find(item => item.product._id === productId && item.size === size);
            
            if (!product) {
                console.error('Product not found in cart');
                return;
            }
    
            const newQuantity = product.quantity + delta;
    
            // Kiểm tra số lượng trong kho
            const sizeIndex = product.product.sizes.indexOf(size);
            if (sizeIndex === -1) {
                console.error('Size not found for product');
                return;
            }
    
            const stockAvailable = product.product.stocks[sizeIndex];
    
            if (delta > 0 && newQuantity > stockAvailable) {
                alert(`Sorry, only ${stockAvailable} item(s) available for size ${size}`);
                return;
            }
    
            if (newQuantity === 0) {
                // Remove item from cart
                await del('/api/v1/auth/cart/remove-from-cart', {
                    headers: { Authorization: `Bearer ${token}` },
                    data: {
                        productId,
                        size
                    }
                });
                // Remove item from local state
                updatedProducts.splice(updatedProducts.indexOf(product), 1);
            } else {
                // Update quantity in local state
                product.quantity = newQuantity;
    
                // Update cart in backend
                await put('/api/v1/auth/cart/update-cart', {
                    productId,
                    quantity: newQuantity,
                    price: product.product.price,
                    size // Ensure size is sent if needed
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
    
            setProducts(updatedProducts);
            await updateTotalCartCount();
    
        } catch (error) {
            console.error('Error handling quantity change:', error);
        }
    };

    useEffect(() => {
        const handlePaymentCompletion = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const status = urlParams.get('status');
            const orderCode = urlParams.get('orderCode');
            const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder'));
            
            if (status === 'PAID' && orderCode) {
                const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder'));
    
                if (pendingOrder) {
                    try {
                        pendingOrder.status = 'PAID'
                        // Lưu trạng thái cập nhật vào localStorage
                        localStorage.setItem('pendingOrder', JSON.stringify(pendingOrder));
    
                        const token = localStorage.getItem('token');
    
                        // Tạo đơn hàng từ thông tin đã lưu trong localStorage
                        const createOrderResponse = await post('/api/v1/orders/create-order', pendingOrder, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
    
                        if (createOrderResponse.status === 201) {
                            const cleared = await clearCart();
                            if (cleared) {
                                setShowPopup(true);
                                localStorage.removeItem('pendingOrder');
                                // navigate('/payment-success');
                            } else {
                                setError('Order created but failed to clear cart. Please refresh the page.');
                            }
                        } else {
                            throw new Error('Failed to create order after successful payment');
                        }
                    } catch (error) {
                        console.error('Error handling payment completion:', error);
                        setError('Payment successful but failed to create order. Please contact support.');
                    }
                }
            } else if (status === 'CANCELLED') {
                console.log('Payment was cancelled');
                // Xử lý khi thanh toán bị hủy, nếu cần
            }
        };
    
        handlePaymentCompletion();
    }, []); // Empty dependency array to run only once when component mounts
    
    

    const handleBuy = async () => {
        setIsLoading(true);
        setError(null);
    
        try {
            const token = localStorage.getItem('token');
            const orderItems = {
                orderItems: products.map(product => ({
                    product: product.product._id,
                    name: product.product.name,
                    quantity: product.quantity,
                    price: product.product.price,
                    size: product.size
                })),
                shippingAddress: {
                    fullName: user.name,
                    address: user.address,
                    phoneNumber: user.phone,
                },
                paymentMethod,
                shippingPrice: shippingFee,
                totalPrice: totalCost,
                status: ''
            };

            if (paymentMethod === 'COD') {
                // Create the order immediately for COD
                const response = await post('/api/v1/orders/create-order', orderItems, {
                    headers: { Authorization: `Bearer ${token}` }
                });
    
                if (response.status === 201) {
                    const cleared = await clearCart(); // Wait for cart to clear
                    if (cleared) {
                        setShowPopup(true); 
                    } else {
                        setError('Order created but failed to clear cart. Please refresh the page.');
                    }
                } else {
                    throw new Error('Failed to create order');
                }
            } else if (paymentMethod === 'E-Banking') {
                const paymentResponse = await post('/api/v1/payos/create-payment-link', {
                    amount: totalCost,
                    description: `Payment for ${totalItems} items`,
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (paymentResponse.data && paymentResponse.data.checkoutUrl) {
                    localStorage.setItem('pendingOrder', JSON.stringify(orderItems));
                    window.location.href = paymentResponse.data.checkoutUrl;
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

    const displayedProducts = products.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    useEffect(() => {
        calculateTotalCost();
        updateTotalItems();
    }, [products]);

    const fetchCart = async () => {
        if (user) {
            try {
                const token = localStorage.getItem('token');
                const response = await get('/api/v1/auth/cart/get-cart', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProducts(response.data.cartItems);
            } catch (error) {
                console.error('Error fetching cart data:', error);
            }
        }
    };

    useEffect(() => {
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
                                                        <td style={{width:"12rem"}}>{product.product.name}</td>
                                                        <td style={{width:"4rem"}}>Size: {product.size}</td>
                                                        <td className="cart_quantity-container">
                                                            <button className="cart_quantity-button" onClick={() => handleQuantityChange(product.product._id, -1, product.size)}>-</button>
                                                            <span className="cart_quantity">{product.quantity}</span>
                                                            <button className="cart_quantity-button" onClick={() => handleQuantityChange(product.product._id, 1, product.size)}>+</button>
                                                        </td>
                                                        <td style={{display:"flex",marginRight:"0"}}>{formatPrice(product.product.price * product.quantity)}</td>
                                                    </tr>
                                                ))}
                                                </table>
                                            </div>
                                            <p style={{borderTop:"1px solid black", paddingTop:"1rem"}}>Total Items: {totalItems}</p>
                                            <p style={{marginTop:"0.5rem"}}>Address: {user.address || "Address not provided"}</p>
                                            <p style={{marginTop:"0.5rem"}}>Shipping Fee: {formatPrice(shippingFee)}</p>
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
                                                <div className="element-total" style={{marginBottom: "0.5rem"}}> 
                                                    <span >Subtotal:
                                                        <span className="value">{formatPrice(totalCost - shippingFee)}</span>
                                                    </span>
                                                    <span >Shipping Fee:
                                                        <span className="value">{formatPrice(shippingFee)}</span>
                                                    </span>
                                                </div>
                                                <span >Total:</span>
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