import api from "./api";

const wishlistService = {
  getWishlist: async () => {
    try {
      const response = await api.get("/wishlist");
      return response.data;
    } catch (error) {
      console.error("Error fetching wishlist from API:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch wishlist");
    }
  },

  toggleWishlist: async (productId) => {
    try {
      const response = await api.post("/wishlist", { productId });
      return response.data;
    } catch (error) {
      console.error("Error toggling wishlist item in API:", error);
      throw new Error(error.response?.data?.message || "Failed to toggle wishlist item");
    }
  }
};

export default wishlistService;
