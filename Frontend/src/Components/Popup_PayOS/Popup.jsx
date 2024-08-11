import React from 'react';
import PropTypes from 'prop-types';
import './Popup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const Pop_up = ({ isSuccess, review, message, onClose, href }) => {
    return (
        <div className="overlay active">
            <div className="popup active">
                <div className="modalbox center">
                    <div 
                        className="icon-wrapper" 
                        style={{
                            border: "3px solid",
                            borderColor: isSuccess ? "#50c878" : "#ff0000",
                            borderRadius: "50%", 
                            padding: "10px", 
                            display: "inline-block",
                        }}
                    >
                        <FontAwesomeIcon 
                            icon={isSuccess ? faCircleCheck : faTimes} 
                            style={{ fontSize: '40px', color: "#ffffff" }}
                        />
                    </div>
                    <h1 style={{ color: isSuccess ? "#50c878" : "#ff0000" }}>{review}</h1>
                    <p style={{ marginBottom: "50px" }}>{message}</p>
                    <div className="btnback">
                        <a className='btn' href={href} onClick={onClose}>Back to HomePage</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

Pop_up.propTypes = {
    isSuccess: PropTypes.bool.isRequired, // Determines icon and color
    review: PropTypes.string.isRequired, // Main message to display
    message: PropTypes.string.isRequired, // Additional message to display
    onClose: PropTypes.func.isRequired, // onClose callback prop
    href: PropTypes.string.isRequired, // Redirect link
};

export default Pop_up;
