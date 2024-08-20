import express from 'express';
import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js'; // Adjust the import path accordingly
import {
  createOrder,
  getUserOrders,
  getOrdersByUserId,
  updateOrderStatus,
  deleteOrder
} from '../controller/orderController.js';

const router = express.Router();

router.post('/create-order', requireSignIn, createOrder);
router.get('/user-orders/:userId', getOrdersByUserId);
router.get('/:id', requireSignIn, getUserOrders);
router.put('/:orderId/status', requireSignIn, updateOrderStatus);
router.delete('/:orderId', requireSignIn, isAdmin, deleteOrder);

export default router;
