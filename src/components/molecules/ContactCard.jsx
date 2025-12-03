import React from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Tag from "@/components/atoms/Tag";
import { cn } from "@/utils/cn";

const ContactCard = ({ 
  contact, 
  isSelected = false, 
  onClick, 
  className 
}) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return "Invalid date";
    }
  };

return (
    <div
      onClick={() => onClick(contact)}
      className={cn(
        "bg-surface p-4 lg:p-6 rounded-lg border cursor-pointer contact-card-hover transition-all duration-200 min-h-[120px] touch-manipulation",
        isSelected ? "border-primary ring-2 ring-primary ring-opacity-20 shadow-lg" : "border-gray-200 shadow-sm",
        className
      )}
    >
      {/* Header */}
<div className="flex items-start justify-between mb-3 gap-2">
        <div className="min-w-0 flex-1">
<h3 className="font-semibold text-gray-900 text-base lg:text-lg mb-1 truncate">
            {contact.name}
          </h3>
          <p className="text-secondary text-sm lg:text-base truncate">
            {contact.position} at {contact.company}
          </p>
        </div>
<div className="text-xs text-gray-400 flex-shrink-0">
          {formatDate(contact.updatedAt)}
        </div>
      </div>

<div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600 min-h-[20px]">
          <ApperIcon name="Mail" size={14} className="mr-2 text-gray-400 flex-shrink-0" />
          <span className="truncate">{contact.email}</span>
        </div>
{contact.phone && (
<div className="flex items-center text-sm text-gray-600 min-h-[20px]">
            <ApperIcon name="Phone" size={14} className="mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{contact.phone}</span>
          </div>
        )}
      </div>

      {/* Tags */}
{contact.tags && contact.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 lg:gap-2 mb-3">
          {contact.tags.slice(0, 3).map((tag, index) => (
            <Tag key={index} label={tag} />
          ))}
{contact.tags.length > 3 && (
            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
              +{contact.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Notes Preview */}
{contact.notes && (
        <p className="text-xs lg:text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {contact.notes}
        </p>
      )}
    </div>
  );
};

export default ContactCard;