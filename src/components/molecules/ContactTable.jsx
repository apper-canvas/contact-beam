import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Tag from '@/components/atoms/Tag';
import Button from '@/components/atoms/Button';
import { format } from 'date-fns';

const ContactTable = ({ contact, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

if (!contact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center space-y-4 p-4 lg:p-8">
          <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={24} className="text-gray-400 lg:hidden" />
            <ApperIcon name="User" size={32} className="text-gray-400 hidden lg:block" />
          </div>
          <div>
            <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">No Contact Selected</h3>
            <p className="text-sm lg:text-base text-gray-500">Select a contact from the list to view details</p>
          </div>
        </div>
      </div>
    );
  }

  const contactFields = [
    { label: 'Name', value: contact.name, icon: 'User' },
    { label: 'Email', value: contact.email, icon: 'Mail' },
    { label: 'Phone', value: contact.phone, icon: 'Phone' },
    { label: 'Company', value: contact.company, icon: 'Building' },
    { label: 'Position', value: contact.position, icon: 'Briefcase' },
    { label: 'Location', value: contact.location, icon: 'MapPin' },
    { label: 'Notes', value: contact.notes, icon: 'FileText' },
    { label: 'Created', value: formatDate(contact.createdAt), icon: 'Calendar' },
    { label: 'Updated', value: formatDate(contact.updatedAt), icon: 'Clock' }
  ];

return (
    <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 lg:px-6 py-3 lg:py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{contact.name}</h2>
              <p className="text-sm text-gray-500">{contact.company} • {contact.position}</p>
            </div>
</div>
          <div className="flex items-center space-x-2 w-full lg:w-auto justify-end">
            <Button
              variant="outline"
size="sm"
              onClick={() => onEdit(contact)}
              className="flex items-center space-x-1 min-h-[44px] px-3"
            >
              <ApperIcon name="Edit" size={16} />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <Button
              variant="outline"
size="sm"
              onClick={() => onDelete(contact)}
              className="flex items-center space-x-1 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 min-h-[44px] px-3"
            >
              <ApperIcon name="Trash2" size={16} />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Tags Section */}
{contact.tags && contact.tags.length > 0 && (
        <div className="px-4 lg:px-6 py-3 bg-blue-50 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Tag" size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Tags:</span>
<div className="flex flex-wrap gap-1 lg:gap-2">
              {contact.tags.map((tag, index) => (
                <Tag key={index} text={tag} size="sm" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contact Information Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
<th className="text-left py-2 lg:py-3 px-4 lg:px-6 text-xs lg:text-sm font-semibold text-gray-900 w-24 lg:w-32">Field</th>
              <th className="text-left py-2 lg:py-3 px-4 lg:px-6 text-xs lg:text-sm font-semibold text-gray-900">Information</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {contactFields.map((field, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
<td className="py-3 lg:py-4 px-4 lg:px-6 border-r border-gray-200 bg-gray-25">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name={field.icon} size={16} className="text-gray-500" />
<span className="text-xs lg:text-sm font-medium text-gray-700">{field.label}</span>
                  </div>
                </td>
<td className="py-3 lg:py-4 px-4 lg:px-6">
<div className="text-xs lg:text-sm text-gray-900 break-words">
                    {field.value ? (
                      field.label === 'Notes' ? (
<div className="max-w-full lg:max-w-2xl whitespace-pre-wrap">{field.value}</div>
                      ) : field.label === 'Email' ? (
                        <a
                          href={`mailto:${field.value}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {field.value}
                        </a>
                      ) : field.label === 'Phone' ? (
                        <a
                          href={`tel:${field.value}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {field.value}
                        </a>
                      ) : (
                        field.value
                      )
                    ) : (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
<div className="px-4 lg:px-6 py-3 bg-gray-50 border-t border-gray-200">
<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-1 lg:gap-0 text-xs text-gray-500">
          <span>Contact ID: {contact.id}</span>
          <span>Last updated: {formatDate(contact.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ContactTable;