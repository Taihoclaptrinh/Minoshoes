import bestshoe1 from "../Assets/Nike/Air_Jordan_I_High_G_1.jpg"
import bestshoe2 from "../Assets/Nike/nike_am_react_ENG1.jpg"
import bestshoe3 from "../Assets/Nike/JD_Low_SE_Craft_1.jpg"
import bestshoe4 from "../Assets/Nike/nike_pegasus_38_1.png"
import bestshoe5 from "../Assets/Nike/Air_Jordan_I_High_G_1.jpg"
import bestshoe6 from "../Assets/Nike/nike_am_react_ENG1.jpg"
import bestshoe7 from "../Assets/Nike/JD_Low_SE_Craft_1.jpg"
import bestshoe8 from "../Assets/Nike/nike_pegasus_38_1.png"
export const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
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
  
  export const productData = [
    {
      id: 1,
      imageurl: bestshoe1,
      name: "Air Jordan I High G",
      price: "$19.99",
      description: "Some text about the product..",
    },
    {
      id: 2,
      imageurl: bestshoe2,
      name: "Sport sneakers",
      price: "$21.99",
      description: "Some text about the product..",
    },
    {
      id: 3,
      imageurl: bestshoe3,
      name: "iWatch",
      price: "$99.99",
      description: "Some text about the product..",
    },
    {
      id: 4,
      imageurl: bestshoe4,
      name: "Vans sneakers",
      price: "$14.99",
      description: "Some text about the product..",
    },
    {
      id: 5,
      imageurl: bestshoe5,
      name: "Air Jordan I High G",
      price: "$38.99",
      description: "Some text about the product..",
    },
    {
      id: 6,
      imageurl: bestshoe6,
      name: "Coco Noir",
      price: "$149.99",
      description: "Some text about the product..",
    },
    {
      id: 7,
      imageurl:bestshoe7,
      name: "Sunglasses",
      price: "$38.99",
      description: "Some text about the product..",
    },
    {
      id: 8,
      imageurl:bestshoe8,
      name: "Dove cream",
      price: "$49.99",
      description: "Some text about the product..",
    },
  ];