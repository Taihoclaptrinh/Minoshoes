import "./CSS/AdminNew.css";
import { useState } from "react";
import { get, post, put, del } from '../config/api'; // Đảm bảo đúng đường dẫn đến file api.js

const AdminNew = ({ title, formType }) => {
  const [formData, setFormData] = useState({
    email: "",
    productName: "",
    productDescription: "",
    productPrice: "",
    productBrand: "adidas", // default value
    productCategory: "lifestyle", // default value
    productSizes: "",
    productColor: "",
    productStocks: "",
    productImages: [],
    productCreateAt: new Date().toISOString().split("T")[0],
    productUpdateAt: new Date().toISOString().split("T")[0],
    coupon: "",
    couponType: "Freeship", // default value
    discountValue: "",
    minimumPurchaseAmount: "",
    couponDescription: "",
    couponCreateAt: new Date().toISOString().split("T")[0],
    couponExpiredAt: new Date().toISOString().split("T")[0],
  });

  const [previewImages, setPreviewImages] = useState([]);

  const handleInputChange = (id, value) => {
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleFileChange = (e, id) => {
    const files = e.target.files;
    setFormData((prevData) => ({ ...prevData, [id]: files }));

    const fileArray = Array.from(files);
    const imageUrls = fileArray.map((file) => URL.createObjectURL(file));
    setPreviewImages(imageUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate numeric fields
    if (formData.productPrice < 0) {
      alert("Price must be a non-negative value.");
      return;
    }

    try {
      // Create FormData for file upload
      const fileData = new FormData();
      if (formData.productImages.length > 0) {
        Array.from(formData.productImages).forEach((file) => {
          fileData.append('images', file); // Ensure the key matches the backend expectation
        });
        
        // Upload images and get image URLs
        const uploadResponse = await post('/api/v1/auth/upload', fileData);
        const { imageUrls } = uploadResponse.data;

        // Prepare product data
        const productData = {
          code: formData.productCode,
          name: formData.productName,
          description: formData.productDescription,
          price: Number(formData.productPrice),
          brand: formData.productBrand,
          category: formData.productCategory,
          sizes: formData.productSizes.split(',').map(size => size.trim()),
          color: formData.productColor.split(',').map(color => color.trim()),
          stocks: formData.productStocks.split(',').map(stock => Number(stock.trim())),
          images: imageUrls,
          createdAt: formData.productCreateAt,
          updatedAt: formData.productUpdateAt,
        };
        console.log(productData)
        alert(`Product Data: ${JSON.stringify(productData, null, 2)}`);

        // Send product data to the API to create a new product
        const response = await post('/api/v1/auth/products', productData);
        console.log('Product created successfully:', response.data);
      } else {
        alert("Please upload at least one image.");
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div className="AdminNew">
      <div className="newContainer">
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          {formType === "product" && (
            <div className="left">
              {previewImages.length > 0 ? (
                <div className="imagePreviewContainer">
                  {previewImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Preview ${index}`}
                      className="imagePreview"
                    />
                  ))}
                </div>
              ) : (
                <div className="imagePreviewContainer">
                  <img
                    src="https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                    alt="No Preview"
                    className="imagePreview"
                  />
                </div>
              )}
            </div>
          )}
          <div className="right">
            <form onSubmit={handleSubmit}>
              {formType === "user" && (
                <div className="formInput">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              )}

              {formType === "product" && (
                <>
                  <div className="formInput">
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={formData.productName}
                      onChange={(e) =>
                        handleInputChange("productName", e.target.value)
                      }
                    />
                  </div>

                  <div className="formInput">
                    <label>Description</label>
                    <input
                      type="text"
                      placeholder="Description of the product"
                      value={formData.productDescription}
                      onChange={(e) =>
                        handleInputChange("productDescription", e.target.value)
                      }
                    />
                  </div>

                  <div className="formInput">
                    <label>Price</label>
                    <input
                      type="number"
                      placeholder="100"
                      min="0"
                      value={formData.productPrice}
                      onChange={(e) =>
                        handleInputChange("productPrice", e.target.value)
                      }
                    />
                  </div>

                  <div className="formInput">
                    <label>Brand</label>
                    <select
                      value={formData.productBrand}
                      onChange={(e) =>
                        handleInputChange("productBrand", e.target.value)
                      }
                    >
                      <option value="adidas">adidas</option>
                      <option value="puma">puma</option>
                      <option value="asics">asics</option>
                      <option value="nike">nike</option>
                      <option value="vans">vans</option>
                    </select>
                  </div>

                  <div className="formInput">
                    <label>Category</label>
                    <select
                      value={formData.productCategory}
                      onChange={(e) =>
                        handleInputChange("productCategory", e.target.value)
                      }
                    >
                      <option value="lifestyle">lifestyle</option>
                      <option value="casual">casual</option>
                      <option value="running shoes">running shoes</option>
                    </select>
                  </div>

                  <div className="formInput">
                    <label>Sizes</label>
                    <input
                      type="text"
                      placeholder="S, M, L"
                      value={formData.productSizes}
                      onChange={(e) =>
                        handleInputChange("productSizes", e.target.value)
                      }
                    />
                  </div>

                  <div className="formInput">
                    <label>Colors</label>
                    <input
                      type="text"
                      placeholder="Red, Blue"
                      value={formData.productColor}
                      onChange={(e) =>
                        handleInputChange("productColor", e.target.value)
                      }
                    />
                  </div>

                  <div className="formInput">
                    <label>Stocks</label>
                    <input
                      type="text"
                      placeholder="10, 20, 15"
                      value={formData.productStocks}
                      onChange={(e) =>
                        handleInputChange("productStocks", e.target.value)
                      }
                    />
                  </div>

                  <div className="formInput">
                    <label>Images</label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, "productImages")}
                    />
                  </div>

                  <div className="formInput">
                    <label>Created At</label>
                    <input
                      type="date"
                      value={formData.productCreateAt}
                      disabled
                    />
                  </div>

                  <div className="formInput">
                    <label>Updated At</label>
                    <input
                      type="date"
                      value={formData.productUpdateAt}
                      disabled
                    />
                  </div>
                </>
              )}

              {formType === "coupon" && (
                <>
                  <div className="formInput">
                    <label>Coupon</label>
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={formData.coupon}
                      onChange={(e) =>
                        handleInputChange("coupon", e.target.value)
                      }
                    />
                  </div>

                  <div className="formInput">
                    <label>Type</label>
                    <select
                      value={formData.couponType}
                      onChange={(e) =>
                        handleInputChange("couponType", e.target.value)
                      }
                    >
                      <option value="Freeship">Freeship</option>
                      <option value="Discount price">Discount price</option>
                    </select>
                  </div>

                  {formData.couponType === "Discount price" && (
                    <>
                      <div className="formInput">
                        <label>Discount Value</label>
                        <input
                          type="number"
                          placeholder="50"
                          min="0"
                          value={formData.discountValue}
                          onChange={(e) =>
                            handleInputChange("discountValue", e.target.value)
                          }
                        />
                      </div>

                      <div className="formInput">
                        <label>Minimum Purchase Amount</label>
                        <input
                          type="number"
                          placeholder="200"
                          min="0"
                          value={formData.minimumPurchaseAmount}
                          onChange={(e) =>
                            handleInputChange(
                              "minimumPurchaseAmount",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </>
                  )}

                  <div className="formInput">
                    <label>Description</label>
                    <input
                      type="text"
                      placeholder="Enter description"
                      value={formData.couponDescription}
                      onChange={(e) =>
                        handleInputChange("couponDescription", e.target.value)
                      }
                    />
                  </div>

                  <div className="formInput">
                    <label>Created At</label>
                    <input
                      type="date"
                      value={formData.couponCreateAt}
                      disabled
                    />
                  </div>

                  <div className="formInput">
                    <label>Expired At</label>
                    <input
                      type="date"
                      value={formData.couponExpiredAt}
                      onChange={(e) =>
                        handleInputChange("couponExpiredAt", e.target.value)
                      }
                    />
                  </div>
                </>
              )}

              <div className="formSubmit">
                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNew;
