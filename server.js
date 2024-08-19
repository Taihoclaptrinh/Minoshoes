import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './Backend/config/db.js';
import cors from 'cors';
import path from 'path';
import {
  checkEmailController,
  registerController,
  loginController,
  sendResetCodeController,
  resetPasswordController,
  testController,
  createUser,
  readUsers,
  deleteUser,
  findUser,
  showAllUsers,
} from './Backend/controller/authController.js';
import payosRoutes from './Backend/routes/payosRoute.js'; 
import authRoutes from './Backend/routes/authRoute.js';
import productRoute from './Backend/routes/productRoute.js';
import cartRoute from './Backend/routes/cartRoute.js';
import uploadRoute from './Backend/routes/uploadRoute.js';
import userRoute from './Backend/routes/userRoute.js'
import orderRoute from './Backend/routes/orderRoute.js';
import adminRoute from './Backend/routes/adminRoute.js';

dotenv.config();
const app = express();
const router = express.Router();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/payos', payosRoutes);

// Auth routes with rate limiters
router.post('/check-email', checkEmailController);
router.post('/register', registerController);
router.post('/login', loginController);
router.post('/send-reset-code', sendResetCodeController);
router.post('/reset-password', resetPasswordController);
router.get('/test', testController);
router.post('/create-user', createUser);
router.get('/read-users', readUsers);
router.delete('/delete-user/:id', deleteUser);
router.get('/find-user', findUser);
router.get('/show-all-users', showAllUsers);

// Image upload route
app.use('/api/v1/auth', uploadRoute);
app.use('/api/v1/admin', adminRoute)
app.use('/api/v1/auth', userRoute);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/orders', orderRoute);

// Other routes
app.use('/api/v1/auth/products', productRoute);
app.use('/api/v1/auth/cart', cartRoute);



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
  console.log(`Server running on ${PORT}`);
});
