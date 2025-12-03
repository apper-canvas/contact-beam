import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const StageHeader = ({ stage, dealCount, analytics }) => {
  // Format currency
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  // Get stage color
  const getStageColor = (stageId) => {
    switch (stageId) {
      case 'lead': return 'border-blue-500 bg-blue-50 text-blue-700';
      case 'qualified': return 'border-purple-500 bg-purple-50 text-purple-700';
      case 'proposal': return 'border-orange-500 bg-orange-50 text-orange-700';
      case 'negotiation': return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      case 'closed': return 'border-green-500 bg-green-50 text-green-700';
      default: return 'border-gray-500 bg-gray-50 text-gray-700';
    }
  };

  // Get stage icon
  const getStageIcon = (stageId) => {
    switch (stageId) {
      case 'lead': return 'UserPlus';
      case 'qualified': return 'CheckCircle';
      case 'proposal': return 'FileText';
      case 'negotiation': return 'MessageCircle';
      case 'closed': return 'Trophy';
      default: return 'Circle';
    }
  };

  return (
    <div className={cn(
      "p-4 rounded-t-lg border-t-4 bg-white shadow-sm mb-2",
      getStageColor(stage.id)
    )}>
      {/* Stage Title */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ApperIcon name={getStageIcon(stage.id)} size={20} />
          <h2 className="font-bold text-lg">{stage.name}</h2>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">{dealCount}</span>
          <span className="text-xs opacity-75">deals</span>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        {/* Average Deal Size */}
        <div className="bg-white/50 rounded-lg p-2">
          <div className="flex items-center gap-1 mb-1">
            <ApperIcon name="DollarSign" size={12} />
            <span className="font-medium opacity-75">Avg Size</span>
          </div>
          <div className="font-bold text-sm">
            {formatCurrency(analytics.avgDealSize || 0)}
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white/50 rounded-lg p-2">
          <div className="flex items-center gap-1 mb-1">
            <ApperIcon name="TrendingUp" size={12} />
            <span className="font-medium opacity-75">Convert</span>
          </div>
          <div className="font-bold text-sm">
            {(analytics.conversionRate || 0).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Total Value */}
      <div className="mt-3 pt-3 border-t border-white/30">
        <div className="flex items-center justify-between">
          <span className="text-xs opacity-75">Total Value</span>
          <span className="font-bold text-sm">
            {formatCurrency(analytics.totalValue || 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StageHeader;