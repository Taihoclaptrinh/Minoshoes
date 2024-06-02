import express from 'express';
import { registerController, loginController, testController } from "../controller/authController.js"
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
//router object
const router = express.Router();

//routing
//Register || method POST
router.post("/register", registerController);

//Login || method POST
router.post("/login", loginController);

//Test routes
router.get('/test', requireSignIn,isAdmin, testController);
export default router;