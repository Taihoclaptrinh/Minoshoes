import React from 'react';
import './Reviews.css'

const Feedback = ({ review }) => {
    return (
        <div className="review">
            <div className="star-rating">
                <span style={{ width: `${review.stars * 20}%` }}>★★★★★</span>
            </div>
            <p>{review.text}</p>
            <p><strong>{review.author_name}</strong></p>
            <p>{review.author_description}</p>
        </div>
    );
};

export default Feedback; 