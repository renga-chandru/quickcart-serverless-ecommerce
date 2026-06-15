import express from "express";
import {
  placeOrder,
  getOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // All order routes require authentication

router.route("/")
  .get(getOrders)
  .post(placeOrder);

router.get("/all", adminOnly, getAllOrders);

router.get("/:id", getOrderById);
router.put("/:id/status", adminOnly, updateOrderStatus);

export default router;
