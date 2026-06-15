import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Heart, ShoppingCart, Share2, Shield, Truck, RefreshCw, ChevronRight, Check } from "lucide-react";
import productService from "../../services/productService";
import ProductCard from "../../components/ProductCard/ProductCard";
import { SkeletonDetails } from "../../components/Loading/Loading";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Component States
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description"); // 'description' | 'specifications' | 'reviews'
  const [copiedLink, setCopiedLink] = useState(false);

  // Hover Zoom States
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const prod = await productService.getProductById(id);
        setProduct(prod);
        setActiveImage(prod.images?.[0] || prod.image);
        
        // Fetch related products (same category, excluding current product)
        const allProductsResult = await productService.getProducts({
          category: prod.category,
          limit: 10,
        });
        const related = allProductsResult.products.filter((p) => p.id !== prod.id).slice(0, 4);
        setRelatedProducts(related);
      } catch (err) {
        console.error("Error loading product details:", err);
        setError("Failed to load product. It may not exist.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Zoom handlers
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: "block",
      backgroundImage: `url(${activeImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "200%",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" });
  };

  if (loading) return <SkeletonDetails />;

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">{error || "Product not found"}</h3>
        <Link to="/products" className="px-6 py-3 bg-primary text-white rounded-xl font-bold">
          Back to Catalogue
        </Link>
      </div>
    );
  }

  const outOfStock = product.stock <= 0;
  const inWish = isInWishlist(product.id);
  const finalPrice = product.price * (1 - (product.discount || 0) / 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-450 dark:text-slate-500 mb-8 uppercase tracking-wider text-left">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          {/* Main Display Image */}
          <div
            className="relative aspect-square rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 overflow-hidden cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {/* Zoom overlay */}
            <div
              className="absolute inset-0 pointer-events-none bg-no-repeat transition-opacity duration-150"
              style={{
                ...zoomStyle,
                backgroundImage: `url(${activeImage})`,
              }}
            />
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex space-x-3.5 overflow-x-auto py-1 hide-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 border-2 transition-all flex-shrink-0 ${
                    activeImage === img
                      ? "border-primary scale-95 shadow-sm"
                      : "border-slate-200/50 dark:border-slate-800/50 hover:border-slate-400"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category / Badges */}
            <div className="flex items-center space-x-3">
              <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                {product.category}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
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

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl font-extrabold font-sans text-slate-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            {/* Ratings & Share */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-850">
              <div className="flex items-center text-sm font-medium">
                <div className="flex items-center text-amber-450 mr-1.5">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <span className="text-lg font-bold text-slate-800 dark:text-white">{product.rating}</span>
                <span className="text-slate-450 ml-1.5">({product.reviews?.length} Reviews)</span>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-xs font-bold text-slate-550 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-500">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Share Product</span>
                  </>
                )}
              </button>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3 pt-2">
              {product.discount > 0 ? (
                <>
                  <span className="text-3xl font-black text-slate-900 dark:text-white font-sans">
                    ${finalPrice.toFixed(2)}
                  </span>
                  <span className="text-base text-slate-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-xs bg-red-100 text-red-650 font-bold px-2 py-0.5 rounded-md">
                    Save {product.discount}%
                  </span>
                </>
              ) : (
                <span className="text-3xl font-black text-slate-900 dark:text-white font-sans">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Brief Desc */}
            <p className="text-slate-550 dark:text-slate-400 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Action Area */}
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-850">
            <div className="flex flex-wrap items-center gap-6">
              {/* Qty Selector */}
              <div className="flex flex-col text-left space-y-1.5">
                <span className="text-xs text-slate-450 uppercase font-bold tracking-wider">Quantity</span>
                <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 h-12">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 hover:bg-slate-200 dark:hover:bg-slate-800 font-bold text-slate-600 dark:text-slate-350 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-5 font-bold text-slate-800 dark:text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={quantity >= product.stock || outOfStock}
                    className={`px-4 font-bold text-slate-600 dark:text-slate-350 transition-colors ${
                      quantity >= product.stock || outOfStock
                        ? "bg-slate-100 dark:bg-slate-800/50 text-slate-400 cursor-not-allowed"
                        : "hover:bg-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    +
                  </button>
                </div>
                {product.stock > 0 && (
                  <span className="text-[11px] font-bold text-amber-500 mt-1">
                    Only {product.stock} items available.
                  </span>
                )}
              </div>

              {/* Add to Cart & Wishlist */}
              <div className="flex-1 flex gap-3.5 pt-5">
                <button
                  onClick={() => !outOfStock && addToCart(product, quantity)}
                  disabled={outOfStock}
                  className={`flex-grow h-12 rounded-2xl font-bold flex items-center justify-center space-x-2.5 transition-all shadow-md ${
                    outOfStock
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-405 dark:text-slate-600 cursor-not-allowed"
                      : "bg-primary hover:bg-primary-dark text-white shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-0.5"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{outOfStock ? "Out of Stock" : "Add to Cart"}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-sm transition-all duration-300 ${
                    inWish
                      ? "bg-red-500 border-red-500 text-white shadow-md shadow-red-500/10"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-500"
                  }`}
                  title="Add to Wishlist"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>
            </div>

            {/* Extra product features */}
            <div className="grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-850 pt-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <div className="flex items-center space-x-2.5">
                <Truck className="w-4 h-4 text-primary" />
                <span>Free Shipping (+$150)</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Shield className="w-4 h-4 text-secondary" />
                <span>2 Year Warranty</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <RefreshCw className="w-4 h-4 text-accent" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="mt-16 border-t border-slate-250/50 dark:border-slate-800 pt-10 text-left">
        <div className="flex space-x-8 border-b border-slate-200/40 dark:border-slate-850 pb-3">
          {["description", "specifications", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-base font-bold font-sans pb-3 capitalize relative transition-colors ${
                activeTab === tab ? "text-primary" : "text-slate-550 dark:text-slate-450 hover:text-slate-800"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 inset-x-0 h-0.7 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="py-6 max-w-4xl">
          {activeTab === "description" && (
            <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed font-sans">
              {product.description}
            </p>
          )}

          {activeTab === "specifications" && (
            <div className="border border-slate-200/50 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-850 bg-white dark:bg-slate-900 shadow-sm">
              {product.specifications?.map((spec, index) => (
                <div key={index} className="grid grid-cols-3 p-4 text-sm font-sans">
                  <span className="font-bold text-slate-500 dark:text-slate-450">{spec.name}</span>
                  <span className="col-span-2 text-slate-800 dark:text-slate-250 font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white font-sans">
                Customer Feedback ({product.reviews?.length || 0})
              </h3>
              
              <div className="space-y-4">
                {product.reviews?.map((rev, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-900 shadow-sm space-y-2.5"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-slate-800 dark:text-white">{rev.author}</span>
                      <span className="text-xs text-slate-400">{rev.date}</span>
                    </div>
                    
                    <div className="flex text-amber-400 space-x-0.5">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>

                    <p className="text-sm text-slate-550 dark:text-slate-400 italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 space-y-8 text-left border-t border-slate-200/40 dark:border-slate-850 pt-12">
          <h2 className="text-2xl font-extrabold font-sans text-slate-900 dark:text-white">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={() => navigate(`/products/${p.id}`)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
