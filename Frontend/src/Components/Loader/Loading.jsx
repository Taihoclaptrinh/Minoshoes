import React from 'react';
import loaderGif from "../Assets/Intersection.gif"
import './Loading.css';

const Loader = () => {
    return (
        <div>
            <img style={{width: "80px"}} src={loaderGif} alt="Loading..." className="loader-gif" />
        </div>
    );
};
export default Loader;
