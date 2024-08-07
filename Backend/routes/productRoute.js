import express from 'express';
import { createProduct,
        getProductById, updateProduct,
        deleteProduct, getRelatedProducts, 
        searchProducts, getProducts } from '../controller/productController.js';

const router = express.Router();

router.post('/', createProduct);
router.get('/', getProducts);
router.get('/search', searchProducts); 
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/:productId/related', getRelatedProducts);

export default router;