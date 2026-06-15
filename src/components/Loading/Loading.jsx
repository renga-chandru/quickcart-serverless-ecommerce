import React from "react";

export const Spinner = ({ size = "md", color = "primary" }) => {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };
  
  const colorClasses = {
    primary: "border-primary border-t-transparent",
    secondary: "border-secondary border-t-transparent",
    accent: "border-accent border-t-transparent",
    white: "border-white border-t-transparent",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`rounded-full animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
      ></div>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-4 animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4"></div>
      {/* Category skeleton */}
      <div className="w-1/3 h-4 bg-slate-200 dark:bg-slate-800 rounded-md mb-2"></div>
      {/* Title skeleton */}
      <div className="w-3/4 h-6 bg-slate-200 dark:bg-slate-800 rounded-md mb-3"></div>
      {/* Rating skeleton */}
      <div className="w-1/2 h-4 bg-slate-200 dark:bg-slate-800 rounded-md mb-4"></div>
      {/* Price and button skeleton */}
      <div className="flex justify-between items-center">
        <div className="w-1/4 h-6 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
        <div className="w-1/3 h-8 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
      </div>
    </div>
  );
};

export const SkeletonDetails = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse max-w-6xl mx-auto px-4 py-8">
      {/* Left: Image gallery skeleton */}
      <div className="space-y-4">
        <div className="w-full h-[400px] bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        <div className="flex space-x-3">
          <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      </div>
      
      {/* Right: Info skeleton */}
      <div className="space-y-6 py-2">
        <div className="space-y-2">
          <div className="w-1/4 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="w-3/4 h-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="w-1/2 h-5 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
        
        <div className="w-1/3 h-8 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <hr className="border-slate-200 dark:border-slate-800" />
        
        <div className="space-y-2">
          <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="w-2/3 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
        
        <div className="flex space-x-4">
          <div className="w-1/2 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="w-1/2 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};
