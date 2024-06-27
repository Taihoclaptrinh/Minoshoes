import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./Backend/config/db.js";
import authRoute from './Backend/routes/authRoute.js';
import productRoute from './Backend/routes/productRoute.js';
import cors from 'cors';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/products', productRoute);

// Default route
app.get('/', (req, res) => {
    res.send('<h1>Minoshoes Store</h1>');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`.bgCyan.white);
});