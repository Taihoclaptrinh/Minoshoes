import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from './routes/authRoute.js';
import cors from 'cors'

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

//database config
connectDB();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use('/api/v1/auth', authRoute);

app.get('/', (req, res) => {
    res.send('<h1>Welcome to ecommerce project</h1>');
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`.bgCyan.white);
})
