import React, { useEffect, useMemo, useState } from "react";
import { companyService } from "@/services/api/companyService";
import { toast } from "react-toastify";
import { create, getAll, update } from "@/services/api/dealService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Textarea from "@/components/atoms/Textarea";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import SearchBar from "@/components/molecules/SearchBar";
import CompanyTable from "@/components/molecules/CompanyTable";
import SortFilter from "@/components/molecules/SortFilter";
import CompanyModal from "@/components/molecules/CompanyModal";
import ConfirmDialog from "@/components/molecules/ConfirmDialog";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [industryFilter, setIndustryFilter] = useState('');

  // Fetch companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  // Get unique industries for filter dropdown
const industries = useMemo(() => {
    const uniqueIndustries = [...new Set(companies.map(company => company.industry).filter(Boolean))];
    return uniqueIndustries.sort();
  }, [companies]);

  // Filter and sort companies
  const filteredAndSortedCompanies = useMemo(() => {
let filtered = companies.filter(company => {
      const matchesSearch = searchTerm === '' || 
        company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
const matchesIndustry = industryFilter === '' || company.industry === industryFilter;
      
      return matchesSearch && matchesIndustry;
    });

    // Sort the filtered results
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [companies, searchTerm, industryFilter, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCompany(null);
  };

  const handleCompanyUpdated = (updatedCompany) => {
    // Update the company in the companies list
    setCompanies(prev => prev.map(c => 
      c.Id === updatedCompany.Id ? updatedCompany : c
    ));
    // Update selected company if it's the same one
    setSelectedCompany(updatedCompany);
  };

  const handleCompanyDeleted = (deletedCompany) => {
    // Remove company from the list
    setCompanies(prev => prev.filter(c => c.Id !== deletedCompany.Id));
    // Clear selected company
    setSelectedCompany(null);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorView 
        message={error}
        onRetry={fetchCompanies}
      />
    );
  }

return (
    <div className="h-full flex flex-col">
      {/* Header */}
<div className="flex flex-col space-y-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600 mt-1">
            {filteredAndSortedCompanies.length} of {companies.length} companies
          </p>
        </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ApperIcon name="Search" size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search companies by name, industry, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors bg-white"
            />
          </div>

          {/* Industry Filter */}
          <div className="relative">
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
            >
              <option value="">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ApperIcon name="ChevronDown" size={16} className="text-gray-400" />
            </div>
</div>
          </div>
        </div>
      </div>

      {/* Companies Table */}
        <CompanyTable
          companies={filteredAndSortedCompanies}
          onSort={handleSort}
          sortConfig={sortConfig}
          onCompanySelect={handleCompanySelect}
        />
      </div>

      {/* Company Detail Modal */}
      <CompanyModal
        isOpen={showModal}
        onClose={handleCloseModal}
        company={selectedCompany}
      />
    </div>
  );
};

export { CompanyList };

const CompanyDetails = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Modal state for company details
  const [showCompanyModal, setShowCompanyModal] = useState(false);
// Get the outlet context to register modal handlers
  const outletContext = useOutletContext();
  
  // Load companies on component mount
  useEffect(() => {
    loadCompanies();
  }, []);

