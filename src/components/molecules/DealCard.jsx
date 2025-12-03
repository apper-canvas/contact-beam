import React, { useState } from 'react';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const DealCard = ({ deal, onEdit, onDelete, onView, isDragging = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Get priority icon
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'Clock';
      case 'low': return 'CheckCircle';
      default: return 'Circle';
    }
  };

  return (
    <div
      className={cn(
        "deal-card group relative bg-white rounded-lg shadow-sm border border-gray-200",
        "transition-all duration-200 cursor-grab active:cursor-grabbing",
        "hover:shadow-lg hover:-translate-y-1",
        isDragging && "shadow-xl rotate-3 scale-105",
        `border-l-4 ${deal.ageColor === 'deal-age-new' ? 'border-l-green-500' : 
          deal.ageColor === 'deal-age-aging' ? 'border-l-yellow-500' : 'border-l-red-500'}`
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Quick Actions - Show on Hover */}
      <div
        className={cn(
          "absolute -top-2 -right-2 flex items-center gap-1 transition-all duration-200",
          isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(deal);
          }}
          className="p-1.5 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          title="View Deal"
        >
          <ApperIcon name="Eye" size={12} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(deal);
          }}
          className="p-1.5 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
          title="Edit Deal"
        >
          <ApperIcon name="Edit" size={12} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(deal);
          }}
          className="p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
          title="Delete Deal"
        >
          <ApperIcon name="Trash2" size={12} />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
            {deal.title}
          </h3>
          <div className={cn(
            "px-2 py-1 rounded-full text-xs font-medium border shrink-0",
            getPriorityColor(deal.priority)
          )}>
            <div className="flex items-center gap-1">
              <ApperIcon name={getPriorityIcon(deal.priority)} size={10} />
              <span className="capitalize">{deal.priority}</span>
            </div>
          </div>
        </div>

        {/* Company & Contact */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ApperIcon name="Building" size={14} />
            <span className="truncate">{deal.company}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ApperIcon name="User" size={14} />
            <span className="truncate">{deal.contact}</span>
          </div>
        </div>

        {/* Value */}
        <div className="mb-3">
          <div className="text-lg font-bold text-green-600">
            {formatCurrency(deal.value)}
          </div>
        </div>

        {/* Description */}
        {deal.description && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 line-clamp-2">
              {deal.description}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {/* Expected Close Date */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <ApperIcon name="Calendar" size={12} />
            <span>{format(new Date(deal.expectedCloseDate), 'MMM dd')}</span>
          </div>

          {/* Deal Age Indicator */}
          <div className="flex items-center gap-1">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                deal.age === 'new' && "bg-green-500",
                deal.age === 'aging' && "bg-yellow-500",
                deal.age === 'stale' && "bg-red-500"
              )}
            />
            <span className="text-xs text-gray-500 capitalize">{deal.age}</span>
          </div>
        </div>
      </div>

      {/* Drag Handle Indicator */}
      <div className="absolute top-2 left-2 opacity-20 group-hover:opacity-40 transition-opacity">
        <ApperIcon name="GripVertical" size={16} className="text-gray-400" />
      </div>
    </div>
  );
};

export default DealCard;