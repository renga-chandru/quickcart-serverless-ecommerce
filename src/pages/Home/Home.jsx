import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Star, ShoppingBag, ShieldCheck, Zap, Heart } from "lucide-react";
import productService from "../../services/productService";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import ProductCard from "../../components/ProductCard/ProductCard";
import Modal from "../../components/Modal/Modal";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { WHY_CHOOSE_US, TESTIMONIALS } from "../../constants/data";

export const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // State
  const [categories, setCategories] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [dealProducts, setDealProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Testimonials Slider State
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewQty, setQuickViewQty] = useState(1);

  // Countdown Timer state (Ends in 24 hours from render or set constant)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset countdown to 24h
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch initial home screen data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, trending, deals] = await Promise.all([
          productService.getCategories(),
          productService.getTrendingProducts(),
          productService.getDeals(),
        ]);
        setCategories(cats);
        setTrendingProducts(trending.slice(0, 4));
        setDealProducts(deals.slice(0, 4));
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Slider controls
  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setQuickViewQty(1);
  };

  const handleQuickAddToCart = () => {
    if (quickViewProduct) {
      addToCart(quickViewProduct, quickViewQty);
      setQuickViewProduct(null);
    }
  };

  // Scroll to Categories helper
  const categoriesRef = useRef(null);
  const scrollToCategories = () => {
    categoriesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 py-24 sm:py-32">
        {/* Decorative background blobs */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light font-sans text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4.5 h-4.5 fill-current" />
              <span>Next-Gen E-Commerce Platform</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-sans leading-tight text-slate-900 dark:text-white">
              Discover Amazing Products with <span className="text-gradient-primary">QuickCart</span>
            </h1>
            
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-lg leading-relaxed">
              Experience lightning-fast browsing, robust security, and cloud-ready infrastructure. Built for modern shopping.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest pt-2">
              <span>Modern</span>
              <span className="text-primary">•</span>
              <span>Fast</span>
              <span className="text-primary">•</span>
              <span>Secure</span>
              <span className="text-primary">•</span>
              <span>Cloud Ready</span>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/products"
                className="px-8 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                onClick={scrollToCategories}
                className="px-8 py-3.5 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 text-slate-700 dark:text-slate-350 rounded-2xl font-semibold transition-all duration-300"
              >
                Explore Categories
              </button>
            </div>
          </motion.div>

          {/* Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Glossmorphic Display Card */}
            <div className="relative glass-card p-6 rounded-3xl w-full max-w-md shadow-2xl border border-white/20 dark:border-slate-800/40">
              <div className="aspect-video rounded-2xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop"
                  alt="QuickCart Cloud Platform"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white">QuickCart Dashboard</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500">AWS Cloud Architecture Ready</p>
                </div>
                <span className="text-xs bg-emerald-500/10 text-emerald-500 font-bold px-2.5 py-1 rounded-full">
                  Operational
                </span>
              </div>
              
              {/* Floating element */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-2xl shadow-xl flex items-center space-x-3 hidden sm:flex">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-400">Products Catalog</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">Backend-Agnostic</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section ref={categoriesRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white tracking-tight">
            Browse by Category
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Explore our curated catalog selections across eight premium categories.
          </p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="h-32 bg-slate-100 dark:bg-slate-900 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </section>

      {/* 3. TODAY'S DEALS SECTION */}
      <section className="bg-slate-900 text-white py-16 overflow-hidden relative dark:bg-slate-950/70 border-y border-slate-800">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left space-y-2">
              <span className="text-xs bg-red-500 text-white font-sans font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Limited Time Flash Sale
              </span>
              <h2 className="text-3xl font-extrabold font-sans tracking-tight text-white mt-1">
                Today's Hot Deals
              </h2>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center space-x-3 bg-slate-800/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-700/50">
              <div className="flex flex-col items-center">
                <span className="text-xl font-extrabold font-sans text-primary-light">
                  {timeLeft.hours.toString().padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Hrs</span>
              </div>
              <span className="text-xl font-bold text-slate-500">:</span>
              <div className="flex flex-col items-center">
                <span className="text-xl font-extrabold font-sans text-primary-light">
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Min</span>
              </div>
              <span className="text-xl font-bold text-slate-500">:</span>
              <div className="flex flex-col items-center">
                <span className="text-xl font-extrabold font-sans text-red-400">
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Sec</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-80 bg-slate-800 animate-pulse rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {dealProducts.map((product) => (
                <div key={product.id} className="text-slate-800 dark:text-slate-200">
                  <ProductCard product={product} onQuickView={handleQuickView} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. TRENDING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end">
          <div className="text-left space-y-2">
            <h2 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white tracking-tight">
              Trending Products
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Check out the most popular products in our store.
            </p>
          </div>
          <Link
            to="/products"
            className="text-primary hover:text-primary-dark font-semibold text-sm flex items-center space-x-1 group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-80 bg-slate-100 dark:bg-slate-900 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} onQuickView={handleQuickView} />
            ))}
          </div>
        )}
      </section>

      {/* 5. WHY CHOOSE QUICKCART */}
      <section className="bg-slate-50 dark:bg-slate-900/40 py-16 border-y border-slate-200/40 dark:border-slate-800/40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white tracking-tight">
              Why Choose QuickCart?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              We leverage modern infrastructure and premium operations for a seamless shopping experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WHY_CHOOSE_US.map((item, index) => {
              // Map icons dynamically
              const iconMap = {
                Truck: ShoppingBag,
                ShieldCheck: ShieldCheck,
                Cloud: Zap,
                Star: Star,
                RefreshCw: ArrowRight,
                Headphones: Star,
              };
              // fallback to Star if index doesn't have it
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/40 dark:border-slate-800/40 shadow-sm flex items-start space-x-4 hover:shadow-md transition-shadow duration-300 text-left"
                >
                  <div className="p-3 bg-primary/10 text-primary rounded-xl flex-shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-850 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER TESTIMONIALS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white tracking-tight">
            Loved by Customers
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Hear from shoppers who rely on QuickCart daily.
          </p>
        </div>

        {/* Testimonial slider wrapper */}
        <div className="relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-8 sm:p-12 shadow-xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-6 flex flex-col items-center"
            >
              {/* Stars */}
              <div className="flex space-x-1 text-amber-400">
                {Array.from({ length: TESTIMONIALS[activeTestimonial].rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              {/* Review Text */}
              <blockquote className="text-lg sm:text-xl font-medium text-slate-700 dark:text-slate-250 italic max-w-2xl leading-relaxed">
                "{TESTIMONIALS[activeTestimonial].review}"
              </blockquote>

              {/* Profile */}
              <div className="flex items-center space-x-3 mt-4">
                <img
                  src={TESTIMONIALS[activeTestimonial].avatar}
                  alt={TESTIMONIALS[activeTestimonial].name}
                  className="w-12 h-12 rounded-full object-cover border border-primary/20"
                />
                <div className="text-left">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {TESTIMONIALS[activeTestimonial].name}
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Verified Buyer</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Buttons */}
          <div className="flex justify-center space-x-4 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/50">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-primary transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. NEWSLETTER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-slate-900 dark:to-slate-950 p-8 sm:p-12 md:p-16 rounded-[40px] text-center border border-primary/10 dark:border-slate-850 shadow-xl space-y-8 relative overflow-hidden">
          {/* background glows */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white tracking-tight">
              Get 20% Off Your First Order
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Join the QuickCart club! Subscribe to our newsletter to receive secret coupons, stock drops, and e-commerce tutorials.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Subscribed successfully!");
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative z-10"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-grow px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-sans shadow-sm"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold shadow-md shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* QUICK VIEW MODAL */}
      <Modal
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        title={quickViewProduct?.name}
        size="lg"
      >
        {quickViewProduct && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Image */}
            <div className="aspect-square rounded-2xl bg-slate-50 dark:bg-slate-800 overflow-hidden border border-slate-100 dark:border-slate-850">
              <img
                src={quickViewProduct.images?.[0] || quickViewProduct.image}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Info details */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                  {quickViewProduct.category}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-sans">
                  {quickViewProduct.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center mt-2 text-sm">
                  <div className="flex items-center text-amber-450 mr-1.5">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{quickViewProduct.rating}</span>
                  <span className="text-slate-400 ml-1.5">({quickViewProduct.reviews?.length} reviews)</span>
                </div>
                
                {/* Description */}
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                  {quickViewProduct.description}
                </p>
              </div>

              {/* Price & Quantity & Actions */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-850">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs text-slate-400">Total Price</span>
                    <p className="text-2xl font-black text-slate-900 dark:text-white font-sans">
                      ${(quickViewProduct.price * (1 - (quickViewProduct.discount || 0) / 100)).toFixed(2)}
                    </p>
                  </div>
                  
                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900">
                    <button
                      onClick={() => setQuickViewQty((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 font-bold transition-colors text-slate-600 dark:text-slate-350"
                    >
                      -
                    </button>
                    <span className="px-4 font-bold text-sm text-slate-800 dark:text-white">{quickViewQty}</span>
                    <button
                      onClick={() => setQuickViewQty((q) => q + 1)}
                      className="px-3 py-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 font-bold transition-colors text-slate-600 dark:text-slate-350"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleQuickAddToCart}
                    className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-md shadow-primary/10 hover:shadow-primary/20 transition-all duration-300"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      toggleWishlist(quickViewProduct);
                    }}
                    className={`w-full py-3 rounded-xl font-semibold border flex items-center justify-center space-x-2 transition-all duration-300 ${
                      isInWishlist(quickViewProduct.id)
                        ? "bg-red-50 dark:bg-red-950/20 text-red-500 border-red-200 dark:border-red-950/30"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(quickViewProduct.id) ? "fill-current" : ""}`} />
                    <span>Wishlist</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Home;
