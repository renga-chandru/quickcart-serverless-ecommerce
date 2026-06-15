import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import productService from "../../services/productService";
import CategoryCard from "../../components/CategoryCard/CategoryCard";

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const cats = await productService.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-sans text-slate-900 dark:text-white tracking-tight">
          Explore Product Collections
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          Select a collection below to browse curated, premium serverless products suited for your tech, style, or home space.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-56 bg-slate-100 dark:bg-slate-900 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="relative rounded-3xl overflow-hidden shadow-md group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between h-64 text-left"
            >
              {/* Category card background image */}
              <div className="absolute inset-0 z-0 bg-slate-100 dark:bg-slate-950">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-60 dark:opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              </div>

              {/* Card details */}
              <div className="relative z-10 p-6 flex flex-col justify-between h-full text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-primary px-2.5 py-1 rounded-full w-max shadow-sm">
                  {cat.count} Products Available
                </span>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-sans tracking-tight">{cat.name}</h3>
                  <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                    Premium and high-performing selections from our cloud catalog.
                  </p>
                  <Link
                    to={`/products?category=${cat.name.toLowerCase()}`}
                    className="inline-flex items-center text-xs font-bold text-white hover:text-primary-light transition-colors pt-2 group/btn"
                  >
                    <span>Browse Collection</span>
                    <span className="ml-1 group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
