import express from 'express';
import { deleteProductById, 
    getProductById, getAllProducts , 
    getUserById, getAllUsers, 
    countAllUsers, countAllOrders,
    getAllOrders, getOrderById,
    deleteOrderById  } from '../controller/adminController.js'; // Ensure this path is correct

const router = express.Router();

// Route to count all users
router.get('/products', getAllProducts);
router.get('/products/:productId', getProductById);
router.delete('/products/:productId', deleteProductById);
router.get('/count-user', countAllUsers);
router.get('/get-user/:userId', getUserById);
router.get('/count-order', countAllOrders);
router.get('/orders', getAllOrders);
router.get('/orders/:orderId', getOrderById);
router.delete('/orders/:orderId', deleteOrderById)
router.get('/get-user', getAllUsers);
export default router;
