import React from "react";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const inWish = isInWishlist(product.id);
  const outOfStock = product.stock <= 0;
  
  // Calculate discount price
  const hasDiscount = product.discount > 0;
  const finalPrice = product.price * (1 - (product.discount || 0) / 100);

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Badges / Actions */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 mb-4">
        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white font-sans text-xs font-bold px-2.5 py-1 rounded-full z-10 shadow-sm">
            {product.discount}% OFF
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full border border-slate-200/20 shadow-md transition-all duration-300 z-10 ${
            inWish
              ? "bg-red-500 text-white hover:bg-red-600 border-red-500"
              : "bg-white/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400"
          }`}
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>

        {/* Product Image */}
        <Link to={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={product.images?.[0] || product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
          <button
            onClick={() => onQuickView(product)}
            className="p-3 bg-white hover:bg-primary hover:text-white text-slate-800 rounded-full shadow-lg transition-all duration-300 transform scale-90 group-hover:scale-100"
            title="Quick View"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {product.category}
          </span>

          {/* Name */}
          <Link
            to={`/products/${product.id}`}
            className="block text-base font-bold font-sans text-slate-800 dark:text-white mt-1 line-clamp-1 hover:text-primary transition-colors"
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="flex items-center mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1.5">
              {product.rating}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">
              ({product.reviews?.length || 0})
            </span>
            
            {/* Stock status indicator */}
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto ${
                outOfStock
                  ? "bg-red-500/10 text-red-500"
                  : product.stock < 5
                  ? "bg-amber-500/10 text-amber-500"
                  : "bg-emerald-500/10 text-emerald-500"
              }`}
            >
              {outOfStock ? "Out of Stock" : product.stock < 5 ? "Low Stock" : "In Stock"}
            </span>
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-lg font-bold text-slate-800 dark:text-white">
                  ${finalPrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-slate-800 dark:text-white">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={() => !outOfStock && addToCart(product, 1)}
            disabled={outOfStock}
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              outOfStock
                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                : "bg-primary dark:bg-black text-white dark:text-white dark:border dark:border-white hover:bg-primary-dark dark:hover:bg-neutral-900/50 shadow-md shadow-primary/10 dark:shadow-none hover:shadow-primary/20 hover:scale-105 active:scale-95"
            }`}
            title={outOfStock ? "Out of stock" : "Add to cart"}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
