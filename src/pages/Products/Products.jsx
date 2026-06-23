import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Grid, List, SlidersHorizontal, Search } from "lucide-react";
import productService from "../../services/productService";
import ProductCard from "../../components/ProductCard/ProductCard";
import Filters from "../../components/Filters/Filters";
import Pagination from "../../components/Pagination/Pagination";
import { SkeletonCard } from "../../components/Loading/Loading";
import EmptyState from "../../components/EmptyState/EmptyState";
import Modal from "../../components/Modal/Modal";
import { Star, Heart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Search/Filters State
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [priceRange, setPriceRange] = useState(1500);
  const [rating, setRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  
  // View states
  const [page, setPage] = useState(1);
  const [isGridView, setIsGridView] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // Data states
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 8, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);

  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewQty, setQuickViewQty] = useState(1);

  // Sync state from query parameters
  useEffect(() => {
    const qCategory = searchParams.get("category");
    const qSearch = searchParams.get("search");
    
    if (qCategory) setCategory(qCategory);
    if (qSearch) setSearch(qSearch);
  }, [searchParams]);

  // Fetch products when filters or page change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const result = await productService.getProducts({
          category,
          search,
          maxPrice: priceRange,
          rating,
          inStockOnly,
          sortBy,
          page,
          limit: 8,
        });
        setProducts(result.products);
        setPagination(result.pagination);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [category, search, priceRange, rating, inStockOnly, sortBy, page]);

  const handleClearFilters = () => {
    setCategory("all");
    setSearch("");
    setPriceRange(1500);
    setRating(0);
    setInStockOnly(false);
    setSortBy("popular");
    setPage(1);
    setSearchParams({});
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-6 mb-8 text-left">
        <div>
          <h1 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white">
            Explore All Products
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Displaying {loading ? "..." : products.length} of {loading ? "..." : pagination.totalItems} products found
          </p>
        </div>

        {/* View Controls & Mobile Filters Toggle */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="flex md:hidden items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 text-sm font-semibold transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <div className="flex items-center space-x-2 border border-slate-200 dark:border-slate-800 rounded-xl p-1 bg-white dark:bg-slate-900">
            <button
              onClick={() => setIsGridView(true)}
              className={`p-1.5 rounded-lg transition-colors ${
                isGridView
                  ? "bg-primary dark:bg-white text-white dark:text-black"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsGridView(false)}
              className={`p-1.5 rounded-lg transition-colors ${
                !isGridView
                  ? "bg-primary dark:bg-white text-white dark:text-black"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left: Filters (Desktop) */}
        <div className="hidden lg:block lg:col-span-1">
          <Filters
            selectedCategory={category}
            setSelectedCategory={(cat) => {
              setCategory(cat);
              setPage(1);
            }}
            search={search}
            setSearch={(val) => {
              setSearch(val);
              setPage(1);
            }}
            priceRange={priceRange}
            setPriceRange={(val) => {
              setPriceRange(val);
              setPage(1);
            }}
            selectedRating={rating}
            setSelectedRating={(val) => {
              setRating(val);
              setPage(1);
            }}
            inStockOnly={inStockOnly}
            setInStockOnly={(val) => {
              setInStockOnly(val);
              setPage(1);
            }}
            sortBy={sortBy}
            setSortBy={(val) => {
              setSortBy(val);
              setPage(1);
            }}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Right: Products Grid / List */}
        <div className="lg:col-span-3 space-y-8 text-left">
          {/* Main search inline for products page */}
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by keyword..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-sans"
            />
            <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon="Search"
              title="No products match your filters"
              description="Try adjusting your keywords, price ranges, or selected category filters to discover more items."
              actionText="Clear All Filters"
              onActionClick={handleClearFilters}
            />
          ) : isGridView ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onQuickView={handleQuickView} />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {products.map((product) => {
                const hasDiscount = product.discount > 0;
                const finalPrice = product.price * (1 - (product.discount || 0) / 100);
                const outOfStock = product.stock <= 0;
                const inWish = isInWishlist(product.id);

                return (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 gap-6 relative overflow-hidden"
                  >
                    {/* Image */}
                    <div className="relative w-full sm:w-48 aspect-square rounded-2xl bg-slate-50 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                      <img
                        src={product.images?.[0] || product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {hasDiscount && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-grow flex flex-col justify-between py-1 text-left">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            {product.category}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
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
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 hover:text-primary transition-colors font-sans">
                          {product.name}
                        </h3>
                        <p className="text-sm text-slate-550 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                        
                        {/* Rating */}
                        <div className="flex items-center mt-3 text-sm">
                          <Star className="w-4 h-4 text-amber-450 fill-current mr-1" />
                          <span className="font-bold text-slate-700 dark:text-slate-350">{product.rating}</span>
                          <span className="text-xs text-slate-450 dark:text-slate-550 ml-1.5">
                            ({product.reviews?.length || 0} reviews)
                          </span>
                        </div>
                      </div>

                      {/* Pricing and Actions */}
                      <div className="flex flex-wrap items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-850 gap-4">
                        <div className="flex items-baseline space-x-2">
                          {hasDiscount ? (
                            <>
                              <span className="text-xl font-black text-slate-900 dark:text-white font-sans">
                                ${finalPrice.toFixed(2)}
                              </span>
                              <span className="text-xs text-slate-400 line-through">
                                ${product.price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-xl font-black text-slate-900 dark:text-white font-sans">
                              ${product.price.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuickView(product)}
                            className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-755 dark:text-slate-350 rounded-xl text-sm font-semibold transition-colors"
                          >
                            Quick View
                          </button>
                          
                          <button
                            onClick={() => !outOfStock && addToCart(product, 1)}
                            disabled={outOfStock}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                              outOfStock
                                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                                : "bg-primary dark:bg-black text-white dark:text-white dark:border dark:border-white hover:bg-primary-dark dark:hover:bg-neutral-900/50 shadow-md shadow-primary/10 dark:shadow-none"
                            }`}
                          >
                            Add to Cart
                          </button>

                          <button
                            onClick={() => toggleWishlist(product)}
                            className={`p-2 rounded-xl border shadow-sm transition-all duration-300 ${
                              inWish
                                ? "bg-red-500 border-red-500 text-white"
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-500"
                            }`}
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination controls */}
          {!loading && products.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              onPageChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <Modal
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        title="Filter & Sort"
        size="md"
      >
        <Filters
          selectedCategory={category}
          setSelectedCategory={(cat) => {
            setCategory(cat);
            setPage(1);
            setIsMobileFiltersOpen(false);
          }}
          search={search}
          setSearch={(val) => {
            setSearch(val);
            setPage(1);
          }}
          priceRange={priceRange}
          setPriceRange={(val) => {
            setPriceRange(val);
            setPage(1);
          }}
          selectedRating={rating}
          setSelectedRating={(val) => {
            setRating(val);
            setPage(1);
          }}
          inStockOnly={inStockOnly}
          setInStockOnly={(val) => {
            setInStockOnly(val);
            setPage(1);
          }}
          sortBy={sortBy}
          setSortBy={(val) => {
            setSortBy(val);
            setPage(1);
          }}
          onClearFilters={() => {
            handleClearFilters();
            setIsMobileFiltersOpen(false);
          }}
        />
      </Modal>

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
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                    {quickViewProduct.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      quickViewProduct.stock <= 0
                        ? "bg-red-500/10 text-red-500"
                        : quickViewProduct.stock < 5
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-emerald-500/10 text-emerald-500"
                    }`}
                  >
                    {quickViewProduct.stock <= 0 ? "Out of Stock" : quickViewProduct.stock < 5 ? `Only ${quickViewProduct.stock} Left` : "In Stock"}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-sans">
                  {quickViewProduct.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center mt-2 text-sm">
                  <Star className="w-4 h-4 text-amber-450 fill-current mr-1.5" />
                  <span className="font-bold text-slate-700 dark:text-slate-305">{quickViewProduct.rating}</span>
                  <span className="text-slate-400 ml-1.5">({quickViewProduct.reviews?.length} reviews)</span>
                </div>
                
                {/* Description */}
                <p className="text-sm text-slate-550 dark:text-slate-400 mt-3 leading-relaxed">
                  {quickViewProduct.description}
                </p>
              </div>

              {/* Price & Quantity & Actions */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-850">
                <div className="flex justify-between items-center">
                  <div className="text-left flex flex-col">
                    <span className="text-xs text-slate-400">Total Price</span>
                    <p className="text-2xl font-black text-slate-900 dark:text-white font-sans">
                      ${(quickViewProduct.price * (1 - (quickViewProduct.discount || 0) / 100)).toFixed(2)}
                    </p>
                    {quickViewProduct.stock > 0 && (
                      <span className="text-[10px] font-bold text-amber-500 mt-1">
                        Only {quickViewProduct.stock} available.
                      </span>
                    )}
                  </div>
                  
                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-200 dark:border-slate-850 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900">
                    <button
                      onClick={() => setQuickViewQty((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 hover:bg-slate-205 dark:hover:bg-slate-800 font-bold transition-colors text-slate-600 dark:text-slate-350"
                    >
                      -
                    </button>
                    <span className="px-4 font-bold text-sm text-slate-800 dark:text-white">{quickViewQty}</span>
                    <button
                      onClick={() => setQuickViewQty((q) => q + 1)}
                      disabled={quickViewQty >= quickViewProduct.stock || quickViewProduct.stock <= 0}
                      className={`px-3 py-1.5 font-bold transition-colors text-slate-600 dark:text-slate-350 ${
                        quickViewQty >= quickViewProduct.stock || quickViewProduct.stock <= 0
                          ? "bg-slate-100 dark:bg-slate-800/50 text-slate-400 cursor-not-allowed"
                          : "hover:bg-slate-205 dark:hover:bg-slate-800"
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleQuickAddToCart}
                    disabled={quickViewProduct.stock <= 0}
                    className={`w-full py-3 rounded-xl font-bold shadow-md transition-all duration-300 ${
                        quickViewProduct.stock <= 0
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-405 dark:text-slate-600 cursor-not-allowed"
                          : "bg-primary dark:bg-black text-white dark:text-white dark:border dark:border-white hover:bg-primary-dark dark:hover:bg-neutral-900/50 shadow-primary/10 dark:shadow-none hover:shadow-primary/20"
                      }`}
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
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-755 dark:text-slate-300"
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

export default Products;
