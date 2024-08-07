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
export const searchProducts = async (req, res) => {
    const { query } = req.query;
    try {
        if (!query) {
            return res.status(400).json({ message: 'Query parameter is required' });
        }
        
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { code: query }, 
                { code: { $regex: query, $options: 'i' } } 
            ]
        });
        
        console.log('Search query:', query);
        console.log('Found products:', products);

        res.json(products);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ message: 'Server error while fetching products', error: error.message });
    }
};
export const getProducts = async (req, res) => {
    const limit = parseInt(req.query.limit) || 12; 

    try {
        const products = await Product.find().limit(limit);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching products", error });
    }
};