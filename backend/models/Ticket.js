import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Ticket ID e.g., TKT-123456
  userId: { type: String, default: "" }, // Associated logged in user id, empty if guest
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  subject: { type: String, default: "" },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Unread", "Read", "Replied", "Closed"],
    default: "Unread"
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low"
  },
  category: {
    type: String,
    enum: ["Complaint", "Feedback", "Order Issue", "Payment Issue", "Delivery Issue", "Other"],
    default: "Other"
  },
  adminReply: { type: String, default: "" },
  adminRepliedAt: { type: Date },
  adminName: { type: String, default: "" },
  userHasUnreadReply: { type: Boolean, default: false }
}, {
  timestamps: true
});

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
