import api from "./api";

const cartService = {
  getCart: async () => {
    try {
      const response = await api.get("/cart");
      return response.data;
    } catch (error) {
      console.error("Error fetching cart from API:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch cart");
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await api.post("/cart", { productId, quantity });
      return response.data;
    } catch (error) {
      console.error("Error adding to cart via API:", error);
      throw new Error(error.response?.data?.message || "Failed to add item to cart");
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      const response = await api.put("/cart", { productId, quantity });
      return response.data;
    } catch (error) {
      console.error("Error updating cart quantity via API:", error);
      throw new Error(error.response?.data?.message || "Failed to update item quantity");
    }
  },

  removeFromCart: async (productId) => {
    try {
      const response = await api.delete(`/cart/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error removing from cart via API:", error);
      throw new Error(error.response?.data?.message || "Failed to remove item from cart");
    }
  },

  clearCart: async () => {
    try {
      const response = await api.delete("/cart");
      return response.data;
    } catch (error) {
      console.error("Error clearing cart via API:", error);
      throw new Error(error.response?.data?.message || "Failed to clear cart");
    }
  }
};

export default cartService;
