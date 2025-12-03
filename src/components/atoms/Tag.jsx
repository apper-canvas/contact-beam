import React from "react";
import { cn } from "@/utils/cn";
import { getTagColor } from "@/services/api/tagService";

const Tag = ({ label, className, removable = false, onRemove, ...props }) => {
  const tagColor = getTagColor(label);
  
  const style = {
    backgroundColor: `${tagColor}15`,
    color: tagColor,
    borderColor: `${tagColor}30`
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border tag-chip transition-all duration-200 hover:shadow-sm",
        className
      )}
      style={style}
      {...props}
    >
      {label}
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(label);
          }}
          className="ml-1.5 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
};

export default Tag;