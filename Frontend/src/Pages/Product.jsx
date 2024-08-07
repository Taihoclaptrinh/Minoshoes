import React, { useEffect, useState } from "react";
import "./CSS/Product.css";
// Đổi lại đường dẫn file data để chạy
import { productData } from "./NPdata.js";
import Slider from "../Components/Slider/Slider.jsx";
import Contact_info from "../Components/Contact_info/Contact_info.jsx"
import Footer from "../Components/Footer/Footer.jsx"

const Product = () => {
    const onAddtoCartHandler = (product) => {
        console.log("Product added to cart:", product);
    };

    const [averageRating, setAverageRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    // const [areReviewsExpanded, setAreReviewsExpanded] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5;

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = productData.feedback.slice(indexOfFirstReview, indexOfLastReview);
    const totalPages = Math.ceil(productData.feedback.length / reviewsPerPage);

    useEffect(() => {
        const calculateAverageRating = () => {
            const totalRating = productData.feedback.reduce((acc, review) => acc + review.rating, 0);
            const count = productData.feedback.length;
            const average = (totalRating / count).toFixed(1);
            setAverageRating(average);
            setReviewCount(count);
        };

        calculateAverageRating();
    }, []);

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
        const descriptionLines = productData.description.split("\n");
        if (descriptionLines.length <= 5 || isDescriptionExpanded) {
            return descriptionLines.join("\n");
        } else {
            return descriptionLines.slice(0, 5).join("\n") + "...";
        }
    };



    return (
        <div className="product-page">
            <div class="product-page-layout">
                <p1>Product/ </p1>
                {/* Contain images and options for product */}
                <div className="main-container">
                    <div className="product-section">
                        <div className="product-image-list">
                            <div class="image-grid">
                                {productData.images.map((image, index) => (
                                    <img className="image-item" src={image} alt={`product-${index}`} key={index} />
                                ))}
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
                    {/* Where show the prize and name of product,
                        Customer can choose the size and colour */}
                    <div className="info-section">
                        <div className="text-group">
                            <p style={{fontSize: "1.8rem"}}>{productData.category}</p>
                            <h1>{productData.name}</h1>
                            <h2>{productData.price}</h2>
                        </div>
                
                        <h2 style={{marginTop: "3rem"}}>Main colours</h2>
                        <div className="button-grid">
                            {productData.colors.map((color) => (
                                <div className="color-box">
                                    {color}
                                    <div className="color-circle" style={{ backgroundColor: color }}></div>
                                </div>
                            ))}
                        </div>

                        <h2>Sizes</h2>
                        <div className="button-grid">
                            {productData.sizes.map((size, index) => (
                                <button 
                                    key={index}
                                    className={selectedSize === size ? "selected" : ""}
                                    onClick={() => handleSizeClick(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>

                        <div className="adding-button-container">
                            {/* <button  class="add-to-list">Wish list</button> */}
                            <button onClick={() => onAddtoCartHandler(productData)} class="add-to-bag">Add to cart</button>
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
                            {currentReviews.map((review, index) => (
                                <div key={index} className="review show">
                                    <h3>{review.name}</h3>
                                    <div className="stars">{renderStars(review.rating)}</div>
                                    <p>{review.comment}</p>
                                </div>
                            ))}
                        </div>
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
        
    )   
}

export default Product