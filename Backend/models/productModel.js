import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    code: { type: [String], required: true }, // Array of strings
    description: { type: String, required: true, default: "No description" },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true, default: "Uncategorized" },
    sizes: { type: [String], required: true },
    color: { type: [String], required: true },
    array: { type: Number, required: true },
    images: { type: [String], required: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema, 'products');
