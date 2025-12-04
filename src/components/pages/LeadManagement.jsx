import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllLeads, createLead, updateLead, deleteLead, searchLeads } from '@/services/api/leadService';
import { companyService } from '@/services/api/companyService';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import Empty from '@/components/ui/Empty';
import Modal from '@/components/atoms/Modal';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import SearchBar from '@/components/molecules/SearchBar';
import SortFilter from '@/components/molecules/SortFilter';
import ConfirmDialog from '@/components/molecules/ConfirmDialog';

const LeadManagement = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(10);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    source: '',
    owner: ''
  });

  // Register handlers with Layout
  const { setPageModalHandlers } = useOutletContext();

  useEffect(() => {
    setPageModalHandlers({
      handleCreateLead: () => handleAddLead()
    });

    return () => setPageModalHandlers({});
  }, [setPageModalHandlers]);

  // Load leads on component mount
  useEffect(() => {
    loadLeads();
  }, []);

  // Search functionality
  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllLeads();
      setLeads(data);
    } catch (err) {
      setError('Failed to load leads. Please try again.');
      console.error('Load leads error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadLeads();
      return;
    }

    try {
      setLoading(true);
      const results = await searchLeads(searchQuery);
      setLeads(results);
      setCurrentPage(1);
    } catch (err) {
      console.error('Search error:', err);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = () => {
    setEditingLead(null);
    setIsFormModalOpen(true);
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setIsFormModalOpen(true);
  };

  const handleDeleteLead = (lead) => {
    setDeleteConfirm(lead);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await deleteLead(deleteConfirm.Id);
      setLeads(prev => prev.filter(l => l.Id !== deleteConfirm.Id));
      toast.success('Lead deleted successfully');
      setDeleteConfirm(null);
    } catch (error) {
      toast.error('Failed to delete lead');
      console.error('Delete lead error:', error);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      
      if (editingLead) {
        const updated = await updateLead(editingLead.Id, formData);
        setLeads(prev => prev.map(l => l.Id === editingLead.Id ? updated : l));
        toast.success('Lead updated successfully');
      } else {
        const newLead = await createLead(formData);
        setLeads(prev => [newLead, ...prev]);
        toast.success('Lead created successfully');
      }
      
      setIsFormModalOpen(false);
      setEditingLead(null);
    } catch (error) {
      toast.error(editingLead ? 'Failed to update lead' : 'Failed to create lead');
      console.error('Form submit error:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Apply sorting and filtering
  const filteredAndSortedLeads = leads
    .filter(lead => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const fieldMap = {
          status: 'leadStatus',
          priority: 'priority',
          source: 'leadSource',
          owner: 'owner'
        };
        return lead[fieldMap[key]]?.toLowerCase() === value.toLowerCase();
      });
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedLeads.length / leadsPerPage);
  const startIndex = (currentPage - 1) * leadsPerPage;
  const endIndex = startIndex + leadsPerPage;
  const currentLeads = filteredAndSortedLeads.slice(startIndex, endIndex);

  // Get unique values for filters
  const getUniqueValues = (field) => {
    const fieldMap = {
      status: 'leadStatus',
      priority: 'priority', 
      source: 'leadSource',
      owner: 'owner'
    };
    return [...new Set(leads.map(lead => lead[fieldMap[field]]).filter(Boolean))];
  };

  if (loading && leads.length === 0) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView title="Error Loading Leads" message={error} onRetry={loadLeads} />;
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search leads..."
            />
          </div>
          
          <div className="flex gap-2">
            <SortFilter
              sortBy={sortBy}
              onSortChange={handleSortChange}
              className="min-w-[120px]"
            />
            <Button onClick={handleAddLead} icon="Plus">
              Add Lead
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Status</option>
            {getUniqueValues('status').map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Priority</option>
            {getUniqueValues('priority').map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>

          <select
            value={filters.source}
            onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Sources</option>
            {getUniqueValues('source').map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>

          <select
            value={filters.owner}
            onChange={(e) => setFilters(prev => ({ ...prev, owner: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Owners</option>
            {getUniqueValues('owner').map(owner => (
              <option key={owner} value={owner}>{owner}</option>
            ))}
          </select>

          {Object.values(filters).some(v => v) && (
            <Button
              variant="secondary"
              onClick={() => setFilters({ status: '', priority: '', source: '', owner: '' })}
              className="text-xs"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {currentLeads.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <Empty
              title="No leads found"
              message="Start by adding your first lead or adjust your search filters."
              actionLabel="Add Lead"
              onAction={handleAddLead}
            />
          </div>
        ) : (
          <div className="h-full flex flex-col">
            {/* Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSortChange('leadName')}>
                      <div className="flex items-center space-x-1">
                        <span>Name</span>
                        <ApperIcon name="ChevronUpDown" size={12} />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSortChange('company')}>
                      <div className="flex items-center space-x-1">
                        <span>Company</span>
                        <ApperIcon name="ChevronUpDown" size={12} />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSortChange('leadStatus')}>
                      <div className="flex items-center space-x-1">
                        <span>Status</span>
                        <ApperIcon name="ChevronUpDown" size={12} />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSortChange('priority')}>
                      <div className="flex items-center space-x-1">
                        <span>Priority</span>
                        <ApperIcon name="ChevronUpDown" size={12} />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSortChange('owner')}>
                      <div className="flex items-center space-x-1">
                        <span>Owner</span>
                        <ApperIcon name="ChevronUpDown" size={12} />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentLeads.map((lead) => (
                    <tr key={lead.Id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedLead(lead)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{lead.leadName}</div>
                        <div className="text-sm text-gray-500">{lead.leadSource}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.email}</div>
                        <div className="text-sm text-gray-500">{lead.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          lead.leadStatus === 'New' ? 'bg-blue-100 text-blue-800' :
                          lead.leadStatus === 'Qualified' ? 'bg-green-100 text-green-800' :
                          lead.leadStatus === 'Opportunity' ? 'bg-purple-100 text-purple-800' :
                          lead.leadStatus === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {lead.leadStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          lead.priority === 'High' ? 'bg-red-100 text-red-800' :
                          lead.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {lead.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.owner}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditLead(lead);
                            }}
                            icon="Edit2"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLead(lead);
                            }}
                            icon="Trash2"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <Button
                    variant="secondary"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(endIndex, filteredAndSortedLeads.length)}</span> of{' '}
                      <span className="font-medium">{filteredAndSortedLeads.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <Button
                        variant="secondary"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md"
                      >
                        <ApperIcon name="ChevronLeft" size={20} />
                      </Button>
                      {[...Array(totalPages)].map((_, i) => (
                        <Button
                          key={i}
                          variant={currentPage === i + 1 ? "primary" : "secondary"}
                          onClick={() => setCurrentPage(i + 1)}
                          className="relative inline-flex items-center px-4 py-2 text-sm"
                        >
                          {i + 1}
                        </Button>
                      ))}
                      <Button
                        variant="secondary"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md"
                      >
                        <ApperIcon name="ChevronRight" size={20} />
                      </Button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lead Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingLead(null);
        }}
        title={editingLead ? 'Edit Lead' : 'Add Lead'}
        size="lg"
      >
        <LeadForm
          initialData={editingLead}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormModalOpen(false);
            setEditingLead(null);
          }}
          loading={formLoading}
        />
      </Modal>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <Modal
          isOpen={!!selectedLead}
          onClose={() => setSelectedLead(null)}
          title="Lead Details"
          size="lg"
        >
          <LeadDetail
            lead={selectedLead}
            onEdit={() => {
              setEditingLead(selectedLead);
              setSelectedLead(null);
              setIsFormModalOpen(true);
            }}
            onDelete={() => {
              setDeleteConfirm(selectedLead);
              setSelectedLead(null);
            }}
          />
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete "${deleteConfirm?.leadName}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
};

// Lead Detail Component
const LeadDetail = ({ lead, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{lead.leadName}</h3>
          <p className="text-gray-600">{lead.company}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={onEdit} icon="Edit2">
            Edit
          </Button>
          <Button variant="danger" onClick={onDelete} icon="Trash2">
            Delete
          </Button>
        </div>
      </div>

      {/* Status and Priority */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
            lead.leadStatus === 'New' ? 'bg-blue-100 text-blue-800' :
            lead.leadStatus === 'Qualified' ? 'bg-green-100 text-green-800' :
            lead.leadStatus === 'Opportunity' ? 'bg-purple-100 text-purple-800' :
            lead.leadStatus === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {lead.leadStatus}
          </span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
            lead.priority === 'High' ? 'bg-red-100 text-red-800' :
            lead.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {lead.priority}
          </span>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <p className="text-gray-900 flex items-center">
            <ApperIcon name="Mail" size={16} className="mr-2 text-gray-400" />
            {lead.email}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <p className="text-gray-900 flex items-center">
            <ApperIcon name="Phone" size={16} className="mr-2 text-gray-400" />
            {lead.phone}
          </p>
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
          <p className="text-gray-900">{lead.leadSource}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
          <p className="text-gray-900">{lead.owner}</p>
        </div>
      </div>

      {/* Notes */}
      {lead.notes && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-900 whitespace-pre-wrap">{lead.notes}</p>
          </div>
        </div>
      )}

      {/* Timestamps */}
      <div className="border-t border-gray-200 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
          <div>
            <span className="font-medium">Created:</span> {formatDate(lead.createdAt)}
          </div>
          <div>
            <span className="font-medium">Updated:</span> {formatDate(lead.updatedAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Lead Form Component
const CompanyLookup = ({ value, onChange, error }) => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const allCompanies = await companyService.getAll();
      setCompanies(allCompanies);
    } catch (error) {
      console.error('Failed to load companies:', error);
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCompany = companies.find(c => c.Id === value);

  return (
    <div className="relative">
      <div 
        className={`w-full px-3 py-2 border rounded-lg bg-white cursor-pointer flex items-center justify-between ${
          error ? 'border-red-300' : 'border-gray-300 hover:border-blue-400'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedCompany ? 'text-gray-900' : 'text-gray-500'}>
          {selectedCompany ? selectedCompany.Name : 'Select a company...'}
        </span>
        <ApperIcon name={isOpen ? "ChevronUp" : "ChevronDown"} size={16} className="text-gray-400" />
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto max-h-48">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading companies...</div>
            ) : filteredCompanies.length > 0 ? (
              filteredCompanies.map(company => (
                <div
                  key={company.Id}
                  className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => {
                    onChange(company.Id);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  <div className="font-medium text-gray-900">{company.Name}</div>
                  {company.Industry && (
                    <div className="text-sm text-gray-500">{company.Industry}</div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? 'No companies found' : 'No companies available'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const LeadForm = ({ initialData = null, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    leadName: "",
    email: "",
    phone: "",
    leadSource: "Website",
    leadStatus: "New",
    company: null,
    owner: "",
    priority: "Medium",
    notes: ""
  });

  const [errors, setErrors] = useState({});

useEffect(() => {
    if (initialData) {
      setFormData({
        leadName: initialData.leadName || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        leadSource: initialData.leadSource || "Website",
        leadStatus: initialData.leadStatus || "New",
        company: initialData.companyId || null,
        owner: initialData.owner || "",
        priority: initialData.priority || "Medium",
        notes: initialData.notes || ""
      });
    }
  }, [initialData]);

const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.leadName.trim()) {
      newErrors.leadName = "Lead name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

if (!formData.company) {
      newErrors.company = "Company is required";
    }

    if (!formData.owner.trim()) {
      newErrors.owner = "Owner is required";
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

  const leadSourceOptions = [
    "Website", "Referral", "Cold Call", "LinkedIn", "Trade Show", 
    "Google Ads", "Webinar", "Partner", "Email Campaign", "Social Media"
  ];

  const leadStatusOptions = [
    "New", "Contacted", "Qualified", "Opportunity", "Nurturing"
  ];

  const priorityOptions = ["Low", "Medium", "High"];

  const ownerOptions = [
    "Sarah Johnson", "Mike Chen", "Lisa Rodriguez", "David Park"
  ];

  return (
<form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lead Name *
          </label>
          <Input
            value={formData.leadName}
            onChange={(e) => handleChange("leadName", e.target.value)}
            placeholder="Enter lead name"
            error={errors.leadName}
          />
          {errors.leadName && (
            <p className="text-red-500 text-sm mt-1">{errors.leadName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Enter email address"
            error={errors.email}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="(555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company *
          </label>
          <CompanyLookup
            value={formData.company}
            onChange={(value) => handleChange("company", value)}
            error={errors.company}
          />
          {errors.company && (
            <p className="text-red-500 text-sm mt-1">{errors.company}</p>
          )}
        </div>
      </div>

      {/* Lead Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lead Source
          </label>
          <select
            value={formData.leadSource}
            onChange={(e) => handleChange("leadSource", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {leadSourceOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lead Status
          </label>
          <select
            value={formData.leadStatus}
            onChange={(e) => handleChange("leadStatus", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {leadStatusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {priorityOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Owner *
          </label>
          <select
            value={formData.owner}
            onChange={(e) => handleChange("owner", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select owner</option>
            {ownerOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.owner && (
            <p className="text-red-500 text-sm mt-1">{errors.owner}</p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <Textarea
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Add any additional notes about this lead..."
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
          {initialData ? "Update Lead" : "Add Lead"}
        </Button>
      </div>
    </form>
  );
};

export default LeadManagement;