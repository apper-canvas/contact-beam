import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { contextualGlobalSearch, globalSearch } from "@/services/api/globalSearchService";
import { createContact, deleteContact, updateContact } from "@/services/api/contactService";
import ApperIcon from "@/components/ApperIcon";
import Pipeline from "@/components/pages/Pipeline";
const Layout = () => {
// App-level state management
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Global search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
const location = useLocation();
  
  // Determine current context based on route
  const getCurrentContext = () => {
    const path = location.pathname;
    if (path === '/' || path === '/contacts') return 'contacts';
    if (path === '/companies') return 'companies';  
    if (path === '/pipeline') return 'deals';
    if (path === '/tasks') return 'tasks';
    return 'all';
  };

  const getSearchPlaceholder = () => {
    const context = getCurrentContext();
    switch (context) {
      case 'contacts':
        return 'Search contacts, companies, deals, and tasks...';
      case 'companies':
        return 'Search companies, contacts, deals, and tasks...';
      case 'deals':
        return 'Search deals, contacts, companies, and tasks...';
      case 'tasks':
        return 'Search tasks, contacts, companies, and deals...';
      default:
        return 'Search across contacts, companies, deals, and tasks...';
    }
  };
  
  // Modal control functions from child pages
  const [pageModalHandlers, setPageModalHandlers] = useState({
    handleAddCompany: null,
    handleCreateTask: null
  });
// Import contextual search function
  // App-level handlers
  const refreshContacts = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  // Global search functionality
const handleSearch = async (query) => {
    setSearchTerm(query);
    
    if (!query.trim()) {
      setSearchResults(null);
      setShowResults(false);
      return;
    }

    setSearchLoading(true);
    setShowResults(true);

try {
      const context = getCurrentContext();
      const results = await contextualGlobalSearch(query, context);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults({ error: 'Search failed. Please try again.' });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleResultClick = (type, item) => {
    setShowResults(false);
    setSearchTerm('');
    setSearchResults(null);

const currentContext = getCurrentContext();
    
    // If clicking on result that matches current context, stay on page
    // Otherwise navigate to appropriate page
    switch (type) {
      case 'contacts':
        if (currentContext !== 'contacts') {
          navigate('/contacts');
        }
        break;
      case 'companies':
        if (currentContext !== 'companies') {
          navigate('/companies');
        }
        break;
      case 'deals':
        if (currentContext !== 'deals') {
          navigate('/pipeline');
        }
        break;
      case 'tasks':
        if (currentContext !== 'tasks') {
          navigate('/tasks');
        }
        break;
      default:
        break;
    }
    
    // Close search results
    setSearchTerm('');
    setShowResults(false);
  };

  const handleSearchFocus = () => {
    if (searchResults && searchTerm.trim()) {
      setShowResults(true);
    }
  };

const handleSearchBlur = (e) => {
    // Delay hiding results to allow clicking on them
    setTimeout(() => {
      // Check if activeElement exists and currentTarget contains it
      const activeElement = document.activeElement;
      if (!activeElement || !e.currentTarget || !e.currentTarget.contains(activeElement)) {
        setShowResults(false);
      }
    }, 200);
  };

  // Debounced search effect
  React.useEffect(() => {
const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, location.pathname]);

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
  };

  const handleAddContact = () => {
    setEditingContact(null);
    setShowContactForm(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setShowContactForm(true);
  };

  const handleDeleteContact = (contact) => {
    setContactToDelete(contact);
    setShowDeleteDialog(true);
  };

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    
    try {
      if (editingContact) {
        const updatedContact = await updateContact(editingContact.id, formData);
        setSelectedContact(updatedContact);
        toast.success("Contact updated successfully!");
      } else {
        const newContact = await createContact(formData);
        setSelectedContact(newContact);
        toast.success("Contact added successfully!");
      }
      
      setShowContactForm(false);
      setEditingContact(null);
      refreshContacts();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowContactForm(false);
    setEditingContact(null);
  };

  const confirmDelete = async () => {
    if (!contactToDelete) return;

    setLoading(true);
    
    try {
      await deleteContact(contactToDelete.id);
      
      if (selectedContact?.id === contactToDelete.id) {
        setSelectedContact(null);
      }
      
      toast.success("Contact deleted successfully!");
      setShowDeleteDialog(false);
      setContactToDelete(null);
      refreshContacts();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setContactToDelete(null);
  };

// Outlet context to share with child routes
  const outletContext = {
    selectedContact,
    showContactForm,
    editingContact,
    showDeleteDialog,
    contactToDelete,
loading,
    refreshTrigger,
    handleContactSelect,
    handleAddContact,
    handleEditContact,
    handleDeleteContact,
    handleFormSubmit,
    handleFormCancel,
    confirmDelete,
    cancelDelete,
    // Modal handlers for pages to register their functions
    setPageModalHandlers,
    // Global search context
searchTerm,
    handleSearch: setSearchTerm,
    currentContext: getCurrentContext()
  };

return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Mobile Menu Button */}
<div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">
          {window.location.pathname === '/' || window.location.pathname === '/contacts' 
            ? 'Contacts'
            : window.location.pathname === '/companies'
            ? 'Companies'
            : window.location.pathname === '/pipeline'
            ? 'Sales Pipeline'
            : window.location.pathname === '/tasks'
            ? 'Tasks'
            : 'Contact Hub'
          }
        </h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Toggle navigation menu"
        >
          <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:block w-full lg:w-64 bg-white shadow-lg border-r border-gray-200 flex-shrink-0 absolute lg:relative z-30 lg:z-auto h-full lg:h-auto`}>
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
<div className="relative z-30 bg-white h-full">
          <div className="h-full flex flex-col">
            {/* Logo Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-lg">
                <ApperIcon name="Users" size={24} className="text-white" />
              </div>
              <div>
<h1 className="text-xl font-bold text-gray-900">Contact Hub</h1>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
<nav className="flex-1 p-4">
            <div className="space-y-2">
              <a
                href="/"
                className={`flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${window.location.pathname === '/' || window.location.pathname === '/contacts' ? 'bg-primary/10 text-primary border-r-2 border-primary' : ''}`}
              >
                <ApperIcon name="Users" size={20} />
                <span className="font-medium">Contacts</span>
              </a>
              <a
                href="/companies"
                className={`flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${window.location.pathname === '/companies' ? 'bg-primary/10 text-primary border-r-2 border-primary' : ''}`}
              >
                <ApperIcon name="Building" size={20} />
                <span className="font-medium">Companies</span>
</a>
              <a
                href="/pipeline"
                className={`flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${window.location.pathname === '/pipeline' ? 'bg-primary/10 text-primary border-r-2 border-primary' : ''}`}
              >
                <ApperIcon name="Workflow" size={20} />
                <span className="font-medium">Pipeline</span>
              </a>
              <a
                href="/tasks"
                className={`flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${window.location.pathname === '/tasks' ? 'bg-primary/10 text-primary border-r-2 border-primary' : ''}`}
              >
                <ApperIcon name="CheckSquare" size={20} />
                <span className="font-medium">Tasks</span>
              </a>
            </div>
</nav>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
<div className="flex-1 flex flex-col min-w-0">
        {/* Top Header with Search, Add Contact, and Profile */}
        <header className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-base font-bold text-gray-900 flex items-center gap-3">
                {location.pathname === '/' || location.pathname === '/contacts' ? (
                  <>
                    <ApperIcon name="Users" size={32} className="text-primary" />
                    Contacts
                  </>
                ) : location.pathname === '/companies' ? (
                  <>
                    <ApperIcon name="Building" size={32} className="text-primary" />
                    Companies
                  </>
                ) : location.pathname === '/pipeline' ? (
                  <>
                    <ApperIcon name="Workflow" size={32} className="text-primary" />
                    Sales Pipeline
                  </>
                ) : location.pathname === '/tasks' ? (
                  <>
                    <ApperIcon name="CheckSquare" size={32} className="text-primary" />
                    Tasks
                  </>
                ) : (
                  <>
                    <ApperIcon name="Users" size={32} className="text-primary" />
                    Contact Hub
                  </>
                )}
              </h1>
            </div>
          </div>
          <div className="flex items-center justify-between">
            {/* Search Bar - Hidden on mobile, shown on desktop */}
<div className="hidden md:flex flex-1 max-w-2xl">
              <div className="relative w-full" onFocus={handleSearchFocus} onBlur={handleSearchBlur}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ApperIcon name="Search" size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={getSearchPlaceholder()}
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors bg-gray-50 hover:bg-white"
                />
                
                {/* Search Results Dropdown */}
{showResults && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    {searchLoading ? (
                      <div className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                          <span className="text-sm text-gray-600">Searching...</span>
                        </div>
                      </div>
                    ) : searchResults?.error ? (
                      <div className="p-4 text-center text-red-600 text-sm">
                        {searchResults.error}
                      </div>
                    ) : searchResults && Object.keys(searchResults).some(key => searchResults[key]?.length > 0) ? (
                      <div className="py-2">
                        {/* Render results in context-aware order */}
                        {(() => {
                          const context = getCurrentContext();
                          const renderEntityResults = (entityType, results, title, iconName, iconColor, bgColor) => {
                            if (!results?.length) return null;
                            
                            const isCurrentContext = context === entityType;
                            
                            return (
                              <div className={`px-4 py-2 ${isCurrentContext ? 'order-first' : ''} ${Object.keys(searchResults).filter(key => searchResults[key]?.length > 0).indexOf(entityType) > 0 ? 'border-t border-gray-100' : ''}`}>
                                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isCurrentContext ? 'text-primary' : 'text-gray-500'}`}>
                                  {title} {isCurrentContext && '(Current Page)'}
                                </h3>
                                {results.map((item) => (
                                  <button
                                    key={`${entityType}-${item.Id}`}
                                    onClick={() => handleResultClick(entityType, item)}
                                    className={`w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md transition-colors ${isCurrentContext ? 'border-l-2 border-primary' : ''}`}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className={`w-8 h-8 ${bgColor} rounded-full flex items-center justify-center`}>
                                        <ApperIcon name={iconName} size={14} className={iconColor} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-900 truncate">
                                          {entityType === 'contacts' ? `${item.firstName} ${item.lastName}` :
                                           entityType === 'companies' ? item.name :
                                           entityType === 'deals' ? item.title :
                                           entityType === 'tasks' ? item.title : ''}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate">
                                          {entityType === 'contacts' ? `${item.email} • ${item.company}` :
                                           entityType === 'companies' ? `${item.industry} • ${item.location}` :
                                           entityType === 'deals' ? `${item.company} • $${item.value?.toLocaleString()}` :
                                           entityType === 'tasks' ? `Due: ${new Date(item.dueDate).toLocaleDateString()} • ${item.status}` : ''}
                                        </div>
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            );
                          };

                          // Define all entity types with their display properties
                          const entities = [
                            { type: 'contacts', results: searchResults.contacts, title: 'Contacts', icon: 'User', iconColor: 'text-blue-600', bgColor: 'bg-blue-100' },
                            { type: 'companies', results: searchResults.companies, title: 'Companies', icon: 'Building2', iconColor: 'text-green-600', bgColor: 'bg-green-100' },
                            { type: 'deals', results: searchResults.deals, title: 'Deals', icon: 'Target', iconColor: 'text-purple-600', bgColor: 'bg-purple-100' },
                            { type: 'tasks', results: searchResults.tasks, title: 'Tasks', icon: 'CheckSquare', iconColor: 'text-orange-600', bgColor: 'bg-orange-100' }
                          ];

                          // Sort entities to show current context first
                          const sortedEntities = entities.sort((a, b) => {
                            if (a.type === context) return -1;
                            if (b.type === context) return 1;
                            return 0;
                          });

                          return sortedEntities.map(entity => 
                            renderEntityResults(entity.type, entity.results, entity.title, entity.icon, entity.iconColor, entity.bgColor)
                          );
                        })()}
                      </div>
                    ) : searchTerm.trim() ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No results found for "{searchTerm}"
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
</div>
            
            {/* User Menu */}
{/* User Menu */}
            <div className="flex items-center space-x-2 lg:space-x-4 lg:ml-6">
{/* Show Add Contact button only on contacts page */}
              {(window.location.pathname === '/' || window.location.pathname === '/contacts') && (
                <button
                  onClick={handleAddContact}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  <ApperIcon name="Plus" size={18} />
                  <span>Add Contact</span>
                </button>
              )}
{/* Show Add Company button only on companies page */}
              {window.location.pathname === '/companies' && (
                <button
                  onClick={() => {
                    if (pageModalHandlers.handleAddCompany) {
                      pageModalHandlers.handleAddCompany();
                    }
                  }}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  <ApperIcon name="Plus" size={18} />
                  <span>Add Company</span>
                </button>
              )}

              {/* Show Add Task button only on tasks page */}
              {window.location.pathname === '/tasks' && (
                <button
                  onClick={() => {
                    if (pageModalHandlers.handleCreateTask) {
                      pageModalHandlers.handleCreateTask();
                    }
                  }}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <ApperIcon name="Plus" size={18} />
                  <span>Add Task</span>
                </button>
              )}

              {/* Show Add Deal button only on pipeline page */}
              {window.location.pathname === '/pipeline' && (
                <button
                  onClick={() => {
                    // TODO: Implement add deal functionality
                    console.log('Add deal clicked');
                  }}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <ApperIcon name="Plus" size={18} />
                  <span>Add Deal</span>
                </button>
              )}
              
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <ApperIcon name="User" size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Profile</span>
              </div>
            </div>
          </div>
</header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet context={outletContext} />
        </main>
      </div>
    </div>
  );
};

export default Layout;