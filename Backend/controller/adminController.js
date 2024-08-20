import User from '../models/userModel.js'; // Import User model
import { Order } from '../models/orderModel.js'; // Import Order model
import Product from '../models/productModel.js'; // Import Product model

// Function to count all users
export const countAllUsers = async (req, res) => {
    try {
        const userCount = await User.countDocuments(); // Count all user documents
        res.status(200).json({
            success: true,
            count: userCount // Send the count as part of the response
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error occurred while counting users',
            error: error.message // Send error message if something goes wrong
        });
    }
};

// Function to count all orders
export const countAllOrders = async (req, res) => {
    try {
        const orderCount = await Order.countDocuments(); // Count all order documents
        res.status(200).json({
            success: true,
            count: orderCount // Send the count as part of the response
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error occurred while counting orders',
            error: error.message // Send error message if something goes wrong
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users

        res.status(200).json({
            success: true,
            users // Send the user data as part of the response
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error occurred while retrieving users',
            error: error.message // Send error message if something goes wrong
        });
    }
};

// Function to get a single user by ID
export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params; // Extract userId from request parameters
        const user = await User.findById(userId); // Find user by ID

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            user // Send the user data as part of the response
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error occurred while retrieving user',
            error: error.message // Send error message if something goes wrong
        });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products

        res.status(200).json({
            success: true,
            products // Send the product data as part of the response
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error occurred while retrieving products',
            error: error.message // Send error message if something goes wrong
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { productId } = req.params; // Extract productId from request parameters
        const product = await Product.findById(productId); // Find product by ID

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            product // Send the product data as part of the response
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error occurred while retrieving product',
            error: error.message // Send error message if something goes wrong
        });
    }
};

// Function to delete a product by ID
export const deleteProductById = async (req, res) => {
    try {
        const { productId } = req.params; // Extract productId from request parameters
        const product = await Product.findByIdAndDelete(productId); // Find and delete product by ID

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error occurred while deleting product',
            error: error.message,
        });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'email');
        res.json({ orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params; // Lấy orderId từ tham số request
        const order = await Order.findById(orderId).populate('user', 'name email'); // Tìm đơn hàng theo ID và populate thông tin người dùng

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng',
            });
        }

        res.status(200).json({
            success: true,
            order // Trả về dữ liệu đơn hàng
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy đơn hàng',
            error: error.message // Trả về thông báo lỗi nếu có
        });
    }
};

export const deleteOrderById = async (req, res) => {
    try {
        const { orderId } = req.params; // Extract productId from request parameters
        const order = await Order.findByIdAndDelete(orderId); // Find and delete product by ID

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error occurred while deleting Order',
            error: error.message,
        });
    }
};