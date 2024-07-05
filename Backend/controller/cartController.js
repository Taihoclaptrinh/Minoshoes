import Cart from "../models/cartModel.js";

// Get cart information of a user
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate("cartItems.product", "name price productPictures");
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching cart", error });
    }
}

// Add products to cart
export const addToCart = async (req, res) => {
    try {
        const { cartItems } = req.body;
        if (cartItems) {
            if (cartItems.length === 0) {
                return res.status(400).json({ message: "Cart is empty" });
            }
            const cart = new Cart({
                user: req.user._id,
                cartItems,
            });
            const savedCart = await cart.save();
            res.status(201).json(savedCart);
        } else {
            return res.status(400).json({ message: "No cart items provided" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error while adding to cart", error });
    }
}

// Update cart
export const updateCart = async (req, res) => {
    try {
        const { cartItems } = req.body;
        if (cartItems) {
            if (cartItems.length === 0) {
                return res.status(400).json({ message: "Cart is empty" });
            }
            const updatedCart = await Cart.findOneAndUpdate({ user: req.user._id }, { cartItems }, { new: true });
            res.status(200).json(updatedCart);
        } else {
            return res.status(400).json({ message: "No cart items provided" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error while updating cart", error });
    }
}

// Remove product from cart
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const updatedCart = await Cart.findOneAndUpdate(
            { user: req.user._id },
            { $pull: { cartItems: { product: productId } } },
            { new: true }
        );
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: "Server error while removing from cart", error });
    }
}