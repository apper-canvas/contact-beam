import React, { useEffect } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = "md",
  showCloseButton = true 
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 modal-backdrop" 
        onClick={onClose}
      />
      <div className={cn(
        "relative bg-surface rounded-xl shadow-2xl border border-gray-200 w-full transform transition-all duration-200",
        sizes[size]
      )}>
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={20} className="text-gray-500" />
              </button>
            )}
          </div>
        )}
<div className={cn(
          title ? "p-6" : "p-6", 
          "max-h-[90vh] overflow-y-auto"
        )}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;