import api from "./api";

const categoryService = {
  getCategories: async () => {
    try {
      const response = await api.get("/categories");
      return response.data;
    } catch (error) {
      console.error("Error fetching categories in service:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch categories");
    }
  },
};

export default categoryService;
