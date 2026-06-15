import React from "react";
import * as Icons from "lucide-react";
import { Link } from "react-router-dom";

export const CategoryCard = ({ category }) => {
  // Map string icon name to Lucide React component
  const LucideIcon = Icons[category.icon] || Icons.Grid;

  return (
    <Link
      to={`/products?category=${category.name.toLowerCase()}`}
      className="group relative flex flex-col items-center p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
    >
      {/* Background Gradient Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Icon Container */}
      <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 group-hover:bg-primary/10 group-hover:text-primary text-slate-600 dark:text-slate-300 flex items-center justify-center mb-4 transition-all duration-300 shadow-inner">
        <LucideIcon className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
      </div>

      {/* Category Name */}
      <h3 className="text-base font-bold font-sans text-slate-800 dark:text-white group-hover:text-primary transition-colors duration-300">
        {category.name}
      </h3>

      {/* Category Count */}
      <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">
        {category.count} Products
      </span>
    </Link>
  );
};

export default CategoryCard;
