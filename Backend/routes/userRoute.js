import express from 'express';
import { getSummary } from '../controller/userController.js'; // Adjust path as needed

const router = express.Router();

router.get('/summary', getSummary);

export default router;
