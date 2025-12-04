import leadsData from "@/services/mockData/leads.json";

// Local storage key
const LEADS_STORAGE_KEY = "contact_hub_leads";

// Initialize localStorage with mock data if empty
const initializeLeads = () => {
  const existingLeads = localStorage.getItem(LEADS_STORAGE_KEY);
  if (!existingLeads) {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leadsData));
    return leadsData;
  }
  return JSON.parse(existingLeads);
};

// Get all leads from localStorage
export const getAllLeads = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const leads = initializeLeads();
    return [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    throw new Error("Failed to load leads");
  }
};

// Get lead by ID
export const getLeadById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  try {
    const leads = initializeLeads();
    const lead = leads.find(lead => lead.Id === parseInt(id));
    if (!lead) {
      throw new Error("Lead not found");
    }
    return { ...lead };
  } catch (error) {
    throw new Error("Failed to load lead");
  }
};
// Search leads function defined below
// Create new lead
export const createLead = async (leadData) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  try {
    const leads = initializeLeads();
    const maxId = Math.max(...leads.map(lead => lead.Id), 0);
    const newLead = {
      Id: maxId + 1,
      ...leadData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedLeads = [...leads, newLead];
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updatedLeads));
    
    return { ...newLead };
  } catch (error) {
    throw new Error("Failed to create lead");
  }
};

// Update existing lead
export const updateLead = async (id, leadData) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  try {
    const leads = initializeLeads();
    const leadIndex = leads.findIndex(lead => lead.Id === parseInt(id));
    
    if (leadIndex === -1) {
      throw new Error("Lead not found");
    }
    
    const updatedLead = {
      ...leads[leadIndex],
      ...leadData,
      updatedAt: new Date().toISOString()
    };
    
    const updatedLeads = [...leads];
    updatedLeads[leadIndex] = updatedLead;
    
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updatedLeads));
    
    return { ...updatedLead };
  } catch (error) {
    throw new Error("Failed to update lead");
  }
};

// Delete lead
export const deleteLead = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const leads = initializeLeads();
    const leadExists = leads.find(lead => lead.Id === parseInt(id));
    
    if (!leadExists) {
      throw new Error("Lead not found");
    }
    
    const updatedLeads = leads.filter(lead => lead.Id !== parseInt(id));
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updatedLeads));
    
    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete lead");
  }
};

// Search leads
export const searchLeads = async (query) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  try {
    const leads = initializeLeads();
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) {
      return [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    // Search across all relevant fields
const filteredLeads = leads.filter(lead => 
      lead.leadName.toLowerCase().includes(searchTerm) ||
      lead.email.toLowerCase().includes(searchTerm) ||
      (typeof lead.company === 'string' ? lead.company.toLowerCase().includes(searchTerm) : false) ||
      lead.leadSource.toLowerCase().includes(searchTerm) ||
      lead.leadStatus.toLowerCase().includes(searchTerm) ||
      lead.owner.toLowerCase().includes(searchTerm) ||
      lead.priority.toLowerCase().includes(searchTerm) ||
      (lead.notes && lead.notes.toLowerCase().includes(searchTerm))
    );
    
    return filteredLeads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    throw new Error("Failed to search leads");
  }
};