import React from "react";
import { Star, RotateCcw } from "lucide-react";
import { CATEGORIES } from "../../constants/data";

export const Filters = ({
  selectedCategory,
  setSelectedCategory,
  search,
  setSearch,
  priceRange,
  setPriceRange,
  selectedRating,
  setSelectedRating,
  inStockOnly,
  setInStockOnly,
  sortBy,
  setSortBy,
  onClearFilters,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 space-y-6 shadow-sm w-full">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-lg font-bold font-sans text-slate-850 dark:text-white">
          Filters
        </h3>
        <button
          onClick={onClearFilters}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary flex items-center font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset All
        </button>
      </div>

      {/* Categories Filter */}
      <div>
        <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3 font-sans">
          Category
        </h4>
        <div className="flex flex-wrap gap-2 md:flex-col md:gap-1.5">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-xl text-sm text-left transition-all duration-300 font-medium ${
              selectedCategory === "all"
                ? "bg-primary dark:bg-white text-white dark:text-black"
                : "text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/50"
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-xl text-sm text-left transition-all duration-300 font-medium ${
                selectedCategory.toLowerCase() === cat.name.toLowerCase()
                  ? "bg-primary dark:bg-white text-white dark:text-black"
                  : "text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3 font-sans">
          Max Price (₹{priceRange})
        </h4>
        <input
          type="range"
          min="0"
          max="1500"
          step="25"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 font-semibold mt-2">
          <span>₹0</span>
          <span>₹1500</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3 font-sans">
          Minimum Rating
        </h4>
        <div className="flex flex-col space-y-1.5">
          {[4.5, 4.0, 3.5].map((val) => (
            <button
              key={val}
              onClick={() => setSelectedRating(val)}
              className={`flex items-center text-sm px-3 py-1.5 rounded-xl transition-all duration-300 font-medium text-left ${
                selectedRating === val
                  ? "bg-primary dark:bg-white text-white dark:text-black"
                  : "text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center text-amber-450 mr-1.5">
                <Star className={`w-4 h-4 fill-current ${selectedRating === val ? "text-white dark:text-black" : "text-amber-450"}`} />
              </div>
              <span className={selectedRating === val ? "text-white dark:text-black" : "text-slate-700 dark:text-slate-300"}>
                {val} Stars & Up
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="pt-2">
        <label className="flex items-center space-x-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4.5 h-4.5 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary accent-primary"
          />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">
            In Stock Only
          </span>
        </label>
      </div>

      {/* Sort By (visible on sidebar for mobile compatibility) */}
      <div>
        <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3 font-sans">
          Sort By
        </h4>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
        >
          <option value="popular">Popularity (Default)</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest Releases</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
