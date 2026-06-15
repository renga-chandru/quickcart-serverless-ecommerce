import wishlistService from "../services/wishlistService.js";

// @desc    Get current user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
  try {
    const items = await wishlistService.getWishlist(req.user._id);
    res.json(items);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle product in wishlist (Add/Remove)
// @route   POST /api/wishlist
// @access  Private
export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      res.status(400);
      throw new Error("Product ID is required");
    }
    const items = await wishlistService.toggleWishlist(req.user._id, productId);
    res.json(items);
  } catch (error) {
    next(error);
  }
};
