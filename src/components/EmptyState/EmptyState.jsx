import React from "react";
import * as Icons from "lucide-react";
import { Link } from "react-router-dom";

export const EmptyState = ({
  icon = "ShoppingBag",
  title = "Your wishlist is empty",
  description = "Explore our latest catalogue and find products you love.",
  actionText = "Continue Shopping",
  actionLink = "/products",
  onActionClick
}) => {
  const LucideIcon = Icons[icon] || Icons.ShoppingBag;

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 py-16 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl max-w-lg mx-auto shadow-md">
      <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-6">
        <LucideIcon className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-bold font-sans text-slate-800 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 leading-relaxed">
        {description}
      </p>
      
      {onActionClick ? (
        <button
          onClick={onActionClick}
          className="px-6 py-3 bg-primary dark:bg-black hover:bg-primary-dark dark:hover:bg-neutral-900/50 text-white dark:text-white dark:border dark:border-white rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5"
        >
          {actionText}
        </button>
      ) : (
        <Link
          to={actionLink}
          className="px-6 py-3 bg-primary dark:bg-black hover:bg-primary-dark dark:hover:bg-neutral-900/50 text-white dark:text-white dark:border dark:border-white rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 block text-center"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
