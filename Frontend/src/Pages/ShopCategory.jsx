import React, { useState } from 'react';
import './CSS/ProductCategory.css';

const products = [
    { id: 1, name: 'Product 1', price: 50, size: '8.0 UK', color: 'colour1', brand: 'Adidas', subBrand: 'Stan Smith', gender: 'Men' },
    { id: 2, name: 'Product 2', price: 120, size: '9.0 UK', color: 'colour2', brand: 'Nike', subBrand: 'Air Max', gender: 'Women' },
    { id: 3, name: 'Product 3', price: 75, size: '8.5 UK', color: 'colour1', brand: 'Adidas', subBrand: 'Gazelle', gender: 'Men' },
    { id: 4, name: 'Product 4', price: 200, size: '9.5 UK', color: 'colour2', brand: 'Nike', subBrand: 'Dunk', gender: 'Women' },
    { id: 5, name: 'Product 5', price: 60, size: '8.0 UK', color: 'colour1', brand: 'Adidas', subBrand: 'Super Star', gender: 'Men' },
    { id: 6, name: 'Product 6', price: 150, size: '9.0 UK', color: 'colour2', brand: 'Nike', subBrand: 'Air Force 1', gender: 'Women' },
    { id: 7, name: 'Product 7', price: 85, size: '8.5 UK', color: 'colour1', brand: 'Adidas', subBrand: 'Campus', gender: 'Men' },
    { id: 8, name: 'Product 8', price: 220, size: '9.5 UK', color: 'colour2', brand: 'Nike', subBrand: 'Pegasus', gender: 'Women' },
    { id: 9, name: 'Product 9', price: 55, size: '8.0 UK', color: 'colour1', brand: 'Adidas', subBrand: 'Spezial', gender: 'Men' },
    { id: 10, name: 'Product 10', price: 140, size: '9.0 UK', color: 'colour2', brand: 'Nike', subBrand: 'Cortez', gender: 'Women' },
    { id: 11, name: 'Product 11', price: 70, size: '8.5 UK', color: 'colour1', brand: 'Adidas', subBrand: 'SL72', gender: 'Men' },
    { id: 12, name: 'Product 12', price: 190, size: '9.5 UK', color: 'colour2', brand: 'Nike', subBrand: 'Blazer', gender: 'Women' },
    { id: 13, name: 'Product 13', price: 65, size: '8.0 UK', color: 'colour1', brand: 'Adidas', subBrand: 'Campus', gender: 'Men' },
    { id: 14, name: 'Product 14', price: 170, size: '9.0 UK', color: 'colour2', brand: 'Nike', subBrand: 'Air Max', gender: 'Women' },
    { id: 15, name: 'Product 15', price: 90, size: '8.5 UK', color: 'colour1', brand: 'Adidas', subBrand: 'Stan Smith', gender: 'Men' },
];

const ProductCategory = () => {
  const [priceRange, setPriceRange] = useState([0, 400]);
  const [sortedBy, setSortedBy] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedGender, setSelectedGender] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openBrands, setOpenBrands] = useState([]);
  const [maxPrice, setMaxPrice] = useState(400);

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
    return products.filter(product =>
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

  const filteredAndSortedProducts = sortProducts(filterProducts(products)).slice((currentPage - 1) * 12, currentPage * 12);

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
            {filteredAndSortedProducts.map((product) => (
              <div key={product.id} className="product-item">
                <div className="product-image" />
                <div className="product-name">{product.name}</div>
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
                    <div onClick={() => toggleBrand(brand)} style={{cursor: 'pointer', display: 'flex'}}>
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
      <section className="pagination">
        <span>Page</span>
        <div className="current-page">{currentPage}</div>
        <button className="pageButton" onClick={() => handlePageChange('up')}>▲</button>
        <button className="pageButton" onClick={() => handlePageChange('down')}>▼</button>
      </section>
    </div>
  );
};

const getBrandOptions = (brand) => {
  const brandOptions = {
    Adidas: ['Stan Smith', 'Samba', 'Gazelle', 'Spezial', 'Super Star', 'SL72', 'Campus'],
    Nike: ['Jordan', 'Air Max', 'Dunk', 'Air Force 1', 'Cortez', 'Blazer', 'Pegasus'],
    'New Balance': ['574', '372', '550', '530', '2002', '9060', '990', '991'],
    Vans: ['Classic', 'Vault', 'Old Skool', 'Slip-on', 'Authentic', 'SK8', 'Era'],
    Converse: ['Classic Chuck', 'Chuck 70', 'Run Star', 'Life Platforms', 'One Star']
  };
  return brandOptions[brand] || [];
};

export default ProductCategory;


