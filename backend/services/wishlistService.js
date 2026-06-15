import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

const mapWishlistItems = (wishlist) => {
  if (!wishlist || !wishlist.products) return [];
  return wishlist.products
    .filter(p => p !== null && p !== undefined)
    .map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      discount: p.discount || 0,
      image: p.images?.[0] || "",
      rating: p.rating,
      category: p.category,
      stock: p.stock
    }));
};

const wishlistService = {
  getWishlist: async (userId) => {
    let wishlist = await Wishlist.findOne({ user: userId }).populate("products");
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }
    return mapWishlistItems(wishlist);
  },

  toggleWishlist: async (userId, productIdStr) => {
    const product = await Product.findOne({ id: productIdStr });
    if (!product) {
      throw new Error("Product not found");
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    const prodIdx = wishlist.products.findIndex(
      (pId) => pId.toString() === product._id.toString()
    );

    if (prodIdx > -1) {
      wishlist.products.splice(prodIdx, 1);
    } else {
      wishlist.products.push(product._id);
    }

    await wishlist.save();
    const updatedWishlist = await Wishlist.findOne({ user: userId }).populate("products");
    return mapWishlistItems(updatedWishlist);
  }
};

export default wishlistService;
