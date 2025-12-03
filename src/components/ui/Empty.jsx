import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No contacts found", 
  message = "Get started by adding your first contact to begin organizing your professional network.",
  actionLabel = "Add Your First Contact",
  onAction 
}) => {
return (
    <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
      <div className="text-center space-y-4 lg:space-y-6 max-w-sm lg:max-w-md px-4">
        <div className="w-16 h-16 lg:w-24 lg:h-24 mx-auto bg-gradient-to-br from-primary/10 to-accent/20 rounded-full flex items-center justify-center">
          <ApperIcon name="Users" size={28} className="text-primary lg:hidden" />
          <ApperIcon name="Users" size={40} className="text-primary hidden lg:block" />
        </div>
        
<div className="space-y-2">
          <h3 className="text-lg lg:text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-sm lg:text-base text-secondary leading-relaxed">{message}</p>
        </div>

        {onAction && (
<button
            onClick={onAction}
            className="inline-flex items-center px-4 lg:px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-lg hover:from-blue-700 hover:to-sky-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl min-h-[44px] text-sm lg:text-base"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            <span className="hidden sm:inline">{actionLabel}</span>
            <span className="sm:hidden">Add Contact</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Empty;