import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Product from "./Product";
import axios from "axios";

const Slider = () => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/v1/auth/products");
        setProductData(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 4,
      slidesToSlide: 1,
    },
    desktop: {
      breakpoint: { max: 1024, min: 800 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 800, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <Carousel showDots={false} responsive={responsive}>
      {productData.map((item) => (
        <Product
          key={item._id} 
          name={item.name}
          url={item.images.length > 0 ? item.images[0] : 'default-image-url'} // Handle image array
          price={item.price}
          // description={item.description}
        />
      ))}
    </Carousel>
  );
};

export default Slider;
