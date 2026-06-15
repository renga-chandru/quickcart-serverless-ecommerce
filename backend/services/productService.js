import Product from "../models/Product.js";
import Category from "../models/Category.js";

const productService = {
  getProducts: async ({
    category = "",
    search = "",
    minPrice = 0,
    maxPrice = Infinity,
    rating = 0,
    inStockOnly = false,
    sortBy = "popular",
    page = 1,
    limit = 8,
  } = {}) => {
    const query = {};

    if (category && category.toLowerCase() !== "all") {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (rating > 0) {
      query.rating = { $gte: Number(rating) };
    }

    if (inStockOnly === true || inStockOnly === "true") {
      query.stock = { $gt: 0 };
    }

    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || Infinity;

    // Build aggregation pipeline for sorting/filtering on calculated finalPrice
    const pipeline = [];

    // Match initial search filters
    pipeline.push({ $match: query });

    // Project/add finalPrice field (calculated based on discount)
    pipeline.push({
      $addFields: {
        finalPrice: {
          $multiply: ["$price", { $subtract: [1, { $divide: [{ $ifNull: ["$discount", 0] }, 100] }] }]
        }
      }
    });

    // Match price limits on the finalPrice
    pipeline.push({
      $match: {
        finalPrice: { $gte: min, $lte: max }
      }
    });

    // Apply sorting
    let sortStage = {};
    if (sortBy === "price-asc") {
      sortStage = { finalPrice: 1 };
    } else if (sortBy === "price-desc") {
      sortStage = { finalPrice: -1 };
    } else if (sortBy === "newest") {
      sortStage = { newest: -1, createdAt: -1 };
    } else {
      // default: popular
      sortStage = { popular: -1, rating: -1 };
    }
    pipeline.push({ $sort: sortStage });

    // Pagination
    const limitNum = Number(limit) || 8;
    const pageNum = Number(page) || 1;
    const skipNum = (pageNum - 1) * limitNum;

    pipeline.push({
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skipNum }, { $limit: limitNum }]
      }
    });

    const result = await Product.aggregate(pipeline);
    const totalItems = result[0]?.metadata[0]?.total || 0;
    const products = result[0]?.data || [];
    const totalPages = Math.ceil(totalItems / limitNum);

    return {
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages,
        totalItems
      }
    };
  },

  getProductById: async (id) => {
    const product = await Product.findOne({ id });
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  },

  createProduct: async (productData) => {
    if (productData.stock !== undefined && Number(productData.stock) < 0) {
      throw new Error("Stock cannot be negative");
    }
        // Generate custom ID if not provided
    if (!productData.id) {
      const products = await Product.find({}, { id: 1 });
      let maxNum = 0;
      products.forEach(p => {
        if (p.id && p.id.startsWith("prod-")) {
          const num = parseInt(p.id.replace("prod-", ""), 10);
          if (!isNaN(num) && num > maxNum) {
            maxNum = num;
          }
        }
      });
      productData.id = `prod-${maxNum + 1}`;
    }
    const product = await Product.create(productData);
    
    // Update Category counts
    await Category.updateOne(
      { name: { $regex: new RegExp(`^${product.category}$`, "i") } },
      { $inc: { count: 1 } }
    );

    return product;
  },

  updateProduct: async (id, productData) => {
    if (productData.stock !== undefined && Number(productData.stock) < 0) {
      throw new Error("Stock cannot be negative");
    }
    const product = await Product.findOneAndUpdate({ id }, productData, { new: true, runValidators: true });
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  },

  deleteProduct: async (id) => {
    const product = await Product.findOneAndDelete({ id });
    if (!product) {
      throw new Error("Product not found");
    }
    // Update Category counts
    await Category.updateOne(
      { name: { $regex: new RegExp(`^${product.category}$`, "i") } },
      { $inc: { count: -1 } }
    );
    return product;
  },

  getTrendingProducts: async () => {
    return await Product.find({ popular: true });
  },

  getDeals: async () => {
    return await Product.find({ deals: true });
  }
};

export default productService;
