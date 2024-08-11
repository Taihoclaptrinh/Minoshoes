import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CSS/SearchResults.css"; // Tạo file CSS này để style kết quả tìm kiếm
import Footer from "../Components/Footer/Footer.jsx";
import Loader from "../Components/Loader/Loading.jsx";

const SearchResults = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchQuery = new URLSearchParams(location.search).get('query');
        if (searchQuery) {
            fetchSearchResults(searchQuery);
        }
    }, [location.search]);

    const fetchSearchResults = async (query) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/v1/auth/products/search?query=${encodeURIComponent(query)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSearchResults(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching search results:', error);
            setError('An error occurred while searching. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onAddtoCartHandler = async (product) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
    
        try {
            const response = await axios.post('/api/v1/auth/cart/add-to-cart', {
                productId: product._id,
                quantity: 1,
                price: product.price
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.status === 200) {
                alert('Product added to cart successfully!');
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
            alert('Failed to add product to cart. Please try again.');
        }
    };

    if (loading) {
        return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Loader />
        </div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="search-results-page">
            <div className="search-results-layout">
                <h1>Search Results</h1>
                {searchResults.length === 0 ? (
                    <p>No results found.</p>
                ) : (
                    <div className="search-results-grid">
                        {searchResults.map((product) => (
                            <div key={product._id} className="search-result-item">
                                <Link to={`/product?name=${encodeURIComponent(product.name)}`}>
                                    <img src={product.images[0]} alt={product.name} />
                                </Link>
                                <div className="search-result-info">
                                    <h2>{product.name}</h2>
                                    <p>{product.category}</p>
                                    <p className="price">{product.price.toLocaleString('vi-VN')} VND</p>
                                    <button onClick={() => onAddtoCartHandler(product)} className="add-to-cart">Add to cart</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default SearchResults;