import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  id: { type: String, required: true }, // product string ID (e.g. 'prod-1')
  name: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  quantity: { type: Number, required: true },
  image: { type: String, default: "" }
}, { _id: false });

const orderSummarySchema = new mongoose.Schema({
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  shipping: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true }
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true }
}, { _id: false });

const timelineEventSchema = new mongoose.Schema({
  status: { type: String, required: true },
  date: { type: String, default: "" },
  completed: { type: Boolean, default: false }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Custom order ID e.g., 'ORD-928374'
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ["Processing", "Shipped", "Delivered", "Cancelled"], default: "Processing" },
  items: [orderItemSchema],
  summary: { type: orderSummarySchema, required: true },
  shippingAddress: { type: shippingAddressSchema, required: true },
  paymentMethod: { type: String, required: true },
  timeline: [timelineEventSchema]
}, {
  timestamps: true
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
