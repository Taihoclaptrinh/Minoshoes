import Product from '../models/productModel.js';

// Tạo mới sản phẩm
export const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: "Server error while creating product", error });
    }
};

// Lấy thông tin sản phẩm theo ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching product", error });
    }
};

// Lấy tất cả sản phẩm với tùy chọn tìm kiếm, lọc và sắp xếp
export const getProducts = async (req, res) => {
    try {
        const { search, sort, category, priceRange, page = 1, limit = 10 } = req.query;

        let query = {};
        if (search) {
            query.name = { $regex: search, $options: 'i' }; // Tìm kiếm theo tên sản phẩm (không phân biệt hoa thường)
        }
        if (category) {
            query.category = category; // Lọc theo danh mục
        }
        if (priceRange) {
            const [minPrice, maxPrice] = priceRange.split('-').map(Number);
            query.price = { $gte: minPrice, $lte: maxPrice }; // Lọc theo khoảng giá
        }

        let productsQuery = Product.find(query);

        // Sắp xếp
        if (sort) {
            const [sortField, sortOrder] = sort.split(':');
            const sortCriteria = { [sortField]: sortOrder === 'desc' ? -1 : 1 };
            productsQuery = productsQuery.sort(sortCriteria);
        }

        // Phân trang
        const skip = (page - 1) * limit;
        productsQuery = productsQuery.skip(skip).limit(Number(limit));

        const products = await productsQuery.exec();
        const total = await Product.countDocuments(query);

        res.status(200).json({
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
            products
        });
    } catch (error) {
        console.error("Error while fetching products:", error);
        res.status(500).json({ message: "Server error while fetching products" });
    }
};

// Cập nhật thông tin sản phẩm theo ID
export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Server error while updating product", error });
    }
};

// Xoá sản phẩm theo ID
export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error while deleting product", error });
    }
};

// Lấy danh sách các sản phẩm liên quan
export const getRelatedProducts = async (req, res) => {
    try {
        const { productId } = req.params;

        // Lấy thông tin sản phẩm hiện tại
        const currentProduct = await Product.findById(productId);
        if (!currentProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Lấy danh sách các sản phẩm liên quan
        const relatedProducts = await Product.find({
            category: currentProduct.category,
            _id: { $ne: currentProduct._id }
        }).limit(5);

        res.status(200).json(relatedProducts);
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching related products", error });
    }
};