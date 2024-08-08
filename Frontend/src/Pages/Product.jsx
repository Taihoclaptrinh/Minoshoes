import React, { useEffect, useState } from "react";
import "./CSS/Product.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Slider from "../Components/Slider/Slider.jsx";
import Footer from "../Components/Footer/Footer.jsx";

const Product = () => {
    const [productData, setProductData] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5;
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const productName = query.get('name');
        
        if (productName) {
            const fetchProductData = async () => {
                try {
                    const response = await axios.get(`/api/v1/auth/products/${encodeURIComponent(productName)}`);
                    setProductData(response.data);

                    if (response.data.feedback && response.data.feedback.length > 0) {
                        const totalRating = response.data.feedback.reduce((acc, review) => acc + review.rating, 0);
                        const count = response.data.feedback.length;
                        const average = (totalRating / count).toFixed(1);
                        setAverageRating(average);
                        setReviewCount(count);
                    }
                } catch (error) {
                    console.error("Error fetching product data:", error);
                }
            };

            fetchProductData();
        }
    }, [location.search]);

    const onAddtoCartHandler = (product) => {
        console.log("Product added to cart:", product);
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        return (
            <>
                {[...Array(fullStars)].map((_, index) => (
                    <span key={index} className="star filled">★</span>
                ))}
                {halfStar && <span className="star half">★</span>}
                {[...Array(emptyStars)].map((_, index) => (
                    <span key={index} className="star empty">☆</span>
                ))}
            </>
        );
    };

    const handleColorClick = (color) => {
        setSelectedColor(color);
    };

    const handleSizeClick = (size) => {
        setSelectedSize(size);
    };

    const toggleDescription = () => {
        setIsDescriptionExpanded(!isDescriptionExpanded);
    };

    const handlePageChange = (direction) => {
        if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (direction === "next" && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const renderDescription = () => {
        if (!productData) return "";
        const descriptionLines = productData.description.split("\n");
        if (descriptionLines.length <= 5 || isDescriptionExpanded) {
            return descriptionLines.join("\n");
        } else {
            return descriptionLines.slice(0, 5).join("\n") + "...";
        }
    };

    if (!productData) {
        return <div>Loading...</div>;
    }

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = productData.feedback && productData.feedback.length > 0
        ? productData.feedback.slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage)
        : [];
    const totalPages = productData.feedback
        ? Math.ceil(productData.feedback.length / reviewsPerPage)
        : 0;

    return (
        <div className="product-page">
            <div className="product-page-layout">
                <p1>Product/ </p1>
                <div className="main-container">
                    <div className="product-section">
                        <div className="product-image-list">
                            <div className="image-grid">
                                {productData.images && productData.images.length > 0 ? (
                                    productData.images.map((image, index) => (
                                        <img className="image-item" src={image} alt={`product-${index}`} key={index} />
                                    ))
                                ) : (
                                    <p>No images available</p>
                                )}
                            </div>
                        </div>
                        <div className={`product-description ${isDescriptionExpanded ? "expanded" : ""}`}>
                            <h1>Product Description:</h1>
                            <p>{renderDescription()}</p>
                            {productData.description.split("\n").length > 5 && (
                                <span className="show-more" onClick={toggleDescription}>
                                    {isDescriptionExpanded ? "Show Less" : "Show More"}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="info-section">
                        <div className="text-group">
                            <p style={{fontSize: "1.8rem"}}>{productData.category}</p>
                            <h1>{productData.name}</h1>
                            <h2>{productData.price.toLocaleString('vi-VN')} VND</h2>
                        </div>
                
                        <h2 style={{marginTop: "3rem"}}>Main colours</h2>
                        <div className="button-grid">
                            {productData.color && productData.color.length > 0 ? (
                                productData.color.map((color, index) => (
                                    <div key={index} className="color-box">
                                        <div 
                                            className="color-circle" 
                                            style={{ backgroundColor: color.toLowerCase() }} // Chuyển màu thành định dạng chữ thường để sử dụng trong style
                                        ></div>
                                        <span className="color-name">{color}</span>
                                    </div>
                                ))
                            ) : (
                                <p>No colors available</p>
                            )}
                        </div>


                        <h2>Sizes</h2>
                        <div className="button-grid">
                            {productData.sizes && productData.sizes.length > 0 ? (
                                productData.sizes.map((size, index) => (
                                    <button 
                                        key={index}
                                        className={selectedSize === size ? "selected" : ""}
                                        onClick={() => handleSizeClick(size)}
                                    >
                                        {size}
                                    </button>
                                ))
                            ) : (
                                <p>No sizes available</p>
                            )}
                        </div>

                        <div className="adding-button-container">
                            <button onClick={() => onAddtoCartHandler(productData)} className="add-to-bag">Add to cart</button>
                        </div>
                    </div>    
                </div>
                
                <div className="related-product">
                    <h1>Related Products:</h1>
                    <div className="related-product-slider">
                        <Slider />
                    </div>
                </div>

                <div className="review-section">
                    <div className="reviews">
                        <div className="overall-rating">
                            <h1>Reviews:</h1>
                            <div className="rating">
                                <span id="rating-score" className="rating-score">{averageRating}</span>
                                <span id="overall-stars" className="stars">{renderStars(averageRating)}</span>
                                <span id="review-count" className="review-count">{reviewCount} reviews</span>
                            </div>
                        </div>
                        <div id="reviews">
                        {currentReviews.length > 0 ? (
                            currentReviews.map((review, index) => (
                                <div key={index} className="review show">
                                    <h3>{review.name}</h3>
                                    <div className="stars">{renderStars(review.rating)}</div>
                                    <p>{review.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p>No reviews available</p>
                        )}
                    </div>
                    {totalPages > 1 && (
                        <div className="review-pagination">
                            <span
                                className={`arrow ${currentPage === 1 ? "disabled" : ""}`}
                                onClick={() => handlePageChange("prev")}
                            >
                                &lt;
                            </span>
                            <span className="page-number">{currentPage}</span>
                            <span
                                className={`arrow ${currentPage === totalPages ? "disabled" : ""}`}
                                onClick={() => handlePageChange("next")}
                            >
                                &gt;
                            </span>
                        </div>
                    )}
                        <div className="review-pagination">
                            <span
                                className={`arrow ${currentPage === 1 ? "disabled" : ""}`}
                                onClick={() => handlePageChange("prev")}
                            >
                                &lt;
                            </span>
                            <span className="page-number">{currentPage}</span>
                            <span
                                className={`arrow ${currentPage === totalPages ? "disabled" : ""}`}
                                onClick={() => handlePageChange("next")}
                            >
                                &gt;
                            </span>
                        </div>
                    </div>
                </div>   
                <Footer />
            </div>                
        </div>
    );
};

export default Product;