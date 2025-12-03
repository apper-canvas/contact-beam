import React from "react";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ 
  title = "Something went wrong", 
  message = "We encountered an error while loading your contacts. Please try again.",
  onRetry 
}) => {
return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-4 lg:space-y-6 max-w-sm lg:max-w-md mx-auto px-4">
        <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto bg-gradient-to-br from-error/10 to-error/20 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" size={24} className="text-error lg:hidden" />
          <ApperIcon name="AlertTriangle" size={32} className="text-error hidden lg:block" />
        </div>
        
<div className="space-y-2">
          <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">{title}</h2>
          <p className="text-sm lg:text-base text-secondary leading-relaxed">{message}</p>
        </div>

        {onRetry && (
<button
            onClick={onRetry}
            className="inline-flex items-center px-4 lg:px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-lg hover:from-blue-700 hover:to-sky-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl min-h-[44px] text-sm lg:text-base"
          >
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            <span className="hidden sm:inline">Try Again</span>
            <span className="sm:hidden">Retry</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorView;