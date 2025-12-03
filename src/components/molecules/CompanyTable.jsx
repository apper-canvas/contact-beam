import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const CompanyTable = ({ companies, onSort, sortConfig, onCompanySelect }) => {
  const SortButton = ({ column, children }) => (
    <button
      onClick={() => onSort(column)}
      className="flex items-center space-x-1 text-left font-medium text-gray-900 hover:text-primary transition-colors"
    >
      <span>{children}</span>
      <div className="flex flex-col">
        <ApperIcon 
          name="ChevronUp" 
          size={12} 
          className={cn(
            "transition-colors",
            sortConfig.key === column && sortConfig.direction === 'asc' 
              ? "text-primary" 
              : "text-gray-300"
          )}
        />
        <ApperIcon 
          name="ChevronDown" 
          size={12} 
          className={cn(
            "transition-colors -mt-1",
            sortConfig.key === column && sortConfig.direction === 'desc' 
              ? "text-primary" 
              : "text-gray-300"
          )}
        />
      </div>
    </button>
  );

  const formatEmployeeCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ApperIcon name="Building" size={48} className="text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <SortButton column="name">Company Name</SortButton>
                </th>
                <th className="px-6 py-3 text-left">
                  <SortButton column="industry">Industry</SortButton>
                </th>
                <th className="px-6 py-3 text-left">
                  <SortButton column="location">Location</SortButton>
                </th>
                <th className="px-6 py-3 text-left">
                  <SortButton column="employeeCount">Employees</SortButton>
                </th>
                <th className="px-6 py-3 text-left">Contact</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {companies.map((company) => (
                <tr
                  key={company.Id}
                  onClick={() => onCompanySelect(company)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                          <ApperIcon name="Building" size={20} className="text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{company.name}</div>
                        <div className="text-sm text-gray-500">{company.website}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {company.industry}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <ApperIcon name="MapPin" size={14} className="text-gray-400 mr-1" />
                      {company.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <ApperIcon name="Users" size={14} className="text-gray-400 mr-1" />
                      {formatEmployeeCount(company.employeeCount)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <a
                        href={`mailto:${company.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        <ApperIcon name="Mail" size={16} />
                      </a>
                      <a
                        href={`tel:${company.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        <ApperIcon name="Phone" size={16} />
                      </a>
                      <a
                        href={`https://${company.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        <ApperIcon name="ExternalLink" size={16} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 p-4">
        {companies.map((company) => (
          <div
            key={company.Id}
            onClick={() => onCompanySelect(company)}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Building" size={24} className="text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {company.name}
                </h3>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Tag" size={14} className="text-gray-400 mr-1" />
                    {company.industry}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="MapPin" size={14} className="text-gray-400 mr-1" />
                    {company.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Users" size={14} className="text-gray-400 mr-1" />
                    {formatEmployeeCount(company.employeeCount)} employees
                  </div>
                </div>
                <div className="mt-3 flex items-center space-x-4">
                  <a
                    href={`mailto:${company.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    <ApperIcon name="Mail" size={16} />
                  </a>
                  <a
                    href={`tel:${company.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    <ApperIcon name="Phone" size={16} />
                  </a>
                  <a
                    href={`https://${company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    <ApperIcon name="ExternalLink" size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyTable;