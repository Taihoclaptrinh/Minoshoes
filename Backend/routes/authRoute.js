import express from 'express';
import { checkEmailController, registerController, loginController, testController } from "../controller/authController.js";
import { createUser, showAllUsers, readUsers, deleteUser, findUser } from '../controller/userController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

//router object
const router = express.Router();

// Check Email || method POST
router.post("/check-email", checkEmailController);

// Register || method POST
router.post("/register", registerController);

// Login || method POST
router.post("/login", loginController);

// Test routes
router.get('/test', requireSignIn, isAdmin, testController);

// CRUD User
router.post('/create-user', createUser);
router.get('/show-all-users', showAllUsers);
router.get('/read-users', readUsers);
router.get('/find-user/:username', findUser);
router.delete('/delete-user/:id', deleteUser);

export default router;
