import authService from "../services/authService.js";

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide email and password");
    }
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please fill in name, email, and password");
    }
    const result = await authService.register({ name, email, password, role, phone });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const result = await authService.getUserProfile(req.user._id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const result = await authService.updateUserProfile(req.user._id, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
