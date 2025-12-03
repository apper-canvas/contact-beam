import React from "react";
import ApperIcon from "@/components/ApperIcon";

const SortFilter = ({ sortBy, onSortChange, className }) => {
  const sortOptions = [
    { value: "name", label: "Name (A-Z)" },
    { value: "company", label: "Company (A-Z)" },
    { value: "updated", label: "Recently Updated" },
    { value: "created", label: "Recently Added" }
  ];

  return (
    <div className={className}>
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ApperIcon name="ChevronDown" size={16} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default SortFilter;