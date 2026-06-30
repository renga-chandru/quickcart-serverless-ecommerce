import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import cartService from "../services/cartService";

const CartContext = createContext();

const COUPONS = {
  QUICK20: { type: "percent", value: 20 },
  WELCOME10: { type: "percent", value: 10 },
  SAVE5: { type: "fixed", value: 5.00 },
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  // Sync cart items when login status changes
  useEffect(() => {
    const fetchCart = async () => {
      if (isAuthenticated) {
        try {
          const items = await cartService.getCart();
          setCartItems(items);
        } catch (error) {
          console.error("Failed to load user cart:", error);
        }
      } else {
        const saved = localStorage.getItem("quickcart_cart");
        setCartItems(saved ? JSON.parse(saved) : []);
      }
    };
    fetchCart();
  }, [isAuthenticated]);

  // Sync guest cart to local storage when not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("quickcart_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const addToCart = async (product, quantity = 1) => {
    if (isAuthenticated) {
      try {
        const updatedItems = await cartService.addToCart(product.id, quantity);
        setCartItems(updatedItems);
      } catch (error) {
        console.error("Failed to add to cart on backend:", error);
        alert(error.message);
      }
    } else {
      setCartItems((prevItems) => {
        const existing = prevItems.find((item) => item.id === product.id);
        const currentQty = existing ? existing.quantity : 0;
        const requestedQty = currentQty + quantity;

        if (product.stock !== undefined && product.stock < requestedQty) {
          alert(`Insufficient stock. Only ${product.stock} items available.`);
          return prevItems;
        }

        if (existing) {
          return prevItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: requestedQty }
              : item
          );
        }
        
        const itemPrice = product.price;
        const discountPercent = product.discount || 0;
        const finalPrice = itemPrice * (1 - discountPercent / 100);

        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            discount: product.discount || 0,
            finalPrice: finalPrice,
            image: product.images?.[0] || product.image || "",
            quantity,
            category: product.category,
            stock: product.stock !== undefined ? product.stock : 999
          },
        ];
      });
    }
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        const updatedItems = await cartService.removeFromCart(productId);
        setCartItems(updatedItems);
      } catch (error) {
        console.error("Failed to remove from cart on backend:", error);
      }
    } else {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    
    if (isAuthenticated) {
      try {
        const updatedItems = await cartService.updateQuantity(productId, quantity);
        setCartItems(updatedItems);
      } catch (error) {
        console.error("Failed to update cart quantity on backend:", error);
        alert(error.message);
      }
    } else {
      setCartItems((prevItems) => {
        const item = prevItems.find((it) => it.id === productId);
        if (item && item.stock !== undefined && item.stock < quantity) {
          alert(`Insufficient stock. Only ${item.stock} items available.`);
          return prevItems;
        }
        return prevItems.map((it) =>
          it.id === productId ? { ...it, quantity } : it
        );
      });
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
        setCartItems([]);
      } catch (error) {
        console.error("Failed to clear cart on backend:", error);
      }
    } else {
      setCartItems([]);
    }
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const applyCoupon = (code) => {
    const cleanCode = code.toUpperCase().trim();
    setCouponCode(cleanCode);
    if (COUPONS[cleanCode]) {
      setAppliedCoupon({
        code: cleanCode,
        ...COUPONS[cleanCode],
      });
      setCouponError("");
      return true;
    } else {
      setAppliedCoupon(null);
      setCouponError("Invalid coupon code. Try QUICK20 or WELCOME10.");
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => {
    return acc + item.finalPrice * item.quantity;
  }, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percent") {
      discount = (subtotal * appliedCoupon.value) / 100;
    } else if (appliedCoupon.type === "fixed") {
      discount = Math.min(appliedCoupon.value, subtotal);
    }
  }

  const discountedSubtotal = subtotal - discount;
  const tax = discountedSubtotal * 0.08; // 8% tax rate
  const shipping = subtotal > 499 || cartItems.length === 0 ? 0.00 : 49.00; // Free shipping over ₹499
  const grandTotal = discountedSubtotal + tax + shipping;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        couponCode,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        cartCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
        summary: {
          subtotal,
          discount,
          tax,
          shipping,
          total: grandTotal,
        },
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
