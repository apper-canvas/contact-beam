import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Tag from "@/components/atoms/Tag";
import Button from "@/components/atoms/Button";
import { format } from "date-fns";

const ContactDetail = ({ contact, onEdit, onDelete }) => {
  if (!contact) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-gray-500">
          <ApperIcon name="Users" size={48} className="mx-auto mb-4 text-gray-400" />
          <p>Select a contact to view details</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
    } catch {
      return "Invalid date";
    }
  };

return (
    <div className="bg-surface rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
<div className="p-4 lg:p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
          <div>
<h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
              {contact.name}
            </h2>
            <p className="text-base lg:text-lg text-secondary">
              {contact.position} at {contact.company}
            </p>
          </div>
<div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto">
            <Button
              variant="secondary"
size="sm"
              icon="Edit"
              onClick={() => onEdit(contact)}
              className="min-h-[44px] justify-center"
            >
              Edit
            </Button>
            <Button
              variant="danger"
size="sm"
              icon="Trash2"
              onClick={() => onDelete(contact)}
              className="min-h-[44px] justify-center"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Contact Information */}
<div className="p-4 lg:p-6 space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Email Address
            </h3>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Mail" size={16} className="text-gray-400" />
              <a 
                href={`mailto:${contact.email}`}
                className="text-primary hover:text-accent transition-colors"
              >
                {contact.email}
              </a>
            </div>
          </div>

          {contact.phone && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Phone Number
              </h3>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Phone" size={16} className="text-gray-400" />
                <a 
                  href={`tel:${contact.phone}`}
                  className="text-primary hover:text-accent transition-colors"
                >
                  {contact.phone}
                </a>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Company
            </h3>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Building" size={16} className="text-gray-400" />
              <span className="text-gray-900">{contact.company}</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Position
            </h3>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Briefcase" size={16} className="text-gray-400" />
              <span className="text-gray-900">{contact.position}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
{contact.tags && contact.tags.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2 lg:gap-3">
              {contact.tags.map((tag, index) => (
                <Tag key={index} label={tag} />
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {contact.notes && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Notes</h3>
<div className="bg-gray-50 rounded-lg p-3 lg:p-4">
              <p className="text-sm lg:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                {contact.notes}
              </p>
            </div>
          </div>
        )}

        {/* Metadata */}
<div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4 text-sm text-gray-500">
            <div>
              <span className="font-medium">Created:</span> {formatDate(contact.createdAt)}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span> {formatDate(contact.updatedAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;