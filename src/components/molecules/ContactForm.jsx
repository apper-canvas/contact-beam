import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Tag from "@/components/atoms/Tag";
import ApperIcon from "@/components/ApperIcon";
import { getAllTags } from "@/services/api/tagService";

const ContactForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    notes: "",
    tags: []
  });

  const [availableTags, setAvailableTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        company: initialData.company || "",
        position: initialData.position || "",
        notes: initialData.notes || "",
        tags: initialData.tags || []
      });
    }
  }, [initialData]);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await getAllTags();
        setAvailableTags(tags);
      } catch (error) {
        console.error("Failed to load tags:", error);
      }
    };

    loadTags();
  }, []);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const addTag = (tagLabel) => {
    if (!formData.tags.includes(tagLabel)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagLabel]
      }));
    }
    setNewTag("");
  };

  const removeTag = (tagLabel) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagLabel)
    }));
  };

  const handleNewTagKeyPress = (e) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      addTag(newTag.trim().toLowerCase());
    }
  };

  const suggestedTags = availableTags.filter(tag => 
    !formData.tags.includes(tag.label) &&
    tag.label.toLowerCase().includes(newTag.toLowerCase())
  );

return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-2">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <Input
            value={formData.name}
            onChange={handleChange("name")}
            placeholder="Enter full name"
            error={errors.name}
          />
          {errors.name && (
            <p className="text-error text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={handleChange("email")}
            placeholder="Enter email address"
            error={errors.email}
          />
          {errors.email && (
            <p className="text-error text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={handleChange("phone")}
            placeholder="(555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company *
          </label>
          <Input
            value={formData.company}
            onChange={handleChange("company")}
            placeholder="Enter company name"
            error={errors.company}
          />
          {errors.company && (
            <p className="text-error text-sm mt-1">{errors.company}</p>
          )}
        </div>
      </div>

      {/* Position */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Position/Title
        </label>
        <Input
          value={formData.position}
          onChange={handleChange("position")}
          placeholder="Enter job title or position"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        
        {/* Selected Tags */}
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.tags.map((tag, index) => (
              <Tag 
                key={index} 
                label={tag} 
                removable
                onRemove={removeTag}
              />
            ))}
          </div>
        )}

        {/* Tag Input */}
        <div className="relative">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleNewTagKeyPress}
            placeholder="Type to add tags..."
          />
          
          {/* Tag Suggestions */}
          {newTag && suggestedTags.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
              {suggestedTags.slice(0, 6).map((tag, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => addTag(tag.label)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Tag label={tag.label} />
                </button>
              ))}
            </div>
          )}
        </div>
        
        <p className="text-xs text-gray-500 mt-1">
          Press Enter to add a tag, or click from suggestions
        </p>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <Textarea
          value={formData.notes}
          onChange={handleChange("notes")}
          placeholder="Add any additional notes about this contact..."
          rows={4}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          icon={initialData ? "Save" : "Plus"}
        >
          {initialData ? "Update Contact" : "Add Contact"}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;