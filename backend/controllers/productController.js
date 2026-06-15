import productService from "../services/productService.js";

// @desc    Get all products (with pagination, sort, search, filters)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice, rating, inStockOnly, sortBy, page, limit } = req.query;
    const result = await productService.getProducts({
      category,
      search,
      minPrice,
      maxPrice,
      rating,
      inStockOnly,
      sortBy,
      page,
      limit
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trending products
// @route   GET /api/products/trending
// @access  Public
export const getTrendingProducts = async (req, res, next) => {
  try {
    const products = await productService.getTrendingProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get deals products
// @route   GET /api/products/deals
// @access  Public
export const getDeals = async (req, res, next) => {
  try {
    const products = await productService.getDeals();
    res.json(products);
  } catch (error) {
    next(error);
  }
};
