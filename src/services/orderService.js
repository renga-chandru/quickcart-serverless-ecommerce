import api from "./api";

const orderService = {
  placeOrder: async (orderData) => {
    try {
      const response = await api.post("/orders", orderData);
      return response.data;
    } catch (error) {
      console.error("Error placing order:", error);
      throw new Error(error.response?.data?.message || "Failed to place order");
    }
  },

  getOrders: async () => {
    try {
      const response = await api.get("/orders");
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch orders");
    }
  },

  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw new Error(error.response?.data?.message || "Order not found");
    }
  },

  // Admin orders fetch (returns all orders)
  getAllOrders: async () => {
    try {
      const response = await api.get("/orders/all");
      return response.data;
    } catch (error) {
      console.error("Error fetching all orders for admin:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch orders");
    }
  },

  // Admin order status update
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating status for order ${orderId}:`, error);
      throw new Error(error.response?.data?.message || "Failed to update order status");
    }
  }
};

export default orderService;
