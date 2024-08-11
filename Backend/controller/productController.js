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
export const getProductByName = async (req, res) => {
    try {
        const productName = req.params.name;
        const product = await Product.findOne({ name: productName });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching product', error: error.message });
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
export const checkout = async (req, res) => {
    try {
        const userId = req.user._id; // Đảm bảo req.user có _id

        // Lấy giỏ hàng của người dùng
        const cart = await cartModel.findOne({ user: userId }).populate('cartItems.product');

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Cập nhật số lượng tồn kho cho mỗi sản phẩm trong giỏ hàng
        for (let item of cart.cartItems) {
            const product = item.product; // Kiểm tra nếu trường đúng là `product`
            
            if (!product) {
                throw new Error(`Product is missing for item ${item._id}`);
            }

            if (!product._id) {
                throw new Error(`Product ID is missing for item ${item._id}`);
            }

            const sizeIndex = product.sizes.indexOf(item.size);

            if (sizeIndex === -1) {
                throw new Error(`Invalid size ${item.size} for product ${product._id}`);
            }

            if (product.stocks[sizeIndex] < item.quantity) {
                throw new Error(`Not enough stock for product ${product._id}, size ${item.size}`);
            }

            // Giảm số lượng tồn kho
            product.stocks[sizeIndex] -= item.quantity;
            await product.save();
        }

        // Xóa giỏ hàng sau khi thanh toán
        await cartModel.findByIdAndDelete(cart._id);

        res.status(200).json({ message: "Checkout successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error during checkout", error: error.message });
    }
};
