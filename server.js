import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./backend/config/db.js";
import cors from 'cors';
import path from 'path';
import {
  checkEmailController,
  registerController,
  loginController,
  testController,
  createUser,
  readUsers,
  deleteUser,
  findUser,
  showAllUsers
} from './Backend/controller/authController.js';
import productRoute from './backend/routes/productRoute.js';
import cartRoute from './backend/routes/cartRoute.js';

dotenv.config();
const app = express();
const router = express.Router();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Auth routes
router.post('/check-email', checkEmailController);
router.post('/register', registerController);
router.post('/login', loginController);
router.get('/test', testController);
router.post('/create-user', createUser);
router.get('/read-users', readUsers);
router.delete('/delete-user/:id', deleteUser);
router.get('/find-user', findUser);
router.get('/show-all-users', showAllUsers);
app.use('/api/v1/auth', router);

// Other routes
app.use('/api/v1/products', productRoute);
app.use('/api/v1/cart', cartRoute);

// Serve frontend
const __dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`.bgCyan.white);
});
