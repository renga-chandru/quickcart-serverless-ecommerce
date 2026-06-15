import React, { createContext, useContext, useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import wishlistService from "../services/wishlistService";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);

  // Sync wishlist items when login status changes
  useEffect(() => {
    const fetchWishlist = async () => {
      if (isAuthenticated) {
        try {
          const items = await wishlistService.getWishlist();
          setWishlistItems(items);
        } catch (error) {
          console.error("Failed to load user wishlist:", error);
        }
      } else {
        const saved = localStorage.getItem("quickcart_wishlist");
        setWishlistItems(saved ? JSON.parse(saved) : []);
      }
    };
    fetchWishlist();
  }, [isAuthenticated]);

  // Sync guest wishlist to local storage when not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("quickcart_wishlist", JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isAuthenticated]);

  const toggleWishlist = async (product) => {
    if (isAuthenticated) {
      try {
        const updatedItems = await wishlistService.toggleWishlist(product.id);
        setWishlistItems(updatedItems);
      } catch (error) {
        console.error("Failed to toggle wishlist item on backend:", error);
      }
    } else {
      setWishlistItems((prevItems) => {
        const exists = prevItems.some((item) => item.id === product.id);
        if (exists) {
          return prevItems.filter((item) => item.id !== product.id);
        } else {
          return [
            ...prevItems,
            {
              id: product.id,
              name: product.name,
              price: product.price,
              discount: product.discount || 0,
              image: product.images?.[0] || product.image || "",
              rating: product.rating,
              category: product.category,
              stock: product.stock,
            },
          ];
        }
      });
    }
  };

  const removeFromWishlist = async (productId) => {
    if (isAuthenticated) {
      try {
        const updatedItems = await wishlistService.toggleWishlist(productId);
        setWishlistItems(updatedItems);
      } catch (error) {
        console.error("Failed to remove item from wishlist on backend:", error);
      }
    } else {
      setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const moveToCart = async (product) => {
    await addToCart(product, 1);
    await removeFromWishlist(product.id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        moveToCart,
        wishlistCount: wishlistItems.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};
