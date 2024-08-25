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
  const [searchQuery, setSearchQuery] = useState('');

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + " VND";
  };
  
  const fetchProducts = async () => {
    setLoading(true);
    try {
        const response = await get(`/api/v1/auth/products`, {
            params: {
                size: selectedSizes.join(','),
                brand: selectedBrands.join(','),
                gender: selectedGender.length > 0 ? selectedGender[0] : undefined, // Chỉ gửi giá trị đầu tiên
                minPrice: priceRange[0],
                maxPrice: priceRange[1],
            },
        });
        setProductData(response.data);
        setTotalPages(Math.ceil(response.data.length / productsPerPage));
    } catch (error) {
        console.error('Error fetching products:', error);
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    fetchProducts();
}, [selectedColors, selectedSizes, selectedBrands, selectedGender, priceRange, sortedBy, currentPage, searchQuery]);
  

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

  const handleSortChange = (sortOption) => {
    setSortedBy((prevSortedBy) =>
      prevSortedBy.includes(sortOption)
        ? prevSortedBy.filter((s) => s !== sortOption)
        : [...prevSortedBy, sortOption]
    );
  };

  const handleSizeChange = (size) => {
    setSelectedSizes((prevSelectedSizes) =>
      prevSelectedSizes.includes(size)
        ? prevSelectedSizes.filter((s) => s !== size)
        : [...prevSelectedSizes, size]
    );
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
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const sizeMatch = selectedSizes.length === 0 || selectedSizes.some(size => product.sizes.includes(size));
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
  
      let genderSizeMatch = true;
        if (selectedGender.includes('Women')) {
            genderSizeMatch = product.sizes.some(size => parseFloat(size) <= 5);
        } else if (selectedGender.includes('Men')) {
            genderSizeMatch = product.sizes.some(size => parseFloat(size) > 5);
        }
        return priceMatch && sizeMatch && brandMatch && genderSizeMatch;

    })
  };
  

  const sortProducts = (products) => {
    return sortedBy.reduce((sortedProducts, sortOption) => {
      switch (sortOption) {
        case 'Price (Low - High)':
          return sortedProducts.sort((a, b) => a.price - b.price);
        case 'Price (High - Low)':
          return sortedProducts.sort((a, b) => b.price - a.price);
        case 'Newest':
          return sortedProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
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
                    +
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
              <h3>Sizes (UK)</h3>
              <div>
                {['4.0', '5.0', '8.0', '8.5', '9.0', '9.5'].map((size) => (
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
