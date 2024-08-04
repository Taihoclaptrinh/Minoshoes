import User from '../models/userModel.js';
import Product from '../models/productModel.js'; // Import the Product model

// Create User
export const createUser = async (req, res) => {
    try {
        const { name, email, password, phone, address, totalSpent, role } = req.body;
        const newUser = new User({ name, email, password, phone, address, totalSpent, role });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

// Show All Users
export const showAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// Read Users (example for reading with specific criteria)
export const readUsers = async (req, res) => {
    try {
        const users = await User.find(req.query);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// Find User by Username
export const findUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error finding user', error });
    }
};

// Delete User
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

// Get Summary
export const getSummary = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const productCount = await Product.countDocuments(); // Ensure `Product` model is used
        res.status(200).json({
            userCount,
            productCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching summary', error });
    }
};
