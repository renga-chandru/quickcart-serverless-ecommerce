import api from "./api";

const userService = {
  getProfile: async () => {
    try {
      const response = await api.get("/auth/profile");
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch profile");
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/auth/profile", profileData);
      return response.data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw new Error(error.response?.data?.message || "Failed to update profile");
    }
  }
};

export default userService;
