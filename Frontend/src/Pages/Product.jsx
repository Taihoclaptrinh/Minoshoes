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
                    </div>
                    {/* Where show the prize and name of product,
                        Customer can choose the size and colour */}
                    <div className="info-section">
                        <div className="text-group">
                            <p style={{fontSize: "30px"}}>{productData.category}</p>
                            <h1>{productData.name}</h1>
                            <h2>{productData.price}</h2>
                        </div>
                
                        <h2 style={{marginTop: "6rem"}}>Colours</h2>
                        <div className="button-grid">
                            {productData.colors.map((color, index) => (
                                <button key={index}>{color}</button>
                            ))}
                        </div>
                        <h2>Sizes</h2>
                        <div className="button-grid">
                            {productData.sizes.map((size, index) => (
                                <button key={index}>{size}</button>
                            ))}
                        </div>

                        <div className="adding-button-container">
                            <button  class="add-to-list">Add to list</button>
                            <button onClick={() => onAddtoCartHandler(productData)} class="add-to-bag">Add to bag</button>
                        </div>
                    </div>    
                </div>
                <div className="product-description">
                    <h1>Product Description:</h1>
                    <p>{productData.description}</p>
                </div>

                <div className="related-product">
                    <h1>Related Products:</h1>
                    <div className="related-product-slider">
                        <Slider />
                    </div>
                </div>

                <div className="review-section">
                    <div class="overall-rating">
                        <h2>Reviews:</h2>
                        <div class="rating">
                            <span id="rating-score" className="rating-score">{averageRating}</span>
                            <span id="overall-stars" className="stars">{renderStars(averageRating)}</span>
                            <span id="review-count" className="review-count">{reviewCount} reviews</span>
                        </div>
                    </div>

                    <div id="reviews" class="reviews">
                        {productData.feedback.map((review, index) => (
                            <div key={index} className="review">
                                <h3>{review.name}</h3>
                                <div className="stars">{renderStars(review.rating)}</div>
                                <p>{review.comment}</p>
                            </div>
                        ))}
                    </div>   
                </div>   
                <div className="product-pagebreak">
                    <Contact_info />
                </div>
            
                <Footer />
            </div>                
            
        </div>
        
    )   
}

export default Product