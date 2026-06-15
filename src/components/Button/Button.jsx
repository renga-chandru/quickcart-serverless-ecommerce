import React from "react";
import { Loader2 } from "lucide-react";

export const Button = ({
  children,
  type = "button",
  variant = "primary", // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = "md", // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  className = "",
  icon: Icon,
  iconPosition = "left", // 'left' | 'right'
  onClick,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-sans font-medium rounded-xl transition-all duration-300 transform active:scale-[0.98] outline-none disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/10 hover:shadow-primary/20",
    secondary: "bg-gradient-to-r from-primary to-secondary text-white hover:brightness-105 shadow-md shadow-secondary/10",
    outline: "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/10",
    ghost: "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-6 py-3 text-lg rounded-2xl",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      
      {!isLoading && Icon && iconPosition === "left" && (
        <Icon className="w-4 h-4 mr-2" />
      )}
      
      <span>{children}</span>
      
      {!isLoading && Icon && iconPosition === "right" && (
        <Icon className="w-4 h-4 ml-2" />
      )}
    </button>
  );
};

export default Button;
