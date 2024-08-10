// CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/v1/auth/cart/get-cart', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCart(response.data.cartItems);
            } catch (error) {
                console.error('Error fetching cart data:', error);
            }
        };

        fetchCart();
    }, []);

    const updateCart = async (productId, delta) => {
        try {
            const token = localStorage.getItem('token');
            const product = cart.find(item => item.product._id === productId);
            const newQuantity = product.quantity + delta;

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

            const response = await axios.get('/api/v1/auth/cart/get-cart', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCart(response.data.cartItems);
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    return (
        <CartContext.Provider value={{ cart, updateCart }}>
            {children}
        </CartContext.Provider>
    );
};
