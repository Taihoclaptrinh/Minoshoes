import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Reviews.css"
import "../Bestseller/Bestseller.css"
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import im_src from "../Assets/Image2.png"
import Feedback from "./Review-contents"

const Reviews = () => {
  const [review, setReview] = useState(null);

  useEffect(() => {
      const fetchReview = async () => {
          try {
              const response = await axios.get('/api/review/1');
              setReview(response.data);
          } catch (error) {
              console.error('Error fetching review data', error);
          }
      };

      fetchReview();
  }, []);
    // // Show star-rating
    // const [stars, setStars] = useState(0);

    // useEffect(() => {
    //   const fetchStars = async () => {
    //     try {
    //       const response = await axios.get('/api/rating/1');
    //       setStars(response.data.stars);
    //     } catch (error) {
    //       console.error('Error fetching star rating', error);
    //     }
    //   };

    //   fetchStars();
    // }, []);
    // // Show Feedback context
    // const [text, setText] = useState('');

    // useEffect(() => {
    //   const fetchText = async () => {
    //       try {
    //           const response = await axios.get('/api/review/1');
    //           setText(response.data.text);
    //       } catch (error) {
    //           console.error('Error fetching review text', error);
    //       }
    //   };

    //   fetchText();
    // }, []);

    // const StarRating = ({ stars }) => {
    //   return (
    //     <div className="star-rating">
    //         <span style={{ width: `${stars * 20}%` }}>★★★★★</span>
    //     </div>
    //   );
    // };
    
    const responsive = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
          breakpoint: { max: 4000, min: 1024 },
          items: 1,
          slidesToSlide: 1,
        },
        desktop: {
          breakpoint: { max: 1024, min: 800 },
          items: 1,
        },
        tablet: {
          breakpoint: { max: 800, min: 464 },
          items: 1,
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1,
        },
      };
  return (
    <div className="reviews-container">
      <div className="head"> REVIEWS </div>
      <Carousel showDots={true} responsive={responsive}> 
        <div className="reviews">
          <div className="feedback">
            <img className="feedback--image" src={im_src} alt="feedback image" />
            <div className="feedback--content">
              <div className="feedback--content-font">
                  <p>ádasd
                  Ngày đầu năm mới, anh chàng samurai vô chủ Senou Souichirou đến ngụ ở khu trọ Katagi tại Edo. Bắt đầu manh nha những hỗn loạn phá vỡ chuỗi ngày bình yên của dân cư khu trọ Katagi... Senou Souichirou là ai và liệu anh có thể sống bình yên bên những người dân ở Katagi?
                  </p>
                  <p className="feedback--author-font">ád</p>
                  <p className="feedback--role-font">ffff</p>
              </div>
              {/* <div>
                {review ? <Feedback review={review} /> : <p>Loading...</p>}
              </div> */}
            </div>        
          </div>
        </div>
        {/* test tính năng */}
        <div className="reviews">
          <div className="feedback">
            <img className="feedback--image" src={im_src} alt="feedback image" />
            <div className="feedback--content">
              <div>
                {review ? <Feedback review={review} /> : <p>Loading...</p>}
              </div>
            </div>        
          </div>
        </div>
      </Carousel>
    </div>

    
  )

}

export default Reviews;