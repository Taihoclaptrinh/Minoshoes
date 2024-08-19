import cartModel from '../models/cartModel.js';
import productModel from '../models/productModel.js';

// Get cart items
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await cartModel.findOne({ user: userId }).populate('cartItems.product');
    if (!cart) {
      return res.status(404).send({ message: 'Cart not found' });
    }
    res.status(200).send(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error getting cart', error });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity, price, size } = req.body; // Add size to the request body
    const userId = req.user._id;
    let cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      cart = new cartModel({ user: userId, cartItems: [] });
    }

    // Ensure `addItemToCart` is a method on your cartModel
    await cart.addItemToCart(productId, quantity, price, size); // Pass size as an argument
    await cart.save(); // Ensure you save the cart after modifications
    res.status(200).send(cart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).send({ message: 'Error adding to cart', error });
  }
};

// Update cart item quantity
export const updateCart = async (req, res) => {
  try {
    const { productId, quantity, price, size } = req.body; // Add size to the request body
    const userId = req.user._id;

    // Validate input
    if (typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).send({ message: 'Invalid quantity' });
    }
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).send({ message: 'Invalid price' });
    }

    // Find user's cart
    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).send({ message: 'Cart not found' });
    }

    // Find the item to update (match by product ID and size)
    const existingItemIndex = cart.cartItems.findIndex(item => 
      item.product.toString() === productId.toString() && item.size === size
    );
    if (existingItemIndex >= 0) {
      // Update item
      cart.cartItems[existingItemIndex].quantity = quantity;
      cart.cartItems[existingItemIndex].price = price;

      // Save changes
      await cart.save();
      res.status(200).send(cart);
    } else {
      return res.status(404).send({ message: 'Product with specified size not found in cart' });
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).send({ message: 'Error updating cart', error });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId, size } = req.params; // Add size to the request parameters
    const userId = req.user._id;
    const cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).send({ message: 'Cart not found' });
    }

    // Filter out the item by product ID and size
    cart.cartItems = cart.cartItems.filter(item => 
      item.product.toString() !== productId.toString() || item.size !== size
    );
    await cart.save();
    res.status(200).send(cart);
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).send({ message: 'Error removing from cart', error });
  }
};

// Count total items in cart
export const countCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).send({ message: 'Cart not found' });
    }

    const totalQuantity = cart.cartItems.reduce((accum, item) => accum + item.quantity, 0);

    res.status(200).send({ totalQuantity });
  } catch (error) {
    console.error('Error counting cart items:', error);
    res.status(500).send({ message: 'Error counting cart items', error });
  }
};
// Clear entire cart
export const clearCart = async (req, res) => {
    try {
      const userId = req.user._id;
      const cart = await cartModel.findOne({ user: userId });
  
      if (!cart) {
        return res.status(404).send({ message: 'Cart not found' });
      }
  
      // Clear all items from the cart
      cart.cartItems = [];
      await cart.save();
  
      res.status(200).send({ message: 'Cart cleared successfully' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).send({ message: 'Error clearing cart', error });
    }
  };