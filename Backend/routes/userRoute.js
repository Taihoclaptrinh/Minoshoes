import express from 'express';
import { updateUser, findUserById, getSummary } from '../controller/userController.js'; // Adjust path as needed

const router = express.Router();

router.get('/summary', getSummary);
router.get('/users/:id', findUserById);
router.put('/users/:id', updateUser); // Route for updating user


export default router;
