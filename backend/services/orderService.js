import Order from "../models/Order.js";
import Product from "../models/Product.js";
import cartService from "./cartService.js";

const orderService = {
  placeOrder: async (userId, orderData) => {
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();

    const items = orderData.items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      discount: item.discount || 0,
      quantity: item.quantity,
      image: item.image || ""
    }));

    // 1. Initial inventory verification
    for (const item of items) {
      const product = await Product.findOne({ id: item.id });
      if (!product) {
        throw new Error(`Product not found: ${item.name}`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product "${item.name}". Only ${product.stock} items available.`);
      }
    }

    // 2. Concurrency-safe atomic stock deduction with transactional rollback
    const decrementedItems = [];
    try {
      for (const item of items) {
        const result = await Product.updateOne(
          { id: item.id, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } }
        );
        if (result.modifiedCount === 0) {
          throw new Error(`Insufficient stock for product "${item.name}" due to a concurrent purchase.`);
        }
        decrementedItems.push(item);
      }
    } catch (error) {
      // Rollback successfully decremented items
      for (const rolledBack of decrementedItems) {
        await Product.updateOne(
          { id: rolledBack.id },
          { $inc: { stock: rolledBack.quantity } }
        );
      }
      throw error;
    }

    // 3. Create the order document
    const timeline = [
      { status: "Order Placed", date: now, completed: true },
      { status: "Processing", date: new Date(Date.now() + 600000).toISOString(), completed: true },
      { status: "Shipped", date: "", completed: false },
      { status: "Delivered", date: "", completed: false }
    ];

    const order = await Order.create({
      id: orderId,
      user: userId,
      date: now.split("T")[0],
      status: "Processing",
      items,
      summary: orderData.summary,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      timeline
    });

    // 4. Clear user's cart
    await cartService.clearCart(userId);

    return order;
  },

  getOrders: async (userId) => {
    return await Order.find({ user: userId }).sort({ createdAt: -1 });
  },

  getOrderById: async (userId, orderId, role) => {
    const query = { id: orderId };
    if (role !== "admin") {
      query.user = userId;
    }
    const order = await Order.findOne(query);
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  },

  getAllOrders: async () => {
    return await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
  },

  updateOrderStatus: async (orderId, status) => {
    const order = await Order.findOne({ id: orderId });
    if (!order) {
      throw new Error("Order not found");
    }

    order.status = status;

    // Update the timeline steps
    const now = new Date().toISOString();
    order.timeline = order.timeline.map(step => {
      if (step.status.toLowerCase() === status.toLowerCase()) {
        return { ...step, date: now, completed: true };
      }
      // If we mark something as delivered, ensure shipped is also marked completed
      if (status.toLowerCase() === "delivered" && step.status.toLowerCase() === "shipped" && !step.completed) {
        return { ...step, date: now, completed: true };
      }
      return step;
    });

    await order.save();
    return order;
  }
};

export default orderService;
