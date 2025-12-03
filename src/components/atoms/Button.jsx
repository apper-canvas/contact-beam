import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  icon,
  loading = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-accent text-white hover:from-blue-700 hover:to-sky-600 transform hover:scale-105 shadow-lg hover:shadow-xl",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md",
    outline: "bg-transparent text-primary border border-primary hover:bg-primary hover:text-white shadow-sm hover:shadow-md",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:from-red-600 hover:to-red-700 transform hover:scale-105 shadow-lg hover:shadow-xl",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
      )}
      {icon && !loading && (
        <ApperIcon name={icon} size={16} className="mr-2" />
      )}
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;