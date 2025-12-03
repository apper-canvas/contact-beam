import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search contacts...",
  className 
}) => {
return (
    <div className={cn("relative w-full", className)}>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
        <ApperIcon name="Search" size={16} className="text-gray-400 lg:hidden" />
        <ApperIcon name="Search" size={18} className="text-gray-400 hidden lg:block" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 lg:pl-10 pr-10 lg:pr-4 py-2 lg:py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 placeholder:text-gray-500 text-sm lg:text-base min-h-[44px]"
      />
{value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2 lg:right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Clear search"
        >
          <ApperIcon name="X" size={14} className="text-gray-400 lg:hidden" />
          <ApperIcon name="X" size={16} className="text-gray-400 hidden lg:block" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;