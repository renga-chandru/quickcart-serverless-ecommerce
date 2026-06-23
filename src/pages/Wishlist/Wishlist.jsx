import React from "react";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import EmptyState from "../../components/EmptyState/EmptyState";

export const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, moveToCart } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          icon="Heart"
          title="Your Wishlist is Empty"
          description="Save items you like to buy them later. Explore our trending products to fill your list."
          actionText="Explore Products"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title */}
      <div className="text-left border-b border-slate-200/50 dark:border-slate-805 pb-6 mb-10">
        <h1 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white">
          My Wishlist
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          You have saved {wishlistItems.length} products
        </p>
      </div>

      {/* Grid of Wishlist Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        {wishlistItems.map((item) => {
          const discountPercent = item.discount || 0;
          const finalPrice = item.price * (1 - discountPercent / 100);
          const outOfStock = item.stock <= 0;

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              {/* Product Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 mb-4 border border-slate-100 dark:border-slate-850">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                {discountPercent > 0 && (
                  <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {discountPercent}% OFF
                  </span>
                )}
                {/* Remove button */}
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-2.5 right-2.5 p-2 bg-white/90 dark:bg-slate-900/90 text-slate-400 hover:text-red-500 rounded-full border border-slate-200/20 shadow-md transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Product Details */}
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {item.category}
                  </span>
                  <Link
                    to={`/products/${item.id}`}
                    className="block text-base font-bold font-sans text-slate-800 dark:text-white mt-1 hover:text-primary transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>

                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-base font-black text-slate-800 dark:text-white font-sans">
                      ${finalPrice.toFixed(2)}
                    </span>
                    {discountPercent > 0 && (
                      <span className="text-xs text-slate-400 line-through">
                        ${item.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Move to Cart Action */}
                <div className="mt-5">
                  <button
                    onClick={() => moveToCart(item)}
                    disabled={outOfStock}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm ${
                      outOfStock
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                        : "bg-primary dark:bg-black text-white dark:text-white dark:border dark:border-white hover:bg-primary-dark dark:hover:bg-neutral-900/50 shadow-primary/10 dark:shadow-none hover:shadow-primary/20"
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{outOfStock ? "Out of Stock" : "Move to Cart"}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
