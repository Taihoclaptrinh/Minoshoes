import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/ProductCategory.css';

const ProductCategory = () => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 400]);
  const [sortedBy, setSortedBy] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedGender, setSelectedGender] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openBrands, setOpenBrands] = useState([]);
  const [maxPrice, setMaxPrice] = useState(400);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/v1/auth/products');
        setProductData(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

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

  const handleColorChange = (color) => {
    setSelectedColors((prevSelectedColors) =>
      prevSelectedColors.includes(color)
        ? prevSelectedColors.filter((c) => c !== color)
        : [...prevSelectedColors, color]
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
    return products.filter((product) =>
      product.price >= priceRange[0] && product.price <= priceRange[1] &&
      (selectedSizes.length === 0 || selectedSizes.includes(product.size)) &&
      (selectedColors.length === 0 || selectedColors.includes(product.color)) &&
      (selectedBrands.length === 0 || selectedBrands.includes(product.brand) || selectedBrands.includes(product.subBrand)) &&
      (selectedGender.length === 0 || selectedGender.includes(product.gender))
    );
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

  // const filteredAndSortedProducts = sortProducts(filterProducts(productData)).slice((currentPage - 1) * 12, currentPage * 12);

  const handlePageChange = (direction) => {
    if (direction === 'up') {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'down') {
      setCurrentPage(currentPage > 1 ? currentPage - 1 : 1);
    }
  };

  return (
    <div className="product-category">
      <header className="header">
        <div className="breadcrumbs">Products / Category 1 / Category 2 / Category 3</div>
        <h1 className="title">Category</h1>
        <h2 className="subtitle">Products</h2>
      </header>
      <div className="main-content">
        <section className="products">
          <div className="products-grid">
            {productData.map((product) => (
              <div key={product._id} className="product-item">
                <img src={product.images[0]} alt={product.name} className="product-image" />
                <div className="product-name">{product.name}</div>
                <div className="product-price">{product.price}</div>
              </div>
            ))}
          </div>
        </section>
        <aside className="filters sticky">
          <div className="filter-section">
            <p id="FilterAndSort">Filter & Sort</p>
            <input type="reset" value="clear all" id="clear-all" onClick={() => {
              setPriceRange([0, 400]);
              setSortedBy([]);
              setSelectedSizes([]);
              setSelectedColors([]);
              setSelectedBrands([]);
              setSelectedGender([]);
              setMaxPrice(400);
            }} />
            <div className="price-filter">
              <label>Price</label>
              <input
                id="range"
                type="range"
                min="0"
                max="400"
                value={maxPrice}
                onChange={handlePriceChange}
              />
              <span>{`$${priceRange[0]} - $${priceRange[1]}`}</span>
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
                {['colour1', 'colour2'].map((color) => (
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
                {['Adidas', 'Nike', 'New Balance', 'Vans', 'Converse'].map((brand) => (
                  <div key={brand}>
                    <div onClick={() => toggleBrand(brand)} style={{ cursor: 'pointer', display: 'flex' }}>
                      <h5>{brand}</h5>
                      <button className='subBrandButton' style={{ marginLeft: '8px' }}>{openBrands.includes(brand) ? '▲' : '▼'}</button>
                    </div>
                    {openBrands.includes(brand) && (
                      <div>
                        {getBrandOptions(brand).map((subBrand) => (
                          <label key={subBrand}>
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(subBrand)}
                              onChange={() => handleBrandChange(subBrand)}
                            />
                            {subBrand}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
      <div className="pagination">
        <button onClick={() => handlePageChange('down')}>Previous</button>
        <button onClick={() => handlePageChange('up')}>Next</button>
      </div>
    </div>
  );
};

const getBrandOptions = (brand) => {
  const brandOptions = {
    'Adidas': ['Adidas subBrand 1', 'Adidas subBrand 2'],
    'Nike': ['Nike subBrand 1', 'Nike subBrand 2'],
    'New Balance': ['New Balance subBrand 1', 'New Balance subBrand 2'],
    'Vans': ['Vans subBrand 1', 'Vans subBrand 2'],
    'Converse': ['Converse subBrand 1', 'Converse subBrand 2'],
  };
  return brandOptions[brand] || [];
};

export default ProductCategory;
