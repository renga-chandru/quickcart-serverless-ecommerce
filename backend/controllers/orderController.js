import orderService from "../services/orderService.js";

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
export const placeOrder = async (req, res, next) => {
  try {
    const { items, summary, shippingAddress, paymentMethod } = req.body;
    if (!items || items.length === 0 || !summary || !shippingAddress || !paymentMethod) {
      res.status(400);
      throw new Error("Missing required order data");
    }
    const order = await orderService.placeOrder(req.user._id, {
      items,
      summary,
      shippingAddress,
      paymentMethod
    });
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getOrders(req.user._id);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(
      req.user._id,
      req.params.id,
      req.user.role
    );
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/all
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      res.status(400);
      throw new Error("Status is required");
    }
    const order = await orderService.updateOrderStatus(req.params.id, status);
    res.json(order);
  } catch (error) {
    next(error);
  }
};