// Register modal handlers with Layout
  useEffect(() => {
    if (outletContext?.setPageModalHandlers) {
      outletContext.setPageModalHandlers(prev => ({
        ...prev,
        handleAddCompany: handleAddCompany
      }));
    }
  }, [outletContext]);
  // Filter and sort companies when dependencies change
  useEffect(() => {
    let filtered = [...companies];

    // Apply search filter
    if (searchTerm.trim()) {
const term = searchTerm.toLowerCase();
      filtered = filtered.filter(company => 
        company.name?.toLowerCase().includes(term) ||
        company.industry?.toLowerCase().includes(term) ||
        company.location?.toLowerCase().includes(term) ||
        company.website?.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'name':
          aVal = a.name?.toLowerCase() || '';
          bVal = b.name?.toLowerCase() || '';
          break;
        case 'industry':
          aVal = a.industry?.toLowerCase() || '';
          bVal = b.industry?.toLowerCase() || '';
          break;
case 'employeeCount':
          aVal = parseInt(a.employeeCount || 0) || 0;
          bVal = parseInt(b.employeeCount || 0) || 0;
          break;
        case 'createdAt':
          aVal = new Date(a.createdAt || 0).getTime();
          bVal = new Date(b.createdAt || 0).getTime();
          break;
        default:
          aVal = a.name?.toLowerCase() || '';
          bVal = b.name?.toLowerCase() || '';
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredCompanies(filtered);
  }, [companies, searchTerm, sortBy, sortOrder]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companyService.getAll();
      setCompanies(data);
      if (data.length > 0 && !selectedCompany) {
        setSelectedCompany(data[0]);
      }
    } catch (err) {
      setError('Failed to load companies. Please try again.');
      console.error('Error loading companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompany = () => {
    setEditingCompany(null);
    setShowCompanyForm(true);
  };

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setShowCompanyForm(true);
  };

  const handleDeleteCompany = (company) => {
    setCompanyToDelete(company);
    setShowDeleteDialog(true);
  };

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setShowCompanyModal(true);
  };

  const handleCloseModal = () => {
    setShowCompanyModal(false);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      
      if (editingCompany) {
        const updatedCompany = await companyService.update(editingCompany.Id, formData);
        setCompanies(prev => prev.map(c => c.Id === editingCompany.Id ? updatedCompany : c));
        if (selectedCompany?.Id === editingCompany.Id) {
          setSelectedCompany(updatedCompany);
        }
        toast.success('Company updated successfully');
      } else {
        const newCompany = await companyService.create(formData);
        setCompanies(prev => [newCompany, ...prev]);
        setSelectedCompany(newCompany);
        toast.success('Company created successfully');
      }
      
      setShowCompanyForm(false);
      setEditingCompany(null);
    } catch (err) {
      toast.error(editingCompany ? 'Failed to update company' : 'Failed to create company');
      console.error('Error submitting form:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowCompanyForm(false);
    setEditingCompany(null);
  };

  const confirmDelete = async () => {
    if (!companyToDelete) return;
    
    try {
      setFormLoading(true);
      await companyService.delete(companyToDelete.Id);
      setCompanies(prev => prev.filter(c => c.Id !== companyToDelete.Id));
      
      if (selectedCompany?.Id === companyToDelete.Id) {
        const remainingCompanies = companies.filter(c => c.Id !== companyToDelete.Id);
        setSelectedCompany(remainingCompanies.length > 0 ? remainingCompanies[0] : null);
      }
      
      toast.success('Company deleted successfully');
      setShowDeleteDialog(false);
      setCompanyToDelete(null);
    } catch (err) {
      toast.error('Failed to delete company');
      console.error('Error deleting company:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setCompanyToDelete(null);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorView
        title="Failed to Load Companies"
        message={error}
        onRetry={loadCompanies}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-gray-200 bg-surface">
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
              <p className="text-gray-600 mt-1">
                {filteredCompanies.length} of {companies.length} companies
              </p>
            </div>
            <Button onClick={handleAddCompany} className="bg-primary hover:bg-primary/90 min-h-[44px]">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Company
            </Button>
          </div>
        </div>

        {/* Search and Sort Controls */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <ApperIcon
              name="Search"
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />
            <Input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 min-h-[44px]" 
            />
          </div>
          {/* Sort Controls */}
          <div className="flex space-x-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="name">Sort by Name</option>
              <option value="industry">Sort by Industry</option>
              <option value="employeeCount">Sort by Size</option>
              <option value="createdAt">Sort by Date</option>
            </select>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
              icon={sortOrder === "asc" ? "ArrowUp" : "ArrowDown"}
              className="min-h-[44px] px-3" 
            />
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <div className="flex-1 overflow-hidden bg-surface">
        {filteredCompanies.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <ApperIcon name="Building" size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg mb-2">No companies found</p>
              <p className="text-sm">
                {companies.length === 0 ? "Add your first company to get started" : "Try adjusting your search terms"}
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    Industry
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    Size
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    Contact
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCompanies.map(company => (
                  <tr
                    key={company.Id}
                    onClick={() => handleCompanyClick(company)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <ApperIcon name="Building" size={20} className="text-primary" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {company.name}
                          </div>
                          {company.website && (
                            <div className="text-sm text-gray-500">
                              {company.website}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{company.industry}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <ApperIcon name="MapPin" size={14} className="mr-1 text-gray-400" />
                        {company.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {company.employeeCount 
                          ? company.employeeCount >= 1000 
                            ? `${(company.employeeCount / 1000).toFixed(1)}k employees` 
                            : `${company.employeeCount} employees` 
                          : "Not specified"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {company.email && (
                          <div className="flex items-center">
                            <ApperIcon name="Mail" size={14} className="mr-1 text-gray-400" />
                            {company.email}
                          </div>
                        )}
                        {company.phone && !company.email && (
                          <div className="flex items-center">
                            <ApperIcon name="Phone" size={14} className="mr-1 text-gray-400" />
                            {company.phone}
                          </div>
                        )}
                        {!company.email && !company.phone && (
                          <span className="text-gray-400">Not provided</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Company Details Modal */}
      <CompanyModal
        isOpen={showCompanyModal}
        onClose={handleCloseModal}
        company={selectedCompany}
        onEdit={(updatedCompany) => {
          setCompanies(prev => prev.map(c => 
            c.Id === updatedCompany.Id ? updatedCompany : c
          ));
          setSelectedCompany(updatedCompany);
        }}
        onDelete={(deletedCompany) => {
          setCompanies(prev => prev.filter(c => c.Id !== deletedCompany.Id));
          setSelectedCompany(null);
          setShowCompanyModal(false);
        }}
      />

      {/* Company Form Modal */}
      <Modal
        isOpen={showCompanyForm}
        onClose={handleFormCancel}
        title={editingCompany ? "Edit Company" : "Add New Company"}
        size="lg"
      >
        <CompanyForm
          initialData={editingCompany}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={formLoading}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Company"
        message={`Are you sure you want to delete ${companyToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete Company"
        cancelText="Cancel"
        variant="danger"
        loading={formLoading}
      />
</div>
  );
};

export default CompanyDetails;

// Company Detail View Component (Modified for modal use)
const CompanyDetailView = ({ company, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const formatEmployeeCount = (count) => {
    if (!count) return 'Not specified';
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k employees`;
    }
    return `${count} employees`;
  };

  return (
    <div className="max-h-[70vh] overflow-y-auto">
    <div className="space-y-6">
        {/* Header Actions */}
        <div
            className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
                <div
                    className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ApperIcon name="Building" size={24} className="text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{company.name}</h3>
                    <p className="text-base text-secondary">{company.industry}</p>
                </div>
            </div>
            <div
                className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <Button
                    variant="secondary"
                    size="sm"
                    icon="Edit"
                    onClick={() => onEdit(company)}
                    className="min-h-[44px] justify-center">Edit
                                </Button>
                <Button
                    variant="danger"
                    size="sm"
                    icon="Trash2"
                    onClick={() => onDelete(company)}
                    className="min-h-[44px] justify-center">Delete
                                </Button>
            </div>
        </div>
        {/* Company Information */}
        <div className="space-y-6">
            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Industry</h4>
                    <div className="flex items-center space-x-2">
                        <ApperIcon name="Briefcase" size={16} className="text-gray-400" />
                        <span className="text-gray-900">{company.industry}</span>
                    </div>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Location</h4>
                    <div className="flex items-center space-x-2">
                        <ApperIcon name="MapPin" size={16} className="text-gray-400" />
                        <span className="text-gray-900">{company.location}</span>
                    </div>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Company Size</h4>
                    <div className="flex items-center space-x-2">
                        <ApperIcon name="Users" size={16} className="text-gray-400" />
                        <span className="text-gray-900">{formatEmployeeCount(company.employeeCount)}</span>
                    </div>
                </div>
                {company.website && <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Website</h4>
                    <div className="flex items-center space-x-2">
                        <ApperIcon name="Globe" size={16} className="text-gray-400" />
                        <a
                            href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-accent transition-colors">
                            {company.website}
                        </a>
                    </div>
                </div>}
                {company.phone && <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Phone</h4>
                    <div className="flex items-center space-x-2">
                        <ApperIcon name="Phone" size={16} className="text-gray-400" />
                        <a
                            href={`tel:${company.phone}`}
                            className="text-primary hover:text-accent transition-colors">
                            {company.phone}
                        </a>
                    </div>
                </div>}
                {company.email && <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Email</h4>
                    <div className="flex items-center space-x-2">
                        <ApperIcon name="Mail" size={16} className="text-gray-400" />
                        <a
                            href={`mailto:${company.email}`}
                            className="text-primary hover:text-accent transition-colors">
                            {company.email}
                        </a>
                    </div>
                </div>}
            </div>
            {/* Description */}
            {company.description && <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Description</h4>
                <div className="bg-gray-50 rounded-lg p-3 lg:p-4">
                    <p
                        className="text-sm lg:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {company.description}
                    </p>
                </div>
            </div>}
            {/* Metadata */}
            <div className="pt-4 border-t border-gray-200">
                <div
                    className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4 text-sm text-gray-500">
                    <div>
                        <span className="font-medium">Created:</span> {formatDate(company.createdAt)}
                    </div>
                    <div>
                        <span className="font-medium">Last Updated:</span> {formatDate(company.updatedAt)}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
  );
};

// Company Form Component  
const CompanyForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    industry: initialData?.industry || '',
    location: initialData?.location || '',
    employeeCount: initialData?.employeeCount || '',
    website: initialData?.website || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    description: initialData?.description || ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }

    if (!formData.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.employeeCount && (isNaN(formData.employeeCount) || formData.employeeCount < 0)) {
      newErrors.employeeCount = 'Employee count must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        employeeCount: formData.employeeCount ? parseInt(formData.employeeCount) : null
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name *
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter company name"
            error={errors.name}
            className="min-h-[44px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Industry *
          </label>
          <Input
            type="text"
            value={formData.industry}
            onChange={(e) => handleChange('industry', e.target.value)}
            placeholder="e.g., Technology, Healthcare"
            error={errors.industry}
            className="min-h-[44px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location *
          </label>
          <Input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="e.g., San Francisco, CA"
            error={errors.location}
            className="min-h-[44px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Employee Count
          </label>
          <Input
            type="number"
            value={formData.employeeCount}
            onChange={(e) => handleChange('employeeCount', e.target.value)}
            placeholder="Number of employees"
            error={errors.employeeCount}
            min="0"
            className="min-h-[44px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <Input
            type="text"
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="company.com"
            className="min-h-[44px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="min-h-[44px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="contact@company.com"
            error={errors.email}
            className="min-h-[44px]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Brief description of the company..."
            rows={3}
            className="min-h-[100px]"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="min-h-[44px]"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          className="min-h-[44px]"
        >
          {initialData ? 'Update Company' : 'Create Company'}
        </Button>
      </div>
    </form>
  );
};