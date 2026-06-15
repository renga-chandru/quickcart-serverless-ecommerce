import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "quickcart-secret-key-2026", {
    expiresIn: "30d",
  });
};

const authService = {
  login: async (email, password) => {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (user && (await user.matchPassword(password))) {
      return {
        _id: user._id,
        id: user.role === "admin" ? "usr-admin" : "usr-customer", // mock user client IDs for client-side compatibility
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
        token: generateToken(user._id),
      };
    }
    throw new Error("Invalid email or password");
  },

  register: async (userData) => {
    const userExists = await User.findOne({ email: userData.email.toLowerCase().trim() });
    if (userExists) {
      throw new Error("User already exists");
    }

    const user = await User.create({
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      role: userData.role || "customer",
      phone: userData.phone || "",
      avatar: userData.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(userData.name)}`
    });

    if (user) {
      return {
        _id: user._id,
        id: user.role === "admin" ? "usr-admin" : "usr-customer",
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
        token: generateToken(user._id),
      };
    } else {
      throw new Error("Invalid user data");
    }
  },

  getUserProfile: async (userId) => {
    const user = await User.findById(userId).select("-password");
    if (user) {
      return {
        _id: user._id,
        id: user.role === "admin" ? "usr-admin" : "usr-customer",
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
      };
    }
    throw new Error("User not found");
  },

  updateUserProfile: async (userId, updateData) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.name = updateData.name || user.name;
    user.phone = updateData.phone !== undefined ? updateData.phone : user.phone;
    user.avatar = updateData.avatar || user.avatar;
    if (updateData.address) {
      user.address = {
        street: updateData.address.street !== undefined ? updateData.address.street : user.address.street,
        city: updateData.address.city !== undefined ? updateData.address.city : user.address.city,
        state: updateData.address.state !== undefined ? updateData.address.state : user.address.state,
        zip: updateData.address.zip !== undefined ? updateData.address.zip : user.address.zip,
        country: updateData.address.country !== undefined ? updateData.address.country : user.address.country,
      };
    }

    if (updateData.password) {
      user.password = updateData.password;
    }

    const updatedUser = await user.save();
    return {
      _id: updatedUser._id,
      id: updatedUser.role === "admin" ? "usr-admin" : "usr-customer",
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      phone: updatedUser.phone,
      address: updatedUser.address,
    };
  }
};

export default authService;
