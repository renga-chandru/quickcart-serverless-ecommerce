import cartService from "../services/cartService.js";

// @desc    Get current user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    const items = await cartService.getCart(req.user._id);
    res.json(items);
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId) {
      res.status(400);
      throw new Error("Product ID is required");
    }
    const items = await cartService.addToCart(req.user._id, productId, quantity || 1);
    res.json(items);
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart
// @access  Private
export const updateQuantity = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity === undefined) {
      res.status(400);
      throw new Error("Product ID and quantity are required");
    }
    const items = await cartService.updateQuantity(req.user._id, productId, quantity);
    res.json(items);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
export const removeFromCart = async (req, res, next) => {
  try {
    const items = await cartService.removeFromCart(req.user._id, req.params.id);
    res.json(items);
  } catch (error) {
    next(error);
  }
};

// @desc    Clear user cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res, next) => {
  try {
    const items = await cartService.clearCart(req.user._id);
    res.json(items);
  } catch (error) {
    next(error);
  }
};
