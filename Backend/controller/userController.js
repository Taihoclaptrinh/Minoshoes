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

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Find user by ID and update
        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
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

export const findUserById = async (req, res) => {
    try {
        // Use req.params.id to find by _id field
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error finding user', error });
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

// Add Product to Wishlist
export const addProductToWishlist = async (req, res) => {
    try {
        const { productId, price, size, images } = req.body;  // Get product details from the request body
        const userId = req.user._id;  // Get user ID from the authenticated user

        // Find the user by ID
        let user = await User.findById(userId);

        // Check if the product is already in the wishlist
        const productExists = user.wishlist.some(item => item.product.toString() === productId);

        if (productExists) {
            return res.status(400).send({ message: 'Product already in wishlist' });
        }

        // Add the new product to the wishlist
        user.wishlist.push({
            product: productId,
            price,
            size,
            images
        });

        // Save the updated user document
        await user.save();

        res.status(200).send(user.wishlist); // Respond with the updated wishlist
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).send({ message: 'Error adding to wishlist', error });
    }
};
