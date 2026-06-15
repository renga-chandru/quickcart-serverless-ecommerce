import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const mapCartItems = (cart) => {
  if (!cart || !cart.items) return [];
  return cart.items
    .filter(item => item.product !== null && item.product !== undefined)
    .map(item => {
      const p = item.product;
      const itemPrice = p.price;
      const discountPercent = p.discount || 0;
      const finalPrice = itemPrice * (1 - discountPercent / 100);
      return {
        id: p.id,
        name: p.name,
        price: p.price,
        discount: discountPercent,
        finalPrice: finalPrice,
        image: p.images?.[0] || "",
        quantity: item.quantity,
        category: p.category,
        stock: p.stock
      };
    });
};

const cartService = {
  getCart: async (userId) => {
    let cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }
    return mapCartItems(cart);
  },

  addToCart: async (userId, productIdStr, quantity = 1) => {
    const product = await Product.findOne({ id: productIdStr });
    if (!product) {
      throw new Error("Product not found");
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === product._id.toString()
    );

    const currentQty = itemIndex > -1 ? cart.items[itemIndex].quantity : 0;
    const requestedQty = currentQty + Number(quantity);

    if (product.stock < requestedQty) {
      throw new Error(`Insufficient stock. Only ${product.stock} items available.`);
    }

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = requestedQty;
    } else {
      cart.items.push({ product: product._id, quantity: Number(quantity) });
    }

    await cart.save();
    
    // Return fully populated updated cart items
    const updatedCart = await Cart.findOne({ user: userId }).populate("items.product");
    return mapCartItems(updatedCart);
  },

  updateQuantity: async (userId, productIdStr, quantity) => {
    const product = await Product.findOne({ id: productIdStr });
    if (!product) {
      throw new Error("Product not found");
    }

    if (product.stock < Number(quantity)) {
      throw new Error(`Insufficient stock. Only ${product.stock} items available.`);
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error("Cart not found");
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === product._id.toString()
    );

    if (itemIndex > -1) {
      if (Number(quantity) <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = Number(quantity);
      }
      await cart.save();
    }

    const updatedCart = await Cart.findOne({ user: userId }).populate("items.product");
    return mapCartItems(updatedCart);
  },

  removeFromCart: async (userId, productIdStr) => {
    const product = await Product.findOne({ id: productIdStr });
    if (!product) {
      throw new Error("Product not found");
    }

    let cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== product._id.toString()
      );
      await cart.save();
    }

    const updatedCart = await Cart.findOne({ user: userId }).populate("items.product");
    return mapCartItems(updatedCart);
  },

  clearCart: async (userId) => {
    let cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    return [];
  }
};

export default cartService;
