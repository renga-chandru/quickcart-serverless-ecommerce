import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";
import ticketService from "../services/ticketService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadSupportCount, setUnreadSupportCount] = useState(0);

  const fetchUnreadSupportCount = async () => {
    try {
      const count = await ticketService.getUnreadCount();
      setUnreadSupportCount(count);
    } catch (err) {
      console.error("Error fetching unread support tickets:", err);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        if (currentUser.role !== "admin") {
          await fetchUnreadSupportCount();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const loggedUser = await authService.login(email, password);
      setUser(loggedUser);
      if (loggedUser && loggedUser.role !== "admin") {
        await fetchUnreadSupportCount();
      }
      return loggedUser;
    } catch (err) {
      setError(err.message || "Authentication failed");
      throw err;
    }
  };

  const signup = async (userData) => {
    setError(null);
    try {
      const registeredUser = await authService.signup(userData);
      setUser(registeredUser);
      setUnreadSupportCount(0);
      return registeredUser;
    } catch (err) {
      setError(err.message || "Signup failed");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setUnreadSupportCount(0);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      const updatedUser = await authService.updateProfile(updatedData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error("Update profile error:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        loading,
        error,
        login,
        signup,
        logout,
        updateProfile,
        unreadSupportCount,
        setUnreadSupportCount,
        fetchUnreadSupportCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
