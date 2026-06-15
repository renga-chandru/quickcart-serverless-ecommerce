import React, { forwardRef } from "react";

export const Input = forwardRef(({
  label,
  type = "text",
  error,
  placeholder,
  className = "",
  containerClassName = "",
  disabled = false,
  required = false,
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col space-y-1.5 w-full text-left ${containerClassName}`}>
      {label && (
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 font-sans flex items-center">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        ref={ref}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-sans disabled:opacity-60 disabled:bg-slate-50 dark:disabled:bg-slate-900/50 ${
          error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs font-medium text-red-500 font-sans">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
