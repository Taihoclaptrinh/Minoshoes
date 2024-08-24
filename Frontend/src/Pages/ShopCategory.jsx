import React, { useState, useEffect, useCallback } from 'react';
import { get, post, put, del } from '../config/api';
import './CSS/ProductCategory.css';
import Footer from '../Components/Footer/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from "../Components/Loader/Loading.jsx";

const ProductCategory = () => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [sortedBy, setSortedBy] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedGender, setSelectedGender] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openBrands, setOpenBrands] = useState([]);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [totalPages, setTotalPages] = useState(1);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [filteredAndSortedProducts, setFilteredAndSortedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const productsPerPage = 12;

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + " VND";
  };
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setSearchCompleted(false);
      try {
        const searchQuery = new URLSearchParams(location.search).get('query');
        const colorQuery = selectedColors.length > 0 ? `&color=${selectedColors.join(',')}` : '';
        const response = await get(`/api/v1/auth/products${searchQuery ? `/search?query=${encodeURIComponent(searchQuery)}${colorQuery}` : colorQuery}`);
        const products = response.data;
        setProductData(products);
        setTotalPages(Math.ceil(products.length / productsPerPage));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
        setSearchCompleted(true);
      }
    };
    fetchProducts();
  }, [location.search, selectedColors]);

  const fetchProductsByColor = useCallback(async (colors) => {
    setIsFiltering(true);
    try {
      const response = await get(`/api/v1/auth/products/color`, {
        params: { color: colors }
      });
      setProductData(response.data);
      setTotalPages(Math.ceil(response.data.length / productsPerPage));
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error fetching products by color:', error);
      setFilteredProducts([]);
    } finally {
      setIsFiltering(false);
    }
  }, []);

  useEffect(() => {
    if (selectedColors.length > 0) {
      fetchProductsByColor(selectedColors);
    } else {
      setFilteredProducts(productData);
    }
  }, [selectedColors, fetchProductsByColor, productData]);

  useEffect(() => {
    const filtered = filterProducts(productData);
    const sorted = sortProducts(filtered);
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const sliced = sorted.slice(start, end);
    setFilteredAndSortedProducts(sliced);
  }, [productData, selectedColors, selectedSizes, selectedBrands, selectedGender, priceRange, sortedBy, currentPage]);

  const handlePriceChange = (e) => {
    const value = Number(e.target.value);
    setMaxPrice(value);
    setPriceRange([priceRange[0], value]);
  };

  // const handleSortChange = (sortOption) => {
  //   setSortedBy((prevSortedBy) =>
  //     prevSortedBy.includes(sortOption)
  //       ? prevSortedBy.filter((s) => s !== sortOption)
  //       : [...prevSortedBy, sortOption]
  //   );
  // };
  const handleSortChange = (sortOption) => {
    setSortedBy([sortOption]);
  };
  
  const handleSizeChange = (size) => {
    setSelectedSizes((prevSelectedSizes) =>
      prevSelectedSizes.includes(size)
        ? prevSelectedSizes.filter((s) => s !== size)
        : [...prevSelectedSizes, size]
    );
  };

  const handleColorChange = async (color) => {
    const updatedColors = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];
  
    setSelectedColors(updatedColors);
    setSearchCompleted(false);
    setLoading(true);

    try {
      const response = await get(`/api/v1/auth/products/color`, {
        params: { color: updatedColors }
      });
      setProductData(response.data);
      setTotalPages(Math.ceil(response.data.length / productsPerPage));
    } catch (error) {
      console.error('Error fetching products by color:', error);
    } finally {
      setLoading(false);
      setSearchCompleted(true);
    }
  };
  
  const handleBrandChange = (brand) => {
    setSelectedBrands((prevSelectedBrands) =>
      prevSelectedBrands.includes(brand)
        ? prevSelectedBrands.filter((b) => b !== brand)
        : [...prevSelectedBrands, brand]
    );
  };

  const handleGenderChange = (gender) => {
    setSelectedGender((prevSelectedGender) =>
      prevSelectedGender.includes(gender)
        ? prevSelectedGender.filter((g) => g !== gender)
        : [...prevSelectedGender, gender]
    );
  };

  const toggleBrand = (brand) => {
    setOpenBrands((prevOpenBrands) =>
      prevOpenBrands.includes(brand)
        ? prevOpenBrands.filter((b) => b !== brand)
        : [...prevOpenBrands, brand]
    );
  };

  const filterProducts = (products) => {
    return products.filter((product) => {
      const colorMatch = selectedColors.length === 0 || selectedColors.includes(product.color);
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand) || selectedBrands.includes(product.subBrand);
      return (
        product.price >= priceRange[0] &&
        product.price <= priceRange[1] &&
        (selectedSizes.length === 0 || selectedSizes.includes(product.size)) &&
        colorMatch &&
        brandMatch &&
        (selectedGender.length === 0 || selectedGender.includes(product.gender))
      );
    });
  };

  const sortProducts = (products) => {
    return sortedBy.reduce((sortedProducts, sortOption) => {
      switch (sortOption) {
        case 'Price (Low - High)':
          return sortedProducts.sort((a, b) => a.price - b.price);
        case 'Price (High - Low)':
          return sortedProducts.sort((a, b) => b.price - a.price);
        case 'Newest':
          return sortedProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
        case 'Best Seller': 
          return sortedProducts.sort((a, b) => b.sales - a.sales);
        default:
          return sortedProducts;
      }
    }, [...products]);
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => {
      if (direction === 'up' && prevPage < totalPages) {
        return prevPage + 1;
      } else if (direction === 'down' && prevPage > 1) {
        return prevPage - 1;
      }
      return prevPage;
    });
  };

  const handleProductClick = (productName) => {
    navigate(`/product?name=${encodeURIComponent(productName)}`);
  };

  const handleAddToCart = (product) => {
    console.log("Added to cart:", product.name);
  };

  return (
    <div className="product-category">
      <header className="header">
        <h1 className="title">Category</h1>
        <h2 className="subtitle">Products</h2>
      </header>
      <div className="main-content">
        <section className="products">
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10%" }}>
              <Loader />
            </div>
          ) : searchCompleted && filteredAndSortedProducts.length === 0 ? (
            <div className="no-results">
              <p style={{color:"red", fontSize:"1.5rem"}}>
                Sorry, we don't have the product you are looking for :_(
              </p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredAndSortedProducts.map((product) => (
                <div key={product._id} className="product-item">
                  <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>
                    ♥
                  </button>
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    onClick={() => handleProductClick(product.name)}
                    className="product-image" 
                  />
                  <div 
                    className="product-name"
                    onClick={() => handleProductClick(product.name)}
                  >
                    {product.name}
                  </div>
                  <div 
                    className="product-price"
                    onClick={() => handleProductClick(product.name)}
                  >
                    {formatPrice(product.price)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        <aside className="filters sticky">
          <div className="filter-section">
            <p id="FilterAndSort">Filter & Sort</p>
            <input type="reset" value="clear all" id="clear-all" onClick={() => {
              setPriceRange([0, 5000000]);
              setSortedBy([]);
              setSelectedSizes([]);
              setSelectedColors([]);
              setSelectedBrands([]);
              setSelectedGender([]);
              setMaxPrice(5000000);
            }} />
            <div className="price-filter">
              <label>Price</label>
              <input
                id="range"
                type="range"
                min="0"
                max="5000000"
                value={maxPrice}
                onChange={handlePriceChange}
              />
              <span>{`${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`}</span>
            </div>
            <div className="sort-options">
              {['Price (Low - High)', 'Price (High - Low)', 'Newest', 'Best Seller'].map((option) => (
                <button
                  key={option}
                  onClick={() => handleSortChange(option)}
                  className={sortedBy.includes(option) ? 'active' : ''}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="gender-filter">
              <h3>Gender</h3>
              <div>
                {['Men', 'Women'].map((gender) => (
                  <label key={gender}>
                    <input
                      type="checkbox"
                      checked={selectedGender.includes(gender)}
                      onChange={() => handleGenderChange(gender)}
                    />
                    {gender}
                  </label>
                ))}
              </div>
            </div>
            <div className="size-filter">
              <h3>Sizes</h3>
              <div>
                {['8.0 UK', '8.5 UK', '9.0 UK', '9.5 UK'].map((size) => (
                  <label key={size}>
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(size)}
                      onChange={() => handleSizeChange(size)}
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>
            <div className="color-filter">
              <h3>Colours</h3>
              <div>
                {['White', 'Blue', 'Grey', 'Black'].map((color) => (
                  <label key={color}>
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color)}
                      onChange={() => handleColorChange(color)}
                    />
                    {color}
                  </label>
                ))}
              </div>
            </div>
            <div className="brand-filter">
              <h3>Brands</h3>
              <div>
                {['Adidas', 'Nike', 'Asics', 'Vans', 'Puma'].map((brand) => (
                  <label key={brand}>
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                    />
                    {brand}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
      <div className="Category-pagination">
        <span
          className={`arrow ${currentPage === 1 ? "disabled" : ""}`}
          onClick={() => handlePageChange('down')}
        >
          &lt;
        </span>
        <span className="page-number">{currentPage}</span>
        <span
          className={`arrow ${currentPage === totalPages ? "enabled" : ""}`}
          onClick={() => handlePageChange('up')}
        >
          &gt;
        </span>
      </div>
      <Footer />
    </div>
  );
};

export default ProductCategory;
