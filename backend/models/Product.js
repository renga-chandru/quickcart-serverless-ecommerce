import mongoose from "mongoose";

const specificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  author: { type: String, required: true },
  date: { type: String, required: true },
  comment: { type: String, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // custom ID matching frontend 'prod-X'
  name: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  stock: { type: Number, required: true, min: [0, "Stock cannot be negative"], default: 0 },
  category: { type: String, required: true },
  images: [{ type: String }],
  description: { type: String, default: "" },
  specifications: [specificationSchema],
  reviews: [reviewSchema],
  popular: { type: Boolean, default: false },
  newest: { type: Boolean, default: false },
  deals: { type: Boolean, default: false }
}, {
  timestamps: true
});

const Product = mongoose.model("Product", productSchema);
export default Product;
