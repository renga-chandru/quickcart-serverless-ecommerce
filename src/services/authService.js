import api from "./api";

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const userData = response.data;
      
      // Store token and user details in localStorage
      if (userData.token) {
        localStorage.setItem("quickcart_token", userData.token);
      }
      // Store user object without token to preserve state cleanly
      const { token, ...userWithoutToken } = userData;
      localStorage.setItem("quickcart_user", JSON.stringify(userWithoutToken));
      
      return userWithoutToken;
    } catch (error) {
      const message = error.response?.data?.message || "Invalid Email or Password";
      throw new Error(message);
    }
  },

  signup: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      const registeredData = response.data;

      if (registeredData.token) {
        localStorage.setItem("quickcart_token", registeredData.token);
      }
      const { token, ...userWithoutToken } = registeredData;
      localStorage.setItem("quickcart_user", JSON.stringify(userWithoutToken));

      return userWithoutToken;
    } catch (error) {
      const message = error.response?.data?.message || "Signup failed";
      throw new Error(message);
    }
  },

  getCurrentUser: () => {
    const userJson = localStorage.getItem("quickcart_user");
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch (e) {
      return null;
    }
  },

  logout: async () => {
    localStorage.removeItem("quickcart_token");
    localStorage.removeItem("quickcart_user");
    return true;
  },

  updateProfile: async (updatedData) => {
    try {
      const response = await api.put("/auth/profile", updatedData);
      const updatedUser = response.data;

      // Maintain current user fields and merge with updated profile response
      const currentUser = authService.getCurrentUser() || {};
      const mergedUser = {
        ...currentUser,
        ...updatedUser,
      };

      localStorage.setItem("quickcart_user", JSON.stringify(mergedUser));
      return mergedUser;
    } catch (error) {
      const message = error.response?.data?.message || "Profile update failed";
      throw new Error(message);
    }
  }
};

export default authService;
