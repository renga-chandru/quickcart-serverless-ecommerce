import express from "express";
import {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // All cart routes require authentication

router.route("/")
  .get(getCart)
  .post(addToCart)
  .put(updateQuantity)
  .delete(clearCart);

router.delete("/:id", removeFromCart);

export default router;
