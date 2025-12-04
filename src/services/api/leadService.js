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
// Lead service functions
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
// Search leads by query
export const searchLeads = async (query) => {
  await new Promise(resolve => setTimeout(resolve, 250));
  
  try {
    const leads = initializeLeads();
    
    if (!query || query.trim() === '') {
      return leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    const searchTerm = query.toLowerCase().trim();
    
    const filteredLeads = leads.filter(lead => {
      const searchableFields = [
        lead.firstName,
        lead.lastName,
        lead.email,
        lead.company,
        lead.status,
        lead.source,
        `${lead.firstName} ${lead.lastName}`.trim()
      ];
      
      return searchableFields.some(field => 
        field && field.toString().toLowerCase().includes(searchTerm)
      );
    });
    
    return filteredLeads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    throw new Error("Failed to search leads");
  }
};

// Additional lead management functions can be added here
// Additional lead management functions can be added here