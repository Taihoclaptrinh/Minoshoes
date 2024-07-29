import React from 'react';
import './Reviews.css'

const Feedback = ({ review }) => {
    return (
        <div className="review">
            <div className="star-rating">
                <span style={{ width: `${review.stars * 20}%` }}>★★★★★</span>
            </div>
            <div className="feedback--content-font">
                <p>{review.text}</p>
                <p className="feedback--author-font">{review.author_name}</p>
                <p className="feedback--role-font">{review.author_description}</p>
            </div>
            
        </div>
    );
};

export default Feedback; 