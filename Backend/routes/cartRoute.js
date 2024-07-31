import express from 'express';
import { addToCart, getCart, updateCart, removeFromCart } from '../controller/cartController.js';

const router = express.Router();

router.get('/get-cart', getCart);
router.post('/add-to-cart', addToCart);
router.put('/update-cart', updateCart);
router.delete('/remove-from-cart/:productId', removeFromCart);

export default router;