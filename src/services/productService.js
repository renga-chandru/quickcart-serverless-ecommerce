import api from "./api";

const productService = {
  // Fetch all products with filtering, search, sorting
  getProducts: async (params = {}) => {
    try {
      const response = await api.get("/products", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch products");
    }
  },

  // Fetch product details by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw new Error(error.response?.data?.message || "Product not found");
    }
  },

  // Fetch all categories
  getCategories: async () => {
    try {
      const response = await api.get("/categories");
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch categories");
    }
  },

  // Fetch trending products
  getTrendingProducts: async () => {
    try {
      const response = await api.get("/products/trending");
      return response.data;
    } catch (error) {
      console.error("Error fetching trending products:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch trending products");
    }
  },

  // Fetch flash deals
  getDeals: async () => {
    try {
      const response = await api.get("/products/deals");
      return response.data;
    } catch (error) {
      console.error("Error fetching deals:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch deals");
    }
  },

  // Create product (Admin helper)
  createProduct: async (productData) => {
    try {
      const response = await api.post("/products", productData);
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw new Error(error.response?.data?.message || "Failed to create product");
    }
  },

  // Update product (Admin helper)
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw new Error(error.response?.data?.message || "Failed to update product");
    }
  },

  // Delete product (Admin helper)
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw new Error(error.response?.data?.message || "Failed to delete product");
    }
  }
};

export default productService;
