import React, { useEffect, useState } from "react";
import { companyService } from "@/services/api/companyService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Textarea from "@/components/atoms/Textarea";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ConfirmDialog from "@/components/molecules/ConfirmDialog";

const CompanyModal = ({ isOpen, onClose, company, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: '',
    employeeCount: '',
    email: '',
    phone: '',
    website: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  // Update form data when company changes
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        industry: company.industry || '',
        location: company.location || '',
        employeeCount: company.employeeCount?.toString() || '',
        email: company.email || '',
        phone: company.phone || '',
        website: company.website || '',
        description: company.description || ''
      });
    }
  }, [company]);

  if (!company) return null;

  const formatEmployeeCount = (count) => {
    return count.toLocaleString();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Company name is required';
    if (!formData.industry.trim()) newErrors.industry = 'Industry is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.website.trim()) newErrors.website = 'Website is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    const employeeCount = parseInt(formData.employeeCount);
    if (!formData.employeeCount.trim()) {
      newErrors.employeeCount = 'Employee count is required';
    } else if (isNaN(employeeCount) || employeeCount < 1) {
      newErrors.employeeCount = 'Employee count must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const updatedData = {
        ...formData,
        employeeCount: parseInt(formData.employeeCount)
      };
      
      const updatedCompany = await companyService.update(company.Id, updatedData);
      
      // Call parent's onEdit handler to update the company in parent state
      if (onEdit) {
        onEdit(updatedCompany);
      }
      
      setIsEditing(false);
      toast.success('Company updated successfully');
    } catch (error) {
      toast.error(`Failed to update company: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original company data
    setFormData({
      name: company.name || '',
      industry: company.industry || '',
      location: company.location || '',
      employeeCount: company.employeeCount?.toString() || '',
      email: company.email || '',
      phone: company.phone || '',
      website: company.website || '',
      description: company.description || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await companyService.delete(company.Id);
      
      // Call parent's onDelete handler
      if (onDelete) {
        onDelete(company);
      }
      
      setShowDeleteDialog(false);
      onClose();
      toast.success('Company deleted successfully');
    } catch (error) {
      toast.error(`Failed to delete company: ${error.message}`);
    } finally {
      setLoading(false);
    }
};
  return (
<>
      <Modal 
        isOpen={isOpen} 
        onClose={() => {
          // If editing, discard changes and reset form
          if (isEditing) {
            setFormData({
              name: company.name || '',
              industry: company.industry || '',
              location: company.location || '',
              employeeCount: company.employeeCount?.toString() || '',
              email: company.email || '',
              phone: company.phone || '',
              website: company.website || '',
              description: company.description || ''
            });
            setErrors({});
            setIsEditing(false);
          }
          onClose();
        }} 
        title={isEditing ? "Edit Company" : company.name}
        size="lg"
      >
        <div className="space-y-6">
          {/* Action Buttons */}
          {!isEditing && (
            <div className="flex justify-end space-x-3 pb-4 border-b border-gray-200">
              <Button
                variant="secondary"
                icon="Edit"
                onClick={() => setIsEditing(true)}
                disabled={loading}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                icon="Trash2"
                onClick={handleDelete}
                disabled={loading}
              >
                Delete
              </Button>
            </div>
          )}

          {isEditing && (
            <div className="flex justify-end space-x-3 pb-4 border-b border-gray-200">
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                icon="Save"
                onClick={handleSave}
                loading={loading}
              >
                Save Changes
              </Button>
            </div>
          )}

          {/* Company Header */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                <ApperIcon name="Building" size={32} className="text-white" />
              </div>
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Company name"
                    error={errors.name}
                    className="text-xl font-bold"
                  />
                  {errors.name && <p className="text-sm text-error">{errors.name}</p>}
                </div>
              ) : (
                <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
              )}
              
              <div className="mt-2 flex flex-wrap items-center gap-4">
                {isEditing ? (
                  <div className="flex-1 min-w-0">
                    <Input
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      placeholder="Industry"
                      error={errors.industry}
                    />
                    {errors.industry && <p className="text-sm text-error mt-1">{errors.industry}</p>}
                  </div>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {company.industry}
                  </span>
                )}
                
                {!isEditing && (
                  <>
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="MapPin" size={16} className="text-gray-400 mr-1" />
                      {company.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="Users" size={16} className="text-gray-400 mr-1" />
                      {formatEmployeeCount(company.employeeCount)} employees
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Company Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Company description"
                  error={errors.description}
                  rows={4}
                />
                {errors.description && <p className="text-sm text-error">{errors.description}</p>}
              </div>
            ) : (
              <p className="text-gray-700 leading-relaxed">{company.description}</p>
            )}
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="company@example.com"
                    error={errors.email}
                  />
                  {errors.email && <p className="text-sm text-error mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    error={errors.phone}
                  />
                  {errors.phone && <p className="text-sm text-error mt-1">{errors.phone}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <Input
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="www.company.com"
                    error={errors.website}
                  />
                  {errors.website && <p className="text-sm text-error mt-1">{errors.website}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, Country"
                    error={errors.location}
                  />
                  {errors.location && <p className="text-sm text-error mt-1">{errors.location}</p>}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee Count</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.employeeCount}
                    onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                    placeholder="100"
                    error={errors.employeeCount}
                  />
                  {errors.employeeCount && <p className="text-sm text-error mt-1">{errors.employeeCount}</p>}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Mail" size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <a 
                      href={`mailto:${company.email}`}
                      className="text-sm text-primary hover:text-primary/80 transition-colors truncate block"
                    >
                      {company.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Phone" size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <a 
                      href={`tel:${company.phone}`}
                      className="text-sm text-primary hover:text-primary/80 transition-colors truncate block"
                    >
                      {company.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Globe" size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Website</p>
                    <a 
                      href={`https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary/80 transition-colors truncate block flex items-center"
                    >
                      {company.website}
                      <ApperIcon name="ExternalLink" size={12} className="ml-1" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name="MapPin" size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Location</p>
                    <p className="text-sm text-gray-700 truncate">{company.location}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Company Stats */}
          {!isEditing && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Company Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Users" size={20} className="text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Team Size</p>
                      <p className="text-lg font-bold text-blue-600">{formatEmployeeCount(company.employeeCount)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Tag" size={20} className="text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Industry</p>
                      <p className="text-lg font-semibold text-green-600">{company.industry}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          {!isEditing && (
            <div className="border-t border-gray-200 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <ApperIcon name="Calendar" size={14} className="mr-1" />
                  Created: {formatDate(company.createdAt)}
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Clock" size={14} className="mr-1" />
                  Updated: {formatDate(company.updatedAt)}
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Company"
        message={`Are you sure you want to delete ${company.name}? This action cannot be undone.`}
        confirmText="Delete Company"
        cancelText="Cancel"
        type="danger"
        loading={loading}
      />
    </>
  );
};

export default CompanyModal;