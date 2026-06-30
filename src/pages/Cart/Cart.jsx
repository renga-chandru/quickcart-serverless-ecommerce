import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight, Tag, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import EmptyState from "../../components/EmptyState/EmptyState";

export const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    appliedCoupon,
    couponCode,
    couponError,
    applyCoupon,
    removeCoupon,
    summary,
  } = useCart();
  const navigate = useNavigate();

  const [promoInput, setPromoInput] = useState("");

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyCoupon(promoInput);
      setPromoInput("");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          icon="ShoppingBag"
          title="Your Shopping Cart is Empty"
          description="Looks like you haven't added anything to your cart yet. Explore our top products and start shopping."
          actionText="Shop Trending Now"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title */}
      <div className="text-left border-b border-slate-200/50 dark:border-slate-850 pb-6 mb-10">
        <h1 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white">
          Shopping Cart
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Review items in your cart before checking out
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 text-left">
        {/* Left: Cart Items List (Col span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-slate-200/50 dark:border-slate-800 rounded-3xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-850 bg-white dark:bg-slate-900 shadow-sm">
            {cartItems.map((item) => (
              <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                {/* Image and Details */}
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-2xl object-cover bg-slate-100 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 flex-shrink-0"
                  />
                  <div className="text-left space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      {item.category}
                    </span>
                    <Link
                      to={`/products/${item.id}`}
                      className="block text-base font-bold text-slate-800 dark:text-white hover:text-primary transition-colors line-clamp-1 font-sans"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm font-bold text-slate-805 dark:text-slate-150 font-sans">
                      ₹{item.finalPrice.toFixed(2)}
                      {item.discount > 0 && (
                        <span className="text-xs text-slate-400 line-through font-medium ml-2">
                          ₹{item.price.toFixed(2)}
                        </span>
                      )}
                    </p>
                    {item.quantity >= item.stock && (
                      <span className="text-[10px] text-amber-500 font-bold block mt-0.5">
                        Only {item.stock} items available.
                      </span>
                    )}
                  </div>
                </div>

                {/* Adjust quantity and remove buttons */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-8">
                  {/* Quantity adjustments */}
                  <div className="flex items-center border border-slate-250/50 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50 h-9">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 hover:bg-slate-200 dark:hover:bg-slate-850 text-sm font-bold text-slate-550 dark:text-slate-350 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 font-bold text-xs text-slate-800 dark:text-white font-sans">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className={`px-3 text-sm font-bold text-slate-550 dark:text-slate-350 transition-colors ${
                        item.quantity >= item.stock
                          ? "text-slate-300 dark:text-slate-700 cursor-not-allowed"
                          : "hover:bg-slate-200 dark:hover:bg-slate-850"
                      }`}
                      title={item.quantity >= item.stock ? `Only ${item.stock} items available` : "Increase quantity"}
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal of item */}
                  <span className="text-sm font-bold text-slate-800 dark:text-white font-sans w-20 text-right">
                    ₹{(item.finalPrice * item.quantity).toFixed(2)}
                  </span>

                  {/* Remove action */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/products"
              className="text-primary hover:text-primary-dark text-sm font-bold flex items-center space-x-1 group"
            >
              <span>&larr; Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right: Order Summary (Col span 1) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold font-sans text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-4">
              Order Summary
            </h3>

            {/* Calculations items */}
            <div className="space-y-3.5 text-sm font-sans">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">₹{summary.subtotal.toFixed(2)}</span>
              </div>

              {/* Coupon discounts */}
              {summary.discount > 0 && (
                <div className="flex justify-between text-emerald-500 font-medium">
                  <span>Coupon Discount</span>
                  <span>-₹{summary.discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Sales Tax (8%)</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">₹{summary.tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Shipping Fee</span>
                <span className="font-semibold text-slate-805 dark:text-slate-200">
                  {summary.shipping === 0 ? "FREE" : `₹${summary.shipping.toFixed(2)}`}
                </span>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-850 pt-4 flex justify-between text-base font-extrabold text-slate-900 dark:text-white">
                <span>Grand Total</span>
                <span>₹{summary.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Coupon Inputs */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-850">
              {appliedCoupon ? (
                <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4" />
                    <span>Coupon '{appliedCoupon.code}' Applied</span>
                  </div>
                  <button onClick={removeCoupon} className="p-0.5 hover:bg-emerald-500/20 rounded-full transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePromoSubmit} className="space-y-2">
                  <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest block text-left">
                    Promo Code
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="e.g. QUICK20"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-grow px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs font-sans"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <span className="text-[10px] font-bold text-red-500 block text-left">
                      {couponError}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 block text-left">
                    Tip: Use coupon <code className="bg-slate-100 dark:bg-slate-850 px-1 py-0.5 rounded text-primary">QUICK20</code> for 20% off.
                  </span>
                </form>
              )}
            </div>

            {/* Proceed to checkout */}
            <div className="pt-2">
              <button
                onClick={() => navigate("/checkout")}
                className="w-full py-3 bg-primary dark:bg-black hover:bg-primary-dark dark:hover:bg-neutral-900/50 text-white dark:text-white dark:border dark:border-white font-bold rounded-2xl shadow-lg shadow-primary/10 dark:shadow-none hover:shadow-primary/20 transition-all flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;
