import express from "express";
import { getWishlist, toggleWishlist } from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // All wishlist routes require authentication

router.route("/")
  .get(getWishlist)
  .post(toggleWishlist);

export default router;
