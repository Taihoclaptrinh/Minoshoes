import { Order } from '../models/orderModel.js'; // Import the Order model
import Product from '../models/productModel.js'; // Import the Product model

// Create a new order
export const createOrder = async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, shippingPrice, totalPrice } = req.body;
        const userId = req.user._id;

        // Create the order
        const order = new Order({
            user: userId,
            orderItems,
            shippingAddress,
            paymentMethod,
            shippingPrice,
            totalPrice,
        });

        // Save the order
        const createdOrder = await order.save();

        // Update stock quantities
        await updateStock(orderItems);

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
};

// Function to update stock quantities
const updateStock = async (orderItems) => {
    for (const item of orderItems) {
        try {
            const product = await Product.findById(item.product);
            if (!product) {
                throw new Error(`Product with ID ${item.product} not found`);
            }

            const sizeIndex = product.sizes.indexOf(item.size);
            if (sizeIndex === -1) {
                throw new Error(`Size ${item.size} not found for product ${item.product}`);
            }

            if (product.stocks && product.stocks[sizeIndex] !== undefined) {
                product.stocks[sizeIndex] -= item.quantity;
                if (product.stocks[sizeIndex] < 0) {
                    throw new Error(`Insufficient stock for product ${item.product} size ${item.size}`);
                }

                await product.save();
            } else {
                throw new Error(`Stocks array not found or does not match sizes array for product ${item.product}`);
            }
        } catch (error) {
            console.error(`Error updating stock for product ${item.product}:`, error.message);
        }
    }
};

// Get order by ID
export const getOrdersByUserId = async (req, res) => {
    try {
        const { userId } = req.params; // Get userId from request parameters

        // Fetch all orders where the 'user' field matches the provided userId
        const orders = await Order.find({ user: userId });

        // Respond with the list of orders, or an empty array if none found
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
    }
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params; // Get userId from request parameters

        // Fetch all orders where the 'user' field matches the provided userId
        const orders = await Order.find({ user: userId });

        // If no orders found, respond with a 404 status and a message
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        // Respond with the list of orders
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
    }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.body.orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        if (status === 'Delivered') {
            order.deliveredAt = Date.now();
        }

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order status', error: error.message });
    }
};

// Delete an order
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await order.remove();
        res.status(200).json({ message: 'Order removed' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete order', error: error.message });
    }
};

// Update shipping address in incomplete orders
export const updateOrderAddress = async (req, res) => {
    try {
        const { userId } = req.params;
        const { newAddress } = req.body;

        // Update address in incomplete orders
        const updatedOrders = await Order.updateMany(
            { user: userId, status: { $ne: 'Delivered', $ne: 'Shipping' } },  // Only update incomplete orders
            { $set: { 'shippingAddress.address': newAddress } }
        );

        if (updatedOrders.nModified === 0) {
            return res.status(404).json({ success: false, message: 'No incomplete orders found for this user.' });
        }

        res.status(200).json({ success: true, message: 'Shipping address updated in incomplete orders.' });
    } catch (error) {
        console.error('Error updating order addresses:', error);
        res.status(500).json({ success: false, message: 'Failed to update order addresses.' });
    }
};